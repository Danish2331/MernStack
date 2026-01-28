import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Full Width */}
      <section
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center text-white px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-serif text-5xl md:text-7xl mb-6">
              Where Moments Become <span className="text-oberoi-gold">Memories</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light">
              Experience luxury banquet halls crafted for your special occasions
            </p>
            <Link to="/halls" className="btn-primary text-lg px-8 py-4 inline-block">
              EXPLORE VENUES
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 px-4 bg-oberoi-cream">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6">
            Welcome to Luxury Banquets
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Whether you are planning an unforgettable personal celebration, a meeting, or a large-scale corporate function,
            our luxury banquet halls and state-of-the-art meeting rooms with personalized service ensure
            every aspect of your event is executed to perfection.
          </p>
        </div>
      </section>

      {/* Events Preview */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-4xl text-center text-gray-900 mb-4">
            Events
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {/* Corporate */}
            <div className="group cursor-pointer">
              <div className="relative h-64 overflow-hidden rounded-lg mb-4">
                <img
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=600"
                  alt="Corporate Events"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-serif text-2xl text-gray-900 mb-2">Corporate</h3>
              <p className="text-gray-600 mb-4">
                Host impactful business conferences, seminars, and meetings with modern technologies
                and attentive service.
              </p>
              <Link to="/events/corporate" className="link-gold">
                REQUEST A PROPOSAL
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Social */}
            <div className="group cursor-pointer">
              <div className="relative h-64 overflow-hidden rounded-lg mb-4">
                <img
                  src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600"
                  alt="Social Events"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-serif text-2xl text-gray-900 mb-2">Social</h3>
              <p className="text-gray-600 mb-4">
                Celebrate life's milestones with elegance and style in our beautifully designed
                social event spaces.
              </p>
              <Link to="/events/social" className="link-gold">
                REQUEST A PROPOSAL
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Weddings */}
            <div className="group cursor-pointer">
              <div className="relative h-64 overflow-hidden rounded-lg mb-4">
                <img
                  src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600"
                  alt="Weddings"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-serif text-2xl text-gray-900 mb-2">Weddings</h3>
              <p className="text-gray-600 mb-4">
                Create the wedding of your dreams with our dedicated team ensuring every detail
                reflects your vision.
              </p>
              <Link to="/events/weddings" className="link-gold">
                REQUEST A PROPOSAL
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-oberoi-navy text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl mb-6">
            Ready to Plan Your Event?
          </h2>
          <p className="text-lg mb-8 text-gray-300">
            Discover our exquisite venues and let us bring your vision to life
          </p>
          <Link to="/halls" className="btn-primary text-lg px-8 py-4 inline-block">
            VIEW ALL VENUES
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
