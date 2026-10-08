export const defaultPatientProfile = {
  fullName: "Jayashree K U",
  age: "24",
  gender: "Female",
  bloodGroup: "Not specified",
  emergencyContact: "Not specified",
  preferredLanguage: "English"
};

const STORAGE_KEY = 'caresync_patient_profile';

export function getPatientProfile() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to read patient profile', e);
  }
  return defaultPatientProfile;
}

export function savePatientProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save patient profile', e);
  }
}
