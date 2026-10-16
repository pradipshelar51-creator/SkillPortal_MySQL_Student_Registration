const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

function sendDbError(res, error) {
  console.error('Database error:', error.message);
  return res.status(500).json({
    success: false,
    message: 'Database request failed. Check MySQL is running, schema.sql was imported, and backend/.env credentials are correct.'
  });
}

// GET /api/students — Read all records.
router.get('/', async (req, res) => {
  try {
    const [rows] = await getPool().query('SELECT id, name, email, skill, created_at FROM students ORDER BY id DESC');
    res.json(rows);
  } catch (error) { sendDbError(res, error); }
});

// GET /api/students/:id — Read one record.
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await getPool().execute('SELECT id, name, email, skill, created_at FROM students WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json(rows[0]);
  } catch (error) { sendDbError(res, error); }
});

// POST /api/students — Create a record.
router.post('/', async (req, res) => {
  const { name, email, skill } = req.body;
  if (!name || name.trim().length < 2 || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Enter a name (at least 2 characters) and a valid email.' });
  }
  try {
    const [result] = await getPool().execute(
      'INSERT INTO students (name, email, skill) VALUES (?, ?, ?)',
      [name.trim(), email.trim(), (skill || 'React').trim()]
    );
    res.status(201).json({ success: true, id: result.insertId, message: 'Student created successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'That email already exists.' });
    sendDbError(res, error);
  }
});

// PUT /api/students/:id — Update a record.
router.put('/:id', async (req, res) => {
  const { name, email, skill } = req.body;
  if (!name || name.trim().length < 2 || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Enter a name (at least 2 characters) and a valid email.' });
  }
  try {
    const [result] = await getPool().execute(
      'UPDATE students SET name = ?, email = ?, skill = ? WHERE id = ?',
      [name.trim(), email.trim(), (skill || 'React').trim(), req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, message: 'Student updated successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'That email already exists.' });
    sendDbError(res, error);
  }
});

// DELETE /api/students/:id — Delete a record.
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await getPool().execute('DELETE FROM students WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) { sendDbError(res, error); }
});

module.exports = router;
