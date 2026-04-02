import { DocumentUtils } from "@core/utils/Document";
import { RequestUtils } from "@core/utils/Request";
import clsx from "clsx";
import {
    ComponentPropsWithoutRef,
    createRef,
    ReactNode,
    RefObject,
    SyntheticEvent,
} from "react";
import { createRoot, Root } from "react-dom/client";
import CommonVideo, { CommonVideoProps } from "../../Video/component/Common";
import ViewComponent, {
    ViewComponentProps,
    ViewComponentState,
} from "../../View";

/**
 * 通用画布
 */
export default class CommonCanvas extends ViewComponent<IProps, IState> {
    state: Readonly<IState> = {};

    protected box: HTMLDivElement = DocumentUtils.instructBox;
    protected root: Root = createRoot(this.box);
    protected offScreenCanvas: HTMLCanvasElement =
        document.createElement("canvas");
    protected offScreenCtx: CanvasRenderingContext2D | null =
        this.offScreenCanvas.getContext("2d", { willReadFrequently: true });

    protected canvasRef: RefObject<HTMLCanvasElement | null> = createRef();
    protected imageRef: RefObject<HTMLImageElement | null> = createRef();
    protected commonVideoRef: RefObject<CommonVideo | null> = createRef();

    protected animationFrame: number = 0;
    protected ctx2D: CanvasRenderingContext2D | null = null;

    renderVideo(): ReactNode {
        return (
            <CommonVideo
                ref={this.commonVideoRef}
                src={this.mergerProps.src}
                {...this.mergerProps.videoProps}
                onLoadedMetadata={this.ready.bind(this)}
            />
        );
    }

    renderImage(): ReactNode {
        return (
            <img
                ref={this.imageRef}
                src={this.mergerProps.src}
                {...this.mergerProps.imageProps}
                onLoad={this.ready.bind(this)}
            />
        );
    }

    render(): ReactNode {
        const {
            src,
            filter,
            videoProps,
            imageProps,
            sourceType,
            className,
            ...Rest
        } = this.mergerProps;

        return (
            <canvas
                ref={this.canvasRef}
                width={this.state.renderWidth}
                height={this.state.renderHeight}
                className={clsx("max-w-full object-contain", className)}
                {...Rest}
            />
        );
    }

    /**
     * 加载资源
     * @returns
     */
    protected loadResource(): void {
        cancelAnimationFrame(this.animationFrame);
        if (this.mergerProps.sourceType) return this.switchRender();
        this.mergerProps.src &&
            RequestUtils.FETCH(this.mergerProps.src, void 0, (res) =>
                res.blob(),
            ).then((response) => this.switchRender(response.type));
    }
    /**
     * 选择渲染
     * @param type
     */
    protected switchRender(type?: string): void {
        const target: string | undefined = type ?? this.mergerProps.sourceType;
        if (target?.match(/video/)) this.root.render(this.renderVideo());
        else if (target?.match(/image/)) this.root.render(this.renderImage());
    }
    /**
     * 准备就绪
     * @param event
     */
    protected ready(
        event: SyntheticEvent<HTMLVideoElement | HTMLImageElement>,
    ): void {
        const { target } = event;
        if (target instanceof HTMLVideoElement) {
            const { videoWidth, videoHeight } = target;
            this.setState({
                renderWidth: videoWidth,
                renderHeight: videoHeight,
            });
        } else if (target instanceof HTMLImageElement) {
            const { naturalWidth, naturalHeight } = target;
            this.setState({
                renderWidth: naturalWidth,
                renderHeight: naturalHeight,
            });
        }
        this.draw();
    }
    /**
     * 绘制
     */
    protected draw(): void {
        cancelAnimationFrame(this.animationFrame);
        const canvas = this.canvasRef.current;
        if (canvas) {
            const image = this.imageRef.current;
            const video = this.commonVideoRef.current?.video;

            this.ctx2D ??= canvas.getContext("2d", {
                willReadFrequently: true,
            });
            this.ctx2D?.clearRect(0, 0, canvas.width, canvas.height);

            this.ctx2D?.drawImage(
                this.formatSource(image ?? video),
                0,
                0,
                canvas.width,
                canvas.height,
            );
        }
        this.animationFrame = requestAnimationFrame(this.draw.bind(this));
    }
    /**
     * 格式化资源
     * @param source
     * @returns
     */
    protected formatSource(
        source?: HTMLImageElement | HTMLVideoElement | null,
    ): HTMLCanvasElement {
        if (source && this.offScreenCtx) {
            this.offScreenCanvas.width =
                this.canvasRef.current?.width ?? source.width;
            this.offScreenCanvas.height =
                this.canvasRef.current?.height ?? source.height;

            this.offScreenCtx?.clearRect(
                0,
                0,
                this.offScreenCanvas.width,
                this.offScreenCanvas.height,
            );
            this.offScreenCtx.drawImage(
                source,
                0,
                0,
                this.offScreenCanvas.width,
                this.offScreenCanvas.height,
            );

            const imageData: ImageData = this.offScreenCtx.getImageData(
                0,
                0,
                this.offScreenCanvas.width,
                this.offScreenCanvas.height,
            );

            switch (this.mergerProps.filter) {
                case "RemoveBlack":
                    this.offScreenCtx.putImageData(
                        this.removeBlack(imageData),
                        0,
                        0,
                    );
                    break;
            }
        }
        return this.offScreenCanvas;
    }
    /**
     * 移除黑色背景
     * @param imageData
     * @returns
     */
    protected removeBlack(imageData: ImageData): ImageData {
        const { data } = imageData;
        /* 定义亮度阈值，值越小表示越接近纯黑色 */
        const brightnessThreshold = 10;
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            /* 计算像素的亮度 */
            const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
            if (brightness < brightnessThreshold) data[i + 3] = 0;
        }
        return imageData;
    }

    protected async mountMain(): Promise<void> {
        this.loadResource();
    }

    protected destory(): void {
        cancelAnimationFrame(this.animationFrame);
        this.box.parentNode?.removeChild(this.box);
        this.offScreenCanvas.parentNode?.removeChild(this.offScreenCanvas);
        requestAnimationFrame(() => this.root.unmount());
    }
}

interface IState extends ViewComponentState {
    renderWidth?: number;
    renderHeight?: number;
}

interface IProps
    extends ViewComponentProps, ComponentPropsWithoutRef<"canvas"> {
    /**
     * 资源
     */
    src?: string;
    /**
     * 视频属性
     */
    videoProps?: CommonVideoProps;
    /**
     * 图片属性
     */
    imageProps?: ComponentPropsWithoutRef<"img">;
    /**
     * 滤镜
     */
    filter?: "RemoveBlack";
    /**
     * 资源类型
     */
    sourceType?: "video" | "image";
}
