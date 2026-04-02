import {
    ReactRouteConfig,
    ReactRouteObject,
} from "../../../router/react/Config";
import BaseStore from "../Base";

enum EEvent {
    /**
     * 变更路由
     */
    CHANGE_ROUTE = "changeRoute",
}

/**
 * 路由状态
 */
export class RouterStore extends BaseStore<IState, IData> {}

interface IState {
    routes: ReactRouteObject[];
    rule: (typeof ReactRouteConfig)["rule"];
}

interface IData {
    [EEvent.CHANGE_ROUTE]: IState["rule"];
}
