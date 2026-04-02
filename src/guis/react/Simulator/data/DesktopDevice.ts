import { DeviceStore } from "../../../../stores/redux/presets/Device";
import BaseDeviceData from "./BaseDevice";

/**
 * 桌面设备数据
 */
export default class DesktopDeviceData extends BaseDeviceData {
    constructor() {
        super();
        Object.assign(this, {
            ...DeviceStore.instance.getState(),
            pad: false,
            mobile: false,
            desktop: true,
        } as Partial<this>);
    }
}
