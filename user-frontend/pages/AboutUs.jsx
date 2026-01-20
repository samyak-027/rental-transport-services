import { Car, Users, Shield, Clock, MapPin, Star } from 'lucide-react';

export const AboutUs = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-sky-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About RideSurf</h1>
          <p className="text-xl md:text-2xl opacity-90">
            Your trusted partner for seamless vehicle rental experiences
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        
        {/* Mission Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At RideSurf, we're revolutionizing the vehicle rental industry by providing a seamless, 
            secure, and user-friendly platform that connects travelers with the perfect vehicles for their journeys. 
            We believe that mobility should be accessible, affordable, and hassle-free for everyone.
          </p>
        </div>

        {/* What We Offer */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Car className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Diverse Fleet</h3>
              <p className="text-gray-600">
                From economy cars to luxury SUVs, bikes to helicopters - we have vehicles for every need and budget.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Booking</h3>
              <p className="text-gray-600">
                Advanced license verification system and secure payment processing ensure safe transactions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">24/7 Availability</h3>
              <p className="text-gray-600">
                Book anytime, anywhere with our user-friendly platform and round-the-clock customer support.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Global Locations</h3>
              <p className="text-gray-600">
                Integrated with country-state-city API to serve customers across multiple locations worldwide.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">User-Centric</h3>
              <p className="text-gray-600">
                Intuitive interface, transparent pricing, and personalized recommendations for the best experience.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Assured</h3>
              <p className="text-gray-600">
                All vehicles are regularly maintained and inspected to ensure safety and reliability.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">How RideSurf Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Browse & Search</h3>
              <p className="text-gray-600 text-sm">
                Select your pickup/drop-off locations and dates to find available vehicles
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Register & Verify</h3>
              <p className="text-gray-600 text-sm">
                Create account, verify email, and upload driving license for approval
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Book & Pay</h3>
              <p className="text-gray-600 text-sm">
                Choose your vehicle, review booking details, and make secure payment
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Enjoy Your Ride</h3>
              <p className="text-gray-600 text-sm">
                Receive confirmation email and enjoy your journey with peace of mind
              </p>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Built with Modern Technology</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary mb-2">React</div>
              <p className="text-sm text-gray-600">Frontend Framework</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-2">Node.js</div>
              <p className="text-sm text-gray-600">Backend Runtime</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-2">MongoDB</div>
              <p className="text-sm text-gray-600">Database</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-2">JWT</div>
              <p className="text-sm text-gray-600">Authentication</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Start Your Journey?</h2>
          <p className="text-gray-600 mb-6">
            Join thousands of satisfied customers who trust RideSurf for their travel needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/vehicles"
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-sky-600 font-semibold"
            >
              Browse Vehicles
            </a>
            <a
              href="/support"
              className="border border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary hover:text-white font-semibold"
            >
              Get Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;