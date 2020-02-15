How to Develope:
-----

1. clone react-native plugin
2. create dummy demo app with running:
    npx react-native init DummyRNApp
3. add react-native plugin as dependency for demo app with running this command in root of demo app:
    npm install <path to package.json of plugin>
4. delete tv os targets for dummy app and fix Podfile accordingly
5. add Notification service extension target to xcodeproj file and add it to Podfile:
    target 'DummyNSE' do
        pod 'Pushe'
    end
6. add signing certificates for all targets
7. add notification and background mode capabilities
8. remove .xcworkspace, Podfile.lock and Pods, add use_frameworks! accroding to this link:
    https://stackoverflow.com/a/53206026/11921619
9. run 'pod install' in ios directory of dummy app
10. add swift bridging header to project and check it's membership for both main and notification-service-extension
11. you can run code like this:
    - const App: () => React$Node = () => {
          console.log("zereshk");
          ...
      }
    - <Button
              title="Press me"
              onPress={() => { 
                           console.log("button212");
                           console.log("run your code here"); }} />
    - <Button
              title="Press me"
              onPress={() => { 
                           console.log("button action --> ");
                           Pushe.getDeviceId().then(resp => console.log(resp))                   
                                              .catch((error) => console.log("deviceId is nil"));
                  

                           console.log("----------------> dooone"); }} />

12. use development pods to edit plugin code and move that code to plugin sources before reinstalling node_modules and pods
    for testing new code
13. do firebase stuff
14. get appid from console.pushe and add it to info.plist
-----
How to release Release:

1. make sure to update Pushe version for dependency of PusheRCT.podspec
2. push ios sources to github with proper tags and versions


-----
disable fcm swizzling


