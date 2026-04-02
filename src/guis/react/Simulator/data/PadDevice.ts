import { DeviceStore } from "../../../../stores/redux/presets/Device";
import BaseDeviceData from "./BaseDevice";

/**
 * pad设备数据
 */
export default class PadDeviceData extends BaseDeviceData {
    constructor() {
        super();
        Object.assign(this, {
            ...DeviceStore.instance.getState(),
            pad: true,
            mobile: false,
            desktop: false,
        } as Partial<this>);
    }
}
