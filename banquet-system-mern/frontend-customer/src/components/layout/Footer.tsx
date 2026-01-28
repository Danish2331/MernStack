import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-oberoi-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Us */}
          <div>
            <h3 className="font-serif text-lg mb-4">About Us</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/about" className="hover:text-oberoi-gold transition-colors">Our Story</Link></li>
              <li><Link to="/about#team" className="hover:text-oberoi-gold transition-colors">From The Heart</Link></li>
              <li><Link to="/contact" className="hover:text-oberoi-gold transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/privacy" className="hover:text-oberoi-gold transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-oberoi-gold transition-colors">Terms and Conditions</Link></li>
            </ul>
          </div>

          {/* Brand Message */}
          <div>
            <h3 className="font-serif text-lg mb-4">La Grace</h3>
            <p className="text-sm text-gray-300 italic">
              Where elegance meets celebration. Creating unforgettable moments for your special occasions.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© {currentYear} La Grace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
