import AutoHeightWebView from 'react-native-autoheight-webview'
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useEffect, useRef, useState} from "react";
import {StatusBar} from 'react-native';
import {sendExpoPushToken} from "./utils/outgoingMessageHandlers";
import {handleIncomingMessage} from "./utils/incomingMessageHandlers";
import {URI} from "./constants/MessageTypes";
import { PaperProvider } from 'react-native-paper';
import PermissionsDrawer from "./components/PermissionsDrawer";
import { Platform } from 'react-native';


const Home = () => {
    const webViewRef = useRef(null);
    const [darkMode, setDarkMode] = useState(false);
    const [expoPushToken, setExpoPushToken] = useState('');

    const onWebViewMessage = (event) => {
        try {
            const {type, data} = JSON.parse(event.nativeEvent.data);
            if(type) {
                handleIncomingMessage(type, data,{
                    setDarkMode
                });
            }else{
                console.log("Message from WebView:", event.nativeEvent.data);
            }
        } catch (error) {
            console.error("Error parsing message from WebView", error);

        }
    };

    useEffect(() => {
        sendExpoPushToken(webViewRef, expoPushToken);
    }, [expoPushToken]);

    const sendMsgToPWA = () => {
        if (webViewRef?.current) {
            const message = {
                source: 'shiftmate',
                content: 'Message from Shiftmate!!'
            };
            webViewRef.current.postMessage(JSON.stringify(message));
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            sendMsgToPWA();
        }, 5000);
        return () => clearInterval(interval);
    }, []);


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
                onSizeUpdated={size => console.log(size.height)}
                source={{
                    uri:URI
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
            <PermissionsDrawer/>
        </SafeAreaProvider>
        </PaperProvider>
    );
};

export default Home;

