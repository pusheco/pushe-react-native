import Pushe from "pushe-react-native";

export function initializePushe() {
    Pushe.initialize(false);
}

export function setupPusheEventListeners(updateState) {
    // Attach Pushe event listeners
    // These methods only works when app is on foreground
    // Check documentation for events in background mode

    Pushe.addEventListener(Pushe.EVENTS.RECEIVED, (notificationData) => {
        const data = notificationData ? JSON.stringify(notificationData) : "";

        updateState("Event", `Notification Received \n ${data}`);
    });

    Pushe.addEventListener(Pushe.EVENTS.CLICKED, () => {
        updateState("Event", "Notification Clicked");
    });

    Pushe.addEventListener(Pushe.EVENTS.DISMISSED, () => {
        updateState("Event", "Notification Dismissed");
    });

    Pushe.addEventListener(Pushe.EVENTS.BUTTON_CLICKED, (notificationData) => {
        const data = notificationData ? JSON.stringify(notificationData) : "";

        updateState("Event", `Notification Button Clicked \n ${data}`);
    });

    Pushe.addEventListener(Pushe.EVENTS.CUSTOM_CONTENT_RECEIVED, (customContent) => {
        updateState("Event", `Notification Custom Content Received \n ${customContent}`);
    });
}

export function clearPusheEvents() {
    Pushe.clearListeners();
}