# Round-Robin Coupon Distribution System

This web application distributes coupons to users in a round-robin fashion, with built-in mechanisms to prevent abuse. Users can claim coupons without needing to create accounts or log in.

## Features

- Distributes coupons sequentially in a round-robin fashion
- Guest access without login requirements
- Abuse prevention through IP tracking and browser cookies
- Clear user feedback messages
- Responsive design that works on mobile and desktop

## Abuse Prevention Strategies

This application implements multiple layers of abuse prevention:

1. **IP Address Tracking**:
   - Each IP address can only claim one coupon per hour
   - The system tracks the timestamp of each claim and enforces the time restriction
   - Even if a user refreshes the page or clears cookies, they cannot claim another coupon from the same IP within the time limit

2. **Browser Cookie Tracking**:
   - A cookie is set in the user's browser upon claiming a coupon
   - The cookie persists for 24 hours, preventing multiple claims from the same browser session
   - This adds a second layer of protection in addition to IP tracking

3. **Combined Approach**:
   - By combining both methods, the system can effectively prevent common abuse scenarios
   - IP tracking prevents multiple claims from different browsers on the same network
   - Cookie tracking prevents claims after IP address changes (like switching networks)

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- npm (Node Package Manager)

### Installation

1. Clone the repository or download the source code
   ```
   git clone <repository-url>
   ```
   
2. Navigate to the project directory
   ```
   cd coupon-distribution-system
   ```
   
3. Install dependencies
   ```
   npm install express fs path cookie-parser
   ```
   
4. Create necessary files if they don't exist
   ```
   echo [] > coupons.json
   echo {} > ip-claims.json
   ```
   
5. Update coupons.json with your own coupon codes (optional)
   ```json
   [
     { "code": "SAVE10", "description": "10% off your purchase" },
     { "code": "FREESHIP", "description": "Free shipping on orders over $50" },
     { "code": "BOGO50", "description": "Buy one get one 50% off" },
     { "code": "WELCOME15", "description": "15% off for new customers" },
     { "code": "FLASH25", "description": "25% off flash sale" }
   ]
   ```

### Running Locally

1. Start the server
   ```
   node server.js
   ```
   
2. Open your browser and navigate to `http://localhost:3000`

### Deployment

To deploy this application to a public URL:

#### Option 1: Hosting on Heroku

1. Create a Heroku account if you don't have one
2. Install the Heroku CLI
3. Login to Heroku
   ```
   heroku login
   ```
4. Create a new Heroku app
   ```
   heroku create your-app-name
   ```
5. Add a Procfile in the root directory
   ```
   echo "web: node server.js" > Procfile
   ```
6. Commit and push to Heroku
   ```
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku master
   ```

#### Option 2: Hosting on Render, Netlify, or Vercel

1. Create an account on your preferred platform
2. Connect your GitHub repository
3. Set the build command (typically not needed for this application)
4. Set the start command to `node server.js`
5. Deploy the application

## Testing the Application

To test the abuse prevention mechanisms:

1. Claim a coupon normally
2. Try refreshing the page - you should see a message indicating you've already claimed a coupon
3. Open the application in a different browser - you should be blocked by IP restrictions
4. If you wait for the time limit to expire, you should be able to claim another coupon

## Customization

You can customize the application by:

1. Modifying the coupon list in `coupons.json`
2. Adjusting the time restrictions in `server.js` (the variable `oneHour`)
3. Changing the styling in `styles.css`
4. Adding additional features like coupon expiration dates or usage limits