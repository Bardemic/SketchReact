import { useState, useEffect, useRef } from 'react'
import TabHeader from './components/TabHeader'
import CanvasSection from './components/CanvasSection'

function App() {
  const [activeTab, setActiveTab] = useState('canvas')
  const [reactPage, setReactPage] = useState(<div className="text-blue-500 w-full h-full text-2xl">Test 123</div>)
  const [showPreview, setShowPreview] = useState(true)
  const [isConverting, setIsConverting] = useState(false)
  const editorRef = useRef(null)

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
    .then(data => setReactPage(<div dangerouslySetInnerHTML={{__html: data}} />))
  }

  useEffect(() => {
    generatePage()
  }, [])

  return (
    <div className="flex flex-col w-screen h-screen">
      <TabHeader 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      <div className="flex-1 relative">
        {activeTab === 'canvas' ? (
          <CanvasSection
            editorRef={editorRef}
            isConverting={isConverting}
            showPreview={showPreview}
            reactPage={reactPage}
            onConvert={handleConvertSketch}
            onTogglePreview={() => setShowPreview(!showPreview)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {reactPage}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
