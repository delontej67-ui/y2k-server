const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for your app
app.use(cors());
app.use(express.json());

// In-memory storage (persists while server is running)
let announcements = [];

// Get all announcements
app.get('/api/announcements', (req, res) => {
  res.json(announcements);
});

// Create new announcement
app.post('/api/announcements', (req, res) => {
  const { title, text, adminKey } = req.body;
  
  // Simple admin check
  if (adminKey !== 'Y2KEXPLOITS_ADMIN_KEY_2026') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  const newAnnouncement = {
    id: Date.now().toString(),
    title,
    text,
    timestamp: new Date().toISOString()
  };
  
  announcements.unshift(newAnnouncement);
  res.json({ success: true, announcement: newAnnouncement });
});

// Delete announcement
app.delete('/api/announcements/:id', (req, res) => {
  const { id } = req.params;
  const { adminKey } = req.body;
  
  if (adminKey !== 'Y2KEXPLOITS_ADMIN_KEY_2026') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  announcements = announcements.filter(a => a.id !== id);
  res.json({ success: true });
});

// Health check
app.get('/', (req, res) => {
  res.send('Y2K Announcements Server Running! 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
