import {INCOMING_MESSAGE_TYPES} from "../constants/MessageTypes";

export const handleIncomingMessage = (type, data,setFunctions) => {
    switch (type) {
        case INCOMING_MESSAGE_TYPES.IS_DARK_MODE:
            handleIsDarkMode(data,setFunctions);
            break;
        // Add more cases for other incoming message types
        default:
            console.log(data)
    }
};

const handleIsDarkMode = (data,setFunctions) => {
    console.log("isDarkMode:", data)
    // Logic for handling isDarkMode message
    setFunctions.setDarkMode(!!data);
};