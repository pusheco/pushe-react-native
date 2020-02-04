#import "RNPushe.h"

@implementation RNPushe

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(subscribe:(NSString *)topic) {
    [PusheClient.shared subscribe:topic];
}

RCT_EXPORT_METHOD(unsubscribe:(NSString *)topic) {
    [PusheClient.shared unsubscribe:topic];
}

@end
