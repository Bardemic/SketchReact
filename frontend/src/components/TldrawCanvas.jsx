import { Tldraw, DefaultStylePanel, DefaultStylePanelContent, useEditor, useRelevantStyles } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useCallback, useState } from 'react'
import Button from './Button'

const CustomStylePanel = ({ isOpen, onClose }) => {
  const editor = useEditor()
  const styles = useRelevantStyles()

  if (!isOpen) return null

  return (
    <div 
      className="absolute right-4 top-16 bg-white shadow-lg rounded-lg z-[9999]"
      style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}
    >
      <div className="flex justify-between items-center p-2 border-b">
        <h3 className="font-medium">Styles</h3>
      </div>
      <DefaultStylePanel>
        <DefaultStylePanelContent styles={styles} />
      </DefaultStylePanel>
    </div>
  )
}

const TldrawCanvas = ({ editorRef }) => {
  const [isStylePanelOpen, setIsStylePanelOpen] = useState(false)

  const handleMount = useCallback((editor) => {
    if (editorRef) {
      editorRef.current = editor
    }
    console.log('Tldraw editor mounted', editor)
  }, [editorRef])

  const handleStylePanelToggle = useCallback(() => {
    console.log('Button clicked')
    setIsStylePanelOpen(prev => !prev)
  }, [])

  const components = {
    StylePanel: () => (
      <CustomStylePanel 
        isOpen={isStylePanelOpen} 
        onClose={() => setIsStylePanelOpen(false)} 
      />
    ),
    PageMenu: () => null
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <div className="absolute top-4 right-4 z-[9999]">
        <Button
          onClick={handleStylePanelToggle}
          variant="secondary"
          className="shadow-md p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transform transition-transform ${isStylePanelOpen ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </Button>
      </div>
      <Tldraw 
        onMount={handleMount}
        autoFocus
        showMenu={true}
        showPages={false}
        showStyles={false}
        showUI={true}
        showToolbar={true}
        components={components}
      />
    </div>
  )
}

export default TldrawCanvas 