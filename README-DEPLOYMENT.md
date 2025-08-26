# Degree Tracker - Deployment Guide

## 🚀 Deploy to Vercel

This application is ready for deployment to Vercel with zero configuration required.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Vercel CLI](https://vercel.com/cli) (optional but recommended)
- Git repository (GitHub, GitLab, or Bitbucket)

### Quick Deploy (Recommended)

#### Option 1: GitHub Integration (Easiest)
1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AI Degree Tracker"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/degree-tracker.git
   git push -u origin main
   ```

2. **Deploy via Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the configuration
   - Click "Deploy"

#### Option 2: Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to project directory
cd /path/to/degree-tracker

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Manual Configuration

If you need to customize the deployment:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Test locally:**
   ```bash
   npm run dev
   # Opens on http://localhost:3000
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

### Environment Setup

The app runs entirely client-side, so no environment variables are required. However, for enhanced functionality:

#### Optional Enhancements
```bash
# .env.local (if you add server-side features later)
# NEXT_PUBLIC_API_URL=https://your-api.com
# NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## 📁 File Structure

```
degree-tracker/
├── index.html              # Main application entry point
├── styles.css              # Complete styling and themes
├── app.js                  # Core application logic (DegreeTracker class)
├── data.js                 # Student data and degree requirements
├── ai-assistant.js         # Enhanced AI assistant with NLP
├── requirements-parser.js  # University catalog URL parsing
├── vercel.json            # Vercel deployment configuration
├── package.json           # NPM configuration and scripts
├── .gitignore             # Git ignore patterns
├── README.md              # Main project documentation
├── README-DEPLOYMENT.md   # This deployment guide
└── CLAUDE.md              # Development guidance for Claude Code
```

## ⚙️ Vercel Configuration

### vercel.json Features
- **Static Site**: Configured as a static HTML/CSS/JS application
- **SPA Routing**: All routes redirect to index.html for client-side routing
- **Security Headers**: X-Content-Type-Options, X-Frame-Options, XSS-Protection
- **Caching**: Optimized cache headers for static assets
- **HTTPS**: Automatic SSL certificate provisioning

### Performance Optimizations
- **CDN**: Global edge distribution via Vercel's CDN
- **Compression**: Automatic gzip/brotli compression
- **Image Optimization**: Ready for Vercel's image optimization
- **Edge Functions**: Prepared for serverless functions if needed

## 🛠️ Development Scripts

```bash
# Local development server
npm run dev          # Port 3000

# Production preview
npm start           # Port 8080

# Deploy to Vercel preview
npm run deploy-dev

# Deploy to Vercel production  
npm run deploy

# Lint JavaScript files
npm run lint
```

## 🌍 Domain Configuration

### Custom Domain Setup
1. **Add domain in Vercel dashboard:**
   - Project Settings → Domains
   - Add your custom domain
   - Configure DNS records as instructed

2. **DNS Configuration:**
   ```
   Type: CNAME
   Name: www (or subdomain)
   Value: cname.vercel-dns.com
   ```

### Suggested Domains
- `maya-degree-tracker.vercel.app`
- `northeastern-planner.vercel.app`
- `ai-degree-tracker.com`

## 🔒 Security & Privacy

### Client-Side Only
- No server-side data processing
- No external API calls (except optional URL parsing)
- All data stored in browser localStorage only
- GDPR compliant (no personal data transmission)

### Security Headers (Configured)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## 📊 Analytics & Monitoring

### Add Analytics (Optional)
```html
<!-- Add to index.html before closing </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### Vercel Analytics
Enable in Vercel dashboard → Project → Analytics for:
- Page views and user sessions
- Performance metrics
- Geographic usage data

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### CORS Issues (URL Parsing)
The requirements parser may face CORS limitations. Solutions:
1. Use server-side proxy for production
2. Implement Vercel Edge Functions
3. Manual requirement input as fallback

#### Local Development
```bash
# If http-server fails
npx serve . -p 3000

# Alternative servers
python3 -m http.server 8000
php -S localhost:8000
```

## 📈 Post-Deployment

### Performance Optimization
1. **Lighthouse Score**: Aim for 90+ in all categories
2. **Bundle Size**: Monitor with Vercel analytics
3. **Loading Speed**: Optimize with lazy loading if needed

### SEO Enhancement
```html
<!-- Add to index.html <head> -->
<meta name="description" content="AI-powered degree tracking for Northeastern University Computer Science students">
<meta name="keywords" content="degree tracker, northeastern, computer science, academic planning">
<meta property="og:title" content="Maya's AI Degree Tracker">
<meta property="og:description" content="Track multiple degree programs with AI assistance">
<meta property="og:image" content="/screenshot.png">
```

### Backup Strategy
- Regular GitHub commits
- Export student data functionality
- Vercel automatic backups

## 📞 Support

### Issues and Updates
- GitHub Issues: Report bugs and feature requests
- Vercel Dashboard: Monitor deployment status
- Console Logs: Debug client-side issues

### Updates and Maintenance
```bash
# Update dependencies
npm update

# Security audit
npm audit

# Deploy updates
git push origin main  # Auto-deploys via GitHub integration
```

---

**🎓 Ready to deploy your AI-powered degree tracker!**

The application will be available at: `https://your-project-name.vercel.app`