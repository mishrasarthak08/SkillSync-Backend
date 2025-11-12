# Backend Server

Express.js backend with PostgreSQL and Prisma ORM.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the backend directory with:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
   PORT=3000
   NODE_ENV=development
   ```

3. **Set up PostgreSQL database:**
   - Make sure PostgreSQL is installed and running
   - Create a database for your project
   - Update the `DATABASE_URL` in your `.env` file

4. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

5. **Run migrations:**
   ```bash
   npm run prisma:migrate
   ```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Project Structure

```
backend/
├── src/
│   ├── prisma/
│   │   └── client.ts      # Prisma client instance
│   └── server.ts          # Express server
├── prisma/
│   └── schema.prisma      # Database schema
├── dist/                  # Compiled output
└── package.json
```

