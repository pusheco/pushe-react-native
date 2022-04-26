package co.pushe.plus.utils;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.bridge.WritableMap;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import co.pushe.plus.notification.NotificationData;
import co.pushe.plus.notification.NotificationButtonData;

public class RNPusheUtils {

    public static Intent getNotificationIntent(Context context, NotificationData notificationData) {
        return new RNPusheIntent().getNotificationIntent(context, notificationData);
    }

    public static Intent getNotificationIntent(Context context, NotificationData notificationData, NotificationButtonData clickedButton) {
        return new RNPusheIntent().getNotificationIntent(context, notificationData, clickedButton);
    }

    public static Bundle mapToBundle(Map<String, Object> map) {
        return new RNPusheIntent().mapToBundle(map);
    }

    public static WritableMap notificationDataToWritableMap(NotificationData notificationData) {
        return new RNPusheWritable().notificationDataToWritableMap(notificationData);
    }
    public static WritableMap notificationDataToWritableMap(NotificationData notificationData, NotificationButtonData clickedButton) {
        return new RNPusheWritable().notificationDataToWritableMap(notificationData, clickedButton);
    }

    public static WritableMap mapToWritableMap(Map<String, Object> map) {
        return new RNPusheWritable().mapToWritableMap(map);
    }
}
