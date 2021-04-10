
import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { RNPushe } = NativeModules;

let pusheEventEmitter = new NativeEventEmitter(RNPushe);

const EVENTS_TYPES = [
    // Notification
    "received",
    "clicked", 
    "dismissed",
    "button_clicked",
    "custom_content_received",
    // InAppMessaging
    "piam_received",
    "piam_triggered",
    "piam_clicked",
    "piam_dismissed",
    "piam_button",
]

// key = events that user can attach handlers on them
// value = broadcast events that are emitted from the native 
// and are corrospond to the ones in (co.pushe.plus.utils)
const _pusheEvents = new Map([
    // Notification
    [EVENTS_TYPES[0], "Pushe-NotificationReceived"],
    [EVENTS_TYPES[1], "Pushe-Clicked"],
    [EVENTS_TYPES[2], "Pushe-Dismissed"],
    [EVENTS_TYPES[3], "Pushe-ButtonClicked"],
    [EVENTS_TYPES[4], "Pushe-CustomContentReceived"],
    // InAppMessaging
    [EVENTS_TYPES[5], "Pushe-InAppReceived"],
    [EVENTS_TYPES[6], "Pushe-InAppTriggered"],
    [EVENTS_TYPES[7], "Pushe-InAppClicked"],
    [EVENTS_TYPES[8], "Pushe-InAppDismissed"],
    [EVENTS_TYPES[9], "Pushe-InAppButtonClicked"],
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
        // InAppMessaging
        INAPP_RECEIVED: EVENTS_TYPES[5],
        INAPP_TRIGGERED: EVENTS_TYPES[6],
        INAPP_CLICKED: EVENTS_TYPES[7],
        INAPP_DISMISSED: EVENTS_TYPES[8],
        INAPP_BUTTON_CLICKED: EVENTS_TYPES[9],
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
     * for android:
     * Only for apps that activate GDPR feature.
     * Calling this means user gave consent due to GDPR rule and Pushe is allowed to work.
     * (Calling this only once, is enough)
     * 
     * <b>By default this code is not needed to ba called for Android</b>
     *
     * for ios:
     * for ios 13.6 and later, auto initializtion feature doesnt work. so call this function to 
     * initialize ios-sdk manually.
     */
    static initialize() {
        return RNPushe.initialize();
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
     * Set special permission.
     */
    static setUserConsentGiven() {
        if (Platform.OS == 'ios') return;
        return RNPushe.setUserConsentGiven();
    }

    /**
     * Check if Pushe is registered or not
     * 
     * it will return promise of type boolean
     * 
     * @return {Promise<boolean>} Promise - if no parameter passed
     */
    static isRegistered() {
        return RNPushe.isRegistered();
    }
    /**
     * it will called when push registertion is completed
     */
    static onPusheRegisterationComplete() {
        if (Platform.OS === 'ios') return;
        return RNPushe.onRegistrationComplete();
    }
     /**
     * it will called when push initialization is completed
     */
    static onPusheInitializationComplete() {
        if (Platform.OS === 'ios') return;
        return RNPushe.onInitializationComplete();
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
     * Returns androidId of device (No function in iOS)
     * @deprecated since 2.1.1. In order to get android id, use <code>getDeviceId()</code>
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
        return RNPushe.subscribeToTopic(topicName);
    }

    /**
     * Unsubscribe from a topic
     * 
     * @param {string} topicName 
     * @return void
     */
    static unsubscribeFromTopic(topicName) {
        return RNPushe.unsubscribeFromTopic(topicName);
    }

    /**
     * get subscribed topics
     */
    static getSubscribedTopics() {
        return RNPushe.getSubscribedTopics();
    }

    /**
     * 
     * @param {object} tags - Object of key: string, value: string
     */
    static addTags(tags) {
        return RNPushe.addTags(tags);
    }

    /**
     * 
     * @param {list} list - a list of strings
     */
    static removeTags(list) {
        return RNPushe.removeTags(list);
    }


    static getSubscribedTags() {
        return RNPushe.getSubscribedTags();
    }

    // region Notifiation module

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

    /**
     * Enable notification foreground awareness for all incoming notifications
     * Refer to documentation for further information
     * @returns Nothing for iOS, and a promise for Android
     */
    static enableNotificationForceForegroundAware() {
        if (Platform.OS == 'ios') return;
        return RNPushe.enableNotificationForceForegroundAware();
    }

    /**
     * Disables notification foreground awareness for all incoming notifications
     * Instead notifications will decide what should happen (`show_foreground` key in notification message)
     * Refer to documentation for further information
     * @returns Nothing for iOS, and a promise for Android
     */
    static disableNotificationForceForegroundAware() {
        if (Platform.OS == 'ios') return;
        return RNPushe.disableNotificationForceForegroundAware();
    }

    /**
     * Is the ability enabled or not
     * Refer to documentation for further information
     * @returns Nothing for iOS, and a promise for Android
     */
    static isForceForegroundAware() {
        if (Platform.OS == 'ios') return;
        return RNPushe.isForegroundAwareByForce();
    }

    // endregion

    static sendEcommerceData(name,price) {
        if (Platform.OS === 'ios') return;
        return RNPushe.sendEcommerceData(name,price);
    }

    static EventAction = {
        CUSTOM : 'custom',
        SIGNUP : 'sign_up',
        LOGIN : 'login',
        PURCHASE : 'purchase',
        ACHIEVEMENT : 'achievement',
        LEVEL : 'level'
    }

    /**
    * sends event to server
    *
    * @param {string} name
    * @param {EventAction} action
    * @param {object} data - Object of key: string, value: objc
    */
    static sendEvent(name, action=Pushe.EventAction.CUSTOM, data={}) {
        return RNPushe.sendEvent(name, action, data);
    }

    // iOS specific methods

    /**
    * Returns APNs-token for iOS
    */
    static getAPNsToken() {
        if (Platform.OS === 'android') return;
        return RNPushe.getAPNsTokenAsString();
    }

    /**
    * Returns DeviceId for iOS and Android
    */
    static getDeviceId() {
        return RNPushe.getDeviceId();
    }
    
    /**
    * Returns AdvertisingId for iOS
    */
    static getAdvertisingId() {
        if (Platform.OS === 'android') return;
        return RNPushe.getAdvertisingId();
    }

    // region InAppMessaging module

    /**
     * Trigger local event for Pushe InAppMessaging
     * Note that this event simply is used to trigger received in app messaging.
     * No synchronization will happen with the server. In fact it happens locally.
     * If you want to send event that will be cached on server, consider using @see {sendEvent}
     * @param {string} event is the name of the event 
     */
    static triggerInAppEvent(event) {
        if (Platform.OS == 'ios') return;
        return RNPushe.triggerEvent(event);
    }

    /**
     * Usefull when InAppMessaging was disabled before.
     * It will re-enable the InAppMessaging and triggered events will show the messages.
     */
    static enableInAppMessaging() {
        if (Platform.OS == 'ios') return;
        return RNPushe.enableInAppMessaging();
    }

    /**
     * If called, events will be ignored and messages that are awaiting
     *  their events will not be published
     */
    static disableInAppMessaging() {
        if (Platform.OS == 'ios') return;
        return RNPushe.disableInAppMessaging();
    }

    /**
     * Check to see if in app messaging is enabled or not.
     * @returns {Promise<boolean>} true if it is, otherwise false.
     */
    static isInAppMessagingEnabled() {
        if (Platform.OS == 'ios') return;
        return RNPushe.isInAppMessagingEnabled();
    }

    /**
     * Useful when an in app message is displayed.
     * If called the shown InAppMessage will be dismissed and no dismiss callback will be called.
     * Thus, InAppMessage does not need user interaction to be dismissed.
     */
    static dismissShownInApp() {
        if (Platform.OS == 'ios') return;
        return RNPushe.dismissShownInApp();
    }

    /**
     * <b>VisiblForTesting</b>
     * To test Ui of InAppMessage, you can pass the json of message object as string
     * and message will be published.
     * @param {string} message 
     * @param {boolean} instant if True message will be published instantly without considering event.
     * otherwise will be published only when it's event occurred.
     */
    static testInAppMessage(message, instant=false) {
        if (Platform.OS == 'ios') return;
        return RNPushe.testInAppMessage(message, instant);
    }

    // endregion

    // region Fcm and Hms modules

    /**
     * Get token of FCM module (if active)
     * @returns the token (if service fcm is active), empty otherwise
     */
    static getFcmToken() {
        if (Platform.OS == 'ios') return;
        return RNPushe.getFcmToken();
    }

    /**
     * Get token of HMS module (if active)
     * @returns the token (if service hms is active), empty otherwise
     */
    static getHmsToken() {
        if (Platform.OS == 'ios') return;
        return RNPushe.getHmsToken();
    }

    /**
     * @returns The current active service (fcm, hms or empty if no service is currently active)
     */
    static getActiveService() {
        if (Platform.OS == 'ios') return;
        return RNPushe.getActiveService();
    }

    // endregion
}

export default Pushe;
