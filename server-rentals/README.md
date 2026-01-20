# 🚀 RideSurf - Backend API Server

RESTful API server for the RideSurf vehicle rental platform built with Node.js, Express, and MongoDB.

## 🎯 Overview

This backend server provides comprehensive APIs for:
- **User Authentication** - Registration, login, email verification, password reset
- **Vehicle Management** - CRUD operations for vehicle fleet
- **Booking System** - Complete booking lifecycle management
- **File Upload** - Image handling for vehicles, licenses, and profile pictures
- **Email Services** - Automated notifications and confirmations
- **Admin Operations** - Administrative functions and user management

## ✨ Key Features

### Authentication & Security
- **JWT Authentication** - Access tokens (15min) + Refresh tokens (7 days)
- **Email Verification** - OTP-based account activation
- **Password Reset** - Secure password recovery with OTP
- **Role-based Access** - User and Admin role separation
- **Secure Sessions** - HTTP-only cookies for refresh tokens

### Business Logic
- **Vehicle Availability** - Real-time availability checking by date range
- **Booking Management** - Complete booking lifecycle with validations
- **License Verification** - Admin approval workflow for user licenses
- **Email Notifications** - Automated emails for all major actions
- **File Management** - Cloudinary integration for image storage

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- Email service (Gmail with app password)

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Environment Configuration**
Create a `.env` file:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/vehicle-rental

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-token-secret

# Session
SESSION_SECRET=your-session-secret

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Service (Gmail)
SMTP_USER="your-email-with@smtp-brevo.com"
SMTP_PASS="your-created-key-smtp-pass"
SENDER_EMAIL="your-account-email@gmail.com"

# Server
PORT=5007
NODE_ENV=development
```

3. **Start the Server**
```bash
npm start
```

The API server will be available at `http://localhost:5007`

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - User registration with email verification
- `POST /login` - User login with JWT tokens
- `POST /verify-email` - Email verification with OTP
- `POST /resend-otp` - Resend verification OTP
- `POST /forgot-password` - Request password reset OTP
- `POST /reset-password` - Reset password with OTP
- `POST /refresh-token` - Refresh access token
- `POST /logout` - Logout and clear tokens
- `GET /me` - Get current user info

### Vehicle Routes (`/api/cars`)
- `GET /getCars` - Get all vehicles (public)
- `POST /available` - Get available vehicles by date range
- `POST /add-car` - Add new vehicle (admin)
- `PUT /:id` - Update vehicle (admin)
- `DELETE /:id` - Delete vehicle (admin)

### Booking Routes (`/api/bookings`)
- `POST /user-booking` - Create booking (user)
- `GET /my-bookings` - Get user's bookings
- `GET /allBookings` - Get all bookings (admin)
- `GET /:id` - Get booking by ID (admin)
- `PUT /update/:id` - Update booking (admin)
- `DELETE /:id` - Delete booking (admin)
- `POST /admin-booking` - Create booking as admin

### User Routes (`/api/users`)
- `GET /me` - Get current user data
- `POST /upload-license` - Upload license images
- `POST /upload-profile-picture` - Upload profile picture
- `GET /getAllusers` - Get all users (admin)
- `PATCH /verify-license/:userId` - Approve user license (admin)
- `PATCH /reject-license/:userId` - Reject user license (admin)

## 📧 Support

For technical support:
- Email: surfyourride@gmail.com
- Create an issue on GitHub

---

Built with Node.js, Express, and MongoDB for scalable vehicle rental operations.