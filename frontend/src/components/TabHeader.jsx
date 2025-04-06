import React from 'react'
import Button from './Button';

const TabHeader = ({ activeTab, onTabChange, onConvert, isConverting }) => {
  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 flex justify-center items-center z-40">
      <Button 
        variant="secondary"
        className={`px-4 py-2 rounded-l-md rounded-r-none ${activeTab === 'canvas' ? 'bg-blue-500 text-white' : 'bg-black hover:bg-blue-700'}`}
        onClick={() => onTabChange('canvas')}
      >
        Canvas
      </Button>
      
      <Button 
        onClick={onConvert}
        disabled={isConverting}
        variant="primary"
        className="px-6 py-2 rounded-none border-l border-r border-gray-600 flex items-center"
      >
        <span>{isConverting ? 'Generating...' : 'Generate'}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 ml-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="white" 
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </Button>
      
      <Button 
        variant="secondary"
        className={`px-4 py-2 rounded-r-md rounded-l-none ${activeTab === 'test' ? 'bg-blue-500 text-white' : 'bg-black hover:bg-blue-700'}`}
        onClick={() => onTabChange('test')}
      >
        Output
      </Button>
    </div>
  )
}

export default TabHeader 