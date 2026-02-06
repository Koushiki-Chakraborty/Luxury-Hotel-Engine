# Rudraksh Inn - Hotel & Restaurant Booking System

A comprehensive full-stack web application for hotel room booking, restaurant reservations, and event management.

## 🏨 Project Overview

Rudraksh Inn is a luxury hotel with integrated restaurant services. The system allows:
- **Hotel room booking** with availability checking
- **Restaurant table reservations** for dining and events
- **In-room services** for current guests (room service, amenities)
- **Admin dashboard** for managing all operations and analytics

## 🛠️ Tech Stack

### Frontend
- **React** (latest with Hooks)
- **Vite** (build tool)
- **Tailwind CSS** (styling)
- **React Router** (navigation)
- **Lucide React** (icons)
- **React Hook Form** (form validation)
- **date-fns** (date handling)
- **Recharts** (analytics charts)
- **Axios** (API calls)
- **Context API** (state management)

### Backend
- **Node.js + Express** (REST API)
- **MongoDB + Mongoose** (database)
- **JWT** (authentication)
- **Bcrypt** (password hashing)
- **Razorpay/Stripe** (payment integration)
- **Cloudinary** (image storage)

## 📁 Project Structure

```
RudraINN/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── common/   # Shared components (Header, Footer, etc.)
│   │   │   ├── user/     # User-specific components
│   │   │   └── admin/    # Admin-specific components
│   │   ├── pages/        # Page components
│   │   │   ├── user/     # User pages (Home, Rooms, etc.)
│   │   │   ├── admin/    # Admin pages (Dashboard, Management)
│   │   │   └── auth/     # Auth pages (Login, Register)
│   │   ├── context/      # React Context for state management
│   │   ├── services/     # API service functions
│   │   ├── utils/        # Utility functions
│   │   ├── hooks/        # Custom React hooks
│   │   └── assets/       # Images, fonts, etc.
│   └── package.json
│
├── backend/               # Node.js + Express backend
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware (auth, error handling)
│   ├── config/           # Configuration files
│   ├── utils/            # Utility functions
│   ├── server.js         # Main server file
│   └── package.json
│
├── DESIGN.md             # Design system documentation
└── SITE.md               # Project specifications
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RudraINN
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Set up Environment Variables**

   **Backend** (`backend/.env`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/rudraksh-inn
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   
   # Optional: Add when ready
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   RAZORPAY_KEY_ID=
   RAZORPAY_KEY_SECRET=
   ```

   **Frontend** (`frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

### Running the Application

**Development Mode:**

1. **Start Backend** (from `backend/` directory):
   ```bash
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

2. **Start Frontend** (from `frontend/` directory):
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

**Production Mode:**

1. **Build Frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Start Backend**:
   ```bash
   cd backend
   npm start
   ```

## 📋 Features

### User Features
- ✅ Hotel room browsing and booking
- ✅ Restaurant table reservations
- ✅ Event/party package bookings
- ✅ User authentication (register/login)
- ✅ User dashboard with booking history
- ✅ In-room service orders (for current guests)
- ✅ Payment integration
- ✅ Profile management

### Admin Features
- ✅ Room management (CRUD)
- ✅ Booking management (view, approve, check-in/out)
- ✅ Restaurant management (tables, menu, reservations)
- ✅ Room service order management
- ✅ User management
- ✅ Analytics and reports with charts
- ✅ Hotel settings configuration

## 🎨 Design System

The application follows a **5-star luxury resort** aesthetic with:
- **Colors**: Deep Charcoal, Champagne Gold, Warm Cream
- **Typography**: Playfair Display (headings), Lato (body)
- **Components**: Custom Tailwind classes for buttons, cards, forms

See [DESIGN.md](./DESIGN.md) for complete design specifications.

## 📦 Database Models

- **Users** - Customer and admin accounts
- **Rooms** - Room details, pricing, amenities
- **RoomBookings** - Room reservations
- **Tables** - Restaurant table inventory
- **TableReservations** - Restaurant bookings
- **MenuItems** - Restaurant menu
- **EventPackages** - Party packages
- **RoomServiceOrders** - Food orders from rooms

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login

### Rooms
- `GET /api/rooms` - Get all rooms (with filters)
- `GET /api/rooms/:id` - Get room details
- `POST /api/rooms` - Create room (admin)
- `PUT /api/rooms/:id` - Update room (admin)
- `DELETE /api/rooms/:id` - Delete room (admin)

### Bookings
- `POST /api/bookings/check-availability` - Check room availability
- `POST /api/bookings/create` - Create booking
- `GET /api/bookings/user/:userId` - Get user bookings
- `GET /api/bookings/all` - Get all bookings (admin)
- `PUT /api/bookings/:id/status` - Update booking status (admin)

### Restaurant
- `GET /api/restaurant/tables` - Get all tables
- `POST /api/restaurant/reserve` - Reserve table
- `GET /api/restaurant/menu` - Get menu items
- `POST /api/restaurant/menu` - Add menu item (admin)
- `PUT /api/restaurant/menu/:id` - Update menu item (admin)

### Room Service
- `POST /api/room-service/order` - Create order
- `GET /api/room-service/orders` - Get all orders (admin)
- `PUT /api/room-service/orders/:id/status` - Update order status (admin)

### Analytics
- `GET /api/analytics/revenue` - Revenue reports
- `GET /api/analytics/occupancy` - Occupancy statistics
- `GET /api/analytics/trends` - Trend analysis

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📝 Development Phases

### Phase 1: Core (Current)
- [x] Project setup and structure
- [ ] Database models and API routes
- [ ] Authentication system
- [ ] Room booking flow
- [ ] Admin dashboard basics

### Phase 2: Restaurant
- [ ] Restaurant table booking
- [ ] Menu management
- [ ] Room service orders

### Phase 3: Polish
- [ ] Analytics and reports
- [ ] Advanced filters
- [ ] Email notifications
- [ ] UI refinements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- **Development Team** - Rudraksh Inn Project

## 🙏 Acknowledgments

- Design inspiration from luxury hotel websites
- Tailwind CSS for the utility-first CSS framework
- React community for excellent tools and libraries
