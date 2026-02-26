Phase 1

### Project Setup

1.1 Initialize Next.js project 1.2 Configure Tailwind 1.3 Setup authentication 1.4 Create base layout

Phase 2

### Resume Core

2.1 Build resume templates 2.2 Create resume form 2.3 Implement live preview 2.4 Add **PDF** export

Phase 3

Resume AI

3.1 Integrate OpenAI 3.2 Build **ATS** scoring 3.3 Implement keyword matching 3.4 Add rewrite functionality

Phase 4

### Portfolio Templates

4.1 Build static templates 4.2 Add editor interface 4.3 Add theme customization

Phase 5

### Portfolio Agent

5.1 Build structured questionnaire 5.2 Implement AI code generation 5.3 Generate Next.js project files 5.4 Create zip export

Phase 6

### Preview Engine

6.1 Implement iframe sandbox 6.2 Add hot reload 6.3 Section regeneration

Phase 7

Deployment

7.1 GitHub integration 7.2 Vercel **API** integration 7.3 One click deploy

Phase 8

Optimization

8.1 Performance tuning 8.2 Error handling 8.3 Rate limiting 8.4 Security hardening

# Phase 9: Launch & Monetization

This phase focuses on transitioning the application into a production-ready product with monetization hooks, feature gating, and a polished deployment flow.

## Proposed Changes

### Monetization & Feature Gating

#### [MODIFY] [portfolio.ts](file:///m:/AI_Res_Por_Bui/src/types/portfolio.ts)
- Add `isPremium: boolean` to `PORTFOLIO_TEMPLATE_META`.
- Mark `Agency Pro` as premium.

#### [MODIFY] [templates/page.tsx](file:///m:/AI_Res_Por_Bui/src/app/(dashboard)/portfolio/templates/page.tsx)
- Display "Pro" badges on premium templates using the `isPremium` flag.
- Implement a gateway that prevents free users (Guest or Basic) from selecting premium templates, showing an "Upgrade to Pro" mock modal.

#### [MODIFY] [topbar.tsx](file:///m:/AI_Res_Por_Bui/src/components/layout/topbar.tsx)
- Update "Free Plan" badge to toggle to "Pro Plan" (simulated).
- Add a mock "AI Credits" counter (e.g., "Credits: 5") next to the plan badge.

### Deployment & Exports

#### [MODIFY] [editor/page.tsx](file:///m:/AI_Res_Por_Bui/src/app/(dashboard)/portfolio/editor/page.tsx)
- Add "Deploy to Vercel" button in the Topbar of the editor.
- Implement a mock deployment progress UI:
    1.  **Step 1**: "Connecting to Vercel..."
    2.  **Step 2**: "Cloning Repository & Building..."
    3.  **Step 3**: "Success! Your site is live at `https://user-portfolio.vercel.app`"

### Landing Page Updates

#### [MODIFY] [page.tsx](file:///m:/AI_Res_Por_Bui/src/app/page.tsx)
- Ensure the pricing table is correctly linked to the signup flow.
- Add a "Compare Plans" detailed feature list to help drive "Pro" conversions.

### Configuration & Environment

#### [MODIFY] [.env.local](file:///m:/AI_Res_Por_Bui/.env.local)
- Add placeholders for `MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`.
- Add placeholders for `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

## Verification Plan

### Automated Tests
- Verify that clicking a "Pro" template when on a "Free" plan triggers the upgrade modal.
- Verify the "Vercel Deployment" mock progress bar transitions correctly.
- Ensure the app starts and respects the `.env.local` structure (validated via `npm run dev`).

### Manual Verification
- Test responsive layout of the new "AI Credits" UI.
- Verify the landing page "Pro" CTA leads to the correct signup parameters.ng