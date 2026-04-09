/**
 * 设备工具
 */
export class DeviceUtils {
    /**
     * 设备切换
     * @param device
     * @param state
     * @returns
     */
    public static deviceToggle<T = unknown>(
        device: Device | undefined,
        state: Partial<{ [key in keyof Device]: T[] }>,
    ): T {
        const { mobile, pad, landscape } = device ?? {};
        const {
            mobile: mobileState,
            pad: padState,
            desktop: desktopState,
        } = state;
        const [mobileDefaultState, mobileAnotherState] = mobileState ?? [];
        const [padDefaultState, padAnotherState] = padState ?? [];
        const [desktopDefaultState, desktopAnotherState] = desktopState ?? [];
        if (mobileState !== void 0 && mobile) {
            return landscape
                ? (mobileAnotherState ?? mobileDefaultState)
                : mobileDefaultState;
        } else if (padState !== void 0 && pad) {
            return landscape
                ? padDefaultState
                : (padAnotherState ?? padDefaultState);
        }
        return landscape
            ? desktopDefaultState
            : (desktopAnotherState ?? desktopDefaultState);
    }
    /**
     * 横屏设备切换
     * @param device
     * @param state
     * @returns
     */
    public static deviceOnlyToggle<T = unknown>(
        device: Device | undefined,
        state: Partial<{ [key in keyof Device]: T }>,
    ): T {
        const { mobile, pad } = device ?? {};
        const {
            mobile: mobileState,
            pad: padState,
            desktop: desktopState,
        } = state;
        if (mobileState !== void 0 && mobile) {
            return mobileState;
        } else if (padState !== void 0 && pad) {
            return padState;
        }
        return desktopState! ?? padState! ?? mobileState!;
    }
}

export interface Device {
    /**
     * 是否桌面端
     */
    desktop: boolean;
    /**
     * 是否移动端
     */
    mobile: boolean;
    /**
     * 是否Pad端
     */
    pad: boolean;
    /**
     * 是否IOS设备
     */
    ios: boolean;
    /**
     * 是否安卓设备
     */
    android: boolean;
    /**
     * 是否微信环境
     */
    wechat: boolean;
    /**
     * 是否横屏
     */
    landscape: boolean;
}