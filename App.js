import React, {useEffect, useState} from 'react';
import {
  View,
  Button,
  Text,
  StyleSheet,
  ToastAndroid,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import RNOtpVerify from 'react-native-otp-verify-remastered';
import PushNotification from 'react-native-push-notification';

const App = () => {
  const [otp, setOtp] = useState('');
  const [inOtp, setInOtp] = useState('');
  const [hash, setHash] = useState('');

  const acceptOtp = () => {
    RNOtpVerify.getHash()
      .then(h => setHash(h))
      .catch(console.log);

    RNOtpVerify.getOtp()
      .then(RNOtpVerify.addListener(otpHandler))
      .catch(p => console.log(p));
  };

  useEffect(() => {
    createChannels();
  }, []);

  const createChannels = () => {
    PushNotification.createChannel({
      channelId: 'otp-channel',
      channelName: 'otp channel',
    });
  };
  const sendOtp = () => {
    PushNotification.localNotification({
      channelId: 'otp-channel',
      title: 'Device OTP',
      message: 'Your Device has been verified ',
    });
  };

  const success = () => {
    if (otp === inOtp) {
      ToastAndroid.show('Your device is verified!!!', 2500);
      sendOtp();
    } else {
      ToastAndroid.show('Incorrect OTP!!!', 2500);
    }
  };
  const otpHandler = message => {
    if (message) {
      const lotp = /(\d{4})/g.exec(message)[1];
      console.log(lotp);
      setOtp(lotp);
      setInOtp(lotp);
      RNOtpVerify.removeListener();
      Keyboard.dismiss();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.outer}>
          <Text style={styles.text}>Verify Your Device</Text>
          <OTPInputView
            style={styles.otpConatiner}
            pinCount={4}
            code={inOtp}
            onCodeChanged={val => setInOtp(val)}
            autoFocusOnLoad={false}
            codeInputFieldStyle={styles.inputField}
            codeInputHighlightStyle={styles.activeField}></OTPInputView>

          <TouchableWithoutFeedback
            onPress={() => {
              acceptOtp();
            }}>
            <Text style={styles.request}>Request for OTP</Text>
          </TouchableWithoutFeedback>

          <Button
            onPress={success}
            disabled={inOtp.length >= 4 ? false : true}
            color={'black'}
            title="Verify OTP"
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpConatiner: {
    height: 100,
    width: '80%',
    padding: 20,
  },
  outer: {
    padding: 20,
    elevation: 1,
    borderRadius: 5,
  },

  inputField: {
    width: 45,
    height: 45,
    color: '#000000',
    backgroundColor: 'whitesmoke',
  },

  activeField: {
    borderWidth: 2,
    borderColor: 'green',
  },
  text: {
    fontSize: 30,
    textAlign: 'center',
  },
  request: {
    fontSize: 17,
    marginVertical: 20,
  },
});
