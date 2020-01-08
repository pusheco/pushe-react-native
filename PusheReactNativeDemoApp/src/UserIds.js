import React, {useState} from "react";
import {View, TextInput, Button} from "react-native";
import ScreenContainer from "./ScreenContainer";

export default () => {
    const [state, updateState] = useState({
        email: '',
    });

    return (
        <ScreenContainer>
            <View>

            </View>
        </ScreenContainer>
    );
};