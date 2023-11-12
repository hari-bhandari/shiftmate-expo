import AutoHeightWebView from 'react-native-autoheight-webview'
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Platform} from 'react-native'
import {useEffect, useRef, useState} from "react";

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {StatusBar} from 'react-native';
import {sendExpoPushToken} from "./utils/outgoingMessageHandlers";
import {handleIncomingMessage} from "./utils/incomingMessageHandlers";
import {URI} from "./constants/MessageTypes";


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});
const Home = () => {
    const webViewRef = useRef(null);
    const [darkMode, setDarkMode] = useState(true);

    const [expoPushToken, setExpoPushToken] = useState('');

    const onWebViewMessage = (event) => {
        try {
            const {type, data} = JSON.parse(event.nativeEvent.data);
            if(type&&data) {
                handleIncomingMessage(type, data);
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
        <SafeAreaProvider style={{backgroundColor: darkMode ? '#2f3248' : 'white'}}>
            <StatusBar
                barStyle={darkMode ? "light-content" : "dark-content"}
                backgroundColor={darkMode ? 'black' : "#ecf0f1"}
            />
            <AutoHeightWebView
                style={{
                    marginTop: 30,
                    marginBottom: 10,
                    backgroundColor: '#2f3248'
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
                ref={webViewRef} // Assign webview ref to the `webViewRef` while initial rendering
                userAgent="Mozilla/5.0 (Macintosh; Intel Mac OS X 13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
                cacheEnabled
                thirdPartyCookiesEnabled
                allowsProtectedMedia
                mediaPlaybackRequiresUserAction={false}
                onLoadEnd={sendMsgToPWA}

            />
        </SafeAreaProvider>
    );
};

export default Home;

async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "You've got mail! 📬",
            body: 'Here is the notification body',
            data: {data: 'goes here'},
        },
        trigger: {seconds: 2},
    });
}

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const {status: existingStatus} = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const {status} = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        // Learn more about projectId:
        // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
        token = (await Notifications.getExpoPushTokenAsync({projectId: 'f47e8b6f-988d-411f-ae05-07f00f2d4e0e'})).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}