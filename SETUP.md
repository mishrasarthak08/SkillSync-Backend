# Database Setup Guide

## Quick Setup Options

### Option 1: PostgreSQL (Recommended for Production)

1. **Install PostgreSQL:**
   - macOS: `brew install postgresql` then `brew services start postgresql`
   - Ubuntu: `sudo apt-get install postgresql postgresql-contrib`
   - Windows: Download from https://www.postgresql.org/download/

2. **Create Database:**
   ```bash
   # Connect to PostgreSQL
   psql postgres
   
   # Create database
   CREATE DATABASE capstone_db;
   
   # Create user (optional)
   CREATE USER capstone_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE capstone_db TO capstone_user;
   ```

3. **Update .env file:**
   ```env
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/capstone_db?schema=public"
   PORT=3000
   NODE_ENV=development
   JWT_SECRET="your-super-secret-jwt-key"
   ```

4. **Run Migrations:**
   ```bash
   npm run prisma:migrate
   ```

### Option 2: SQLite (Easier for Development)

1. **Update `prisma/schema.prisma`:**
   Change `provider = "postgresql"` to `provider = "sqlite"`

2. **Update .env file:**
   ```env
   DATABASE_URL="file:./dev.db"
   PORT=3000
   NODE_ENV=development
   JWT_SECRET="your-super-secret-jwt-key"
   ```

3. **Run Migrations:**
   ```bash
   npm run prisma:migrate
   ```

## Troubleshooting

### Error: "URL must start with the protocol postgresql://"
- Make sure your DATABASE_URL in .env starts with `postgresql://` or `postgres://`
- Check that there are no extra spaces or quotes issues

### Error: "Connection refused"
- Make sure PostgreSQL is running: `brew services list` (macOS) or `sudo systemctl status postgresql` (Linux)
- Verify the host, port, username, and password in your DATABASE_URL

### Error: "Database does not exist"
- Create the database first using the commands above
- Or let Prisma create it by running migrations

