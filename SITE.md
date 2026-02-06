you are a prefessional software engineer with 10 years of experience in full stack development.

I need you to build a complete full-stack hotel and restaurant booking system called "Rudraksh Inn". This is a comprehensive web application with both user-facing pages and admin dashboard.
PROJECT OVERVIEW
Rudraksh Inn is a hotel with rooms and a restaurant downstairs. Users can:

Book hotel rooms
Reserve restaurant tables for dining or events/parties
Current hotel guests can order room service and book restaurant tables from their rooms
Admins can manage all bookings, rooms, restaurant, and view analytics

TECHNICAL STACK
Frontend:

React (latest version with Hooks)
React Router for navigation
Tailwind CSS for styling
Lucide React for icons
React Hook Form for form validation
Date-fns for date handling
Recharts for admin analytics/charts
Context API for state management
LocalStorage for data persistence

Backend:

Node.js + Express for REST API
MongoDB for database
JWT for authentication
Cloudinary or AWS S3 for image storage
Razorpay/Stripe for payment integration
Bcrypt for password hashing

CORE FEATURES TO IMPLEMENT
User Features:

Hotel room booking with availability check
Restaurant table reservations
Event/party bookings with packages
User registration and authentication
In-room services for current guests (room service orders, table booking)
User dashboard with booking history
Payment integration

Admin Features:

Room management (CRUD operations)
Booking management (view, approve, check-in/out)
Restaurant management (tables, menu, reservations)
Room service order management
User management
Analytics and reports with charts
Hotel settings

ALL PAGES TO BUILD
USER PAGES (12 pages):

Home Page - Hero, quick booking, featured rooms, testimonials
Rooms Page - Room catalog with filters
Room Details Page - Full room info, gallery, booking form
Restaurant Page - Menu, table booking
Events & Parties Page - Party packages and booking
About Us Page - Hotel story, facilities
Contact Page - Contact form, map
Login/Register Page
User Dashboard - Booking overview
My Bookings Page - Active and past bookings
Profile Page - User settings
In-Room Services Page - Room service, amenities (for current guests)

ADMIN PAGES (18 pages):

Admin Login Page
Admin Dashboard - Overview with stats
Rooms List Page - All rooms with status
Add/Edit Room Page - Room form
Room Calendar View - Booking calendar
All Bookings Page - Room bookings list
Booking Details Page - Full booking info
Restaurant Dashboard - Today's reservations
Table Reservations Page - All reservations
Tables Management Page - Manage tables
Menu Management Page - CRUD for menu items
Event Packages Page - Manage packages
Room Service Orders Page - Order management
Users List Page - All registered users
Reports Page - Revenue and analytics reports
Analytics Dashboard - Charts and trends
Hotel Settings Page - Hotel information
Admin Settings Page - Admin configuration

DATABASE MODELS
Create MongoDB schemas for:

Users (customers and admins)
Rooms (room details, pricing, amenities)
RoomBookings (reservations with dates, status)
Tables (restaurant table inventory)
TableReservations (restaurant bookings)
MenuItems (dishes with categories, pricing)
EventPackages (party packages)
RoomServiceOrders (food orders from rooms)
Reviews (optional)

API ENDPOINTS
Authentication:

POST /api/auth/register
POST /api/auth/login
POST /api/auth/admin-login

Rooms:

GET /api/rooms (with filters)
GET /api/rooms/:id
POST /api/rooms (admin)
PUT /api/rooms/:id (admin)
DELETE /api/rooms/:id (admin)

Bookings:

POST /api/bookings/check-availability
POST /api/bookings/create
GET /api/bookings/user/:userId
GET /api/bookings/all (admin)
PUT /api/bookings/:id/status (admin)

Restaurant:

GET /api/restaurant/tables
POST /api/restaurant/reserve
GET /api/restaurant/menu
POST /api/restaurant/menu (admin)
PUT /api/restaurant/menu/:id (admin)

Room Service:

POST /api/room-service/order
GET /api/room-service/orders (admin)
PUT /api/room-service/orders/:id/status (admin)

Analytics:

GET /api/analytics/revenue
GET /api/analytics/occupancy
GET /api/analytics/trends

DESIGN REQUIREMENTS

Modern, luxury hotel aesthetic
Warm color palette (gold accents, deep browns, cream)
Mobile-responsive design
Smooth animations and transitions
Professional typography
High-quality placeholder images
Intuitive navigation
Clear CTAs (Call-to-actions)

SPECIFIC REQUIREMENTS

Authentication: Separate login for users and admins
Role-based access: Protect admin routes
Date handling: Prevent booking past dates, show availability
Payment: Integrate Razorpay in test mode
Validation: Proper form validation on both frontend and backend
Error handling: User-friendly error messages
Loading states: Show loaders during API calls
Success notifications: Toast messages for actions
Image upload: Allow admins to upload room images
Responsive: Mobile-first design

DELIVERABLES

Complete working application (frontend + backend)
Database seeded with sample data (5-6 rooms, menu items, tables)
Admin credentials provided
README with setup instructions
Environment variables template (.env.example)
All 30 pages fully functional
Working payment integration (test mode)
Responsive design tested on mobile and desktop

PRIORITY ORDER
Phase 1 (Core):

Project setup and structure
Database models and API routes
Authentication system
Room booking flow (browse → book → payment)
Admin dashboard basics

Phase 2 (Restaurant):

Restaurant table booking
Menu management
Room service orders

Phase 3 (Polish):

Analytics and reports
Advanced filters
Email notifications
UI refinements

Start with Phase 1 and build incrementally. Make sure each feature is fully functional before moving to the next.

Additional Context:

Hotel name: "Rudraksh Inn"
Location: You can use a placeholder address in India
Target users: Travelers, business guests, event organizers
Admin users: Hotel staff and management