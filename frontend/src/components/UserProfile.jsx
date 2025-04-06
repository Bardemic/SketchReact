import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';

function UserProfile() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [sketchCount, setSketchCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        // Fetch user data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (userError) throw userError;
        setUserData(userData);

        // Fetch sketch count
        const { count, error: countError } = await supabase
          .from('sketches')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id);

        if (countError) throw countError;
        setSketchCount(count || 0);
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
                <p className="text-gray-400 text-sm">Total Sketches</p>
                <p className="text-white">{sketchCount}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Account Created</p>
                <p className="text-white">
                  {userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : 'Loading...'}
                </p>
              </div>

              <div className="mt-8">
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  disabled={loading}
                >
                  {loading ? 'Logging out...' : 'Log out'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile; 