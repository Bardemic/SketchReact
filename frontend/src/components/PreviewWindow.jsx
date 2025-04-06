import React from 'react'

const PreviewWindow = ({ showPreview, onClose, children }) => {
  if (!showPreview) return null

  return (
    <div className="absolute bottom-10 right-10 bg-white rounded-lg shadow-2xl overflow-hidden z-50">
      <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
        <span className="font-semibold">Preview</span>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
      <div className="p-4 w-80 aspect-video bg-white">
        {children}
      </div>
    </div>
  )
}

export default PreviewWindow 