// server.js - Main application file
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// Sample coupon data - Requirement 1: Maintain a list of available coupons
const coupons = [
  { code: 'SAVE10', description: '10% off your purchase' },
  { code: 'FREESHIP', description: 'Free shipping on orders over $25' },
  { code: 'BOGO50', description: 'Buy one get one 50% off' },
  { code: 'EXTRA15', description: '15% off for new customers' },
  { code: '5OFFNOW', description: '$5 off your purchase' }
];

// In-memory storage (would use a database in production)
const userClaims = new Map(); // Store IP addresses and timestamps
let currentCouponIndex = 0; // For round-robin distribution - Requirement 1: Assign coupons sequentially

// Helper function to check if user can claim a coupon
function canUserClaimCoupon(ip, userIdentifier) {
  const now = Date.now();
  const oneHourInMs = 60 * 60 * 1000;
  
  // Requirement 3: IP Tracking
  const ipLastClaim = userClaims.get(ip);
  if (ipLastClaim && (now - ipLastClaim) < oneHourInMs) {
    return {
      canClaim: false,
      timeRemaining: Math.ceil((ipLastClaim + oneHourInMs - now) / 60000)
    };
  }
  
  // Requirement 3: Cookie Tracking
  const cookieLastClaim = userClaims.get(userIdentifier);
  if (cookieLastClaim && (now - cookieLastClaim) < oneHourInMs) {
    return {
      canClaim: false,
      timeRemaining: Math.ceil((cookieLastClaim + oneHourInMs - now) / 60000)
    };
  }
  
  return { canClaim: true };
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Requirement 2: Allow guest access - no login required
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/claim', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'claim.html'));
});

app.get('/status', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'status.html'));
});

app.get('/coupons', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'available-coupons.html'));
});

// API endpoint to get all coupons (for display purposes)
app.get('/api/coupons', (req, res) => {
  res.json(coupons);
});

app.get("/status", (req, res) => {
  // Example response (modify as needed)
  res.json({ success: true, message: "Your coupon claim is being processed." });
});


// API endpoint to check claim status
app.get('/api/check-status', (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  let userIdentifier = req.cookies.userIdentifier;
  
  if (!userIdentifier) {
    return res.json({ canClaim: true });
  }
  
  const claimCheck = canUserClaimCoupon(ip, userIdentifier);
  res.json(claimCheck);
});

// Requirement 4: Provide clear messages on claim success or time remaining
app.post('/api/claim-coupon', (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  let userIdentifier = req.cookies.userIdentifier;
  
  // If no cookie exists, create one
  if (!userIdentifier) {
    userIdentifier = uuidv4();
    res.cookie('userIdentifier', userIdentifier, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
  }
  
  // Check if user can claim a coupon
  const claimCheck = canUserClaimCoupon(ip, userIdentifier);
  
  if (!claimCheck.canClaim) {
    return res.status(429).json({
      success: false,
      message: `You've already claimed a coupon. Please wait ${claimCheck.timeRemaining} minutes before claiming another.`
    });
  }
  
  // Get next coupon in round-robin fashion
  const coupon = coupons[currentCouponIndex];
  currentCouponIndex = (currentCouponIndex + 1) % coupons.length;
  
  // Record the claim
  userClaims.set(ip, Date.now());
  userClaims.set(userIdentifier, Date.now());
  
  // Return the coupon
  res.json({
    success: true,
    coupon: coupon
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});