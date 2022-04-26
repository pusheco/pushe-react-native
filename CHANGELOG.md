# Changelog

## 2.6.0
### Android
- Update native dependency to `2.6.3`
  - Includes all fixes of `2.6.3` but not API changes. That will be done in `>=2.6.1` of plugin
- [**Breaking**]: Remove inAppMessaging code from pushe package. This is because the whole module will not be used until 
 a release where InAppMessaging is actually supported. It is not now.

## 2.5.0
### Android
- Update native dependency to `2.5.0`
  - **New**: Adds ability to ignore showing notification if app is open (either all notifications or individually using `show_foreground`)
  - **New**: Location and Geofencing features are applied to `hms` module. Huawei devices can have location-related features
  - Bug fixes and improvements
- **Feat:** New APIs for notification foreground awareness
  - `enableNotificationForceForegroundAware`: Force enable foreground awareness for all notifications
  - `disableNotificationForceForegroundAware`: Disable what was enabled by above function
  - `isForceForegroundAware`: Is enabled or not
- Added `Pushe.getFcmToken` and `Pushe.getHmsToken` to return modules tokens

## 2.4.3
### Android
- Fix issue when building project.
## 2.4.2
- Update native dependency to `2.4.2-alpha06` which fixes an internal dependency issue.
- Improvement in notification module
- Improvement in registration state

## 2.4.1
### Android
- Update native dependency to `2.4.1` which contains:
  - Fix bugs in registration
  - API change for `GoogleAdvertisingId` to `AdvertisingId` supporting Huawei `OAID` for `hms` module
  - Fix `hms` bugs

### iOS
- Unchanged

## 2.4.0
### Android
- Update native to `2.4.1-beta05` which contains:
    - Added `hms` native module to handle push notification for Huawei devices by using HMS-Core instead of GPlay
    - Bug fixes and improvements

## 2.2.2
### iOS (1.0.16)
- updated to work with manifest-key and app-groups in ios sdk

## 2.2.1
- Fixed issue with notification button click listeners not passing clicked button data

## 2.2.0
### Android (2.2.0)
- Add module **InAppMessaging** for Android

### iOS (1.0.10)
- Method `Pushe.initialize` is not needed in order to support new iOS versions and forward-compatibility
