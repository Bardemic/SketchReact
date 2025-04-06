import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Button from './Button';
import SketchesGrid from './SketchesGrid';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user } = useAuth();
  const [sketches, setSketches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-900 py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link 
            to="/" 
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          >
            SketchReact
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
            <SketchesGrid 
              sketches={sketches} 
              setSketches={setSketches} 
              user={user} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;