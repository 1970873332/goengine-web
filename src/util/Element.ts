/**
 * 元素工具类
 */
export abstract class ElementUtils {
    /**
     * 全局坐标转元素本地坐标
     * @param element
     * @param point
     * @returns
     */
    public static sceneTolocalPoint(
        element: HTMLElement,
        { x, y }: VectorObject.Vector2,
    ): VectorAttr.Vector2 {
        const { top, left } = element.getBoundingClientRect();

        return { x: x - left, y: y - top };
    }
}
