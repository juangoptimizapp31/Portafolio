import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import Home from './pages/Home';
import Projects from './pages/Projects';
import Certifications from './pages/Certifications';
import Degrees from './pages/Degrees';
import ProfileBuilder from './pages/ProfileBuilder';
import ProjectDetails from './pages/ProjectDetails';
import AdminLogin from './pages/AdminLogin';
import AdminRoute from './components/AdminRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId/:view" element={<ProjectDetails />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/degrees" element={<Degrees />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route
              path="/builder"
              element={
                <AdminRoute>
                  <ProfileBuilder />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
