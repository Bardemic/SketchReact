import React from 'react'

const PreviewWindow = ({ showPreview, onClose, htmlContent }) => {
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
    // Container: Fixed position, size, and styling for the preview window itself
    <div 
      className="fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col"
      style={{ width: `${previewWidth}px`, height: `${previewHeight}px` }}
    >
      {/* Header with Title and Close Button */}
      <div className="flex justify-between items-center p-1 px-2 border-b bg-gray-100 flex-shrink-0" // Reduced padding
           style={{ height: `${headerHeightEstimate}px` }} // Give header explicit height
      >
        <h3 className="text-xs font-semibold text-gray-600">Preview (Scaled)</h3> {/* Smaller text */} 
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-lg font-bold leading-none p-0.5" // Smaller button/padding
          aria-label="Close preview"
          style={{ lineHeight: '1' }} // Ensure button size is minimal
        >
          &times;
        </button>
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