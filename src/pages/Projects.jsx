import './Projects.css';
import { FaExternalLinkAlt, FaFileAlt } from 'react-icons/fa';

const projectsData = [
  {
    id: 1,
    title: 'Multi-Cloud Infrastructure Factory',
    badge: 'Strategic Owner',
    description:
      'Designed and implemented a Terraform-based cloud foundation to standardize infrastructure provisioning, governance and delivery across Azure, AWS, GCP and OCI environments.',
    tech: ['Terraform', 'Azure', 'AWS', 'GCP', 'OCI'],
    primaryLabel: 'Architecture',
    secondaryLabel: 'Case Study',
    primaryLink: '/projects/1/architecture',
    secondaryLink: '/projects/1/case-study',
  },
  {
    id: 2,
    title: 'Cloud-Native SaaS Platform',
    badge: 'Founder / Solutions Architect',
    description:
      'Designed and delivered scalable cloud-native solutions using serverless architectures, APIs and managed cloud services to support real business applications.',
    tech: ['Azure Functions', 'Container Apps', 'React', 'Firebase', 'AWS Lambda', 'APIs'],
    primaryLabel: 'Architecture',
    secondaryLabel: 'Case Study',
    primaryLink: '/projects/2/architecture',
    secondaryLink: '/projects/2/case-study',
  },
  {
    id: 3,
    title: 'Kubernetes Production Platform',
    badge: 'Platform Engineering',
    description:
      'Built and supported Kubernetes-based environments focused on scalability, automated deployments, workload reliability and operational visibility.',
    tech: ['Kubernetes', 'AKS', 'GKE', 'Docker', 'Helm', 'Terraform'],
    primaryLabel: 'Architecture',
    secondaryLabel: 'Case Study',
    primaryLink: '/projects/3/architecture',
    secondaryLink: '/projects/3/case-study',
  },
  {
    id: 4,
    title: 'Enterprise CI/CD Delivery Platform',
    badge: 'Technical Owner',
    description:
      'Automated software delivery pipelines with security controls, environment promotion strategies and repeatable deployment workflows.',
    tech: ['Azure DevOps', 'GitHub Actions', 'Jenkins', 'GitLab CI', 'Docker', 'DevSecOps'],
    primaryLabel: 'Architecture',
    secondaryLabel: 'Case Study',
    primaryLink: '/projects/4/architecture',
    secondaryLink: '/projects/4/case-study',
  },
  {
    id: 5,
    title: 'SRE Observability Framework',
    badge: 'SRE Lead Contributor',
    description:
      'Implemented monitoring, alerting and reliability practices to improve production visibility, incident response and operational maturity.',
    tech: ['Azure Monitor', 'Prometheus', 'Grafana', 'Datadog', 'KQL', 'SLO/SLI'],
    primaryLabel: 'Architecture',
    secondaryLabel: 'Case Study',
    primaryLink: '/projects/5/architecture',
    secondaryLink: '/projects/5/case-study',
  },
  {
    id: 6,
    title: 'Infrastructure Automation Toolkit',
    badge: 'Automation Engineer',
    description:
      'Developed automation workflows and operational tools to reduce manual processes, accelerate troubleshooting and improve service reliability.',
    tech: ['Python', 'PowerShell', 'Bash', 'Ansible', 'Azure CLI', 'Linux'],
    primaryLabel: 'Architecture',
    secondaryLabel: 'Case Study',
    primaryLink: '/projects/6/architecture',
    secondaryLink: '/projects/6/case-study',
  },
];

const Projects = () => {
  const saved = localStorage.getItem('portfolioCVData');

  let employers = [];

  if (saved) {
    try {
      const data = JSON.parse(saved);
      employers = data.employers || [];
    } catch (error) {
      console.error('Error leyendo los empleadores:', error);
    }
  }

  return (
    <section className="projects-section section animate-fade-in">
      <div className="container">

        <h2 className="section-title">
          Featured <span className="text-gradient">Engineering Work</span>
        </h2>

        <div className="projects-grid">
          {projectsData.map(project => (
            <div key={project.id} className="project-card glass-card">

              <h3 className="project-title">{project.title}</h3>

              <p className="project-desc">
                {project.description}
              </p>

              <div className="project-tech">
                {project.tech.map((tech, index) => (
                  <span key={index} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="project-links">

                <a
                  href={project.primaryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <FaExternalLinkAlt /> {project.primaryLabel}
                </a>

                <a
                  href={project.secondaryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  <FaFileAlt /> {project.secondaryLabel}
                </a>

              </div>

            </div>
          ))}
        </div>

        {/* EMPLOYERS & PREVIOUS CLIENTS */}

        <div className="employers-section">

          <div className="employers-header">
            <h2 className="section-title">
              Employers <span className="text-gradient">& Previous Clients</span>
            </h2>

            <p className="employers-subtitle">
              Organizations and clients with whom I have had professional experience.
            </p>
          </div>

          <div className="employers-grid">
            {employers
              .filter(employer =>
                employer.name &&
                employer.name.trim().toLowerCase() !== 'professional experience'
              )
              .map((employer, index) => (
                <div key={index} className="employer-card">

                  <div className="employer-logo">
                    {employer.image ? (
                      <img
                        src={employer.image}
                        alt={employer.name}
                      />
                    ) : (
                      <span className="employer-logo-fallback">
                        {employer.name
                          .split(/\s+/)
                          .filter(Boolean)
                          .slice(0, 2)
                          .map(word => word[0])
                          .join('')
                          .toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="employer-info">
                    <h3>{employer.name}</h3>

                    {employer.role && (
                      <span className="employer-role">
                        {employer.role}
                      </span>
                    )}

                    {employer.period && (
                      <span className="employer-period">
                        {employer.period}
                      </span>
                    )}
                  </div>

                </div>
              ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Projects;