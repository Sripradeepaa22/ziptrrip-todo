const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readTodos, writeTodos } = require('../helpers/fileStore');

const router = express.Router();

// GET /api/todos
router.get('/', (req, res) => {
  res.json(readTodos());
});

// GET /api/todos/:id
router.get('/:id', (req, res) => {
  const todo = readTodos().find(t => t.id === req.params.id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.json(todo);
});

// POST /api/todos
router.post('/', (req, res) => {
  const { title, description, priority, dueDate } = req.body;
  if (!title?.trim()) return res.status(400).json({ error: 'Title is required' });

  const todos = readTodos();
  const newTodo = {
    id: uuidv4(),
    title: title.trim(),
    description: description?.trim() || '',
    priority: priority || 'medium',
    dueDate: dueDate || null,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  todos.push(newTodo);
  writeTodos(todos);
  res.status(201).json(newTodo);
});

// PUT /api/todos/:id
router.put('/:id', (req, res) => {
  const todos = readTodos();
  const index = todos.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Todo not found' });

  const { title, description, priority, dueDate, completed } = req.body;
  todos[index] = {
    ...todos[index],
    ...(title !== undefined && { title: title.trim() }),
    ...(description !== undefined && { description: description.trim() }),
    ...(priority !== undefined && { priority }),
    ...(dueDate !== undefined && { dueDate }),
    ...(completed !== undefined && { completed }),
    updatedAt: new Date().toISOString()
  };
  writeTodos(todos);
  res.json(todos[index]);
});

// DELETE /api/todos/:id
router.delete('/:id', (req, res) => {
  const todos = readTodos();
  const index = todos.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Todo not found' });
  todos.splice(index, 1);
  writeTodos(todos);
  res.json({ message: 'Todo deleted successfully' });
});

module.exports = router;
