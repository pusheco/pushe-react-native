import { NativeModules, NativeEventEmitter } from 'react-native';

const { RNPushe } = NativeModules;

const pusheEventEmitter = new NativeEventEmitter();

const EVENTS_TYPES = ["received", "clicked", "dismissed", "button_clicked", "custom_content_received"]

// key = events that user can attach handlers on them
// value = broadcast events that are emitted from the native 
// and are corrospond to the ones in (co.ronash.pushe.utils)
const _pusheEvents = new Map([
    [EVENTS_TYPES[0], "Pushe-NotificationReceived"],
    [EVENTS_TYPES[1], "Pushe-Clicked"],
    [EVENTS_TYPES[2], "Pushe-Dismissed"],
    [EVENTS_TYPES[3], "Pushe-ButtonClicked"],
    [EVENTS_TYPES[4], "Pushe-CustomContentReceived"],
]);

// store all broadcastListeners (actually their returned subscriptions) and their handlers in this object
const _broadcastListeners = {}; 

const _cachedNotification = new Map();
const _userEventHandlers = new Map();

function _attachEventBroadcasts(event, nativeBroadcastEvent) {
    return pusheEventEmitter.addListener(nativeBroadcastEvent, (notification) => {
        let userEventHandler = _userEventHandlers.get(event);

        // Check if user already set a handler 
        // for this event type then call it 
        // if not cache notification for later
        if (userEventHandler) {
            userEventHandler(notification);
        } else {
            _cachedNotification.set(event, notification);
        }
    });
}

// Start point for attaching nativeBrodcast events
if (RNPushe !== null) {
    _pusheEvents.forEach(function(nativeBroadcastEvent, event) {
        _broadcastListeners[event] = _attachEventBroadcasts(event, nativeBroadcastEvent);
    });
}

export default class Pushe {

    /**
     * Available events type to add listener on them
     */
    static EVENTS = {
        RECEIVED: EVENTS_TYPES[0],
        CLICKED: EVENTS_TYPES[1],
        DISMISSED: EVENTS_TYPES[2],
        BUTTON_CLICKED: EVENTS_TYPES[3],
        CUSTOM_CONTENT_RECEIVED: EVENTS_TYPES[4],
    }

    static addEventListener(eventType, eventHandler) {
        if (!eventHandler) return;

        // save user eventHandler 
        _userEventHandlers.set(eventType, eventHandler);

        // If already we have a cached notification for this eventType
        // call userEventHandler with this cached notification
        const cachedNotification = _cachedNotification.get(eventType);
        if (cachedNotification) {
            eventHandler(cachedNotification);
            _cachedNotification.delete(eventType);
        }
    }

    static removeEventListener(eventType) {
        _userEventHandlers.delete(eventType);
    }

    static clearListeners() {
        _pusheEvents.forEach((_value, key) => {
            pusheEventEmitter.removeAllListeners(_broadcastListeners[key]);
            _broadcastListeners.delete(key);
        });
    }

    /**
     * Initialize Pushe
     * 
     * @param {boolean} showGooglePlayDialog 
     */
    static initialize(showGooglePlayDialog = false) {
        RNPushe.initialize(showGooglePlayDialog);
    }

    /**
     * Check if Pushe is initialized or not
     * 
     * if call this method with no parameter
     * it would return promise of type boolean
     * 
     * @param {function?} callbackFunc - A callback function
     * @return {Promise<boolean>} Promise - if no parameter passed
     */
    static isPusheInitialized(callbackFunc) {
        if (callbackFunc) {
            return RNPushe.unsafe_isPusheInitialized(callbackFunc);
        }

        return RNPushe.isPusheInitialized();
    }

    /**
     * get user's pushe_id
     * 
     * if call this method with no parameter
     * it would return a promise.
     * 
     * @param {function?} callbackFunc - A callback function
     * @return {Promise<string>} Promise - if no callback passed
     */
    static getPusheId(callbackFunc) {
        if (callbackFunc) {
            return RNPushe.unsafe_getPusheId(callbackFunc);
        }

        return RNPushe.getPusheId();
    }

    /**
     * Subscribe a topic
     * 
     * @param {string} topicName 
     * @return void
     */
    static subscribeTopic(topicName) {
        RNPushe.subscribeTopic(topicName);
    }

    /**
     * Unsubscribe from a topic
     * 
     * @param {string} topicName 
     * @return void
     */
    static unsubscribeTopic(topicName) {
        RNPushe.unsubscribeTopic(topicName);
    }

    /**
     * Disable notification
     * 
     * @return void
     */
    static setNotificationOff() {
        RNPushe.setNotificationOff();
    }

    /**
     * Enable notification
     * 
     * @return void
     */
    static setNotificationOn() {
        RNPushe.setNotificationOn();
    }

    /**
     * Send a simple notification with only title and content
     * to another device with pusheId
     * 
     * @param {string} pusheId 
     * @param {string} title 
     * @param {string} content 
     * @return void
     */
    static sendSimpleNotifToUser(pusheId, title, content) {
        RNPushe.sendSimpleNotifToUser(pusheId, title, content);
    }

    /**
     * Send an advanced notification with a json object
     * to another device with pusheId
     * 
     * @param {string} pusheId 
     * @param {string} notificationJson - A json object
     * @return {Promise<boolean|Error>} Promise - A proimse that resolve to `true` or reject with `Exception`
     */
    static sendAdvancedNotifToUser(pusheId, notificationJson) {
        return RNPushe.sendAdvancedNotifToUser(pusheId, notificationJson);
    }

    /**
     * Send an custom notification with a json object
     * to another device with pusheId
     * 
     * @param {string} pusheId 
     * @param {string} notificationJson - A json object
     * @return {Promise<boolean|Error>} Promise - A proimse that resolve to `true` or reject with `Exception`
     */
    static sendCustomJsonToUser(pusheId, notificationJson) {
        return RNPushe.sendCustomJsonToUser(pusheId, notificationJson);
    }

    /**
     * Create a notification channel (only Android 8.0+)
     * 
     * @param {string} channelId 
     * @param {string} channelName 
     * @param {string} description 
     * @param {number<int>} importance 
     * @param {boolean} enableLight 
     * @param {boolean} enableVibration 
     * @param {bollean} showBadge 
     * @param {number<int>} ledColor 
     * @param {array} vibrationPattern 
     * @return void
     */
    static createNotificationChannel(...params) {
        RNPushe.createNotificationChannel(...params);
    }

    /**
     * Remove notification channel with channelId
     * 
     * @param {string} channelId 
     */
    static removeNotificationChannel(channelId) {
        RNPushe.removeNotificationChannel(channelId);
    }

};
