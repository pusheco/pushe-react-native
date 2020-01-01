/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React from "react";
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Home from "./Home";
import BasicApi from "./BasicApi";
import UserIds from "./UserIds";

const MainNavigator = createStackNavigator(
  {
    Home: {screen: Home, navigationOptions: {title: 'Pushe React Native'}},
    InitReg: {screen: BasicApi, navigationOptions: {title: 'Initialize & Register'}},
    UserIds: {screen: UserIds, navigationOptions: {title: 'User Ids'}},
  },
  {
    initialRouteName: 'Home'
  }
);


const AppContainer = createAppContainer(MainNavigator);

export default () => {
  return (
    <AppContainer />
  )
}
