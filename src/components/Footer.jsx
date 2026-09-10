import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Portfolio. Built with React & Vite.</p>
      </div>
    </footer>
  );
};

export default Footer;
