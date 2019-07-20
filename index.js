
import { NativeModules, NativeEventEmitter } from 'react-native';
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

    
}

export default Pushe;
