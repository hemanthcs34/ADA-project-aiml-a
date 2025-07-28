# 🚀 Deployment Guide

This guide will help you deploy your Smart Scheduler application to various hosting platforms.

## 📋 Prerequisites

Before deploying, ensure you have:
- A MongoDB database (local or cloud)
- Node.js application ready
- Environment variables configured

## 🌐 Deployment Options

### 1. Heroku Deployment

#### Setup Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Add MongoDB addon (MongoDB Atlas)
heroku addons:create mongolab:sandbox
```

#### Configure Environment Variables
```bash
# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set PORT=3000
```

#### Deploy
```bash
# Add all files
git add .

# Commit changes
git commit -m "Initial deployment"

# Push to Heroku
git push heroku main

# Open the app
heroku open
```

### 2. Vercel Deployment

#### Setup Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

#### Configure Environment Variables
- Go to Vercel Dashboard
- Navigate to your project
- Go to Settings > Environment Variables
- Add your MongoDB URI and other variables

### 3. Railway Deployment

#### Setup Railway
1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add MongoDB service
4. Configure environment variables

#### Environment Variables
```env
MONGO_URI=your_mongodb_connection_string
NODE_ENV=production
PORT=3000
```

### 4. DigitalOcean App Platform

#### Setup
1. Go to DigitalOcean App Platform
2. Connect your repository
3. Choose Node.js environment
4. Add MongoDB database
5. Configure environment variables

### 5. AWS Deployment

#### Using Elastic Beanstalk
```bash
# Install EB CLI
pip install awsebcli

# Initialize EB application
eb init

# Create environment
eb create production

# Deploy
eb deploy
```

#### Using EC2
```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js and MongoDB
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone your repository
git clone your-repo-url
cd your-project

# Install dependencies
npm install

# Set up environment variables
nano .env

# Install PM2 for process management
npm install -g pm2

# Start the application
pm2 start server.js
pm2 startup
pm2 save
```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended for Production)

1. **Create Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account

2. **Create Cluster**
   - Choose free tier (M0)
   - Select your preferred region
   - Create cluster

3. **Configure Network Access**
   - Go to Network Access
   - Add IP address (0.0.0.0/0 for all access)

4. **Create Database User**
   - Go to Database Access
   - Create a new user with read/write permissions

5. **Get Connection String**
   - Go to Clusters
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

6. **Update Environment Variables**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-scheduler
   ```

### Local MongoDB (Development)

```bash
# Install MongoDB
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb-community

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## 🔧 Environment Configuration

### Production Environment Variables
```env
MONGO_URI=your_production_mongodb_uri
NODE_ENV=production
PORT=3000
```

### Development Environment Variables
```env
MONGO_URI=mongodb://localhost:27017/smart-scheduler
NODE_ENV=development
PORT=3000
```

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files to version control
- Use platform-specific secret management
- Rotate database credentials regularly

### Database Security
- Use strong passwords
- Enable network access restrictions
- Use SSL/TLS connections
- Regular backups

### Application Security
- Enable CORS properly
- Validate all inputs
- Use HTTPS in production
- Implement rate limiting

## 📊 Monitoring and Logging

### Application Monitoring
```bash
# Install monitoring tools
npm install -g pm2

# Monitor application
pm2 monit

# View logs
pm2 logs
```

### Database Monitoring
- Use MongoDB Atlas monitoring (if using Atlas)
- Set up alerts for connection issues
- Monitor database performance

## 🔄 Continuous Deployment

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    
    - name: Install dependencies
      run: npm install
    
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
        heroku_app_name: ${{ secrets.HEROKU_APP_NAME }}
        heroku_email: ${{ secrets.HEROKU_EMAIL }}
```

## 🐛 Troubleshooting

### Common Deployment Issues

1. **Port Issues**
   ```bash
   # Check if port is in use
   lsof -i :3000
   
   # Kill process using port
   kill -9 <PID>
   ```

2. **Database Connection Issues**
   - Verify connection string
   - Check network access
   - Ensure database is running

3. **Environment Variables**
   - Verify all required variables are set
   - Check for typos in variable names
   - Ensure proper formatting

4. **Build Issues**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📈 Performance Optimization

### Production Optimizations
- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies
- Optimize database queries
- Use PM2 for process management

### Monitoring Tools
- New Relic
- DataDog
- Sentry for error tracking
- MongoDB Compass for database monitoring

---

**Happy Deploying! 🚀** 