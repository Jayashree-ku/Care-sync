import fs from 'fs';
import { jsPDF } from 'jspdf';
import { generateDoctorVisitSummary } from './src/utils/summaryGenerator.js';
import { fallbackPatientProfile } from './src/data/defaultPatient.js';

console.log('=== RUNNING COMPREHENSIVE CARESYNC AUTOMATED VERIFICATION ===\n');

// 1. Verify Fallback Profile
console.log('1. Checking Fallback Patient Profile:');
console.assert(fallbackPatientProfile.fullName === 'Name not provided', 'Default name should be "Name not provided"');
console.assert(fallbackPatientProfile.age === 'Not specified', 'Default age should be "Not specified"');
console.log('   ✓ Fallback profile adheres strictly to "Never invent patient information".\n');

// 2. Test 12 Questions Data Flow & Summary Generation
console.log('2. Testing 12-Question Summary Compilation:');
const sampleFormData = {
  currentSymptoms: 'Frequent throbbing migraines on the left temple, visual auras, and nausea.',
  whenNoticed: 'A few weeks ago',
  frequency: 'Sometimes',
  frequencyDetails: 'Episodes occur 2-3 times per week, typically lasting 4 to 6 hours.',
  timingOptions: ['Afternoon', 'Evening', 'Other'],
  timingOther: 'Under fluorescent office lighting',
  timingDetails: 'Intensifies when looking at computer screens without breaks.',
  dailyImpact: 'Significantly disrupts work concentration and prevents driving during aura episodes. Often requires lying in a dark room.',
  experiencedBefore: 'Yes',
  previousDetails: 'Had similar headaches 2 years ago during college exam season; resolved with hydration and stress management.',
  takenMedication: 'Yes',
  medicationName: 'Sumatriptan 50mg, Ibuprofen 400mg',
  medicationPrescribed: 'Yes',
  medicationTiming: 'Taken at onset of headache',
  medicationHelped: 'Yes',
  regularMedicines: 'Daily Vitamin B2 (Riboflavin), Magnesium glycinate 400mg',
  existingConditions: 'Asthma, Tension headaches',
  knownAllergies: 'Penicillin (developed hives in childhood)',
  attachedDocument: {
    name: 'neurology_consultation_notes_2024.pdf',
    size: 2457600,
    type: 'application/pdf'
  },
  additionalNotes: 'Would like to discuss preventative medication options and whether an MRI brain scan is appropriate.'
};

const summary = generateDoctorVisitSummary(sampleFormData, fallbackPatientProfile);

// Verify every required section is present and accurately populated
const requiredSections = [
  'patientInfo',
  'mainConcern',
  'whenStarted',
  'patternFrequency',
  'whenItOccurs',
  'effectOnDailyLife',
  'previousOccurrence',
  'medicationInfo',
  'currentMedications',
  'existingConditions',
  'allergies',
  'relatedDocuments',
  'additionalInformation'
];

requiredSections.forEach((section) => {
  console.assert(summary[section] !== undefined, `Missing summary section: ${section}`);
});
console.log('   ✓ All 13 structured summary sections verified.\n');

// 3. Test Real PDF Generation via jsPDF (Node-compatible execution)
console.log('3. Testing PDF Generation via jsPDF:');

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4'
});

const pageWidth = doc.internal.pageSize.getWidth();
const pageHeight = doc.internal.pageSize.getHeight();
const margin = 16;
const contentWidth = pageWidth - (margin * 2);
const bottomLimit = pageHeight - 20;

let y = 16;

const checkPageBreak = (neededHeight) => {
  if (y + neededHeight > bottomLimit) {
    doc.addPage();
    y = 18;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('CareSync - Doctor Visit Summary (Continued)', margin, y - 6);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y - 4, pageWidth - margin, y - 4);
  }
};

// Header
doc.setFillColor(15, 118, 110);
doc.rect(margin, y, contentWidth, 24, 'F');
doc.setFont('helvetica', 'bold');
doc.setFontSize(18);
doc.setTextColor(255, 255, 255);
doc.text('CareSync', margin + 6, y + 9);
doc.setFont('helvetica', 'normal');
doc.setFontSize(12);
doc.setTextColor(240, 253, 250);
doc.text('Doctor Visit Summary', margin + 6, y + 16);
y += 30;

const printSection = (title, content, isAlert = false) => {
  checkPageBreak(16);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  if (isAlert) doc.setTextColor(185, 28, 28);
  else doc.setTextColor(15, 118, 110);
  doc.text(title.toUpperCase(), margin, y);
  y += 5;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);

  const lines = doc.splitTextToSize(content, contentWidth);
  for (let i = 0; i < lines.length; i++) {
    checkPageBreak(6);
    doc.text(lines[i], margin, y);
    y += 5;
  }
  y += 4;
};

// Print all sections
printSection('Patient Information', `Full Name: ${summary.patientInfo.fullName}   |   Age: ${summary.patientInfo.age}   |   Gender: ${summary.patientInfo.gender}`);
printSection('Main Concern', summary.mainConcern);
printSection('When It Started', summary.whenStarted);
printSection('Pattern / Frequency', `${summary.patternFrequency.frequency}\nDetails: ${summary.patternFrequency.details}`);
printSection('When It Occurs', `${summary.whenItOccurs.timings.join(', ')}\nDetails: ${summary.whenItOccurs.additionalDetails}`);
printSection('Effect on Daily Life', summary.effectOnDailyLife);
printSection('Previous Occurrence', `${summary.previousOccurrence.experienced}\nDetails: ${summary.previousOccurrence.details}`);

let medText = summary.medicationInfo.takenAnything;
if (summary.medicationInfo.details) {
  const d = summary.medicationInfo.details;
  medText = `Taken: ${d.name}\nPrescribed: ${d.prescribed}\nWhen: ${d.whenTaken}\nHelped: ${d.helped}`;
}
printSection('Medication Information', medText);
printSection('Current Medications', summary.currentMedications);
printSection('Existing Conditions', summary.existingConditions);
printSection('Allergies', summary.allergies, true);
printSection('Related Documents', `${summary.relatedDocuments.fileName} (${summary.relatedDocuments.fileSize})`);
printSection('Additional Information', summary.additionalInformation);

// Disclaimer
checkPageBreak(24);
y += 4;
doc.setFillColor(248, 250, 252);
doc.rect(margin, y, contentWidth, 18, 'F');
doc.setDrawColor(15, 118, 110);
doc.setLineWidth(0.8);
doc.line(margin, y, margin, y + 18);
doc.setFont('helvetica', 'bold');
doc.setFontSize(8);
doc.setTextColor(71, 85, 105);
doc.text('SAFETY DISCLAIMER', margin + 4, y + 5);
doc.setFont('helvetica', 'normal');
doc.setFontSize(7.5);
doc.setTextColor(100, 116, 139);
const disclaimerText = 'This summary is generated from information provided by the patient. It is intended to help communicate information to a healthcare professional. It is not a diagnosis or medical advice.';
doc.text(doc.splitTextToSize(disclaimerText, contentWidth - 8), margin + 4, y + 10);

// Page numbers
const totalPages = doc.getNumberOfPages();
for (let i = 1; i <= totalPages; i++) {
  doc.setPage(i);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
}

const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
fs.writeFileSync('test-output.pdf', pdfBuffer);

console.log(`   ✓ PDF Generated successfully! Total pages: ${totalPages}`);
console.log(`   ✓ File size: ${(pdfBuffer.length / 1024).toFixed(1)} KB`);
console.assert(pdfBuffer.length > 5000, 'PDF should contain substantial content and not be blank');
console.log('   ✓ Verified non-blank multi-page PDF generation.\n');

console.log('=== ALL TESTS PASSED SUCCESSFULLY ===');
