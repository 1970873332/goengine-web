import TaskComponent from "@core/components/Task";
import { EventState } from "@core/supplements/Event";
import { Component, createRef, ReactNode, RefObject } from "react";
import { Unsubscribe } from "redux";
import {
    DeviceStore,
    DeviceStoreState,
} from "../../stores/redux/presets/Device";
import {
    LanguageStore,
    LanguageStoreState,
} from "../../stores/redux/presets/Language";

/**
 * 视图组件
 */
export default abstract class ViewComponent<
    P extends IProps = IProps,
    S extends IState = IState,
    SS = any,
> extends Component<P, S, SS> {
    /**
     * 任务类
     */
    declare protected task: TaskComponent<any>;
    /**
     * 预设属性
     */
    protected presetProps: Partial<P> = {};

    /**
     * 取消订阅设备信息
     */
    protected unsubscribeDevice?: Unsubscribe;
    /**
     * 取消订阅语言信息
     */
    protected unsubscribeLanguage?: Unsubscribe;

    /**
     * 设备信息
     */
    protected get device(): DeviceStoreState | undefined {
        return this.state?.device;
    }
    /**
     * 语言信息
     */
    protected get language(): LanguageStoreState | undefined {
        return this.state?.language;
    }
    /**
     * 合并props
     */
    public get mergerProps(): P {
        return { ...this.presetProps, ...this.props };
    }

    /**
     * 状态
     */
    declare state: Readonly<S>;
    /**
     * 属性
     */
    declare props: Readonly<P>;

    /**
     * 界面尺寸
     */
    protected readonly boundsRef: RefObject<any | null> = createRef();

    /**
     * 前置卸载状态
     */
    protected readonly beforeunloadState: EventState<WindowEventMap> =
        new EventState(window, "beforeunload", this.beforeunload.bind(this));

    /**
     * 渲染
     * @returns
     */
    render(): ReactNode {
        return <></>;
    }

    /**
     * 订阅设备信息
     */
    protected subscribeDevice(): void {
        this.setState({ device: DeviceStore.instance.getState() });
    }
    /**
     * 订阅语言信息
     */
    protected subscribeLanguage(): void {
        this.setState({ language: LanguageStore.instance.getState() });
    }
    /**
     * 挂载入口类
     */
    protected async mountMain(): Promise<void> {}
    /**
     * 销毁入口类
     */
    protected destory(): void {}
    /**
     * 前置卸载
     * @param event
     */
    protected beforeunload(event: BeforeUnloadEvent): void {}
    /**
     * 挂载
     * @Super
     */
    componentDidMount(): void {
        this.device &&
            (this.unsubscribeDevice = DeviceStore.instance.subscribe(
                this.subscribeDevice.bind(this),
            ));
        this.language &&
            (this.unsubscribeLanguage = LanguageStore.instance.subscribe(
                this.subscribeLanguage.bind(this),
            ));
        this.beforeunloadState.wake();
        this.mountMain();
    }
    /**
     * 卸载
     * @Super
     */
    componentWillUnmount(): void {
        this.unsubscribeDevice?.();
        this.unsubscribeLanguage?.();
        this.beforeunloadState.break();
        this.task?.destroy();
        this.destory();
    }
}

interface IState {
    /**
     * 设备信息
     */
    device?: DeviceStoreState;
    /**
     * 语言信息
     */
    language?: LanguageStoreState;
}

interface IProps<T extends Record<any, Slot | SlotOnlyProps> = {}> {
    /**
     * 当前页
     */
    active?: boolean;
    /**
     * 插槽节点
     */
    slotNodes?: ExtractSlotTarget<T>;
    /**
     * 插槽属性
     */
    slotProps?: Extract.ExtractProperty<T, "props">;
}

interface ISlot extends Record<any, Slot | SlotOnlyProps> {}

export {
    IProps as ViewComponentProps,
    ISlot as ViewComponentSlot,
    IState as ViewComponentState,
};
