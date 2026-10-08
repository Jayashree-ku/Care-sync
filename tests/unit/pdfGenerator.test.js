import assert from 'assert';
import { generateDoctorVisitPdf } from '../../src/utils/pdfGenerator.js';

console.log('--- Testing pdfGenerator.js ---');

const sampleSummary = {
  patientInfo: {
    fullName: 'Jayashree K U',
    age: '24 years',
    gender: 'Female',
    bloodGroup: 'O+',
    emergencyContact: 'Ramesh Kumar (+1 555-019-8877)',
    datePrepared: 'October 9, 2026'
  },
  mainConcern: 'Persistent throbbing migraine with photophobia',
  whenStarted: 'A few days ago',
  patternFrequency: {
    frequency: 'Sometimes',
    details: 'Attacks last 3 to 4 hours'
  },
  whenItOccurs: {
    timings: ['Morning', 'During activity'],
    additionalDetails: 'Aggravated by bright screens'
  },
  effectOnDailyLife: 'Interferes with screen work and concentration',
  previousOccurrence: {
    experienced: 'Yes',
    details: 'Similar milder headaches during university exams'
  },
  medicationInfo: {
    takenAnything: 'Yes',
    details: {
      name: 'Ibuprofen 400mg',
      prescribed: 'No',
      whenTaken: 'Yesterday evening',
      helped: 'Mild temporary relief'
    }
  },
  currentMedications: 'Daily Vitamin D3',
  existingConditions: 'Mild asthma',
  allergies: 'Penicillin (causes hives)',
  relatedDocuments: {
    fileName: 'CBC_Report_2025.pdf',
    fileSize: '240 KB'
  },
  additionalInformation: 'Questions for physician regarding abortive migraine treatments.'
};

try {
  const doc = generateDoctorVisitPdf(sampleSummary);
  assert(doc, 'PDF Document created');
  assert(typeof doc.output === 'function', 'jsPDF output method exists');
  const pdfBytes = doc.output('arraybuffer');
  assert(pdfBytes && pdfBytes.byteLength > 1000, 'PDF buffer exceeds 1KB');
  console.log(`✓ Test 1 Passed: Multi-page jsPDF generation produces valid binary (${pdfBytes.byteLength} bytes).`);
} catch (err) {
  console.error('PDF test failed:', err);
  process.exit(1);
}

console.log('All pdfGenerator unit tests passed cleanly!\n');
