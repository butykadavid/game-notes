---
applyTo: '.copilot-tracking/changes/2026-05-27/gaming-deals-page-changes.md'
---
<!-- markdownlint-disable-file -->
# Implementation Plan: Gaming Deals Page Feature

## Overview

Create a dedicated gaming deals page with tab-based category switching, grid layout displaying 3-4 cards per row, and button-based card options replacing hover behavior.

## Objectives

### User Requirements

* Create a new page for gaming deals accessible to all users — Source: User request
* Add a new menu item to navigate to gaming deals page — Source: User request
* Implement tab switching between gaming deal categories (recent, popular, eaplay, uplay) — Source: User request
* Display cards in a grid layout (3-4 cards per row on desktop) — Source: User request
* Add a button on the bottom-left of cards that displays options when clicked — Source: User request
* Replace current hover behavior with explicit button-based interaction — Source: User request

### Derived Objectives

* Reuse existing GamePass data structure (getGamePassData API) to maintain consistency — Derived from: existing implementation uses same data source
* Follow established component patterns (ReviewFilterComponent for tabs, card styling patterns) — Derived from: codebase conventions
* Ensure responsive design with breakpoints for tablet and mobile views — Derived from: existing responsive patterns in codebase
* Maintain visual consistency with current theme (CSS custom properties, glass-morphism styling) — Derived from: design system in use

## Context Summary

### Project Architecture

* **Routing**: Uses src/pages/ directory (Next.js Pages Router)
* **Navigation**: NavBarComponent (src/components/NavBarComponent.js) — menu item management
* **Data Source**: getGamePassData() from public/APIHandler.js — provides 4 categories (recent, popular, eaplay, uplay)
* **Design System**: CSS custom properties (--theme-color-tone-1, --theme-color-tone-2, etc.), responsive units (vw, %), 600px mobile breakpoint
* **Component Patterns**: ReviewFilterComponent for tab switching, SubscriptionGameCardComponent for card reference, GameCardContainerComponent for grid layouts

### Related Files

* src/components/NavBarComponent.js — Menu navigation
* src/components/ReviewFilterComponent.js — Tab switching pattern reference
* src/components/SubscriptionGameCardComponent.js — Current card component (hover behavior to replace)
* src/components/SubscriptionSectionComponent.js — Current deals section (component logic reference)
* public/APIHandler.js — Data fetching (getGamePassData)
* styles/subscriptionSection/ — Current styling reference

## Implementation Checklist

### [ ] Implementation Phase 1: Navigation & Page Setup

<!-- parallelizable: true -->

* [ ] Step 1.1: Add "Gaming Deals" menu item to NavBarComponent
  * Details: .copilot-tracking/details/2026-05-27/gaming-deals-page-details.md (Lines TBD)
* [ ] Step 1.2: Create new page file at src/pages/gaming-deals/index.js
  * Details: .copilot-tracking/details/2026-05-27/gaming-deals-page-details.md (Lines TBD)
* [ ] Step 1.3: Import required utilities and components
  * Details: .copilot-tracking/details/2026-05-27/gaming-deals-page-details.md (Lines TBD)
* [ ] Step 1.4: Validate page routing works
  * Verify /gaming-deals route is accessible
  * Verify menu item links correctly

### [ ] Implementation Phase 2: Tab Switching & Data Fetching

<!-- parallelizable: false -->

* [ ] Step 2.1: Implement tab switching component (state-driven pattern using ReviewFilterComponent model)
  * Details: .copilot-tracking/details/2026-05-27/gaming-deals-page-details.md (Lines TBD)
* [ ] Step 2.2: Fetch GamePass data for selected category
  * Details: .copilot-tracking/details/2026-05-27/gaming-deals-page-details.md (Lines TBD)
* [ ] Step 2.3: Handle loading and error states
  * Details: .copilot-tracking/details/2026-05-27/gaming-deals-page-details.md (Lines TBD)

### [ ] Implementation Phase 3: Card Component & Grid Layout + Styling

<!-- parallelizable: true -->

* [ ] Step 3.1: Create new DealsGridCardComponent with button-based options
  * Details: .copilot-tracking/details/2026-05-27/gaming-deals-page-details.md (Lines TBD)
* [ ] Step 3.2: Create gaming-deals-grid.module.css with responsive breakpoints (3-4 cards per row, responsive)
  * Details: .copilot-tracking/details/2026-05-27/gaming-deals-page-details.md (Lines TBD)
* [ ] Step 3.3: Create deals-card.module.css for card styling and button behavior
  * Details: .copilot-tracking/details/2026-05-27/gaming-deals-page-details.md (Lines TBD)
* [ ] Step 3.4: Add click-outside handler to close options menu (verify button not included in optionsRef)
  * Details: .copilot-tracking/details/2026-05-27/gaming-deals-page-details.md (Lines TBD)

### [ ] Implementation Phase 4: Styling & Responsiveness Testing

<!-- parallelizable: false -->

* [ ] Step 4.1: Test responsive layout across breakpoints (desktop 4 cards, tablet 2, mobile 1)
  * Details: .copilot-tracking/details/2026-05-27/gaming-deals-page-details.md (Lines TBD)
* [ ] Step 4.2: Validate visual consistency with existing theme
  * Details: .copilot-tracking/details/2026-05-27/gaming-deals-page-details.md (Lines TBD)

### [ ] Implementation Phase 5: Integration & Testing

<!-- parallelizable: false -->

* [ ] Step 5.1: Verify API key parameters (recent, popular, eaplay, uplay work with getGamePassData)
  * Details: Test in dev environment before full implementation
* [ ] Step 5.2: Verify all 4 tabs load correct data
  * Details: .copilot-tracking/details/2026-05-27/gaming-deals-page-details.md (Lines TBD)
* [ ] Step 5.3: Test button click behavior and click-outside detection
  * Details: .copilot-tracking/details/2026-05-27/gaming-deals-page-details.md (Lines TBD)
* [ ] Step 5.4: Test navigation to game detail pages from options
  * Details: .copilot-tracking/details/2026-05-27/gaming-deals-page-details.md (Lines TBD)
* [ ] Step 5.5: Mobile testing (responsive layout and touch interactions)
  * Details: .copilot-tracking/details/2026-05-27/gaming-deals-page-details.md (Lines TBD)

### [ ] Implementation Phase 6: Validation

<!-- parallelizable: false -->

* [ ] Step 6.1: Run full project validation
  * Execute `npm run lint` for syntax and style checks
  * Execute `npm run build` to verify no build errors
  * Run tests if applicable
* [ ] Step 6.2: Fix minor validation issues
  * Address lint warnings or build warnings
* [ ] Step 6.3: Report blocking issues
  * Document any issues requiring additional research

## Planning Log

See `.copilot-tracking/plans/logs/2026-05-27/gaming-deals-page-log.md` for discrepancy tracking, implementation paths considered, and suggested follow-on work.

## Dependencies

* Next.js Pages Router (existing)
* React hooks (useState, useEffect, useRef)
* react-icons for UI elements (existing)
* APIHandler.getGamePassData() function
* CSS custom properties for theming

## Success Criteria

* Gaming Deals menu item appears in NavBar and links to /gaming-deals route — Traces to: User requirement (new menu item)
* /gaming-deals page renders with tab switcher displaying all 4 categories — Traces to: User requirement (tab switch layout)
* Cards display in grid layout: 4 per row (desktop), 2 per row (tablet), 1 per row (mobile) — Traces to: User requirement (3-4 cards per row, responsive)
* Each card displays image, title, and bottom-left button — Traces to: User requirement (bigger cards with button interaction)
* Button click reveals options menu (same options as current: search, Google search, write review) — Traces to: User requirement (replace hover with button)
* Click outside options menu closes it without navigating — Traces to: User requirement (button-based interaction)
* Page is accessible to all users without authentication — Traces to: User requirement (public page)
