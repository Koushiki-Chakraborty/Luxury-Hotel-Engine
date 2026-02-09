import Hero from '../../components/user/Hero';
import FeaturedRooms from '../../components/user/FeaturedRooms';
import Testimonials from '../../components/user/Testimonials';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Rooms Section */}
      <FeaturedRooms />

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
};

export default Home;
