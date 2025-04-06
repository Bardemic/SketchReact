import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import TabHeader from './TabHeader'
import CanvasSection from './CanvasSection'
import { useAuth } from '../contexts/AuthContext'
import ChatInterface from './ChatInterface'

function Sketch() {
  const [activeTab, setActiveTab] = useState('canvas')
  const [reactPage, setReactPage] = useState(<div className="text-blue-500 w-full h-full text-2xl">Test 123</div>)
  const [showPreview, setShowPreview] = useState(true)
  const [isConverting, setIsConverting] = useState(false)
  const editorRef = useRef(null)
  const { user } = useAuth()
  const [currentHtml, setCurrentHtml] = useState('')

  const handleConvertSketch = async () => {
    setIsConverting(true)
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

      const data = await response.text()
      setCurrentHtml(data)
      setReactPage(<div dangerouslySetInnerHTML={{__html: data}} />)
      setShowPreview(true)
    } catch (error) {
      console.error('Error converting sketch:', error)
      alert(error.message)
    } finally {
      setIsConverting(false)
    }
  }

  const generatePage = async () => {
    fetch('http://localhost:3000/random', {
      method: 'GET',
    })
    .then(response => response.text())
    .then(data => {
      setCurrentHtml(data)
      setReactPage(<div dangerouslySetInnerHTML={{__html: data}} />)
    })
  }

  useEffect(() => {
    generatePage()
  }, [])

  const handleChatMessage = (newHtml) => {
    setReactPage(<div dangerouslySetInnerHTML={{__html: newHtml}} />)
    setCurrentHtml(newHtml)
  }

  return (
    <div className="flex flex-col h-screen pt-16">
      {/* User profile link */}
      <div className="absolute top-0 right-0 p-4 z-50">
        <Link 
          to="/profile"
          className="text-sm text-gray-300 hover:text-white transition-colors duration-300"
        >
          {user?.email || 'Profile'} ▾
        </Link>
      </div>
      
      <div className="flex-1 relative">
        <div style={{ display: activeTab === 'canvas' ? 'block' : 'none', height: '100%', position: 'relative' }}>
          <CanvasSection
            editorRef={editorRef}
            isConverting={isConverting}
            showPreview={showPreview}
            reactPage={reactPage}
            onConvert={handleConvertSketch}
            onTogglePreview={() => setShowPreview(!showPreview)}
          />
        </div>
        <div 
          className="w-full h-full flex items-center justify-center" 
          style={{ display: activeTab === 'test' ? 'flex' : 'none' }}
        >
          {reactPage}
        </div>
        {activeTab === 'test' && (
          <ChatInterface 
            onSendMessage={handleChatMessage}
            currentHtml={currentHtml}
          />
        )}
      </div>
      <TabHeader 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
    </div>
  )
}

export default Sketch 