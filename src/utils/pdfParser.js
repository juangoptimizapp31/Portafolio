import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configurar el worker para pdfjs-dist usando la importación de URL de Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export const extractTextFromPDF = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const typedarray = new Uint8Array(event.target.result);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;

        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();

          const items = textContent.items
            .filter(item => item.str && item.str.trim())
            .map(item => ({
              text: item.str.trim(),
              x: item.transform[4],
              y: item.transform[5],
              hasEOL: item.hasEOL
            }));

          const lines = [];
          let currentLine = null;

          items.forEach(item => {
            const startsNewLine =
              !currentLine ||
              Math.abs(item.y - currentLine.y) > 3;

            if (startsNewLine) {
              currentLine = {
                y: item.y,
                text: item.text
              };

              lines.push(currentLine);
            } else {
              currentLine.text += ` ${item.text}`;
            }

            if (item.hasEOL) {
              currentLine = null;
            }
          });

          const pageText = lines
            .map(line => line.text.trim())
            .filter(Boolean)
            .join('\n');

          fullText += pageText + '\n';
        }

        resolve(fullText);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

export const parseCVData = (text) => {
  const data = {
    name: '',
    email: '',
    phone: '',
    summary: '',
    experience: [],
    education: [],
    certifications: [],
    skills: [],
    employers: []
  };

  // Extraer Email
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i;
  const emails = text.match(emailRegex);
  if (emails) data.email = emails[0];

  // Extraer Teléfono
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const phones = text.match(phoneRegex);
  if (phones) data.phone = phones[0];

  // Extraer Nombre (asumiendo que está al principio)
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length > 0) {
    // Tomar la primera o segunda línea razonable que parezca un nombre
    data.name = lines[0].length < 40 ? lines[0] : '';
  }

  // Identificar secciones mediante palabras clave
  const normalizedText = text.replace(
    /professional\s+degrees\s*&\s*advanced\s+training/gi,
    match => match.replace('&', '\n')
  );

  const lowerText = normalizedText.toLowerCase();

  // Encontrar índices de palabras clave
  // Encontrar índices de palabras clave
  const sections = {
    summary: lowerText.search(
      /\b(summary|professional summary|profile|professional profile|about me|perfil profesional|perfil|resumen profesional|sobre mí)\b/i
    ),

    experience: lowerText.search(
      /(?:^|\n)\s*(?:experience|professional experience|work experience|experiencia|experiencia profesional|historial laboral|employment history|employment)\s*:?\s*(?:\n|$)/im
    ),

    education: lowerText.search(
      /\b(education|professional education|educación|educación profesional|estudios|studies|formación académica|academic background|educational background|professional degrees)\b/i
    ),

    certifications: lowerText.search(
      /\b(certifications|professional certifications|certificación|certificaciones|courses|cursos|training|professional training|professional development|advanced training|logros)\b/i
    ),

    skills: lowerText.search(
      /\b(skills|technical skills|technical competencies|habilidades|habilidades técnicas|conocimientos|competencias)\b/i
    )
  };

  // Funciones auxiliares para extraer items basados en patrones
  const extractItems = (sectionText) => {
    if (!sectionText) return [];

    // Intenta dividir por palabras clave del formato específico del CV
    // o por años si no encuentra el formato estructurado
    const itemSplitter = /^(?:Company:|School:|Degree:|Job Title:)/i;
    const yearPattern = /(?:19|20)\d{2}\s*[-–—]\s*(?:(?:19|20)\d{2}|Presente|Actual|Present)/gi;

    let items = [];
    let lines = sectionText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    let currentItem = { title: '', description: '' };

    lines.forEach(line => {
      // Si la línea es el inicio de un nuevo ítem basado en las etiquetas estructuradas
      if (line.match(itemSplitter)) {
        // Guardar el anterior si tiene algo útil
        if (currentItem.title || currentItem.description.length > 10) {
          items.push({ ...currentItem });
        }

        // El título será la línea actual sin la etiqueta
        currentItem = {
          title: line.replace(/^(?:Company:|School:|Degree:|Job Title:)\s*/i, ''),
          description: ''
        };
      }
      // Si no encontró el formato de etiquetas, usar lógica de años para dividir
      else if (!items.length && line.match(yearPattern)) {
        if (currentItem.title || currentItem.description) {
          items.push({ ...currentItem });
        }
        currentItem = { title: line, description: '' };
      }
      // Si es una línea de fecha o ubicación, la ponemos en la descripción de forma limpia
      else if (line.match(/^(?:Date:|Location:|Descriptions?:)/i)) {
        currentItem.description += '\n' + line;
      }
      // Cualquier otra línea
      else {
        if (!currentItem.title) {
          currentItem.title = line.replace(/^[-•*]\s*/, '');
        } else {
          // Si empieza con viñeta, forzar salto de línea
          if (line.match(/^[-•*]/)) {
            currentItem.description += '\n' + line;
          } else {
            currentItem.description += ' ' + line;
          }
        }
      }
    });

    if (currentItem.title || currentItem.description) {
      items.push({ ...currentItem });
    }

    // Limpiar las descripciones
    return items.map(item => ({
      ...item,
      description: item.description.trim()
    })).filter(item => item.title || item.description);
  };
  const extractExperience = (sectionText) => {
    if (!sectionText) return [];

    const lines = sectionText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    const experience = [];

    const datePattern =
      /\b(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+)?(?:19|20)\d{2}\b\s*[-–—]\s*(?:(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+)?(?:19|20)\d{2}|Present|Current|Actual|Presente)\b/i;

    const companyPattern =
      /^(?:Company|Employer|Organization|Organisation|Empresa|Empleador|Cliente|Client):\s*(.+)$/i;

    const jobPattern =
      /^(?:Job Title|Position|Role|Cargo|Puesto|Title|Job):\s*(.+)$/i;

    const locationPattern =
      /^(?:Location|Ubicación|Lugar):\s*(.+)$/i;

    let current = null;

    const createCurrent = () => ({
      title: '',
      employer: '',
      period: '',
      location: '',
      description: ''
    });

    const saveCurrent = () => {
      if (!current) return;

      current.title = current.title.trim();
      current.employer = current.employer.trim();
      current.period = current.period.trim();
      current.location = current.location.trim();
      current.description = current.description.trim();

      if (current.title || current.employer) {
        experience.push({
          title: current.title,
          employer: current.employer,
          period: current.period,
          location: current.location,
          description: current.description
        });
      }

      current = null;
    };

    lines.forEach(line => {
      /*
      * Formato:
      * Empresa | Cargo
      */
      if (line.includes('|')) {
        const parts = line
          .split('|')
          .map(part => part.trim())
          .filter(Boolean);

        if (parts.length >= 2) {
          saveCurrent();

          current = createCurrent();
          current.employer = parts[0];
          current.title = parts.slice(1).join(' | ');

          return;
        }
      }

      const companyMatch = line.match(companyPattern);
      const jobMatch = line.match(jobPattern);
      const locationMatch = line.match(locationPattern);
      const dateMatch = line.match(datePattern);

      if (companyMatch) {
        if (current && (current.employer || current.title)) {
          saveCurrent();
        }

        current = createCurrent();
        current.employer = companyMatch[1].trim();
        return;
      }

      if (jobMatch) {
        if (current && current.title) {
          saveCurrent();
        }

        if (!current) {
          current = createCurrent();
        }

        current.title = jobMatch[1].trim();
        return;
      }

      if (dateMatch) {
        if (!current) {
          current = createCurrent();
        }

        current.period = dateMatch[0].trim();
        return;
      }

      if (locationMatch) {
        if (!current) {
          current = createCurrent();
        }

        current.location = locationMatch[1].trim();
        return;
      }

      /*
      * Si todavía no tenemos empresa ni cargo,
      * esta línea puede ser el encabezado de una experiencia.
      */
      if (!current) {
        const normalizedLine = line
          .replace(/^[-•*]\s*/, '')
          .trim()
          .toLowerCase();

        const sectionHeaders = [
          'professional experience',
          'professional experiences',
          'work experience',
          'work experiences',
          'experience',
          'experiencia profesional',
          'experiencia laboral',
          'historial laboral',
          'employment history'
        ];

        if (sectionHeaders.includes(normalizedLine)) {
          return;
        }

        current = createCurrent();
        current.title = line.replace(/^[-•*]\s*/, '');
        return;
      }

      /*
      * Si tenemos empresa pero todavía no cargo,
      * la siguiente línea puede ser el cargo.
      */
      if (!current.title && current.employer) {
        current.title = line.replace(/^[-•*]\s*/, '');
        return;
      }

      /*
      * Si tenemos cargo pero no empresa,
      * la siguiente línea puede ser la empresa.
      */
      if (!current.employer && current.title) {
        current.employer = line.replace(/^[-•*]\s*/, '');
        return;
      }

      /*
      * Todo lo demás corresponde a la descripción.
      */
      if (line.match(/^[-•*]/)) {
        current.description +=
          (current.description ? '\n' : '') + line;
      } else {
        current.description +=
          (current.description ? ' ' : '') + line;
      }
    });

    saveCurrent();

    const invalidHeaders = [
      'professional experience',
      'professional experiences',
      'work experience',
      'work experiences',
      'experience',
      'experiencia profesional',
      'experiencia laboral',
      'historial laboral',
      'employment history'
    ];

    return experience.filter(item => {
      const title = (item.title || '').trim().toLowerCase();
      const employer = (item.employer || '').trim().toLowerCase();

      return (
        (title || employer) &&
        !invalidHeaders.includes(title) &&
        !invalidHeaders.includes(employer)
      );
    });
    return experience.filter(item =>
      item.title || item.employer
    );
  };

  const extractEducation = (sectionText) => {
    if (!sectionText) return [];

    const lines = sectionText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    const education = [];

    const academicKeywords =
      /\b(university|universidad|college|instituto|institute|school|escuela)\b/i;

    const degreeKeywords = /\b(professional degree|bachelor's degree|bachelor|master's degree|master's|master|phd|doctorate|engineering|ingeniería|technologist|tecnólogo|technical degree|técnico|licenciatura|undergraduate|graduate|associate degree|degree|diploma|specialization|especialización)\b/i;
    const certificationKeywords = /\b(certificate|certification|certified|course|courses|bootcamp|training|workshop|credential|completion|mastering)\b/i;
    const datePattern =
      /\b(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?(?:19|20)\d{2}\b(?:\s*[-–—]\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?(?:19|20)\d{2})?/i;

    const clean = (value) => {
      return value
        .replace(/^(?:School|Institution|University|Universidad):\s*/i, '')
        .replace(/^(?:Degree|Título|Titulo|Carrera|Programa|Qualification):\s*/i, '')
        .replace(/^(?:Date|Fecha|Period|Periodo):\s*/i, '')
        .replace(/^(?:Description|Descripción|Descriptions):\s*/i, '')
        .replace(/^[-•*]\s*/, '')
        .trim();
    };

    let current = null;

    const pushCurrent = () => {
      if (!current) return;

      current.title = current.title.trim();
      current.institution = current.institution.trim();
      current.date = current.date.trim();

      if (current.title || current.institution) {
        education.push({
          title: current.title,
          institution: current.institution,
          date: current.date,
          level: current.level,
          description: ''
        });
      }

      current = null;
    };

    lines.forEach(line => {
      const cleanedLine = clean(line);

      // Ignorar certificaciones/cursos
      if (certificationKeywords.test(cleanedLine) &&
        !degreeKeywords.test(cleanedLine)) {
        pushCurrent();
        return;
      }

      const schoolMatch = cleanedLine.match(
        /^(?:School|Institution|University|Universidad):\s*(.+)$/i
      );

      const degreeMatch = cleanedLine.match(
        /^(?:Degree|Título|Titulo|Carrera|Programa|Qualification):\s*(.+)$/i
      );

      const dateMatch = cleanedLine.match(
        /^(?:Date|Fecha|Period|Periodo):\s*(.+)$/i
      );

      if (schoolMatch) {
        pushCurrent();

        current = {
          title: '',
          institution: schoolMatch[1].trim(),
          date: '',
          level: ''
        };

        return;
      }

      if (degreeMatch) {
        if (!current) {
          current = {
            title: '',
            institution: '',
            date: '',
            level: ''
          };
        }

        current.title = degreeMatch[1].trim();
        return;
      }

      if (dateMatch) {
        if (current) {
          current.date = dateMatch[1].trim();
        }

        return;
      }

      // Institución
      if (academicKeywords.test(cleanedLine) &&
        !degreeKeywords.test(cleanedLine)) {

        if (!current) {
          current = {
            title: '',
            institution: cleanedLine,
            date: '',
            level: ''
          };
        } else if (!current.institution) {
          current.institution = cleanedLine;
        }

        return;
      }

      // Título académico
      // Título académico
      if (degreeKeywords.test(cleanedLine)) {

        /*
        * Formato del CV:
        *
        * Professional Degree - Informatic Engineering |
        * Corporation Universitaria de Cataluna |
        * Issued Apr 17, 2026 |
        * Status: Finished
        *
        * También soporta todo en una sola línea:
        *
        * Professional Degree - Informatic Engineering |
        * Corporation Universitaria de Cataluna |
        * Issued Apr 17, 2026 |
        * Status: Finished
        */

        if (cleanedLine.includes('|')) {

          const parts = cleanedLine
            .split('|')
            .map(part => part.trim())
            .filter(Boolean);

          const title = parts[0] || '';

          const institution =
            parts.find(part =>
              /\b(university|universidad|corporation|corporación|college|instituto|institute)\b/i.test(part)
            ) || '';

          const date =
            parts.find(part =>
              /\b(?:19|20)\d{2}\b/i.test(part)
            ) || '';

          const fullText =
            `${title} ${institution}`.toLowerCase();

          let level = 'Professional Degree';

          if (/\b(specialization|especialización)\b/i.test(fullText)) {
            level = 'Specialization';
          } else if (
            /\b(engineering|ingeniería)\b/i.test(fullText)
          ) {
            level = 'Engineering Degree';
          } else if (
            /\b(technologist|tecnólogo)\b/i.test(fullText)
          ) {
            level = 'Technologist';
          } else if (
            /\b(technical|técnico)\b/i.test(fullText)
          ) {
            level = 'Technical Degree';
          } else if (
            /\b(bachelor|bachelor's|licenciatura)\b/i.test(fullText)
          ) {
            level = "Bachelor's Degree";
          } else if (
            /\b(master|master's|maestría)\b/i.test(fullText)
          ) {
            level = "Master's Degree";
          } else if (
            /\b(phd|doctorate|doctorado)\b/i.test(fullText)
          ) {
            level = 'Doctorate';
          }

          if (title) {
            education.push({
              title,
              institution,
              date,
              level,
              description: ''
            });
          }

          current = null;

          return;
        }

        /*
        * Si el título NO viene con "|",
        * se comporta como un registro normal.
        */

        if (current && current.title) {
          pushCurrent();
        }

        current = {
          title: cleanedLine,
          institution: '',
          date: '',
          level: ''
        };

        const dateInsideTitle =
          cleanedLine.match(datePattern);

        if (dateInsideTitle) {
          current.date = dateInsideTitle[0];
        }

        return;
      }

      // Fecha independiente
      if (datePattern.test(cleanedLine)) {

        if (current) {
          current.date = cleanedLine;
        }

        return;
      }

      // Si ya tenemos institución pero todavía no tenemos título,
      // esta línea puede ser el título académico.
      if (current && current.institution && !current.title) {

        if (!certificationKeywords.test(cleanedLine)) {
          current.title = cleanedLine;
        }

        return;
      }
    });

    pushCurrent();

    // Normalizar nivel académico
    return education
      .map(item => {
        const fullText =
          `${item.title} ${item.institution}`.toLowerCase();

        let level = '';

        if (/\b(bachelor|bachelor's|licenciatura)\b/i.test(fullText)) {
          level = "Bachelor's Degree";
        } else if (
          /\b(master|master's|master of|magister|maestr[ií]a)\b/i.test(fullText) &&
          !/\bmastering\b/i.test(fullText)
        ) {
          level = "Master's Degree";
        } else if (
          /\b(phd|doctorate|doctorado)\b/i.test(fullText)
        ) {
          level = "Doctorate";
        } else if (
          /\b(engineering|ingenier[ií]a)\b/i.test(fullText)
        ) {
          level = "Engineering Degree";
        } else if (
          /\b(technologist|tecn[oó]logo)\b/i.test(fullText)
        ) {
          level = "Technologist";
        } else if (
          /\b(technical|t[eé]cnico)\b/i.test(fullText)
        ) {
          level = "Technical Degree";
        } else if (
          /\b(associate degree)\b/i.test(fullText)
        ) {
          level = "Associate Degree";
        } else if (
          /\b(undergraduate)\b/i.test(fullText)
        ) {
          level = "Undergraduate Degree";
        } else if (
          /\b(graduate)\b/i.test(fullText)
        ) {
          level = "Graduate Degree";
        }

        return {
          ...item,
          level
        };
      })
      .filter(item => {
        if (!item.title) return false;

        const fullText =
          `${item.title} ${item.institution}`.toLowerCase();

        // "Mastering Cybersecurity Program" es un programa/curso,
        // no un título académico de maestría.
        if (/\bmastering\b/i.test(fullText)) {
          return false;
        }

        // No permitir certificaciones/cursos dentro de Degrees
        if (
          /\b(certificate|certification|course|bootcamp|training|workshop|credential|completion)\b/i.test(fullText) &&
          !/\b(bachelor|master|phd|doctorate|engineering|technologist|technical|licenciatura|degree)\b/i.test(fullText)
        ) {
          return false;
        }

        return true;
      });
  };

  const extractCertifications = (sectionText) => {
    if (!sectionText || !sectionText.trim()) return [];

    const lines = sectionText
      .replace(/\r/g, '')
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    const certifications = [];

    const isSectionTitle = (line) =>
      /^(?:certifications?|certificaciones?|courses?|cursos?|professional certifications?|logros?|&?\s*advanced training)$/i.test(
        line.trim()
      );

    const cleanCertificationTitle = (line) => {
      return line
        .replace(/^[-•*🔹▪◦●○]\s*/, '')
        .replace(/^&?\s*advanced training\s*/i, '')
        .trim();
    };

    lines.forEach(line => {
      if (!line || isSectionTitle(line)) return;

      const dateMatch = line.match(
        /^(?:Date|Fecha):\s*(.+)$/i
      );

      const descriptionMatch = line.match(
        /^(?:Description|Descripción|Descriptions):\s*(.+)$/i
      );

      const issuerMatch = line.match(
        /^(?:Issuer|Provider|Institution|Issued by|Emitido por):\s*(.+)$/i
      );

      if (dateMatch || descriptionMatch || issuerMatch) {
        return;
      }

      const labeledMatch = line.match(
        /^(?:Certification|Certificación|Certificate|Certificado|Course|Curso|Title|Título):\s*(.+)$/i
      );

      const title = cleanCertificationTitle(
        labeledMatch ? labeledMatch[1] : line
      );

      if (!title || isSectionTitle(title)) return;
      if (title.length > 200) return;

      const exists = certifications.some(
        cert =>
          cert.title.toLowerCase() === title.toLowerCase()
      );

      if (!exists) {
        certifications.push({
          title,
          description: '',
          date: ''
        });
      }
    });

    return certifications;
  };

  // Convertir a array de objetos para ordenar
  let sectionMarkers = Object.keys(sections)
    .filter(k => sections[k] !== -1)
    .map(k => ({ name: k, index: sections[k] }))
    .sort((a, b) => a.index - b.index);

  // Añadir marcador del final del texto
  sectionMarkers.push({ name: 'end', index: text.length });

  // Inicializar arrays
  data.experience = [];
  data.education = [];
  data.certifications = [];
  data.skills = [];

  // Extraer contenido para cada sección
  for (let i = 0; i < sectionMarkers.length - 1; i++) {
    const currentSection = sectionMarkers[i];
    const nextSection = sectionMarkers[i + 1];

    // Extraer texto entre la sección actual y la siguiente
    let sectionContent = normalizedText.substring(currentSection.index, nextSection.index);

    // Quitar la palabra clave del título de la sección
    sectionContent = sectionContent.replace(/^(?:summary|professional summary|profile|professional profile|about me|perfil profesional|perfil|resumen profesional|sobre mí|experience|professional experience|work experience|experiencia|experiencia profesional|historial laboral|employment history|employment|education|professional education|educaci[oó]n|educaci[oó]n profesional|estudios|studies|formaci[oó]n acad[eé]mica|academic background|educational background|professional degrees|certifications|professional certifications|certificaci[oó]n|certificaciones|courses|cursos|training|professional training|professional development|advanced training|logros|skills|technical skills|technical competencies|habilidades|habilidades t[eé]cnicas|conocimientos|competencias)[:\s\n]*/i, '').trim();

    if (sectionContent) {
      if (currentSection.name === 'summary') {
        data.summary = sectionContent.trim();

      } else if (currentSection.name === 'experience') {

        data.experience = extractExperience(sectionContent);

        data.employers = data.experience
          .filter(item => item.employer)
          .map(item => ({
            name: item.employer,
            role: item.title,
            period: item.period,
            location: item.location,
            description: item.description
          }))
          .filter((item, index, array) =>
            index === array.findIndex(
              employer =>
                employer.name.toLowerCase() === item.name.toLowerCase()
            )
          );

      } else if (currentSection.name === 'skills') {

        data.skills = sectionContent
          .split(/[,•\n]+/)
          .map(s => s.trim())
          .filter(s => s);

      } else if (currentSection.name === 'education') {

        data.education = extractEducation(sectionContent);

      } else if (currentSection.name === 'certifications') {
        console.log('=== TEXTO CERTIFICACIONES ===');
        console.log(sectionContent);
        console.log('=== FIN TEXTO CERTIFICACIONES ===');

        data.certifications = extractCertifications(sectionContent);

        console.log('=== CERTIFICACIONES PARSEADAS ===');
        console.log(data.certifications);
        console.log('=== FIN CERTIFICACIONES PARSEADAS ===');
      }
    }
  }




  return data;
};
