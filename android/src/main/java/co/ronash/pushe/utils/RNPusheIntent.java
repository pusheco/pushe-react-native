package co.ronash.pushe.utils;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import co.ronash.pushe.NotificationButtonData;
import co.ronash.pushe.NotificationData;
import co.ronash.pushe.service.RNPusheNotificationService;

public class RNPusheIntent {

    public Bundle mapToBundle(Map<String, Object> map) {
        Bundle bundle = new Bundle();

        if (map == null) {
            return bundle;
        }

        for (String key : map.keySet()) {
            Object value = map.get(key);

            if (value instanceof String) {
                bundle.putString(key, (String) value);
            } else if (value instanceof Integer) {
                bundle.putInt(key, (Integer) value);
            } else if (value instanceof Double) {
                bundle.putDouble(key, (Double) value);
            } else if (value instanceof Float) {
                bundle.putFloat(key, (Float) value);
            } else if (value instanceof Boolean) {
                bundle.putBoolean(key, (Boolean) value);
            } else if (value instanceof List) {
                bundle.putParcelableArrayList(key, listToParcelableList((List) value));
            } else if (value instanceof Map) {
                bundle.putBundle(key, mapToBundle((Map) value));
            }
        }
        return bundle;
    }

    private ArrayList listToParcelableList(List list) {
        ArrayList bundle = new ArrayList();
        for (Object value : list) {
            if (value instanceof String || value instanceof Integer || value instanceof Double
                    || value instanceof Float || value instanceof Boolean) {
                bundle.add(value);
            } else if (value instanceof Map) {
                bundle.add(mapToBundle((Map) value));
            } else if (value instanceof List) {
                bundle.add(listToParcelableList((List) value));
            }
        }
        return bundle;
    }

    public Intent getNotificationIntent(Context context, NotificationData notificationData) {
        Intent intent = new Intent(context, RNPusheNotificationService.class);

        intent.putExtra("title", notificationData.getTitle());
        intent.putExtra("summary", notificationData.getSummary());
        intent.putExtra("imageUrl", notificationData.getImageUrl());
        intent.putExtra("iconUrl", notificationData.getIconUrl());
        try {
            if (notificationData.getCustomContent() != null) {
                intent.putExtra("customContent", notificationData.getCustomContent().toString());
            }
        } catch (Exception e) {
            
        }
        intent.putExtra("content", notificationData.getContent());

        ArrayList<HashMap<String, String>> buttonData = new ArrayList<>();
        for (NotificationButtonData button : notificationData.getButtons()) {
            HashMap<String, String> map = new HashMap<>();
            map.put("id", String.valueOf(button.getId()));
            map.put("text", button.getText());
            buttonData.add(map);
        }

        intent.putExtra("buttons", listToParcelableList(buttonData));
        intent.putExtra("bigTitle", notificationData.getBigTitle());
        intent.putExtra("bigContent", notificationData.getBigContent());

        return intent;
    }

}

