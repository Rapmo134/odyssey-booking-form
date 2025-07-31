# Alert System Documentation

## Overview

The application now uses a modern, responsive alert system with different types of notifications for better user experience.

## Alert Types

### 1. Success Alerts (`'success'`)
- **Color**: Green
- **Icon**: CheckCircle
- **Use Cases**: 
  - Successful operations (agent found, voucher applied, payment success)
  - Confirmation messages
  - Positive feedback

### 2. Error Alerts (`'error'`)
- **Color**: Red
- **Icon**: AlertCircle
- **Use Cases**:
  - Validation errors
  - Payment failures
  - Network errors
  - Server errors
  - Booking failures

### 3. Warning Alerts (`'warning'`)
- **Color**: Yellow
- **Icon**: AlertTriangle
- **Use Cases**:
  - Agent not found (normal case)
  - Missing participant names
  - Draft bookings exist
  - Input validation warnings

### 4. Info Alerts (`'info'`)
- **Color**: Blue
- **Icon**: Info
- **Use Cases**:
  - General information
  - Default alert type

## Usage

### Basic Usage
```typescript
// Default info alert
showAlert('This is an info message');

// Success alert
showAlert('Operation completed successfully!', 'success');

// Error alert
showAlert('Something went wrong', 'error');

// Warning alert
showAlert('Please check your input', 'warning');
```

### Function Signature
```typescript
function showAlert(
  msg: string, 
  type: 'success' | 'error' | 'warning' | 'info' = 'info'
): void
```

## Features

### 1. Auto-dismiss
- Alerts automatically disappear after 4 seconds
- Users can manually close alerts by clicking the X button

### 2. Multiple Alerts
- Multiple alerts can be displayed simultaneously
- Each alert has a unique ID for proper management
- Alerts stack vertically with slight offset

### 3. Smooth Animations
- Slide-in animation from right
- Fade-out animation when dismissed
- Smooth transitions between states

### 4. Responsive Design
- Alerts are positioned at bottom-right corner
- Maximum width to prevent overflow
- Mobile-friendly design

### 5. Accessibility
- Proper contrast ratios
- Clear icons for different alert types
- Keyboard accessible close button

## Component Structure

### AlertToast Component
```typescript
interface AlertToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}
```

### AlertContainer Component
```typescript
interface AlertContainerProps {
  alerts: Array<{
    id: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
  }>;
  onRemove: (id: string) => void;
}
```

## Styling

### Color Scheme
- **Success**: Green (bg-green-50, border-green-200, text-green-800)
- **Error**: Red (bg-red-50, border-red-200, text-red-800)
- **Warning**: Yellow (bg-yellow-50, border-yellow-200, text-yellow-800)
- **Info**: Blue (bg-blue-50, border-blue-200, text-blue-800)

### Positioning
- Fixed position at bottom-right
- Z-index: 50 (above other content)
- Maximum width: 384px (max-w-sm)

### Animations
- Transform transitions for slide effects
- Opacity transitions for fade effects
- Duration: 300ms for smooth experience

## Best Practices

### 1. Alert Type Selection
- Use `success` for positive outcomes
- Use `error` for actual errors that prevent action
- Use `warning` for issues that can be resolved
- Use `info` for general information

### 2. Message Content
- Keep messages concise and clear
- Use action-oriented language
- Provide specific guidance when possible

### 3. Timing
- Don't show too many alerts at once
- Consider user flow when timing alerts
- Use appropriate duration for message importance

### 4. Error Handling
- Always provide meaningful error messages
- Include recovery suggestions when possible
- Log errors for debugging

## Examples

### Agent Operations
```typescript
// Success
showAlert(`Agent ${agent.name} found successfully!`, 'success');

// Warning (agent not found is normal)
showAlert(`Agent with code "${code}" not found. Please check the code and try again.`, 'warning');

// Error
showAlert('Unable to fetch agent data. Please try again later.', 'error');
```

### Payment Operations
```typescript
// Success
showAlert('Payment completed successfully!', 'success');

// Error
showAlert('Payment failed. Please try again.', 'error');

// Warning
showAlert('Payment is being processed. Please wait.', 'warning');
```

### Validation
```typescript
// Error
showAlert('Please complete all required fields.', 'error');

// Warning
showAlert('Please fill in the name for participants: John, Jane', 'warning');
```

## Migration from Old System

The old alert system used simple yellow alerts for all messages. The new system provides:

1. **Better Visual Hierarchy**: Different colors for different types
2. **Improved UX**: Icons and better styling
3. **Better Accessibility**: Proper contrast and keyboard support
4. **More Information**: Users can quickly understand alert importance
5. **Consistent Design**: Matches modern UI patterns 