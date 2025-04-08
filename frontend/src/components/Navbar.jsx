import { Link, useLocation } from 'react-router-dom';
import Button from './Button';
import logo from '../assets/logo.svg';

function Navbar() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-[1000] ${isLandingPage ? 'bg-transparent py-6' : 'bg-gray-900 py-3'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
          <img src={logo} alt="WebSketch Logo" className="w-8 h-8" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            WebSketch
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          {isLandingPage ? (
            <Button 
              to="/dashboard" 
              variant="primary"
              className="px-5 py-2 rounded-full font-medium"
            >
              Try It Now
            </Button>
          ) : (
            <Link 
              to="/" 
              className="text-gray-300 hover:text-white transition-colors duration-300"
            >
              Home
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 