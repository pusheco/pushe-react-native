
import { NativeModules, NativeEventEmitter, Platform, AppRegistry } from 'react-native';
import invariant from "invariant";

const { RNPushe } = NativeModules;

const PusheEventBroadcasts = [
    "Pushe-NotificationReceived",
    "Pushe-CustomContentReceived",
    "Pushe-Clicked",
    "Pushe-Dismissed",
    "Pushe-ButtonClicked",
];

function isInitilized() {
    return RNPushe !== null;
}

let PusheEventEmitter;
const _eventTypes = ["received", "custom_content_received", "clicked", "dismissed", "button_clicked"];
const _notificationBaseType = new Map();
const _handlerBaseType = new Map();
const _listeners = {};

function handleEventBroadcast(type, broadcast) {
    return PusheEventEmitter.addListener(broadcast, (notification) => {
        // If handler is set already call it with notification
        // else cache notification until handler is being set

        let handler = _handlerBaseType.get(type);
        if (handler) {
            handler(notification);
        } else {
            _notificationBaseType.set(type, notification);
        }
    });
}

if (isInitilized && Platform.OS === 'android') {
    PusheEventEmitter = new NativeEventEmitter(RNPushe);

    PusheEventBroadcasts.forEach((eventBroadcast, index) => {
        const event = _eventTypes[index];
        _listeners[event] = handleEventBroadcast(event, eventBroadcast);
    });
}

class Pushe {

    static events = {
        RECEIVED: _eventTypes[0],
        CUSTOM_CONTENT_RECEIVED: _eventTypes[1],
        CLICKED: _eventTypes[2],
        DISMISSED: _eventTypes[3],
        BUTTON_CLICKED: _eventTypes[4],
    }

    static addEventListener(type, handler) {
        if (!isInitilized) return;
        if (Platform.OS === 'ios') return;

        invariant(
            type !== Pushe.events.RECEIVED || type !== Pushe.events.CUSTOM_CONTENT_RECEIVED ||
            type !== Pushe.events.CLICKED  || type !== Pushe.events.DISMISSED || type !== Pushe.events.BUTTON_CLICKED,
            'Invalid event,only use one of `Pushe.events.RECEIVED`, `Pushe.events.CUSTOM_CONTENT_RECEIVED`, `Pushe.events.CLICKED`, `Pushe.events.DISMISSED`, `Pushe.events.BUTTON_CLICKED`',
        );

        _handlerBaseType.set(type, handler);

        // Check if already cached a notification for this event type
        const notificationCache = _notificationBaseType.get(type);
        if (handler && notificationCache) {
            handler(notificationCache);
            _notificationBaseType.delete(type);
        }
    }

    static removeEventListener(type, handler) {
        if (!isInitilized) return;
        if (Platform.OS === 'ios') return;

        invariant(
            type !== Pushe.events.RECEIVED || type !== Pushe.events.CUSTOM_CONTENT_RECEIVED ||
            type !== Pushe.events.CLICKED  || type !== Pushe.events.DISMISSED || type !== Pushe.events.BUTTON_CLICKED,
            'Invalid event,only use one of `Pushe.events.RECEIVED`, `Pushe.events.CUSTOM_CONTENT_RECEIVED`, `Pushe.events.CLICKED`, `Pushe.events.DISMISSED`, `Pushe.events.BUTTON_CLICKED`',
        );

        _handlerBaseType.delete(type);
    }

    static clearListeners() {
        if (!isInitilized) return;
        if (Platform.OS === 'ios') return;

        _eventTypes.forEach((type) => {
            _listeners[type].remove();
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
