import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import Button from './Button';

function Dashboard() {
  const { user } = useAuth();
  const [sketches, setSketches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchSketches = async () => {
      try {
        const { data, error } = await supabase
          .from('sketches')
          .select('*')
          .order('last_modified', { ascending: false });

        if (error) throw error;
        setSketches(data || []);
      } catch (error) {
        console.error('Error fetching sketches:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSketches();
    }
  }, [user]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

        // Remove the sketch from the local state
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

      // Update the sketch name in the local state
      setSketches(sketches.map(sketch => 
        sketch.id === sketchId ? { ...sketch, name: editName } : sketch
      ));
      
      // Exit edit mode
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-900 py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link 
            to="/dashboard" 
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          >
            SketchReact
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">{user?.email}</span>
            <Link 
              to="/profile" 
              className="text-sm text-gray-300 hover:text-white transition-colors duration-300"
            >
              Profile
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">My Sketches</h1>
            <Button
              to="/sketch/new"
              variant="primary"
            >
              + New Sketch
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            </div>
          ) : sketches.length === 0 ? (
            // Empty State
            <div className="bg-gray-800 rounded-xl shadow-lg p-8 text-center">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No sketches yet</h3>
              <p className="text-gray-400 mb-6">
                Create your first sketch by clicking the "New Sketch" button above.
              </p>
              <Button
                to="/sketch/new"
                variant="primary"
              >
                Create New Sketch
              </Button>
            </div>
          ) : (
            // Sketches Grid
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sketches.map((sketch) => (
                <div key={sketch.id} className="relative">
                  <Link
                    to={`/sketch/${sketch.id}`}
                    className="block bg-gray-800 rounded-xl shadow-lg p-6 hover:bg-gray-700 transition-colors duration-300 relative"
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
                            className="bg-gray-700 text-white p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </form>
                      ) : (
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-white">
                            {sketch.name || `Sketch #${sketch.id}`}
                          </h3>
                        </div>
                      )}
                      <span className="text-sm text-gray-400">
                        {new Date(sketch.last_modified).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-gray-400 text-sm">
                      Last modified: {new Date(sketch.last_modified).toLocaleTimeString()}
                    </div>
                    
                    <div className="absolute bottom-3 right-3">
                      <div className="relative">
                        <button 
                          className="text-gray-400 hover:text-white focus:outline-none w-8 h-8 flex items-center justify-center rounded hover:bg-gray-600"
                          onClick={(e) => toggleMenu(e, sketch.id)}
                          title="Options"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                        
                        {menuOpenId === sketch.id && (
                          <div 
                            ref={menuRef}
                            className="absolute bottom-full right-0 mb-1 w-32 bg-gray-700 rounded-md shadow-lg z-10 py-1"
                          >
                            <button 
                              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                              onClick={(e) => handleRenameClick(e, sketch)}
                            >
                              Rename
                            </button>
                            <button 
                              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600"
                              onClick={(e) => handleRemoveSketch(e, sketch.id)}
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;