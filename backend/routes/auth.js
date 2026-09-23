import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'productbrain_jwt_secret_2026';

const PERSONAS = [
  {
    id: 'pm-1',
    name: 'Sarah Jenkins',
    role: 'pm',
    title: 'Principal Product Manager',
    email: 'sarah.pm@productbrain.io',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  },
  {
    id: 'sales-1',
    name: 'Michael Chang',
    role: 'sales',
    title: 'VP of Enterprise Sales',
    email: 'michael.sales@productbrain.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  {
    id: 'eng-1',
    name: 'Alex Rivera',
    role: 'engineering',
    title: 'Staff Engineering Lead',
    email: 'alex.eng@productbrain.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  }
];

// GET /api/auth/personas - List available persona profiles for demo
router.get('/personas', (req, res) => {
  res.json({ success: true, personas: PERSONAS });
});

// POST /api/auth/login - Persona-based or credential login
router.post('/login', (req, res) => {
  const { personaId, email, role } = req.body;

  let selectedPersona = PERSONAS.find((p) => p.id === personaId || p.email === email);

  if (!selectedPersona) {
    selectedPersona = {
      id: `user-${Date.now()}`,
      name: email ? email.split('@')[0] : 'Enterprise User',
      role: role || 'pm',
      title: 'Enterprise Specialist',
      email: email || 'user@productbrain.io'
    };
  }

  const token = jwt.sign(
    {
      id: selectedPersona.id,
      name: selectedPersona.name,
      role: selectedPersona.role,
      email: selectedPersona.email
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    token,
    user: selectedPersona
  });
});

export default router;
