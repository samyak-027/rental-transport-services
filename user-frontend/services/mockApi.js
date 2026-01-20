import { UserRole, LicenseStatus, VehicleType } from '../types.js';

// Initial Mock Data - Expanded to 15 vehicles
const INITIAL_VEHICLES = [
  // Cars
  { 
    id: '1', name: 'Tesla Model 3', type: VehicleType.CAR, image: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&q=80&w=800', 
    pricePerDay: 120, fuelType: 'Electric', seats: 5, transmission: 'Automatic', location: 'New York', available: true,
    year: 2023, mileage: 15000, features: ['Autopilot', 'GPS', 'Bluetooth']
  },
  { 
    id: '2', name: 'Ford Mustang GT', type: VehicleType.CAR, image: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&q=80&w=800', 
    pricePerDay: 150, fuelType: 'Petrol', seats: 4, transmission: 'Manual', location: 'Los Angeles', available: true,
    year: 2022, mileage: 22000, features: ['V8 Engine', 'Convertible', 'Sport Mode']
  },
  { 
    id: '3', name: 'BMW 5 Series', type: VehicleType.CAR, image: 'https://images.unsplash.com/photo-1555215695-3004980adade?auto=format&fit=crop&q=80&w=800', 
    pricePerDay: 180, fuelType: 'Diesel', seats: 5, transmission: 'Automatic', location: 'Miami', available: true,
    year: 2023, mileage: 8000, features: ['Leather Seats', 'Sunroof', 'Heated Seats']
  },
  { 
    id: '4', name: 'Honda Civic', type: VehicleType.CAR, image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800', 
    pricePerDay: 60, fuelType: 'Petrol', seats: 5, transmission: 'Automatic', location: 'New York', available: true,
    year: 2021, mileage: 45000, features: ['Economy Mode', 'Bluetooth', 'Backup Camera']
  },
  
  // Bikes
  { 
    id: '5', name: 'Harley Davidson', type: VehicleType.BIKE, image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800', 
    pricePerDay: 80, fuelType: 'Petrol', seats: 2, transmission: 'Manual', location: 'Las Vegas', available: true,
    year: 2020, mileage: 12000, features: ['Saddlebags', 'Cruise Control']
  },
  { 
    id: '6', name: 'Ducati Panigale V4', type: VehicleType.BIKE, image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800', 
    pricePerDay: 250, fuelType: 'Petrol', seats: 1, transmission: 'Manual', location: 'Los Angeles', available: true,
    year: 2024, mileage: 2000, features: ['Sport ABS', 'Traction Control']
  },
  { 
    id: '7', name: 'Vespa Primavera', type: VehicleType.BIKE, image: 'https://images.unsplash.com/photo-1623057000025-a1d293237f86?auto=format&fit=crop&q=80&w=800', 
    pricePerDay: 40, fuelType: 'Petrol', seats: 2, transmission: 'Automatic', location: 'Miami', available: true,
    year: 2022, mileage: 5000, features: ['Storage Box', 'USB Port']
  },

  // SUVs
  { 
    id: '8', name: 'Toyota Land Cruiser', type: VehicleType.SUV, image: 'https://images.unsplash.com/photo-1594235045816-33cb368371e2?auto=format&fit=crop&q=80&w=800', 
    pricePerDay: 200, fuelType: 'Diesel', seats: 7, transmission: 'Automatic', location: 'Dubai', available: true,
    year: 2023, mileage: 10000, features: ['4x4', 'Roof Rack', 'Tow Hitch']
  },
  { 
    id: '9', name: 'Range Rover Sport', type: VehicleType.SUV, image: 'https://images.unsplash.com/photo-1606220838315-056192d5e927?auto=format&fit=crop&q=80&w=800', 
    pricePerDay: 280, fuelType: 'Hybrid', seats: 5, transmission: 'Automatic', location: 'New York', available: true,
    year: 2024, mileage: 3000, features: ['Massage Seats', 'Panoramic Roof', 'Off-road Mode']
  },
  { 
    id: '10', name: 'Jeep Wrangler', type: VehicleType.SUV, image: 'https://images.unsplash.com/photo-1533591380348-1419391b0c0f?auto=format&fit=crop&q=80&w=800', 
    pricePerDay: 130, fuelType: 'Petrol', seats: 4, transmission: 'Automatic', location: 'Los Angeles', available: true,
    year: 2021, mileage: 35000, features: ['Removable Top', '4WD', 'All-terrain Tires']
  },

  // Buses & Vans
  { 
    id: '11', name: 'Mercedes Sprinter', type: VehicleType.BUS, image: 'https://images.unsplash.com/photo-1566008885218-90abf9200ddb?auto=format&fit=crop&q=80&w=800', 
    pricePerDay: 180, fuelType: 'Diesel', seats: 12, transmission: 'Automatic', location: 'Las Vegas', available: true,
    year: 2020, mileage: 50000, features: ['High Roof', 'Extra Luggage Space', 'WiFi']
  },

  // Boats
  { 
    id: '12', name: 'Sunseeker Yacht', type: VehicleType.BOAT, image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=800', 
    pricePerDay: 1500, fuelType: 'Diesel', seats: 12, transmission: 'Automatic', location: 'Miami', available: true,
    year: 2019, mileage: 500, features: ['Kitchenette', 'Bedroom', 'Deck']
  },
  { 
    id: '13', name: 'Speedboat Racer', type: VehicleType.BOAT, image: 'https://images.unsplash.com/photo-1563864696-6e3a73c05421?auto=format&fit=crop&q=80&w=800', 
    pricePerDay: 500, fuelType: 'Petrol', seats: 4, transmission: 'Automatic', location: 'Miami', available: true,
    year: 2022, mileage: 100, features: ['Water Ski Gear', 'Sound System']
  },

  // Helicopters
  { 
    id: '14', name: 'Robinson R44', type: VehicleType.HELICOPTER, image: 'https://images.unsplash.com/photo-1542887800-cb03df9d2c6e?auto=format&fit=crop&q=80&w=800', 
    pricePerDay: 2500, fuelType: 'Diesel', seats: 4, transmission: 'Manual', location: 'New York', available: true,
    year: 2021, mileage: 400, features: ['Headsets', 'Scenic View', 'Pilot Included']
  },
  { 
    id: '15', name: 'Bell 407', type: VehicleType.HELICOPTER, image: 'https://images.unsplash.com/photo-1517427294546-5aa12163d952?auto=format&fit=crop&q=80&w=800', 
    pricePerDay: 4000, fuelType: 'Diesel', seats: 6, transmission: 'Manual', location: 'Dubai', available: true,
    year: 2023, mileage: 200, features: ['Luxury Interior', 'Climate Control']
  },
];

const ADMIN_USER = {
  id: 'admin-1',
  username: 'Admin',
  email: 'admin@roamrent.com',
  role: UserRole.ADMIN,
  licenseStatus: LicenseStatus.APPROVED,
  emailVerified: true
};

// Helper to simulate delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to create mock JWT (Base64 encoded JSON)
const createMockJwt = (userId, expiresInSeconds = 3600) => {
    const payload = {
        sub: userId,
        exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
        iat: Math.floor(Date.now() / 1000)
    };
    // Mock signature part
    return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(payload))}.mocksignature`;
};

// --- API Methods ---

export const api = {
  initialize: () => {
    if (!localStorage.getItem('roamrent_vehicles')) {
      localStorage.setItem('roamrent_vehicles', JSON.stringify(INITIAL_VEHICLES));
    }
    if (!localStorage.getItem('roamrent_users')) {
      localStorage.setItem('roamrent_users', JSON.stringify([ADMIN_USER]));
    }
    if (!localStorage.getItem('roamrent_bookings')) {
      localStorage.setItem('roamrent_bookings', JSON.stringify([]));
    }
  },

  // Auth & JWT
  login: async (email, password) => {
    await delay(800);
    const users = JSON.parse(localStorage.getItem('roamrent_users') || '[]');
    const user = users.find((u) => u.email === email);
    
    // Simple password check simulation
    if (user && (password.length >= 3 || password === 'admin123')) {
      // Generate JWT valid for 1 hour (3600s)
      const token = createMockJwt(user.id, 3600); 
      const refreshToken = `refresh_${user.id}_${Date.now()}`;
      return { user, token, refreshToken };
    }
    throw new Error('Invalid credentials');
  },

  refreshToken: async (token, refreshToken) => {
    await delay(500);
    // In a real app, verify refreshToken against DB
    if (refreshToken.startsWith('refresh_')) {
        const userId = refreshToken.split('_')[1];
        // Return new token valid for another hour
        return { token: createMockJwt(userId, 3600) };
    }
    throw new Error('Invalid refresh token');
  },

  signup: async (userData) => {
    await delay(800);
    const users = JSON.parse(localStorage.getItem('roamrent_users') || '[]');
    if (users.find((u) => u.email === userData.email)) {
      throw new Error('User already exists');
    }
    
    const newUser = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      role: UserRole.USER,
      licenseStatus: LicenseStatus.NOT_UPLOADED,
      emailVerified: false
    };
    
    users.push(newUser);
    localStorage.setItem('roamrent_users', JSON.stringify(users));
    
    console.log(`[Brevo Mock] Sending Welcome/OTP email to ${userData.email}. Code: 123456`);
    
    return newUser;
  },

  verifyEmail: async (email, otp) => {
    await delay(1000);
    if (otp === '123456') {
        const users = JSON.parse(localStorage.getItem('roamrent_users') || '[]');
        const index = users.findIndex((u) => u.email === email);
        if (index !== -1) {
            users[index].emailVerified = true;
            localStorage.setItem('roamrent_users', JSON.stringify(users));
            return true;
        }
    }
    return false;
  },

  forgotPassword: async (email) => {
      await delay(800);
      const users = JSON.parse(localStorage.getItem('roamrent_users') || '[]');
      const user = users.find((u) => u.email === email);
      if (user) {
          console.log(`[Brevo Mock] Sending Password Reset OTP to ${email}. Code: 123456`);
      } else {
          // Security practice: Don't reveal user existence, but log it internally
          console.log(`[Mock] Forgot password requested for non-existent email: ${email}`);
      }
      return;
  },

  resetPassword: async (email, otp, newPassword) => {
      await delay(1000);
      if (otp === '123456') {
          const users = JSON.parse(localStorage.getItem('roamrent_users') || '[]');
          const index = users.findIndex((u) => u.email === email);
          if (index !== -1) {
             // In real app, we would hash the password here
             console.log(`[Mock] Password updated for ${email}`);
             return true;
          }
      }
      return false;
  },

  // Vehicles
  getVehicles: async () => {
    await delay(500);
    return JSON.parse(localStorage.getItem('roamrent_vehicles') || '[]');
  },

  addVehicle: async (vehicle) => {
    await delay(500);
    const vehicles = JSON.parse(localStorage.getItem('roamrent_vehicles') || '[]');
    vehicles.push(vehicle);
    localStorage.setItem('roamrent_vehicles', JSON.stringify(vehicles));
    return vehicle;
  },

  deleteVehicle: async (id) => {
     await delay(300);
     let vehicles = JSON.parse(localStorage.getItem('roamrent_vehicles') || '[]');
     vehicles = vehicles.filter((v) => v.id !== id);
     localStorage.setItem('roamrent_vehicles', JSON.stringify(vehicles));
  },

  // Users & License
  updateProfile: async (userId, updates) => {
    await delay(600);
    const users = JSON.parse(localStorage.getItem('roamrent_users') || '[]');
    const index = users.findIndex((u) => u.id === userId);
    
    if (index === -1) throw new Error('User not found');
    
    const updatedUser = { ...users[index], ...updates };
    
    // Auto-set status to pending if license images are uploaded
    if (updates.licenseFront && updates.licenseBack) {
      updatedUser.licenseStatus = LicenseStatus.PENDING;
    }

    users[index] = updatedUser;
    localStorage.setItem('roamrent_users', JSON.stringify(users));
    return updatedUser;
  },

  getAllUsers: async () => {
    await delay(500);
    return JSON.parse(localStorage.getItem('roamrent_users') || '[]');
  },

  verifyUserLicense: async (userId, status) => {
    await delay(500);
    const users = JSON.parse(localStorage.getItem('roamrent_users') || '[]');
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error('User not found');
    
    users[index].licenseStatus = status;
    localStorage.setItem('roamrent_users', JSON.stringify(users));
    return users[index];
  },

  // Bookings
  createBooking: async (booking) => {
    await delay(1000);
    const bookings = JSON.parse(localStorage.getItem('roamrent_bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('roamrent_bookings', JSON.stringify(bookings));
    
    // Simulate Brevo booking confirmation
    console.log(`[Brevo Mock] Sending Booking Confirmation to user ${booking.userId}`);
    
    return booking;
  },

  getUserBookings: async (userId) => {
    await delay(400);
    const bookings = JSON.parse(localStorage.getItem('roamrent_bookings') || '[]');
    return bookings.filter((b) => b.userId === userId).reverse();
  },

  getAllBookings: async () => {
    await delay(400);
    return JSON.parse(localStorage.getItem('roamrent_bookings') || '[]').reverse();
  }
};