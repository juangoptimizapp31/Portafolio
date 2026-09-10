import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './Home.css';

const Home = () => {
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem('portfolioCVData');

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error leyendo los datos locales:', error);
      }
    }

    return {};
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileRef = doc(db, 'profiles', 'main');
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const firebaseData = profileSnap.data();

          setProfileData(firebaseData);

          // Mantener copia local como respaldo
          localStorage.setItem(
            'portfolioCVData',
            JSON.stringify(firebaseData)
          );
        }
      } catch (error) {
        console.error('Error cargando el perfil desde Firebase:', error);
      }
    };

    loadProfile();
  }, []);

  const summary = profileData.summary || '';
  const email = profileData.email || '';
  const github = profileData.github || '';
  const linkedin = profileData.linkedin || '';
  const profileImage = profileData.profileImage || '';
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
