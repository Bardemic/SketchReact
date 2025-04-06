import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import CanvasSection from './CanvasSection';
import ChatInterface from './ChatInterface';
import TabHeader from './TabHeader';
import CodePreview from './CodePreview';
import { supabase } from '../lib/supabaseClient';
import Button from './Button';

function Sketch() {
  const [activeTab, setActiveTab] = useState('canvas')
  const [iframeContent, setIframeContent] = useState('<!DOCTYPE html><html><head><title>Loading...</title></head><body><h1>Loading preview...</h1></body></html>');
  const defaultContent = '<!DOCTYPE html><html><head><title>Loading...</title></head><body><h1>Loading preview...</h1></body></html>';
  const [showCanvasPreview, setShowCanvasPreview] = useState(false);
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [sketchId, setSketchId] = useState(null);
  const [hasGeneratedOutput, setHasGeneratedOutput] = useState(false);
  const editorRef = useRef(null);
  const { user } = useAuth();
  const iframeRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isNewSketch = location.pathname === '/sketch/new';
  
  useEffect(() => {
    const initializeSketch = async () => {
      try {
        if (isNewSketch) {
          // Check if we're already creating a sketch to prevent duplicates
          if (sessionStorage.getItem('creating_sketch') === 'true') {
            return;
          }
          
          // Set flag to prevent duplicate creation
          sessionStorage.setItem('creating_sketch', 'true');
          
          // Create a new sketch
          const { data, error } = await supabase
            .from('sketches')
            .insert([
              {
                user_id: user.id,
                name: 'Untitled Sketch',
                whiteboard: null,
                page_result: null
              }
            ])
            .select()
            .single();

          if (error) throw error;
          setSketchId(data.id);
          
          // Clear the flag after successful creation
          sessionStorage.removeItem('creating_sketch');
          
          // Update URL to include the new sketch ID without creating a new history entry
          navigate(`/sketch/${data.id}`, { replace: true });
        } else if (id) {
          // Fetch existing sketch
          const { data, error } = await supabase
            .from('sketches')
            .select('*')
            .eq('id', id)
            .single();

          if (error) {
            console.error('Error fetching sketch:', error);
            navigate('/forbidden');
            return;
          }
          
          // Double check if the user is the owner of this sketch
          if (data.user_id !== user.id) {
            console.error('User does not own this sketch');
            navigate('/forbidden');
            return;
          }
          
          setSketchId(data.id);
          
          // If there's existing whiteboard data, load it into the editor
          if (data.whiteboard && editorRef.current) {
            editorRef.current.store.loadSnapshot(data.whiteboard);
          }
          
          // If there's existing page result, load it into the iframe
          if (data.page_result) {
            setIframeContent(data.page_result);
            setHasGeneratedOutput(true);
          }
        }
      } catch (error) {
        console.error('Error initializing sketch:', error);
        // Clear the flag if there was an error to allow future attempts
        if (isNewSketch) {
          sessionStorage.removeItem('creating_sketch');
        }
        navigate('/forbidden');
      }
    };

    if (user) {
      initializeSketch();
    }
  }, [user, id, navigate, isNewSketch]);

  const saveSketchState = async () => {
    if (!sketchId || !user) return;

    try {
      const editor = editorRef.current;
      if (!editor) return;

      const snapshot = editor.store.getSnapshot();
      
      // Only update if there are actual changes to save
      if (JSON.stringify(snapshot) !== JSON.stringify(editor.store.previousSnapshot)) {
        editor.store.previousSnapshot = snapshot;
        
        const { error } = await supabase
          .from('sketches')
          .update({
            whiteboard: snapshot,
            last_modified: new Date().toISOString()
          })
          .eq('id', sketchId)
          .eq('user_id', user.id);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving sketch state:', error);
    }
  };

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

      const htmlDoc = await response.text()
      setIframeContent(htmlDoc)
      setShowCanvasPreview(true);
      setHasGeneratedOutput(true);

      // Update the existing sketch with the new page result
      if (sketchId && user) {
        const { error } = await supabase
          .from('sketches')
          .update({
            page_result: htmlDoc,
            last_modified: new Date().toISOString()
          })
          .eq('id', sketchId)
          .eq('user_id', user.id);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error converting sketch:', error)
      alert(error.message)
    } finally {
      setIsConverting(false)
    }
  }

  // Auto-save the sketch state when the canvas changes
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    // Store initial snapshot
    editor.store.previousSnapshot = editor.store.getSnapshot();

    const handleChange = () => {
      saveSketchState();
    };

    editor.on('change', handleChange);
    return () => {
      editor.off('change', handleChange);
    };
  }, [sketchId, user]);

  const handleChatMessage = (newHtmlDoc) => {
    setIframeContent(newHtmlDoc)
    // Note: Saving to DB is handled within ChatInterface handleSubmit
  }

  // Handler for code updates from CodePreview
  const handleCodeUpdate = async (updatedHtml) => {
    setIframeContent(updatedHtml); // Update the iframe content in the UI

    // Save the updated HTML to the database
    if (sketchId && user) {
      try {
        const { error } = await supabase
          .from('sketches')
          .update({
            page_result: updatedHtml,
            last_modified: new Date().toISOString()
          })
          .eq('id', sketchId)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating sketch from CodePreview:', error);
          throw new Error('Failed to save code changes to database');
        }
      } catch (error) {
        console.error('Error saving updated code:', error);
        alert(`Failed to save code changes: ${error.message}`);
      }
    }
  };

  const handleToggleCanvasPreview = () => {
    // Only allow toggling if output has been generated
    if (hasGeneratedOutput) {
      setShowCanvasPreview(prev => !prev);
    }
  }

  const handleToggleCodePreview = () => {
    setShowCodePreview(prev => !prev);
  }

  const handleBack = () => {
    navigate(-1);
  };

  // Force redirect to canvas tab if trying to view output without having generated it
  useEffect(() => {
    if (activeTab === 'test' && !hasGeneratedOutput) {
      setActiveTab('canvas');
    }
  }, [activeTab, hasGeneratedOutput]);

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav className="bg-gray-900 py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link 
            to="/" 
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          >
            WebSketch
          </Link>
          <div className="flex items-center gap-4">
            <Button
              variant="icon"
              onClick={handleBack}
              className="text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Button>
            <span className="text-gray-300">{user?.email}</span>
            <Button 
              to="/profile" 
              variant="icon"
              className="text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Button>
          </div>
        </div>
      </nav>
      
      <div className="flex-1 flex flex-col">
        <div className="flex-1 relative">
          <div style={{ display: activeTab === 'canvas' ? 'block' : 'none', height: '100%' }}>
            <CanvasSection
              editorRef={editorRef}
              previewContent={iframeContent}
              showPreview={showCanvasPreview}
              onTogglePreview={handleToggleCanvasPreview}
              onRegenerate={handleConvertSketch}
              onChatMessage={handleChatMessage}
              sketchId={sketchId}
              hasGeneratedOutput={hasGeneratedOutput}
            />
          </div>
          
          <div 
            className="w-full h-full relative" 
            style={{ display: activeTab === 'test' ? 'block' : 'none' }}
          >
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={handleToggleCodePreview}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md shadow-lg flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                {showCodePreview ? 'Hide Code' : 'View Code'}
              </button>
            </div>
            <div className="w-screen h-full p-4 bg-background">
              <iframe
                ref={iframeRef}
                id="preview-iframe"
                srcDoc={iframeContent}
                title="Website Preview"
                className="w-full h-full max-h-screen h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>
            <CodePreview
              showCodePreview={showCodePreview}
              onClose={handleToggleCodePreview}
              htmlContent={iframeContent}
              onUpdateCode={handleCodeUpdate}
            />
          </div>
        </div>

        {activeTab === 'test' && (
          <ChatInterface 
            onSendMessage={handleChatMessage}
            iframeId="preview-iframe"
            sketchId={sketchId}
          />
        )}

        <TabHeader 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          onConvert={handleConvertSketch}
          isConverting={isConverting}
          hasOutput={hasGeneratedOutput}
        />
      </div>
    </div>
  );
}

export default Sketch; 