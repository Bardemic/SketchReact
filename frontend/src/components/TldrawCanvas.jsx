import { Tldraw } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useCallback } from 'react'

const TldrawCanvas = () => {
  const handleMount = useCallback((editor) => {
    //customize editor here at some point?
    console.log('Tldraw editor mounted', editor)
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Tldraw 
        onMount={handleMount}
        autoFocus
        showMenu={true}
        showPages={true}
        showStyles={true}
        showUI={true}
        showToolbar={true}
      />
    </div>
  )
}

export default TldrawCanvas 