package co.ronash.pushe;

import android.content.Context;

import com.facebook.react.bridge.ReactApplicationContext;

public class RNPusheNotificationListener {

    public static void enableNotificationListener(Context context) {
        new RNPushe(new ReactApplicationContext(context)).initializeNotificationListeners();
    }
}
