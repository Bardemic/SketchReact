import React from 'react'
import TldrawCanvas from './TldrawCanvas'
import PreviewWindow from './PreviewWindow'

const CanvasSection = ({ 
  editorRef, 
  isConverting, 
  showPreview, 
  reactPage,
  onConvert,
  onTogglePreview,
}) => {
  return (
    <div className="w-full h-full">
      <TldrawCanvas editorRef={editorRef} />
      
      {/* Convert Button */}
      <button
        onClick={onConvert}
        disabled={isConverting}
        className={`absolute top-4 right-4 px-6 py-2 rounded-lg shadow-lg 
          ${isConverting 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-green-500 hover:bg-green-600'} 
          text-white font-semibold transition-colors`}
      >
        {isConverting ? 'Converting...' : 'Convert Sketch'}
      </button>

      {/* Preview Toggle Button */}
      <button
        onClick={onTogglePreview}
        className="absolute top-4 right-44 px-4 py-2 rounded-lg shadow-lg
          bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors"
      >
        {showPreview ? 'Hide Preview' : 'Show Preview'}
      </button>

      <PreviewWindow 
        showPreview={showPreview} 
        onClose={onTogglePreview}
      >
        {reactPage}
      </PreviewWindow>
    </div>
  )
}

export default CanvasSection 