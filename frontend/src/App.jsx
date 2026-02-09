import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import ScrollToTop from './components/shared/ScrollToTop';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/user/Home';
import Rooms from './pages/Rooms';
import RoomDetails from './pages/RoomDetails';
import Restaurant from './pages/Restaurant';
import About from './pages/About';
import Events from './pages/Events';
import Contact from './pages/Contact';

// Admin Components
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRooms from './pages/admin/AdminRooms';
import AdminBookings from './pages/admin/AdminBookings';
import AdminRestaurant from './pages/admin/AdminRestaurant';
import AdminLogbook from './pages/admin/AdminLogbook';
import AdminSettings from './pages/admin/AdminSettings';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';

import './index.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AdminProvider>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Home />
              </main>
              <Footer />
            </div>
          } />
          
          <Route path="/rooms" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Rooms />
              </main>
              <Footer />
            </div>
          } />
          
          <Route path="/rooms/:id" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <RoomDetails />
              </main>
              <Footer />
            </div>
          } />
          
          <Route path="/restaurant" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Restaurant />
              </main>
              <Footer />
            </div>
          } />
          
          <Route path="/events" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Events />
              </main>
              <Footer />
            </div>
          } />
          
          <Route path="/about" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <About />
              </main>
              <Footer />
            </div>
          } />
          
          <Route path="/contact" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Contact />
              </main>
              <Footer />
            </div>
          } />
          
          <Route path="/login" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <div className="pt-24 p-8 text-center">Login Page - Coming Soon</div>
              </main>
              <Footer />
            </div>
          } />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="rooms" element={<AdminRooms />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="restaurant" element={<AdminRestaurant />} />
            <Route path="logbook" element={<AdminLogbook />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </AdminProvider>
    </Router>
  );
}

export default App;

