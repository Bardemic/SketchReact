import React from 'react'

const TabHeader = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-b">
      <button 
        className={`px-4 py-2 ${activeTab === 'canvas' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
        onClick={() => onTabChange('canvas')}
      >
        Canvas
      </button>
      <button 
        className={`px-4 py-2 ${activeTab === 'test' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
        onClick={() => onTabChange('test')}
      >
        Test
      </button>
    </div>
  )
}

export default TabHeader 