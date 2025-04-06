import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

function UserProfile() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };
    
    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error.message);
    } finally {
      setLoading(false);
    }
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
            <Link 
              to="/sketch" 
              className="text-gray-300 hover:text-white transition-colors duration-300"
            >
              Sketch
            </Link>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="text-gray-300 hover:text-white transition-colors duration-300"
            >
              {loading ? 'Logging out...' : 'Log out'}
            </button>
          </div>
        </div>
      </nav>

      {/* Profile Content */}
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-white mb-6">Your Profile</h1>
            
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white">{user?.email}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">User ID</p>
                <p className="text-white text-sm truncate">{user?.id}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Account Created</p>
                <p className="text-white">
                  {userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : 'Loading...'}
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex gap-4">
              <Link
                to="/sketch"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-300"
              >
                Back to Sketch
              </Link>
              
              <button
                onClick={handleLogout}
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-300"
              >
                {loading ? 'Logging out...' : 'Log out'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile; 