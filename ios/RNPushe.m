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

RCT_EXPORT_METHOD(subscribe:(NSString *)topic) {
    [PusheClient.shared subscribe:topic];
}

RCT_EXPORT_METHOD(unsubscribe:(NSString *)topic) {
    [PusheClient.shared unsubscribe:topic];
}

@end
