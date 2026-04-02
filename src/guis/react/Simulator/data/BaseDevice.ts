import { DeviceStoreState } from "../../../../stores/redux/presets/Device";

/**
 * 设备数据基类
 */
export default abstract class BaseDeviceData implements DeviceStoreState {
    declare public pad: boolean;
    declare public ios: boolean;
    declare public mobile: boolean;
    declare public wechat: boolean;
    declare public android: boolean;
    declare public desktop: boolean;
    declare public landscape: boolean;
}
