import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';

function LandingPage() {
  const { isAuthenticated, user, loading } = useAuth();
  
  // Enable scrolling on the landing page
  useEffect(() => {
    // Save the original styles
    const originalOverflow = document.body.style.overflow;
    const originalHeight = document.body.style.height;
    
    // Enable scrolling for the landing page
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    
    // Cleanup function to restore original styles when navigating away
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.height = originalHeight;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-y-auto">
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
            {loading ? (
              <div className="w-20 h-6 bg-gray-700 animate-pulse rounded"></div>
            ) : isAuthenticated ? (
              <>
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
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Log in
                </Link>
                <Button 
                  to="/signup" 
                  variant="primary"
                  className="px-5 py-2 rounded-full font-medium"
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-32 pb-32">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
              WebSketch
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-10">
            Transform your hand-drawn sketches into functional web pages instantly
          </p>
          <Button 
            to={isAuthenticated ? "/dashboard" : "/signup"}
            variant="primary"
            className="px-8 py-3 rounded-full text-lg font-medium"
          >
            {isAuthenticated ? "Go to Dashboard" : "Sign up"}
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-800 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-700">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Sketch Your Design</h3>
              <p className="text-gray-400">Use our intuitive canvas to draw your webpage layout. Add elements as you would on paper.</p>
            </div>
            
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-700">
              <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Convert with AI</h3>
              <p className="text-gray-400">Our advanced AI analyzes your sketch and converts it into clean, functional code in seconds.</p>
            </div>
            
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-700">
              <div className="bg-teal-600 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Preview & Export</h3>
              <p className="text-gray-400">Preview your creation instantly and export the code to use in your projects.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Powered By</h2>
          
          <div className="flex flex-wrap justify-center gap-12">
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-full p-3 mb-4">
                <img src="/react-logo.svg" alt="React" className="h-10 w-10" />
              </div>
              <span className="text-gray-300">React</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-full p-3 mb-4">
                <img src="/anthropic-logo.svg" alt="Claude" className="h-10 w-10" />
              </div>
              <span className="text-gray-300">Claude AI</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-full p-3 mb-4">
                <img src="/gemini-logo.svg" alt="Gemini" className="h-10 w-10" />
              </div>
              <span className="text-gray-300">Gemini AI</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-full p-3 mb-4">
                <img src="/tailwind-logo.svg" alt="Tailwind CSS" className="h-10 w-10" />
              </div>
              <span className="text-gray-300">Tailwind CSS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-700 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>Made with Love ❤️</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage; 