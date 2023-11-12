import {INCOMING_MESSAGE_TYPES} from "../constants/MessageTypes";

export const handleIncomingMessage = (type, data) => {
    switch (type) {
        case INCOMING_MESSAGE_TYPES.IS_DARK_MODE:
            handleIsDarkMode(data);
            break;
        // Add more cases for other incoming message types
        default:
            console.log(data)
    }
};

const handleIsDarkMode = (data) => {
    // Logic for handling isDarkMode message
    console.log("Dark Mode Status:", data);
};