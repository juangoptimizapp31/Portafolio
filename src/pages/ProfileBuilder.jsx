import React, { useState, useEffect } from 'react';
import { extractTextFromPDF, parseCVData } from '../utils/pdfParser';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './ProfileBuilder.css';

const ProfileBuilder = () => {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const defaultProfile = {
    name: '',
    email: '',
    phone: '',
    summary: '',
    github: '',
    linkedin: '',
    profileImage: '',
    experience: [],
    employers: [],
    education: [],
    certifications: [],
    skills: []
  };

  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem('portfolioCVData');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file || file.type !== 'application/pdf') {
      alert('Por favor selecciona un archivo PDF válido.');
      return;
    }

    setFileName(file.name);
    setLoading(true);

    try {
      const text = await extractTextFromPDF(file);
      const data = parseCVData(text);

      console.log('CERTIFICACIONES DEL PARSER:', data.certifications);

      setProfileData(prev => {
        const normalize = (value) =>
          (value || '')
            .toLowerCase()
            .trim()
            .replace(/\s+/g, ' ');

        // CONSERVAR IMÁGENES DE CERTIFICACIONES
        const certifications = (data.certifications || []).map(newCert => {
          const oldCert = (prev.certifications || []).find(
            oldItem =>
              normalize(oldItem.title) === normalize(newCert.title)
          );

          return {
            ...newCert,
            image: oldCert?.image || newCert.image || '',
            link: oldCert?.link || newCert.link || ''
          };
        });

        // CONSERVAR IMÁGENES DE EXPERIENCIA
        const experience = (data.experience || []).map(newExp => {
          const oldExp = (prev.experience || []).find(
            oldItem =>
              normalize(oldItem.employer) === normalize(newExp.employer)
          );

          return {
            ...newExp,
            image: oldExp?.image || newExp.image || ''
          };
        });

        // CONSERVAR IMÁGENES DE EMPRESAS
        const employers = experience
          .filter(item => item.employer)
          .map(item => {
            const oldEmployer = (prev.employers || []).find(
              oldItem =>
                normalize(oldItem.name) === normalize(item.employer)
            );

            return {
              name: item.employer,
              period: item.period || '',
              image: oldEmployer?.image || item.image || ''
            };
          })
          .filter((item, index, array) =>
            index === array.findIndex(
              employer =>
                normalize(employer.name) === normalize(item.name)
            )
          );

        return {
          ...prev,
          ...data,
          certifications,
          experience,
          employers,
          education: data.education || [],
          skills: data.skills || []
        };
      });

    } catch (error) {
      console.error('Error al parsear el PDF:', error);
      alert('Hubo un error al leer el PDF. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (category, index, field, value) => {
    setProfileData(prev => {
      const newArray = [...prev[category]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [category]: newArray };
    });
  };
  const handleCertificationImage = async (index, file) => {
    if (!file) return;

    try {
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { storage } = await import('../firebase');

      const certification = profileData.certifications[index];

      const fileName = `${Date.now()}-${file.name}`;
      const storageRef = ref(
        storage,
        `certifications/${certification.title || `certification-${index}`}/${fileName}`
      );

      await uploadBytes(storageRef, file);

      const imageUrl = await getDownloadURL(storageRef);

      setProfileData(prev => {
        const newCertifications = [...prev.certifications];

        newCertifications[index] = {
          ...newCertifications[index],
          image: imageUrl
        };

        return {
          ...prev,
          certifications: newCertifications
        };
      });

      console.log('Imagen subida:', imageUrl);

    } catch (error) {
      console.error('Error al subir la imagen:', error);
      alert('No se pudo subir la imagen.');
    }
  };

  const handleEmployerImage = async (index, file) => {
    if (!file) return;

    try {
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { storage } = await import('../firebase');

      const experience = profileData.experience[index];

      const fileName = `${Date.now()}-${file.name}`;

      const storageRef = ref(
        storage,
        `employers/${experience.employer || `employer-${index}`}/${fileName}`
      );

      await uploadBytes(storageRef, file);

      const imageUrl = await getDownloadURL(storageRef);

      setProfileData(prev => {
        const newExperience = [...prev.experience];

        newExperience[index] = {
          ...newExperience[index],
          image: imageUrl
        };

        return {
          ...prev,
          experience: newExperience
        };
      });

      console.log('Imagen de empresa subida:', imageUrl);

    } catch (error) {
      console.error('Error al subir la imagen de la empresa:', error);
      alert('No se pudo subir la imagen de la empresa.');
    }
  };

  const handleExperienceImage = async (index, file) => {
    if (!file) return;

    try {
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { storage } = await import('../firebase');

      const experience = profileData.experience[index];

      const fileName = `${Date.now()}-${file.name}`;

      const storageRef = ref(
        storage,
        `experience/${experience.employer || `experience-${index}`}/${fileName}`
      );

      await uploadBytes(storageRef, file);

      const imageUrl = await getDownloadURL(storageRef);

      setProfileData(prev => {
        const newExperience = [...prev.experience];

        newExperience[index] = {
          ...newExperience[index],
          image: imageUrl
        };

        return {
          ...prev,
          experience: newExperience
        };
      });

      console.log('Imagen de experiencia subida:', imageUrl);

    } catch (error) {
      console.error('Error al subir la imagen de experiencia:', error);
      alert('No se pudo subir la imagen.');
    }
  };

  const handleEducationImage = async (index, file) => {
    if (!file) return;

    try {
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { storage } = await import('../firebase');

      const education = profileData.education[index];
      const fileName = `${Date.now()}-${file.name}`;

      const storageRef = ref(
        storage,
        `education/${education.title || `education-${index}`}/${fileName}`
      );

      await uploadBytes(storageRef, file);

      const imageUrl = await getDownloadURL(storageRef);

      setProfileData(prev => {
        const newEducation = [...prev.education];

        newEducation[index] = {
          ...newEducation[index],
          image: imageUrl
        };

        return {
          ...prev,
          education: newEducation
        };
      });

      console.log('Imagen del título subida:', imageUrl);

    } catch (error) {
      console.error('Error al subir la imagen del título:', error);
      alert('No se pudo subir la imagen del título.');
    }
  };
  const handleProfileImage = async (file) => {
    if (!file) return;

    try {
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { storage } = await import('../firebase');

      const fileName = `${Date.now()}-${file.name}`;

      const storageRef = ref(
        storage,
        `profile/profile-image/${fileName}`
      );

      await uploadBytes(storageRef, file);

      const imageUrl = await getDownloadURL(storageRef);

      setProfileData(prev => ({
        ...prev,
        profileImage: imageUrl
      }));

      console.log('Imagen de perfil subida:', imageUrl);

    } catch (error) {
      console.error('Error al subir la imagen de perfil:', error);
      alert('No se pudo subir la imagen de perfil.');
    }
  };


  const addArrayItem = (category) => {
    setProfileData(prev => ({
      ...prev,
      [category]: [...prev[category], { title: '', description: '' }]
    }));
  };

  const removeArrayItem = (category, index) => {
    setProfileData(prev => {
      const newArray = [...prev[category]];
      newArray.splice(index, 1);
      return { ...prev, [category]: newArray };
    });
  };

  const moveArrayItem = (category, index, direction) => {
    setProfileData(prev => {
      const newArray = [...prev[category]];

      const newIndex = direction === 'up'
        ? index - 1
        : index + 1;

      if (newIndex < 0 || newIndex >= newArray.length) {
        return prev;
      }

      [newArray[index], newArray[newIndex]] = [
        newArray[newIndex],
        newArray[index]
      ];

      return {
        ...prev,
        [category]: newArray
      };
    });
  };
  const handleSkillsChange = (e) => {
    const value = e.target.value;
    setProfileData(prev => ({
      ...prev,
      skills: value.split(',').map(s => s.trim())
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const employers = profileData.experience
        .filter(item => item.employer)
        .map(item => ({
          name: item.employer,
          period: item.period || '',
          image: item.image || ''
        }))
        .filter((item, index, array) =>
          index === array.findIndex(
            employer =>
              employer.name.toLowerCase() === item.name.toLowerCase()
          )
        );

      const dataToSave = {
        ...profileData,
        employers,
        updatedAt: new Date().toISOString()
      };

      // 1. Guardar localmente como respaldo
      localStorage.setItem(
        'portfolioCVData',
        JSON.stringify(dataToSave)
      );

      // 2. Guardar en Firebase Firestore
      await setDoc(
        doc(db, 'profiles', 'main'),
        dataToSave
      );

      // 3. Actualizar el estado
      setProfileData(dataToSave);

      console.log('Datos guardados en Firebase:', dataToSave);

      alert('¡Perfil guardado correctamente en Firebase!');
    } catch (error) {
      console.error('Error guardando el perfil en Firebase:', error);

      alert(
        'El perfil se guardó localmente, pero hubo un error al guardarlo en Firebase.'
      );
    }
  };
  const renderArraySection = (title, category) => (
    <div className="form-section">
      <h3>{title}</h3>
      {profileData[category].map((item, index) => (
        <div key={index} className="array-item-card">
          <input
            type="text"
            placeholder="Título (Ej. Cargo o Título universitario)"
            value={item.title || ''}
            onChange={(e) => handleArrayChange(category, index, 'title', e.target.value)}
          />
          <textarea
            placeholder="Descripción, detalles, fechas..."
            value={item.description || ''}
            onChange={(e) => handleArrayChange(category, index, 'description', e.target.value)}
            rows="3"
          />
          {category === 'certifications' && (
            <div className="certification-image-section">
              <label>Imagen de la certificación:</label>

              {item.image && (
                <div className="certification-image-preview">
                  <img
                    src={item.image}
                    alt={item.title || 'Certificación'}
                  />
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleCertificationImage(index, e.target.files[0])
                }
              />
            </div>
          )}

          {category === 'experience' && (
            <div className="experience-image-section">
              <label>Imagen de la empresa o puesto:</label>

              {item.image && (
                <div className="experience-image-preview">
                  <img
                    src={item.image}
                    alt={item.employer || item.title || 'Experiencia profesional'}
                  />
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleExperienceImage(index, e.target.files[0])
                }
              />
            </div>
          )}

          {category === 'education' && (
            <div className="education-image-section">
              <label>Imagen del título o diploma:</label>

              {item.image && (
                <div className="education-image-preview">
                  <img
                    src={item.image}
                    alt={item.title || 'Título académico'}
                  />
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleEducationImage(index, e.target.files[0])
                }
              />
            </div>
          )}
          {category === 'certifications' && (
            <div className="form-group">
              <label>Enlace oficial del certificado:</label>

              <input
                type="url"
                placeholder="https://..."
                value={item.link || ''}
                onChange={(e) =>
                  handleArrayChange(category, index, 'link', e.target.value)
                }
              />
            </div>
          )}
          {category === 'certifications' && (
            <div className="certification-order-buttons">

              <button
                type="button"
                onClick={() => moveArrayItem('certifications', index, 'up')}
                disabled={index === 0}
              >
                ↑ Subir
              </button>

              <button
                type="button"
                onClick={() => moveArrayItem('certifications', index, 'down')}
                disabled={index === profileData.certifications.length - 1}
              >
                ↓ Bajar
              </button>

            </div>
          )}

          <button
            type="button"
            className="remove-btn"
            onClick={() => removeArrayItem(category, index)}
          >
            Eliminar
          </button>
        </div>
      ))}
      <button type="button" className="add-btn" onClick={() => addArrayItem(category)}>
        + Añadir otro
      </button>
    </div>
  );

  return (
    <div className="profile-builder-container">
      <h2>Constructor de Perfil</h2>
      <p>Sube tu CV en formato PDF y extraeremos la información estructurada.</p>

      <div className="upload-section">
        <label htmlFor="cv-upload" className="upload-button">
          {loading ? 'Analizando...' : 'Subir CV (PDF)'}
        </label>
        <input
          id="cv-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        {fileName && <span className="file-name">{fileName}</span>}
      </div>

      <form className="profile-form" onSubmit={handleSave}>
        <div className="form-group">
          <label>Nombre completo:</label>
          <input type="text" name="name" value={profileData.name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={profileData.email} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Teléfono:</label>
          <input type="text" name="phone" value={profileData.phone} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Resumen profesional:</label>
          <textarea
            name="summary"
            value={profileData.summary || ''}
            onChange={handleChange}
            rows="4"
            placeholder="Escribe una breve descripción profesional..."
          />
        </div>
        <div className="form-group">
          <label>Imagen de perfil:</label>

          {profileData.profileImage && (
            <div className="profile-image-preview">
              <img
                src={profileData.profileImage}
                alt="Imagen de perfil"
              />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleProfileImage(e.target.files[0])
            }
          />
        </div>

        <div className="form-group">
          <label>GitHub:</label>
          <input
            type="url"
            name="github"
            value={profileData.github || ''}
            onChange={handleChange}
            placeholder="https://github.com/..."
          />
        </div>

        <div className="form-group">
          <label>LinkedIn:</label>
          <input
            type="url"
            name="linkedin"
            value={profileData.linkedin || ''}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/..."
          />
        </div>

        {renderArraySection('Experiencia Profesional', 'experience')}
        {renderArraySection('Educación y Títulos', 'education')}
        {renderArraySection('Certificaciones', 'certifications')}

        <div className="form-group">
          <label>Habilidades (separadas por coma):</label>
          <textarea
            name="skills"
            value={profileData.skills.join(', ')}
            onChange={handleSkillsChange}
            rows="4"
          />
        </div>

        <button type="submit" className="save-button">Guardar Perfil</button>
      </form>
    </div>
  );
};

export default ProfileBuilder;
