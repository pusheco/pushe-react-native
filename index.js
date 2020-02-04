
import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { RNPushe } = NativeModules;

let pusheEventEmitter = new NativeEventEmitter(RNPushe);

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
if (RNPushe !== null && Platform.OS === 'android') {
    _pusheEvents.forEach(function(nativeBroadcastEvent, event) {
        _broadcastListeners[event] = _attachEventBroadcasts(event, nativeBroadcastEvent);
    });
}


class Pushe {

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

    static ANDROID_ID_TYPES = {
        CUSTOM_ID: 'CUSTOM_ID',
        ANDROID_ID: 'ANDROID_ID',
        ADVERTISEMENT_ID: 'ADVERTISEMENT_ID'
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
     * Check if Pushe is initialized or not
     *
     * it will return promise of type boolean
     * 
     * @return {Promise<boolean>} Promise - if no parameter passed
     */
    static isInitialized() {
        if (Platform.OS === 'ios') return;
        return RNPushe.isInitialized();
    }

    /**
     * Check if Pushe is registered or not
     * 
     * it will return promise of type boolean
     * 
     * @return {Promise<boolean>} Promise - if no parameter passed
     */
    static isRegistered() {
        // if (Platform.OS === 'ios') return;
        return RNPushe.isRegistered();
    }
    /**
     * it will called when push registertion is completed
     */
    static onPusheRegisterationComplete() {
        if (Platform.OS === 'ios') return;
        return RNPushe.onRegisterationComplete();
    }
     /**
     * it will called when push initialization is completed
     */
    static onPusheInitializationComplete() {
        if (Platform.OS === 'ios') return;
        return RNPushe.onInitializationComplete();
    }

    /**
     * get user's pushe_id
     * 
     * it will return a promise.
     * 
     * @return {Promise<string>} Promise - if no callback passed
     */
    static getPusheId() {
        if (Platform.OS === 'ios') return;
        return RNPushe.getPusheId();
    }

    /**
     * get advertisingId
     * it will return a promise
     */
    static getGoogleAdvertisingId() {
        if (Platform.OS === 'ios') return;
        return RNPushe.getGoogleAdvertisingId();
    }
    /**
     * get androidId
     * it will return a promise
     */
    static getAndroidId() {
        if (Platform.OS === 'ios') return;
        return RNPushe.getAndroidId();
    }
    /**
     * set custom id
     * @param {string} id 
     * @returns promise
     */
    static setCustomId(id) {
        if (Platform.OS === 'ios') return;
        return RNPushe.setCustomId(id);
    }
    /**
     * get custom id
     */
    static getCustomId() {
        if (Platform.OS === 'ios') return;
        return RNPushe.getCustomId();
    }

    /**
     * set user email
     * @param {String} email 
     */
    static setUserEmail(email) {
        if (Platform.OS === 'ios') return;
        return RNPushe.setUserEmail(email);
    }
    /**
     * get user email
     */
    static getUserEmail() {
        if (Platform.OS === 'ios') return;
        return RNPushe.getUserEmail();
    }
    /**
     * set user phone number
     * @param {String} phone 
     */
    static setUserPhoneNumber(phone) {
        if (Platform.OS === 'ios') return;
        return RNPushe.setUserPhoneNumber(phone);
    }

    /**
     * get user phone number
     */
    static getUserPhoneNumber() {
        if (Platform.OS === 'ios') return;
        return RNPushe.getUserPhoneNumber();
    }

    /**
     * Subscribe a topic
     * 
     * @param {string} topicName 
     * @return void
     */
    static subscribeToTopic(topicName) {
        if (Platform.OS === 'ios') {
            return RNPushe.subscribe(topicName);
        } else {
            return RNPushe.subscribeToTopic(topicName);
        }
    }

    /**
     * Unsubscribe from a topic
     * 
     * @param {string} topicName 
     * @return void
     */
    static unsubscribeFromTopic(topicName) {
        if (Platform.OS === 'ios') {
            RNPushe.unsubscribe(topic)
        } else {
            return RNPushe.unsubscribeFromTopic(topicName);
        }
    }

    /**
     * get subscribed topics
     */
    static getSubscribedTopics() {
        if (Platform.OS === 'ios') return;
        return RNPushe.getSubscribedTopics();
    }

    /**
     * 
     * @param {object} tags - Object of key: string, value: string
     */
    static addTags(tags) {
        if (Platform.OS === 'ios') return;
        return RNPushe.addTags(tags);
    }

    /**
     * 
     * @param {list} list - a list of strings
     */
    static removeTags(list) {
        if (Platform.OS === 'ios') return;
        return RNPushe.removeTags(list);
    }


    static getSubscribedTags() {
        if (Platform.OS === 'ios') return;
        return RNPushe.getSubscribedTags();
    }

    /**
     * Disable notification
     * 
     */
    static disableNotifications() {
        if (Platform.OS === 'ios') return;
        return RNPushe.disableNotifications();
    }

    /**
     * Enable notification
     * 
     */
    static enableNotifications() {
        if (Platform.OS === 'ios') return;
        return RNPushe.enableNotifications();
    }
    /**
     * Check weather notification is disabled or not
     */
    static isNotificationEnable() {
        if (Platform.OS === 'ios') return;
        return RNPushe.isNotificationEnable();
    }

    /**
     * enable custom sound
     */
    static enableCustomSound() {
        if (Platform.OS === 'ios') return;
        return RNPushe.enableCustomSound();
    }

    /**
     * disble custom sound
     */
    static disableCustomSound() {
        if (Platform.OS === 'ios') return;
        return RNPushe.disableCustomSound();
    }

    /**
     * Check weather custom sound is disbled or not
     */
    static isCustomSoundEnable() {
        if (Platform.OS === 'ios') return;
        return RNPushe.isCustomSoundEnable();
    }

    /**
     * Send notification to another device
     */
    static sendNotificationToUser({type, userId, ...otherParams}) {
        if (Platform.OS === 'ios') return;
        if (!type || !userId) {
            return Promise.reject("Must specify `type` & `userId`");
        }
        if (!Pushe.ANDROID_ID_TYPES[type]) {
            return Promise.reject("Provide valid type from `Pushe.ANDROID_ID_TYPES`");
        }

        return RNPushe.sendNotificationToUser(type, userId, JSON.stringify(otherParams));
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
        if (Platform.OS === 'ios') return;
        return RNPushe.createNotificationChannel(...params);
    }

    /**
     * Remove notification channel with channelId
     * 
     * @param {string} channelId 
     */
    static removeNotificationChannel(channelId) {
        if (Platform.OS === 'ios') return;
        return RNPushe.removeNotificationChannel(channelId);
    }

    static sendEcommerceData(name,price) {
        if (Platform.OS === 'ios') return;
        return RNPushe.sendEcommerceData(name,price);
    }

    static sendEvent(name) {
        if (Platform.OS === 'ios') return;
        return RNPushe.sendEvent(name);
    }

    // iOS specific methods

    static getAPNsTokenAsString() {
        if (Platform.OS == 'android') return;
        return RNPushe.getAPNsTokenAsString()
    }

}

export default Pushe;
