import React from 'react'

const Legend: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Legend</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 border border-gray-300" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Start Node</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-500 border border-gray-300" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Finish Node</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-900 border border-gray-300" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Wall</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-orange-400 border border-gray-300 relative after:content-['⚖'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-xs" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Weighted Node</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-300 border border-gray-300" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Visited Node</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-400 border border-gray-300" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Shortest Path</span>
        </div>
      </div>
    </div>
  )
}

export default Legend
