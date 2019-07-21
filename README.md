
# -pushe

## Getting started

`$ npm install -pushe --save`

### Mostly automatic installation

`$ react-native link -pushe`

### Notes:

1.Check if bellow line is added in your app manifest, if not add it:

    ```xml
        <service android:name="co.pushe.plus.RNPusheNotificationService" />
    ```

2.Add bellow line in build.gradle

    ```gradle
        maven {
            url "https://dl.bintray.com/pushe/plus"
        }
    ```

3.To run the background service add bellow line in "your_package_name.MainApplication#onCreate" address:

    ```java
        co.pushe.plus.RNPushe.initializeEventListeners(this);
    ```

4.In order to work with background service create a folder with desired name and export it like this:

    ```javascript
        module.exports = async (notificationData) => {
            // do stuff
        };
    ```

    and also in your react app index.js add this line:

    ```javascript
        AppRegistry.registerHeadlessTask('RNPusheNotificationService', () => require('file_name'));
    ```

