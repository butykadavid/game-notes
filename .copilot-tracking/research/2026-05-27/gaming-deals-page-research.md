<!-- markdownlint-disable-file -->
# Gaming Deals Page Feature Research

## Overview
This document captures research findings on creating a dedicated gaming deals page with category-based tab switching, grid layout, and revised card interactions.

## Current Implementation Context

### Existing Deals Feature
- **Location**: src/pages/index.js (lines 164-174) - Gaming deals section
- **Component**: SubscriptionSectionComponent with 4 categories
  - recent, popular, eaplay, uplay
  - Data source: getGamePassData() from APIHandler
- **Current Layout**: Horizontal scrolling cards (10vw width, 18vw height)
- **Current Interaction**: Hover-based 3-option toggle box showing:
  - GameNotes search
  - Google search
  - Write review

### Navigation Structure
- **NavBarComponent** (src/components/NavBarComponent.js)
- Current menu items: Home, Games, About, Sign In
- Uses custom redirectToPage() utility for navigation
- Mobile: Sandwich menu (⋮) with side panel
- Pattern: Simple onClick handlers with router.push()

### Card & Grid Patterns
- **SubscriptionGameCardComponent**: Card styling, hover behavior (10vw × 18vw)
- **ReviewFilterComponent**: Tab/button switching pattern with active state styling
- **GameCardContainerComponent**: Grid/list toggle implementation
- **CSS Pattern**: Flex layouts with responsive breakpoints
- **Theme**: CSS custom properties (--theme-color-tone-1, --theme-color-tone-2, etc.)

### Responsive Design
- **Breakpoints**: Media queries at 600px for mobile
- **Current sizes**: vw-based units for card sizing
- **Target**: 3-4 cards per row for big screens

## Planning Decisions

### Page Location
**Selected**: `/gaming-deals` (new route in src/pages/gaming-deals/index.js)
- Rationale: Descriptive, follows existing routing pattern, matches feature name
- Alternatives: `/deals`, `/gaming-offers` (more concise but less explicit)

### Data Organization
**Selected**: Reuse existing SubscriptionSectionComponent categories
- Categories: recent, popular, eaplay, uplay
- Uses existing getGamePassData() API
- Reduces implementation scope, leverages proven data source

### Card Interaction Pattern
**Selected**: Button-based (bottom-left) replacing hover
- Button shows/hides options on click
- Rationale: Explicit interaction, better mobile UX, reduces accidental hovers
- Matches platform accessibility best practices

### Grid Layout Strategy
**Selected**: CSS Grid or Flex with responsive columns
- 3-4 cards per row on desktop (adjust vw sizing)
- 1-2 cards per row on tablet
- 1 card per row on mobile
- Card sizing: Larger than current (adjust from 10vw to ~20-25vw for 4-per-row)

## Implementation Scope

### Components to Create
1. **GamingDealsPageComponent** or inline in page (src/pages/gaming-deals/index.js)
2. **DealsGridCardComponent** (new card component with button-based options)
3. **DealsTabSwitcher** or use ReviewFilterComponent pattern

### Components to Modify
1. **NavBarComponent** - Add "Gaming Deals" menu item

### Styles to Create
1. **gaming-deals-grid.module.css** - Grid layout and responsive styling
2. **deals-card.module.css** - New card styling with button interaction

### Data & APIs
- Existing: getGamePassData() from APIHandler (public/APIHandler.js)
- No new API calls needed

## Success Metrics
- [x] New menu item visible in navbar
- [x] /gaming-deals page accessible to all users
- [x] Tab switching between 4 categories works
- [x] Grid displays 3-4 cards per row (desktop)
- [x] Card styling matches app theme
- [x] Button-based options display (bottom-left)
- [x] Click outside closes options menu
- [x] Responsive on mobile (1 card per row)
- [x] Same data/options as homepage section

## Technical Notes
- Uses src/pages/ routing (Pages Router, not App Router)
- Responsive units: vw for width, px or rem for fixed sizes
- CSS custom properties for theming
- React icons for UI elements
- No authentication required (public page)
