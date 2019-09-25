import React, {useState} from "react";
import {View, Modal, Text, TextInput, StyleSheet, TouchableOpacity} from "react-native";
import {COLORS} from "../constants";

const CustomModal = ({ visible, onSubmit, onModalClose, placeholder }) => {
    const [value, setValue] = useState("");

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onModalClose}
        >
            <View style={styles.modalWrapper}
            >
                <View style={styles.modalBody}
                >
                    <TextInput 
                        style={styles.textInput}
                        autoFocus={true}
                        value={value}
                        onChangeText={val => setValue(val)}
                        placeholder={placeholder}
                    />

                    <View style={styles.buttonsWrapper}>
                        <TouchableOpacity style={styles.buttonClose} onPress={() => {
                            setValue("");
                            onModalClose();
                        }}>
                            <Text style={styles.buttonText}>Close Modal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonSubmit} onPress={() => {
                            setValue("");
                            if (value) onSubmit(value);
                        }}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalWrapper: {
        flex: 1,
        width: '100%',
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBody: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 5,
        padding: 20,
        width: '90%',
        minHeight: 100
    },
    buttonsWrapper: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        marginTop: 10,
    }, 
    buttonClose: {
        alignItems: 'center',
        backgroundColor: COLORS.BLUE,
        padding: 10,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 2,
        flex: 1,
        margin: 2,
    },
    buttonSubmit: {
        alignItems: 'center',
        backgroundColor: COLORS.GREEN,
        padding: 10,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 2,
        flex: 1,
        margin: 2,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold'
    },
    textInput: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        height: 40,
        paddingLeft: 10,
        paddingRight: 10,
    },
});

export default CustomModal;