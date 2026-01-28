import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="font-serif text-2xl text-oberoi-navy tracking-wide">
              <span className="text-oberoi-gold">La</span> Grace
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/halls"
              className="text-gray-700 hover:text-oberoi-gold transition-colors font-sans text-sm uppercase tracking-wider"
            >
              Venues
            </Link>
            <Link
              to="/events"
              className="text-gray-700 hover:text-oberoi-gold transition-colors font-sans text-sm uppercase tracking-wider"
            >
              Events
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/my-bookings"
                  className="text-gray-700 hover:text-oberoi-gold transition-colors font-sans text-sm uppercase tracking-wider"
                >
                  My Bookings
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <User size={16} />
                    {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="text-gray-700 hover:text-oberoi-gold transition-colors font-sans text-sm uppercase tracking-wider"
              >
                Login
              </Link>
            )}

            <Link to="/halls" className="btn-primary">
              BOOK
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-4">
            <Link
              to="/halls"
              className="block text-gray-700 hover:text-oberoi-gold font-sans text-sm uppercase tracking-wider"
              onClick={() => setMobileMenuOpen(false)}
            >
              Venues
            </Link>
            <Link
              to="/events"
              className="block text-gray-700 hover:text-oberoi-gold font-sans text-sm uppercase tracking-wider"
              onClick={() => setMobileMenuOpen(false)}
            >
              Events
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/my-bookings"
                  className="block text-gray-700 hover:text-oberoi-gold font-sans text-sm uppercase tracking-wider"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Bookings
                </Link>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <User size={16} />
                  {user?.name}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-red-600 text-sm uppercase tracking-wider flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block text-gray-700 hover:text-oberoi-gold font-sans text-sm uppercase tracking-wider"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}

            <Link
              to="/halls"
              className="btn-primary block text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              BOOK
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
