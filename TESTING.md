# Testing Guide for Contest Draw Platform

This document provides comprehensive information about the testing setup and how to run tests for the Contest Draw Platform.

## 🧪 Testing Framework

The project uses **Vitest** as the test runner with **React Testing Library** for component testing.

### Dependencies

- **vitest**: Fast test runner built on Vite
- **@testing-library/react**: React component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers for DOM testing
- **@testing-library/user-event**: User interaction simulation
- **jsdom**: DOM environment for testing

## 🚀 Running Tests

### Available Test Commands

```bash
# Run all tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with UI (if available)
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Structure

```
src/test/
├── setup.ts                    # Test setup and global mocks
├── utils/
│   ├── drawLogic.test.ts       # Core draw algorithm tests
│   ├── csvParser.test.ts       # CSV parsing utility tests
│   └── testHelpers.ts          # Test utilities and helpers
├── components/
│   ├── FileUpload.test.tsx     # File upload component tests
│   ├── ParticipantsList.test.tsx # Participants list tests
│   ├── WinnersDisplay.test.tsx # Winners display tests
│   └── RandomnessVisualization.test.tsx # Visualization tests
└── pages/
    └── Index.test.tsx          # Main page integration tests
```

## 📋 Test Coverage

### Core Functionality Tests

#### 1. **Draw Logic Tests** (`drawLogic.test.ts`)
- ✅ Fisher-Yates shuffle algorithm validation
- ✅ Cryptographic random number generation
- ✅ Winner selection (exactly 7 winners)
- ✅ Unbiased distribution testing
- ✅ Edge cases (exactly 7 participants, large lists)
- ✅ Special characters in names
- ✅ Error handling for insufficient participants

#### 2. **CSV Parser Tests** (`csvParser.test.ts`)
- ✅ Valid CSV parsing
- ✅ Empty CSV handling
- ✅ Whitespace trimming
- ✅ Missing fields handling
- ✅ Special characters support
- ✅ Large file handling
- ✅ Different line endings (Windows/Unix)
- ✅ Unicode character support

### Component Tests

#### 3. **FileUpload Component** (`FileUpload.test.tsx`)
- ✅ Drag and drop functionality
- ✅ File selection via click
- ✅ CSV file validation
- ✅ Non-CSV file rejection
- ✅ Empty file handling
- ✅ Large file handling
- ✅ Error state management

#### 4. **ParticipantsList Component** (`ParticipantsList.test.tsx`)
- ✅ Participant display
- ✅ Count display
- ✅ Empty state handling
- ✅ Large list scrolling
- ✅ Special characters in names
- ✅ Long names and emails
- ✅ Duplicate names handling

#### 5. **WinnersDisplay Component** (`WinnersDisplay.test.tsx`)
- ✅ Winner display with animations
- ✅ Draw metadata display
- ✅ Report download functionality
- ✅ TXT and JSON report generation
- ✅ Single winner handling
- ✅ Empty winners handling
- ✅ Special characters support

#### 6. **RandomnessVisualization Component** (`RandomnessVisualization.test.tsx`)
- ✅ Step-by-step animation
- ✅ Demonstration button states
- ✅ Shuffle result display
- ✅ Technical notes display
- ✅ Edge cases (0 participants, large counts)
- ✅ Accessibility features

### Integration Tests

#### 7. **Main Page Integration** (`Index.test.tsx`)
- ✅ Complete workflow: upload → draw → download
- ✅ File upload integration
- ✅ Draw process integration
- ✅ Reset functionality
- ✅ Error handling
- ✅ State management
- ✅ Technical details expansion
- ✅ Sample CSV download

## 🔧 Test Configuration

### Vitest Configuration (`vitest.config.ts`)

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
})
```

### Test Setup (`src/test/setup.ts`)

The setup file includes:
- Jest-DOM matchers extension
- Global mocks for crypto, canvas-confetti, and browser APIs
- Cleanup after each test
- Mock implementations for testing

## 🎯 Test Scenarios

### Happy Path Testing
1. Upload valid CSV file
2. Verify participants are loaded
3. Perform draw
4. Verify winners are selected
5. Download audit report
6. Reset and repeat

### Edge Case Testing
- Empty CSV files
- Single participant
- Exactly 7 participants
- Large participant lists (1000+)
- Special characters in names
- Long names and emails
- Duplicate names

### Error Handling Testing
- Insufficient participants (< 7)
- Invalid file types
- Corrupted CSV files
- Network errors (if applicable)

### Security Testing
- Cryptographic randomness validation
- Unbiased distribution verification
- Audit trail completeness
- Data integrity checks

## 📊 Coverage Goals

The project aims for:
- **80%+ branch coverage**
- **80%+ function coverage**
- **80%+ line coverage**
- **80%+ statement coverage**

### Current Coverage Areas

✅ **Fully Covered:**
- Draw logic and randomization
- CSV parsing and validation
- Component rendering and interactions
- File upload and processing
- Winner display and animations
- Report generation and download

✅ **Well Covered:**
- Error handling and edge cases
- User interactions and accessibility
- State management and transitions
- Integration workflows

## 🛠️ Test Utilities

### Helper Functions (`testHelpers.ts`)

- **Mock Setup**: Consistent mocking across tests
- **Test Data**: Predefined test participants and scenarios
- **Utility Functions**: File creation, async waiting, etc.
- **Assertion Helpers**: Accessibility and styling checks
- **Performance Utils**: Timing and performance testing

### Mock Data

```typescript
// Standard test participants
testData.participants // 10 participants

// Generated test data
testData.generateParticipants(100) // 100 participants

// Edge case scenarios
mockScenarios.edgeCases // Various edge cases
```

## 🐛 Debugging Tests

### Common Issues

1. **Async Operations**: Use `waitFor()` for async state changes
2. **File Uploads**: Mock FileReader and file input events
3. **Animations**: Use `vi.useFakeTimers()` for animation testing
4. **Crypto**: Mock `crypto.getRandomValues()` for deterministic tests

### Debug Commands

```bash
# Run specific test file
npm run test src/test/components/FileUpload.test.tsx

# Run tests with verbose output
npm run test -- --reporter=verbose

# Run tests matching pattern
npm run test -- --grep "FileUpload"
```

## 🚀 Continuous Integration

### GitHub Actions (Recommended)

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:run
      - run: npm run test:coverage
```

### Pre-commit Hooks

```bash
# Install husky for git hooks
npm install --save-dev husky

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run test:run"
```

## 📈 Performance Testing

### Load Testing
- Large participant lists (1000+ participants)
- Multiple simultaneous draws
- File upload performance
- Animation performance

### Memory Testing
- Memory leaks in component unmounting
- Large file handling
- Long-running test sessions

## 🔒 Security Testing

### Randomness Validation
- Cryptographic randomness verification
- Distribution bias testing
- Entropy source validation

### Data Integrity
- CSV parsing accuracy
- Winner selection integrity
- Audit trail completeness

## 📝 Writing New Tests

### Test Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ComponentName } from '@/components/ComponentName'

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup
  })

  it('should render correctly', () => {
    // Test implementation
  })
})
```

### Best Practices

1. **Descriptive Test Names**: Use clear, descriptive test names
2. **Single Responsibility**: Each test should test one thing
3. **Arrange-Act-Assert**: Structure tests clearly
4. **Mock External Dependencies**: Mock APIs, timers, etc.
5. **Test Edge Cases**: Include boundary conditions
6. **Accessibility Testing**: Verify ARIA attributes and keyboard navigation

## 🎉 Conclusion

The testing suite provides comprehensive coverage of the Contest Draw Platform, ensuring:
- **Reliability**: All core functionality is tested
- **Security**: Randomness and data integrity are verified
- **User Experience**: Component interactions and accessibility are validated
- **Maintainability**: Well-structured tests that are easy to understand and extend

Run `npm run test` to execute the full test suite and ensure your changes don't break existing functionality.
