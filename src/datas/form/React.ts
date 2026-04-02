import Value from "@core/objects/attribute/Value";
import {
    CheckboxProps,
    DividerProps,
    GridProps,
    MenuItemProps,
    RadioProps,
    SelectProps,
    SwitchProps,
    TextareaAutosizeProps,
    TextFieldProps,
} from "@mui/material";
import { ReactNode } from "react";

const EMaping = {
    /**
     * 自定义
     */
    CUSTOM: "custom",
    /**
     * 布局
     */
    GRID: "grid",
    /**
     * 间隔
     */
    DIVIDER: "divider",
    /**
     * 输入
     */
    INPUT: "input",
    /**
     * 复选
     */
    CHECKBOX: "checkbox",
    /**
     * 单选
     */
    RADIO: "radio",
    /**
     * 开关
     */
    SWITCH: "switch",
    /**
     * 选择
     */
    SELECT: "select",
    /**
     * 文本
     */
    TEXTAREA: "textarea",
} as const;

export default class ReactFormData<M extends TMap = TMap> extends Value<
    TConfig<M>
> {}

interface IConfig<M extends TMap> {
    /**
     * 类型
     */
    type: M;
    /**
     * 标签
     */
    label?: string;
    /**
     * 输入
     */
    iv?: IPreset[M]["iv"];
    /**
     * 属性
     */
    props?: IPreset[M]["props"];
    /**
     * 列表
     */
    list?: IPreset[M]["list"];
    /**
     * 组件
     */
    element?: ReactNode;
    /**
     * 错误
     */
    error?: Poly.resolveFunc<string>;
    /**
     * 格式化
     */
    format?: (value: IConfig<M>["iv"]) => IConfig<M>["iv"];
}

interface INode<
    V,
    P extends Record<any, any>,
    L extends Array<any> = Array<any>,
> {
    /**
     * 输入
     */
    iv: V;
    /**
     * 属性
     */
    props: P;
    /**
     * 列表
     */
    list: L;
}

interface IPreset {
    [EMaping.CUSTOM]: INode<any, any>;
    [EMaping.GRID]: INode<unknown, GridProps, Array<ReactFormData | TConfig>>;
    [EMaping.DIVIDER]: INode<unknown, DividerProps>;
    [EMaping.INPUT]: INode<string | number, TextFieldProps>;
    [EMaping.TEXTAREA]: INode<string, TextareaAutosizeProps>;
    [EMaping.SWITCH]: INode<boolean, SwitchProps>;
    [EMaping.RADIO]: INode<string | number, RadioProps, string[] | number[]>;
    [EMaping.CHECKBOX]: INode<
        string[] | number[],
        CheckboxProps,
        string[] | number[]
    >;
    [EMaping.SELECT]: INode<
        string | number,
        SelectProps<string | number>,
        MenuItemProps[]
    >;
}

type TMap = (typeof EMaping)[keyof typeof EMaping];

type TConfig<M extends TMap = TMap> = {
    [K in M]: IConfig<K>;
}[M];

export { TConfig as ReactFormDataConfig, EMaping as ReactFormDataMaping };
