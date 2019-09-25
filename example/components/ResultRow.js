import React from "react";
import {View, Text, StyleSheet} from "react-native"; 

const ResultRow = ({ label, value, isEven }) => {
    return (
        <View 
            style={isEven ? styles.rowEven : styles.rowOdd}
        >
            <Text style={styles.label}>
                {label}
            </Text>

            <Text style={styles.value}>
                {value}
            </Text>
        </View>
    );
}; 

const styles = StyleSheet.create({
    rowOdd: {
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#eeeeee99',
    },
    rowEven: {
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10
    },
    label: {
        color: '#000302',
        fontWeight: 'bold',
    },
    value: {
        color: '#000302',
        marginLeft: 10
    }
});

export default ResultRow;