import express from 'express';

const router = express.Router();

// GET all appointments
router.get('/', (req, res) => {
  res.json({
    message: 'Get all appointments',
    data: [
      { id: 1, patientId: 1, date: '2025-12-01', time: '10:00 AM', status: 'scheduled' },
      { id: 2, patientId: 2, date: '2025-12-02', time: '02:00 PM', status: 'scheduled' }
    ]
  });
});

// GET appointment by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    message: `Get appointment ${id}`,
    data: {
      id,
      patientId: 1,
      date: '2025-12-01',
      time: '10:00 AM',
      status: 'scheduled',
      notes: 'Post-op checkup'
    }
  });
});

// POST create new appointment
router.post('/', (req, res) => {
  const { patientId, date, time } = req.body;
  res.status(201).json({
    message: 'Appointment created successfully',
    data: { id: 3, patientId, date, time, status: 'scheduled' }
  });
});

// PUT update appointment
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { patientId, date, time, status } = req.body;
  res.json({
    message: `Appointment ${id} updated successfully`,
    data: { id, patientId, date, time, status }
  });
});

// DELETE appointment
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    message: `Appointment ${id} deleted successfully`,
    data: { id }
  });
});

export default router;
