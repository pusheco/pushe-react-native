/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useEffect} from 'react';
import {StyleSheet, View, Button} from 'react-native';

import ScreenContainer from './ScreenContainer';
import Pushe from "pushe-react-native";

export default ({navigation}) => {
    const {navigate} = navigation;
    
    useEffect(() => {
      //
    }, []); 

  return (
    <>
      <ScreenContainer>
          <View style={styles.buttonWrapper}>
            <Button 
                title="Initialize & Register"
                color="#0065ff"
                onPress={() => navigate("InitReg")}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button 
                title="User Ids"
                color="#0065ff"
                onPress={() => navigate("UserIds")}
            />
          </View>
      </ScreenContainer>
    </>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
      marginTop: 5,
      paddingLeft: 5,
      paddingRight: 5,
  }
});
