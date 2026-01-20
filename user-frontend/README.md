# 🚗 RideSurf - User Frontend

The customer-facing React application for the RideSurf vehicle rental platform.

## 🌟 Features

### User Experience
- **Browse Vehicles** - View available vehicles without registration
- **Smart Search** - Filter by location, dates, vehicle type, price, and more
- **Secure Authentication** - Email verification with OTP system
- **License Verification** - Upload driving license for admin approval
- **Booking Management** - Complete booking flow with payment integration
- **Profile Management** - User dashboard with booking history and profile picture upload

### Technical Features
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Real-time Validation** - Form validation and error handling
- **JWT Authentication** - Secure token-based authentication with auto-refresh
- **Location API Integration** - Country-State-City selection for global coverage
- **Image Upload** - Profile pictures and license document upload
- **Email Integration** - Automated booking confirmations and notifications

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running on port 5007

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Environment Setup**
Create a `.env` file:
```env
VITE_API_URL=http://localhost:5007/api
```

3. **Start Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:5174`

## 📱 User Journey

1. **Discovery** - Browse vehicles and view pricing without registration
2. **Search** - Select journey details (from/to locations and dates)
3. **Registration** - Create account with email verification
4. **Verification** - Upload driving license for admin approval
5. **Booking** - Select vehicle, review details, and make payment
6. **Management** - View bookings and manage profile

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing with protected routes
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client with interceptors

## 📂 Project Structure

```
user-frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.jsx      # Main layout with navigation
│   │   ├── LocationSelector.jsx  # Country-State-City selector
│   │   └── ProtectedRoute.jsx    # Route protection
│   ├── pages/              # Page components
│   │   ├── auth/           # Authentication pages
│   │   ├── Home.jsx        # Landing page with search
│   │   ├── Vehicles.jsx    # Vehicle listing and filters
│   │   ├── BookingSummary.jsx  # Booking review
│   │   ├── Payment.jsx     # Payment processing
│   │   ├── Profile.jsx     # User dashboard
│   │   ├── AboutUs.jsx     # About page
│   │   └── Support.jsx     # Support and FAQ
│   ├── context/            # React context for state management
│   ├── services/           # API services and utilities
│   └── App.jsx            # Main application component
├── public/                 # Static assets
└── package.json           # Dependencies and scripts
```

## 🔐 Authentication Flow

1. **Registration** - User provides name, email, password
2. **Email Verification** - OTP sent via email for account activation
3. **License Upload** - Driving license images uploaded for verification
4. **Admin Approval** - Admin reviews and approves/rejects license
5. **Booking Access** - Verified users can make bookings

## 🎨 UI/UX Features

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Loading States** - Skeleton loaders and progress indicators
- **Error Handling** - User-friendly error messages and validation
- **Success Feedback** - Confirmation modals and success messages
- **Accessibility** - Keyboard navigation and screen reader support

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Style
- ESLint configuration for code quality
- Prettier for consistent formatting
- Component-based architecture
- Custom hooks for reusable logic

## 🌐 API Integration

The frontend communicates with the backend API for:
- User authentication and management
- Vehicle data and availability
- Booking creation and management
- File uploads (images)
- Email notifications

## 📧 Support

For technical support or questions:
- Email: surfyourride@gmail.com
- Create an issue on GitHub

---

Built with ❤️ using modern React and best practices.