import { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Gamepad2, ChevronDown } from 'lucide-react'; 
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/Logo.jpeg';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubOpen, setIsSubOpen] = useState(false); 
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) return null;

  useEffect(() => {
    setIsOpen(false);
    setIsSubOpen(false);
  }, [location]);

  return (
    <nav className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={logo} 
              alt="ITSS Logo" 
              className="h-10 w-10 md:h-12 md:w-12 object-contain group-hover:scale-110 transition-transform duration-300" 
            />
            <span className="text-2xl font-stencil tracking-wider text-itss-white uppercase mt-1">
              ITSS
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-8 items-center font-stencil text-sm uppercase tracking-widest text-zinc-300">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link to="/team" className="hover:text-white transition-colors">Meet The Team</Link>

            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-white transition-colors font-stencil text-sm uppercase tracking-widest text-zinc-300 focus:outline-none">
                Subcommittees <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col z-50">
                <Link to="/subcommittee/academics" className="px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white border-b border-zinc-800">Academics</Link>
                <Link to="/subcommittee/events" className="px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white border-b border-zinc-800">Events</Link>
                <Link to="/subcommittee/wellness" className="px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white border-b border-zinc-800">Wellness</Link>
                <Link to="/subcommittee/research" className="px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white">Research & Support</Link>
              </div>
            </div>

            <Link to="/events" className="hover:text-white transition-colors">Events</Link>

            {user && (
              <>
                <Link to="/profile" className="hover:text-itss-primary transition-colors">Profile</Link>
                <Link to="/arcade" className="text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-2">
                  <Gamepad2 size={16} /> Arcade
                </Link>
              </>
            )}
            
            {user ? (
              <Link to={user.team === 'Executive' ? '/admin' : '/arcade'} className="bg-white text-black px-6 py-2 border-2 border-white hover:bg-zinc-300 transition-all font-bold flex items-center gap-2">
                <User size={16} /> {user.team === 'Executive' ? 'Command Center' : 'Dashboard'}
              </Link>
            ) : (
              <Link to="/login" className="bg-zinc-800 text-white px-6 py-2 border-2 border-zinc-600 hover:bg-zinc-700 transition-all font-bold">
                System Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 font-stencil uppercase tracking-widest flex flex-col pb-4 shadow-xl">
          <Link to="/" className="block px-6 py-4 text-zinc-300 border-b border-zinc-800">Home</Link>
          <Link to="/about" className="block px-6 py-4 text-zinc-300 border-b border-zinc-800">About Us</Link>
          <Link to="/team" className="block px-6 py-4 text-zinc-300 border-b border-zinc-800">Meet The Team</Link>
          
          <button onClick={() => setIsSubOpen(!isSubOpen)} className="flex justify-between items-center w-full px-6 py-4 text-zinc-300 border-b border-zinc-800 focus:outline-none">
            Subcommittees <ChevronDown size={16} className={`transform transition-transform ${isSubOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isSubOpen && (
            <div className="bg-zinc-950 flex flex-col border-b border-zinc-800">
              <Link to="/subcommittee/academics" className="pl-10 py-3 text-zinc-400 border-b border-zinc-800 text-xs">└ Academics</Link>
              <Link to="/subcommittee/events" className="pl-10 py-3 text-zinc-400 border-b border-zinc-800 text-xs">└ Events</Link>
              <Link to="/subcommittee/wellness" className="pl-10 py-3 text-zinc-400 border-b border-zinc-800 text-xs">└ Wellness</Link>
              <Link to="/subcommittee/research" className="pl-10 py-3 text-zinc-400 border-b border-zinc-800 text-xs">└ Research & Support</Link>
            </div>
          )}
          
          <Link to="/events" className="block px-6 py-4 text-zinc-300 border-b border-zinc-800">Events</Link>
          
          {user && (
            <>
              <Link to="/profile" className="block px-6 py-4 text-itss-primary border-b border-zinc-800">Profile Settings</Link>
              <Link to="/arcade" className="flex px-6 py-4 text-yellow-400 border-b border-zinc-800 items-center gap-2">
                <Gamepad2 size={16} /> The Arcade
              </Link>
            </>
          )}
          
          <div className="p-6">
            {user ? (
              <Link to={user.team === 'Executive' ? '/admin' : '/arcade'} className="block w-full text-center bg-white text-black py-3 font-bold">
                {user.team === 'Executive' ? 'Command Center' : 'Dashboard'}
              </Link>
            ) : (
              <Link to="/login" className="block w-full text-center bg-zinc-800 text-white py-3 font-bold border border-zinc-600">
                System Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;