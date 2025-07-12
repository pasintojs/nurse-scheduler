import { useState, useEffect } from 'react'
import Header from './components/Header'
import NurseManager from './components/NurseManager'
import ScheduleView from './components/ScheduleView'
import AddNurseModal from './components/AddNurseModal'

function App() {
  const [nurses, setNurses] = useState([])
  const [schedules, setSchedules] = useState([])
  const [showAddNurse, setShowAddNurse] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date())

  useEffect(() => {
    const savedNurses = localStorage.getItem('nurses')
    const savedSchedules = localStorage.getItem('schedules')
    
    if (savedNurses) {
      setNurses(JSON.parse(savedNurses))
    }
    if (savedSchedules) {
      setSchedules(JSON.parse(savedSchedules))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('nurses', JSON.stringify(nurses))
  }, [nurses])

  useEffect(() => {
    localStorage.setItem('schedules', JSON.stringify(schedules))
  }, [schedules])

  const addNurse = (nurse) => {
    const newNurse = {
      id: Date.now().toString(),
      ...nurse,
      createdAt: new Date().toISOString()
    }
    setNurses([...nurses, newNurse])
    setShowAddNurse(false)
  }

  const deleteNurse = (id) => {
    setNurses(nurses.filter(nurse => nurse.id !== id))
    setSchedules(schedules.filter(schedule => schedule.nurseId !== id))
  }

  const updateSchedule = (nurseId, date, shift) => {
    const scheduleKey = `${nurseId}-${date}`
    const existingSchedules = schedules.filter(s => s.id !== scheduleKey)
    
    if (shift) {
      setSchedules([...existingSchedules, {
        id: scheduleKey,
        nurseId,
        date,
        shift
      }])
    } else {
      setSchedules(existingSchedules)
    }
  }

  const generateRandomSchedule = () => {
    if (nurses.length === 0) return

    const monthDates = getMonthDates(selectedMonth)
    const newSchedules = []
    
    // Calculate shifts per nurse for equal distribution
    const totalDays = monthDates.length
    const shiftsPerNurse = Math.floor(totalDays / nurses.length)
    const extraShifts = totalDays % nurses.length
    
    // Create a pool of all dates for each nurse
    const nurseShifts = nurses.map((nurse, index) => ({
      nurseId: nurse.id,
      remainingDays: shiftsPerNurse + (index < extraShifts ? 1 : 0),
      remainingNights: Math.floor(shiftsPerNurse / 2),
      lastWorkedDate: null
    }))
    
    // Shuffle dates for random assignment
    const shuffledDates = [...monthDates].sort(() => Math.random() - 0.5)
    
    shuffledDates.forEach(date => {
      const dateStr = date.toISOString().split('T')[0]
      
      // Find available nurses (not worked yesterday)
      const availableNurses = nurseShifts.filter(ns => {
        if (ns.remainingDays <= 0) return false
        if (!ns.lastWorkedDate) return true
        
        const lastWorked = new Date(ns.lastWorkedDate)
        const daysDiff = Math.abs(date.getTime() - lastWorked.getTime()) / (1000 * 60 * 60 * 24)
        return daysDiff > 1
      })
      
      if (availableNurses.length > 0) {
        // Randomly select from available nurses
        const selectedNurse = availableNurses[Math.floor(Math.random() * availableNurses.length)]
        
        // Determine shift type (day/night) based on remaining quotas
        const shiftType = selectedNurse.remainingNights > 0 && Math.random() < 0.4 ? 'night' : 'day'
        
        newSchedules.push({
          id: `${selectedNurse.nurseId}-${dateStr}`,
          nurseId: selectedNurse.nurseId,
          date: dateStr,
          shift: shiftType
        })
        
        // Update nurse's remaining shifts
        selectedNurse.remainingDays--
        if (shiftType === 'night') selectedNurse.remainingNights--
        selectedNurse.lastWorkedDate = dateStr
      }
    })
    
    // Clear existing schedules for the month and add new ones
    const monthStart = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1)
    const monthEnd = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0)
    
    const filteredSchedules = schedules.filter(s => {
      const scheduleDate = new Date(s.date)
      return scheduleDate < monthStart || scheduleDate > monthEnd
    })
    
    setSchedules([...filteredSchedules, ...newSchedules])
  }
  
  const getMonthDates = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const lastDay = new Date(year, month + 1, 0)
    
    const dates = []
    for (let day = 1; day <= lastDay.getDate(); day++) {
      dates.push(new Date(year, month, day))
    }
    return dates
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onAddNurse={() => setShowAddNurse(true)}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        onGenerateSchedule={generateRandomSchedule}
      />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <NurseManager 
              nurses={nurses}
              onDeleteNurse={deleteNurse}
              onAddNurse={() => setShowAddNurse(true)}
            />
          </div>
          
          <div className="lg:col-span-3">
            <ScheduleView 
              nurses={nurses}
              schedules={schedules}
              selectedMonth={selectedMonth}
              onUpdateSchedule={updateSchedule}
            />
          </div>
        </div>
      </main>

      {showAddNurse && (
        <AddNurseModal 
          onAddNurse={addNurse}
          onClose={() => setShowAddNurse(false)}
        />
      )}
    </div>
  )
}

export default App
