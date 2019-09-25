import React, {Fragment, useState, useEffect} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {AppProvider} from './components/AppProvider';
import Header from './components/Header';
import Body from './components/Body';
import Results from './components/Results';
import {initializePushe} from "./startup";
import {COLORS} from "./constants";

const App = () => {

  useEffect(() => {
    initializePushe();
  }, []);

  return (
    <Fragment>
      <StatusBar backgroundColor={COLORS.BLUE} barStyle="light-content" />
      <SafeAreaView>
        <AppProvider>
          <Header />
          <Body />
          <Results />
        </AppProvider>
      </SafeAreaView>
    </Fragment>
  );
}

export default App;
