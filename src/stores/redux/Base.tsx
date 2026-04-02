import { Store, legacy_createStore } from "redux";

/**
 * 基础store
 */
export default class BaseStore<
    S extends Record<any, any>,
    T extends Record<any, any>,
> {
    /**
     * 初始化
     * @returns
     */
    public static init<T extends BaseStore<any, any>>(): Store<any, any> {
        const store: T = new this() as T;
        return this.load(store);
    }
    /**
     * 加载
     * @param store
     * @returns
     */
    public static load<T extends BaseStore<any, any>>(
        store: T,
    ): Store<any, any> {
        return legacy_createStore(store.todoReducer.bind(store));
    }

    /**
     * 初始状态
     */
    declare protected initialState: S;

    /**
     * 代办
     * @param state
     * @param action
     * @returns
     */
    protected todoReducer(state: S = this.initialState, action: IAction<T>): S {
        return state;
    }
}

interface IAction<
    T extends Record<any, any> = Record<any, any>,
    K extends string & keyof T = string & keyof T,
> {
    type: K;
    data: T[K];
    callback?: (data: T[K]) => void;
}

export { IAction as BaseStoreAction };
