import { DeviceUtils } from "@core/utils/Device";
import { Store } from "redux";
import BaseStore, { BaseStoreAction } from "../Base";

enum EEvent {
    /**
     * 变更设备
     */
    CHANGE_DEVICE = "changeDevice",
}

/**
 * 设备状态
 */
export class DeviceStore extends BaseStore<IState, IData> {
    /**
     * 默认状态
     */
    public static get defualtState(): IState {
        return {
            desktop: DeviceUtils.desktop,
            mobile: DeviceUtils.mobile,
            pad: DeviceUtils.pad,
            ios: DeviceUtils.ios,
            android: DeviceUtils.android,
            wechat: DeviceUtils.weChat,
            landscape: DeviceUtils.landscape,
        };
    }
    /**
     * 设备状态实例
     */
    public static readonly instance: Store<IState, BaseStoreAction<IData>> =
        this.init();

    protected initialState: IState = DeviceStore.defualtState;

    protected todoReducer(
        state: IState = this.initialState,
        action: BaseStoreAction<IData, EEvent>,
    ): IState {
        const { data, callback } = action;
        switch (action.type) {
            case EEvent.CHANGE_DEVICE:
                Object.assign(state, data);
                break;
        }
        callback?.(data);
        return state;
    }
}

interface IState {
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

interface IData {
    [EEvent.CHANGE_DEVICE]?: Partial<IState>;
}

export { IState as DeviceStoreState };

/**
 * 变更设备
 * @param data
 * @param callback
 */
export function changeDevice(
    data?: IData[EEvent.CHANGE_DEVICE],
    callback?: () => void,
): void {
    DeviceStore.instance.dispatch({
        type: EEvent.CHANGE_DEVICE,
        data,
        callback,
    });
}
