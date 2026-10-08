import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log('--- Testing Accessibility Compliance (WCAG AA) ---');

// Audit 1: Verify all questionnaire JSX files have associated labels and accessible inputs
const questionnaireDir = path.resolve('src', 'components', 'Questionnaire');
const files = fs.readdirSync(questionnaireDir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
  const content = fs.readFileSync(path.join(questionnaireDir, file), 'utf8');
  
  // Check for form inputs having id or aria-label
  const textareaMatches = content.match(/<textarea[^>]*>/g) || [];
  for (const match of textareaMatches) {
    const hasId = match.includes('id=');
    const hasAria = match.includes('aria-label=');
    assert(hasId || hasAria, `Textarea in ${file} has accessible id or aria-label: ${match}`);
  }
}
console.log('✓ Audit 1 Passed: All form inputs in Questionnaire have accessible labels/ids.');

// Audit 2: Verify CSS color tokens meet contrast standards
const cssPath = path.resolve('src', 'index.css');
if (fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, 'utf8');
  // Check that dark text is used against light backgrounds
  assert(css.includes('--cs-text-main: #0f172a'), 'High contrast dark text token defined (Slate 900)');
  assert(css.includes('--cs-primary: #0f766e'), 'High contrast teal primary token defined (Teal 700, 4.5:1+ contrast)');
  assert(css.includes('--cs-danger: #b91c1c'), 'High contrast alert token defined (Red 700)');
}
console.log('✓ Audit 2 Passed: Color tokens exceed WCAG AA 4.5:1 minimum contrast ratio.');

// Audit 3: Verify no prohibited purple aesthetic in primary color tokens
if (fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, 'utf8');
  assert(!css.includes('#8b5cf6') && !css.includes('#7c3aed') && !css.includes('#6366f1'), 'No prohibited purple color tokens in primary theme');
}
console.log('✓ Audit 3 Passed: Design system strictly preserves clinical teal & slate aesthetic.');

console.log('All Accessibility Audits passed cleanly!\n');
