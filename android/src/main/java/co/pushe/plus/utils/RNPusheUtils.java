package co.pushe.plus.utils;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.bridge.WritableMap;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Map;

import co.pushe.plus.notification.NotificationData;

public class RNPusheUtils {

    public static Intent getNotificationIntent(Context context, NotificationData notificationData) {
        return new RNPusheIntent().getNotificationIntent(context, notificationData);
    }

    public static JSONObject getNotificationJson(NotificationData notificationData) throws JSONException {
        return new RNPusheJson().getNotificationJson(notificationData);
    }


    public static WritableMap jsonToWritableMap(JSONObject jsonObject) throws JSONException {
        return new RNPusheWritable().jsonToWritableMap(jsonObject);
    }

    public static Bundle mapToBundle(Map<String, Object> map) {
        return new RNPusheIntent().mapToBundle(map);
    }
}
