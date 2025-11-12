import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../prisma/client.js';
import { supabase, supabaseAdmin } from '../lib/supabase.js';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Health check
router.get('/health', (_req, res) => {
  return res.json({ status: 'ok' });
});

// Temporary: list users for debugging (dev only)
router.get('/users', async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, createdAt: true },
      orderBy: { id: 'desc' },
      take: 50,
    });
    return res.json({ users });
  } catch (error: any) {
    console.error('List users error:', error);
    return res.status(500).json({ error: 'Failed to list users' });
  }
});

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: name || null },
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const user = data.user;
    if (!user) {
      return res.status(500).json({ error: 'Signup failed' });
    }

    // Persist user record in our database with a hashed password
    const passwordHash = await bcrypt.hash(password, 10);
    const saved = await prisma.user.upsert({
      where: { email },
      update: {
        name: (user.user_metadata as any)?.name || name || null,
        password: passwordHash,
      },
      create: {
        email,
        name: (user.user_metadata as any)?.name || name || null,
        password: passwordHash,
      },
    });
    if (process.env.NODE_ENV === 'development') {
      console.log('Prisma upsert result:', { id: saved.id, email: saved.email });
    }

    // Ensure Supabase auth user_metadata has the latest name (using service role if available)
    try {
      const userName = (user.user_metadata as any)?.name || name || null;
      if (userName && supabaseAdmin) {
        await supabaseAdmin.auth.admin.updateUserById(user.id, {
          user_metadata: { name: userName },
        });
      }
    } catch (e) {
      console.warn('Supabase admin metadata sync failed (non-fatal):', e);
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: (user.user_metadata as any)?.name || null,
      },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Failed to create user' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    const user = data.user;
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Fetch user profile from our database (create if missing to ensure sync)
    let localUser = await prisma.user.findUnique({ where: { email } });
    if (!localUser) {
      const passwordHash = await bcrypt.hash(password, 10);
      localUser = await prisma.user.create({
        data: {
          email,
          name: (user.user_metadata as any)?.name || null,
          password: passwordHash,
        },
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: localUser?.name || (user.user_metadata as any)?.name || null,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Failed to login' });
  }
});

export default router;

