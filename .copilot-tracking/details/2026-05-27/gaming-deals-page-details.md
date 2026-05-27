<!-- markdownlint-disable-file -->
# Implementation Details: Gaming Deals Page Feature

## Context Reference

Sources: Codebase research (NavBarComponent, SubscriptionSectionComponent, ReviewFilterComponent), existing GamePass data API, established grid and card patterns.

## Implementation Phase 1: Navigation & Page Setup

<!-- parallelizable: true -->

### Step 1.1: Add "Gaming Deals" menu item to NavBarComponent

**Objective**: Extend NavBarComponent to include a new menu item for gaming deals.

**File Details**:
* src/components/NavBarComponent.js — Add new menu item link

**Pattern Reference**: 
* Current menu items follow pattern: `<a className={styles.bar__item} onClick={() => redirectToPage(router, '/path', {})}>Label</a>`
* Current items: Home (/), Games (/games), About (/about)
* Add new item: Gaming Deals (/gaming-deals) with same pattern

**Implementation Steps**:
1. Locate the navbar menu items section in NavBarComponent.js
2. Add new menu item element after "Games" item: `<a className={styles.bar__item} onClick={() => redirectToPage(router, '/gaming-deals', {})}>Gaming Deals</a>`
3. Ensure proper spacing and styling consistency

**Success Criteria**:
* "Gaming Deals" text appears in navbar
* Clicking item navigates to /gaming-deals
* Mobile sandwich menu also includes the item

**Dependencies**:
* NavBarComponent.js exists
* redirectToPage utility available (existing)

---

### Step 1.2: Create new page file at src/pages/gaming-deals/index.js

**Objective**: Create the main page file for gaming deals with basic structure and imports.

**File Details**:
* Create: src/pages/gaming-deals/index.js (new file)

**Template Structure**:
```javascript
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '@/styles/gamingDeals.module.css';
// Import components here
// Import utilities here

export default function GamingDealsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('recent');
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data on category change
  }, [selectedCategory]);

  return (
    <>
      <Head>
        <title>Gaming Deals</title>
      </Head>
      <div className={styles.container}>
        <h1>Gaming Deals</h1>
        {/* Tab switcher will go here */}
        {/* Grid cards will go here */}
      </div>
    </>
  );
}
```

**Success Criteria**:
* File created without errors
* Page renders when navigating to /gaming-deals
* Basic structure in place for next steps

**Dependencies**:
* src/pages/ directory structure exists
* Next.js project configuration

---

### Step 1.3: Import required utilities and components

**Objective**: Set up all necessary imports for page functionality.

**Imports Needed**:
1. React hooks: useState, useEffect, useRef
2. Next.js utilities: useRouter, Head
3. APIHandler: import { getGamePassData } from '@/lib/APIHandler'
4. Components to create: DealsGridCardComponent (coming in Phase 3)
5. Styles: Create gaming-deals-grid.module.css
6. Utilities: redirectToPage function (existing)

**Pattern Reference**:
* Look at src/pages/index.js for import patterns
* Look at src/pages/games/index.js for useRouter + useEffect pattern

**Success Criteria**:
* All imports resolve without errors
* No unused imports

**Dependencies**:
* Components exist (will be created in Phase 3)
* Styles files exist (will be created in Phase 4)

---

### Step 1.4: Validate page routing works

**Objective**: Verify that the new page is accessible and menu navigation works.

**Validation Steps**:
1. Start development server: `npm run dev`
2. Navigate to /gaming-deals in browser
3. Verify page loads without 404
4. Click "Gaming Deals" in navbar and confirm navigation
5. Verify navbar is visible and styled correctly

**Success Criteria**:
* /gaming-deals route accessible
* No console errors related to routing
* Menu item navigates correctly

**Dependencies**:
* Steps 1.1-1.3 completed

---

## Implementation Phase 2: Tab Switching & Data Fetching

<!-- parallelizable: false -->

### Step 2.1: Implement tab switching component

**Objective**: Create tab switcher allowing users to select between 4 GamePass categories.

**File Details**:
* src/pages/gaming-deals/index.js — Add tab switcher JSX and state
* Reference: ReviewFilterComponent.js for tab pattern

**Pattern Reference** (from ReviewFilterComponent.js):
```javascript
const TAB_OPTIONS = [
  { key: "recent", label: "GamePass Recent" },
  { key: "popular", label: "GamePass Popular" },
  { key: "eaplay", label: "GamePass EA Play" },
  { key: "uplay", label: "GamePass Uplay+" }
];

{TAB_OPTIONS.map(({ key, label }) => (
  <button
    className={`${styles.filterButton} ${selectedCategory === key ? styles.toggled : ""}`}
    onClick={() => setSelectedCategory(key)}
  >
    {label}
  </button>
))}
```

**Implementation Details**:
1. Define TAB_OPTIONS array with 4 categories
2. Add state: `const [selectedCategory, setSelectedCategory] = useState('recent')`
3. Create tab button section with onClick handlers
4. Apply conditional styling for active tab

**Success Criteria**:
* All 4 tabs visible
* Clicking tab updates state
* Active tab has visual distinction

**Context Reference**:
* ReviewFilterComponent.js (lines for button styling reference)
* SubscriptionSectionComponent.js (category usage reference)

**Dependencies**:
* Step 1.2-1.3 completed
* Styling available (Step 4.1)

---

### Step 2.2: Fetch GamePass data for selected category

**Objective**: Load GamePass data when category changes.

**File Details**:
* src/pages/gaming-deals/index.js — Add useEffect for data fetching

**API Pattern Reference** (from existing homepage usage):
* Import: `import { getGamePassData } from '@/lib/APIHandler'`
* Usage: `const data = await getGamePassData(category)`

**Implementation Details**:
```javascript
useEffect(() => {
  const fetchDeals = async () => {
    setLoading(true);
    try {
      const data = await getGamePassData(selectedCategory);
      setDeals(data);
    } catch (error) {
      console.error('Failed to fetch deals:', error);
      setDeals([]);
    } finally {
      setLoading(false);
    }
  };
  
  fetchDeals();
}, [selectedCategory]);
```

**Success Criteria**:
* Data loads when page mounts
* Data reloads when category changes
* Loading state updates appropriately
* Error handling in place

**Context Reference**:
* public/APIHandler.js — getGamePassData function signature
* src/pages/index.js (lines with SubscriptionSectionComponent) — usage example

**Dependencies**:
* Step 2.1 completed
* getGamePassData API available

---

### Step 2.3: Handle loading and error states

**Objective**: Display appropriate UI during loading and error conditions.

**Implementation Details**:
1. Show loader component while loading: `{loading && <LoaderComponent />}`
2. Show fallback message if deals array is empty
3. Add try-catch in useEffect (already in Step 2.2)

**Pattern Reference**:
* LoaderComponent exists at src/components/LoaderComponent.js
* Used in other pages for same purpose

**Success Criteria**:
* Loader displays while fetching
* Loader hides after data loads
* Graceful handling if no data available

**Context Reference**:
* LoaderComponent.js for implementation

**Dependencies**:
* Step 2.2 completed
* LoaderComponent.js available

---

## Implementation Phase 3: Card Component & Grid Layout + Styling

<!-- parallelizable: true -->

### Step 3.1: Create new DealsGridCardComponent with button-based options

**Objective**: Create a new card component that displays game deal information with a button-based options menu.

**Files**:
* Create: src/components/DealsGridCardComponent.js (new file)

**Template Structure**:
```javascript
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@/styles/deals-card.module.css';
import { redirectToPage } from '@/lib/functions';

export default function DealsGridCardComponent({ game }) {
  const router = useRouter();
  const [optionsOpen, setOptionsOpen] = useState(false);
  const optionsRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target) && !buttonRef.current.contains(e.target)) {
        setOptionsOpen(false);
      }
    };

    if (optionsOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [optionsOpen]);

  return (
    <div className={styles.card}>
      <div className={styles.imgContainer}>
        <img src={game.image} alt={game.title} />
      </div>
      <div className={styles.cardContent}>
        <h3>{game.title}</h3>
        <div className={styles.buttonContainer}>
          <button 
            className={styles.optionsButton}
            onClick={() => setOptionsOpen(!optionsOpen)}
            ref={buttonRef}
          >
            ⋮
          </button>
          {optionsOpen && (
            <div className={styles.optionsMenu} ref={optionsRef}>
              <div onClick={() => redirectToPage(router, `/games`, { searchWord: game.title })}>
                GameNotes search
              </div>
              <Link href={`https://google.com/search?q=${game.title}`}>
                Google search
              </Link>
              <div onClick={() => redirectToPage(router, `/dashboard`, { createReviewTitle: game.title })}>
                Write review
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Key Features**:
* Uses useRef for options menu click-outside detection
* Includes buttonRef to exclude button from click-outside logic (prevents race condition)
* Button positioned on bottom-left of card
* Three options: GameNotes search, Google search, Write review
* State-driven options visibility

**Success Criteria**:
* Card renders with image and title
* Button appears on bottom-left
* Click button toggles options menu
* Click outside menu (not including button) closes menu
* Options have correct functionality

**Context Reference**:
* SubscriptionGameCardComponent.js (lines for card structure reference)
* SubscriptionSectionComponent.js (options content reference)

**Dependencies**:
* redirectToPage utility available
* Game data structure from API

---

### Step 3.2: Create gaming-deals-grid.module.css with responsive breakpoints

**Objective**: Style the options button and menu positioning.

**Files**:
* Create: styles/deals-card.module.css (new file)

**CSS Structure**:
```css
.card {
  border: 1px solid var(--theme-color-tone-2);
  border-radius: var(--border-radius-small);
  background: var(--theme-color-tone-1);
  backdrop-filter: blur(20px);
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.75);
  transition: 0.25s ease-in-out;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
}

.imgContainer {
  width: 100%;
  height: 60%;
  overflow: hidden;
  border-radius: var(--border-radius-small) var(--border-radius-small) 0 0;
}

.imgContainer img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cardContent {
  flex: 1;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}

.cardContent h3 {
  margin: 0;
  font-size: 1rem;
  color: var(--text-color-1);
}

.buttonContainer {
  position: absolute;
  bottom: 10px;
  left: 10px;
}

.optionsButton {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid var(--theme-color-tone-2);
  color: var(--text-color-1);
  padding: 5px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: 0.2s ease-in-out;
}

.optionsButton:hover {
  background: rgba(0, 0, 0, 0.7);
  border-color: var(--text-color-1);
}

.optionsMenu {
  position: absolute;
  bottom: 40px;
  left: 0;
  background: var(--theme-color-tone-1);
  border: 1px solid var(--theme-color-tone-2);
  border-radius: var(--border-radius-small);
  z-index: 10;
  min-width: 150px;
}

.optionsMenu > div,
.optionsMenu > a {
  padding: 10px 15px;
  cursor: pointer;
  border-bottom: 1px solid var(--theme-color-tone-2);
  transition: 0.15s ease-in-out;
}

.optionsMenu > div:hover,
.optionsMenu > a:hover {
  background: rgba(255, 255, 255, 0.1);
}

.optionsMenu > div:last-child,
.optionsMenu > a:last-child {
  border-bottom: none;
}
```

**Success Criteria**:
* Button visible on bottom-left corner
* Options menu appears above button on click
* Menu has proper z-index to appear above other content
* Hover effects work on menu items

**Context Reference**:
* styles/subscriptionSection/subscriptionGameCard.module.css (reference for card styling)

**Dependencies**:
* Step 3.1 component structure finalized

---

### Step 3.4: Add click-outside handler to close options menu

**Objective**: Implement click-outside detection to close options menu.

**File Details**:
* src/components/DealsGridCardComponent.js — Already included in Step 3.1

**Implementation** (from Step 3.1 template):
```javascript
useEffect(() => {
  const handleClickOutside = (e) => {
    if (optionsRef.current && !optionsRef.current.contains(e.target)) {
      setOptionsOpen(false);
    }
  };

  if (optionsOpen) {
    document.addEventListener('click', handleClickOutside);
  }

  return () => document.removeEventListener('click', handleClickOutside);
}, [optionsOpen]);
```

**How It Works**:
1. useRef tracks the options menu container
2. Event listener added only when menu is open
3. Listener checks if click target is outside the menu
4. Closes menu if click detected outside
5. Cleanup function removes listener on unmount or when menu closes

**Success Criteria**:
* Clicking outside menu closes it
* Clicking inside menu keeps it open
* No memory leaks from event listeners

**Dependencies**:
* Step 3.1 component creation

---

## Implementation Phase 4: Styling & Responsiveness Testing

<!-- parallelizable: false -->

### Step 4.1: Test responsive layout across breakpoints

**Objective**: Verify responsive behavior across different screen sizes.

**Testing Steps**:
1. Open page in browser
2. Test desktop view (1920px): Verify 4 cards per row
3. Test laptop view (1200px): Verify 3 cards per row
4. Test tablet view (768px): Verify 2 cards per row
5. Test mobile view (600px): Verify 1 card per row
6. Test on actual mobile device if available
7. Verify no horizontal scroll on any size
8. Verify cards maintain proper spacing and alignment

**Success Criteria**:
* All breakpoints display correct number of columns
* No layout breaks at any size
* Cards properly sized and spaced

**Dependencies**:
* Phases 1-3 completed

---

### Step 4.2: Validate visual consistency with existing theme

**Objective**: Ensure styling matches app design system.

**Validation Steps**:
1. Compare card colors with existing cards (SubscriptionGameCardComponent)
2. Verify glass-morphism effect (backdrop-filter, border, shadow)
3. Check CSS custom properties usage (theme colors, border radius)
4. Verify button styling consistency
5. Check menu styling and z-index layering
6. Compare spacing and padding with existing components

**Success Criteria**:
* Visual consistency with existing design
* All CSS custom properties resolved correctly
* No style conflicts with existing CSS

**Dependencies**:
* Phases 1-3 completed

---

## Implementation Phase 5: Integration & Testing

<!-- parallelizable: false -->

### Step 5.1: Verify API key parameters

**Objective**: Confirm getGamePassData() accepts category parameters.

**Testing Steps**:
1. Call `getGamePassData('recent')` in dev environment
2. Verify API returns expected data structure
3. Test all 4 categories: recent, popular, eaplay, uplay
4. Check console for any errors or warnings

**Success Criteria**:
* All category keys accepted by API
* Data structure matches expected format
* No errors in API calls

**Dependencies**:
* None - test before implementation

---

### Step 5.2: Verify all 4 tabs load correct data

**Objective**: Confirm each tab loads the expected data.

**Testing Steps**:
1. Click "GamePass Recent" tab — verify recent games display
2. Click "GamePass Popular" tab — verify popular games display
3. Click "GamePass EA Play" tab — verify EA Play games display
4. Click "GamePass Uplay+" tab — verify Uplay games display
5. Verify data changes when switching tabs
6. Check console for any API errors

**Success Criteria**:
* Each tab displays different data
* Data loads without errors
* No duplicate games across tabs

**Dependencies**:
* Steps 2.1-2.3 completed
* Step 5.1 API verification passed

---

### Step 5.3: Test button click behavior and click-outside detection

**Objective**: Verify card interaction works as expected.

**Testing Steps**:
1. Click options button on a card — verify menu appears
2. Click same button again — verify menu closes
3. Click different card's button — verify previous menu closes and new one opens
4. Click outside menu (not on button) — verify menu closes without navigation
5. Verify menu items are clickable
6. Verify buttonRef properly excludes button from click-outside logic

**Success Criteria**:
* Button click toggles menu visibility
* Only one menu open at a time
* Click-outside closes menu (excluding button)
* No race conditions on open/close

**Dependencies**:
* Steps 3.1-3.4 component completed

---

### Step 5.4: Test navigation to game detail pages from options

**Objective**: Verify options menu actions work correctly.

**Testing Steps**:
1. Click "GameNotes search" option — verify search in games page
2. Click "Google search" option — verify Google search opens
3. Click "Write review" option — verify redirects to dashboard with game title pre-filled
4. Verify each action completes without errors
5. Check console for any routing errors

**Success Criteria**:
* All three options functional
* Navigation works correctly
* No console errors
* Data passed correctly to target pages

**Dependencies**:
* Step 5.3 menu implementation
* Backend APIs/routes available

---

### Step 5.5: Mobile testing (responsive layout and touch interactions)

**Objective**: Test on actual mobile devices or emulation.

**Testing Steps**:
1. Open on mobile device (iPhone/Android) or use browser DevTools
2. Verify page loads correctly
3. Verify navbar is accessible and items visible
4. Verify single-column layout displays correctly
5. Verify tabs are usable on mobile
6. Verify card button and options work on touch
7. Verify no horizontal scroll
8. Test menu click-outside on mobile

**Success Criteria**:
* Fully functional on mobile devices
* Touch interactions work
* Layout optimized for mobile
* No horizontal scrolling

**Dependencies**:
* Phases 1-4 completed

---

## Implementation Phase 6: Validation

<!-- parallelizable: false -->

### Step 6.1: Run full project validation

Execute all validation commands for the project:
* `npm run lint` (syntax and style checks)
* `npm run build` (build verification)
* Manual test of page functionality

### Step 6.2: Fix minor validation issues

Iterate on lint errors, build warnings, and test failures. Apply fixes directly when corrections are straightforward and isolated.

### Step 6.3: Report blocking issues

When validation failures require changes beyond minor fixes:
* Document the issues and affected files
* Provide next steps for resolution
* Recommend additional research and planning if needed

---

## Implementation Phase 4: Styling & Responsiveness

<!-- parallelizable: true -->

### Step 4.1: Create gaming-deals-grid.module.css with responsive breakpoints

**Objective**: Create complete CSS for grid container with responsive breakpoints.

**File Details**:
* Create: styles/gaming-deals-grid.module.css (new file)
* See Step 3.2 for full CSS structure

**Responsive Breakpoints**:
* Desktop (>1200px): 4 columns
* Laptop (1200px and below): 3 columns
* Tablet (768px and below): 2 columns
* Mobile (600px and below): 1 column

**Success Criteria**:
* File created in styles/ directory
* All breakpoints implemented
* CSS syntax valid

**Dependencies**:
* None (CSS file)

---

### Step 4.2: Create deals-card.module.css for card styling and button behavior

**Objective**: Create complete CSS for card component.

**File Details**:
* Create: styles/deals-card.module.css (new file)
* See Step 3.3 for full CSS structure

**Key Styles**:
* Card background and borders (glass-morphism pattern)
* Image container with proper aspect ratio
* Button positioning (bottom-left)
* Options menu positioning and styling
* Hover effects and transitions

**Success Criteria**:
* File created in styles/ directory
* Cards display with image and content
* Button visible and clickable
* Options menu styled and positioned correctly

**Dependencies**:
* None (CSS file)

---

### Step 4.3: Test responsive layout (desktop 4 cards, tablet 2, mobile 1)

**Objective**: Verify responsive behavior across different screen sizes.

**Testing Steps**:
1. Open page in browser
2. Test desktop view (1920px): Verify 4 cards per row
3. Test laptop view (1200px): Verify 3 cards per row
4. Test tablet view (768px): Verify 2 cards per row
5. Test mobile view (600px): Verify 1 card per row
6. Test on actual mobile device if available
7. Verify no horizontal scroll on any size
8. Verify cards maintain proper spacing and alignment

**Success Criteria**:
* All breakpoints display correct number of columns
* No layout breaks at any size
* Cards properly sized and spaced

**Dependencies**:
* Steps 4.1-4.2 CSS files created
* Page fully implemented

---

## Implementation Phase 5: Integration & Testing

<!-- parallelizable: false -->

### Step 5.1: Verify all 4 tabs load correct data

**Objective**: Confirm each tab loads the expected data.

**Testing Steps**:
1. Click "GamePass Recent" tab — verify recent games display
2. Click "GamePass Popular" tab — verify popular games display
3. Click "GamePass EA Play" tab — verify EA Play games display
4. Click "GamePass Uplay+" tab — verify Uplay games display
5. Verify data changes when switching tabs
6. Check console for any API errors

**Success Criteria**:
* Each tab displays different data
* Data loads without errors
* No duplicate games across tabs

**Dependencies**:
* Steps 2.1-2.3 completed
* API working correctly

---

### Step 5.2: Test button click behavior on cards

**Objective**: Verify card interaction works as expected.

**Testing Steps**:
1. Click options button on a card — verify menu appears
2. Click same button again — verify menu closes
3. Click different card's button — verify previous menu closes and new one opens
4. Click outside menu — verify menu closes without navigation
5. Verify menu items are clickable

**Success Criteria**:
* Button click toggles menu visibility
* Only one menu open at a time
* Click-outside closes menu

**Dependencies**:
* Steps 3.1-3.4 component completed

---

### Step 5.3: Test navigation to game detail pages from options

**Objective**: Verify options menu actions work correctly.

**Testing Steps**:
1. Click "GameNotes search" option — verify search in games page
2. Click "Google search" option — verify Google search opens
3. Click "Write review" option — verify redirects to dashboard with game title pre-filled
4. Verify each action completes without errors

**Success Criteria**:
* All three options functional
* Navigation works correctly
* No console errors

**Dependencies**:
* Step 5.2 menu implementation
* Backend APIs/routes available

---

### Step 5.4: Mobile testing (ensure responsive layout works)

**Objective**: Test on actual mobile devices or emulation.

**Testing Steps**:
1. Open on mobile device (iPhone/Android) or use browser DevTools
2. Verify page loads correctly
3. Verify navbar is accessible and items visible
4. Verify single-column layout displays correctly
5. Verify tabs are usable on mobile
6. Verify card button and options work on touch
7. Verify no horizontal scroll

**Success Criteria**:
* Fully functional on mobile devices
* Touch interactions work
* Layout optimized for mobile

**Dependencies**:
* Full implementation completed

---

## Dependencies

* Next.js Pages Router (existing)
* React hooks (useState, useEffect, useRef)
* APIHandler.getGamePassData() function
* CSS custom properties for theming
* redirectToPage utility function
* LoaderComponent.js

## Success Criteria

* Gaming Deals menu item visible in navbar and navigates correctly to /gaming-deals — Traces to: User requirement
* Tab switcher displays 4 categories with active state styling — Traces to: User requirement (tab switch layout)
* Grid displays: 4 cards/row (desktop), 3 cards/row (laptop), 2 cards/row (tablet), 1 card/row (mobile) — Traces to: User requirement (3-4 cards per row, responsive)
* Cards larger than current subscription cards with image and title visible — Traces to: User requirement (bigger cards)
* Button on bottom-left of each card opens/closes options menu on click — Traces to: User requirement (button-based interaction)
* Click outside menu closes it without side effects — Traces to: User requirement (clean interaction)
* Options menu provides same functionality as current (search, Google, review) — Traces to: User requirement (maintain feature parity)
* Page accessible without authentication — Traces to: User requirement (public page)
