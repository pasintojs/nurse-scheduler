import { useState } from 'react'

const SHIFTS = {
  day: { name: 'Day', color: 'bg-blue-100 text-blue-800', time: '7AM-7PM' },
  night: { name: 'Night', color: 'bg-purple-100 text-purple-800', time: '7PM-7AM' },
  off: { name: 'Off', color: 'bg-gray-100 text-gray-800', time: 'Off Day' }
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const ScheduleView = ({ nurses, schedules, selectedWeek, onUpdateSchedule }) => {
  const [selectedCell, setSelectedCell] = useState(null)
  
  const getWeekDates = (date) => {
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day
    startOfWeek.setDate(diff)
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      return date
    })
  }

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]
  }

  const getScheduleForNurseAndDate = (nurseId, date) => {
    const dateStr = formatDate(date)
    const schedule = schedules.find(s => s.nurseId === nurseId && s.date === dateStr)
    return schedule?.shift || null
  }

  const handleCellClick = (nurseId, date) => {
    const dateStr = formatDate(date)
    const currentShift = getScheduleForNurseAndDate(nurseId, date)
    setSelectedCell({ nurseId, date: dateStr, currentShift })
  }

  const handleShiftSelect = (shift) => {
    if (selectedCell) {
      const newShift = shift === selectedCell.currentShift ? null : shift
      onUpdateSchedule(selectedCell.nurseId, selectedCell.date, newShift)
      setSelectedCell(null)
    }
  }

  const weekDates = getWeekDates(selectedWeek)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Weekly Schedule</h2>
        <p className="text-sm text-gray-500 mt-1">Click on cells to assign shifts</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                Nurse
              </th>
              {weekDates.map((date, index) => (
                <th key={index} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  <div>{DAYS[index]}</div>
                  <div className="font-normal text-gray-400">
                    {date.getMonth() + 1}/{date.getDate()}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {nurses.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  Add nurses to start scheduling
                </td>
              </tr>
            ) : (
              nurses.map((nurse) => (
                <tr key={nurse.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap sticky left-0 bg-white z-10 border-r border-gray-200">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-medium text-sm">
                          {nurse.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{nurse.name}</div>
                        {nurse.department && (
                          <div className="text-xs text-gray-500">{nurse.department}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  {weekDates.map((date, dateIndex) => {
                    const shift = getScheduleForNurseAndDate(nurse.id, date)
                    const isSelected = selectedCell?.nurseId === nurse.id && selectedCell?.date === formatDate(date)
                    
                    return (
                      <td 
                        key={dateIndex} 
                        className="px-2 py-3 text-center cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleCellClick(nurse.id, date)}
                      >
                        {shift ? (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${SHIFTS[shift].color} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
                            {SHIFTS[shift].name}
                          </span>
                        ) : (
                          <div className={`h-6 w-full rounded border-2 border-dashed border-gray-300 ${isSelected ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'}`} />
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedCell && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedCell(null)}>
          <div className="bg-white rounded-lg p-6 m-4 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign Shift</h3>
            <div className="space-y-2">
              {Object.entries(SHIFTS).map(([key, shift]) => (
                <button
                  key={key}
                  onClick={() => handleShiftSelect(key)}
                  className={`w-full p-3 rounded-lg border text-left hover:bg-gray-50 transition-colors ${
                    selectedCell.currentShift === key 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{shift.name}</div>
                      <div className="text-sm text-gray-500">{shift.time}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${shift.color}`}>
                      {shift.name}
                    </span>
                  </div>
                </button>
              ))}
              <button
                onClick={() => handleShiftSelect(null)}
                className="w-full p-3 rounded-lg border border-gray-200 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-600">Clear Assignment</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ScheduleView