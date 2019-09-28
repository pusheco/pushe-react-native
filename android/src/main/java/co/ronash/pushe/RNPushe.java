package co.ronash.pushe;

import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import co.ronash.pushe.*;

import co.ronash.pushe.service.RNPusheNotificationService;
import co.ronash.pushe.utils.RNPusheIntent;
import co.ronash.pushe.utils.RNPusheTypes;
import co.ronash.pushe.utils.RNPusheWritable;


public class RNPushe extends ReactContextBaseJavaModule implements LifecycleEventListener {

    private final ReactApplicationContext reactContext;

    /**
     * Check if App is on foreground or not base on
     * {@link com.facebook.react.bridge.LifecycleEventListener}
     * LifecycleEventListener should be added to the context
     */
    private boolean isAppOnForeground = false;

    public RNPushe(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

        this.reactContext.addLifecycleEventListener(this);

        this.initializeNotificationListeners();
    }

    @Override
    public String getName() {
        return "RNPushe";
    }

    @ReactMethod
    public void initialize(Boolean showGooglePlayDialog) {
        Pushe.initialize(reactContext, showGooglePlayDialog);
    }

    @ReactMethod
    public void unsafe_isPusheInitialized(Callback callback) {
        callback.invoke(Pushe.isPusheInitialized(reactContext));
    }

    @ReactMethod
    public void isPusheInitialized(Promise promise) {
        promise.resolve(Pushe.isPusheInitialized(reactContext));
    }

    @ReactMethod
    public void unsafe_getPusheId(Callback callback) {
        callback.invoke(Pushe.getPusheId(reactContext));
    }

    @ReactMethod
    public void getPusheId(Promise promise) {
        promise.resolve(Pushe.getPusheId(reactContext));
    }

    @ReactMethod
    public void subscribeTopic(String topicName) {
        Pushe.subscribe(reactContext, topicName);
    }

    @ReactMethod
    public void unsubscribeTopic(String topicName) {
        Pushe.unsubscribe(reactContext, topicName);
    }

    @ReactMethod
    public void setNotificationOff() {
        Pushe.setNotificationOff(reactContext);
    }

    @ReactMethod
    public void setNotificationOn() {
        Pushe.setNotificationOn(reactContext);
    }

    @ReactMethod
    public void sendSimpleNotifToUser(String pusheId, String title, String content) {
        Pushe.sendSimpleNotifToUser(reactContext, pusheId, title, content);
    }

    @ReactMethod
    public void sendAdvancedNotifToUser(String pusheId, String notificationJson, Promise promise) {
        try {
            Pushe.sendAdvancedNotifToUser(reactContext, pusheId, notificationJson);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void sendCustomJsonToUser(String pusheId, String json, Promise promise) {
        try {
            Pushe.sendCustomJsonToUser(reactContext, pusheId, json);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void createNotificationChannel(
            String channelId,
            String channelName,
            String description,
            int importance,
            boolean enableLight,
            boolean enableVibration,
            boolean showBadge,
            int ledColor,
            ReadableArray vibrationPattern
    ) {
        long[] vibrationPatternArray = new long[vibrationPattern.size()];
        for (int i = 0; i < vibrationPattern.size(); i++) {
            vibrationPatternArray[i] = vibrationPattern.getInt(i);
        }

        Pushe.createNotificationChannel(reactContext, channelId, channelName,
                description, importance, enableLight, enableVibration, showBadge, ledColor,
                vibrationPatternArray);
    }

    @ReactMethod
    public void removeNotificationChannel(String channelId) {
        Pushe.removeNotificationChannel(reactContext, channelId);
    }

    // --------- Notification listeners -----------

    public void initializeNotificationListeners() {
        Pushe.setNotificationListener(new Pushe.NotificationListener() {
            @Override
            public void onNotificationReceived(NotificationData notificationData) {
                if (isAppOnForeground) {
                    sendEvent(RNPusheTypes.EVENTS_TYPES.RECEIVED.getBroadcast(), new RNPusheWritable().notificationDataToWritableMap(notificationData));
                } else {
                    Intent intent = new RNPusheIntent().getNotificationIntent(reactContext, notificationData);
                    startHeadlessJsTask(intent, RNPusheTypes.EVENTS_TYPES.RECEIVED.getEvent());
                }
            }

            @Override
            public void onNotificationClicked(NotificationData notificationData) {
                if (isAppOnForeground) {
                    sendEvent(RNPusheTypes.EVENTS_TYPES.CLICKED.getBroadcast(), new RNPusheWritable().notificationDataToWritableMap(notificationData));
                } else {
                    Intent intent = new RNPusheIntent().getNotificationIntent(reactContext, notificationData);
                    startHeadlessJsTask(intent, RNPusheTypes.EVENTS_TYPES.CLICKED.getEvent());
                }
            }

            @Override
            public void onNotificationButtonClicked(NotificationData notificationData, NotificationButtonData notificationButtonData) {
                if (isAppOnForeground) {
                    sendEvent(RNPusheTypes.EVENTS_TYPES.BUTTON_CLICKED.getBroadcast(), new RNPusheWritable().notificationDataToWritableMap(notificationData));
                } else {
                    Intent intent = new RNPusheIntent().getNotificationIntent(reactContext, notificationData);

                    Map<String, Object> map = new HashMap<>();
                    map.put("id", notificationButtonData.getId());
                    map.put("text", notificationButtonData.getText());
                    Bundle bundle = new RNPusheIntent().mapToBundle(map);
                    intent.putExtra("notificationButtonData", bundle);

                    startHeadlessJsTask(intent, RNPusheTypes.EVENTS_TYPES.BUTTON_CLICKED.getEvent());
                }
            }

            @Override
            public void onCustomContentReceived(JSONObject customContent) {
                if (isAppOnForeground) {
                    sendEvent(RNPusheTypes.EVENTS_TYPES.CUSTOM_CONTENT_RECEIVED.getBroadcast(), customContent.toString());
                } else {
                    Intent intent = new Intent(reactContext, RNPusheNotificationService.class);
                    intent.putExtra("customContent", customContent.toString());
                    startHeadlessJsTask(intent, RNPusheTypes.EVENTS_TYPES.CUSTOM_CONTENT_RECEIVED.getEvent());
                }
            }

            @Override
            public void onNotificationDismissed(NotificationData notificationData) {
                if (isAppOnForeground) {
                    sendEvent(RNPusheTypes.EVENTS_TYPES.DISMISSED.getBroadcast(), new RNPusheWritable().notificationDataToWritableMap(notificationData));
                } else {
                    Intent intent = new RNPusheIntent().getNotificationIntent(reactContext, notificationData);
                    startHeadlessJsTask(intent, RNPusheTypes.EVENTS_TYPES.DISMISSED.getEvent());
                }
            }
        });
    }

    private void sendEvent(String eventName, Object params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    private void startHeadlessJsTask(Intent intent, String eventType) {
        intent.putExtra("EVENT_TYPE", eventType);

        reactContext.startService(intent);
        HeadlessJsTaskService.acquireWakeLockNow(reactContext);
    }

    // --------- LifeCycle methods ---------

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
}
