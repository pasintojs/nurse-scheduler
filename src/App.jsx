import { useState, useEffect } from 'react'
import Header from './components/Header'
import NurseManager from './components/NurseManager'
import ScheduleView from './components/ScheduleView'
import AddNurseModal from './components/AddNurseModal'

function App() {
  const [nurses, setNurses] = useState([])
  const [schedules, setSchedules] = useState([])
  const [showAddNurse, setShowAddNurse] = useState(false)
  const [selectedWeek, setSelectedWeek] = useState(new Date())

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onAddNurse={() => setShowAddNurse(true)}
        selectedWeek={selectedWeek}
        onWeekChange={setSelectedWeek}
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
              selectedWeek={selectedWeek}
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
