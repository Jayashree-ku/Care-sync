# CareSync

**AI-powered healthcare accessibility and patient communication platform.**

CareSync empowers patients to organize what they are experiencing into clear, structured, and clinically relevant summaries that can be shared directly with doctors and healthcare providers during appointments.

---

## Feature: Prepare for My Doctor Visit

### Overview
Navigating a medical appointment can be overwhelming. Patients often forget key details about when symptoms started, frequency, prior treatments, or medication timelines.

**Prepare for My Doctor Visit** provides a compassionate, structured 12-step guided intake flow:

1. **Current Symptoms**: Free-text clinical intake of primary concerns.
2. **Onset / Timeline**: When symptoms first appeared (*Today*, *A few days ago*, *A few weeks ago*, *More than a month ago*, *I'm not sure*).
3. **Frequency & Pattern**: Frequency selector with optional detailed context.
4. **Circumstances & Timing**: Multi-factor selection (morning, night, after eating, during activity, etc.).
5. **Functional Daily Impact**: Impact on sleep, work, eating, and movement, with quick-select prompt chips.
6. **Prior Occurrences**: Recurring pattern history.
7. **Interventions & Medications Taken**: Details of self-medication, doctor prescription status, timing, and reported relief. *(Includes explicit clinical guidance that CareSync does not prescribe or provide medical advice).*
8. **Current Regular Medications**: Chronic medications, vitamins, and maintenance drugs (with *None* / *I'm not sure* support).
9. **Existing Medical Conditions**: Relevant past medical history.
10. **Known Allergies**: Drug, food, or contact allergies highlighted with high-priority clinical badges.
11. **Related Reports & Documents**: Document attachment UI for lab results, imaging, or prescriptions.
12. **Doctor Questions & Additional Context**: Open notes for questions to ask the physician.

### Key Capabilities

- **Step-by-step Flow**: Progress indicator, step counter (`Question X of 12`), validation, and state preservation.
- **Review Screen**: Full overview of all 12 answers with direct step editing prior to summary generation.
- **Structured Summary Generation**: Pure client-side clinical synthesis preserving statements like *"I'm not sure"*, *"None reported"*, and *"Not specified"*. Never invents missing data.
- **Show Doctor Mode**: High-contrast, distraction-free view with large typography designed specifically for showing directly to a healthcare provider on a mobile screen or tablet across a desk.
- **Action Controls**: Quick clipboard sharing, printable view / Save as PDF dialog, and seamless navigation.
- **Design Integrity**: Clinical teal and slate color palette. No purple. No unnecessary emojis. Accessible WCAG AA standards.

---

## Local Development & Testing

```bash
# Clone the repository
git clone https://github.com/Jayashree-ku/Care-sync.git
cd Care-sync

# Install dependencies
npm install

# Run automated tests
node test-questionnaire.js

# Build production bundle
npm run build

# Start local development server
npm run dev
```

---

## Public Deployment (GitHub Pages)

This repository includes a GitHub Actions automated workflow (`.github/workflows/deploy.yml`).

Once pushed to the `main` branch:
1. Go to your repository on GitHub: `https://github.com/Jayashree-ku/Care-sync`
2. Navigate to **Settings > Pages**
3. Under **Build and deployment > Source**, select **GitHub Actions**
4. Your public CareSync application will be live at:
   **`https://Jayashree-ku.github.io/Care-sync/`**

---

## Disclaimer
*CareSync summaries are generated from patient-reported information to facilitate clear communication between patients and healthcare professionals. CareSync is not a diagnostic tool and does not provide medical advice.*
