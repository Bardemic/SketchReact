import React from 'react'

const TabHeader = ({ activeTab, onTabChange }) => {
  return (
    <div className="absolute top-8 left-1/2 right-1/2 flex justify-center items-center">
      <button 
        className={`px-4 py-2 rounded-r-none rounded-l-md ${activeTab === 'canvas' ? 'bg-blue-500 text-white' : 'bg-black hover:bg-blue-700'}`}
        onClick={() => onTabChange('canvas')}
      >
        Canvas
      </button>
      <button 
        className={`px-4 py-2 rounded-r-md rounded-l-none ${activeTab === 'test' ? 'bg-blue-500 text-white' : 'bg-black hover:bg-blue-700'}`}
        onClick={() => onTabChange('test')}
      >
        Test
      </button>
    </div>
  )
}

export default TabHeader 