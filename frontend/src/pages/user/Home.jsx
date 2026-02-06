import Hero from '../../components/user/Hero';
import QuickBookingWidget from '../../components/user/QuickBookingWidget';
import FeaturedRooms from '../../components/user/FeaturedRooms';
import Testimonials from '../../components/user/Testimonials';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Quick Booking Widget - Overlaps hero */}
      <QuickBookingWidget />

      {/* Featured Rooms Section */}
      <FeaturedRooms />

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
};

export default Home;
