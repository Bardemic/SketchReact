import React from 'react'
import TldrawCanvas from './TldrawCanvas'
import PreviewWindow from './PreviewWindow'
import Button from './Button'

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
          <Button
            onClick={onConvert}
            disabled={isConverting}
            variant="primary"
            className="px-6 py-2 shadow-lg z-50"
          >
            {isConverting ? 'Converting...' : 'Convert Sketch'}
          </Button>
          {/* Preview Toggle Button */}
          <Button
            onClick={onTogglePreview}
            variant="secondary"
            className="px-4 py-2 shadow-lg z-50"
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
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