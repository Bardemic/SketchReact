import { Link } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

function SketchesGrid({ sketches, setSketches, user }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpenId && 
          menuRef.current && 
          !menuRef.current.contains(event.target) &&
          !event.target.closest('button')) {
        setMenuOpenId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpenId]);

  const toggleMenu = (e, sketchId) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpenId(prevId => prevId === sketchId ? null : sketchId);
  };

  const handleRenameClick = (e, sketch) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpenId(null);
    setEditingId(sketch.id);
    setEditName(sketch.name);
  };

  const handleRemoveSketch = async (e, sketchId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm("Are you sure you want to delete this sketch? This action cannot be undone.")) {
      try {
        const { error } = await supabase
          .from('sketches')
          .delete()
          .eq('id', sketchId)
          .eq('user_id', user.id);

        if (error) throw error;

        setSketches(sketches.filter(sketch => sketch.id !== sketchId));
        setMenuOpenId(null);
      } catch (error) {
        console.error('Error removing sketch:', error);
        alert('Failed to remove sketch');
      }
    }
  };

  const handleSaveName = async (e, sketchId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const { error } = await supabase
        .from('sketches')
        .update({ 
          name: editName,
          last_modified: new Date().toISOString()
        })
        .eq('id', sketchId)
        .eq('user_id', user.id);

      if (error) throw error;

      setSketches(sketches.map(sketch => 
        sketch.id === sketchId ? { ...sketch, name: editName } : sketch
      ));
      
      setEditingId(null);
    } catch (error) {
      console.error('Error updating sketch name:', error);
      alert('Failed to update sketch name');
    }
  };

  const handleKeyDown = (e, sketchId) => {
    if (e.key === 'Enter') {
      handleSaveName(e, sketchId);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sketches.map((sketch) => (
        <div key={sketch.id} className="relative">
          <Link
            to={`/sketch/${sketch.id}`}
            className="block bg-gray-800 rounded-xl shadow-lg p-6 hover:bg-gray-700 transition-all duration-300 relative hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-4">
              {editingId === sketch.id ? (
                <form 
                  onSubmit={(e) => handleSaveName(e, sketch.id)} 
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 mr-4"
                >
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, sketch.id)}
                    autoFocus
                    className="bg-gray-700 text-white p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                  />
                </form>
              ) : (
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {sketch.name || `Sketch #${sketch.id}`}
                  </h3>
                </div>
              )}
              <span className="text-sm text-gray-400 font-medium">
                {new Date(sketch.last_modified).toLocaleDateString()}
              </span>
            </div>
            <div className="text-gray-400 text-sm font-medium">
              Last modified: {new Date(sketch.last_modified).toLocaleTimeString()}
            </div>
            
            <div className="absolute bottom-3 right-3">
              <button
                className="text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-full p-1.5 transition-colors duration-200"
                onClick={(e) => toggleMenu(e, sketch.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
              
              {menuOpenId === sketch.id && (
                <div 
                  ref={menuRef}
                  className="absolute bottom-full right-0 mb-2 w-36 bg-gray-700 rounded-lg shadow-xl z-10 py-1 border border-gray-600 backdrop-blur-sm bg-opacity-95"
                >
                  <button 
                    className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-gray-600 first:rounded-t-lg flex items-center gap-2 group"
                    onClick={(e) => handleRenameClick(e, sketch)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70 group-hover:opacity-100" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Rename
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-gray-600 last:rounded-b-lg flex items-center gap-2 group"
                    onClick={(e) => handleRemoveSketch(e, sketch.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70 group-hover:opacity-100" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Remove
                  </button>
                </div>
              )}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default SketchesGrid; 