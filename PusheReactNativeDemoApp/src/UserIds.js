import React, {useState} from "react";
import {StyleSheet, View, TextInput, Text, Button} from "react-native";
import ScreenContainer from "./ScreenContainer";
import Pushe from "pushe-react-native";

export default () => {
    const [setMethodState, updateSetMethodState] = useState({
        email: {val: "", status: ""},
        phone: {val: "", status: ""},
        customId: {val: "", status: ""},
        androidId: {val: "", status: ""},
        googleAdId: {val: "", status: ""},
    });
    const [getMethodState, updateGetMethodState] = useState({email: ""});
    const commonProps = {setMethodState, updateSetMethodState, getMethodState, updateGetMethodState};

    return (
        <ScreenContainer>
            <View style={{paddingBottom: 30}}>
                <UserId 
                    methodName="setUserEmail"
                    getterName="getUserEmail"
                    fieldName="email"
                    placeholder="email"
                    {...commonProps}
                />
                <UserId 
                    methodName="setUserPhoneNumber"
                    getterName="getUserPhoneNumber"
                    fieldName="phone"
                    placeholder="phone number"
                    {...commonProps}
                />
                <UserId 
                    methodName="setCustomId"
                    getterName="getCustomId"
                    fieldName="customId"
                    placeholder="custom id"
                    {...commonProps}
                />
                <UserId 
                    onlyGetter={true}
                    getterName="getAndroidId"
                    fieldName="androidId"
                    placeholder="android id"
                    {...commonProps}
                />
                <UserId 
                    onlyGetter={true}
                    getterName="getGoogleAdvertisingId"
                    fieldName="googleAdId"
                    placeholder="google ad id"
                    {...commonProps}
                />
            </View>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    partTitles: {
        fontSize: 22,
    },
    textInput: { height: 40, borderColor: 'gray', borderWidth: 1, paddingHorizontal: 10, marginVertical: 5 },
})


const UserId = (props) => {
    const {onlyGetter, methodName, getterName, fieldName, placeholder,
        updateSetMethodState, updateGetMethodState, setMethodState, getMethodState
    } = props;

    return (
        <>
            {!onlyGetter && (
                <View style={styles.container}>
                <Text style={styles.partTitles}>{methodName}</Text>
                <TextInput 
                    style={styles.textInput} 
                    onChangeText={(text) => updateSetMethodState({...setMethodState, [fieldName]: {...setMethodState, val: text}})} 
                    value={setMethodState[fieldName].val} 
                    placeholder={placeholder}
                />
                <Button 
                    title={`Pushe.${methodName}`}
                    color="#0065ff"
                    onPress={() => {
                        if (!setMethodState[fieldName].val) return;

                        Pushe[methodName](setMethodState[fieldName].val)
                            .then(() => updateSetMethodState({...setMethodState, [fieldName]: {...setMethodState, status: true}}))
                            .catch(() =>  updateSetMethodState({...setMethodState, [fieldName]: {...setMethodState, status: false}}));
                    }}
                />
                    {!!setMethodState[fieldName].status && <Text>{`${methodName} set successfully`}</Text>}
                </View>
            )}
                

            <View style={styles.container}>
                <Text style={styles.partTitles}>{getterName}</Text>
                <Button 
                    title={`Pushe.${getterName}`}
                    color="#0065ff"
                    onPress={() => {
                        Pushe[getterName]()
                            .then((val) => updateGetMethodState({...getMethodState, [fieldName]: val}))
                            .catch((err) =>  updateGetMethodState({...getMethodState, [fieldName]: err}));
                    }}
                />
                {!!getMethodState[fieldName] && <Text>{getMethodState[fieldName]}</Text>}
            </View>
            </>
    );
}