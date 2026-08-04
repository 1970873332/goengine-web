/**
 * 离屏画布对象
 */
export default class OffscreenCanvasObject<T extends TContext> {
    constructor(public readonly type: T) {}
    /**
     * 离屏画布
     */
    public readonly canvas: OffscreenCanvas = new OffscreenCanvas(0, 0);
    /**
     * 离屏上下文
     */
    declare protected context: IContext[T];
    /**
     * 是否完成
     */
    public complate: boolean = false;

    /**
     * 获取上下文
     */
    public obtainCtx(): IContext[T] | undefined {
        return (this.context ??= this.canvas.getContext(
            this.type,
        ) as IContext[T]);
    }
    /**
     * 验证
     */
    public valid(): boolean {
        return !!this.obtainCtx();
    }
    /**
     * 验证尺寸
     * @returns
     */
    public validSize(): boolean {
        return !!this.canvas.width && !!this.canvas.height;
    }
    /**
     * 确保有效
     */
    public ensureValid(): boolean {
        if (!this.valid()) return false;
        if (!this.validSize()) this.applySize({ width: 1, height: 1 });
        return true;
    }
    /**
     * 应用尺寸
     * @param param0
     */
    public applySize({ width, height }: VectorObject.Vector2Size): void {
        if (this.context instanceof OffscreenCanvasRenderingContext2D) {
            this.context.reset();
        }
        Object.assign(this.canvas, { width, height });
    }
    /**
     * 销毁
     */
    public destroy(): void {
        this.complate = false;

        Object.assign(this.canvas, {
            width: 0,
            height: 0,
        });
    }
}

interface IContext {
    /**
     * 2d
     */
    "2d": OffscreenCanvasRenderingContext2D;
    /**
     * webgl
     */
    webgl: Canvas.WebGLContext;
}

type TContext = "2d" | "webgl";
