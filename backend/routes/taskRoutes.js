const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskControllers');

router.post('/',          auth,              createTask);
router.get('/',           auth,              getTasks);
router.put('/:id',        auth,              updateTask);
router.delete('/:id',     auth,              deleteTask);

// Admin only
router.get('/admin/all',  auth, role('admin'), async (req, res) => {
  const Task = require('../models/Task');
  const tasks = await Task.find().populate('user', 'name email');
  res.json(tasks);
});

module.exports = router;