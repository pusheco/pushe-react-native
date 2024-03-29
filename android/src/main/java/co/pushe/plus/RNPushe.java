
package co.pushe.plus;

import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.List;
import java.util.Map;

import javax.annotation.Nullable;

import co.pushe.plus.analytics.PusheAnalytics;
import co.pushe.plus.fcm.PusheFCM;
import co.pushe.plus.hms.PusheHMS;
import co.pushe.plus.internal.PusheException;
import co.pushe.plus.notification.NotificationButtonData;
import co.pushe.plus.notification.NotificationData;
import co.pushe.plus.notification.PusheNotification;
import co.pushe.plus.notification.PusheNotificationListener;
import co.pushe.plus.notification.UserNotification;
import co.pushe.plus.utils.RNPusheTypes.EVENTS_TYPES;
import co.pushe.plus.utils.RNPusheTypes.SEND_NOTIFICATION_TYPE;

import static co.pushe.plus.utils.RNPusheUtils.getNotificationIntent;
import static co.pushe.plus.utils.RNPusheUtils.mapToBundle;
import static co.pushe.plus.utils.RNPusheUtils.mapToWritableMap;
import static co.pushe.plus.utils.RNPusheUtils.notificationDataToWritableMap;


public class RNPushe extends ReactContextBaseJavaModule implements LifecycleEventListener {

    private final ReactApplicationContext reactContext;

    /**
     * Check if App is on foreground or not base on
     * {@link com.facebook.react.bridge.LifecycleEventListener}
     * LifecycleEventListener should be added to the context
     */
    private boolean isAppOnForeground = false;


    PusheNotification pusheNotification;
    PusheAnalytics pusheAnalytics;
    PusheFCM pusheFCM;
    PusheHMS pusheHMS;

    public RNPushe(final ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.reactContext.addLifecycleEventListener(this);

        pusheNotification = (PusheNotification) Pushe.getPusheService(Pushe.NOTIFICATION);
        pusheAnalytics = (PusheAnalytics) Pushe.getPusheService(Pushe.ANALYTICS);
        pusheFCM = Pushe.getPusheService(PusheFCM.class);
        pusheHMS = Pushe.getPusheService(PusheHMS.class);

        // This calls to initializeNotificationCallbacks is used when app is in foreground
        this.initializeNotificationCallbacks();
    }

    @NonNull
    @Override
    public String getName() {
        return "RNPushe";
    }


    /**
     * This is for initializing pushe event listeners when app is in background
     * and should be called in a file that extends {@link android.app.Application}
     * in react that would be {@link "com.my.package".MainApplication#onCreate}
     * <p>
     * This func calls initializeNotificationCallbacks with a different context
     * than the real context of UI thread, the it should not be used when app in
     * foreground.
     */
    public static void initializeEventListeners(final Context context) {
        Pushe.setInitializationCompleteListener(new Pushe.Callback() {
            @Override
            public void onComplete() {
                new RNPushe(new ReactApplicationContext(context)).initializeNotificationCallbacks();
            }
        });

    }

    private void sendCallbackEvent(String eventName, Object params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    @ReactMethod
    public void initialize(final Promise promise) {
        Pushe.initialize();
        promise.resolve(true);
    }

    @ReactMethod
    public void setUserConsentGiven(final Promise promise) {
        Pushe.setUserConsentGiven();
        promise.resolve(true);
    }

    @ReactMethod
    public void isRegistered(final Promise promise) {
        Boolean registered = Pushe.isRegistered();
        promise.resolve(registered);
    }

    @ReactMethod
    public void isInitialized(final Promise promise) {
        Boolean initialized = Pushe.isInitialized();
        promise.resolve(initialized);
    }

    @ReactMethod
    public void onRegistrationComplete(final Promise promise) {
        Pushe.setRegistrationCompleteListener(new Pushe.Callback() {
            @Override
            public void onComplete() {
                promise.resolve(true);
            }
        });
    }

    @ReactMethod
    public void onInitializationComplete(final Promise promise) {
        Pushe.setInitializationCompleteListener(new Pushe.Callback() {
            @Override
            public void onComplete() {
                promise.resolve(true);
            }
        });
    }

    @ReactMethod
    public void subscribeToTopic(final String topic, final Promise promise) {
        Pushe.subscribeToTopic(topic, new Pushe.Callback() {
            @Override
            public void onComplete() {
                promise.resolve(true);
            }
        });
    }

    @ReactMethod
    public void unsubscribeFromTopic(final String topic, final Promise promise) {
        Pushe.unsubscribeFromTopic(topic, new Pushe.Callback() {
            @Override
            public void onComplete() {
                promise.resolve(true);
            }
        });
    }

    @ReactMethod
    public void getSubscribedTopics(final Promise promise) {
        List<String> topics = Pushe.getSubscribedTopics();
        WritableArray array = new WritableNativeArray();
        for (String item :
                topics) {
            array.pushString(item);
        }
        promise.resolve(array);
    }

    @ReactMethod
    public void addTags(final ReadableMap tags, final Promise promise) {

        Pushe.addTags((Map) tags.toHashMap());
        promise.resolve(true);
    }

    @ReactMethod
    public void removeTags(final ReadableArray list, final Promise promise) {
        Pushe.removeTags((List) list.toArrayList());
        promise.resolve(true);
    }

    @ReactMethod
    public void getSubscribedTags(final Promise promise) {
        try {
            WritableMap writableMap = new WritableNativeMap();
            Map<String, String> map = Pushe.getSubscribedTags();
            for (Map.Entry<String, String> entry : map.entrySet()) {
                writableMap.putString(entry.getKey(), entry.getValue());
            }

            promise.resolve(writableMap);
        } catch (Exception e) {
            promise.reject(e);
        }

    }

    @ReactMethod
    public void getAdvertisingId(final Promise promise) {
        String googleAdvertisingId = Pushe.getAdvertisingId();

        if (googleAdvertisingId == null) {
            promise.reject(new Error("Could not get getAdvertisingId"));
        } else {
            promise.resolve(googleAdvertisingId);
        }
    }

    /**
     * Returns Google ad ID
     *
     * @deprecated Use {@link RNPushe#getAdvertisingId(Promise)}
     */
    @Deprecated
    @ReactMethod
    public void getGoogleAdvertisingId(final Promise promise) {
        String googleAdvertisingId = Pushe.getGoogleAdvertisingId();

        if (googleAdvertisingId == null) {
            promise.reject(new Error("Could not get getGoogleAdvertisingId"));
        } else {
            promise.resolve(googleAdvertisingId);
        }
    }

    /**
     * @deprecated Use {@link RNPushe#getDeviceId(Promise)}
     */
    @Deprecated
    @ReactMethod
    public void getAndroidId(final Promise promise) {
        String androidId = Pushe.getAndroidId();

        if (androidId == null) {
            promise.reject(new Error("Could not get androidId"));
        } else {
            promise.resolve(androidId);
        }
    }

    @ReactMethod
    public void getDeviceId(final Promise promise) {
        String deviceId = Pushe.getDeviceId();
        if (deviceId == null) {
            promise.reject(new Error("Could not retreive deviceId. Make sure Pushe is initialized first"));
        } else {
            promise.resolve(deviceId);
        }
    }

    @ReactMethod
    public void setCustomId(@Nullable String id, final Promise promise) {
        Pushe.setCustomId(id);
        promise.resolve(true);
    }


    @ReactMethod
    public void getCustomId(final Promise promise) {
        String customId = Pushe.getCustomId();

        if (customId == null) {
            promise.reject(new Error("Getting Custom Id failed"));
        } else {
            promise.resolve(customId);
        }
    }

    @ReactMethod
    public void setUserEmail(@Nullable String email, final Promise promise) {
        Boolean result = Pushe.setUserEmail(email);
        promise.resolve(result);
    }

    @ReactMethod
    public void getUserEmail(final Promise promise) {
        String email = Pushe.getUserEmail();

        if (email == null) {
            promise.reject(new Error("Getting user email failed"));
        } else {
            promise.resolve(email);
        }
    }

    @ReactMethod
    public void setUserPhoneNumber(@Nullable String phoneNumber, final Promise promise) {
        Boolean result = Pushe.setUserPhoneNumber(phoneNumber);
        promise.resolve(result);
    }

    @ReactMethod
    public void getUserPhoneNumber(final Promise promise) {
        String phoneNumber = Pushe.getUserPhoneNumber();

        if (phoneNumber == null) {
            promise.reject(new Error("Getting user phone number failed"));
        } else {
            promise.resolve(phoneNumber);
        }
    }


    // region Notification

    @ReactMethod
    public void enableNotifications(final Promise promise) {
        if (pusheNotification == null) {
            promise.reject(moduleNotPresentException("Notification"));
            return;
        }
        pusheNotification.enableNotifications();
        promise.resolve(true);
    }

    @ReactMethod
    public void disableNotifications(final Promise promise) {
        if (pusheNotification == null) {
            promise.reject(moduleNotPresentException("Notification"));
            return;
        }
        pusheNotification.disableNotifications();
        promise.resolve(true);
    }

    @ReactMethod
    public void isNotificationEnable(final Promise promise) {
        if (pusheNotification == null) {
            promise.reject(moduleNotPresentException("Notification"));
            return;
        }
        Boolean isEnabled = pusheNotification.isNotificationEnable();
        promise.resolve(isEnabled);
    }

    @ReactMethod
    public void enableCustomSound(final Promise promise) {
        if (pusheNotification == null) {
            promise.reject(moduleNotPresentException("Notification"));
            return;
        }
        pusheNotification.enableCustomSound();
        promise.resolve(true);
    }

    @ReactMethod
    public void disableCustomSound(final Promise promise) {
        if (pusheNotification == null) {
            promise.reject(moduleNotPresentException("Notification"));
            return;
        }
        pusheNotification.disableCustomSound();
        promise.resolve(true);
    }

    @ReactMethod
    public void isCustomSoundEnable(final Promise promise) {
        if (pusheNotification == null) {
            promise.reject(moduleNotPresentException("Notification"));
            return;
        }
        Boolean isEnabled = pusheNotification.isCustomSoundEnable();
        promise.resolve(isEnabled);
    }


    @ReactMethod
    public void sendNotificationToUser(String type, String id, String params, final Promise promise) {
        if (pusheNotification == null) {
            promise.reject(moduleNotPresentException("Notification"));
            return;
        }
        UserNotification userNotification;

        try {
            if (SEND_NOTIFICATION_TYPE.CUSTOM_ID.is(type)) {
                userNotification = UserNotification.withCustomId(id);
            } else if (SEND_NOTIFICATION_TYPE.ANDROID_ID.is(type)) {
                userNotification = UserNotification.withDeviceId(id);
            } else if (SEND_NOTIFICATION_TYPE.ADVERTISEMENT_ID.is(type)) {
                userNotification = UserNotification.withAdvertisementId(id);
            } else {
                promise.reject(new Exception("Send notification type is not valid"));
                return;
            }

            userNotification.setAdvancedNotification(params);
            pusheNotification.sendNotificationToUser(userNotification);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void createNotificationChannel(
            String channel_id, String channelName, @Nullable String description,
            int importance, boolean enableLight, boolean enableVibration,
            boolean showBadge, int ledColor, @Nullable ReadableArray vibrationPattern, final Promise promise
    ) {
        if (pusheNotification == null) {
            promise.reject(moduleNotPresentException("Notification"));
            return;
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            try {
                long[] vibrationPatternArray = vibrationPattern != null ? new long[vibrationPattern.size()] : new long[0];
                for (int i = 0; i < vibrationPatternArray.length; i++) {
                    vibrationPatternArray[i] = (long) vibrationPattern.getDouble(i);
                }
                pusheNotification.createNotificationChannel(channel_id, channelName, description, importance, enableLight, enableVibration, showBadge, ledColor, vibrationPatternArray);
                promise.resolve(true);
            } catch (Exception e) {
                promise.reject(e);
            }
        } else {
            promise.reject(new Exception("Notification Channel is only supported in Api 26 or higher."));
        }
    }

    @ReactMethod
    public void removeNotificationChannel(String channel_id, final Promise promise) {
        if (pusheNotification == null) {
            promise.reject(moduleNotPresentException("Notification"));
            return;
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            try {
                pusheNotification.removeNotificationChannel(channel_id);
                promise.resolve(true);
            } catch (Exception e) {
                promise.reject(e);
            }
        } else {
            promise.reject(new Exception("Notification Channel is only supported in Api 26 or higher."));
        }
    }

    @ReactMethod
    public void enableNotificationForceForegroundAware(final Promise promise) {
        if (pusheNotification == null) {
            promise.reject(moduleNotPresentException("Notification"));
            return;
        }
        pusheNotification.enableNotificationForceForegroundAware();
        promise.resolve(true);
    }

    @ReactMethod
    public void disableNotificationForceForegroundAware(final Promise promise) {
        if (pusheNotification == null) {
            promise.reject(moduleNotPresentException("Notification"));
            return;
        }
        pusheNotification.disableNotificationForceForegroundAware();
        promise.resolve(true);
    }

    @ReactMethod
    public void isForegroundAwareByForce(final Promise promise) {
        if (pusheNotification == null) {
            promise.reject(moduleNotPresentException("Notification"));
            return;
        }
        promise.resolve(pusheNotification.isForegroundAwareByForce());
    }

    // endregion

    @ReactMethod
    public void sendEcommerceData(String name, Double price, final Promise promise) {
        if (pusheAnalytics == null) {
            promise.reject(moduleNotPresentException("Analytics"));
            return;
        }
        pusheAnalytics.sendEcommerceData(name, price);
        promise.resolve(true);
    }

    @ReactMethod
    public void sendEvent(String name, final Promise promise) {
        if (pusheAnalytics == null) {
            promise.reject(moduleNotPresentException("Analytics"));
            return;
        }
        pusheAnalytics.sendEvent(name);
        promise.resolve(true);
    }

    // region FCM and HMS

    @ReactMethod
    public void getFcmToken(final Promise promise) {
        if (pusheFCM == null) promise.reject(moduleNotPresentException("FCM"));
        else promise.resolve(pusheFCM.getToken());
    }

    @ReactMethod
    public void getHmsToken(final Promise promise) {
        if (pusheHMS == null) promise.reject(moduleNotPresentException("HMS"));
        else promise.resolve(pusheHMS.getToken());
    }

    @ReactMethod
    public void getActiveService(final Promise promise) {
        promise.resolve(Pushe.getActiveCourier());
    }

    // endregion

    private void startHeadlessJsTask(Intent intent, String eventType) {
        intent.putExtra("EVENT_TYPE", eventType);

        reactContext.startService(intent);
        HeadlessJsTaskService.acquireWakeLockNow(reactContext);
    }

    private void initializeNotificationCallbacks() {
        if (pusheNotification == null) {
            android.util.Log.e("Pushe", "Can not setNotificationListener because PusheNotification module is not correctly" +
                    " initialized or does not exist. Please see previous logs to find out why.");
            return;
        }
        pusheNotification.setNotificationListener(new PusheNotificationListener() {
            @Override
            public void onNotification(@NonNull NotificationData notificationData) {

                if (isAppOnForeground) {
                    sendCallbackEvent(EVENTS_TYPES.RECEIVED.getBroadcast(), notificationDataToWritableMap(notificationData));

                } else {
                    Intent intent = getNotificationIntent(reactContext, notificationData);
                    startHeadlessJsTask(intent, EVENTS_TYPES.RECEIVED.getEvent());
                }
            }

            @Override
            public void onCustomContentNotification(@NonNull Map<String, Object> map) {
                if (isAppOnForeground) {
                    sendCallbackEvent(EVENTS_TYPES.CUSTOM_CONTENT_RECEIVED.getBroadcast(), mapToWritableMap(map));
                } else {
                    Intent intent = new Intent(reactContext, RNPusheNotificationService.class);
                    intent.putExtra("customContent", mapToBundle(map));
                    startHeadlessJsTask(intent, EVENTS_TYPES.CUSTOM_CONTENT_RECEIVED.getEvent());
                }
            }

            @Override
            public void onNotificationClick(@NonNull NotificationData notificationData) {
                if (isAppOnForeground) {
                    sendCallbackEvent(EVENTS_TYPES.CLICKED.getBroadcast(), notificationDataToWritableMap(notificationData));
                } else {
                    Intent intent = getNotificationIntent(reactContext, notificationData);
                    startHeadlessJsTask(intent, EVENTS_TYPES.CLICKED.getEvent());
                }
            }

            @Override
            public void onNotificationDismiss(@NonNull NotificationData notificationData) {
                if (isAppOnForeground) {
                    sendCallbackEvent(EVENTS_TYPES.DISMISSED.getBroadcast(), notificationDataToWritableMap(notificationData));
                } else {
                    Intent intent = getNotificationIntent(reactContext, notificationData);
                    startHeadlessJsTask(intent, EVENTS_TYPES.DISMISSED.getEvent());
                }
            }

            @Override
            public void onNotificationButtonClick(@NonNull NotificationButtonData notificationButtonData, @NonNull NotificationData notificationData) {
                if (isAppOnForeground) {
                    sendCallbackEvent(EVENTS_TYPES.BUTTON_CLICKED.getBroadcast(), notificationDataToWritableMap(notificationData, notificationButtonData));
                } else {
                    Intent intent = getNotificationIntent(reactContext, notificationData, notificationButtonData);
                    startHeadlessJsTask(intent, EVENTS_TYPES.BUTTON_CLICKED.getEvent());
                }
            }
        });
    }

    @Override
    public void onHostResume() {
        isAppOnForeground = true;
    }

    @Override
    public void onHostPause() {
        isAppOnForeground = false;
    }

    @Override
    public void onHostDestroy() {
        isAppOnForeground = false;
    }

    /**
     * Returns an exception illustrating that the module is not initialized and not registered to core module
     */
    private PusheException moduleNotPresentException(String moduleName) {
        return new PusheException("Pushe module " + moduleName + " is not present. Wrapping your call in `onPusheInitializationComplete` may be helpful. Other wise there might be some native errors");
    }

}
