package co.pushe.plus.utils;

import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import java.util.List;
import java.util.Map;

import co.pushe.plus.notification.NotificationButtonData;
import co.pushe.plus.notification.NotificationData;

public class RNPusheWritable {

    public WritableArray listToWritableArray(List list) {
        WritableArray writableArray = new WritableNativeArray();

        for (Object value : list) {
            if (value instanceof String) {
                writableArray.pushString((String) value);
            } else if (value instanceof Integer) {
                writableArray.pushInt((Integer) value);
            } else if (value instanceof Float || value instanceof Double) {
                writableArray.pushDouble((Double) value);
            } else if (value instanceof Boolean) {
                writableArray.pushBoolean((Boolean) value);
            } else if (value instanceof Map) {
                writableArray.pushMap(mapToWritableMap((Map) value));
            } else if (value instanceof List) {
                writableArray.pushArray(listToWritableArray((List) value));
            }
        }

        return writableArray;
    }


    public WritableMap mapToWritableMap(Map<String, Object> map) {
        WritableMap writableMap = new WritableNativeMap();

        for (String key : map.keySet()) {
            Object object = map.get(key);

            if (object instanceof Map) {
                writableMap.putMap(key, mapToWritableMap((Map) object));
            } else if (object instanceof List) {
                writableMap.putArray(key, listToWritableArray((List) object));
            } else if (object instanceof String) {
                writableMap.putString(key, (String) object);
            } else if (object instanceof Boolean) {
                writableMap.putBoolean(key, (Boolean) object);
            } else if (object instanceof Float || object instanceof Double) {
                writableMap.putDouble(key, (Double) object);
            } else if (object instanceof Integer) {
                writableMap.putInt(key, (Integer) object);
            }
        }

        return writableMap;
    }


    public WritableMap notificationDataToWritableMap(NotificationData notificationData) {
        WritableMap writableMap = new WritableNativeMap();

        writableMap.putString("title", notificationData.getTitle());
        writableMap.putString("summary", notificationData.getSummary());
        writableMap.putString("messageId", notificationData.getMessageId());
        writableMap.putString("imageUrl", notificationData.getImageUrl());
        writableMap.putString("iconUrl", notificationData.getIconUrl());

        if (notificationData.getCustomContent() != null) {
            writableMap.putMap("customContent", mapToWritableMap(notificationData.getCustomContent()));
        }

        writableMap.putString("content", notificationData.getContent());

        WritableArray buttonData = new WritableNativeArray();
        for (NotificationButtonData button : notificationData.getButtons()) {
            WritableMap map = new WritableNativeMap();
            map.putString("id", button.getId());
            map.putString("icon", button.getIcon());
            map.putString("text", button.getText());
            buttonData.pushMap(map);
        }

        writableMap.putArray("buttons", buttonData);
        writableMap.putString("bigTitle", notificationData.getBigTitle());
        writableMap.putString("bigIconUrl", notificationData.getBigIconUrl());
        writableMap.putString("bigContent", notificationData.getBigContent());

        return writableMap;
    }

}
