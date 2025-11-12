#!/bin/bash

echo "🚀 Setting up PostgreSQL database for Capstone project"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed or not in PATH"
    echo "Please install PostgreSQL first:"
    echo "  macOS: brew install postgresql"
    echo "  Ubuntu: sudo apt-get install postgresql"
    echo "  Windows: Download from https://www.postgresql.org/download/"
    exit 1
fi

echo "✅ PostgreSQL is installed"
echo ""

# Prompt for database credentials
read -p "Enter PostgreSQL username (default: postgres): " DB_USER
DB_USER=${DB_USER:-postgres}

read -sp "Enter PostgreSQL password: " DB_PASSWORD
echo ""

read -p "Enter database name (default: capstone_db): " DB_NAME
DB_NAME=${DB_NAME:-capstone_db}

read -p "Enter PostgreSQL host (default: localhost): " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Enter PostgreSQL port (default: 5432): " DB_PORT
DB_PORT=${DB_PORT:-5432}

# Create DATABASE_URL
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"

echo ""
echo "📝 Updating .env file..."
cat > .env << EOF
DATABASE_URL="${DATABASE_URL}"
PORT=3000
NODE_ENV=development
JWT_SECRET="$(openssl rand -base64 32)"
EOF

echo "✅ .env file updated"
echo ""

# Try to create database
echo "🔧 Creating database..."
export PGPASSWORD="${DB_PASSWORD}"
if psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'" | grep -q 1; then
    echo "⚠️  Database '${DB_NAME}' already exists"
else
    if psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d postgres -c "CREATE DATABASE ${DB_NAME}"; then
        echo "✅ Database '${DB_NAME}' created successfully"
    else
        echo "❌ Failed to create database. Please create it manually:"
        echo "   psql -U ${DB_USER} -c 'CREATE DATABASE ${DB_NAME};'"
    fi
fi

echo ""
echo "📦 Running Prisma migrations..."
npm run prisma:migrate

echo ""
echo "✅ Setup complete!"
echo "You can now start the server with: npm run dev"

