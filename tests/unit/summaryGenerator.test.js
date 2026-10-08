import assert from 'assert';
import { generateDoctorVisitSummary } from '../../src/utils/summaryGenerator.js';

console.log('--- Testing summaryGenerator.js ---');

// Test 1: Full clinical data synthesis
{
  const patient = {
    id: 'pat_test_1',
    fullName: 'Jane Doe',
    age: '32',
    gender: 'Female',
    bloodGroup: 'A+',
    emergencyContact: 'John Doe (+1 555-0100)'
  };

  const formData = {
    currentSymptoms: 'Severe throbbing headache with photophobia',
    whenNoticed: 'A few days ago',
    frequency: 'Sometimes',
    frequencyDetails: 'Attacks last 2 hours',
    timingOptions: ['Morning', 'After eating'],
    timingOther: 'When stressed',
    timingDetails: 'Aggravated by bright screens',
    dailyImpact: 'Unable to work on computer',
    experiencedBefore: 'Yes',
    previousDetails: 'Mild tension headache 6 months ago',
    takenMedication: 'Yes',
    medicationName: 'Ibuprofen 400mg',
    medicationPrescribed: 'No',
    medicationTiming: 'Yesterday morning',
    medicationHelped: 'Temporary relief for 1 hour',
    regularMedicines: 'Multivitamin',
    existingConditions: 'Asthma',
    knownAllergies: 'Penicillin',
    attachedDocument: { name: 'lab_cbc.pdf', size: 102400 },
    additionalNotes: 'Need referral to neurologist'
  };

  const summary = generateDoctorVisitSummary(formData, patient);

  assert.strictEqual(summary.patientInfo.fullName, 'Jane Doe', 'Patient name matches');
  assert.strictEqual(summary.patientInfo.age, '32 years', 'Patient age formatted');
  assert.strictEqual(summary.patientInfo.gender, 'Female', 'Patient gender matches');
  assert.strictEqual(summary.patientInfo.bloodGroup, 'A+', 'Blood group matches');
  assert.strictEqual(summary.mainConcern, 'Severe throbbing headache with photophobia', 'Chief complaint matches');
  assert.strictEqual(summary.whenStarted, 'A few days ago', 'Onset matches');
  assert.strictEqual(summary.patternFrequency.frequency, 'Sometimes', 'Frequency matches');
  assert.strictEqual(summary.patternFrequency.details, 'Attacks last 2 hours', 'Frequency details matches');
  assert(summary.whenItOccurs.timings.includes('Morning'), 'Timing includes Morning');
  assert(summary.whenItOccurs.timings.includes('Other: When stressed'), 'Timing includes custom Other');
  assert.strictEqual(summary.previousOccurrence.experienced, 'Yes', 'Previous occurrence matches');
  assert.strictEqual(summary.previousOccurrence.details, 'Mild tension headache 6 months ago');
  assert.strictEqual(summary.medicationInfo.takenAnything, 'Yes');
  assert.strictEqual(summary.medicationInfo.details.name, 'Ibuprofen 400mg');
  assert.strictEqual(summary.allergies, 'Penicillin', 'Allergies match');
  assert.strictEqual(summary.relatedDocuments.fileName, 'lab_cbc.pdf');

  console.log('✓ Test 1 Passed: Full clinical synthesis produces exact schema.');
}

// Test 2: Minimal data fallback & preserving non-reported states
{
  const minimalFormData = {
    currentSymptoms: 'Knee soreness',
    whenNoticed: 'Today'
  };

  const summary = generateDoctorVisitSummary(minimalFormData, null);

  assert.strictEqual(summary.patientInfo.fullName, 'Name not provided');
  assert.strictEqual(summary.patientInfo.age, 'Not specified');
  assert.strictEqual(summary.mainConcern, 'Knee soreness');
  assert.strictEqual(summary.whenStarted, 'Today');
  assert.strictEqual(summary.currentMedications, 'None reported', 'Preserves None reported fallback');
  assert.strictEqual(summary.existingConditions, 'None reported');
  assert.strictEqual(summary.allergies, 'None reported');
  assert.strictEqual(summary.relatedDocuments, null);

  console.log('✓ Test 2 Passed: Minimal intake gracefully preserves non-reported clinical states.');
}

// Test 3: Zero-medication branch
{
  const noMedFormData = {
    currentSymptoms: 'Cough',
    whenNoticed: 'Today',
    takenMedication: 'No',
    experiencedBefore: 'No'
  };

  const summary = generateDoctorVisitSummary(noMedFormData, {});
  assert.strictEqual(summary.medicationInfo.takenAnything, 'No');
  assert.strictEqual(summary.medicationInfo.details, null, 'No details when medication not taken');
  assert.strictEqual(summary.previousOccurrence.details, null, 'No details when not experienced before');

  console.log('✓ Test 3 Passed: Conditional branches handle negative responses properly.');
}

console.log('All summaryGenerator unit tests passed cleanly!\n');
