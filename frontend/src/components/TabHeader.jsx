import React from 'react'
import Button from './Button';

const TabHeader = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 flex justify-center items-center z-40">
      <Button 
        variant="secondary"
        className={`px-4 py-2 rounded-r-none rounded-l-md ${activeTab === 'canvas' ? 'bg-blue-500 text-white' : 'bg-black hover:bg-blue-700'}`}
        onClick={() => onTabChange('canvas')}
      >
        Canvas
      </Button>
      <Button 
        variant="secondary"
        className={`px-4 py-2 rounded-r-md rounded-l-none ${activeTab === 'test' ? 'bg-blue-500 text-white' : 'bg-black hover:bg-blue-700'}`}
        onClick={() => onTabChange('test')}
      >
        Test
      </Button>
    </div>
  )
}

export default TabHeader 