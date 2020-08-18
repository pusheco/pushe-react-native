#import "RNPushe.h"

@implementation RNPushe

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(configure) {
    [PusheClient.shared configure];
}

RCT_REMAP_METHOD(isRegistered,
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    NSNumber *result = [NSNumber numberWithBool:[PusheClient.shared isRegistered]];
    resolve(result);
}

RCT_REMAP_METHOD(getAPNsTokenAsString,
                 getAPNsTokenAsString_resolver:(RCTPromiseResolveBlock)resolve
                 getAPNsTokenAsString_rejecter:(RCTPromiseRejectBlock)reject) {
    NSString *apnsToken = [PusheClient.shared getAPNsTokenAsString];
    resolve(apnsToken);
}

RCT_REMAP_METHOD(getDeviceId,
                 getDeviceId_resolver:(RCTPromiseResolveBlock)resolve
                 getDeviceId_rejecter:(RCTPromiseRejectBlock)reject) {
    NSString *deviceId = [PusheClient.shared getDeviceId];
    resolve(deviceId);
}

RCT_REMAP_METHOD(getAdvertisingId,
                 getAdvertisingId_resolver:(RCTPromiseResolveBlock)resolve
                 getAdvertisingId_rejecter:(RCTPromiseRejectBlock)reject) {
    NSString *advertisingId = [PusheClient.shared getAdvertisingId];
    resolve(advertisingId);
}

RCT_EXPORT_METHOD(subscribeToTopic:(NSString *)topic) {
    [PusheClient.shared subscribe:topic];
}

RCT_EXPORT_METHOD(subscribe:(NSString *)topic
                  subscribe_resolver:(RCTPromiseResolveBlock)resolve
                  subscribe_rejecter:(RCTPromiseRejectBlock)reject)
{
    [PusheClient.shared subscribe:topic :^(NSError * error) {
        if (error == nil) {
            NSString *result = @"success";
            resolve(result);
        } else {
            reject(error.localizedDescription, error.localizedFailureReason, error);
        }
    }];
}

RCT_EXPORT_METHOD(unsubscribeFromTopic:(NSString *)topic) {
    [PusheClient.shared unsubscribe:topic];
}

RCT_EXPORT_METHOD(unsubscribe:(NSString *)topic
                  unsubscribe_resolver:(RCTPromiseResolveBlock)resolve
                  unsubscribe_rejecter:(RCTPromiseRejectBlock)reject)
{
    [PusheClient.shared unsubscribe:topic :^(NSError * error) {
        if (error == nil) {
            NSString *result = @"success";
            resolve(result);
        } else {
            reject(error.localizedDescription, error.localizedFailureReason, error);
        }
    }];
}

RCT_REMAP_METHOD(getSubscribedTopics,
                 getSubscribedTopics_resolver:(RCTPromiseResolveBlock)resolve
                 getSubscribedTopics_rejecter:(RCTPromiseRejectBlock)reject) {
    NSArray *result = [PusheClient.shared getSubscribedTopics];
    resolve(result);
}

RCT_EXPORT_METHOD(addTags:(NSDictionary * _Nonnull)dictionary) {
    NSArray *keys = [RCTConvert NSStringArray:dictionary.allKeys];
    NSArray *values = [RCTConvert NSStringArray:dictionary.allValues];
    if (keys != NULL && keys.count > 0 && values != NULL && values.count > 0) {
        [PusheClient.shared addTags:dictionary];
    } else {
        NSLog(@"malforemed data for addTags: Dictionary of strings to strings expected");
    }
}

RCT_EXPORT_METHOD(removeTags:(NSArray<NSString *> * _Nonnull)keys) {
    NSArray *stringKeys = [RCTConvert NSStringArray:keys];
    if (stringKeys != NULL && stringKeys.count > 0) {
        [PusheClient.shared removeTags:stringKeys];
    } else {
        NSLog(@"malfored data for removeTags: Array of strings expected");
    }
}

RCT_REMAP_METHOD(getSubscribedTags,
                 getSubscribedTags_resolver:(RCTPromiseResolveBlock)resolve
                 getSubscribedTags_rejecter:(RCTPromiseRejectBlock)reject) {
    NSDictionary<NSString *, NSString *> * _Nonnull result = [PusheClient.shared getSubscribedTags];
    resolve(result);
}

RCT_EXPORT_METHOD(sendEvent:(NSString * _Nonnull)name action:(NSString * _Nonnull)action data:(NSDictionary *)data) {
    EventAction eventAction;
    if ([action isEqualToString:@"sign_up"]) {
        eventAction = EventActionSignUp;
    } else if ([action isEqualToString:@"login"]) {
        eventAction = EventActionLogin;
    } else if ([action isEqualToString:@"purchase"]) {
        eventAction = EventActionPurchase;
    } else if ([action isEqualToString:@"achievement"]) {
        eventAction = EventActionAchievement;
    } else if ([action isEqualToString:@"level"]) {
        eventAction = EventActionLevel;
    } else {
        eventAction = EventActionCustom;
    }
    
    Event * _Nonnull event = [[Event alloc] initWithName:name action:eventAction data:data];
    [PusheClient.shared sendEvent:event];
}

@end
