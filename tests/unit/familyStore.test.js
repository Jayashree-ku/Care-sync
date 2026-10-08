import assert from 'assert';

// Mock localStorage for headless Node environment
const mockStorage = {};
global.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, val) => { mockStorage[key] = String(val); },
  removeItem: (key) => { delete mockStorage[key]; },
  clear: () => {
    for (const k of Object.keys(mockStorage)) delete mockStorage[k];
  }
};

const familyStore = await import('../../src/data/familyStore.js');

console.log('--- Testing familyStore.js ---');

// Test 1: Store initialization
{
  familyStore.initializeFamilyStore();
  const patients = familyStore.getPatients();
  assert(Array.isArray(patients), 'Patients is an array');
  assert(patients.length >= 3, 'Default family members seeded (Jayashree, Mom, Dad)');

  const activeId = familyStore.getActivePatientId();
  assert(activeId, 'Active patient ID is assigned');

  const activePatient = familyStore.getActivePatient();
  assert.strictEqual(activePatient.id, activeId, 'Active patient resolved');
  console.log('✓ Test 1 Passed: Store initialization and default patient resolution.');
}

// Test 2: Multi-patient addition and relationship mapping
{
  const newMember = {
    fullName: 'Kamala Devi',
    relationship: 'Grandmother',
    dateOfBirth: '1948-03-12',
    gender: 'Female',
    bloodGroup: 'B+',
    knownAllergies: 'Aspirin',
    existingConditions: 'Arthritis',
    emergencyContactName: 'Jayashree K U'
  };

  const added = familyStore.addPatient(newMember);
  assert(added.id.startsWith('pat_'), 'Patient ID generated with prefix');
  assert.strictEqual(added.relationship, 'Grandmother');

  const allPatients = familyStore.getPatients();
  assert(allPatients.some(p => p.id === added.id), 'New patient present in directory');
  console.log('✓ Test 2 Passed: Family member registration and ID generation.');
}

// Test 3: Patient data isolation (Medications & Reports)
{
  const patients = familyStore.getPatients();
  const patientA = patients[0];
  const patientB = patients[1];

  // Add medication to Patient A
  familyStore.addPatientMedication(patientA.id, {
    name: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'Nightly',
    prescribedBy: 'Dr. Evans'
  });

  // Verify Patient B does NOT have Patient A's medication
  const updatedB = familyStore.getPatientById(patientB.id);
  const updatedA = familyStore.getPatientById(patientA.id);

  assert(updatedA.medications.some(m => m.name === 'Atorvastatin'), 'Patient A has Atorvastatin');
  assert(!updatedB.medications.some(m => m.name === 'Atorvastatin'), 'CRITICAL: Patient B does not have Patient A medication');
  console.log('✓ Test 3 Passed: Strict medical record isolation across family members.');
}

// Test 4: Doctor visit summary isolation
{
  const patients = familyStore.getPatients();
  const pat1 = patients[0];
  const pat2 = patients[1];

  const sampleVisit = {
    mainConcern: 'Mild sprain on left ankle',
    whenStarted: 'Today'
  };

  familyStore.savePatientDoctorVisit(pat1.id, sampleVisit);

  const checkPat1 = familyStore.getPatientById(pat1.id);
  const checkPat2 = familyStore.getPatientById(pat2.id);

  assert(checkPat1.doctorVisits.length > 0, 'Patient 1 has recorded visit');
  assert(checkPat2.doctorVisits.every(v => v.mainConcern !== 'Mild sprain on left ankle'), 'Patient 2 has zero visit cross-contamination');
  console.log('✓ Test 4 Passed: Doctor visit intake isolation.');
}

console.log('All familyStore unit tests passed cleanly!\n');
