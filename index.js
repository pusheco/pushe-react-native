
import { NativeModules, NativeEventEmitter, Platform, AppRegistry } from 'react-native';
import invariant from "invariant";

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
    static isPusheInitialized() {
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
    static isPusheRegistered() {
        if (Platform.OS === 'ios') return;
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
    static subscribeTopic(topicName) {
        if (Platform.OS === 'ios') return;
        return RNPushe.subscribeToTopic(topicName);
    }

    /**
     * Unsubscribe from a topic
     * 
     * @param {string} topicName 
     * @return void
     */
    static unsubscribeTopic(topicName) {
        if (Platform.OS === 'ios') return;
        return RNPushe.unsubscribe(topicName);
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
        return RNPushe.getSubscribedTopics();
    }

    /**
     * Disable notification
     * 
     */
    static setNotificationOff() {
        if (Platform.OS === 'ios') return;
        return RNPushe.disableNotifications();
    }

    /**
     * Enable notification
     * 
     */
    static setNotificationOn() {
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
     * Send a simple notification with only title and content
     * to another device with pusheId
     * @param {string} type 
     * @param {string} pusheId 
     * @param {string} title 
     * @param {string} content 
     * @return void
     */
    static sendSimpleNotifToUser(type,pusheId, title, content) {
        if (Platform.OS === 'ios') return;
        RNPushe.sendNotification(type,pusheId, title, content);
    }

    /**
     * Send an advanced notification with a json object
     * to another device with pusheId
     * 
     * @param {string} type
     * @param {string} pusheId 
     * @param {string} notificationJson - A json object
     * @return {Promise<boolean|Error>} Promise - A proimse that resolve to `true` or reject with `Exception`
     */
    static sendAdvancedNotifToUser(type,pusheId, notificationJson) {
        if (Platform.OS === 'ios') return;
        return RNPushe.sendAdvancedNotifToUser(type,pusheId, notificationJson);
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
        if (Platform.OS === 'ios') return;
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

    // iOS API

    static start(appId) {
        if (!isInitilized()) return;

        if (Platform.OS === 'ios') {
            RNPushe.start(appId)
        } else {
            console.log("This function is not implemented in android");
        }
    }

    static subscribe(topic) {
        if (!isInitilized()) return;

        if (Platform.OS === 'ios') {
            RNPushe.subscribe(topic)
        } else {
            console.log("This function is not implemented in android");
        }   
    }

    static unsubscribe(topic) {
        if (!isInitilized()) return;

        if (Platform.OS === 'ios') {
            RNPushe.unsubscribe(topic)
        } else {
            console.log("This function is not implemented in android");
        }   
    }
}

export default Pushe;
