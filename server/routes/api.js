import express from 'express';
import userRoutes from './users.js';
import patientsRoutes from './patients.js';
import appointmentsRoutes from './appointments.js';
import chatRoutes from './chat.js';

const router = express.Router();

// Use routes
router.use('/users', userRoutes);
router.use('/patients', patientsRoutes);
router.use('/appointments', appointmentsRoutes);
router.use('/chat', chatRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Heal Uttam Sahayak API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      patients: '/api/patients',
      appointments: '/api/appointments',
      health: '/health'
    }
  });
});

export default router;
