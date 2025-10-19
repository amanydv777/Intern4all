# Quick Start Guide - Intern4All

Get up and running with Intern4All in under 5 minutes!

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js (v14+) installed
- ✅ MongoDB running (local or Atlas)
- ✅ Terminal/Command Prompt access

## 🚀 Super Quick Start (3 Steps)

### Step 1: Run Setup Script

```bash
chmod +x setup.sh
./setup.sh
```

The script will automatically:
- Install all dependencies
- Create environment files
- Generate secure keys
- Seed the database (optional)

### Step 2: Start Backend

```bash
cd backend
npm run dev
```

Wait for: `✅ MongoDB Connected` and `🚀 Server running`

### Step 3: Start Frontend

Open a new terminal:

```bash
npm start
```

Browser opens automatically at `http://localhost:3000`

## 🎉 You're Done!

**Login with:**
- Email: `aman@example.com`
- Password: `password`

---

## 📝 Manual Quick Start

If the script doesn't work, follow these steps:

### 1. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### 2. Create Environment Files

**Frontend `.env`:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GEMINI_API_KEY=AIzaSyBe5lGUCkiDO7cBphomKyUeU-9dYevXQ80
```

**Backend `.env`:**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and update:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 3. Seed Database

```bash
cd backend
node seeder.js -i
cd ..
```

### 4. Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm start
```

## ✅ Verify Installation

1. **Backend Health Check:**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Frontend:** Open `http://localhost:3000`

3. **Login:** Use `aman@example.com` / `password`

## 🔧 Quick Troubleshooting

### MongoDB Not Running?

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Port Already in Use?

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Dependencies Issue?

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Same for backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

## 📚 Next Steps

- 📖 Read the [Full Installation Guide](./INSTALLATION.md)
- 📖 Check the [Main README](./README.md)
- 📖 Review [Backend API Docs](./backend/README.md)

## 🎯 Test Accounts

After seeding, you can use:

**Regular User:**
- Email: `aman@example.com`
- Password: `password`

**Admin:**
- Email: `admin@intern4all.com`
- Password: `password123`

**Company:**
- Email: `company@example.com`
- Password: `password123`

## 🌟 Key Features to Try

1. ✨ Complete your profile (Profile page)
2. 🎯 Get AI-powered internship recommendations
3. 📝 Apply to internships
4. 💬 Chat with AI assistant
5. 🌐 Try different languages (globe icon)

## 📞 Need Help?

- Check [INSTALLATION.md](./INSTALLATION.md) for detailed guide
- Review error messages in terminal
- Check browser console (F12)
- Ensure MongoDB is running
- Verify both servers are running

---

**Happy Coding! 🚀**
