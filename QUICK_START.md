# Quick Start - Fix Database Connection

## The Problem
Your CRUD operations aren't working because the database connection is not configured correctly.

## Quick Fix (Choose One)

### Option A: Use SQLite (Easiest - No Installation Needed)

1. **Update `prisma/schema.prisma`:**
   - Change line 12 from: `provider = "postgresql"`
   - To: `provider = "sqlite"`

2. **Update `.env` file:**
   ```env
   DATABASE_URL="file:./dev.db"
   PORT=3000
   NODE_ENV=development
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   ```

3. **Run migrations:**
   ```bash
   cd backend
   npm run prisma:migrate
   ```
   (Name it "init" when prompted)

4. **Restart your server** - CRUD operations should now work!

### Option B: Use PostgreSQL (More Production-Ready)

1. **Install PostgreSQL:**
   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql
   
   # Create database
   createdb capstone_db
   ```

2. **Update `.env` file with your credentials:**
   ```env
   DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/capstone_db?schema=public"
   PORT=3000
   NODE_ENV=development
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   ```
   
   Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your PostgreSQL credentials.
   Default user is usually `postgres` or your macOS username.

3. **Run migrations:**
   ```bash
   cd backend
   npm run prisma:migrate
   ```

4. **Restart your server**

## After Setup

Once you've chosen an option and run migrations, restart your backend server:
```bash
cd backend
npm run dev
```

Your login/signup should now work!

