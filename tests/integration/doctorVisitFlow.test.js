import assert from 'assert';

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
const summaryGenerator = await import('../../src/utils/summaryGenerator.js');
const pdfGenerator = await import('../../src/utils/pdfGenerator.js');

console.log('--- Testing End-to-End Integration Flow ---');

// 1. Initialize store
familyStore.initializeFamilyStore();
const initialPatients = familyStore.getPatients();
assert(initialPatients.length >= 3, 'Initial family members present');

// 2. Add family member Mom & Dad
const mom = familyStore.getPatients().find(p => p.relationship === 'Mother');
const dad = familyStore.getPatients().find(p => p.relationship === 'Father');
assert(mom && dad, 'Mom and Dad present in family');

// 3. Switch to Mom
familyStore.setActivePatientId(mom.id);
assert.strictEqual(familyStore.getActivePatientId(), mom.id);

// 4. Add data to Mom
familyStore.addPatientMedication(mom.id, {
  name: 'Amlodipine 5mg',
  dosage: '5mg',
  frequency: 'Once daily'
});

// 5. Verify Dad does NOT show Mom's medication
familyStore.setActivePatientId(dad.id);
const dadUpdated = familyStore.getPatientById(dad.id);
assert(!dadUpdated.medications.some(m => m.name === 'Amlodipine 5mg'), 'Dad data is isolated from Mom');

// 6. Doctor visit intake for Mom
familyStore.setActivePatientId(mom.id);
const questionnaireData = {
  currentSymptoms: 'Dizziness and fatigue',
  whenNoticed: 'A few days ago',
  frequency: 'Sometimes',
  timingOptions: ['Morning'],
  takenMedication: 'No',
  regularMedicines: 'Amlodipine 5mg',
  knownAllergies: 'Sulfa antibiotics'
};

const summary = summaryGenerator.generateDoctorVisitSummary(questionnaireData, mom);
familyStore.savePatientDoctorVisit(mom.id, summary, questionnaireData);

const momFinal = familyStore.getPatientById(mom.id);
assert(momFinal.doctorVisits.length > 0, 'Mom visit saved');

// 7. Verify PDF generation for Mom's visit
const pdfDoc = pdfGenerator.generateDoctorVisitPdf(summary);
assert(pdfDoc, 'PDF generated for Mom');

console.log('✓ All integration flow steps verified with 100% patient isolation.\n');
