# Contributing to CareSync

Thank you for your interest in contributing to CareSync! We welcome contributions to make healthcare communication more accessible, inclusive, and reliable.

## Code Standards & Guidelines

1. **Linting & Code Style**:
   - Run `npm run lint` before committing.
   - Code must have 0 ESLint errors and 0 warnings.
   - Format with Prettier using `npm run format`.

2. **Automated Testing**:
   - All contributions must pass `npm test`.
   - Add unit tests under `tests/unit/` or integration tests under `tests/integration/` for any new logic.

3. **Clinical Safety Safeguards**:
   - Never introduce diagnostic claims, dosage recommendations, or unverified treatments.
   - Summaries must remain deterministic without AI hallucinations.
   - Preserve patient statements such as "I'm not sure" and "None reported".

4. **Accessibility (WCAG AA)**:
   - Ensure interactive controls include accessible labels and high-contrast color tokens.
   - Strictly avoid low-contrast purple hues; use clinical teal and slate.

## Development Workflow

```bash
git checkout -b feature/my-feature
npm install
npm test
npm run lint
npm run build
```
