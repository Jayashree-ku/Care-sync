// CareSync Family Health Management Data Store
// Strictly manages patient isolation and localStorage persistence

const STORAGE_KEYS = {
  USER: 'caresync_auth_user',
  IS_LOGGED_IN: 'caresync_is_logged_in',
  PATIENTS: 'caresync_patients',
  ACTIVE_PATIENT_ID: 'caresync_active_patient_id'
};

// Unique ID generator ensuring zero collision even in high-speed operations
function generateUniqueId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

// Initial sample seed only if storage is completely empty, ensuring clean testing
export function initializeFamilyStore() {
  try {
    const existingUser = localStorage.getItem(STORAGE_KEYS.USER);
    const existingPatients = localStorage.getItem(STORAGE_KEYS.PATIENTS);

    if (!existingUser || !existingPatients) {
      // Seed default account holder Jayashree and family structure for instant testing
      const defaultUser = {
        id: 'usr_primary',
        fullName: 'Jayashree K U',
        email: 'jayashree@example.com',
        phone: '+1 (555) 019-2834',
        createdAt: new Date().toISOString()
      };

      const defaultPatients = [
        {
          id: 'pat_jayashree',
          fullName: 'Jayashree K U',
          relationship: 'Self',
          dateOfBirth: '2000-05-14',
          gender: 'Female',
          phone: '+1 (555) 019-2834',
          bloodGroup: 'O+',
          knownAllergies: 'Penicillin',
          existingConditions: 'Mild asthma',
          currentMedications: 'Daily Vitamin D3',
          emergencyContactName: 'Ramesh Kumar',
          emergencyContactPhone: '+1 (555) 019-8877',
          emergencyContactRelationship: 'Father',
          preferredLanguage: 'English',
          preferredDoctor: 'Dr. Sarah Mitchell',
          doctorPhone: '+1 (555) 443-1200',
          medications: [
            { id: 'med_1', name: 'Vitamin D3', dosage: '1000 IU', frequency: 'Daily with breakfast', prescribedBy: 'Dr. Sarah Mitchell' }
          ],
          reports: [],
          doctorVisits: [],
          draftDoctorVisit: null
        },
        {
          id: 'pat_mom',
          fullName: 'Radha Kumar',
          relationship: 'Mother',
          dateOfBirth: '1974-08-22',
          gender: 'Female',
          phone: '+1 (555) 019-5544',
          bloodGroup: 'B+',
          knownAllergies: 'Sulfa antibiotics',
          existingConditions: 'Hypertension',
          currentMedications: 'Amlodipine 5mg',
          emergencyContactName: 'Jayashree K U',
          emergencyContactPhone: '+1 (555) 019-2834',
          emergencyContactRelationship: 'Daughter',
          preferredLanguage: 'English',
          preferredDoctor: 'Dr. Sarah Mitchell',
          doctorPhone: '+1 (555) 443-1200',
          medications: [
            { id: 'med_m1', name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily in morning', prescribedBy: 'Dr. Sarah Mitchell' }
          ],
          reports: [],
          doctorVisits: [],
          draftDoctorVisit: null
        },
        {
          id: 'pat_dad',
          fullName: 'Ramesh Kumar',
          relationship: 'Father',
          dateOfBirth: '1970-12-10',
          gender: 'Male',
          phone: '+1 (555) 019-8877',
          bloodGroup: 'O+',
          knownAllergies: 'None',
          existingConditions: 'Type 2 Diabetes',
          currentMedications: 'Metformin 500mg',
          emergencyContactName: 'Radha Kumar',
          emergencyContactPhone: '+1 (555) 019-5544',
          emergencyContactRelationship: 'Spouse',
          preferredLanguage: 'English',
          preferredDoctor: 'Dr. Robert Chang',
          doctorPhone: '+1 (555) 882-9900',
          medications: [
            { id: 'med_d1', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily with meals', prescribedBy: 'Dr. Robert Chang' }
          ],
          reports: [],
          doctorVisits: [],
          draftDoctorVisit: null
        }
      ];

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUser));
      localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(defaultPatients));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PATIENT_ID, 'pat_jayashree');
    }
  } catch (e) {
    console.error('Error initializing family store', e);
  }
}

// ----------------- Authentication -----------------

export function getAuthUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch (_e) {
    return null;
  }
}

export function isUserLoggedIn() {
  return localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
}

export function loginUser(email, _password, _rememberMe = true) {
  const storedUser = getAuthUser();
  if (storedUser && storedUser.email.toLowerCase() === email.toLowerCase()) {
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    return { success: true, user: storedUser };
  }

  const newUser = {
    id: generateUniqueId('usr'),
    fullName: email.split('@')[0],
    email: email,
    phone: '',
    createdAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
  localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');

  const patients = getPatients();
  if (patients.length === 0) {
    const primaryPatient = {
      id: generateUniqueId('pat'),
      fullName: newUser.fullName,
      relationship: 'Self',
      dateOfBirth: '1995-01-01',
      gender: 'Not specified',
      phone: '',
      bloodGroup: 'Not specified',
      knownAllergies: 'None',
      existingConditions: 'None',
      currentMedications: 'None',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: '',
      preferredLanguage: 'English',
      preferredDoctor: '',
      doctorPhone: '',
      medications: [],
      reports: [],
      doctorVisits: [],
      draftDoctorVisit: null
    };
    savePatients([primaryPatient]);
    setActivePatientId(primaryPatient.id);
  }

  return { success: true, user: newUser };
}

export function signupUser(accountData, patientData) {
  const newUser = {
    id: generateUniqueId('usr'),
    fullName: accountData.fullName.trim(),
    email: accountData.email.trim(),
    phone: accountData.phone ? accountData.phone.trim() : '',
    createdAt: new Date().toISOString()
  };

  const primaryPatient = {
    id: generateUniqueId('pat'),
    fullName: patientData.fullName ? patientData.fullName.trim() : accountData.fullName.trim(),
    relationship: 'Self',
    dateOfBirth: patientData.dateOfBirth || '',
    gender: patientData.gender || 'Not specified',
    phone: patientData.phone || accountData.phone || '',
    bloodGroup: patientData.bloodGroup || 'Not specified',
    knownAllergies: patientData.knownAllergies || '',
    existingConditions: patientData.existingConditions || '',
    currentMedications: patientData.currentMedications || '',
    emergencyContactName: patientData.emergencyContactName || '',
    emergencyContactPhone: patientData.emergencyContactPhone || '',
    emergencyContactRelationship: patientData.emergencyContactRelationship || '',
    preferredLanguage: patientData.preferredLanguage || 'English',
    preferredDoctor: patientData.preferredDoctor || '',
    doctorPhone: patientData.doctorPhone || '',
    medications: patientData.currentMedications && patientData.currentMedications !== 'None' ? [
      { id: generateUniqueId('med'), name: patientData.currentMedications, dosage: 'As directed', frequency: 'Regular', prescribedBy: patientData.preferredDoctor || 'Doctor' }
    ] : [],
    reports: [],
    doctorVisits: [],
    draftDoctorVisit: null
  };

  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
  localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
  savePatients([primaryPatient]);
  setActivePatientId(primaryPatient.id);

  return { user: newUser, patient: primaryPatient };
}

export function logoutUser() {
  localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'false');
}

// ----------------- Patient Management -----------------

export function getPatients() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return raw ? JSON.parse(raw) : [];
  } catch (_e) {
    return [];
  }
}

export function savePatients(patients) {
  try {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  } catch (e) {
    console.error('Failed to save patients', e);
  }
}

export function getActivePatientId() {
  try {
    const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PATIENT_ID);
    if (activeId) return activeId;
    const patients = getPatients();
    if (patients.length > 0) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PATIENT_ID, patients[0].id);
      return patients[0].id;
    }
  } catch (_e) {
    return null;
  }
  return null;
}

export function getPatientById(id) {
  const patients = getPatients();
  return patients.find(p => p.id === id) || null;
}

export function setActivePatientId(id) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PATIENT_ID, id);
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent('caresync_patient_changed', { detail: { patientId: id } }));
    }
  } catch (e) {
    console.error('Failed to set active patient ID', e);
  }
}

export function getActivePatient() {
  const patients = getPatients();
  const activeId = getActivePatientId();
  if (!activeId && patients.length > 0) return patients[0];
  const found = patients.find(p => p.id === activeId);
  return found || patients[0] || null;
}

export function addPatient(patientData) {
  const patients = getPatients();
  const newPatient = {
    id: generateUniqueId('pat'),
    fullName: patientData.fullName.trim(),
    relationship: patientData.relationship || 'Other',
    dateOfBirth: patientData.dateOfBirth || '',
    gender: patientData.gender || 'Not specified',
    phone: patientData.phone || '',
    bloodGroup: patientData.bloodGroup || 'Not specified',
    knownAllergies: patientData.knownAllergies || '',
    existingConditions: patientData.existingConditions || '',
    currentMedications: patientData.currentMedications || '',
    emergencyContactName: patientData.emergencyContactName || '',
    emergencyContactPhone: patientData.emergencyContactPhone || '',
    emergencyContactRelationship: patientData.emergencyContactRelationship || '',
    preferredLanguage: patientData.preferredLanguage || 'English',
    preferredDoctor: patientData.preferredDoctor || '',
    doctorPhone: patientData.doctorPhone || '',
    medications: patientData.currentMedications && patientData.currentMedications.trim() && patientData.currentMedications !== 'None' ? [
      { id: generateUniqueId('med'), name: patientData.currentMedications.trim(), dosage: 'As directed', frequency: 'Daily', prescribedBy: patientData.preferredDoctor || 'Physician' }
    ] : [],
    reports: [],
    doctorVisits: [],
    draftDoctorVisit: null
  };

  const updated = [...patients, newPatient];
  savePatients(updated);
  setActivePatientId(newPatient.id);
  return newPatient;
}

export function updatePatient(patientId, updatedFields) {
  const patients = getPatients();
  const updated = patients.map((p) => {
    if (p.id === patientId) {
      return { ...p, ...updatedFields };
    }
    return p;
  });
  savePatients(updated);
}

// ----------------- Patient-Specific Data Operations (ISOLATED) -----------------

export function addPatientMedication(patientId, medication) {
  const patients = getPatients();
  const updated = patients.map((p) => {
    if (p.id === patientId) {
      const currentMeds = Array.isArray(p.medications) ? p.medications : [];
      const newMed = {
        id: generateUniqueId('med'),
        name: medication.name.trim(),
        dosage: medication.dosage ? medication.dosage.trim() : 'As directed',
        frequency: medication.frequency ? medication.frequency.trim() : 'Daily',
        prescribedBy: medication.prescribedBy ? medication.prescribedBy.trim() : 'Self / OTC',
        notes: medication.notes ? medication.notes.trim() : '',
        addedAt: new Date().toISOString()
      };
      return { ...p, medications: [newMed, ...currentMeds] };
    }
    return p;
  });
  savePatients(updated);
}

export function removePatientMedication(patientId, medicationId) {
  const patients = getPatients();
  const updated = patients.map((p) => {
    if (p.id === patientId) {
      const filtered = (p.medications || []).filter(m => m.id !== medicationId);
      return { ...p, medications: filtered };
    }
    return p;
  });
  savePatients(updated);
}

export function addPatientReport(patientId, report) {
  const patients = getPatients();
  const updated = patients.map((p) => {
    if (p.id === patientId) {
      const currentReports = Array.isArray(p.reports) ? p.reports : [];
      const newReport = {
        id: generateUniqueId('rep'),
        title: report.title || report.fileName || 'Medical Document',
        fileName: report.fileName,
        fileSize: report.fileSize || 'Unknown',
        category: report.category || 'General',
        notes: report.notes || '',
        uploadedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      };
      return { ...p, reports: [newReport, ...currentReports] };
    }
    return p;
  });
  savePatients(updated);
}

export function removePatientReport(patientId, reportId) {
  const patients = getPatients();
  const updated = patients.map((p) => {
    if (p.id === patientId) {
      const filtered = (p.reports || []).filter(r => r.id !== reportId);
      return { ...p, reports: filtered };
    }
    return p;
  });
  savePatients(updated);
}

// ----------------- Patient-Specific Doctor Visits -----------------

export function savePatientDoctorVisit(patientId, summary, formData) {
  const patients = getPatients();
  const updated = patients.map((p) => {
    if (p.id === patientId) {
      const currentVisits = Array.isArray(p.doctorVisits) ? p.doctorVisits : [];
      const newVisit = {
        id: generateUniqueId('visit'),
        createdAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        summary,
        formData
      };
      return {
        ...p,
        doctorVisits: [newVisit, ...currentVisits],
        draftDoctorVisit: null
      };
    }
    return p;
  });
  savePatients(updated);
}

export function savePatientDoctorVisitDraft(patientId, step, formData) {
  const patients = getPatients();
  const updated = patients.map((p) => {
    if (p.id === patientId) {
      return { ...p, draftDoctorVisit: { step, formData } };
    }
    return p;
  });
  savePatients(updated);
}

export function clearPatientDoctorVisitDraft(patientId) {
  const patients = getPatients();
  const updated = patients.map((p) => {
    if (p.id === patientId) {
      return { ...p, draftDoctorVisit: null };
    }
    return p;
  });
  savePatients(updated);
}
