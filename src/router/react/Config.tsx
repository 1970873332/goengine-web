import { ReactNode } from "react";
import { LinkProps, RouteObject as ReactRouteObject } from "react-router-dom";
import { Route, RouteConfig, RouteEvent, RouteObject } from "../Config";
/**
 * React路由配置
 */
export abstract class ReactRouteConfig extends RouteConfig {
    /**
     * 规则
     */
    public static readonly rule: LinkProps = { to: "/", replace: true };

    /**
     * 路由
     */
    public static get routes(): TRouteObject[] {
        return [];
    }
    /**
     * 404页面
     */
    public static get loseNode(): ReactNode {
        return <div children={"404"} />;
    }
    /**
     * 页面加载中
     */
    public static get loadingNode(): ReactNode {
        return <div children={"加载中..."} />;
    }
}

interface IEvent extends RouteEvent<IRoute> {}

interface IRoute extends Partial<LinkProps>, Route {}

type TRouteObject = ReactRouteObject &
    RouteObject & {
        /**
         * 子项
         */
        children?: TRouteObject[];
        /**
         * 404
         */
        loseNode?: ReactNode;
    };

export {
    IRoute as ReactRoute,
    IEvent as ReactRouteEvent,
    TRouteObject as ReactRouteObject,
};
