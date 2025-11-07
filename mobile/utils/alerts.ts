import { Alert, Platform } from 'react-native';

// Extract a user-friendly message from a backend success response
export function extractSuccessMessage(response: any, fallback = 'Success') { 
  try {
    if (!response) return fallback;
    // Axios response shape: { data, status, ... }
    const data = response?.data ?? response;
    if (typeof data === 'string') return data;
    if (typeof data?.message === 'string' && data.message.trim().length > 0) return data.message;
    if (typeof data?.successMessage === 'string' && data.successMessage.trim().length > 0) return data.successMessage;
    return fallback;
  } catch {
    return fallback;
  }
}

// Extract a user-friendly message from an Axios error or generic error
export function extractErrorMessage(error: any, fallback = 'An unexpected error occurred') {
  try {
    // Axios error -> prefer response data
    const data = error?.response?.data;
    if (typeof data === 'string' && data.trim().length > 0) return data;
    if (typeof data?.message === 'string' && data.message.trim().length > 0) return data.message;
    if (typeof data?.error === 'string' && data.error.trim().length > 0) return data.error;
    // Timeout custom message handled upstream
    if (typeof error?.message === 'string' && error.message.trim().length > 0) return error.message;
    return fallback;
  } catch {
    return fallback;
  }
}

// Show a platform-appropriate alert (RN Alert on native, window.alert on web)
export function showAlert(title: string, message: string) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.alert(`${title}: ${message}`);
  } else {
    Alert.alert(title, message);
  }
}

export function showSuccess(message: string) {
  showAlert('Success', message);
}

export function showError(message: string) {
  showAlert('Error', message);
}


// I created this function to handle alerts in a way that works for both web and native platforms. Specifially, for handling the cancel alert in the reportBaggageModal.tsx component.
export function showAlerts(title: string, message: string, buttons?: any[]) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    if (buttons && buttons.length > 0) {
      // Use window.confirm for confirmation dialogs (OK = Yes/destructive, Cancel = No)
      const confirmed = window.confirm(`${title}: ${message}`);
      if (confirmed) {
        // OK clicked, call the "Yes" button's onPress
        if (buttons[1]?.onPress) buttons[1].onPress();
      } else if (buttons[0]?.onPress) {
        buttons[0].onPress();
      } 
    } else {
      // No buttons, use alert
      window.alert(`${title}: ${message}`);
    }
  } else if (buttons && buttons.length > 0) {
    // Native: map buttons to Cancel (non-destructive) and OK (destructive)
    const nativeButtons = [
      { text: "Cancel", onPress: buttons[0]?.onPress },
      { text: "OK", onPress: buttons[1]?.onPress }
    ];
    Alert.alert(title, message, nativeButtons);
  } else {
    Alert.alert(title, message);
  }
}
