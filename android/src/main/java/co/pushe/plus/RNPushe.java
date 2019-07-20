
package co.pushe.plus;

import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

import co.pushe.plus.notification.NotificationButtonData;
import co.pushe.plus.notification.NotificationData;
import co.pushe.plus.notification.PusheNotification;
import co.pushe.plus.notification.PusheNotificationListener;
import co.pushe.plus.notification.UserNotification;

import static co.pushe.plus.RNPusheUtils.EVENT_TYPE;
import static co.pushe.plus.RNPusheUtils.getNotificationIntent;
import static co.pushe.plus.RNPusheUtils.isAppOnForeground;
import static co.pushe.plus.RNPusheUtils.mapToBundle;

public class RNPushe extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;


    public RNPushe(final ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

        this.initializeNotificationCallbacks(reactContext);
    }

    @Override
    public String getName() {
        return "Pushe";
    }

    private void sendEvent(String eventName, Object params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    @Deprecated
    @ReactMethod
    public void initialize() {
        // Does not do anything
    }

    @ReactMethod
    public void isRegistered(final Promise promise) {
        try {
            Boolean registered = Pushe.isRegistered();
            promise.resolve(registered);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void isInitialized(final Promise promise) {
        try {
            Boolean initialized = Pushe.isInitialized();
            promise.resolve(initialized);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void onRegisterationComplete(final Promise promise) {
        try {
            Pushe.setRegistrationCompleteListener(new Pushe.Callback() {
                @Override
                public void onComplete() {
                    promise.resolve(true);
                }
            });
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void onInitializationComplete(final Promise promise) {
        try {
            Pushe.setInitializationCompleteListener(new Pushe.Callback() {
                @Override
                public void onComplete() {
                    promise.resolve(true);
                }
            });
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void subscribeToTopic(final String topic, final Promise promise) {
        try {
            Pushe.subscribeToTopic(topic, new Pushe.Callback() {
                @Override
                public void onComplete() {
                    promise.resolve(true);
                }
            });
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @Deprecated
    @ReactMethod
    public void subscribe(final String topic, final Promise promise) {
        subscribeToTopic(topic, promise);
    }

    @ReactMethod
    public void unsubscribeFromTopic(final String topic, final Promise promise) {
        try {
            Pushe.unsubscribeFromTopic(topic, new Pushe.Callback() {
                @Override
                public void onComplete() {
                    promise.resolve(true);
                }
            });
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @Deprecated
    @ReactMethod
    public void unsubscribe(final String topic, final Promise promise) {
        subscribeToTopic(topic, promise);
    }

    @ReactMethod
    public void getGoogleAdvertisingId(final Promise promise) {
        try {
            String googleAddvertisingId = Pushe.getGoogleAdvertisingId();
            promise.resolve(googleAddvertisingId);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void getAndroidId(final Promise promise) {
        try {
            String androidId = Pushe.getAndroidId();
            promise.resolve(androidId);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void setCustomId(@Nullable String id, final Promise promise) {
        try {
            Pushe.setCustomId(id);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject(e);
        }
    }


    @ReactMethod
    public void getCustomId(final Promise promise) {
        try {
            String customId = Pushe.getCustomId();
            promise.resolve(customId);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void setUserEmail(@Nullable String email, final Promise promise) {
        try {
            Boolean result = Pushe.setUserEmail(email);
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void getUserEmail(final Promise promise) {
        try {
            String email = Pushe.getUserEmail();
            promise.resolve(email);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void setUserPhoneNumber(@Nullable String phoneNumber, final Promise promise) {
        try {
            Boolean result = Pushe.setUserPhoneNumber(phoneNumber);
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void getUserPhoneNumber(final Promise promise) {
        try {
            String phoneNumber = Pushe.getUserPhoneNumber();
            promise.resolve(phoneNumber);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    PusheNotification pusheNotification = (PusheNotification) Pushe.getPusheService(Pushe.NOTIFICATION);

    @ReactMethod
    public void enableNotifications(final Promise promise) {
        try {
            pusheNotification.enableNotifications();
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void disableNotifications(final Promise promise) {
        try {
            pusheNotification.disableNotifications();
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void isNotificationEnable(final Promise promise) {
        try {
            Boolean isEnabled = pusheNotification.isNotificationEnable();
            promise.resolve(isEnabled);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void enableCustomSound(final Promise promise) {
        try {
            pusheNotification.enableCustomSound();
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void disableCustomSound(final Promise promise) {
        try {
            pusheNotification.disableCustomSound();
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void isCustomSoundEnable(final Promise promise) {
        try {
            Boolean isEnabled = pusheNotification.isCustomSoundEnable();
            promise.resolve(isEnabled);
        } catch (Exception e) {
            promise.reject(e);
        }
    }


    public enum SEND_NOTIFICATION_TYPE {
        CUSTOM_ID,
        ANDROID_ID,
        ADVERTISEMENT_ID
    }


    @ReactMethod
    public void sendNotification(String type, String id, String title, String content, final Promise promise) {
        UserNotification userNotification;
        try {
            if (type.equals(SEND_NOTIFICATION_TYPE.CUSTOM_ID.toString())) {
                userNotification = UserNotification.withCustomId(id).setTitle(title).setContent(content);
            } else if (type.equals(SEND_NOTIFICATION_TYPE.ANDROID_ID.toString())) {
                userNotification = UserNotification.withAndroidId(id).setTitle(title).setContent(content);
            } else if (type.equals(SEND_NOTIFICATION_TYPE.ADVERTISEMENT_ID.toString())) {
                userNotification = UserNotification.withAdvertisementId(id).setTitle(title).setContent(content);
            } else {
                promise.reject(new Exception("Send notification type is not valid"));
                return;
            }
            pusheNotification.sendNotificationToUser(userNotification);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void sendNotification(String type, String id, String advancedNotification, final Promise promise) {
        UserNotification userNotification;
        try {
            if (type.equals(SEND_NOTIFICATION_TYPE.CUSTOM_ID.toString())) {
                userNotification = UserNotification.withCustomId(id).setAdvancedNotification(advancedNotification);
            } else if (type.equals(SEND_NOTIFICATION_TYPE.ANDROID_ID.toString())) {
                userNotification = UserNotification.withAndroidId(id).setAdvancedNotification(advancedNotification);
            } else if (type.equals(SEND_NOTIFICATION_TYPE.ADVERTISEMENT_ID.toString())) {
                userNotification = UserNotification.withAdvertisementId(id).setAdvancedNotification(advancedNotification);
            } else {
                promise.reject(new Exception("Send notification type is not valid"));
                return;
            }
            pusheNotification.sendNotificationToUser(userNotification);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject(e);
        }

    }

    @ReactMethod
    public void createNotificationChannel(String channel_id, String channelName, @Nullable String description,
                                          @Nullable int importance, @Nullable boolean enableLight, @Nullable boolean enableVibration,
                                          @Nullable boolean showBadge, @Nullable int ledColor, @Nullable ReadableArray vibrationPattern, final Promise promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            try {
                long[] vibrationPatternArray = new long[vibrationPattern.size()];
                for (int i = 0; i < vibrationPatternArray.length; i++) {
                    vibrationPatternArray[i] = (long) vibrationPattern.getDouble(i);
                }
                pusheNotification.createNotificationChannel(channel_id, channelName, description, importance, enableLight, enableVibration, showBadge, ledColor, vibrationPatternArray);
                promise.resolve(true);
            } catch (Exception e) {
                promise.reject(e);
            }
        }
    }

    @ReactMethod
    public void removeNotificationChannel(String channel_id, final Promise promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            try {
                pusheNotification.removeNotificationChannel(channel_id);
                promise.resolve(true);
            } catch (Exception e) {
                promise.reject(e);
            }
        }
    }

    private void initializeNotificationCallbacks(final Context context) {
        PusheNotification pusheNotification = (PusheNotification) Pushe.getPusheService(Pushe.NOTIFICATION);

        if (pusheNotification == null) {
            Log.e("PusheReactNative", "Cannot get PusheNotification");
            return;
        }

        final boolean appOnForeground = isAppOnForeground(reactContext);

        pusheNotification.setNotificationListener(new PusheNotificationListener() {
            @Override
            public void onNotification(@NonNull NotificationData notificationData) {
                Intent intent = getNotificationIntent(context, notificationData);

                if (appOnForeground) {
                    sendEvent("Pushe-NotificationReceived", intent.getExtras());
                } else {
                    intent.putExtra("EVENT_TYPE", EVENT_TYPE.NOTIFICATION.toString());

                    context.startService(intent);
                    HeadlessJsTaskService.acquireWakeLockNow(context);
                }
            }

            @Override
            public void onCustomContentNotification(@NonNull Map<String, Object> map) {
                if (appOnForeground) {
                    sendEvent("Pushe-CustomContentReceived", "aaa");
                } else {
                    Intent intent = new Intent(context, RNPusheNotificationService.class);
                    intent.putExtra("customContent", mapToBundle(map));
                    intent.putExtra("EVENT_TYPE", EVENT_TYPE.CUSTOM_CONTENT.toString());

                    context.startService(intent);
                    HeadlessJsTaskService.acquireWakeLockNow(context);
                }
            }

            @Override
            public void onNotificationClick(@NonNull NotificationData notificationData) {
                if (appOnForeground) {
                    sendEvent("Pushe-Clicked", "aaa");
                } else {
                    Intent intent = getNotificationIntent(context, notificationData);
                    intent.putExtra("EVENT_TYPE", EVENT_TYPE.CLICK.toString());

                    context.startService(intent);
                    HeadlessJsTaskService.acquireWakeLockNow(context);
                }
            }

            @Override
            public void onNotificationDismiss(@NonNull NotificationData notificationData) {
                if (appOnForeground) {
                    sendEvent("Pushe-Dismissed", "aaa");
                } else {
                    Intent intent = getNotificationIntent(context, notificationData);
                    intent.putExtra("EVENT_TYPE", EVENT_TYPE.DISMISS.toString());

                    context.startService(intent);
                    HeadlessJsTaskService.acquireWakeLockNow(context);
                }
            }

            @Override
            public void onNotificationButtonClick(@NonNull NotificationButtonData notificationButtonData, @NonNull NotificationData notificationData) {
                if (appOnForeground) {
                    sendEvent("Pushe-ButtonClicked", "aaa");
                } else {
                    Intent intent = getNotificationIntent(context, notificationData);
                    intent.putExtra("EVENT_TYPE", EVENT_TYPE.BUTTON_CLICK.toString());

                    Map<String, Object> map = new HashMap<>();
                    map.put("id", notificationButtonData.getId());
                    map.put("icon", notificationButtonData.getIcon());
                    map.put("text", notificationButtonData.getText());
                    Bundle bundle = mapToBundle(map);
                    intent.putExtra("notificationButtonData", bundle);

                    context.startService(intent);
                    HeadlessJsTaskService.acquireWakeLockNow(context);
                }
            }
        });
    }

}
