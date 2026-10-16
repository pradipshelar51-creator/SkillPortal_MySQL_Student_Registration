import React, { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const skillGroups = [
  { icon: '💻', title: 'Programming', desc: 'Build strong programming fundamentals.', tags: ['C', 'C++', 'Java', 'Python'] },
  { icon: '🌐', title: 'Web Development', desc: 'Create modern and responsive websites.', tags: ['HTML', 'CSS', 'JavaScript', 'React'] },
  { icon: '🗄️', title: 'Database', desc: 'Learn how applications store and manage data.', tags: ['SQL', 'MySQL', 'MongoDB'] },
  { icon: '☁️', title: 'Cloud Computing', desc: 'Understand modern cloud technologies.', tags: ['AWS', 'Azure', 'Google Cloud'] },
  { icon: '🤖', title: 'AI & Machine Learning', desc: 'Explore AI, ML and data-driven technologies.', tags: ['AI', 'ML', 'Data Science', 'GenAI'] },
  { icon: '🔐', title: 'Cybersecurity', desc: 'Understand security and network protection.', tags: ['Network Security', 'Security Basics'] },
  { icon: '🧠', title: 'Core Computer Science', desc: 'Strengthen your computer science fundamentals.', tags: ['DSA', 'DBMS', 'OS', 'Networks'] },
  { icon: '🤝', title: 'Soft Skills', desc: 'Develop professional and communication skills.', tags: ['Communication', 'Teamwork', 'Leadership'] }
];

const companies = [
  ['G', 'Google', ['Python / C++', 'Data Structures & Algorithms', 'System Design', 'Cloud Computing']],
  ['M', 'Microsoft', ['C++ / C# / Python', 'DSA', 'Azure', 'Artificial Intelligence']],
  ['A', 'Amazon', ['Java / Python', 'DSA', 'AWS', 'SQL']],
  ['T', 'TCS', ['Java / Python', 'SQL', 'DSA', 'Communication']],
  ['I', 'Infosys', ['Java', 'JavaScript', 'SQL', 'Cloud']],
  ['A', 'Accenture', ['Java', 'SQL', 'Cloud', 'Communication']],
  ['W', 'Wipro', ['Java / Python', 'SQL', 'Cloud', 'Problem Solving']],
  ['IBM', 'IBM', ['Python', 'Java', 'Cloud', 'Data Analytics']],
  ['H', 'HCLTech', ['Java / Python', 'Cloud', 'AI / ML', 'SQL']],
  ['C', 'Cognizant', ['Java', 'Python', 'SQL', 'Communication']]
];

function SectionHeading({ eyebrow, title, subtitle }) {
  return <div className="section-heading"><p>{eyebrow}</p><h2>{title}</h2>{subtitle && <span>{subtitle}</span>}</div>;
}

// Practical 9: Props are used by SkillCard and SectionHeading.
function SkillCard({ icon, title, desc, tags }) {
  return <article className="skill-card"><div className="skill-icon">{icon}</div><h3>{title}</h3><p>{desc}</p><div className="tags">{tags.map(tag => <span key={tag}>{tag}</span>)}</div></article>;
}

function App() {
  // Practical 9: state + conditional rendering + event handling.
  const [studentName, setStudentName] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [notice, setNotice] = useState('');
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState(['Complete React practical', 'Revise SQL queries']);
  const [apiStudents, setApiStudents] = useState([]);
  const [apiStatus, setApiStatus] = useState('Click “Load API Data” to fetch student records.');
  const [apiError, setApiError] = useState('');
  const [students, setStudents] = useState([]);
  const [studentForm, setStudentForm] = useState({ name: '', email: '', skill: 'React' });
  const [crudStatus, setCrudStatus] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Practical 9: useEffect runs when the page loads.
  useEffect(() => {
    document.title = 'SkillPortal — Student Career Development';
  }, []);

  // Practical 10: Fetch and parse JSON from the REST API.
  async function loadApiData() {
    setApiStatus('Loading data from the API…');
    setApiError('');
    try {
      const response = await fetch(`${API}/demo-students`);
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const data = await response.json();
      setApiStudents(data);
      setApiStatus(`Loaded ${data.length} record(s) from the API.`);
    } catch (error) {
      setApiError('Could not reach the API. Start the backend with “npm start” in the backend folder.');
      setApiStatus(error.message);
    }
  }

  // Practical 11: event-driven DOM interaction via React state.
  function addTask(event) {
    event.preventDefault();
    const value = taskText.trim();
    if (!value) {
      setNotice('Please type a task before adding it.');
      return;
    }
    setTasks(current => [...current, value]);
    setTaskText('');
    setNotice(`Added task: ${value}`);
  }

  function handleLogin(event) {
    event.preventDefault();
    if (studentName.trim().length < 2) {
      setNotice('Please enter a name with at least 2 characters.');
      return;
    }
    setSignedIn(true);
    setShowLogin(false);
    setNotice(`Welcome, ${studentName.trim()}! Your demo session is active.`);
  }

  async function loadStudents() {
    setCrudStatus('Loading students…');
    try {
      const response = await fetch(`${API}/students`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not load records');
      setStudents(data);
      setCrudStatus('Student records loaded.');
    } catch (error) {
      setCrudStatus(`${error.message}. Configure MySQL and start the backend.`);
    }
  }

  async function saveStudent(event) {
    event.preventDefault();
    setCrudStatus('Saving…');
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API}/students/${editingId}` : `${API}/students`;
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentForm)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Save failed');
      setStudentForm({ name: '', email: '', skill: 'React' });
      setEditingId(null);
      setCrudStatus(editingId ? 'Student updated.' : 'Student added.');
      await loadStudents();
    } catch (error) {
      setCrudStatus(`${error.message}. Check MySQL setup and backend logs.`);
    }
  }

  function editStudent(student) {
    setEditingId(student.id);
    setStudentForm({ name: student.name, email: student.email, skill: student.skill || 'React' });
    document.getElementById('crud-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  async function deleteStudent(id) {
    if (!window.confirm('Delete this student record?')) return;
    try {
      const response = await fetch(`${API}/students/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Delete failed');
      setCrudStatus('Student deleted.');
      await loadStudents();
    } catch (error) {
      setCrudStatus(`${error.message}. Check MySQL setup.`);
    }
  }

  function placementAction(name) {
    setNotice(`${name}: this is a demonstration action. Add your own questions or content here.`);
  }

  return <>
    <header>
      <nav className="navbar">
        <a className="logo" href="#home">Skill<span>Portal</span></a>
        <button className="menu-toggle" onClick={() => document.getElementById('nav-links')?.classList.toggle('nav-open')} aria-label="Toggle navigation">☰</button>
        <ul className="nav-links" id="nav-links">
          <li><a href="#home">Home</a></li><li><a href="#skills">Skills</a></li><li><a href="#companies">Companies</a></li>
          <li><a href="#roadmap">Roadmap</a></li><li><a href="#placement">Placement</a></li><li><a href="#projects">Projects</a></li>
          <li><a href="#practicals">Practicals</a></li>
        </ul>
        <button className="login-btn" onClick={() => setShowLogin(true)}>{signedIn ? studentName : 'Login'}</button>
      </nav>
    </header>

    <main>
      <section id="home" className="hero">
        <div className="hero-content">
          <p className="tagline">STUDENT CAREER DEVELOPMENT</p>
          <h1>Build Skills.<br />Build Projects.<br /><span>Build Your Career.</span></h1>
          <p>A complete platform to develop technical skills, improve communication, prepare for interviews and understand the skills required by top companies.</p>
          <div className="hero-buttons"><a href="#skills" className="primary-btn">Explore Skills</a><a href="#companies" className="secondary-btn">Company Skills</a></div>
          {signedIn && <p className="welcome-line">You are signed in as {studentName} (demo).</p>}
        </div>
        <div className="hero-card"><div className="student-icon">🎓</div><h2>Student Dashboard</h2>
          <div className="mini-progress"><div className="progress-label"><span>Overall Progress</span><b>68%</b></div><div className="progress-bar"><div className="progress-fill" style={{ width: '68%' }} /></div></div>
          <p>Keep learning and move closer to your dream job!</p>
        </div>
      </section>

      <section className="stats"><div><h2>10+</h2><p>Top Companies</p></div><div><h2>30+</h2><p>Technical Skills</p></div><div><h2>20+</h2><p>Placement Topics</p></div><div><h2>100%</h2><p>Student Focused</p></div></section>

      <section id="skills" className="section"><SectionHeading eyebrow="LEARN & DEVELOP" title="Skills You Should Develop" subtitle="Develop the skills that help you become industry-ready." />
        <div className="skill-grid">{skillGroups.map(skill => <SkillCard key={skill.title} {...skill} />)}</div>
      </section>

      <section id="companies" className="section company-section"><SectionHeading eyebrow="CAREER PREPARATION" title="Top Companies & Required Skills" subtitle="Explore commonly valued skills for different technology companies." />
        <div className="company-grid">{companies.map(([letter, name, items]) => <article className="company-card" key={name}><div className="company-logo">{letter}</div><h3>{name}</h3><p>Important skills</p><ul>{items.map(item => <li key={item}>{item}</li>)}</ul></article>)}</div>
      </section>

      <section className="section dashboard"><SectionHeading eyebrow="YOUR PROGRESS" title="Student Skill Dashboard" />
        <div className="dashboard-container"><div className="overall-progress"><h3>Overall Skill Progress</h3><div className="circle-progress"><span>68%</span></div><p>Keep improving your skills!</p></div>
          <div className="progress-list">{[['HTML',100],['CSS',80],['JavaScript',60],['Python',50],['SQL',70],['DSA',40]].map(([name, value]) => <div className="progress-item" key={name}><div><span>{name}</span><b>{value}%</b></div><div className="progress-bar"><div className="progress-fill" style={{ width: `${value}%` }} /></div></div>)}</div>
        </div>
      </section>

      <section id="roadmap" className="section roadmap-section"><SectionHeading eyebrow="CAREER JOURNEY" title="Student Career Roadmap" />
        <div className="roadmap">{[['Learn Programming','Learn C, C++, Java or Python.'],['Learn DSA','Practice data structures and algorithms.'],['Build Projects','Create real-world projects.'],['Build Resume','Showcase your skills and projects.'],['Prepare Interviews','Practice technical and HR interviews.'],['Get Placed','Apply and start your career.']].map(([title, desc], i) => <React.Fragment key={title}><div className="roadmap-step"><div className="step-number">{i+1}</div><h3>{title}</h3><p>{desc}</p></div>{i < 5 && <div className="roadmap-line" />}</React.Fragment>)}</div>
      </section>

      <section id="placement" className="section"><SectionHeading eyebrow="PLACEMENT PREPARATION" title="Prepare for Your Dream Job" />
        <div className="placement-grid">{[['🧮','Aptitude','Quantitative aptitude, logical reasoning and verbal ability.'],['💻','Coding Practice','Improve programming and problem-solving skills.'],['🧠','Technical Interview','Prepare DBMS, OS, CN, DSA and programming.'],['🎤','HR Interview','Improve communication and interview confidence.'],['📄','Resume Builder','Create a professional resume highlighting your skills.'],['👥','Mock Interview','Practice interview questions before recruiters.']].map(([icon,title,desc]) => <article className="placement-card" key={title}><span>{icon}</span><h3>{title}</h3><p>{desc}</p><button onClick={() => placementAction(title)}> {title === 'Aptitude' ? 'Start Practice' : title === 'Resume Builder' ? 'Build Resume' : 'Practice Now'} </button></article>)}</div>
      </section>

      <section id="projects" className="section project-section"><SectionHeading eyebrow="BUILD YOUR PORTFOLIO" title="Student Projects" />
        <div className="project-grid">{[['🌐','Student Skill Portal','Manage student skills, learning progress and placement preparation.',['React','Node.js','MySQL']],['🛒','E-Commerce Website','Build an online shopping website with product listing and cart functionality.',['React','JavaScript','SQL']],['🤖','AI Student Assistant','Create an application that helps students find learning resources.',['Python','AI','ML']]].map(([icon,title,desc,tags]) => <article className="project-card" key={title}><div className="project-image">{icon}</div><h3>{title}</h3><p>{desc}</p><div className="tags">{tags.map(t => <span key={t}>{t}</span>)}</div></article>)}</div>
      </section>

      <section id="practicals" className="section practical-section">
        <SectionHeading eyebrow="WEB DEVELOPMENT LAB" title="Practical Applications 8–15" subtitle="Interactive demonstrations included in this project." />
        <div className="practical-grid">
          <article className="practical-card"><span className="practical-number">08–09</span><h3>React SPA, Props, State & Hooks</h3><p>This website is a React single-page application. Skill cards receive props; login, tasks and forms use state; useEffect runs on page load.</p><p className="mini-note">Try the Login button and the task list below.</p></article>
          <article className="practical-card"><span className="practical-number">10</span><h3>Fetch API and JSON</h3><p>Click the button to fetch JSON records from the Express API and display them on this page.</p><button onClick={loadApiData}>Load API Data</button><p className="status-text">{apiStatus}</p>{apiError && <p className="error-text">{apiError}</p>}
            {apiStudents.length > 0 && <div className="table-wrap"><table><thead><tr><th>Name</th><th>Course</th><th>Level</th></tr></thead><tbody>{apiStudents.map(s => <tr key={s.id}><td>{s.name}</td><td>{s.course}</td><td>{s.level}</td></tr>)}</tbody></table></div>}
          </article>
          <article className="practical-card"><span className="practical-number">11</span><h3>DOM / Event Handling Demo</h3><p>React event handlers update the page dynamically without reloading.</p><form className="task-form" onSubmit={addTask}><input value={taskText} onChange={e => setTaskText(e.target.value)} placeholder="Enter a learning task" aria-label="Learning task" /><button type="submit">Add Task</button></form>
            {notice && <p className="status-text" role="status">{notice}</p>}<ul className="task-list">{tasks.map((task, i) => <li key={`${task}-${i}`}>{task}<button className="remove-task" onClick={() => setTasks(current => current.filter((_, index) => index !== i))} aria-label={`Remove ${task}`}>×</button></li>)}</ul>
          </article>
          <article className="practical-card"><span className="practical-number">12</span><h3>PHP Form & Session</h3><p>Demonstrates server-side validation, string manipulation and session management.</p><a className="text-link" href="http://localhost/skill-portal-php/form-session.php" target="_blank" rel="noreferrer">Open PHP practical ↗</a><p className="mini-note">Requires XAMPP/Apache and the PHP folder setup described in README.</p></article>
          <article className="practical-card"><span className="practical-number">13</span><h3>PHP + MySQL CRUD</h3><p>Separate PHP page creates, lists, edits and deletes student records using PDO and MySQL.</p><a className="text-link" href="http://localhost/skill-portal-php/students.php" target="_blank" rel="noreferrer">Open PHP CRUD ↗</a><p className="mini-note">Configure PHP database credentials and import the SQL file first.</p></article>
          <article className="practical-card"><span className="practical-number">14</span><h3>Node.js & Express Server</h3><p>The Express backend serves this frontend build, static assets, a health endpoint and API routes.</p><a className="text-link" href={`${API.replace('/api','')}/api/health`} target="_blank" rel="noreferrer">Test server health ↗</a></article>
          <article className="practical-card"><span className="practical-number">15</span><h3>REST API + Database</h3><p>Use the form below to create, read, update and delete MySQL student records through REST endpoints.</p><button onClick={loadStudents}>Load MySQL Records</button><p className="status-text">{crudStatus}</p></article>
        </div>

        <div className="crud-panel">
          <div><h3>{editingId ? 'Update Student' : 'Add a Student Record'}</h3><p>These operations use the Node.js REST API and MySQL database.</p></div>
          <form id="crud-form" className="crud-form" onSubmit={saveStudent}>
            <input required minLength="2" value={studentForm.name} onChange={e => setStudentForm({...studentForm, name:e.target.value})} placeholder="Student name" aria-label="Student name" />
            <input required type="email" value={studentForm.email} onChange={e => setStudentForm({...studentForm, email:e.target.value})} placeholder="Email address" aria-label="Email address" />
            <select value={studentForm.skill} onChange={e => setStudentForm({...studentForm, skill:e.target.value})} aria-label="Primary skill"><option>React</option><option>JavaScript</option><option>Python</option><option>Java</option><option>SQL</option><option>Node.js</option></select>
            <button type="submit">{editingId ? 'Update Student' : 'Add Student'}</button>
            {editingId && <button type="button" className="secondary-form-btn" onClick={() => {setEditingId(null);setStudentForm({name:'',email:'',skill:'React'});}}>Cancel Edit</button>}
          </form>
          <div className="table-wrap"><table><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Skill</th><th>Actions</th></tr></thead><tbody>
            {students.map(student => <tr key={student.id}><td>{student.id}</td><td>{student.name}</td><td>{student.email}</td><td>{student.skill}</td><td className="actions"><button onClick={() => editStudent(student)}>Edit</button><button className="danger-btn" onClick={() => deleteStudent(student.id)}>Delete</button></td></tr>)}
            {students.length === 0 && <tr><td colSpan="5">No records loaded. Click “Load MySQL Records”.</td></tr>}
          </tbody></table></div>
        </div>
      </section>
    </main>

    <footer><div className="footer-content"><div><h2>Skill<span>Portal</span></h2><p>Empowering students with skills for the future.</p></div><div><h3>Quick Links</h3><a href="#home">Home</a><a href="#skills">Skills</a><a href="#companies">Companies</a><a href="#placement">Placement</a></div><div><h3>Technology Practicals</h3><p>React & JSX</p><p>PHP & MySQL</p><p>Node.js & Express</p><p>REST API</p></div></div><div className="copyright">© 2026 Student Skill Development Portal | All Rights Reserved</div></footer>

    {showLogin && <div className="modal" role="dialog" aria-modal="true" aria-labelledby="login-title" onClick={e => {if (e.target === e.currentTarget) setShowLogin(false);}}><form className="modal-content" onSubmit={handleLogin}><button type="button" className="close" onClick={() => setShowLogin(false)} aria-label="Close login">×</button><h2 id="login-title">Student Login</h2><p>Enter your name to open a local demo session.</p><input autoFocus required minLength="2" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="Enter your name" aria-label="Your name" /><button type="submit">Login</button><p className="mini-note">Demo only: this does not verify an account or password.</p></form></div>}
    {notice && <div className="toast" role="status"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss message">×</button></div>}
  </>;
}

export default App;
