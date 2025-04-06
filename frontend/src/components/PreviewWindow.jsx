import React, { useState } from 'react'
import Button from './Button'; // Import Button component
import ChatInterface from './ChatInterface';

<<<<<<< Updated upstream
const PreviewWindow = ({ showPreview, onClose, htmlContent, onRegenerate, onChatMessage, sketchId }) => {
=======
const PreviewWindow = ({ showPreview, onClose, htmlContent, onRegenerate }) => {
>>>>>>> Stashed changes
  const [isChatVisible, setIsChatVisible] = useState(false); // State for chat visibility

  if (!showPreview) {
    return null
  }

  // Define desired visible size (approx 1/4 of 1920x1080)
  const previewWidth = 480; 
  const previewHeight = 270;
  const scaleFactor = 0.25; // Keep content 4x scaled down 

  // Estimate header height (adjust if styling changes)
  const headerHeightEstimate = 28; // Slightly smaller header for smaller window

  return (
    <div
      className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col"
      style={{ 
        width: `${previewWidth}px`, 
        height: `${previewHeight}px`,
      }}
    >
      {/* Conditionally render ChatInterface */}
      {isChatVisible && <ChatInterface />} 
      {/* Header with Title, Toggle Button, and Close Button */}
      <div className="flex justify-between items-center p-1 px-2 border-b bg-gray-100 flex-shrink-0" // Reduced padding
           style={{ height: `${headerHeightEstimate}px` }} // Give header explicit height
      >
<<<<<<< Updated upstream
        {/* Conditionally render ChatInterface and pass htmlContent and onSendMessage */}
        {isChatVisible && (
          <ChatInterface 
            iframeContent={htmlContent} 
            onSendMessage={onChatMessage}
            sketchId={sketchId}
          />
        )} 
        {/* Header with Title, Toggle Button, and Close Button */}
        <div className="flex justify-between items-center p-1 px-2 border-b bg-gray-100 flex-shrink-0" // Reduced padding
             style={{ height: `${headerHeightEstimate}px` }} // Give header explicit height
        >
          <div className="flex items-center space-x-2"> {/* Group title and toggle button */}
              <h3 className="text-xs font-semibold text-gray-600">Preview (Scaled)</h3> {/* Smaller text */}
              {/* Pencil Icon Button to toggle ChatInterface */}
              <button 
                onClick={() => setIsChatVisible(!isChatVisible)}
                className="p-0.5 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Toggle chat"
                title="Toggle Chat" // Add tooltip
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V12h2.293l6.5-6.5z"/>
                </svg>
              </button>
              {/* Reload Icon Button to regenerate */}
              <button
                onClick={onRegenerate}
                className="p-0.5 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Regenerate preview"
                title="Regenerate Preview"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                </svg>
              </button>
          </div>
          <Button
            variant="icon" // Use icon variant
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg font-bold p-0.5" // Keep specific styles, adjust padding
            aria-label="Close preview"
            style={{ lineHeight: '1' }} // Keep inline style if necessary
          >
            &times;
          </Button>
=======
        <div className="flex items-center space-x-2"> {/* Group title and toggle button */}
            <h3 className="text-xs font-semibold text-gray-600">Preview (Scaled)</h3> {/* Smaller text */}
            {/* Pencil Icon Button to toggle ChatInterface */}
            <button 
              onClick={() => setIsChatVisible(!isChatVisible)}
              className="p-0.5 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Toggle chat"
              title="Toggle Chat" // Add tooltip
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V12h2.293l6.5-6.5z"/>
              </svg>
            </button>
            {/* Reload Icon Button to regenerate */}
            <button
              onClick={onRegenerate}
              className="p-0.5 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Regenerate preview"
              title="Regenerate Preview"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
              </svg>
            </button>
>>>>>>> Stashed changes
        </div>
        <Button
          variant="icon" // Use icon variant
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-lg font-bold p-0.5" // Keep specific styles, adjust padding
          aria-label="Close preview"
          style={{ lineHeight: '1' }} // Keep inline style if necessary
        >
          &times;
        </Button>
      </div>
      {/* Scaling Container: This div clips the scaled iframe */}
      <div
        className="flex-1 overflow-hidden bg-gray-200" // Added bg for contrast
        style={{
          width: `${previewWidth}px`,
          height: `${previewHeight - headerHeightEstimate}px` // Use estimated header height
        }}
      >
        {/* Iframe: Set size based on scale factor, then scale down */}
        <iframe
          srcDoc={htmlContent} // Use srcDoc for HTML content
          title="Canvas Preview Scaled"
          style={{
            width: `${previewWidth / scaleFactor}px`,
            height: `${(previewHeight - headerHeightEstimate) / scaleFactor}px`, // Use estimated height
            border: 'none',
            transform: `scale(${scaleFactor})`,
            transformOrigin: 'top left',
            backgroundColor: 'white' // Add background to iframe in case content is transparent
          }}
          sandbox="allow-scripts allow-same-origin allow-forms" // Keep sandbox for security
        />
      </div>
    </div>
  )
}

export default PreviewWindow 