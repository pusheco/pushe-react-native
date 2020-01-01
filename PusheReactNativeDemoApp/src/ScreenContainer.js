import React from "react";
import {StyleSheet, StatusBar, SafeAreaView, ScrollView} from "react-native";
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Header from "./Header";

export default ({children}) => {
    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
            <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
                {/* <Header /> */}
                {children}
            </ScrollView>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    scrollView: {
      backgroundColor: Colors.lighter,
      paddingTop: 10,
      paddingBottom: 10
    },
  });
  