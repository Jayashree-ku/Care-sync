const STORAGE_KEY = 'caresync_patient_profile';

export const fallbackPatientProfile = {
  fullName: 'Name not provided',
  age: 'Not specified',
  gender: 'Not specified',
  bloodGroup: 'Not specified',
  emergencyContact: 'Not specified',
  preferredLanguage: 'Not specified'
};

export function getPatientProfile() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        fullName: parsed.fullName?.trim() || 'Name not provided',
        age: parsed.age?.trim() || 'Not specified',
        gender: parsed.gender?.trim() || 'Not specified',
        bloodGroup: parsed.bloodGroup?.trim() || 'Not specified',
        emergencyContact: parsed.emergencyContact?.trim() || 'Not specified',
        preferredLanguage: parsed.preferredLanguage?.trim() || 'Not specified'
      };
    }
  } catch (e) {
    console.error('Failed to read patient profile', e);
  }
  return { ...fallbackPatientProfile };
}

export function savePatientProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save patient profile', e);
  }
}
