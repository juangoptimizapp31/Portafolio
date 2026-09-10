import React, { useState, useEffect } from 'react';
import './Degrees.css';

const Degrees = () => {
  const [degrees, setDegrees] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); <div className="degree-image-container"></div>

  useEffect(() => {
    const saved = localStorage.getItem('portfolioCVData');

    if (!saved) {
      setDegrees([]);
      return;
    }

    try {
      const data = JSON.parse(saved);

      if (!Array.isArray(data.education)) {
        setDegrees([]);
        return;
      }

      const normalizedDegrees = [];
      let pendingInstitution = '';

      data.education.forEach((item) => {
        if (!item) return;

        const rawTitle = String(item.title || '');
        const rawDescription = String(item.description || '');
        const rawInstitution = String(item.institution || '');
        const rawDate = String(item.date || '');

        const fullText = `${rawTitle}\n${rawDescription}\n${rawInstitution}\n${rawDate}`

        /*
         * =========================================================
         * 1. EXTRAER INSTITUCIÓN
         * =========================================================
         */

        const schoolMatch = fullText.match(
          /(?:School|Institution|University|Universidad|College|Institute)\s*:\s*([^\n]+)/i
        );

        if (schoolMatch) {
          pendingInstitution = schoolMatch[1].trim();
        }

        /*
         * También detectamos una institución que venga sola.
         */

        const cleanedRawTitle = rawTitle
          .replace(/^School\s*:\s*/i, '')
          .replace(/^Institution\s*:\s*/i, '')
          .trim();

        const looksLikeInstitution =
          /^(university|universidad|college|institute|instituto)\b/i.test(
            cleanedRawTitle
          );

        if (looksLikeInstitution && cleanedRawTitle.length < 120) {
          pendingInstitution = cleanedRawTitle;
        }

        /*
         * =========================================================
         * 2. EXTRAER TÍTULO ACADÉMICO
         * =========================================================
         */

        let title = '';

        const degreeMatch = fullText.match(
          /(?:Degree|Title|Program|Qualification)\s*:\s*([^\n]+)/i
        );

        if (degreeMatch) {
          title = degreeMatch[1].trim();
        }

        /*
         * Si no existe "Degree:", usamos el title original.
         */

        if (!title) {
          title = rawTitle
            .replace(/^School\s*:\s*/i, '')
            .replace(/^Institution\s*:\s*/i, '')
            .replace(/^Degree\s*:\s*/i, '')
            .trim();
        }

        /*
         * =========================================================
         * 3. LIMPIAR TÍTULO SI VIENE MEZCLADO CON TODO EL PDF
         * =========================================================
         */

        title = title
          .split(/\n/)[0]
          .replace(/^(Degree|Title|Program|Qualification)\s*:\s*/i, '')
          .trim();

        /*
         * Si el título todavía contiene etiquetas posteriores,
         * cortamos antes de ellas.
         */

        title = title
          .split(/\s+(?:Date|Description|Descriptions|School|Institution)\s*:/i)[0]
          .trim();

        /*
         * =========================================================
         * 4. DESCARTAR CERTIFICACIONES Y CURSOS
         * =========================================================
         */

        const classificationText = fullText.toLowerCase();

        const isCertification =
          /\b(certificate|certification|certified|course|courses|curso|cursos|training|bootcamp|workshop|credential|completion)\b/i.test(
            classificationText
          );

        /*
         * "Mastering" NO significa Master's Degree.
         */

        const isMasteringCourse =
          /\bmastering\b/i.test(title) &&
          !/\bmaster(?:'s)?\s+degree\b|\bmaster of\b/i.test(title);

        /*
         * =========================================================
         * 5. VALIDAR QUE SEA EDUCACIÓN FORMAL
         * =========================================================
         */

        const isAcademic =
          /\b(bachelor|bachelor's|master|master's|phd|doctorate|doctor|engineering|engineer|technologist|technology|technical degree|degree|undergraduate|graduate|universidad|university|college|institute|instituto|licenciatura|ingeniería|ingenieria|tecnólogo|tecnologo)\b/i.test(
            title
          ) ||
          /\b(bachelor|bachelor's|master|master's|phd|doctorate|engineering|technologist|degree)\b/i.test(
            fullText
          );

        if (isCertification) return;
        if (isMasteringCourse) return;
        if (!isAcademic) return;

        /*
         * =========================================================
         * 6. FECHA
         * =========================================================
         */

        let year = rawDate;

        /*
         * =========================================================
         * 7. NIVEL ACADÉMICO
         * =========================================================
         */

        let level = '';

        if (/\b(bachelor|bachelor's)\b/i.test(title)) {
          level = "Bachelor's Degree";
        } else if (/\b(master|master's)\b/i.test(title)) {
          level = "Master's Degree";
        } else if (/\b(phd|doctorate|doctor)\b/i.test(title)) {
          level = 'Doctorate';
        } else if (/\bengineering|engineer\b/i.test(title)) {
          level = 'Engineering Degree';
        } else if (/\btechnologist|technology\b/i.test(title)) {
          level = 'Technologist';
        } else if (/\btechnical degree\b/i.test(title)) {
          level = 'Technical Degree';
        } else if (/\bundergraduate\b/i.test(title)) {
          level = 'Undergraduate Degree';
        } else if (/\bgraduate\b/i.test(title)) {
          level = 'Graduate Degree';
        } else if (/\bdegree\b/i.test(title)) {
          level = 'Degree';
        }

        /*
         * =========================================================
         * 8. SI ESTE ITEM ES SOLO LA INSTITUCIÓN,
         *    NO CREAR UNA TARJETA
         * =========================================================
         */

        if (
          looksLikeInstitution &&
          !/\b(degree|bachelor|master|technologist|engineering|technical)\b/i.test(
            title
          )
        ) {
          return;
        }

        /*
         * =========================================================
         * 9. ASEGURAR QUE NO ESTEMOS MOSTRANDO BASURA
         * =========================================================
         */

        if (!title || title.length > 150) {
          return;
        }

        /*
         * =========================================================
         * 10. EVITAR DUPLICADOS
         * =========================================================
         */

        const alreadyExists = normalizedDegrees.some(
          (degree) =>
            degree.title.toLowerCase() === title.toLowerCase()
        );

        if (alreadyExists) return;

        /*
         * =========================================================
         * 11. CREAR TARJETA LIMPIA
         * =========================================================
         */

        normalizedDegrees.push({
          id: normalizedDegrees.length + 1,
          title,
          institution: rawInstitution || pendingInstitution,
          year,
          level,
          description: rawDescription,
          image: item.image || '',
          link: item.link || '#'
        });
        pendingInstitution = '';
      });

      setDegrees(normalizedDegrees);
    } catch (error) {
      console.error('Error leyendo portfolioCVData:', error);
      setDegrees([]);
    }
  }, []);

  return (
    <section className="degrees-section">

      <div className="degrees-container">

        {/* ENCABEZADO */}

        <div className="degrees-header">

          <div className="degrees-eyebrow">
            <span></span>
            EDUCATION
            <span></span>
          </div>

          <h2 className="degrees-title">
            Professional <span>Degrees</span>
          </h2>

          <p className="degrees-subtitle">
            My academic background and professional training.
          </p>

        </div>


        {/* GRADOS */}

        <div className="degrees-list">

          {degrees.map((degree) => (

            <article
              key={degree.id}
              className="degree-card"
            >

              {/* DOCUMENTO */}

              <div
                className={`degree-image-container ${degree.image ? 'clickable' : ''}`}
                onClick={() => {
                  if (degree.image) {
                    setSelectedImage({
                      image: degree.image,
                      title: degree.title
                    });
                  }
                }}
              >
                {degree.image ? (
                  <img
                    src={degree.image}
                    alt={degree.title}
                    className="degree-image"
                  />
                ) : (
                  <div className="degree-image-placeholder">
                    Academic Certificate
                  </div>
                )}
              </div>


              {/* INFORMACIÓN PRINCIPAL */}

              <div className="degree-content">

                {degree.level && (
                  <div className="degree-badge">
                    {degree.level}
                  </div>
                )}

                <h3 className="degree-title">
                  {degree.title}
                </h3>

                {degree.institution && (
                  <p className="degree-institution">
                    {degree.institution}
                  </p>
                )}

                <div className="degree-details">

                  {degree.year && (
                    <div className="degree-detail">
                      <span className="degree-detail-icon">
                        ▣
                      </span>

                      <span>
                        {degree.year}
                      </span>
                    </div>
                  )}

                  {degree.level && (
                    <div className="degree-detail">
                      <span className="degree-detail-icon">
                        ◆
                      </span>

                      <span>
                        {degree.level}
                      </span>
                    </div>
                  )}

                  <div className="degree-detail degree-status">
                    <span className="degree-status-dot"></span>

                    <span>
                      Status: <strong>Completed</strong>
                    </span>
                  </div>

                </div>

              </div>


              {/* DESCRIPCIÓN Y ACCIONES */}

              <div className="degree-extra">

                {degree.level && (
                  <div className="degree-extra-badge">
                    {degree.level}
                  </div>
                )}

                {degree.description && (
                  <p className="degree-description">
                    {degree.description}
                  </p>
                )}

                <div className="degree-actions">

                  {degree.link && degree.link !== '#' && (
                    <a
                      href={degree.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="degree-view-button"
                    >
                      View Certificate
                      <span>↗</span>
                    </a>
                  )}

                  {degree.image && (
                    <a
                      href={degree.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="degree-download-button"
                      aria-label="Download certificate"
                    >
                      ↓
                    </a>
                  )}

                </div>

              </div>

            </article>

          ))}

        </div>


        {/* FRASE FINAL */}

        <div className="degrees-footer">

          <span></span>

          <em>
            "Education is the foundation for a better future"
          </em>

          <span></span>

        </div>

      </div>
      {selectedImage && (
        <div
          className="degree-modal-overlay"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="degree-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="degree-modal-close"
              onClick={() => setSelectedImage(null)}
              aria-label="Close image"
            >
              ×
            </button>

            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="degree-modal-image"
            />

            <div className="degree-modal-title">
              {selectedImage.title}
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default Degrees;