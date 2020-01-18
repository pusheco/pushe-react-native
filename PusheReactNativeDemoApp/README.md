
# Demo Application for Pushe React Native

This demo app implements *Pushe React Native* module methods as an example on how to use the methods.

# Install & Usage

In order to install this demo app, after [cloning the project](git@github.com:pusheco/pushe-react-native.git) and *change directory into `PusheReactNativeDemoApp`* subdirectory.

Run `npm install` to install all dependencies.

Run `npm i -P pushe-react-native` command to install *Pushe*. (It's already installed by the way).

> *Note:* To check the features and run it in a device you need to create an application in your pushe console and add the provided manifest in the application Manifest.xml file

[How add manifest in the project](http://docs.pushe.co/docs/react-native/intro#%D8%A7%D8%B6%D8%A7%D9%81%D9%87%DA%A9%D8%B1%D8%AF%D9%86-%D9%85%D8%AD%D8%AA%D9%88%D8%A7%DB%8C-%D9%85%D8%A7%D9%86%DB%8C%D9%81%D8%B3%D8%AA).

Then after having your device connected to the system run the following commands in two separate terminals.

```bash
npm run start
```

```bash
npm run android
```

after downloading dependencies and build process the *demo app* will be installed in your device.

## Demo App develop progress

Demo app is already in development and is not completed yet.

These are list of available methods in the react native module and features that already have implemented (or not) in the *demo app* to show the usage.

- [x] Pushe.isInitialized
- [x] Pushe.isRegistered
- [x] Pushe.setUserEmail
- [x] Pushe.setUserPhoneNumber
- [x] Pushe.setCustomId
- [x] Pushe.getAndroidId
- [x] Pushe.getGoogleAdvertisingId
- [x] Pushe.getUserEmail
- [x] Pushe.getUserPhoneNumber
- [x] Pushe.getCustomId
- [x] Pushe.subscribe
- [x] Pushe.unsubscribeFromTopic
- [ ] Pushe.createNotificationChannel
- [ ] Pushe.removeNotificationChannel
- [ ] Pushe.addTags
- [ ] Pushe.removeTags
- [ ] Pushe.getSubscribedTags
- [ ] Pushe.sendNotificationToUser
- [ ] Pushe Events in foreground
- [ ] Pushe Events in background
- [ ] Pushe.disableNotifications
- [ ] Pushe.enableNotifications
- [ ] Pushe.sendEcommerceData
- [ ] Pushe.sendEvent
- [ ] Use multiple fcm services in the app