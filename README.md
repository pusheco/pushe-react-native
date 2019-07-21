
#

## Getting started

`$ npm i -P pushe-plus-react-native`

### Mostly automatic installation

`$ react-native link pushe-plus-react-native`

### Some Notes:

* Check if bellow line is added in your app manifest, if not add it:

    ```xml
    <service android:name="co.pushe.plus.RNPusheNotificationService" />
    ```

* Add bellow line in build.gradle

    ```gradle
    maven {
        url "https://dl.bintray.com/pushe/plus"
    }
    ```

* To run the background service add bellow line in "your_package_name.MainApplication#onCreate" address:

    ```java
    co.pushe.plus.RNPushe.initializeEventListeners(this);
    ```

* In order to work with background service create a folder with desired name and export it like this:

    ```javascript
    module.exports = async (notificationData) => {
        // do stuff
    };
    ```

    and also in your react app index.js add this line:

    ```javascript
    AppRegistry.registerHeadlessTask('RNPusheNotificationService', () => require('file_name'));
    ```

