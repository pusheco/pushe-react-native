import React, {useState, createContext} from "react";

// Our application context
export const AppContext = createContext();

// Use this component to provide react context
export const AppProvider = ({children}) => {

    const [appState, updateAppState] = useState([]);

    return (
        <AppContext.Provider value={[appState, updateAppState]}>
            {children}
        </AppContext.Provider>
    );
};
