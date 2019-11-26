
import { NativeModules, NativeEventEmitter, AppRegistry } from 'react-native';
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

if (isInitilized) {
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

        invariant(
            type !== Pushe.events.RECEIVED || type !== Pushe.events.CUSTOM_CONTENT_RECEIVED ||
            type !== Pushe.events.CLICKED  || type !== Pushe.events.DISMISSED || type !== Pushe.events.BUTTON_CLICKED,
            'Invalid event,only use one of `Pushe.events.RECEIVED`, `Pushe.events.CUSTOM_CONTENT_RECEIVED`, `Pushe.events.CLICKED`, `Pushe.events.DISMISSED`, `Pushe.events.BUTTON_CLICKED`',
        );

        _handlerBaseType.delete(type);
    }

    static clearListeners() {
        if (!isInitilized) return;

        _eventTypes.forEach((type) => {
            _listeners[type].remove();
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
     * it will return promise of type boolean
     * 
     * @return {Promise<boolean>} Promise - if no parameter passed
     */
    static isPusheInitialized() {

        return RNPushe.isInitialized();
    }

    /**
     * Check if Pushe is registered or not
     * 
     * it will return promise of type boolean
     * 
     * @return {Promise<boolean>} Promise - if no parameter passed
     */
    static isPusheisRegistered() {

        return RNPushe.isRegistered();
    }
    /**
     * it will called when push registertion is completed
     */
    static onPusheRegisterationComplete()
    {
        return RNPushe.onRegisterationComplete();
    }
     /**
     * it will called when push initialization is completed
     */
    static onPusheInitializationComplete()
    {
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
        return RNPushe.getPusheId();
    }

    /**
     * get advertisingId
     * it will return a promise
     */
    static getGoogleAdvertisingId()
    {
        return RNPushe.getGoogleAdvertisingId();
    }
    /**
     * get androidId
     * it will return a promise
     */
    static getAndroidId()
    {
        return RNPushe.getAndroidId();
    }
    /**
     * set custom id
     * @param {string} id 
     * @returns promise
     */
    static setCustomId(id)
    {
        return RNPushe.setCustomId(id);
    }
    /**
     * get custom id
     */
    static getCustomId()
    {
        return RNPushe.getCustomId();
    }

    /**
     * set user email
     * @param {String} email 
     */
    static setUserEmail(email)
    {
        return RNPushe.setUserEmail(email);
    }
    /**
     * get user email
     */
    static getUserEmail()
    {
        return RNPushe.getUserEmail();
    }
    /**
     * set user phone number
     * @param {String} phone 
     */
    static setUserPhoneNumber(phone)
    {
        return RNPushe.setUserPhoneNumber(phone);
    }

    /**
     * get user phone number
     */
    static getUserPhoneNumber()
    {
        return RNPushe.getUserPhoneNumber();
    }

    /**
     * Subscribe a topic
     * 
     * @param {string} topicName 
     * @return void
     */
    static subscribeTopic(topicName) {
        return RNPushe.subscribeToTopic(topicName);
    }

    /**
     * Unsubscribe from a topic
     * 
     * @param {string} topicName 
     * @return void
     */
    static unsubscribeTopic(topicName) {
        return RNPushe.unsubscribe(topicName);
    }

    /**
     * get subscribed topics
     */
    static getSubscribedTopics()
    {
        return RNPushe.getSubscribedTopics();
    }

    /**
     * 
     * @param {object} tags - Object of key: string, value: string
     */
    static addTags(tags)
    {
        return RNPushe.addTags(tags);
    }

    /**
     * 
     * @param {list} list - a list of strings
     */
    static removeTags(list)
    {
        return RNPushe.removeTags(list);
    }


    static getSubscribedTags()
    {
        return RNPushe.getSubscribedTopics();
    }

    /**
     * Disable notification
     * 
     */
    static setNotificationOff() {
        return RNPushe.disableNotifications();
    }

    /**
     * Enable notification
     * 
     */
    static setNotificationOn() {
        return RNPushe.enableNotifications();
    }
    /**
     * Check weather notification is disabled or not
     */
    static isNotificationEnable()
    {
        return RNPushe.isNotificationEnable();
    }

    /**
     * enable custom sound
     */
    static enableCustomSound()
    {
        return RNPushe.enableCustomSound();
    }

    /**
     * disble custom sound
     */
    static disableCustomSound()
    {
        return RNPushe.disableCustomSound();
    }

    /**
     * Check weather custom sound is disbled or not
     */
    static isCustomSoundEnable()
    {
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
        return RNPushe.createNotificationChannel(...params);
    }

    /**
     * Remove notification channel with channelId
     * 
     * @param {string} channelId 
     */
    static removeNotificationChannel(channelId) {
        return RNPushe.removeNotificationChannel(channelId);
    }

    static sendEcommerceData(name,price)
    {
        return RNPushe.sendEcommerceData(name,price);
    }

    static sendEvent(name)
    {
        return RNPushe.sendEvent(name);
    }

    
}

export default Pushe;
