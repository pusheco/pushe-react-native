#import "RNPushe.h"
@import Pushe;

@implementation RNPushe

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(start:(NSString *)appId) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [PusheClient.shared start:appId];
    });
}

RCT_EXPORT_METHOD(subscribe:(NSString *)topic) {
    [PusheClient.shared subscribe:topic];
}

RCT_EXPORT_METHOD(unsubscribe:(NSString *)topic) {
    [PusheClient.shared unsubscribe:topic];
}

@end
