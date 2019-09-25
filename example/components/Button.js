import React from "react";
import {TouchableOpacity, StyleSheet, Text} from "react-native";
import {COLORS} from "../constants";

const Button = ({ buttonLabel, onPress }) => {
    return (
        <TouchableOpacity 
            style={styles.button} 
            onPress={onPress}
        >
            <Text style={styles.buttonText}>
                {buttonLabel}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: COLORS.BLUE,
        padding: 10,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 8,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold'
    }
});

export default Button;
