import EStyleSheet from 'react-native-extended-stylesheet';
import {Dimensions, Platform, PixelRatio, StyleSheet} from 'react-native';
const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
} = Dimensions.get('window');
const scale =  SCREEN_WIDTH / 360;
let size_scale = scale;
if (scale > 2) {
    size_scale = scale * 0.666;
}
export function normalize(size) {
    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(size_scale * size));
    } else {
      return Math.round(PixelRatio.roundToNearestPixel(size_scale * size))
    }
}

export function getTabHeight() {
    if (Platform.OS === 'ios') {
        return 110;
      } else {
        return 70;
      }
}

export function getScreenHeight() {
    return SCREEN_HEIGHT - normalize(60);
}

export function getScreenWidth() {
    return SCREEN_WIDTH;
}

export const fonts = EStyleSheet.create({
    size10: { fontSize: normalize(10), lineHeight: normalize(10) },
    size11: { fontSize: normalize(11), lineHeight: normalize(11) },
    size12: { fontSize: normalize(12), lineHeight: normalize(12) },
    size13: { fontSize: normalize(13), lineHeight: normalize(13) },
    size14: { fontSize: normalize(14), lineHeight: normalize(14) },
    size15: { fontSize: normalize(15), lineHeight: normalize(15) },
    size16: { fontSize: normalize(16), lineHeight: normalize(16) },
    size18: { fontSize: normalize(18), lineHeight: normalize(18) },
    size20: { fontSize: normalize(20), lineHeight: normalize(20) },
    size32: { fontSize: normalize(32), lineHeight: normalize(32) },
    size43: { fontSize: normalize(43), lineHeight: normalize(43) }
});
