# Campus Growth Engine — Stitch Design References

This folder contains the three Google Stitch screens for the NxtWave Growth Intern challenge.

## Folder map
- `01-project-matcher/`: Student-facing project matcher and registration form.
- `02-registration-success/`: Registration confirmation, project blueprint, and referral sharing.
- `03-organizer-dashboard/`: Organizer analytics dashboard.

Each folder contains:
- `reference.html`: Stitch-generated standalone HTML. Use it as a visual/content reference, not as the production app architecture.
- `screen.png`: Screenshot of the intended design.
- `DESIGN.md`: Design tokens and styling guidance from Stitch.

## Instructions for Antigravity
1. Open the actual application project folder as the workspace.
2. Keep these references in `design-references/`; do not treat them as the production app or overwrite the app entry point with the standalone HTML.
3. Inspect all three screenshots and `DESIGN.md` files before implementing.
4. Recreate the three screens in the project's existing framework using reusable components and responsive layouts.
5. Implement real navigation and working registration/referral/dashboard logic. Do not copy hard-coded sample metrics as real results.
6. Keep demo data visibly labelled. Connect persistent storage and protect all secrets on the server.
7. Prioritize a complete working registration/referral flow over extra visual polish.

## Important
The reference HTML files may use CDN Tailwind and contain standalone demo content. Adapt the design to the real app stack instead of blindly copying the files into the production source tree.
