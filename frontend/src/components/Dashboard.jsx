import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Button from './Button';

function Dashboard() {
  const { user } = useAuth();
  const [sketches, setSketches] = useState([]);
  const [loading, setLoading] = useState(true);

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
                <Link
                  key={sketch.id}
                  to={`/sketch/${sketch.id}`}
                  className="block bg-gray-800 rounded-xl shadow-lg p-6 hover:bg-gray-700 transition-colors duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-white">
                      Sketch #{sketch.id}
                    </h3>
                    <span className="text-sm text-gray-400">
                      {new Date(sketch.last_modified).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    Last modified: {new Date(sketch.last_modified).toLocaleTimeString()}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;