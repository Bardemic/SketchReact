import { Link } from 'react-router-dom';
import Button from './Button';
import logo from '../assets/logo.png';

function ForbiddenError() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col justify-center items-center">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold flex items-center gap-1">
            <img src={logo} alt="WebSketch Logo" className="w-12 h-16" />
            WebSketch
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              to="/dashboard" 
              className="text-gray-300 hover:text-white transition-colors duration-300"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Error Content */}
      <div className="container mx-auto px-4 text-center mt-48">
        <div className="flex items-center justify-center mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-red-500 mr-3" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-600">
            Error 403 Forbidden
          </h1>
        </div>
        
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          You don't have permission to access this sketch. It may belong to another user or no longer exist.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            to="/dashboard" 
            variant="primary"
            className="px-6 py-2 rounded-full text-base font-medium"
          >
            Go to Dashboard
          </Button>
          
          <Button 
            to="/sketch/new" 
            variant="secondary"
            className="px-6 py-2 rounded-full text-base font-medium"
          >
            Create New Sketch
          </Button>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-auto py-8 w-full">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>Made with love ❤️</p>
        </div>
      </footer>
    </div>
  );
}

export default ForbiddenError; 