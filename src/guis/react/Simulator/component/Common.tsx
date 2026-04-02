import { EventState } from "@core/supplements/Event";
import ScreenRotationIcon from "@mui/icons-material/ScreenRotation";
import { Box, Container, Stack, Typography } from "@mui/material";
import { createRef, ReactNode, RefObject } from "react";
import {
    DeviceStore,
    DeviceStoreState,
} from "../../../../stores/redux/presets/Device";
import ViewComponent, {
    ViewComponentProps,
    ViewComponentState,
} from "../../View";

/**
 * 通用模拟器
 */
export default class CommonSimulator extends ViewComponent<IProps, IState> {
    state: Readonly<IState> = {
        rotation: false,
    };

    /**
     * iframe
     */
    protected iframeRef: RefObject<HTMLIFrameElement | null> = createRef();
    /**
     * 容器
     */
    protected containerRef: RefObject<HTMLDivElement | null> = createRef();

    protected messageState: EventState<WindowEventMap> = new EventState(
        this.iframeRef.current?.contentWindow,
        "message",
        this.handleMessage.bind(this),
    );

    render(): ReactNode {
        const {
            width,
            height,
            scale = this.mergerProps.scale ?? 1,
        } = this.mergerProps;
        const { rotation } = this.state;

        return (
            <Box className="w-max">
                <Typography fontFamily="KaiTi">
                    {this.mergerProps.title}
                </Typography>
                <Stack direction="row">
                    <Container
                        ref={this.containerRef}
                        maxWidth={false}
                        style={{
                            width: `${(rotation ? height : width) * scale}px`,
                            height: `${(rotation ? width : height) * scale}px`,
                            padding: "0",
                        }}
                        className="soild-border-round overflow-hidden"
                    >
                        <iframe
                            ref={this.iframeRef}
                            width="100%"
                            height="100%"
                            src={`${location.origin}${location.pathname}#${this.mergerProps.router ?? ""}`}
                            onLoad={this.iframeLoad.bind(this)}
                        />
                    </Container>
                    <Stack
                        direction="column"
                        gap={2}
                        className="soild-border-round min-w-10 p-2"
                    >
                        <ScreenRotationIcon
                            titleAccess="屏幕旋转"
                            className="touchable"
                            onClick={this.screenRotation.bind(this)}
                        />
                    </Stack>
                </Stack>
            </Box>
        );
    }

    /**
     * 消息
     * @param event
     */
    protected handleMessage(event: MessageEvent): void {
        this.mergerProps.onMessage?.(event);
    }

    /**
     * 添加iframe消息
     */
    protected addIframeOnMessage(): void {
        if (this.iframeRef.current) {
            const iframeWindow = this.iframeRef.current.contentWindow;
            if (iframeWindow != null) {
                Object.assign(iframeWindow, {
                    DeviceState: {
                        ...DeviceStore.instance.getState(),
                        ...this.mergerProps.device,
                    },
                } as Partial<Window | typeof globalThis>);
                this.messageState.wake();
            }
        }
    }
    /**
     * iframe加载完成
     */
    protected iframeLoad(): void {
        this.addIframeOnMessage();
        const document: Document | null =
            this.iframeRef.current?.contentDocument ?? null;
        if (document != null) {
            const { documentElement } = document;
            const { rotation } = this.state;
            const body: HTMLBodyElement | null =
                documentElement.querySelector("body");
            if (body != null) {
                body.style.width = `${rotation ? this.mergerProps.height : this.mergerProps.width}px`;
                body.style.height = `${rotation ? this.mergerProps.width : this.mergerProps.height}px`;
                body.style.transform = `scale(${this.mergerProps.scale ?? 1})`;
                body.style.transformOrigin = "left top";
                documentElement.style.width = `${body.offsetWidth}px`;
                documentElement.style.height = `${body.offsetHeight}px`;
            }
        }
    }
    /**
     * 屏幕旋转
     */
    protected screenRotation(): void {
        this.setState(
            {
                rotation: !this.state.rotation,
            },
            this.iframeLoad.bind(this),
        );
    }

    componentDidUpdate(
        prevProps: Readonly<IProps>,
        prevState: Readonly<IState>,
        snapshot?: any,
    ): void {
        if (prevProps.router != this.mergerProps.router)
            this.iframeRef.current?.contentWindow?.location.reload();
    }

    protected destory(): void {
        this.messageState.break();
    }
}

interface IState extends ViewComponentState {
    rotation: boolean;
}

interface IProps extends ViewComponentProps {
    /**
     * 宽度
     */
    width: number;
    /**
     * 高度
     */
    height: number;
    /**
     * 缩放比例
     */
    scale?: number;
    /**
     * 路由
     */
    router?: string;
    /**
     * 自定义设备信息
     */
    device: Partial<DeviceStoreState>;
    /**
     * 标题
     */
    title?: string;
    /**
     * 消息
     * @param event
     * @returns
     */
    onMessage?: (event: MessageEvent) => void;
}

export { IProps as CommonSimulatorProps, IState as CommonSimulatorState };
