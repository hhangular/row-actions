# Release Notes

## 2.0.4

### Improvements
- **Improved animation** - Replaced `scaleX` animation with `clip-path` for smoother reveal effect without content distortion
- **Code quality** - Migrated to Angular signals (`input()`), added `DestroyRef` for proper cleanup, improved typing

### Testing
- **Unit tests** - Added comprehensive test suite with 23 tests covering:
  - Row-actions display on hover
  - Position detection (left/right)
  - Vertical and horizontal alignment
  - Mouse interactions
  - Multiple rows behavior
  - Content projection
- **CI/CD** - Tests integrated in GitHub Actions workflow with coverage reports
- **Coverage** - 94%+ statement coverage

---

## 2.0.3

### New Features
- **Live Demo** - Interactive demo page deployed on GitHub Pages at [hhangular.github.io/row-actions](https://hhangular.github.io/row-actions/)
- Demo includes real-time configuration options (color, disabled state)
- Dynamic code preview with syntax highlighting

### Improvements
- Updated to Angular 18
- Standalone component ready for modern Angular applications

---

## 2.0.1

### Improvements
- Added compatibility with Angular 17+

---

## 1.18.4

### Improvements
- Added compatibility with Angular 17

---

## 1.18.3

### New Features
- Added `disabled` input to hide the component completely

---

## Previous Versions

For older releases, see the [commit history](https://github.com/hhangular/row-actions/commits/main).
