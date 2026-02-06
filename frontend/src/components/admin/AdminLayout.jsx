import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Bed, 
  Calendar, 
  UtensilsCrossed, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  User,
  Loader
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { admin, logout } = useAdmin();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Rooms', path: '/admin/rooms', icon: Bed },
    { name: 'Bookings', path: '/admin/bookings', icon: Calendar },
    { name: 'Restaurant', path: '/admin/restaurant', icon: UtensilsCrossed },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Settings', path: '/admin/settings', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-warm-cream flex">
      {/* Loading Spinner Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-deep-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-champagne-gold border-t-transparent rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-deep-charcoal border-r border-champagne-gold/20">
        {/* Logo */}
        <div className="p-6 border-b border-champagne-gold/20">
          <div className="text-2xl font-playfair font-bold text-warm-cream">
            <span className="text-champagne-gold">Rudraksh</span> Inn
          </div>
          <p className="text-pale-champagne text-xs font-lato mt-1">Admin Portal</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg font-lato font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-champagne-gold text-deep-charcoal shadow-gold'
                    : 'text-pale-champagne hover:bg-rich-espresso hover:text-champagne-gold'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Admin Profile & Logout */}
        <div className="p-4 border-t border-champagne-gold/20">
          <div className="flex items-center space-x-3 px-4 py-3 bg-rich-espresso rounded-lg mb-2">
            <div className="w-10 h-10 bg-champagne-gold rounded-full flex items-center justify-center">
              <User className="text-deep-charcoal" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-warm-cream font-lato font-bold text-sm truncate">
                {admin?.name || 'Admin'}
              </p>
              <p className="text-pale-champagne text-xs truncate">{admin?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-error-burgundy hover:bg-error-burgundy/80 text-warm-cream rounded-lg font-lato font-medium transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-deep-charcoal/50 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-deep-charcoal border-r border-champagne-gold/20 z-50 lg:hidden flex flex-col"
            >
              {/* Close Button */}
              <div className="p-4 flex justify-end">
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-pale-champagne hover:text-champagne-gold transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Logo */}
              <div className="px-6 pb-6 border-b border-champagne-gold/20">
                <div className="text-2xl font-playfair font-bold text-warm-cream">
                  <span className="text-champagne-gold">Rudraksh</span> Inn
                </div>
                <p className="text-pale-champagne text-xs font-lato mt-1">Admin Portal</p>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg font-lato font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-champagne-gold text-deep-charcoal shadow-gold'
                          : 'text-pale-champagne hover:bg-rich-espresso hover:text-champagne-gold'
                      }`
                    }
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>

              {/* Admin Profile & Logout */}
              <div className="p-4 border-t border-champagne-gold/20">
                <div className="flex items-center space-x-3 px-4 py-3 bg-rich-espresso rounded-lg mb-2">
                  <div className="w-10 h-10 bg-champagne-gold rounded-full flex items-center justify-center">
                    <User className="text-deep-charcoal" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-warm-cream font-lato font-bold text-sm truncate">
                      {admin?.name || 'Admin'}
                    </p>
                    <p className="text-pale-champagne text-xs truncate">{admin?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-error-burgundy hover:bg-error-burgundy/80 text-warm-cream rounded-lg font-lato font-medium transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-soft-ivory border-b border-pale-champagne px-4 py-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-deep-charcoal hover:text-champagne-gold transition-colors"
            >
              <Menu size={24} />
            </button>

            {/* Page Title - will be dynamic based on route */}
            <h1 className="text-xl md:text-2xl font-playfair font-bold text-deep-charcoal">
              Admin Dashboard
            </h1>

            {/* Desktop Admin Info */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-deep-charcoal font-lato font-bold text-sm">
                  {admin?.name || 'Admin'}
                </p>
                <p className="text-rich-espresso text-xs">{admin?.role || 'Administrator'}</p>
              </div>
              <div className="w-10 h-10 bg-champagne-gold rounded-full flex items-center justify-center">
                <User className="text-deep-charcoal" size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet context={{ setIsLoading }} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
