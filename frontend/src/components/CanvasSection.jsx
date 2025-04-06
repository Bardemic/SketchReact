import React from 'react'
import TldrawCanvas from './TldrawCanvas'
import PreviewWindow from './PreviewWindow'

const CanvasSection = ({ 
  editorRef, 
  previewContent,
  showPreview, 
  onTogglePreview,
  onRegenerate,
}) => {
  return (
    <div className="w-full h-full absolute inset-0">
      <TldrawCanvas editorRef={editorRef} />
      
      <div className="absolute right-4 bottom-12 z-50">
        <button
          onClick={onTogglePreview}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md shadow-lg flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
      </div>

      <PreviewWindow 
        showPreview={showPreview} 
        onClose={onTogglePreview}
        htmlContent={previewContent}
        onRegenerate={onRegenerate}
      />
    </div>
  )
}

export default CanvasSection 