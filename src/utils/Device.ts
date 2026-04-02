import { DeviceStoreState } from "../stores/redux/presets/Device";

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
        device: DeviceStoreState | undefined,
        state: Partial<{ [key in keyof DeviceStoreState]: T[] }>,
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
        device: DeviceStoreState | undefined,
        state: Partial<{ [key in keyof DeviceStoreState]: T }>,
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
