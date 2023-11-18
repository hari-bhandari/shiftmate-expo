import AutoHeightWebView from 'react-native-autoheight-webview'
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useEffect, useRef, useState} from "react";
import {StatusBar} from 'react-native';
import {handleIncomingMessage} from "./utils/incomingMessageHandlers";
import {OUTGOING_MESSAGE_TYPES, URI} from "./constants/MessageTypes";
import {PaperProvider} from 'react-native-paper';
import PermissionsDrawer from "./components/PermissionsDrawer";
import {Platform} from 'react-native';
import {sendOutgoingMessage} from "./utils/outgoingMessageHandlers";
import * as Device from "expo-device";


const Home = () => {
    const webViewRef = useRef(null);
    const [darkMode, setDarkMode] = useState(false);
    const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
    const [notificationToken, setNotificationToken] = useState(null);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const onWebViewMessage = (event) => {
        try {

            const {type, data} = JSON.parse(event.nativeEvent.data);
            if (type) {
                handleIncomingMessage(type, data, {
                    setDarkMode,
                    setIsUserLoggedIn
                });
            } else {
                console.log("Message from WebView:", event.nativeEvent.data);
            }
        } catch (error) {
            console.error("Error parsing message from WebView", error);

        }
    };

    const sendMsgToPWA = () => {
        if (notificationToken && webViewRef?.current&&isNotificationEnabled&&isUserLoggedIn) {
            sendOutgoingMessage(webViewRef, OUTGOING_MESSAGE_TYPES.EXPO_PUSH_TOKEN, JSON.stringify({
                notificationToken,
                deviceName: Device.modelName,
                deviceOS: Device.osName,
                deviceType: Device.deviceType,
            }));

        }
    };


    return (
        <PaperProvider>
            <SafeAreaProvider style={{backgroundColor: darkMode ? '#2f3248' : 'white'}}>
                <StatusBar
                    barStyle={darkMode ? "light-content" : "dark-content"}
                    backgroundColor={darkMode ? 'black' : "#ecf0f1"}
                />
                <AutoHeightWebView
                    style={{
                        marginTop: Platform.OS === 'android' ? 0 : 30,
                        marginBottom: Platform.OS === 'android' ? 0 : 10,
                        backgroundColor: darkMode ? '#2f3248' : 'white'
                    }}
                    source={{
                        uri: URI
                    }}
                    scalesPageToFit={true}
                    viewportContent={'width=device-width, user-scalable=no'}
                    geolocationEnabled={true}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    originWhitelist={['*']}
                    onMessage={onWebViewMessage}
                    allowFileAccess={true}
                    allowsInlineMediaPlayback={true}
                    mediaCapturePermissionGrantType={'grant'}
                    allowUniversalAccessFromFileURLs={true}
                    mixedContentMode={'always'}
                    useWebKit={true}
                    ref={webViewRef}
                    cacheEnabled
                    thirdPartyCookiesEnabled
                    allowsProtectedMedia
                    mediaPlaybackRequiresUserAction={false}
                    onLoadEnd={sendMsgToPWA}

                />
                <PermissionsDrawer webViewRef={webViewRef} isNotificationEnabled={isNotificationEnabled}
                                   setIsNotificationEnabled={setIsNotificationEnabled}
                                   notificationToken={notificationToken} setNotificationToken={setNotificationToken}
                />
            </SafeAreaProvider>
        </PaperProvider>
    );
};

export default Home;

