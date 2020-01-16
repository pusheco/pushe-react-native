import React, {useState} from "react";
import {View, Text, Button} from "react-native";
import ScreenContainer from "./ScreenContainer";
import Pushe from "pushe-react-native";

export default () => {
    const [init, setInit] = useState({
        initialized: false,
        registered: false,
    });
    const [state, updateState] = useState({
        initialized: false,
        registered: false,
    });

    return (
        <ScreenContainer>
            <View>
                <Text style={{fontSize: 16, padding: 10}}>
                    * Check if pushe is already initialized in your app
                </Text>
                <View style={{padding: 5}}>
                    <Button
                        title="isPusheInitialized"
                        color="#0065ff"
                        onPress={() => {
                            setInit({
                                ...init,
                                initialized: true
                            });
                            Pushe.isInitialized().then((isInit) => {
                                updateState({
                                    ...state,
                                    initialized: isInit
                                });
                            });
                        }}
                    />
                </View>
                <View style={{padding: 10}}>
                    <Text>
                        {!init.initialized && 'Click above button to check init state'}
                        {init.initialized && state.initialized && 'Push is already initialized :)'}
                        {init.initialized && !state.initialized && 'Pushe is not initialized yet :('}
                    </Text>
                </View>
            </View>

            <View>
                <Text style={{fontSize: 16, padding: 10}}>
                    * Check if pushe is already registered in your app
                </Text>
                <View style={{padding: 5}}>
                    <Button
                        title="isPusheRegistered"
                        color="#0065ff"
                        onPress={() => {
                            setInit({
                                ...init,
                                registered: true,
                            });
                            Pushe.isRegistered().then((isReg) => {
                                updateState({
                                    ...state, 
                                    registered: isReg,
                                });
                            });
                        }}
                    />
                </View>
                <View style={{padding: 10}}>
                    <Text>
                        {!init.registered && 'Click above button to check registration state'}
                        {init.registered && state.registered && 'Push is already registered :)'}
                        {init.registered && !state.registered && 'Pushe is not registered yet :('}
                    </Text>
                </View>
            </View>
        </ScreenContainer>
    );
};