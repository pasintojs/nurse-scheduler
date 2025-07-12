import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/24/outline'

const Header = ({ onAddNurse, selectedWeek, onWeekChange }) => {
  const formatWeekRange = (date) => {
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day
    startOfWeek.setDate(diff)
    
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    
    const formatOptions = { month: 'short', day: 'numeric' }
    return `${startOfWeek.toLocaleDateString('en-US', formatOptions)} - ${endOfWeek.toLocaleDateString('en-US', formatOptions)}`
  }

  const changeWeek = (direction) => {
    const newDate = new Date(selectedWeek)
    newDate.setDate(newDate.getDate() + (direction * 7))
    onWeekChange(newDate)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              🏥 Nurse Scheduler
            </h1>
            <div className="hidden sm:block text-sm text-gray-500">
              Manage nursing shifts and schedules
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
              <button
                onClick={() => changeWeek(-1)}
                className="p-1 hover:bg-gray-200 rounded-md transition-colors"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              
              <span className="font-medium text-gray-700 min-w-[140px] text-center">
                {formatWeekRange(selectedWeek)}
              </span>
              
              <button
                onClick={() => changeWeek(1)}
                className="p-1 hover:bg-gray-200 rounded-md transition-colors"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
            
            <button
              onClick={onAddNurse}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Add Nurse</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header