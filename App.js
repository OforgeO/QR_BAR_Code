import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import useCachedResources from './hooks/useCachedResources';
import { Root } from "native-base";
import { Router, Scene, Stack} from 'react-native-router-flux';
import Login from './screens/Login';
import Scan from './screens/Scan';
import Signup from './screens/Signup';
console.disableYellowBox = true;
export default function App(props) {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Root>
          <Router>    
            <Stack>
              <Scene key="login" component={Login} />
              <Scene key="scan" component={Scan} initial/>
              <Scene key="signup" component={Signup} />
            </Stack>
          </Router>
        </Root>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
