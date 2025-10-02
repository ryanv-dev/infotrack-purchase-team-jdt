# Junior Developer Technical Test – Purchase Team
-- Property Management System

## How to Run

### Prerequisites

- .NET 8 SDK
- Node.js
- pnpm

### Installation

```bash
pnpm install    # This will also run dotnet restore for the API
```

### Development

Run both API and UI in development mode:

```bash
pnpm run dev    # Runs UI and API concurrently
```

Or run them separately:

```bash
# UI only
pnpm run dev:ui     # Starts the UI development server

# API only
pnpm run dev:api    # Starts the API with hot reload
```

### Testing

```bash
pnpm run test:api   # Run API tests
```

### Build

```bash
pnpm run build:ui   # Build the UI for production
pnpm run build:api  # Build the API
```

### Storybook

```bash
pnpm run storybook  # Run Storybook for component development
```

## Time Spent

🏗️ Monorepo setup, Vite config, shadcn/ui integration, database set up were completed prior to the timebox to ensure the 3 hours were focused on implementation and testing.

Total: ~3 hours

## Assumptions Made

1. Property Data:
  
  - Properties with the same full address are considered the same property
  - When normalizing a property that already exists, return the existing property id
  - Empty strings in volume/folio fields are treated the same as null values
  - All parts of AddressParts are required when that field is provided
2. Error Handling:
  
  - Missing/invalid address data (both formattedAddress and addressParts null/empty) should result in a BadRequest response
  - Volume/folio validation failures should show clear error messages
3. API Behavior:
  
  - 201 Created for new property normalization
  - 200 OK when returning existing property
  - 404 Not Found for non-existent property lookups

## Approach & Trade-offs

### Architecture Choices

- Used Minimal API for backend implementation
- Chose shadcn/ui for React component development
- Testing Strategy:
  - Backend: Unit tests for PropertyNormalizer function
    - Focused on core business logic as it contains critical mapping rules
    - Easy to test pure functions with different input scenarios
  - Frontend: Storybook for component testing
    - Visual validation of component states (error, loading, success)
    - Interactive testing of modal behavior and form validation

### Trade-offs Made

1. API Implementation:
  
  - Ideal: Separate service layer for property normalization
  - Current: Direct endpoint implementation with inline normalization
  - Trade-off: Faster to implement but less separation of concerns
2. Component Implementation:
  
  - Ideal: Custom hooks for API interactions and state management
  - Current: Direct API calls within components using fetch
  - Trade-off: Simpler implementation vs reusable data fetching logic
3. Testing Coverage:
  
  - Ideal: Full test coverage including UI interaction tests
  - Current: Core unit tests and Storybook UI testing
  - Trade-off: Covered main functionality within time constraints

### Stretch Goals Implemented

1. ✅ Input masking for better UX
2. ✅ SQLite persistence
3. ✅ Server-side validation

## AI Assistance & Verification

### GitHub Copilot Usage

1. API Development:
  
  - Helped with property normalization logic
  - Generated basic endpoint structure
    Verification: Extensive unit tests and manual testing
2. UI Components:
  
  - Assisted with form validation patterns
  - Suggested shadcn/ui component implementations
    Verification: Component testing and manual UI testing
3. SQL Queries:
  
  - Helped optimize query structure
  - Suggested index implementation
    Verification: Manual query testing with sample data

### Verification Methods

1. Testing Strategy:
  
  - Backend: Unit tests with full coverage of normalization logic
  - Frontend:
    - Storybook for component visualization and interaction testing
    - Component tests to be implemented for modal, validation, and update scenarios
  - Manual testing for integration verification
2. Manual Testing:
  
  - End-to-end workflow verification
  - Edge case validation

## Tools Used

- Backend:
  
  - .NET 8
  - Entity Framework Core
- Frontend:
  
  - React 18
  - TypeScript
  - shadcn/ui
  - Storybook
- Development:
  
  - GitHub Copilot
  - VS Code