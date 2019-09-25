import React, {useState, useContext} from "react";
import {View, StyleSheet, ScrollView} from "react-native";
import Pushe from "pushe-react-native";
import {AppContext} from "./AppProvider";
import CustomModal from "./CustomModal";
import Button from "./Button";
import {COLORS} from "../constants";

const Body = (props) => {
    const [modal, updateModal] = useState({
        visible: false,
        placeholder: "",
        callback: () => {},
    });

    const [appState, updateAppState] = useContext(AppContext);

    /*
     * Start Pushe callbacks
     */

    function updateState(label, value) {
        updateAppState([
            {label, value},
            ...appState,
        ]);
    }

    const isPusheInitialized = () => {
        Pushe.isPusheInitialized()
            .then(resp => {
                updateState("isPusheInitialized", resp.toString());
            });
    }

    const getPusheId = () => {
        Pushe.getPusheId()
            .then(resp => {
                updateState("PusheId", resp)
            });
    }

    const subscribeTopic = (topicName) => {
        Pushe.isPusheInitialized().then(resp => {
            if (resp) {
                Pushe.subscribeTopic(topicName);

                return updateState("Try subscribing to ", topicName);
            }

            updateState(`Cannot subscribe to "${topicName}", Pushe is not initialized yet.`, "");
        });  
    };

    const unsubscribeTopic = (topicName) => {
        Pushe.isPusheInitialized().then(resp => {
            if (resp) {
                Pushe.unsubscribeTopic(topicName);

                return updateState("Try unsubscribing from ", topicName);
            }

            updateState(`Cannot unsubscribe from "${topicName}", Pushe is not initialized yet.`, "");
        });  
    };

    const setNotificationOff = () => {
        Pushe.setNotificationOff();

        updateState("Turn off notification", "");
    };

    const setNotificationOn = () => {
        Pushe.setNotificationOn();

        updateState("Turn on notification", "");
    };

    const sendSimpleNotifToUser = (pusheId) => {
        Pushe.isPusheInitialized().then(resp => {
            if (resp) {
                Pushe.sendSimpleNotifToUser(pusheId, "Test Notification", "Hi there, this is just a test notification");

                return updateState(`Send a test notification to ${pusheId}`, "");
            }

            updateState("Cannot send notification, Pushe is not initialized yet", "");
        });
    };

    const sendAdvancedNotifToUser = (pusheId) => {
        Pushe.isPusheInitialized().then(resp => {
            if (resp) {
                Pushe.sendAdvancedNotifToUser(pusheId, JSON.stringify({ title: "Test Notification", content: "Hi there, this is an advanced test notification"}))
                    .then(() => {
                        updateState(`Send an advanced test notification to ${pusheId}`, "");
                    })
                    .catch((err) => {
                        updateState(`Cannot send advanced notifciation to ${pusheId}, ${err}`);
                    });
                    
                return;
            }

            updateState("Cannot send advanced notification, Pushe is not initialized yet", "");
        });
    };

    return (
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.container}
          contentContainerStyle={{
            justifyContent: 'center',
          }}  
        >
            <View style={{paddingBottom: 20}}>

                <Button 
                    buttonLabel={`Is initialized?`}
                    onPress={isPusheInitialized}
                />

                <Button 
                    buttonLabel={`Get Pushe Id`}
                    onPress={getPusheId}
                />

                <Button 
                    buttonLabel={`Subscribe to topic`}
                    onPress={() => updateModal({
                        visible: true,
                        placeholder: `Enter a topic name`,
                        callback: subscribeTopic,
                    })}
                />

                <Button 
                    buttonLabel={`Unsubscribe from a topic`}
                    onPress={() => updateModal({
                        visible: true,
                        placeholder: `Enter a topic name`,
                        callback: unsubscribeTopic,
                    })}
                />

                <Button 
                    buttonLabel={`Set notification off`}
                    onPress={setNotificationOff}
                />

                <Button 
                    buttonLabel={`Set notification on`}
                    onPress={setNotificationOn}
                />

                <Button 
                    buttonLabel={`Send a simple notification`}
                    onPress={() => updateModal({
                        visible: true,
                        placeholder: `Enter a pushe id`,
                        callback: sendSimpleNotifToUser,
                    })}
                />

                <Button 
                    buttonLabel={`Send an advanced notification`}
                    onPress={() => updateModal({
                        visible: true,
                        placeholder: `Enter a pushe id`,
                        callback: sendAdvancedNotifToUser,
                    })}
                />

                <CustomModal 
                    visible={modal.visible}
                    placeholder={modal.placeholder}
                    onModalClose={() => updateModal({
                        visible: false,
                        placeholder: "",
                        callback: () => {},
                    })}
                    onSubmit={(value) => {
                        modal.callback(value);
                        updateModal({
                            visible: false,
                            placeholder: "",
                            callback: () => {},
                        });
                    }}
                />
            </View>
        </ScrollView>
    );
}

export default Body;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '50%',
        display: 'flex',
        marginRight: 'auto',
        marginLeft: 'auto',
        paddingTop: 10,
        paddingBottom: 40,
        paddingLeft: '5%',
        paddingRight: '5%',
        backgroundColor: COLORS.GREEN,
    },
});