import AutoHeightWebView from 'react-native-autoheight-webview'
import { Camera, CameraType } from 'expo-camera';

import { Dimensions } from 'react-native'
import {useRef, useState} from "react";
const Home = () => {
    const webViewRef = useRef(null);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [type, setType] = useState(CameraType.back);
    // request for permission
    const getPermissionAsync = async () => {
        if (permission.status !== 'granted') {
            const { status } = await Camera.requestCameraPermissionsAsync();
            await requestPermission()


        }
    };

    // call the function
    getPermissionAsync();


    /**
     * @function handleMessage
     * @param {String} message
     * @description this is the message from React PWA. Handle it here
     */
    const handleMessage = (message = null) => {
        // alert(JSON.stringify(message?.nativeEvent?.data));
    };

    /**
     * @function sendMsgToPWA
     * @description send any msg from React native app to PWA web
     * @description this method will also be fired when the web view loaded succesfully - did mount 1st time - onLoad prop in <Webview>
     */
    const sendMsgToPWA = () => {
        if (webViewRef?.current) {
            webViewRef?.current?.postMessage("Hi to React - from React native");
        }
    };
    const uri= 'https://shiftmate-phi.vercel.app';

    return (
        <AutoHeightWebView
            style={{ width: Dimensions.get('window').width - 15, marginTop: 35 }}
            customScript={`localStorage.setItem('yourKey', 'true');`}

            onSizeUpdated={size => console.log(size.height)}

            source={{
                uri

            }}            scalesPageToFit={true}
            viewportContent={'width=device-width, user-scalable=no'}
            geolocationEnabled={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            originWhitelist={['*']}
            onMessage={handleMessage}
            allowFileAccess={true}
            allowsInlineMediaPlayback={true}
            mediaCapturePermissionGrantType={'grant'}
            allowUniversalAccessFromFileURLs={true}
            mixedContentMode={'always'}
            useWebKit={true}
        />
    );
};

export default Home;