/**
 * 资源工具类
 */
export abstract class ResourceUtils {
    /**
     * 预加载图片
     * @param list
     * @param finallyCallback
     * @returns
     */
    public static preloadingImgs(
        list: string[],
        finallyCallback?: (progress: number) => void,
    ): Promise<unknown[]> {
        let loadedCount: number = 0;

        return Promise.all(
            list.map(async (item) => {
                const img = document.createElement("img");
                img.src = item;

                return this.loadImg(img).finally(() => {
                    loadedCount++;
                    const progress = Math.round(
                        (loadedCount / list.length) * 100,
                    );
                    finallyCallback?.(progress);
                });
            }),
        );
    }
    /**
     * 加载图片
     * @param img
     * @returns
     */
    public static async loadImg(
        img: HTMLImageElement,
    ): Promise<VectorObject.Vector2Size> {
        return new Promise((resolve, reject) => {
            img.onload = () => {
                const { width, height } = img.getBoundingClientRect();

                resolve({ width, height });
            };
            img.onerror = () => {
                reject(new Error(`Failed to load img: ${img.src}`));
            };
        });
    }
    /**
     * 加载视频
     * @param video
     * @returns
     */
    public static async loadVideo(
        video: HTMLVideoElement,
    ): Promise<VectorObject.Vector2Size> {
        return new Promise((resolve, reject) => {
            video.onloadeddata = () => {
                const { width, height } = video.getBoundingClientRect();

                resolve({ width, height });
            };

            video.oncanplay = () => {
                video.play();
            };

            video.onerror = () => {
                reject(new Error(`Failed to load video: ${video.src}`));
            };
        });
    }
    /**
     * 更新尺寸
     * @param element
     * @param config
     * @returns
     */
    public static updateSize(
        element: HTMLImageElement | HTMLVideoElement,
        config: ISizeConfig,
    ): VectorObject.Vector2Size {
        const { mode, size } = config,
            { width = 0, height = 0 } = size ?? element;

        let w: number = 0,
            h: number = 0;

        if (element instanceof HTMLImageElement) {
            w = element.naturalWidth;
            h = element.naturalHeight;
        } else if (element instanceof HTMLVideoElement) {
            w = element.videoWidth;
            h = element.videoHeight;
        }

        switch (mode) {
            case "auto":
                w = width || w;
                h = height || h;
                break;
            case "cover":
                if (!width) {
                    w = w * (height / h);
                    h = height;
                } else if (!height) {
                    h = h * (width / w);
                    w = width;
                }
                break;
        }

        Object.assign(element, { width: w, height: h });

        return { width: element.width, height: element.height };
    }
    /**
     * 生成元素
     * @param param0
     */
    public static generateElement(
        { src, type, mode, size, callback: sourceCallback }: SourceConfig,
        callback?: (size: VectorObject.Vector2Size) => void,
    ) {
        switch (type) {
            case "img":
                const imgElement = document.createElement("img");
                imgElement.src = src;
                ResourceUtils.loadImg(imgElement).then(() => {
                    const result = ResourceUtils.updateSize(imgElement, {
                        mode,
                        size,
                    });
                    callback?.(result);
                    sourceCallback?.(imgElement);
                });
                return imgElement;
            case "video":
                const videoElement = document.createElement("video");
                videoElement.src = src;
                videoElement.muted = true;
                videoElement.autoplay = true;
                ResourceUtils.loadVideo(videoElement).then(() => {
                    const result = ResourceUtils.updateSize(videoElement, {
                        mode,
                        size,
                    });
                    callback?.(result);
                    sourceCallback?.(videoElement);
                });
                return videoElement;
        }
    }
}

interface ISizeConfig {
    /**
     * 模式
     */
    mode?: SizeMode;
    /**
     * 尺寸
     */
    size?: Partial<VectorObject.Vector2Size>;
}

export interface SourceConfig<
    T extends keyof SourceMap = keyof SourceMap,
> extends ISizeConfig {
    /**
     * 地址
     */
    src: string;
    /**
     * 类型
     */
    type: T;
    /**
     * 回调
     * @param v
     * @returns
     */
    callback?: (v: SourceMap[T]) => void;
}

export interface SourceMap {
    img: HTMLImageElement;
    video: HTMLVideoElement;
}

export type SizeMode = "auto" | "cover";
