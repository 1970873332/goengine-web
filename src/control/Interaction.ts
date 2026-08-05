import Vector2 from "@goengine/core/src/object/math/vector/Vector2";
import { EventState, EventTarget } from "@goengine/core/src/supplement/Event";

/**
 * 事件交互
 */
export default class Interaction<E extends IEvent> extends EventTarget<E> {
    constructor(public readonly element: HTMLElement) {
        super();

        this.wheelState = new EventState(
            element,
            "wheel",
            this.handleWheel.bind(this),
        );
        this.touchStartState = new EventState(
            element,
            "touchstart",
            this.handleTouchStart.bind(this),
        );
        this.mouseDownState = new EventState(
            element,
            "mousedown",
            this.handleMouseDown.bind(this),
        );

        this.live();
    }

    /**
     * 是否触摸中
     */
    public touching: boolean = false;
    /**
     * 是否左击
     */
    public leftDown: boolean = false;
    /**
     * 是否中击
     */
    public middleDown: boolean = false;
    /**
     * 是否右击
     */
    public rightDown: boolean = false;
    /**
     * 开始缩放距离
     */
    protected first_zoom_distance: number = 0;
    /**
     * 最后缩放距离
     */
    protected last_zoom_distance: number = 0;
    /**
     * 按下元素
     */
    protected down_element?: HTMLElement;

    /**
     * 滚轮事件状态
     */
    declare protected wheelState: EventState<WindowEventMap>;
    /**
     * 鼠标移动事件状态
     */
    protected mouseMoveState = new EventState(
        window,
        "mousemove",
        this.handleMouseMove.bind(this),
    );
    /**
     * 鼠标抬起事件状态
     */
    protected mouseUpState = new EventState(
        window,
        "mouseup",
        this.handleMouseUp.bind(this),
    );
    /**
     * 鼠标按下事件状态
     */
    declare protected mouseDownState: EventState<WindowEventMap>;
    /**
     * 触摸移动事件状态
     */
    protected touchMoveState = new EventState(
        window,
        "touchmove",
        this.handleTouchMove.bind(this),
    );
    /**
     * 触摸结束事件状态
     */
    declare protected touchStartState: EventState<WindowEventMap>;
    /**
     * 触摸结束事件状态
     */
    protected touchEndState = new EventState(
        window,
        "touchend",
        this.handleTouchEnd.bind(this),
    );

    /**
     * 鼠标滚轮事件
     * @param event
     */
    protected handleWheel(event: WheelEvent): void {
        this.dispatchCustomEvent("wheel", event);
        this.dispatchCustomEvent(
            event.deltaY > 0 ? "wheelUp" : "wheelDown",
            event,
        );
    }
    /**
     * 鼠标移动
     * @param event
     */
    protected handleMouseMove(event: MouseEvent): void {
        event.preventDefault();
        this.dispatchCustomEvent("mouseMove", event);
    }
    /**
     * 鼠标按下
     * @param event
     */
    protected handleMouseDown(event: MouseEvent): void {
        switch (event.button) {
            case 0:
                this.leftDown = true;
                this.dispatchCustomEvent("leftDown", event);
                break;
            case 1:
                this.middleDown = true;
                this.dispatchCustomEvent("middleDown", event);
                break;
            case 2:
                this.rightDown = true;
                this.dispatchCustomEvent("rightDown", event);
                break;
        }
        if (event.target instanceof HTMLElement)
            this.down_element = event.target;
        this.dispatchCustomEvent("mouseDown", event);
    }
    /**
     * 鼠标抬起
     * @param event
     */
    protected handleMouseUp(event: MouseEvent): void {
        switch (event.button) {
            case 0:
                this.leftDown = false;
                this.dispatchCustomEvent("leftUp", event);
                break;
            case 1:
                this.middleDown = false;
                this.dispatchCustomEvent("middleUp", event);
                break;
            case 2:
                this.rightDown = false;
                this.dispatchCustomEvent("rightUp", event);
                break;
        }
        this.dispatchCustomEvent("mouseUp", event);
        if (event.target === this.down_element)
            this.dispatchCustomEvent("click", event);
        delete this.down_element;
    }
    /**
     * 触摸开始
     * @param event
     */
    protected handleTouchStart(event: TouchEvent): void {
        this.touching = !!event.touches.length;
        if (event.touches.length === 2) {
            const v1 = new Vector2(
                    event.touches[0].clientX,
                    event.touches[0].clientY,
                ),
                v2 = new Vector2(
                    event.touches[1].clientX,
                    event.touches[1].clientY,
                );
            this.first_zoom_distance = v1.distance(v2);
        }
        if (event.target instanceof HTMLElement)
            this.down_element = event.target;
        this.dispatchCustomEvent("touchStart", event);
    }
    /**
     * 触摸移动
     * @param event
     */
    protected handleTouchMove(event: TouchEvent): void {
        if (event.touches.length === 2) {
            const v1 = new Vector2(
                    event.touches[0].clientX,
                    event.touches[0].clientY,
                ),
                v2 = new Vector2(
                    event.touches[1].clientX,
                    event.touches[1].clientY,
                );
            this.last_zoom_distance = v1.distance(v2);
            if (this.last_zoom_distance !== this.first_zoom_distance) {
                this.dispatchCustomEvent("zoom", event);
                if (this.first_zoom_distance < this.last_zoom_distance) {
                    this.dispatchCustomEvent("zoomIn", event);
                } else if (this.first_zoom_distance > this.last_zoom_distance) {
                    this.dispatchCustomEvent("zoomOut", event);
                }
            }
            this.first_zoom_distance = this.last_zoom_distance;
        }
        this.dispatchCustomEvent("touchMove", event);
    }
    /**
     * 触摸结束
     * @param event
     */
    protected handleTouchEnd(event: TouchEvent): void {
        this.touching = !!event.touches.length;
        this.dispatchCustomEvent("touchEnd", event);
        if (event.target === this.down_element)
            this.dispatchCustomEvent("touch", event);
        delete this.down_element;
    }
    /**
     * 开始监听
     */
    public live(): void {
        this.wheelState.wake();
        this.mouseMoveState.wake();
        this.mouseUpState.wake();
        this.mouseDownState.wake();
        this.touchMoveState.wake();
        this.touchStartState.wake();
        this.touchEndState.wake();
    }
    /**
     * 停止监听
     */
    public unlive(): void {
        this.wheelState.break();
        this.mouseMoveState.break();
        this.mouseUpState.break();
        this.mouseDownState.break();
        this.touchMoveState.break();
        this.touchStartState.break();
        this.touchEndState.break();
    }
    /**
     * 销毁
     */
    public destroy(): void {
        this.unlive();
    }
}

interface IEvent {
    /**
     * 点击
     */
    click: MouseEvent;
    /**
     * 鼠标移动
     */
    mouseMove: MouseEvent;
    /**
     * 鼠标按下
     */
    mouseDown: MouseEvent;
    /**
     * 鼠标抬起
     */
    mouseUp: MouseEvent;
    /**
     * 左键按下
     */
    leftDown: MouseEvent;
    /**
     * 左键抬起
     */
    leftUp: MouseEvent;
    /**
     * 中键按下
     */
    middleDown: MouseEvent;
    /**
     * 中键抬起
     */
    middleUp: MouseEvent;
    /**
     * 右键按下
     */
    rightDown: MouseEvent;
    /**
     * 右键抬起
     */
    rightUp: MouseEvent;
    /**
     * 鼠标滚轮
     */
    wheel: WheelEvent;
    /**
     * 滚轮向上滚动
     */
    wheelUp: WheelEvent;
    /**
     * 滚轮向下滚动
     */
    wheelDown: WheelEvent;
    /**
     * 触摸
     */
    touch: TouchEvent;
    /**
     * 触摸开始
     */
    touchStart: TouchEvent;
    /**
     * 触摸移动
     */
    touchMove: TouchEvent;
    /**
     * 触摸结束
     */
    touchEnd: TouchEvent;
    /**
     * 缩放
     */
    zoom: TouchEvent;
    /**
     * 放大
     */
    zoomIn: TouchEvent;
    /**
     * 缩小
     */
    zoomOut: TouchEvent;
}

type IAny = Interaction<any>;

export { IAny as InteractionAny, IEvent as InteractionEvent };
