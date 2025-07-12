import { TrashIcon, UserIcon } from '@heroicons/react/24/outline'

const NurseManager = ({ nurses, onDeleteNurse, onAddNurse }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Nurses</h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
            {nurses.length}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        {nurses.length === 0 ? (
          <div className="text-center py-8">
            <UserIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No nurses added yet</p>
            <button
              onClick={onAddNurse}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first nurse
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {nurses.map((nurse) => (
              <div key={nurse.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {nurse.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{nurse.name}</div>
                    {nurse.department && (
                      <div className="text-sm text-gray-500">{nurse.department}</div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => onDeleteNurse(nurse.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete nurse"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NurseManager