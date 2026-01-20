# 🛠️ RideSurf - Admin Dashboard

Administrative dashboard for managing the RideSurf vehicle rental platform.

## 🎯 Purpose

This React application provides administrators with comprehensive tools to manage:
- **Vehicle Fleet** - Add, edit, and remove vehicles from the platform
- **User Management** - Review and approve user license verifications
- **Booking Oversight** - Monitor, create, and manage all bookings
- **System Administration** - Oversee platform operations and user activities

## ✨ Admin Features

### Vehicle Management
- Add new vehicles with images and specifications
- Edit existing vehicle details and pricing
- Remove vehicles from the platform
- View vehicle availability and booking history

### User Management
- Review user registrations and profiles
- Approve or reject driving license verifications
- View user booking history and activity
- Manage user account status

### Booking Management
- View all platform bookings in real-time
- Create bookings on behalf of users
- Edit existing booking details
- Cancel bookings with automatic user notifications
- Filter bookings by date, status, and user

### Advanced Features
- **License Verification** - Review uploaded license images with rejection reasons
- **Email Notifications** - Automatic emails for booking confirmations, updates, and cancellations
- **Location Management** - Country-State-City integration for global coverage
- **Date-based Filtering** - Show only available vehicles for selected dates

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

2. **Start Development Server**
```bash
npm run dev
```

The admin dashboard will be available at `http://localhost:5173`

## 🔐 Admin Authentication

### Default Admin Credentials
- **Email**: `admin@example.com`
- **Password**: `admin123`

*Note: Change these credentials in production*

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind
- **Lucide React** - Icon library
- **Axios** - HTTP client for API communication

## 📂 Project Structure

```
admin-rentals/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AdminNavbar.jsx # Navigation bar
│   │   ├── BookingCard.jsx # Booking display card
│   │   ├── CarCard.jsx     # Vehicle display card
│   │   └── Loader.jsx      # Loading component
│   ├── pages/              # Page components
│   │   ├── Dashboard.jsx   # Main dashboard
│   │   ├── Users.jsx       # User management
│   │   ├── Bookings.jsx    # Booking management
│   │   ├── CarForm.jsx     # Vehicle add/edit form
│   │   ├── BookingForm.jsx # Booking add/edit form
│   │   └── UserHistory.jsx # User activity history
│   ├── services/           # API services
│   └── App.jsx            # Main application
├── public/                 # Static assets
└── package.json           # Dependencies
```

## 🔧 Key Functionalities

### Vehicle Management
- **Add Vehicle**: Complete form with image upload, specifications, and pricing
- **Edit Vehicle**: Update any vehicle details including availability status
- **Delete Vehicle**: Remove vehicles with confirmation dialogs

### User Verification Process
1. **Review License**: View uploaded front and back license images
2. **Verification Decision**: Approve or reject with detailed reasons
3. **Email Notification**: Automatic emails sent to users with decision details
4. **Profile Management**: View user profiles with profile pictures

### Booking Operations
1. **Create Booking**: Select user, vehicle, dates, and locations
2. **Date Validation**: Only show available vehicles for selected dates
3. **Update Booking**: Modify existing bookings with email notifications
4. **Cancel Booking**: Delete bookings with automatic user notifications

## 🎨 UI Components

### Custom Components
- **Rejection Modal** - Professional modal for license rejection with reason input
- **Location Selector** - Country-State-City dropdown with search functionality
- **User Avatar** - Profile pictures with fallback to initials
- **Booking Cards** - Comprehensive booking information display

### Design System
- **Consistent Styling** - DaisyUI components with custom theming
- **Responsive Layout** - Mobile-friendly admin interface
- **Loading States** - Skeleton loaders and progress indicators
- **Error Handling** - User-friendly error messages and validation

## 📊 Dashboard Features

### Analytics Overview
- Total vehicles in fleet
- Active bookings count
- Pending license verifications
- Recent user registrations

### Quick Actions
- Add new vehicle
- Create booking
- Review pending licenses
- View recent activities

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Development Guidelines
- Component-based architecture
- Consistent error handling
- Loading states for all async operations
- Confirmation dialogs for destructive actions

## 🌐 API Integration

The admin dashboard integrates with backend APIs for:
- Vehicle CRUD operations
- User management and verification
- Booking management and notifications
- File uploads and image handling
- Email notification services

## 📧 Support

For technical support:
- Email: surfyourride@gmail.com
- Create an issue on GitHub

---

Built for efficient platform management and superior user experience.