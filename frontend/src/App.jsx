import { useState, useEffect } from 'react'
import TldrawCanvas from './components/TldrawCanvas'

function App() {
  const [activeTab, setActiveTab] = useState('canvas')
  const [reactPage, setReactPage] = useState(<div className="text-blue-500 w-full h-full text-2xl">Test 123</div>)
  const [showPreview, setShowPreview] = useState(true)
  const [isConverting, setIsConverting] = useState(false)

  const handleConvertSketch = async () => {
    setIsConverting(true)
    try {
      // TODO: Implement the actual conversion logic here
      // 1. Get the canvas data
      // 2. Send it to your backend
      // 3. Update the reactPage with the result
      setShowPreview(true)
    } catch (error) {
      console.error('Error converting sketch:', error)
    } finally {
      setIsConverting(false)
    }
  }
  async function generatePage() {
    /*
    fetch('http://localhost:3000/generate', {
      method: 'POST',
      body: JSON.stringify({ image: 'image.png' })
    })
    .then(response => response.json())
    .then(data => setReactPage(<div dangerouslySetInnerHTML={{__html: data}} />))*/
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
      <div className="flex border-b">
        <button 
          className={`px-4 py-2 ${activeTab === 'canvas' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
          onClick={() => setActiveTab('canvas')}
        >
          Canvas
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'test' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
          onClick={() => setActiveTab('test')}
        >
          Test
        </button>
      </div>
      
      <div className="flex-1 relative">
        {activeTab === 'canvas' ? (
          <div className="w-full h-full">
            <TldrawCanvas />
            
            {/* Convert Button */}
            <button
              onClick={handleConvertSketch}
              disabled={isConverting}
              className={`absolute top-4 right-4 px-6 py-2 rounded-lg shadow-lg 
                ${isConverting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600'} 
                text-white font-semibold transition-colors`}
            >
              {isConverting ? 'Converting...' : 'Convert Sketch'}
            </button>

            {/* Preview Toggle Button */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="absolute top-4 right-44 px-4 py-2 rounded-lg shadow-lg
                bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>

            {/* Preview Window */}
            {showPreview && (
              <div className="absolute bottom-10 right-10 bg-white rounded-lg shadow-2xl overflow-hidden">
                <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
                  <span className="font-semibold">Preview</span>
                  <button 
                    onClick={() => setShowPreview(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-4 w-80 aspect-video bg-white">
                  {reactPage}
                </div>
              </div>
            )}
          </div>
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
