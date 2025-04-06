import React, { useState, useEffect } from 'react'
import Button from './Button';
import Editor from '@monaco-editor/react';

const CodePreview = ({ showCodePreview, onClose, htmlContent, onUpdateCode }) => {
  const [copied, setCopied] = useState(false);
  const [editedContent, setEditedContent] = useState(htmlContent);

  useEffect(() => {
    setEditedContent(htmlContent);
  }, [htmlContent]);

  if (!showCodePreview) {
    return null
  }

  // Define desired visible size (approx 1/4 of 1920x1080)
  const previewWidth = 480; 
  const previewHeight = 270;
  
  // Estimate header height
  const headerHeightEstimate = 28; 

  const handleCopyCode = () => {
    navigator.clipboard.writeText(editedContent)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const handleEditorChange = (value) => {
    setEditedContent(value);
    onUpdateCode(value);
  };

  return (
    // Container: Fixed position, size, and styling for the code preview window
    <div 
      className="fixed bottom-4 right-4 bg-gray-900 rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col"
      style={{ width: `${previewWidth}px`, height: `${previewHeight}px` }}
    >
      {/* Header with Title and Buttons */}
      <div className="flex justify-between items-center p-1 px-2 border-b border-gray-700 bg-gray-800 flex-shrink-0"
           style={{ height: `${headerHeightEstimate}px` }}
      >
        <h3 className="text-xs font-semibold text-gray-300">HTML Code</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={handleCopyCode}
            className="py-0.5 px-2 text-xs"
            aria-label="Copy code"
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button
            variant="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 text-lg font-bold p-0.5"
            aria-label="Close code preview"
            style={{ lineHeight: '1' }}
          >
            &times;
          </Button>
        </div>
      </div>

      {/* Code Container */}
      <div 
        className="flex-1 overflow-hidden bg-gray-900"
        style={{ 
          width: `${previewWidth}px`, 
          height: `${previewHeight - headerHeightEstimate}px`,
        }}
      >
        <Editor
          height="100%" 
          language="html"
          theme="vs-dark"
          value={editedContent}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 12,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 10, bottom: 10 }
          }}
        />
      </div>
    </div>
  )
}

export default CodePreview 