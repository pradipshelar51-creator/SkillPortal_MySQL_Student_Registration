require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const studentsRouter = require('./src/routes/students');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Practical 14: server, routing and static resources.
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'SkillPortal Express server is running', timestamp: new Date().toISOString() });
});

app.get('/api/demo-students', (req, res) => {
  res.json([
    { id: 1, name: 'Aarav Patil', course: 'React Development', level: 'Beginner' },
    { id: 2, name: 'Anaya Sharma', course: 'Python Programming', level: 'Intermediate' },
    { id: 3, name: 'Ishaan Deshmukh', course: 'Database Management', level: 'Beginner' }
  ]);
});

// Practical 15: REST endpoints backed by MySQL.
app.use('/api/students', studentsRouter);

// Serve the standalone SkillPortal pages (index.html, CSS, JS and extra pages).
// API routes above take precedence; opening http://localhost:5000 shows the site.
const standaloneSite = path.join(__dirname, '..');
app.use(express.static(standaloneSite));

// Serve React production build when it has been created.
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Example server-rendered static resource route.
app.get('/api/about', (req, res) => {
  res.type('text').send('SkillPortal API: student career development practical project.');
});

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

app.listen(PORT, () => console.log(`SkillPortal server running at http://localhost:${PORT}`));
