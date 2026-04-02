import { LanguageComponentCode } from "@core/components/dispatch/Language";
import { Store } from "redux";
import BaseStore, { BaseStoreAction } from "../Base";

enum EEvent {
    /**
     * 变更语言代码
     */
    CHANGE_CODE = "changeCode",
}

enum EChar {
    /**
     * 语言代码
     */
    CODE = "code",
}

/**
 * 语言状态
 */
export class LanguageStore extends BaseStore<IState, IData> {
    /**
     * 默认状态
     */
    public static get defaultState(): IState {
        return {
            [EChar.CODE]:
                (localStorage.getItem(EChar.CODE) as IState[EChar.CODE]) ??
                LanguageComponentCode.ZH_CN,
        };
    }
    /**
     * 语言状态实例
     */
    public static readonly instance: Store<IState, BaseStoreAction<IData>> =
        this.init();

    protected initialState: IState = LanguageStore.defaultState;

    protected todoReducer(
        state: IState = this.initialState,
        action: BaseStoreAction<IData, EEvent>,
    ): IState {
        const { data, callback } = action;
        switch (action.type) {
            case EEvent.CHANGE_CODE:
                state[EChar.CODE] = data;
                localStorage.setItem(EChar.CODE, data);
                break;
        }
        callback?.(data);
        return state;
    }
}

interface IState {
    [EChar.CODE]: LanguageComponentCode;
}

interface IData {
    [EEvent.CHANGE_CODE]: IState[EChar.CODE];
}

export { IState as LanguageStoreState };

/**
 * 变更语言
 * @param data
 * @param callback
 */
export function changeLanguage(
    data: IData[EEvent.CHANGE_CODE],
    callback?: () => void,
): void {
    LanguageStore.instance.dispatch({
        type: EEvent.CHANGE_CODE,
        data,
        callback,
    });
}
