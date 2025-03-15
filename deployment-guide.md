# Deployment Guide

This document provides detailed instructions on deploying the Coupon Distribution System to a live web server. There are several options available depending on your budget and technical preferences.

## Option 1: Render.com (Recommended for Free Deployment)

Render provides a user-friendly platform with a free tier suitable for this application.

### Steps:

1. **Create an account** on [Render](https://render.com/) if you don't already have one

2. **Create a new Web Service**:
   - Click on "New" in the dashboard
   - Select "Web Service"
   - Connect your GitHub repository or use the manual deploy option

3. **Configure the service**:
   - Name: `coupon-distribution` (or your preferred name)
   - Region: Choose the closest to your target audience
   - Branch: `main` (or your default branch)
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Create Web Service** and wait for deployment to complete

5. **Access your app** at the URL provided by Render (typically `https://your-service-name.onrender.com`)

## Option 2: Heroku

Heroku is another popular platform for Node.js applications, though it now requires a credit card for verification even on the free tier.

### Steps:

1. **Create a Heroku account** at [heroku.com](https://heroku.com/)

2. **Install the Heroku CLI** from [devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli)

3. **Login to Heroku CLI**:
   ```
   heroku login
   ```

4. **Create a new Heroku app**:
   ```
   cd your-project-directory
   heroku create your-app-name
   ```

5. **Deploy the application**:
   ```
   git push heroku main
   ```

6. **Open the application**:
   ```
   heroku open
   ```

## Option 3: Netlify + Serverless Functions

For a more modern approach, you can use Netlify with serverless functions.

### Steps:

1. **Create a netlify.toml file** in your project root:
   ```toml
   [build]
     publish = "public"
     functions = "netlify/functions"
   
   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200
   ```

2. **Modify your server code** to work as a serverless function in `netlify/functions/api.js`

3. **Deploy to Netlify**:
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set publish directory: `public`

## Option 4: AWS Elastic Beanstalk

For a more robust solution that can scale:

1. **Install the AWS CLI** and set up credentials

2. **Install the EB CLI**:
   ```
   pip install awsebcli
   ```

3. **Initialize EB**:
   ```
   cd your-project-directory
   eb init
   ```

4. **Create an environment**:
   ```
   eb create coupon-distribution-env
   ```

5. **Deploy**:
   ```
   eb deploy
   ```

## Environment Variables

If you need to configure environment variables (for example, to change the port):

- **Render**: Set in the dashboard under "Environment"
- **Heroku**: Use `heroku config:set PORT=3000`
- **Netlify**: Set in the site dashboard under "Site settings" → "Build & deploy" → "Environment"
- **AWS EB**: Use the EB CLI with `eb setenv PORT=3000`

## Domain Setup

To use a custom domain:

1. **Purchase a domain** from a domain registrar (Namecheap, GoDaddy, etc.)
2. **Configure DNS settings** to point to your deployment platform:
   - For Render: Add a CNAME record pointing to your render URL
   - For Heroku: Add a CNAME record pointing to your heroku app
3. **Set up SSL** (Usually handled automatically by the platform)

## Post-Deployment Testing

After deploying, test your application to ensure:

1. The application loads correctly
2. Coupons can be claimed successfully
3. Abuse prevention mechanisms are working
4. The application persists coupon data between restarts

## Monitoring and Maintenance

- Set up monitoring to ensure the application remains running
- Implement logging to track usage and potential issues
- Regularly update dependencies to maintain security
