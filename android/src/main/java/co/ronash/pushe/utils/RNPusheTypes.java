package co.ronash.pushe.utils;

public class RNPusheTypes {

    /**
     * These event types are equivalent to the types that are defined
     * in react native `index.js` file of pushe-react-native
     */
    public enum EVENTS_TYPES {
        RECEIVED("Pushe-NotificationReceived", "received"),
        CUSTOM_CONTENT_RECEIVED("Pushe-CustomContentReceived", "custom_content_received"),
        CLICKED("Pushe-Clicked", "clicked"),
        DISMISSED("Pushe-Dismissed", "dismissed"),
        BUTTON_CLICKED("Pushe-ButtonClicked", "button_clicked");


        String broadcastEvent;
        String event;

        EVENTS_TYPES(String broadcastEvent, String event) {
            this.broadcastEvent = broadcastEvent;
            this.event = event;
        }

        public String getBroadcast() {
            return this.broadcastEvent;
        }

        public String getEvent() {
            return this.event;
        }
    }

}
