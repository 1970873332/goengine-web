import { Stack, StackProps } from "@mui/material";
import clsx from "clsx";
import { ReactNode } from "react";
import ViewComponent, {
    ViewComponentProps,
    ViewComponentState,
} from "../../View";

/**
 * 通用序列
 */
export default class CommonSequence extends ViewComponent<IProps, IState> {
    protected presetProps: Partial<IProps> = {
        center: true,
        autoPlay: true,
        startIndex: 0,
        updateRate: 1,
        iterationCount: -1,
        fixedFrame: "end",
    };

    state: Readonly<IState> = {
        visible: true,
        current: this.mergerProps.startIndex ?? 0,
    };

    /**
     * 帧id
     */
    protected interver?: number;
    /**
     * 更新计数器
     */
    protected updateCounter: number = 0;
    /**
     * 迭代计数器
     */
    protected iterationCount: number = 0;

    renderDefault(): ReactNode {
        return (
            <img
                src={`${this.mergerProps.path}${this.imageName()}`}
                className={clsx(!this.state.visible && "hidden", "max-h-full")}
            />
        );
    }

    renderCache(): ReactNode {
        return Array.from({ length: this.mergerProps.total }, (_, index) => (
            <img
                key={index}
                src={`${this.mergerProps.path}${this.imageName(index)}`}
                className={clsx(
                    (index !== this.state.current || !this.state.visible) &&
                        "hidden",
                    "max-h-full",
                )}
            />
        ));
    }

    render(): ReactNode {
        const {
            className: wrapClassName,
            alignItems,
            justifyContent,
            ...Rest
        } = this.mergerProps.wrapProps ?? {};

        return (
            <Stack
                className={clsx(
                    this.mergerProps.full && "size-full",
                    this.mergerProps.className,
                    wrapClassName,
                )}
                justifyContent={
                    (justifyContent ?? this.mergerProps.center)
                        ? "center"
                        : "flex-start"
                }
                alignItems={
                    (alignItems ?? this.mergerProps.center)
                        ? "center"
                        : "flex-start"
                }
                {...Rest}
            >
                {this.mergerProps.cache
                    ? this.renderCache()
                    : this.renderDefault()}
            </Stack>
        );
    }

    /**
     *  更新
     */
    protected update(): void {
        this.interver = requestAnimationFrame(this.update.bind(this));
        if (
            this.updateCounter === Math.floor(this.mergerProps.updateRate ?? 0)
        ) {
            this.updateCounter = 0;
            this.iteration();
        } else this.updateCounter++;
    }
    /**
     * 迭代
     */
    protected iteration(): void {
        const { current } = this.state;
        const { total, iterationCount } = this.mergerProps;
        const toEnd: boolean = current >= total - 1;
        if (toEnd) {
            this.iterationCount++;
            this.mergerProps.onIteration?.(this.iterationCount);
        }

        const iterationUp: boolean =
            iterationCount != -1 && this.iterationCount >= iterationCount!;
        if (iterationUp) {
            this.mergerProps.fixedFrame === "start" &&
                this.setState({ current: 0 });
            this.stop();
        } else this.setState({ current: toEnd ? 0 : current + 1 });
    }
    /**
     * 渲染图片
     * @returns
     */
    protected imageName(current: number = this.state.current): string {
        return (
            this.mergerProps.imageName?.(current, this.mergerProps.total) ??
            `${current}.png`
        );
    }
    /**
     * 停止播放
     */
    public stop(visible: boolean = true): void {
        this.setState({ visible });
        this.interver && cancelAnimationFrame(this.interver);
        delete this.interver;
    }
    /**
     * 播放
     */
    public play(): void {
        !this.interver && this.update();
    }

    protected async mountMain(): Promise<void> {
        this.mergerProps.autoPlay && this.play();
    }

    protected destory(): void {
        this.stop();
    }
}

interface IState extends ViewComponentState {
    /**
     * 当前帧
     */
    current: number;
    /**
     * 是否可见
     * @default true
     */
    visible: boolean;
}

interface IProps extends ViewComponentProps {
    /**
     * 是否自动播放
     * @default true
     */
    autoPlay?: boolean;
    /**
     * 图片路径
     */
    path: string;
    /**
     * 总帧数
     */
    total: number;
    /**
     * 开始帧
     * @default 0
     */
    startIndex?: number;
    /**
     * 迭代次数
     * @default -1
     */
    iterationCount?: number;
    /**
     * 更新频率（每*帧迭代更新）
     * @default 1
     */
    updateRate?: number;
    /**
     * 是否缓存
     * @default false
     */
    cache?: boolean;
    /**
     * 定格帧
     * @default "end"
     */
    fixedFrame?: "start" | "end";
    /**
     * 铺满
     * @default false
     */
    full?: boolean;
    /**
     * 居中
     * @default true
     */
    center?: boolean;
    /**
     * 容器属性
     */
    wrapProps?: StackProps;
    /**
     * 容器类名
     */
    className?: string;
    /**
     * 渲染
     * @param current
     * @param total
     * @returns
     */
    imageName?: (current: number, total: number) => string;
    /**
     * 迭代回调
     */
    onIteration?: (interationCount: number) => void;
}
