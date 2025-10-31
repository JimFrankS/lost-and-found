import Toast from "react-native-toast-message";

export function showSuccessToast(message: string) {
  Toast.show({
    type: "success",
    text1: "Success",
    text2: message,
    visibilityTime: 5000,
    autoHide: true,
    topOffset: 30,
    bottomOffset: 40,
  });
}

export function showErrorToast(message: string) {
  Toast.show({
    type: "error",
    text1: "Error",
    text2: message,
    visibilityTime: 5000,
    autoHide: true,
    topOffset: 30,
    bottomOffset: 40,
  });
}


