/**
 * 路由配置
 */
export abstract class RouteConfig {
    /**
     * 标题
     */
    public static readonly title?: string;
    /**
     * 重定向
     * @default false
     */
    public static readonly redirect: boolean = false;
}

interface IRouteObject {
    /**
     * 子项
     */
    children?: any[];
    /**
     * 重定向
     */
    redirect?: string | boolean;
    /**
     * 强制重定向
     */
    mandatoryRedirect?: boolean;
    /**
     * 启用404
     */
    loseEnable?: boolean;
    /**
     * 404
     */
    loseNode?: any;
}

interface IEvent<T> {
    /**
     * 路由变动
     */
    changRoute: T;
}

interface IRoute {
    query?: Record<string, string>;
    body?: Record<string, unknown> & {
        /**
         * 来源
         */
        from?: string;
    };
}

export { IRoute as Route, IEvent as RouteEvent, IRouteObject as RouteObject };
