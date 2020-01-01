import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default () => {
  return (
    <View style={styles.container}>
      <Text>PUSHE REACT NATIVE</Text>
    </View>
  );
};
