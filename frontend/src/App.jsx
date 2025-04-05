import { useState } from 'react'
import TldrawCanvas from './components/TldrawCanvas'

function App() {
  const [activeTab, setActiveTab] = useState('canvas')
  const [reactPage, setReactPage] = useState(<div className="text-blue-500 w-full h-full text-2xl">Test 123</div>)


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
      
      <div className="flex-1">
        {activeTab === 'canvas' ? (
          <div className="w-full h-full">
            <TldrawCanvas />
            <div className="absolute bg-black bottom-10 right-10 p-1 w-40 aspect-video">
              <div className="w-full h-full scale-50 bg-white">
              {reactPage}
              </div>
            </div>
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
