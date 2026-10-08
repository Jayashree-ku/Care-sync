export function generateDoctorVisitSummary(formData, patientProfile) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // 1. Patient Information
  const patientInfo = {
    fullName: patientProfile?.fullName || 'Name not provided',
    age: patientProfile?.age ? `${patientProfile.age} years` : 'Not specified',
    gender: patientProfile?.gender || 'Not specified',
    bloodGroup: patientProfile?.bloodGroup || 'Not specified',
    emergencyContact: patientProfile?.emergencyContact || 'Not specified',
    datePrepared: currentDate
  };

  // 2. Main Concern
  const mainConcern = formData.currentSymptoms?.trim() || 'Not specified';

  // 3. When It Started
  const whenStarted = formData.whenNoticed?.trim() || 'Not specified';

  // 4. Pattern / Frequency
  const patternFrequency = {
    frequency: formData.frequency?.trim() || 'Not specified',
    details: formData.frequencyDetails?.trim() || null
  };

  // 5. When It Occurs
  let timingList = Array.isArray(formData.timingOptions) ? [...formData.timingOptions] : [];
  if (formData.timingOther?.trim() && !timingList.includes(formData.timingOther.trim())) {
    timingList = timingList.filter(t => t !== 'Other');
    timingList.push(`Other: ${formData.timingOther.trim()}`);
  }
  const whenItOccurs = {
    timings: timingList.length > 0 ? timingList : ['Not specified'],
    additionalDetails: formData.timingDetails?.trim() || null
  };

  // 6. Effect On Daily Life
  const effectOnDailyLife = formData.dailyImpact?.trim() || 'Not specified';

  // 7. Previous Occurrence
  const previousOccurrence = {
    experienced: formData.experiencedBefore?.trim() || 'Not specified',
    details: formData.experiencedBefore === 'Yes' && formData.previousDetails?.trim() 
      ? formData.previousDetails.trim() 
      : null
  };

  // 8. Medication Information
  const medicationInfo = {
    takenAnything: formData.takenMedication?.trim() || 'Not specified',
    details: formData.takenMedication === 'Yes' ? {
      name: formData.medicationName?.trim() || 'Name not provided',
      prescribed: formData.medicationPrescribed?.trim() || 'Not specified',
      whenTaken: formData.medicationTiming?.trim() || 'Not specified',
      helped: formData.medicationHelped?.trim() || 'Not specified'
    } : null
  };

  // 9. Current Medications
  const currentMedications = formData.regularMedicines?.trim() || 'None reported';

  // 10. Existing Conditions
  const existingConditions = formData.existingConditions?.trim() || 'None reported';

  // 11. Allergies
  const allergies = formData.knownAllergies?.trim() || 'None reported';

  // 12. Related Documents
  const relatedDocuments = formData.attachedDocument ? {
    fileName: formData.attachedDocument.name,
    fileSize: formData.attachedDocument.size ? `${(formData.attachedDocument.size / 1024).toFixed(1)} KB` : 'Unknown size'
  } : null;

  // 13. Additional Information
  const additionalInformation = formData.additionalNotes?.trim() || 'None provided';

  return {
    patientInfo,
    mainConcern,
    whenStarted,
    patternFrequency,
    whenItOccurs,
    effectOnDailyLife,
    previousOccurrence,
    medicationInfo,
    currentMedications,
    existingConditions,
    allergies,
    relatedDocuments,
    additionalInformation
  };
}
