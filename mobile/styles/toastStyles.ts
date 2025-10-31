import React from 'react';
import { Dimensions, View, Text } from "react-native";

export const toastConfig = {
  success: (props: any) => {
    const screenHeight = Dimensions.get('window').height;
    return React.createElement(View, {
      style: {
        height: screenHeight / 3,
        backgroundColor: 'rgba(76, 175, 80, 0.8)',
        borderRadius: 10,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
      }
    }, [
      React.createElement(Text, {
        key: 'title',
        style: { color: 'white', fontSize: 18, fontWeight: 'bold' }
      }, props.text1),
      React.createElement(Text, {
        key: 'message',
        style: { color: 'white', fontSize: 16, marginTop: 10 }
      }, props.text2)
    ]);
  },
  error: (props: any) => {
    const screenHeight = Dimensions.get('window').height;
    return React.createElement(View, {
      style: {
        height: screenHeight / 3,
        backgroundColor: 'rgba(244, 67, 54, 0.8)',
        borderRadius: 10,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
      }
    }, [
      React.createElement(Text, {
        key: 'title',
        style: { color: 'white', fontSize: 18, fontWeight: 'bold' }
      }, props.text1),
      React.createElement(Text, {
        key: 'message',
        style: { color: 'white', fontSize: 16, marginTop: 10 }
      }, props.text2)
    ]);
  },
};
