import { Link, useParams } from 'react-router-dom';
import './ProjectDetails.css';

const projects = {
    1: {
        title: 'Multi-Cloud Infrastructure Factory',
        badge: 'Strategic Owner',
        technologies: ['Terraform', 'Azure', 'AWS', 'GCP', 'OCI'],

        architecture: {
            title: 'Cloud Foundation Design',
            overview:
                'Terraform-based platform designed to standardize cloud provisioning across Azure, AWS, GCP and OCI environments.',
            flow: [
                'Developers',
                'Git Repository',
                'CI/CD Pipeline',
                'Terraform Modules',
                'Cloud Providers',
                'Governance + Security + Monitoring',
            ],
            components: [
                'Reusable Terraform modules',
                'Environment isolation',
                'Cloud governance patterns',
                'IAM/RBAC controls',
                'Automated provisioning workflows',
            ],
        },

        caseStudy: {
            title: 'Standardizing Cloud Delivery',
            challenge:
                'Cloud environments required greater consistency, repeatability and governance.',
            approach:
                'Implemented IaC practices using Terraform to replace manual provisioning and establish reusable cloud patterns.',
            solution: [
                'Created standardized infrastructure modules',
                'Automated environment deployments',
                'Introduced governance and security controls',
            ],
            impact: [
                'Increased release frequency by approximately 65%',
                'Improved team execution efficiency by approximately 40%',
            ],
            ownership: 'Strategic Owner / Cloud Platform Lead',
        },
    },

    2: {
        title: 'Cloud-Native SaaS Platform',
        badge: 'Founder / Solutions Architect',
        technologies: [
            'Azure Functions',
            'Container Apps',
            'React',
            'Firebase',
            'AWS Lambda',
            'APIs',
        ],

        architecture: {
            title: 'Serverless & Cloud-Native Application Design',
            overview:
                'Cloud-native architecture combining managed services, APIs and serverless components to deliver scalable business applications.',
            flow: [
                'Users',
                'Frontend Application',
                'API Layer',
                'Serverless Services',
                'Data Services',
                'External Integrations',
            ],
            components: [
                'Azure Functions',
                'Azure Container Apps',
                'Static Web Apps',
                'Firebase services',
                'AWS Lambda patterns',
                'Microsoft Graph integrations',
            ],
        },

        caseStudy: {
            title: 'Building Scalable Business Solutions',
            challenge:
                'Business applications required flexible architectures capable of scaling without increasing operational complexity.',
            approach:
                'Designed cloud-native solutions using managed services and automation-first principles.',
            solution: [
                'Reduced infrastructure management overhead',
                'Applied serverless architecture patterns',
                'Integrated APIs and cloud services',
            ],
            impact: [
                'Created reusable solution patterns for digital products and business automation',
            ],
            ownership: 'Founder / Solution Architect',
        },
    },

    3: {
        title: 'Kubernetes Production Platform',
        badge: 'Platform Engineering',
        technologies: [
            'Kubernetes',
            'AKS',
            'GKE',
            'Docker',
            'Helm',
            'Terraform',
        ],

        architecture: {
            title: 'Container Platform Engineering',
            overview:
                'Production Kubernetes environments designed for scalable workloads, automated deployments and operational reliability.',
            flow: [
                'Users',
                'Ingress Controller',
                'Kubernetes Cluster',
                'Applications',
                'Services',
                'Data Layer',
            ],
            monitoring: ['Prometheus + Grafana', 'Azure Monitor'],
            components: [
                'Kubernetes / AKS / GKE',
                'Docker containers',
                'Helm deployments',
                'Ingress and TLS',
                'Autoscaling',
                'Infrastructure automation',
            ],
        },

        caseStudy: {
            title: 'Improving Containerized Workload Reliability',
            challenge:
                'Applications required consistent deployment processes and reliable runtime environments.',
            approach:
                'Implemented Kubernetes-based operational patterns focused on scalability and maintainability.',
            solution: [
                'Automated workload deployment',
                'Improved cluster visibility',
                'Applied container orchestration practices',
            ],
            impact: [
                'Improved platform reliability and deployment consistency',
            ],
            ownership: 'Technical Owner / Platform Engineer',
        },
    },

    4: {
        title: 'Enterprise CI/CD Delivery Platform',
        badge: 'Technical Owner',
        technologies: [
            'Azure DevOps',
            'GitHub Actions',
            'Jenkins',
            'GitLab CI',
            'Docker',
            'DevSecOps',
        ],

        architecture: {
            title: 'Automated Software Delivery Pipeline',
            overview:
                'CI/CD framework designed to automate software delivery from code validation to production deployment.',
            flow: [
                'Developer',
                'Pull Request',
                'Build & Test',
                'Security Validation',
                'Container Build',
                'Deployment',
                'Monitoring',
            ],
            components: [
                'Azure DevOps',
                'GitHub Actions',
                'Jenkins',
                'GitLab CI/CD',
                'Docker',
                'Release strategies',
            ],
        },

        caseStudy: {
            title: 'Accelerating Software Delivery',
            challenge:
                'Manual deployment processes increased delivery time and operational risk.',
            approach:
                'Created automated pipelines with validation stages and controlled deployment workflows.',
            solution: [
                'Automated build processes',
                'Added deployment gates',
                'Standardized release workflows',
            ],
            impact: [
                'Reduced CI/CD deployment time by approximately 50%',
            ],
            ownership: 'Technical Owner / DevOps Engineer',
        },
    },

    5: {
        title: 'SRE Observability Framework',
        badge: 'SRE Lead Contributor',
        technologies: [
            'Azure Monitor',
            'Prometheus',
            'Grafana',
            'Datadog',
            'KQL',
            'SLI/SLO',
        ],

        architecture: {
            title: 'Reliability Monitoring Platform',
            overview:
                'Observability framework focused on detecting issues early and improving production reliability.',
            flow: [
                'Applications',
                'Logs + Metrics + Traces',
                'Observability Platform',
                'Alerts',
                'Incident Response',
                'Continuous Improvement',
            ],
            components: [
                'Azure Monitor',
                'Application Insights',
                'Log Analytics',
                'Prometheus',
                'Grafana',
                'Datadog',
                'SLI/SLO practices',
            ],
        },

        caseStudy: {
            title: 'Building SRE Operational Maturity',
            challenge:
                'Production systems required better visibility, faster troubleshooting and structured incident management.',
            approach:
                'Implemented monitoring standards, alert strategies and operational processes.',
            solution: [
                'Created runbooks',
                'Improved alert quality',
                'Established incident review practices',
            ],
            impact: [
                'Improved production reliability by approximately 38%',
            ],
            ownership: 'SRE Lead Contributor',
        },
    },

    6: {
        title: 'Infrastructure Automation Toolkit',
        badge: 'Automation Engineer',
        technologies: [
            'Python',
            'PowerShell',
            'Bash',
            'Ansible',
            'Azure CLI',
            'Linux',
        ],

        architecture: {
            title: 'Operational Automation Framework',
            overview:
                'Automation tools designed to reduce repetitive operational tasks and accelerate troubleshooting.',
            flow: [
                'Operational Task',
                'Automation Script',
                'Validation',
                'Execution',
                'Reporting',
            ],
            components: [
                'Python',
                'PowerShell',
                'Bash',
                'Azure CLI',
                'Ansible',
                'Linux automation',
            ],
        },

        caseStudy: {
            title: 'Reducing Manual Operations',
            challenge:
                'Recurring operational tasks increased support effort and resolution times.',
            approach:
                'Developed automation scripts and repeatable workflows for infrastructure operations.',
            solution: [
                'Automated validation tasks',
                'Improved troubleshooting workflows',
                'Reduced repetitive manual activities',
            ],
            impact: [
                'Improved operational efficiency and incident response capabilities',
            ],
            ownership: 'Automation Engineer',
        },
    },
};

const ProjectDetails = () => {
    const { projectId, view } = useParams();

    const project = projects[projectId];

    if (!project) {
        return (
            <section className="project-details-page">
                <div className="project-details-container">
                    <h1>Project not found</h1>
                    <Link to="/projects" className="project-back-button">
                        ← Back to Projects
                    </Link>
                </div>
            </section>
        );
    }

    const isArchitecture = view === 'architecture';
    const isCaseStudy = view === 'case-study';

    return (
        <section className="project-details-page">
            <div className="project-details-container">

                <Link to="/projects" className="project-back-button">
                    ← Back to Projects
                </Link>

                <header className="project-details-hero">
                    <span className="project-details-badge">
                        {project.badge}
                    </span>

                    <h1>{project.title}</h1>

                    <p>
                        {isArchitecture
                            ? project.architecture.overview
                            : project.caseStudy.challenge}
                    </p>
                </header>

                <div className="project-details-navigation">
                    <Link
                        to={`/projects/${projectId}/architecture`}
                        className={`project-view-button ${isArchitecture ? 'active' : ''
                            }`}
                    >
                        Architecture
                    </Link>

                    <Link
                        to={`/projects/${projectId}/case-study`}
                        className={`project-view-button ${isCaseStudy ? 'active' : ''
                            }`}
                    >
                        Case Study
                    </Link>
                </div>

                {isArchitecture && (
                    <div className="project-content">

                        {/* ARCHITECTURE HEADER */}
                        <section className="project-detail-section architecture-intro">
                            <span className="project-section-label">ARCHITECTURE</span>

                            <h2>{project.architecture.title}</h2>

                            <p className="project-overview">
                                {project.architecture.overview}
                            </p>
                        </section>

                        {/* ARCHITECTURE DIAGRAM */}
                        <section className="project-detail-section">
                            <div className="section-heading-row">
                                <div>
                                    <span className="project-section-label">
                                        ARCHITECTURE COMPONENTS
                                    </span>
                                    <h3 className="architecture-section-title">
                                        Platform Architecture
                                    </h3>
                                </div>

                                <span className="architecture-status">
                                    PRODUCTION READY
                                </span>
                            </div>

                            {projectId === '1' ? (
                                <div className="architecture-modern-diagram">

                                    <div className="architecture-main-node">
                                        Developers
                                    </div>

                                    <div className="architecture-line vertical">
                                        ↓
                                    </div>

                                    <div className="architecture-main-node">
                                        Git Repository
                                    </div>

                                    <div className="architecture-line vertical">
                                        ↓
                                    </div>

                                    <div className="architecture-main-node">
                                        CI/CD Pipeline
                                    </div>

                                    <div className="architecture-line vertical">
                                        ↓
                                    </div>

                                    <div className="architecture-main-node architecture-highlight">
                                        Terraform Modules
                                    </div>

                                    <div className="architecture-line vertical">
                                        ↓
                                    </div>

                                    <div className="architecture-provider-title">
                                        CLOUD PROVIDERS
                                    </div>

                                    <div className="architecture-provider-grid">

                                        <div className="architecture-provider-card azure">
                                            <span className="provider-icon">AZ</span>
                                            <strong>Azure</strong>
                                        </div>

                                        <div className="architecture-provider-card aws">
                                            <span className="provider-icon">AWS</span>
                                            <strong>AWS</strong>
                                        </div>

                                        <div className="architecture-provider-card gcp">
                                            <span className="provider-icon">GC</span>
                                            <strong>GCP</strong>
                                        </div>

                                        <div className="architecture-provider-card oci">
                                            <span className="provider-icon">OC</span>
                                            <strong>OCI</strong>
                                        </div>

                                    </div>

                                    <div className="architecture-line vertical">
                                        ↓
                                    </div>

                                    <div className="architecture-governance-node">
                                        <span>GOVERNANCE</span>
                                        <strong>
                                            Governance + Security + Monitoring
                                        </strong>
                                    </div>

                                </div>
                            ) : (
                                <div className="architecture-modern-diagram">

                                    {project.architecture.flow.map((item, index) => (
                                        <div
                                            className="architecture-flow-item"
                                            key={item}
                                        >
                                            <div className="architecture-main-node">
                                                {item}
                                            </div>

                                            {index <
                                                project.architecture.flow.length - 1 && (
                                                    <div className="architecture-line vertical">
                                                        ↓
                                                    </div>
                                                )}
                                        </div>
                                    ))}

                                </div>
                            )}
                        </section>

                        {/* MONITORING */}
                        {project.architecture.monitoring && (
                            <section className="project-detail-section">

                                <span className="project-section-label">
                                    MONITORING
                                </span>

                                <div className="project-tech-grid monitoring-grid">
                                    {project.architecture.monitoring.map((item) => (
                                        <div
                                            className="project-tech-card premium-tech-card"
                                            key={item}
                                        >
                                            <span className="tech-card-dot"></span>
                                            {item}
                                        </div>
                                    ))}
                                </div>

                            </section>
                        )}

                        {/* CORE COMPONENTS */}
                        <section className="project-detail-section">

                            <span className="project-section-label">
                                CORE COMPONENTS
                            </span>

                            <h3 className="architecture-section-title">
                                Engineering Components
                            </h3>

                            <div className="project-tech-grid premium-component-grid">

                                {project.architecture.components.map((item) => (
                                    <div
                                        className="project-tech-card premium-tech-card"
                                        key={item}
                                    >
                                        <span className="tech-card-dot"></span>

                                        <span>{item}</span>
                                    </div>
                                ))}

                            </div>

                        </section>

                        {/* TECHNOLOGY STACK */}
                        <section className="project-detail-section">

                            <span className="project-section-label">
                                TECHNOLOGY STACK
                            </span>

                            <div className="project-stack premium-stack">

                                {project.technologies.map((tech) => (
                                    <span key={tech}>
                                        {tech}
                                    </span>
                                ))}

                            </div>

                        </section>

                    </div>
                )}

                {isCaseStudy && (
                    <div className="project-content">

                        {/* CASE STUDY HEADER */}
                        <section className="project-detail-section case-study-intro">

                            <span className="project-section-label">
                                CASE STUDY
                            </span>

                            <h2>{project.caseStudy.title}</h2>

                        </section>

                        {/* CHALLENGE + APPROACH */}
                        <div className="case-study-grid">

                            <section className="case-study-card">

                                <span className="project-section-label">
                                    CHALLENGE
                                </span>

                                <h3>The Challenge</h3>

                                <p>
                                    {project.caseStudy.challenge}
                                </p>

                            </section>

                            <section className="case-study-card">

                                <span className="project-section-label">
                                    APPROACH
                                </span>

                                <h3>The Approach</h3>

                                <p>
                                    {project.caseStudy.approach}
                                </p>

                            </section>

                        </div>

                        {/* SOLUTION */}
                        <section className="project-detail-section">

                            <div className="section-heading-row">

                                <div>
                                    <span className="project-section-label">
                                        SOLUTION
                                    </span>

                                    <h3 className="architecture-section-title">
                                        Key Implementation Areas
                                    </h3>
                                </div>

                            </div>

                            <div className="solution-modern-grid">

                                {project.caseStudy.solution.map((item, index) => (
                                    <div
                                        className="solution-modern-card"
                                        key={item}
                                    >

                                        <span className="solution-number">
                                            0{index + 1}
                                        </span>

                                        <div>
                                            <span className="solution-check">
                                                ✓
                                            </span>

                                            <p>{item}</p>
                                        </div>

                                    </div>
                                ))}

                            </div>

                        </section>

                        {/* IMPACT */}
                        <section className="project-detail-section">

                            <div className="section-heading-row">

                                <div>
                                    <span className="project-section-label">
                                        IMPACT
                                    </span>

                                    <h3 className="architecture-section-title">
                                        Business & Engineering Impact
                                    </h3>
                                </div>

                            </div>

                            <div className="project-impact-grid premium-impact-grid">

                                {project.caseStudy.impact.map((item, index) => (
                                    <div
                                        key={item}
                                        className="project-impact-card premium-impact-card"
                                    >

                                        <span className="impact-index">
                                            0{index + 1}
                                        </span>

                                        <span className="impact-label">
                                            IMPACT
                                        </span>

                                        <strong>
                                            {item}
                                        </strong>

                                    </div>
                                ))}

                            </div>

                        </section>

                        {/* OWNERSHIP */}
                        <section className="project-detail-section">

                            <span className="project-section-label">
                                OWNERSHIP
                            </span>

                            <div className="project-ownership premium-ownership">

                                <div className="ownership-icon">
                                    ✓
                                </div>

                                <div>
                                    <span>ROLE & RESPONSIBILITY</span>

                                    <strong>
                                        {project.caseStudy.ownership}
                                    </strong>
                                </div>

                            </div>

                        </section>

                    </div>
                )}

            </div>
        </section>
    );
};

export default ProjectDetails;