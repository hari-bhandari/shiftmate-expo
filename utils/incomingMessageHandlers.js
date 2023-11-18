import {INCOMING_MESSAGE_TYPES} from "../constants/MessageTypes";

export const handleIncomingMessage = (type, data,setFunctions) => {
    switch (type) {
        case INCOMING_MESSAGE_TYPES.IS_DARK_MODE:
            handleIsDarkMode(data,setFunctions);
            break;
        case INCOMING_MESSAGE_TYPES.IS_USER_LOGGED_IN:
            handleIsUserLoggedIn(data,setFunctions);
            break;
        default:
            console.log(data)
    }
};

const handleIsDarkMode = (data,setFunctions) => {
    console.log("isDarkMode:", data)
    // Logic for handling isDarkMode message
    setFunctions.setDarkMode(!!data);
};

const handleIsUserLoggedIn = (data,setFunctions) => {
    // Logic for handling isUserLoggedIn message
    setFunctions.setIsUserLoggedIn(data==="true");
}