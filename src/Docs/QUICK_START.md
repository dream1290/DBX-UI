# Quick Start Guide

## 🚀 Push to GitHub

### 1. Create Repository on GitHub

Go to: https://github.com/new

**Settings:**
- Repository name: `dbx-ui`
- Description: `DBX Aviation Analytics Platform - Modern React application for flight data analysis`
- Visibility: Public (or Private)
- **DO NOT** check "Initialize with README"

Click **"Create repository"**

### 2. Push Your Code

```bash
# Push to GitHub
git push -u origin main
```

That's it! Your code will be at: https://github.com/dream1290/dbx-ui

---

## 🏗️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

---

## 📦 Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🌐 Deploy to Production

### Option 1: Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

Set environment variable in Vercel dashboard:
- `VITE_API_URL` = `https://dbx-system-production.up.railway.app`

### Option 2: Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

Set environment variable in Netlify dashboard:
- `VITE_API_URL` = `https://dbx-system-production.up.railway.app`

---

## 🔑 Environment Variables

Create `.env` file:

```env
VITE_API_URL=https://dbx-system-production.up.railway.app
```

---

## 👥 User Roles

Test with different roles:

1. **System Administrator** - Full access
2. **Safety Analyst** - Flight analysis focus
3. **Fleet Manager** - Fleet management focus
4. **Data Analyst** - Data and reports focus
5. **Viewer** - Read-only access

---

## 📚 Documentation

- **README.md** - Project overview
- **DEPLOYMENT.md** - Deployment guide
- **ROLE_BASED_ROUTING.md** - RBAC documentation
- **MIGRATION.md** - API integration guide
- **GITHUB_SETUP.md** - GitHub setup instructions

---

## 🆘 Need Help?

Check the documentation files or create an issue on GitHub.

---

## ✅ Checklist

- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Set up environment variables
- [ ] Deploy to hosting platform
- [ ] Test production deployment
- [ ] Verify all features work
- [ ] Share repository link

---

**Repository:** https://github.com/dream1290/dbx-ui
**Backend:** https://dbx-system-production.up.railway.app
**Author:** [@dream1290](https://github.com/dream1290)
