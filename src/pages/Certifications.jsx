import { useState, useEffect } from 'react';
import './Certifications.css';

const Certifications = () => {
  const [certs, setCerts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('portfolioCVData');

    if (!saved) {
      setCerts([]);
      return;
    }

    try {
      const data = JSON.parse(saved);

      if (!Array.isArray(data.certifications)) {
        setCerts([]);
        return;
      }

      const normalizedCerts = [];

      data.certifications.forEach((cert) => {
        if (!cert) return;

        const rawTitle = String(cert.title || '');
        const rawDescription = String(cert.description || '');

        const fullText = `${rawTitle}\n${rawDescription}`
          .replace(/\r/g, '')
          .trim();

        if (!fullText) return;

        const parts = fullText
          .replace(/🔹/g, '|')
          .replace(/•/g, '|')
          .split('|')
          .map((part) => part.trim())
          .filter(Boolean);

        parts.forEach((part) => {
          if (
            /^(certifications|certification|advanced training|& advanced training)$/i.test(
              part
            )
          ) {
            return;
          }

          if (/^status\s*:/i.test(part)) {
            return;
          }

          if (
            /^(certifications\s*&\s*advanced training|verified by cv)$/i.test(
              part
            )
          ) {
            return;
          }

          if (
            /certified|certificate|certification|specialization|program|mastering|training|course|professional|associate|expert/i.test(
              part
            )
          ) {
            const title = part
              .replace(/^certification\s*:\s*/i, '')
              .replace(/^certificate\s*:\s*/i, '')
              .trim();

            if (title && title.length <= 180) {
              normalizedCerts.push({
                id: normalizedCerts.length + 1,
                title,
                issuer: '',
                date: '',
                description: '',
                link: cert.link || '#',
                image: cert.image || '',
              });
            }
          }

          if (
            normalizedCerts.length > 0 &&
            /amazon web services|aws|microsoft|azure|google|google cloud|github|duke university|universidad|university|coursera|meta|sábana|sabana/i.test(
              part
            )
          ) {
            const last =
              normalizedCerts[normalizedCerts.length - 1];

            if (!last.issuer) {
              last.issuer = part;
            }
          }
        });

        if (normalizedCerts.length === 0) {
          const matches = fullText.match(
            /(?:Microsoft Certified:[^|]+|AWS Certified[^|]+|Google Cloud[^|]+|Google [^|]+ Certificate[^|]+|Certified Specialist[^|]+|Cybersecurity Program[^|]+|Data Science and Artificial Intelligence Program[^|]+|Specialization[^|]+)/gi
          );

          if (matches) {
            matches.forEach((match) => {
              const title = match
                .replace(/\s+/g, ' ')
                .trim();

              if (
                title &&
                title.length <= 180 &&
                !normalizedCerts.some(
                  (cert) =>
                    cert.title.toLowerCase() === title.toLowerCase()
                )
              ) {
                normalizedCerts.push({
                  id: normalizedCerts.length + 1,
                  title,
                  issuer: '',
                  date: '',
                  description: '',
                  link: cert.link || '#',
                  image: cert.image || '',
                });
              }
            });
          }
        }
      });

      const uniqueCerts = normalizedCerts.filter(
        (cert, index, array) =>
          index ===
          array.findIndex(
            (item) =>
              item.title.toLowerCase() === cert.title.toLowerCase()
          )
      );
      const efSetCert = data.certifications.find((cert) =>
        String(cert?.title || '')
          .toLowerCase()
          .includes('ef set')
      );

      if (
        efSetCert &&
        !uniqueCerts.some((cert) =>
          cert.title.toLowerCase().includes('ef set')
        )
      ) {
        uniqueCerts.push({
          id: uniqueCerts.length + 1,
          title: efSetCert.title,
          issuer: efSetCert.issuer || '',
          date: efSetCert.date || '',
          description: efSetCert.description || '',
          link: efSetCert.link || '#',
          image: efSetCert.image || ''
        });
      }

      setCerts(
        uniqueCerts.map((cert, index) => ({
          ...cert,
          id: index + 1,
        }))
      );
    } catch (error) {
      console.error('Error leyendo portfolioCVData:', error);
      setCerts([]);
    }
  }, []);

  return (
    <section className="certifications-section">
      <div className="certifications-container">

        {/* ENCABEZADO */}

        <div className="certifications-header">

          <div className="certifications-eyebrow">
            <span></span>
            MI FORMACIÓN
            <span></span>
          </div>

          <h2 className="certifications-title">
            Certifica<span>ciones</span>
          </h2>

          <p className="certifications-subtitle">
            Credenciales que respaldan mi experiencia y compromiso
            <br />
            con el aprendizaje continuo.
          </p>

        </div>

        {/* CERTIFICACIONES */}

        <div className="certs-list">

          {certs.map((cert) => (

            <article
              key={cert.id}
              className="cert-card"
            >

              {/* IMAGEN */}

              <div className="cert-image-container">

                {cert.image ? (
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="cert-image"
                    onClick={() => setSelectedImage(cert.image)}
                  />
                ) : (
                  <div className="cert-image-placeholder">
                    Certificado
                  </div>
                )}

              </div>

              {/* INFORMACIÓN */}

              <div className="cert-content">

                <div className="cert-category">
                  CLOUD & INFRASTRUCTURE
                </div>

                <h3 className="cert-title">
                  {cert.title}
                </h3>

                {cert.issuer && (
                  <p className="cert-issuer">
                    {cert.issuer}
                  </p>
                )}

                {cert.description && (
                  <p className="cert-description">
                    {cert.description}
                  </p>
                )}

                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cert-link"
                >
                  Ver certificado
                  <span>↗</span>
                </a>

              </div>

            </article>

          ))}

        </div>

        {/* FRASE FINAL */}

        <div className="certifications-footer">

          <span></span>

          <em>
            "El conocimiento no tiene límites"
          </em>

          <span></span>

        </div>
        {
          selectedImage && (
            <div
              className="cert-image-modal"
              onClick={() => setSelectedImage(null)}
            >
              <div
                className="cert-image-modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="cert-image-modal-close"
                  onClick={() => setSelectedImage(null)}
                >
                  ×
                </button>

                <img
                  src={selectedImage}
                  alt="Certificación ampliada"
                />
              </div>
            </div>
          )
        }

      </div>
    </section>
  );
};


export default Certifications;