#import "RNPushe.h"

@implementation RNPushe

RCT_EXPORT_MODULE();

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
    if (apnsToken != nil) {
        resolve(apnsToken);
    } else {
        reject(nil, nil, nil);
    }
}

RCT_REMAP_METHOD(getDeviceId,
                 getDeviceId_resolver:(RCTPromiseResolveBlock)resolve
                 getDeviceId_rejecter:(RCTPromiseRejectBlock)reject) {
    NSString *deviceId = [PusheClient.shared getDeviceId];
    if (deviceId != nil) {
        resolve(deviceId);
    } else {
        reject(nil, nil, nil);
    }
}

RCT_REMAP_METHOD(getAdvertisingId,
                 getAdvertisingId_resolver:(RCTPromiseResolveBlock)resolve
                 getAdvertisingId_rejecter:(RCTPromiseRejectBlock)reject) {
    NSString *advertisingId = [PusheClient.shared getAdvertisingId];
    resolve(advertisingId);
}

RCT_EXPORT_METHOD(subscribe:(NSString *)topic) {
    [PusheClient.shared subscribe:topic];
}

RCT_EXPORT_METHOD(subscribe:(NSString *)topic
                  subscribe_resolver:(RCTPromiseResolveBlock)resolve
                  subscribe_rejecter:(RCTPromiseRejectBlock)reject)
{
    [PusheClient.shared subscribe:topic :^(NSError * error) {
        if (error == nil) {
            resolve(nil);
        } else {
            reject(nil, nil, error);
        }
    }];
}

RCT_EXPORT_METHOD(unsubscribe:(NSString *)topic) {
    [PusheClient.shared unsubscribe:topic];
}

RCT_EXPORT_METHOD(unsubscribe:(NSString *)topic
                  unsubscribe_resolver:(RCTPromiseResolveBlock)resolve
                  unsubscribe_rejecter:(RCTPromiseRejectBlock)reject)
{
    [PusheClient.shared unsubscribe:topic :^(NSError * error) {
        if (error == nil) {
            resolve(nil);
        } else {
            reject(nil, nil, error);
        }
    }];
}

RCT_REMAP_METHOD(getSubscribedTopics,
                 getSubscribedTopics_resolver:(RCTPromiseResolveBlock)resolve
                 getSubscribedTopics_rejecter:(RCTPromiseRejectBlock)reject) {
    NSArray *result = [PusheClient.shared getSubscribedTopics];
    resolve(result);
}

RCT_EXPORT_METHOD(addTags:(NSDictionary<NSString *, NSString *> * _Nonnull)dictionary) {
    [PusheClient.shared addTags:dictionary];
}

RCT_EXPORT_METHOD(removeTags:(NSArray<NSString *> * _Nonnull)keys) {
    [PusheClient.shared removeTags:keys];
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