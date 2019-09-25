import React, {useContext, useState, useEffect} from "react";
import {View, Text, StyleSheet} from "react-native";
import {AppContext} from "./AppProvider";
import {setupPusheEventListeners, clearPusheEvents} from "../startup";
import packageJson from "pushe-react-native/package.json";
import {COLORS} from "../constants";

export default () => {
    /*
     * We want to update the AppContext when events from 
     * native app emitted cached, but we can't directly pass
     * `updateAppState` from AppContext to the eventHandlers
     * (Do no work this way)
     * as the result we use inner state of the component to 
     * save value of the event handler callback and check it
     * with `useEffect` and then save it in AppContext
     */

    const [appState, updateAppState] = useContext(AppContext);

    // inner state of component
    const [state, setState] = useState(appState);

    // When handler of any event called setState
    // Then we update the AppContext with (updateAppState)
    useEffect(() => {
        updateAppState([
            {label: state.label, value: state.value},
            ...appState,
        ]);
    }, [state]);

    useEffect(() => {
        // Because we need AppProvider to update states
        // we attach pushe events here in this component
        // but it could be anywhere as long as it is top level and not changes a lot
        setupPusheEventListeners((label, value) => setState({label, value}));
  
        // clear pushe event listeners on unmounting
        return clearPusheEvents;
    }, []);

    return (
        <View style={styles.container}>
        <Text style={styles.bigTitle}>PUSHE SAMPLE</Text>
        <View style={styles.subHeaderContainer}>
            <Text style={styles.text}> plugin version: {packageJson.version}</Text>
            <Text style={styles.text}>  - </Text>
            <Text style={styles.text}> native sdk version: {packageJson.native_sdk_version}</Text>
        </View>
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 40,
        padding: 10,
        backgroundColor: COLORS.BLUE,
    },
    bigTitle: {
        color: '#ffffff', 
        fontWeight: 'bold'
    },
    subHeaderContainer: {
        flexDirection: 'row',
    },
    text: {
        color: '#ffffff', 
        fontWeight: '500'
    }
});