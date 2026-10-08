export const initialQuestionnaireData = {
  // Question 1
  currentSymptoms: '',

  // Question 2
  whenNoticed: '',

  // Question 3
  frequency: '',
  frequencyDetails: '',

  // Question 4
  timingOptions: [],
  timingOther: '',
  timingDetails: '',

  // Question 5
  dailyImpact: '',

  // Question 6
  experiencedBefore: '',
  previousDetails: '',

  // Question 7
  takenMedication: '',
  medicationName: '',
  medicationPrescribed: '',
  medicationTiming: '',
  medicationHelped: '',

  // Question 8
  regularMedicines: '',

  // Question 9
  existingConditions: '',

  // Question 10
  knownAllergies: '',

  // Question 11
  attachedDocument: null, // { name: '', size: 0, type: '' }

  // Question 12
  additionalNotes: ''
};

const STORAGE_KEY = 'caresync_doctor_visit_data';
const CURRENT_STEP_KEY = 'caresync_doctor_visit_step';

export function loadQuestionnaireData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...initialQuestionnaireData, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Error loading questionnaire data', e);
  }
  return { ...initialQuestionnaireData };
}

export function saveQuestionnaireData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving questionnaire data', e);
  }
}

export function clearQuestionnaireData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CURRENT_STEP_KEY);
  } catch (e) {
    console.error('Error clearing questionnaire data', e);
  }
}

export function loadSavedStep() {
  try {
    const saved = localStorage.getItem(CURRENT_STEP_KEY);
    if (saved) {
      const step = parseInt(saved, 10);
      if (!isNaN(step) && step >= 1 && step <= 12) {
        return step;
      }
    }
  } catch (e) {
    console.error('Error loading saved step', e);
  }
  return 1;
}

export function saveCurrentStep(step) {
  try {
    localStorage.setItem(CURRENT_STEP_KEY, step.toString());
  } catch (e) {
    console.error('Error saving current step', e);
  }
}
