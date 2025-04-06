import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useRef } from 'react';
import CanvasSection from './CanvasSection';
import ChatInterface from './ChatInterface';
import TabHeader from './TabHeader';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('canvas')
  const [iframeContent, setIframeContent] = useState('<!DOCTYPE html><html><head><title>Loading...</title></head><body><h1>Loading preview...</h1></body></html>');
  const [showCanvasPreview, setShowCanvasPreview] = useState(false);
  const [isConverting, setIsConverting] = useState(false)
  const editorRef = useRef(null)
  const { user } = useAuth()
  const iframeRef = useRef(null);

  const handleConvertSketch = async () => {
    setIsConverting(true)
    setShowCanvasPreview(false);
    try {
      const editor = editorRef.current
      if (!editor) {
        throw new Error('Editor not initialized')
      }

      const shapeIds = editor.getCurrentPageShapeIds()
      if (shapeIds.size === 0) {
        throw new Error('No shapes on the canvas')
      }

      const { blob } = await editor.toImage([...shapeIds], { 
        format: 'png', 
        background: true,
        scale: 2
      })

      const formData = new FormData()
      const file = new File([blob], 'sketch.png', { type: 'image/png' })
      formData.append('image', file)

      const response = await fetch('http://localhost:3000/generate', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to convert sketch')
      }

      const htmlDoc = await response.text()
      setIframeContent(htmlDoc)
      setShowCanvasPreview(true);
    } catch (error) {
      console.error('Error converting sketch:', error)
      alert(error.message)
    } finally {
      setIsConverting(false)
    }
  }

  const handleChatMessage = (newHtmlDoc) => {
    setIframeContent(newHtmlDoc)
  }

  const handleToggleCanvasPreview = () => {
    setShowCanvasPreview(prev => !prev);
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="absolute top-0 right-0 p-4 z-50 bg-gray-800 w-full h-16 flex justify-end items-center">
        <Link 
          to="/profile"
          className="text-sm text-gray-300 hover:text-white transition-colors duration-300 mr-4"
        >
          {user?.email || 'Profile'} ▾
        </Link>
      </div>
      
      <div className="flex-1 flex flex-col pt-16">
        <div className="flex-1 relative">
          <div style={{ display: activeTab === 'canvas' ? 'block' : 'none', height: '100%' }}>
            <CanvasSection
              editorRef={editorRef}
              isConverting={isConverting}
              previewContent={iframeContent}
              showPreview={showCanvasPreview}
              onTogglePreview={handleToggleCanvasPreview}
              onConvert={handleConvertSketch}
            />
          </div>
          
          <div 
            className="w-full h-full" 
            style={{ display: activeTab === 'test' ? 'block' : 'none' }}
          >
            <iframe
              ref={iframeRef}
              id="preview-iframe"
              srcDoc={iframeContent}
              title="Website Preview"
              className="w-full max-h-screen max-h-screen h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
        </div>

        {activeTab === 'test' && (
          <ChatInterface 
            onSendMessage={handleChatMessage}
            iframeId="preview-iframe"
          />
        )}

        <TabHeader 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      </div>
    </div>
  );
}

export default Dashboard; 