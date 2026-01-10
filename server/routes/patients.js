import express from 'express';

const router = express.Router();

// GET all patients
router.get('/', (req, res) => {
  res.json({
    message: 'Get all patients',
    data: [
      { id: 1, name: 'Patient One', age: 45, condition: 'Post-Op Recovery' },
      { id: 2, name: 'Patient Two', age: 32, condition: 'Post-Op Recovery' }
    ]
  });
});

// GET patient by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    message: `Get patient ${id}`,
    data: {
      id,
      name: 'Patient One',
      age: 45,
      condition: 'Post-Op Recovery',
      lastCheckup: new Date()
    }
  });
});

// POST create new patient
router.post('/', (req, res) => {
  const { name, age, condition } = req.body;
  res.status(201).json({
    message: 'Patient created successfully',
    data: { id: 3, name, age, condition }
  });
});

// PUT update patient
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, age, condition } = req.body;
  res.json({
    message: `Patient ${id} updated successfully`,
    data: { id, name, age, condition }
  });
});

// DELETE patient
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    message: `Patient ${id} deleted successfully`,
    data: { id }
  });
});

export default router;
