import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { generateDoctorVisitSummary } from '../src/utils/summaryGenerator.js';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = 'http://localhost:5175';
const OUTPUT_DIR = path.resolve('docs', 'screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const samplePatient = {
  id: 'pat_jayashree',
  fullName: 'Jayashree K U',
  age: '24',
  gender: 'Female',
  bloodGroup: 'O+',
  emergencyContact: 'Ramesh Kumar (+1 555-019-8877)'
};

const sampleFormData = {
  currentSymptoms: 'Persistent throbbing migraine on the right temple with light sensitivity and mild nausea.',
  whenNoticed: 'A few days ago',
  frequency: 'Sometimes',
  frequencyDetails: 'Attacks last 3 to 4 hours, recurring in waves',
  timingOptions: ['Morning', 'During activity'],
  timingOther: '',
  timingDetails: 'Noticeably aggravated by bright fluorescent lights and extended laptop use',
  dailyImpact: 'Significant difficulty focusing on computer screens for work; disrupted sleep over the last 2 nights.',
  experiencedBefore: 'Yes',
  previousDetails: 'Milder tension headaches during college exams 2 years ago, but never with nausea or photophobia.',
  takenMedication: 'Yes',
  medicationName: 'Ibuprofen 400mg',
  medicationPrescribed: 'No',
  medicationTiming: 'Yesterday evening and this morning with meal',
  medicationHelped: 'Temporarily eased throbbing for 2 hours, then symptoms returned',
  regularMedicines: 'Daily Vitamin D3 (1000 IU), Vitamin B-Complex',
  existingConditions: 'Mild asthma (well-controlled)',
  knownAllergies: 'Penicillin (developed hives & rash in childhood)',
  attachedDocument: {
    name: 'Previous_Lab_Report_CBC_2025.pdf',
    size: 245000,
    type: 'application/pdf'
  },
  additionalNotes: 'Questions for doctor: Could this be migraine with aura? Is prescription abortive therapy indicated? Should blood pressure be monitored?'
};

const generatedSummary = generateDoctorVisitSummary(sampleFormData, samplePatient);

async function run() {
  console.log('Launching Edge browser at:', EDGE_PATH);
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  // Helper to inject storage and ensure logged-in demo state
  async function setupState() {
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await page.evaluate((summary) => {
      localStorage.setItem('caresync_is_logged_in', 'true');
      localStorage.setItem('caresync_active_summary', JSON.stringify(summary));
    }, generatedSummary);
    await page.reload({ waitUntil: 'networkidle2' });
  }

  // ---------------------------------------------
  // 1. DESKTOP / WEB SCREENSHOTS (1440 x 900)
  // ---------------------------------------------
  console.log('--- Capturing Desktop Web Screenshots ---');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await setupState();

  // 1.1 Web Dashboard
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'web-01-dashboard.png') });
  console.log('Saved web-01-dashboard.png');

  // 1.2 Web Doctor Visit Questionnaire (Step 1)
  await page.goto(`${BASE_URL}/doctor-visit`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.value = 'Persistent throbbing migraine on the right temple with light sensitivity and mild nausea.';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'web-02-doctor-visit.png') });
  console.log('Saved web-02-doctor-visit.png');

  // 1.3 Web Visit Summary
  await page.goto(`${BASE_URL}/doctor-visit/summary`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'web-03-visit-summary.png') });
  console.log('Saved web-03-visit-summary.png');

  // 1.4 Web Show Doctor Presentation Mode
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent.includes('Show Doctor'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'web-04-show-doctor-mode.png') });
  console.log('Saved web-04-show-doctor-mode.png');

  // 1.5 Web Family Management
  await page.goto(`${BASE_URL}/patients`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'web-05-family-management.png') });
  console.log('Saved web-05-family-management.png');

  // 1.6 Web Medications
  await page.goto(`${BASE_URL}/medications`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'web-06-medications.png') });
  console.log('Saved web-06-medications.png');

  // ---------------------------------------------
  // 2. ANDROID / MOBILE SCREENSHOTS (Pixel 7: 412 x 915)
  // ---------------------------------------------
  console.log('--- Capturing Android Mobile Screenshots ---');
  await page.setViewport({
    width: 412,
    height: 915,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36');

  // 2.1 Android Dashboard
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'android-01-dashboard.png') });
  console.log('Saved android-01-dashboard.png');

  // 2.2 Android Doctor Visit Questionnaire
  await page.goto(`${BASE_URL}/doctor-visit`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.value = 'Persistent throbbing migraine on the right temple with light sensitivity and mild nausea.';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'android-02-doctor-visit.png') });
  console.log('Saved android-02-doctor-visit.png');

  // 2.3 Android Visit Summary
  await page.goto(`${BASE_URL}/doctor-visit/summary`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'android-03-visit-summary.png') });
  console.log('Saved android-03-visit-summary.png');

  // 2.4 Android Show Doctor Presentation Mode
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent.includes('Show Doctor'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'android-04-show-doctor-mode.png') });
  console.log('Saved android-04-show-doctor-mode.png');

  // 2.5 Android Family Members
  await page.goto(`${BASE_URL}/patients`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'android-05-family-members.png') });
  console.log('Saved android-05-family-members.png');

  await browser.close();
  console.log('All screenshots successfully captured in:', OUTPUT_DIR);
}

run().catch(err => {
  console.error('Error running screenshot script:', err);
  process.exit(1);
});
