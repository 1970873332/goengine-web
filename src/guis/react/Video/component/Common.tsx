import { Box } from "@mui/material";
import clsx from "clsx";
import {
    ComponentPropsWithoutRef,
    createRef,
    ReactNode,
    RefObject,
    SyntheticEvent,
} from "react";
import ViewComponent, {
    ViewComponentProps,
    ViewComponentSlot,
    ViewComponentState,
} from "../../View";

/**
 * 通用视频
 */
export default class CommonVideo extends ViewComponent<IProps, IState> {
    state: Readonly<IState> = {
        playing: false,
        canplay: false,
    };

    protected videoRef: RefObject<HTMLVideoElement | null> = createRef();

    public get video(): HTMLVideoElement | null {
        return this.videoRef.current;
    }

    render(): ReactNode {
        const { toggle, className, wrapProps, slotProps, slotNodes, ...Rest } =
            this.mergerProps;

        return (
            <Box
                position="relative"
                onClick={toggle ? this.toggle.bind(this) : void 0}
                {...wrapProps}
            >
                <video
                    loop
                    playsInline
                    controls={false}
                    ref={this.videoRef}
                    preload="metadata"
                    webkit-playsinline="true"
                    className={clsx("size-full", className)}
                    onPlay={() => {
                        this.handleChangeVideoPlay();
                        this.mergerProps.onPlay?.();
                    }}
                    onPause={() => {
                        this.handleChangeVideoPause();
                        this.mergerProps.onPause?.();
                    }}
                    onCanPlay={(event) => {
                        this.handleChangeVideoCanPlay(event);
                        this.mergerProps.onCanPlay?.();
                    }}
                    {...Rest}
                />
                {!this.state.playing &&
                    (slotNodes?.play ?? (
                        <img
                            className="absolute-full m-auto max-w-[20%] pointer-events-none"
                            {...slotProps?.play}
                        />
                    ))}
            </Box>
        );
    }

    protected handleChangeVideoPause(): void {
        this.setState({ playing: false });
    }

    protected handleChangeVideoPlay(): void {
        this.setState({ playing: true, canplay: true });
    }

    protected handleChangeVideoCanPlay(event: SyntheticEvent): void {
        event.preventDefault();
        this.state.canplay && this.video?.play();
    }

    public play(): void {
        if (!this.state.canplay)
            this.setState({ canplay: true }, () => this.video?.load());
        else if (!this.state.playing) this.video?.play();
    }

    public pause(reload?: boolean): void {
        reload && this.setState({ canplay: false });
        this.state.playing && this.video?.pause();
        this.handleChangeVideoPause();
    }

    public toggle(): void {
        this.state.playing ? this.pause() : this.play();
    }

    public beginPlay(): void {
        if (this.video) this.video.currentTime = 0;
        this.play();
    }
}

interface IState extends ViewComponentState {
    /**
     * 是否播放中
     */
    playing: boolean;
    /**
     * 是否可以播放
     */
    canplay: boolean;
}

interface IProps
    extends ViewComponentProps<ISlot>, ComponentPropsWithoutRef<"video"> {
    /**
     * 容器属性
     */
    wrapProps?: ComponentPropsWithoutRef<typeof Box>;
    /**
     * 点击切换
     */
    toggle?: boolean;
    /**
     * 播放
     * @returns
     */
    onPlay?: () => void;
    /**
     * 暂停
     * @returns
     */
    onPause?: () => void;
    /**
     * 可以播放
     * @returns
     */
    onCanPlay?: () => void;
}

interface ISlot extends ViewComponentSlot {
    /**
     * 播放
     */
    play: Slot<ComponentPropsWithoutRef<"img">>;
}

export { IProps as CommonVideoProps, ISlot as CommonVideoSlot };
