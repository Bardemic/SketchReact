import React from 'react'
import TldrawCanvas from './TldrawCanvas'
import PreviewWindow from './PreviewWindow'

const CanvasSection = ({ 
  editorRef, 
  isConverting, 
  previewContent,
  showPreview, 
  onConvert,
  onTogglePreview,
}) => {
  return (
    <div className="w-full h-full absolute inset-0">
      <TldrawCanvas editorRef={editorRef} />
      <div className="absolute flex gap-2 w-screen top-12 right-0 p-4 z-50">
          <button
            onClick={onConvert}
            disabled={isConverting}
            className={`px-6 py-2 rounded-lg shadow-lg z-50
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
            className="px-4 py-2 rounded-lg shadow-lg z-50
              bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors"
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
      </div>

      <PreviewWindow 
        showPreview={showPreview} 
        onClose={onTogglePreview}
        htmlContent={previewContent}
      >
        {/* Remove children prop if PreviewWindow handles content internally */}
        {/* {reactPage} */}
      </PreviewWindow>
    </div>
  )
}

export default CanvasSection 