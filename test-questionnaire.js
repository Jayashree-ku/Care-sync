import { generateDoctorVisitSummary } from './src/utils/summaryGenerator.js';
import { initialQuestionnaireData } from './src/data/questionnaireData.js';
import { defaultPatientProfile } from './src/data/defaultPatient.js';

console.log('Testing Questionnaire and Summary Logic...');

// 1. Test empty / default form data
const emptySummary = generateDoctorVisitSummary(initialQuestionnaireData, defaultPatientProfile);
console.assert(emptySummary.patientInfo.fullName === 'Jayashree K U', 'Patient name should match');
console.assert(emptySummary.mainConcern === 'Not specified', 'Empty symptoms should be "Not specified"');
console.assert(emptySummary.whenStarted === 'Not specified', 'Empty whenStarted should be "Not specified"');
console.assert(emptySummary.currentMedications === 'None reported', 'Empty regular medicines should be "None reported"');
console.assert(emptySummary.existingConditions === 'None reported', 'Empty conditions should be "None reported"');
console.assert(emptySummary.allergies === 'None reported', 'Empty allergies should be "None reported"');
console.assert(emptySummary.relatedDocuments === null, 'Empty documents should be null');
console.log('Test 1 Passed: Default / empty form preserves "Not specified" / "None reported" without inventing information.');

// 2. Test filled form data with "I\'m not sure"
const testData = {
  ...initialQuestionnaireData,
  currentSymptoms: 'Severe throbbing headache in left temple with sensitivity to light',
  whenNoticed: "A few days ago",
  frequency: "Sometimes",
  frequencyDetails: "3-4 times a day after prolonged screen work",
  timingOptions: ["Afternoon", "Evening"],
  timingDetails: "Usually peaks around 4 PM",
  dailyImpact: "Unable to work on laptop for more than 30 minutes; disrupts sleep",
  experiencedBefore: "Yes",
  previousDetails: "Had a similar episode 3 months ago during finals week",
  takenMedication: "Yes",
  medicationName: "Ibuprofen 400mg",
  medicationPrescribed: "No",
  medicationTiming: "Yesterday evening with dinner",
  medicationHelped: "Yes",
  regularMedicines: "Daily Vitamin D3 (1000 IU)",
  existingConditions: "Mild myopia",
  knownAllergies: "Penicillin",
  attachedDocument: { name: 'blood_test_results.pdf', size: 1048576, type: 'application/pdf' },
  additionalNotes: "Would like to know if an eye exam or MRI is recommended."
};

const fullSummary = generateDoctorVisitSummary(testData, defaultPatientProfile);

console.assert(fullSummary.mainConcern === 'Severe throbbing headache in left temple with sensitivity to light', 'Main concern matches');
console.assert(fullSummary.whenStarted === 'A few days ago', 'When started matches');
console.assert(fullSummary.patternFrequency.frequency === 'Sometimes', 'Frequency matches');
console.assert(fullSummary.patternFrequency.details === '3-4 times a day after prolonged screen work', 'Frequency details match');
console.assert(fullSummary.whenItOccurs.timings.includes('Afternoon') && fullSummary.whenItOccurs.timings.includes('Evening'), 'Timings match');
console.assert(fullSummary.previousOccurrence.experienced === 'Yes', 'Previous occurrence matches');
console.assert(fullSummary.previousOccurrence.details.includes('finals week'), 'Previous details match');
console.assert(fullSummary.medicationInfo.details.name === 'Ibuprofen 400mg', 'Medication name matches');
console.assert(fullSummary.allergies === 'Penicillin', 'Allergies match');
console.assert(fullSummary.relatedDocuments.fileName === 'blood_test_results.pdf', 'Document name matches');
console.assert(fullSummary.relatedDocuments.fileSize === '1024.0 KB', 'Document size matches');
console.log('Test 2 Passed: Full questionnaire answers compile accurately into structured clinical summary.');

// 3. Test preservation of "I'm not sure" answers
const unsureData = {
  ...initialQuestionnaireData,
  currentSymptoms: 'Dull ache in lower back',
  whenNoticed: "I'm not sure",
  frequency: "I'm not sure",
  timingOptions: ["I'm not sure"],
  dailyImpact: 'Mild discomfort when sitting',
  experiencedBefore: "I'm not sure",
  takenMedication: "I'm not sure",
  regularMedicines: "I'm not sure",
  existingConditions: "I'm not sure",
  knownAllergies: "I'm not sure"
};

const unsureSummary = generateDoctorVisitSummary(unsureData, defaultPatientProfile);
console.assert(unsureSummary.whenStarted === "I'm not sure", 'Preserves "I\'m not sure" for when started');
console.assert(unsureSummary.patternFrequency.frequency === "I'm not sure", 'Preserves "I\'m not sure" for frequency');
console.assert(unsureSummary.whenItOccurs.timings.includes("I'm not sure"), 'Preserves "I\'m not sure" for timing');
console.assert(unsureSummary.previousOccurrence.experienced === "I'm not sure", 'Preserves "I\'m not sure" for previous occurrence');
console.assert(unsureSummary.medicationInfo.takenAnything === "I'm not sure", 'Preserves "I\'m not sure" for medication');
console.assert(unsureSummary.currentMedications === "I'm not sure", 'Preserves "I\'m not sure" for regular meds');
console.assert(unsureSummary.existingConditions === "I'm not sure", 'Preserves "I\'m not sure" for conditions');
console.assert(unsureSummary.allergies === "I'm not sure", 'Preserves "I\'m not sure" for allergies');
console.log('Test 3 Passed: "I\'m not sure" statements are strictly preserved.');

console.log('All tests passed successfully!');
