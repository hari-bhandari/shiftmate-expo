import {OUTGOING_MESSAGE_TYPES} from "../constants/MessageTypes";

export const sendOutgoingMessage = (webViewRef, type, data) => {
    if (webViewRef?.current) {
        const message = { source:'shiftmate',type, data };
        webViewRef.current.postMessage(JSON.stringify(message));
    }
};

// Example function to send an Expo Push Token
export const sendExpoPushToken = (webViewRef, token) => {
    sendOutgoingMessage(webViewRef, OUTGOING_MESSAGE_TYPES.EXPO_PUSH_TOKEN, token);
};