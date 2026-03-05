import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

// Initialize Database
const db = new Database('proline.db');
db.pragma('journal_mode = WAL');

// Create Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('candidate', 'employer', 'admin')),
    subscription_expiry DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employer_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    location TEXT,
    salary TEXT,
    status TEXT DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(employer_id) REFERENCES users(id)
  );

  // Migration to add status column if it doesn't exist
  try {
    const columns = db.prepare("PRAGMA table_info(jobs)").all() as any[];
    const hasStatus = columns.some(c => c.name === 'status');
    if (!hasStatus) {
      db.prepare("ALTER TABLE jobs ADD COLUMN status TEXT DEFAULT 'Active'").run();
      console.log("Added 'status' column to jobs table.");
    }
  } catch (error) {
    console.error("Error checking/adding status column:", error);
  }

  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER NOT NULL,
    candidate_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(job_id) REFERENCES jobs(id),
    FOREIGN KEY(candidate_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS resumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    candidate_id INTEGER NOT NULL,
    content TEXT,
    is_enhanced BOOLEAN DEFAULT 0,
    template_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(candidate_id) REFERENCES users(id)
  );
`);

// Seeding Function
const seedDatabase = async () => {
  const userCount = db.prepare('SELECT count(*) as count FROM users').get() as any;
  
  if (userCount.count === 0) {
    console.log('Seeding database from scratch...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Create Employer
    const insertUser = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
    const employerInfo = insertUser.run('Proline Hotel', 'employer@proline.com', hashedPassword, 'employer');
    const employerId = employerInfo.lastInsertRowid;
    
    // Create Candidate
    insertUser.run('John Doe', 'candidate@example.com', hashedPassword, 'candidate');

    // Create Jobs
    const insertJob = db.prepare('INSERT INTO jobs (employer_id, title, description, requirements, location, salary) VALUES (?, ?, ?, ?, ?, ?)');
    
    insertJob.run(employerId, 'Housekeeping Supervisor', 'Oversee housekeeping staff and ensure high standards of cleanliness and hygiene throughout the hotel.', '3+ years experience in housekeeping management, strong leadership skills, attention to detail.', 'Kigali, Rwanda', '500,000 - 700,000 RWF');
    insertJob.run(employerId, 'Front Desk Manager', 'Manage front desk operations, guest services, and reservations.', '5+ years experience in front office operations, fluent in English and French, proficiency in PMS software.', 'Kigali, Rwanda', '800,000 - 1,000,000 RWF');
    insertJob.run(employerId, 'Executive Chef', 'Lead the culinary team, menu planning, and food cost control.', '10+ years culinary experience, creative, strong management skills.', 'Kigali, Rwanda', '1,500,000 - 2,000,000 RWF');
    
    console.log('Database seeded!');
  } else {
    // Check if specific jobs exist and add them if missing (for existing databases)
    const jobCheck = db.prepare("SELECT count(*) as count FROM jobs WHERE title = 'Housekeeping Supervisor'").get() as any;
    if (jobCheck.count === 0) {
        console.log('Adding missing Housekeeping Supervisor job...');
        // Find an employer
        const employer = db.prepare("SELECT id FROM users WHERE role = 'employer' LIMIT 1").get() as any;
        if (employer) {
            const insertJob = db.prepare('INSERT INTO jobs (employer_id, title, description, requirements, location, salary) VALUES (?, ?, ?, ?, ?, ?)');
            insertJob.run(employer.id, 'Housekeeping Supervisor', 'Oversee housekeeping staff and ensure high standards of cleanliness and hygiene throughout the hotel.', '3+ years experience in housekeeping management, strong leadership skills, attention to detail.', 'Kigali, Rwanda', '500,000 - 700,000 RWF');
            console.log('Job added to existing employer.');
        }
    }
  }
};

seedDatabase();

app.use(express.json());

// Middleware to verify JWT
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- Auth Routes ---

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
    const info = stmt.run(name, email, hashedPassword, role);
    const token = jwt.sign({ id: info.lastInsertRowid, email, role }, JWT_SECRET);
    res.json({ token, user: { id: info.lastInsertRowid, name, email, role } });
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email) as any;
    if (!user) return res.status(400).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', authenticateToken, (req: any, res) => {
  const stmt = db.prepare('SELECT id, name, email, role, subscription_expiry FROM users WHERE id = ?');
  const user = stmt.get(req.user.id);
  res.json(user);
});

// --- Job Routes ---

app.get('/api/jobs', (req, res) => {
  const stmt = db.prepare('SELECT jobs.*, users.name as employer_name FROM jobs JOIN users ON jobs.employer_id = users.id ORDER BY created_at DESC');
  const jobs = stmt.all();
  res.json(jobs);
});

app.get('/api/employer/jobs', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'employer') return res.sendStatus(403);
  const stmt = db.prepare(`
    SELECT jobs.*, COUNT(applications.id) as applicant_count 
    FROM jobs 
    LEFT JOIN applications ON jobs.id = applications.job_id 
    WHERE jobs.employer_id = ? 
    GROUP BY jobs.id
    ORDER BY created_at DESC
  `);
  const jobs = stmt.all(req.user.id);
  res.json(jobs);
});

app.post('/api/jobs', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'employer' && req.user.role !== 'admin') return res.sendStatus(403);
  const { title, description, requirements, location, salary } = req.body;
  const stmt = db.prepare('INSERT INTO jobs (employer_id, title, description, requirements, location, salary) VALUES (?, ?, ?, ?, ?, ?)');
  const info = stmt.run(req.user.id, title, description, requirements, location, salary);
  res.json({ id: info.lastInsertRowid });
});

app.put('/api/jobs/:id', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'employer' && req.user.role !== 'admin') return res.sendStatus(403);
  const { title, description, requirements, location, salary } = req.body;
  const { id } = req.params;
  
  // Ensure the job belongs to the employer
  const checkStmt = db.prepare('SELECT employer_id FROM jobs WHERE id = ?');
  const job = checkStmt.get(id) as any;
  if (!job) return res.status(404).json({ error: 'Job not found' });
  if (job.employer_id !== req.user.id && req.user.role !== 'admin') return res.sendStatus(403);

  const stmt = db.prepare('UPDATE jobs SET title = ?, description = ?, requirements = ?, location = ?, salary = ? WHERE id = ?');
  stmt.run(title, description, requirements, location, salary, id);
  res.json({ success: true });
});

app.delete('/api/jobs/:id', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'employer' && req.user.role !== 'admin') return res.sendStatus(403);
  const { id } = req.params;

  // Ensure the job belongs to the employer
  const checkStmt = db.prepare('SELECT employer_id FROM jobs WHERE id = ?');
  const job = checkStmt.get(id) as any;
  if (!job) return res.status(404).json({ error: 'Job not found' });
  if (job.employer_id !== req.user.id && req.user.role !== 'admin') return res.sendStatus(403);

  const stmt = db.prepare('DELETE FROM jobs WHERE id = ?');
  stmt.run(id);
  res.json({ success: true });
});

app.patch('/api/jobs/:id/status', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'employer' && req.user.role !== 'admin') return res.sendStatus(403);
  const { id } = req.params;
  const { status } = req.body;

  if (!['Active', 'Closed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  // Ensure the job belongs to the employer
  const checkStmt = db.prepare('SELECT employer_id FROM jobs WHERE id = ?');
  const job = checkStmt.get(id) as any;
  if (!job) return res.status(404).json({ error: 'Job not found' });
  if (job.employer_id !== req.user.id && req.user.role !== 'admin') return res.sendStatus(403);

  const stmt = db.prepare('UPDATE jobs SET status = ? WHERE id = ?');
  stmt.run(status, id);
  res.json({ success: true, status });
});

app.get('/api/jobs/:id/applicants', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'employer' && req.user.role !== 'admin') return res.sendStatus(403);
  const { id } = req.params;

  // Ensure the job belongs to the employer
  const checkStmt = db.prepare('SELECT employer_id FROM jobs WHERE id = ?');
  const job = checkStmt.get(id) as any;
  if (!job) return res.status(404).json({ error: 'Job not found' });
  if (job.employer_id !== req.user.id && req.user.role !== 'admin') return res.sendStatus(403);

  const stmt = db.prepare(`
    SELECT users.id, users.name, users.email, applications.status, applications.created_at 
    FROM applications 
    JOIN users ON applications.candidate_id = users.id 
    WHERE applications.job_id = ?
  `);
  const applicants = stmt.all(id);
  res.json(applicants);
});

// --- Resume AI Routes ---

app.post('/api/resume/enhance', authenticateToken, async (req: any, res) => {
  const { resumeText } = req.body;
  
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API key not configured' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `
      You are an expert hospitality recruiter. Enhance the following resume content.
      Add missing skills relevant to hospitality, improve the professional summary, 
      format achievements with action verbs, and ensure industry keywords are present.
      Return the result as a JSON object with fields: summary, experience (array), skills (array), education (array).
      
      Resume Content:
      ${resumeText}
    `;

    const result = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    const text = result.text;
    
    // Simple extraction of JSON from markdown block if present
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : text;
    
    let enhancedData;
    try {
        enhancedData = JSON.parse(jsonStr);
    } catch (e) {
        enhancedData = { raw: text };
    }

    res.json(enhancedData);
  } catch (error) {
    console.error('AI Enhancement failed:', error);
    res.status(500).json({ error: 'Failed to enhance resume' });
  }
});

// --- Payment Mock Route (MTN MoMo) ---
app.post('/api/payment/initiate', authenticateToken, (req: any, res) => {
    // In a real app, this would call the MTN MoMo API
    const { amount, phoneNumber } = req.body;
    
    // Simulate API call delay
    setTimeout(() => {
        // Mock success
        res.json({ status: 'success', transactionId: `MOMO-${Date.now()}`, message: 'Payment successful' });
    }, 1500);
});


// Vite Middleware
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
