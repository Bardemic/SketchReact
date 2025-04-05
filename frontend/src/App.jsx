import TldrawCanvas from './components/TldrawCanvas'

function App() {
  return (
    <div className="flex flex-col w-full h-screen relative">
      <div className="flex-1 relative w-full h-full">
        <TldrawCanvas />
      </div>
    </div>
  )
}

export default App
