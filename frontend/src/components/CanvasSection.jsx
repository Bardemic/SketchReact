import React, { useState, useRef, useEffect } from 'react'
import TldrawCanvas from './TldrawCanvas'
import PreviewWindow from './PreviewWindow'
import Button from './Button'

const CanvasSection = ({ 
  editorRef, 
  previewContent,
  showPreview, 
  onTogglePreview,
  onRegenerate,
  onChatMessage,
  sketchId
}) => {
  const [isStylePanelOpen, setIsStylePanelOpen] = useState(false);
  const [stylePanelHeight, setStylePanelHeight] = useState(0);

  const buttonTop = isStylePanelOpen ? 64 + stylePanelHeight + 12 : 64;

  return (
    <div className="w-full h-full absolute inset-0">
      <TldrawCanvas 
        editorRef={editorRef} 
        onStylePanelChange={setIsStylePanelOpen}
        onStylePanelHeightChange={setStylePanelHeight}
      />
      
      <div 
        className="absolute right-4 z-[9998] transition-all duration-200"
        style={{
          top: `${buttonTop}px`
        }}
      >
        <div className="relative">
          <Button
            onClick={onTogglePreview}
            variant="secondary"
            className="shadow-md p-2 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transform transition-transform ${showPreview ? 'rotate-180' : ''}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </Button>

          {showPreview && (
            <PreviewWindow 
              showPreview={showPreview} 
              onClose={onTogglePreview}
              htmlContent={previewContent}
              onRegenerate={onRegenerate}
              onChatMessage={onChatMessage}
              sketchId={sketchId}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default CanvasSection 