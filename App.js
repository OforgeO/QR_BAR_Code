/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar } from 'react-native';
import { Root } from "native-base";
import { Router, Scene, Stack} from 'react-native-router-flux';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import Login from './app/screens/Login';
import Scan from './app/screens/Scan';
import Signup from './app/screens/Signup';
import Settings from './app/screens/Settings';
import Barcode from './app/screens/BarCode';
class App extends React.Component {

  constructor() {
    super();
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Root>
          <Router>    
            <Stack>
              <Scene key="login" component={Login} initial/>
              <Scene key="scan" component={Scan} />
              <Scene key="signup" component={Signup} />
              <Scene key="settings" component={Settings} />
              <Scene key="barcode" component={Barcode} />
            </Stack>
          </Router>
        </Root>
      </View>
    );
  }
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
