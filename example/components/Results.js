import React, {useContext} from "react";
import {StyleSheet, ScrollView} from "react-native";
import {AppContext} from "./AppProvider";
import ResultRow from "./ResultRow";

const Results = () => {
    const [appState, _] = useContext(AppContext);

    return (
        <ScrollView
            style={styles.container}
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{justifyContent: 'center'}}
        >
            {appState.map((item, idx) => 
                <ResultRow 
                    key={idx}
                    isEven={idx % 2 === 0}
                    label={item.label}
                    value={item.value}
                />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '50%',
    },
});

export default Results;
