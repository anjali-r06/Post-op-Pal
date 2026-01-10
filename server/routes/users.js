import express from 'express';

const router = express.Router();

// GET all users
router.get('/', (req, res) => {
  res.json({
    message: 'Get all users',
    data: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ]
  });
});

// GET user by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    message: `Get user ${id}`,
    data: { id, name: 'John Doe', email: 'john@example.com' }
  });
});

// POST create new user
router.post('/', (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({
    message: 'User created successfully',
    data: { id: 3, name, email }
  });
});

// PUT update user
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  res.json({
    message: `User ${id} updated successfully`,
    data: { id, name, email }
  });
});

// DELETE user
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    message: `User ${id} deleted successfully`,
    data: { id }
  });
});

export default router;
