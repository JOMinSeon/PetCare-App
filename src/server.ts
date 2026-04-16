import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MapService } from './services/map.service';
import * as petService from './services/pet.service';
import * as symptomService from './services/symptom.service';
import bcrypt from 'bcrypt';
import * as jose from 'jose';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Auth routes
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new jose.SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secret);
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/signup', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash: hashedPassword },
    });
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new jose.SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secret);
    res.status(201).json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

app.post('/api/auth/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    // Refresh logic here
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Refresh failed' });
  }
});

// Map routes
app.get('/api/map/search', async (req: Request, res: Response) => {
  const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;
  if (!KAKAO_REST_API_KEY) {
    res.status(500).json({ error: 'Kakao API key not configured' });
    return;
  }
  try {
    const { keyword, category, latitude, longitude, radius } = req.query;
    let results;
    if (keyword) {
      results = await MapService.searchByKeyword(
        keyword as string,
        parseFloat(latitude as string) || 0,
        parseFloat(longitude as string) || 0,
        parseInt(radius as string) || 3000,
        KAKAO_REST_API_KEY
      );
    } else if (category) {
      results = await MapService.searchByCategory(
        category as string,
        parseFloat(latitude as string) || 0,
        parseFloat(longitude as string) || 0,
        parseInt(radius as string) || 3000,
        KAKAO_REST_API_KEY
      );
    } else {
      res.status(400).json({ error: 'keyword or category required' });
      return;
    }
    res.json(results);
  } catch (error) {
    console.error('Map search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

app.get('/api/map/reverse-geocode', async (req: Request, res: Response) => {
  const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;
  if (!KAKAO_REST_API_KEY) {
    res.status(500).json({ error: 'Kakao API key not configured' });
    return;
  }
  try {
    const { latitude, longitude } = req.query;
    const address = await MapService.reverseGeocode(
      parseFloat(latitude as string),
      parseFloat(longitude as string),
      KAKAO_REST_API_KEY
    );
    res.json({ address });
  } catch (error) {
    console.error('Reverse geocode error:', error);
    res.status(500).json({ error: 'Geocode failed' });
  }
});

// Symptom routes
app.post('/api/symptom/analyze', async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const result = await symptomService.analyzeSymptom(userId, req.body);
    if (!result) {
      res.status(404).json({ error: 'Pet not found or unauthorized' });
      return;
    }
    res.json(result);
  } catch (error) {
    console.error('Symptom analyze error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// Pet routes
app.get('/api/pets', async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const pets = await petService.getPetsByUser(userId);
    res.json(pets);
  } catch (error) {
    console.error('Pet fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch pets' });
  }
});

app.post('/api/pets', async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const pet = await petService.createPet(userId, req.body);
    res.status(201).json(pet);
  } catch (error) {
    console.error('Pet create error:', error);
    res.status(500).json({ error: 'Failed to create pet' });
  }
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Kakao REST API Key: ${process.env.KAKAO_REST_API_KEY ? 'Configured' : 'NOT SET'}`);
});

export default app;