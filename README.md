
# Pushe React Native Module

Works for both Android and iOS platforms.

Pushe react native module is built on top of [Pushe native sdk for android][pushe-native-android-doc] and [Pushe native sdk for iOS][pushe-native-ios-doc] for *react native* platform.

[Click here to read The full documentation for *Pushe React Native* module][pushe-react-native-doc].


# Installation

To install the module run the following command in root of your project.

```bash
npm i -P pushe-react-native
```

> *Note:* If your project react native version is bellow 0.60.0 you should also run the `react-native link pushe-react-native` command.     
react native above 0.60.0 added [autolinking](https://facebook.github.io/react-native/blog/2019/07/03/version-60#native-modules-are-now-autolinked) so for the 0.60.0 and above versions do not run the *link* command.


# Usage

to use the this module you can import *Pushe* class like bellow.

```js
import Pushe from "pushe-react-native";
```

For further informations see the [documentation][pushe-react-native-doc].


# Demo App

There is a demo app available that implements the *Pushe React Native* module methods.
you can access this project in the following address here.
`https://github.com/pusheco/pushe-react-native/tree/master/PusheReactNativeDemoApp`.

# Issues

If there is any issue in the library or any related topics to this module, search or ask them in the github project [issue page][repo-issues].


[pushe-react-native-doc]: http://docs.pushe.co/docs/react-native/intro
[pushe-native-android-doc]: http://docs.pushe.co/docs/android-studio/intro/
[pushe-native-ios-doc]: http://docs.pushe.co/docs/ios/intro/
[repo-issues]: https://github.com/pusheco/pushe-react-native/issues