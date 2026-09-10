import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const saved = localStorage.getItem('portfolioCVData');

  let summary = '';
  let email = '';
  let github = '';
  let linkedin = '';
  let profileImage = '';

  if (saved) {
    try {
      const data = JSON.parse(saved);

      summary = data.summary || '';
      email = data.email || '';
      github = data.github || '';
      linkedin = data.linkedin || '';
      profileImage = data.profileImage || '';
    } catch (error) {
      console.error('Error leyendo los datos del CV:', error);
    }
  }
  return (
    <section className="home section animate-fade-in">
      <div className="container home-container">
        <div className="home-content">
          <h1 className="home-title">
            Hi, I'm a <br />
            <span className="text-gradient">Software Developer</span>
          </h1>
          <p className="home-subtitle">
            {summary}
          </p>
          <div className="home-buttons">
            <Link to="/projects" className="btn btn-primary">View Projects</Link>
            <a
              href={email ? `mailto:${email}` : '#'}
              className="btn btn-outline"
            >
              Contact Me
            </a>
          </div>
          <div className="social-links">
            <a
              href={github || '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub />
            </a>

            <a
              href={linkedin || '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin />
            </a>

            <a
              href={email ? `mailto:${email}` : '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>
        <div className="home-image glass-card">
          <div className="image-placeholder">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Perfil"
                className="profile-image"
              />
            ) : (
              <span className="text-gradient">&lt;/&gt;</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};


export default Home;
