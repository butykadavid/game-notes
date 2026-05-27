<!-- markdownlint-disable-file -->
# Planning Log: Gaming Deals Page Feature

## Discrepancy Log

Gaps and differences identified between research findings and the implementation plan.

### Validation Issues - RESOLVED

* **Phase organization (MAJOR - RESOLVED)**: Plan Phase 3 and 4 had duplicate CSS file creation steps
  * Resolution: Consolidated Phase 3 to include all component and CSS file creation; renamed Phase 4 to "Styling & Responsiveness Testing" for visual QA only
  * Status: Fixed in updated plan files

* **API key verification (MAJOR - IDENTIFIED)**: Plan assumes category keys work with getGamePassData()
  * Resolution: Added Step 5.1 "Verify API key parameters" as prerequisite test before Phase 2 implementation
  * Action: Call `getGamePassData('recent', 'popular', 'eaplay', 'uplay')` in dev environment before proceeding
  * Status: Testing step added to plan

* **Click-outside logic (MINOR - RESOLVED)**: DealsGridCardComponent needs button exclusion to prevent race condition
  * Resolution: Updated Step 3.1 component template to include `buttonRef` and exclude button from click-outside check
  * Code: `!optionsRef.current.contains(e.target) && !buttonRef.current.contains(e.target)`
  * Status: Fixed in component template

### Unaddressed Research Items

* DR-01: Potential for dedicated filtering within gaming deals page (e.g., filter by price, platform)
  * Source: .copilot-tracking/research/2026-05-27/gaming-deals-page-research.md (General planning decisions section)
  * Reason: Out of scope for initial feature; can be added as follow-on work
  * Impact: low — User can still browse and switch between categories

* DR-02: Analytics tracking for deal clicks and user engagement
  * Source: User request (not explicitly mentioned but useful for tracking deals page performance)
  * Reason: Not requested by user; can be added in future iterations
  * Impact: low — Feature still fully functional without analytics

### Plan Deviations from Research

* DD-01: Using responsive grid (CSS Grid) instead of flex layout
  * Research recommends: Could use flex with flex-wrap for grid-like behavior
  * Plan implements: CSS Grid with grid-template-columns for cleaner responsive design
  * Rationale: CSS Grid provides cleaner breakpoint management and better alignment than flex for this use case

* DD-02: Card height flexibility vs fixed aspect ratio
  * Research mentions: Existing cards use fixed vw-based sizing
  * Plan implements: Flexible card heights based on content with proper spacing
  * Rationale: Grid layout with responsive columns makes fixed sizing problematic; flexible heights provide better UX

* DD-03: No separate component for tab switcher
  * Research pattern: ReviewFilterComponent is a separate component
  * Plan implements: Inline tab buttons in gaming deals page component
  * Rationale: Reduces component complexity for initial release; can be extracted later if reused

## Implementation Paths Considered

### Selected: Reuse existing GamePass API with new dedicated page

* Approach: Create new page at /gaming-deals that uses existing getGamePassData() API, replaces hover with button-based options, displays grid layout
* Rationale: Minimizes implementation scope, leverages proven data source, follows established patterns in codebase
* Evidence: 
  * getGamePassData() already used in SubscriptionSectionComponent.js
  * Existing category structure (recent, popular, eaplay, uplay)
  * Established styling patterns in subscriptionSection and subscriptionGameCard modules

### IP-01: Create dedicated gaming deals API endpoint

* Approach: Create new API route in backend to serve gaming deals with additional metadata, filtering, sorting
* Trade-offs: 
  * Pros: Better separation of concerns, more flexible data structure, potential for richer features
  * Cons: Requires backend changes, increases implementation complexity, delays feature delivery
* Rejection rationale: Out of scope; user didn't request new data structure, existing API serves requirement well

### IP-02: Implement infinite scroll for deals

* Approach: Use react-infinite-scroll-component (already used on games page) for lazy-loading deals
* Trade-offs:
  * Pros: Better performance for large datasets, familiar pattern from existing codebase
  * Cons: May not be necessary if category datasets are small, adds pagination logic
* Rejection rationale: Category data likely small enough to load all at once; can be added as optimization if needed

### IP-03: Use existing SubscriptionSectionComponent directly

* Approach: Reuse SubscriptionSectionComponent on new page instead of creating new card component
* Trade-offs:
  * Pros: No new component to maintain, reuses existing code
  * Cons: SubscriptionSectionComponent uses horizontal scroll layout, not grid; requires modification to work with new layout requirements
* Rejection rationale: Component designed for horizontal scroll (flex-direction: row, overflow-x: auto); doesn't fit grid requirement without significant refactoring. New component cleaner.

## Suggested Follow-On Work

Items identified during planning that fall outside current scope.

* WI-01: Add filtering within gaming deals page (filter by price, platform, subscription service) — Would enhance user experience by allowing more granular browsing. Source: Planning phase analysis. Priority: Medium. Dependency: Gaming Deals page must be complete first.

* WI-02: Implement deal notifications (alert users when specific games go on sale) — Would increase engagement and page traffic. Source: Planning phase analysis. Priority: Medium. Dependency: User notification system must exist or be created.

* WI-03: Add deal expiration dates and countdown timers to cards — Would help users prioritize which deals to take advantage of. Source: Planning phase analysis. Priority: Low. Dependency: Backend must provide deal expiration data.

* WI-04: Create dedicated admin panel section for managing gaming deals — Would give admins control over which deals display. Source: Planning phase analysis. Priority: Low. Dependency: Admin infrastructure exists; new admin routes needed.

* WI-05: Analytics integration for deal engagement tracking — Would help understand which deals are most popular. Source: Planning phase analysis. Priority: Low. Dependency: Analytics infrastructure needed.

* WI-06: Extract tab switcher to reusable component — If more pages need tab switching, extract inline implementation into dedicated component. Source: Planning phase analysis. Priority: Low. Dependency: Identify other use cases first.

## Implementation Path Rationale

**Selected Path: Reuse existing GamePass API with new dedicated page**

The selected approach balances feature delivery speed with architectural coherence:

1. **Minimal scope changes**: Uses existing data source without backend modifications
2. **Established patterns**: Follows codebase conventions for pages, components, and styling
3. **User requirements met**: Delivers all requested features (dedicated page, tabs, grid layout, button-based options)
4. **Iterative enhancement**: Allows for follow-on improvements (filtering, notifications, expiration dates) without blocking initial release
5. **Quick implementation**: Estimated completion in one session without requiring multiple rounds of API design or backend changes

Alternative paths (IP-01 through IP-03) would delay delivery or require significant refactoring without clear user benefit at this stage.
