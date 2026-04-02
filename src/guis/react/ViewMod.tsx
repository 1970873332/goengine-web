import ModComponent from "@core/components/Mod";
import { Component } from "react";
/**
 * 视图模块组件
 */
export default class ViewModComponent<
    M extends Component,
> extends ModComponent<M> {
    public get state(): M["state"] {
        return this.manager.state;
    }

    public setState<K extends keyof M["state"]>(
        state:
            | ((
                  prevState: Readonly<M["state"]>,
                  props: Readonly<M["props"]>,
              ) => Pick<M["state"], K> | Partial<M["state"]> | null)
            | (Pick<M["state"], K> | Partial<M["state"]> | null),
        callback?: () => void,
    ): void {
        this.manager.setState(state as any, callback);
    }
}
