import TaskComponent from "@/package/core/src/components/Task";
import { ReactRouteEvent } from "../router/react/Config";
import ReactRouterComponent from "../router/react/Router";

/**
 * 全局仓库
 */
export abstract class Global {
    /**
     * 开发模式
     */
    public static get devMode(): boolean {
        return __NODE_ENV__ === "development";
    }
    /**
     * 调试
     */
    public static get debug(): boolean {
        return __DEBUG__ === "true";
    }
    /**
     * 路由
     */
    public static ReactRouter?: ReactRouterComponent;
}

export const ReactTask: TaskComponent<ReactRouteEvent> =
    new (class extends TaskComponent<ReactRouteEvent> {})();
