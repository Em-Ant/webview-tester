import React, { useState, useEffect, useRef } from 'react';
import {
  TouchableOpacity as Button,
  Text,
  View,
  StyleSheet,
  TextInput,
  BackHandler
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { WebView } from 'react-native-webview';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function Home({ navigation }) {
  const [url, setUrl] = useState('https://emant.altervista.org');
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={text => setUrl(text)}
        value={url}
      />
      <Button
        onPress={() => _handleOpenWithWebBrowser(url)}
        style={styles.button}
      >
        <Text>BroweserView</Text>
      </Button>
      <Button
        style={styles.button}
        onPress={() => navigation.navigate('WebView', { url })}
      >
        <Text>WebView</Text>
      </Button>
    </View>
  );
}

const _handleOpenWithWebBrowser = uri => {
  WebBrowser.openBrowserAsync(uri, {
    enableBarCollapsing: true
  });
};

function WebV({ route, navigation }) {
  const uri = route.params.url;
  const refWeb = useRef<WebView>(null);
  const refState = useRef<boolean>(null);
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);
  const handleBackPress = () => {
    if (refState.current) {
      refWeb.current.goBack();
    } else {
      navigation.goBack(null);
    }
    return true;
  };
  return (
    <WebView
      ref={refWeb}
      onNavigationStateChange={n => {
        refState.current = n.canGoBack;
      }}
      source={{ uri }}
    />
  );
}

function StackTest() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="WebView"
          component={WebV}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#b8e994',
    padding: 10,
    minWidth: 200,
    margin: 8
  },
  input: {
    padding: 8,
    margin: 16,
    width: 250,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 18,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc'
  }
});

export default StackTest;
