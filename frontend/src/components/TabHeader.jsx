import React from 'react'
import Button from './Button';

const TabHeader = ({ activeTab, onTabChange, onConvert, isConverting }) => {
  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 flex justify-center items-center gap-4 z-40">
      {/* Tab Container */}
      <div className="flex bg-gray-800 rounded-lg p-1 shadow-lg">
        <button 
          className={`px-4 py-2 rounded-md transition-all duration-200 ${
            activeTab === 'canvas' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
          onClick={() => onTabChange('canvas')}
        >
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth={2} />
            </svg>
            Canvas
          </div>
        </button>
        <button 
          className={`px-4 py-2 rounded-md transition-all duration-200 ${
            activeTab === 'test' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
          onClick={() => onTabChange('test')}
        >
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Output
          </div>
        </button>
      </div>

      {/* Generate Button */}
      <button 
        onClick={onConvert}
        disabled={isConverting}
        className={`px-5 py-3 rounded-md shadow-lg transform transition-all duration-200 w-32
          ${isConverting ? 'opacity-90' : 'hover:bg-gradient-to-r hover:from-blue-700 hover:to-purple-700'} 
          flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white`}
      >
        <span className="flex items-center gap-2">
          {isConverting ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate
            </>
          )}
        </span>
      </button>
    </div>
  )
}

export default TabHeader 