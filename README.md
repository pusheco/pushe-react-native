
# -pushe

## Getting started

`$ npm install -pushe --save`

### Mostly automatic installation

`$ react-native link -pushe`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `-pushe` and add `Pushe.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libPushe.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import co.ronash.PushePackage;` to the imports at the top of the file
  - Add `new PushePackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':-pushe'
  	project(':-pushe').projectDir = new File(rootProject.projectDir, 	'../node_modules/-pushe/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':-pushe')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `Pushe.sln` in `node_modules/-pushe/windows/Pushe.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Pushe.Pushe;` to the usings at the top of the file
  - Add `new PushePackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import Pushe from '-pushe';

// TODO: What to do with the module?
Pushe;
```
  