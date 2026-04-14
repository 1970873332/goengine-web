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


    public static test(): void { }
}

export interface RouteObject {
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
}