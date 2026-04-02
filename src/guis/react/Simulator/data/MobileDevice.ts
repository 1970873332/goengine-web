import { DeviceStore } from "../../../../stores/redux/presets/Device";
import BaseDeviceData from "./BaseDevice";

/**
 * 移动设备数据
 */
export default class MobileDeviceData extends BaseDeviceData {
    constructor() {
        super();
        Object.assign(this, {
            ...DeviceStore.instance.getState(),
            ios: true,
            pad: false,
            mobile: true,
            android: true,
            desktop: false,
        } as Partial<this>);
    }
}
