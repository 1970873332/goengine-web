import { LinkUtils } from "@core/utils/Link";
import {
    Component,
    createRef,
    Fragment,
    ReactNode,
    RefObject,
    Suspense,
} from "react";
import {
    HashRouter,
    Link,
    LinkProps,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";
import { Global, ReactTask } from "../../stores/Global";
import { ReactRoute, ReactRouteConfig, ReactRouteObject } from "./Config";

/**
 * React路由实例
 */
export default class ReactRouterComponent extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        Global.ReactRouter = this;
        this.config.title && (document.title = this.config.title);
    }

    state: Readonly<IState> = {
        routes: this.config.routes,
        router: this.config.rule,
    };

    /**
     * 路由
     */
    protected linkRef: RefObject<HTMLAnchorElement | null> = createRef();

    /**
     * 配置
     */
    public get config(): IProps["config"] {
        return this.props.config;
    }
    /**
     * body
     */
    public get body(): ReactRoute["body"] {
        return this.state.router.body;
    }
    /**
     * query
     */
    public get query(): ReactRoute["query"] {
        return this.state.router.query;
    }
    /**
     * 格式化路由参数
     */
    protected get formatlinkProps(): LinkProps {
        const { query, body, to, ...Rest } = this.state.router,
            result: LinkProps = {
                ...Rest,
                to: to ?? this.config.rule.to,
            };
        return result;
    }

    /**
     * 解构路由
     * @param item
     * @returns
     */
    protected deconstrusctionRoutes(item: ReactRouteObject[]): ReactNode {
        return item.map(
            (
                { path, element, children, loseEnable, loseNode, Component },
                index,
            ) => {
                return (
                    <Fragment key={index}>
                        {element && (
                            <Route key={path} path={path} element={element}>
                                {children &&
                                    this.deconstrusctionRoutes(children)}
                            </Route>
                        )}
                        {Component && (
                            <Route
                                key={path}
                                path={path}
                                element={
                                    <Suspense
                                        fallback={this.config.loadingNode}
                                    >
                                        <Component />
                                    </Suspense>
                                }
                            />
                        )}
                        {loseEnable && (
                            <Route
                                path="*"
                                element={loseNode ?? this.config.loseNode}
                            />
                        )}
                    </Fragment>
                );
            },
        );
    }

    render(): ReactNode {
        return (
            <HashRouter>
                <Link
                    ref={this.linkRef}
                    className="hidden"
                    {...this.formatlinkProps}
                />
                <Routes>
                    {this.deconstrusctionRoutes(this.state.routes)}
                    <Route
                        path="/*"
                        element={<Navigate to={this.config.rule.to} />}
                    />
                </Routes>
            </HashRouter>
        );
    }

    /**
     * 格式化
     */
    public format(to?: LinkProps["to"]): string {
        if (typeof to === "string") return to;
        const path: string | undefined = to?.pathname ?? to?.hash;
        if (typeof path !== "string") return this.format(this.config.rule.to);
        if (path.match(/\?/)) return path;
        return `${path}${to?.search?.match(/\?/) && "?"}${to?.search}`;
    }
    /**
     * 路由重定向
     */
    private redirectRouter(): void {
        if (!this.config.redirect) return;
        const routePath: string = `/${LinkUtils.hashRoutes.join("/")}`,
            findTargetRoute: ReactRouteObject | undefined =
                this.state.routes.find((item) => item.path === routePath);
        const config: ReactRoute = {
                ...this.config.rule,
                body: { from: routePath },
            },
            redirect: ReactRouteObject["redirect"] = findTargetRoute?.redirect;
        switch (typeof redirect) {
            case "boolean":
                redirect && this.to(config);
                break;
            case "string":
                this.to({ ...config, to: redirect });
                break;
            default:
                this.to(config);
                break;
        }
    }
    /**
     * 路由跳转
     * @param router
     */
    public to(router: ReactRoute): void {
        const findTargetRoute: ReactRouteObject | undefined =
                this.state.routes.find(
                    (item) =>
                        item.path?.split("?")[0] ===
                        this.format(router.to)?.split("?")[0],
                ),
            redirect: ReactRouteObject["redirect"] | undefined =
                findTargetRoute?.redirect;
        if (
            typeof redirect === "string" &&
            findTargetRoute?.mandatoryRedirect &&
            redirect !== this.format(this.state.router.to)
        ) {
            router = { ...this.state.router, ...router, to: redirect };
        }
        const routePath: string = `/${LinkUtils.hashRoutes.join("/")}`,
            { body, query, ...Rest } = { ...this.config.rule, ...router },
            to: string = this.format(Rest.to);
        if (typeof query === "object")
            Rest.to = to.match(/\?/)
                ? to
                : `${to}?${LinkUtils.generateQuery(query)}`;
        this.setState(
            { router: { ...Rest, query, body: { ...body, from: routePath } } },
            () => {
                this.linkRef.current?.click();
            },
        );
    }
    /**
     * 添加路由
     * @param route
     */
    public addRoute(route: ReactRouteObject, target?: string[]): void {
        const recursionRoutes = (
            routes: ReactRouteObject[],
            targets: string[],
            index: number,
        ): ReactRouteObject[] => {
            return routes.map((item) => {
                if (item.path === targets[index]) {
                    if (!targets[index + 1]) {
                        return {
                            ...item,
                            children: [route, ...(item.children ?? [])],
                        } as ReactRouteObject;
                    } else if (item.children) {
                        return {
                            ...item,
                            children: recursionRoutes(
                                item.children,
                                targets,
                                index + 1,
                            ),
                        } satisfies ReactRouteObject;
                    }
                }
                return item;
            });
        };
        this.setState({
            routes: target
                ? recursionRoutes(this.state.routes, target, 0)
                : [route, ...this.state.routes],
        });
    }
    /**
     * 路由改变
     */
    protected changed(): void {
        ReactTask?.dispatchCustomEvent("changRoute", this.state.router);
    }

    componentDidMount(): void {
        this.redirectRouter();
    }

    componentDidUpdate(
        prevProps: Readonly<{}>,
        prevState: Readonly<IState>,
        snapshot?: any,
    ): void {
        prevState.router !== this.state.router && this.changed();
    }
}

interface IState {
    /**
     * 路由
     */
    routes: ReactRouteObject[];
    /**
     * 路由器
     */
    router: ReactRoute;
}

interface IProps {
    /**
     * 路由配置
     */
    config: typeof ReactRouteConfig;
}

export { IProps as ReactRouterProps, IState as ReactRouterState };
