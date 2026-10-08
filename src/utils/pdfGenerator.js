import { jsPDF } from 'jspdf';

/**
 * Generates and downloads a clean, professional multi-page PDF summary.
 * File name: CareSync-Doctor-Visit-Summary.pdf
 * 
 * @param {Object} summary - The generated doctor visit summary object.
 */
export function generateDoctorVisitPdf(summary) {
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
      // Draw minimal running header on subsequent pages
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('CareSync - Doctor Visit Summary (Continued)', margin, y - 6);
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y - 4, pageWidth - margin, y - 4);
    }
  };

  // 1. Top Header Banner
  doc.setFillColor(15, 118, 110); // #0f766e Clinical Teal
  doc.rect(margin, y, contentWidth, 24, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('CareSync', margin + 6, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(240, 253, 250);
  doc.text('Doctor Visit Summary', margin + 6, y + 16);

  doc.setFontSize(8);
  doc.setTextColor(204, 251, 241);
  doc.text(`Date Prepared: ${summary.patientInfo?.datePrepared || 'Not specified'}`, pageWidth - margin - 6, y + 16, { align: 'right' });

  y += 30;

  // Helper to print a section
  const printSection = (title, content, isAlert = false) => {
    checkPageBreak(16);

    // Section Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    if (isAlert) {
      doc.setTextColor(185, 28, 28); // #b91c1c Red
    } else {
      doc.setTextColor(15, 118, 110); // #0f766e Teal
    }
    doc.text(title.toUpperCase(), margin, y);
    y += 5;

    // Divider line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    // Section Content
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42); // #0f172a Slate

    const lines = doc.splitTextToSize(content, contentWidth);
    for (let i = 0; i < lines.length; i++) {
      checkPageBreak(6);
      doc.text(lines[i], margin, y);
      y += 5;
    }

    y += 4; // spacing between sections
  };

  // 1. PATIENT INFORMATION
  checkPageBreak(22);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 118, 110);
  doc.text('PATIENT INFORMATION', margin, y);
  y += 5;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);

  const pInfo = [
    `Full Name: ${summary.patientInfo?.fullName || 'Name not provided'}`,
    `Age: ${summary.patientInfo?.age || 'Not specified'}`,
    `Gender: ${summary.patientInfo?.gender || 'Not specified'}`,
    `Blood Group: ${summary.patientInfo?.bloodGroup || 'Not specified'}`,
    `Emergency Contact: ${summary.patientInfo?.emergencyContact || 'Not specified'}`
  ].join('   |   ');

  const pLines = doc.splitTextToSize(pInfo, contentWidth);
  pLines.forEach((line) => {
    checkPageBreak(6);
    doc.text(line, margin, y);
    y += 5;
  });
  y += 4;

  // 2. MAIN CONCERN
  printSection('Main Concern', summary.mainConcern || 'Not specified');

  // 3. WHEN IT STARTED
  printSection('When It Started', summary.whenStarted || 'Not specified');

  // 4. PATTERN / FREQUENCY
  const freqContent = summary.patternFrequency?.details
    ? `${summary.patternFrequency.frequency}\nAdditional Details: ${summary.patternFrequency.details}`
    : (summary.patternFrequency?.frequency || 'Not specified');
  printSection('Pattern / Frequency', freqContent);

  // 5. WHEN IT OCCURS
  const timingsStr = Array.isArray(summary.whenItOccurs?.timings)
    ? summary.whenItOccurs.timings.join(', ')
    : (summary.whenItOccurs?.timings || 'Not specified');
  const timingContent = summary.whenItOccurs?.additionalDetails
    ? `${timingsStr}\nAdditional Details: ${summary.whenItOccurs.additionalDetails}`
    : timingsStr;
  printSection('When It Occurs', timingContent);

  // 6. EFFECT ON DAILY LIFE
  printSection('Effect on Daily Life', summary.effectOnDailyLife || 'Not specified');

  // 7. PREVIOUS OCCURRENCE
  const prevContent = summary.previousOccurrence?.details
    ? `${summary.previousOccurrence.experienced}\nDetails: ${summary.previousOccurrence.details}`
    : (summary.previousOccurrence?.experienced || 'Not specified');
  printSection('Previous Occurrence', prevContent);

  // 8. MEDICATION INFORMATION
  let medContent = summary.medicationInfo?.takenAnything || 'Not specified';
  if (summary.medicationInfo?.takenAnything === 'Yes' && summary.medicationInfo?.details) {
    const d = summary.medicationInfo.details;
    medContent = `Taken: ${d.name || 'Name not provided'}\nPrescribed by Doctor: ${d.prescribed || 'Not specified'}\nWhen Taken: ${d.whenTaken || 'Not specified'}\nDid it seem to help: ${d.helped || 'Not specified'}`;
  }
  printSection('Medication Information', medContent);

  // 9. CURRENT MEDICATIONS
  printSection('Current Medications', summary.currentMedications || 'None reported');

  // 10. EXISTING CONDITIONS
  printSection('Existing Conditions', summary.existingConditions || 'None reported');

  // 11. ALLERGIES
  const hasAllergy = summary.allergies && summary.allergies !== 'None' && summary.allergies !== 'None reported';
  printSection('Allergies', summary.allergies || 'None reported', hasAllergy);

  // 12. RELATED DOCUMENTS
  const docContent = summary.relatedDocuments
    ? `${summary.relatedDocuments.fileName} (${summary.relatedDocuments.fileSize})`
    : 'No documents attached';
  printSection('Related Documents', docContent);

  // 13. ADDITIONAL INFORMATION
  printSection('Additional Information', summary.additionalInformation || 'None provided');

  // Safety Disclaimer at bottom of last page
  checkPageBreak(24);
  y += 4;
  doc.setFillColor(248, 250, 252); // #f8fafc
  doc.rect(margin, y, contentWidth, 18, 'F');
  doc.setDrawColor(15, 118, 110);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin, y + 18); // Left teal accent border

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('SAFETY DISCLAIMER', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  const disclaimerText = 'This summary is generated from information provided by the patient. It is intended to help communicate information to a healthcare professional. It is not a diagnosis or medical advice.';
  const disclaimerLines = doc.splitTextToSize(disclaimerText, contentWidth - 8);
  doc.text(disclaimerLines, margin + 4, y + 10);

  // Add Page Numbers on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
  }

  // Save the PDF
  doc.save('CareSync-Doctor-Visit-Summary.pdf');
}
