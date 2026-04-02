import { DocumentUtils } from "@/package/core/src/utils/Document";
import { Alert, AlertProps, DialogProps } from "@mui/material";
import { createElement, Fragment, ReactElement, ReactNode } from "react";
import { createRoot, Root } from "react-dom/client";
import {
    CommonDialog,
    CommonDialogConfig,
    CommonDiaologProps,
} from "../component/Common";
import {
    CustomDialog,
    CustomDialogConfig,
    CustomDialogProps,
} from "../component/Custom";

/**
 * 弹出管理
 */
export default abstract class PopupManager {
    /**
     * 弹窗Root
     */
    public static readonly PopupRoot: Root = createRoot(
        DocumentUtils.popupWrap,
    );
    /**
     * 消息Root
     */
    public static readonly AlertRoot: Root = createRoot(
        DocumentUtils.alertWrap,
    );
    /**
     * 消息队列
     */
    private static readonly dialogs: ReactNode[] = [];
    /**
     * 对话框队列
     */
    private static readonly alertdialogs: ReactNode[] = [];

    /**
     * 获取消息
     */
    public static obtainAlert(index?: number): ReactNode[] {
        return index ? [this.alertdialogs[index]] : this.alertdialogs;
    }
    /**
     * 获取对话框
     */
    public static obtainDialog(index?: number): ReactNode[] {
        return index ? [this.dialogs[index]] : this.dialogs;
    }
    /**
     * 卸载对话框
     */
    public static unmountDialog(): void;
    public static unmountDialog(node: ReactNode): void;
    public static unmountDialog(node?: ReactNode | number): void {
        typeof node === "number" && (node = this.dialogs[node]);
        if (!node) this.dialogs.splice(0, this.dialogs.length);
        else this.dialogs.splice(this.dialogs.indexOf(node), 1);
        this.renderDialog();
    }
    /**
     * 卸载尾部对话框
     */
    public static unmountTailDialog(): void {
        this.unmountDialog(this.dialogs.length - 1);
    }

    /**
     * 卸载消息框
     */
    public static unmountAlert(): void;
    public static unmountAlert(node: ReactNode): void;
    public static unmountAlert(node?: ReactNode | number): void {
        typeof node === "number" && (node = this.alertdialogs[node]);
        if (!node) this.alertdialogs.splice(0, this.alertdialogs.length);
        else this.alertdialogs.splice(this.alertdialogs.indexOf(node), 1);
        this.renderAlert();
    }
    /**
     * 卸载尾部消息框
     */
    public static unmountTailAlert(): void {
        this.unmountAlert(this.alertdialogs.length - 1);
    }

    /**
     * 通用对话框
     * @param data
     * @param props
     */
    public static common(
        config?: CommonDialogConfig,
        props?: CommonDiaologProps,
    ): void {
        const node: ReactElement = createElement(CommonDialog, {
            key: crypto.randomUUID(),
            config,
            props,
        });
        config?.only && this.dialogs.splice(0, this.dialogs.length);
        this.dialogs.push(node) && this.renderDialog();
    }
    /**
     * 自定义对话框
     */
    public static custom(
        config?: CustomDialogConfig,
        props?: CustomDialogProps,
    ): void {
        const node: ReactElement = createElement(CustomDialog, {
            key: crypto.randomUUID(),
            config,
            props,
        });
        config?.only && this.dialogs.splice(0, this.dialogs.length);
        this.dialogs.push(node) && this.renderDialog();
    }
    /**
     * 消息框
     * @param content
     * @param props
     */
    public static alert(
        content: string,
        props?: Partial<AlertProps & { duration: number }>,
    ): void {
        const { duration = 2000, ...Rest } = props ?? {},
            node: ReactElement = createElement(Alert, {
                key: crypto.randomUUID(),
                severity: "info",
                children: content,
                ...Rest,
            }),
            timeOut: number = window.setTimeout(() => {
                clearTimeout(timeOut);
                this.unmountAlert(node);
            }, duration);
        this.alertdialogs.push(node);
        this.renderAlert();
    }

    /**
     * 渲染对话框
     */
    private static renderDialog(): void {
        this.PopupRoot.render(<Fragment children={this.dialogs} />);
    }
    /**
     * 渲染消息框
     */
    private static renderAlert(): void {
        this.AlertRoot.render(<Fragment children={this.alertdialogs} />);
    }
}

interface IProps extends Partial<DialogProps> {}

interface IOptions {
    /**
     * 配置
     */
    config?: IConfig;
    /**
     * 属性
     */
    props?: IProps;
}

interface IConfig {
    /**
     * 是否自动关闭
     * @default true
     */
    autoClose?: boolean;
    /**
     * 唯一
     * @default false
     */
    only?: boolean;
}

export {
    IConfig as PopupManagerConfig,
    IOptions as PopupManagerOptions,
    IProps as PopupManagerProps,
};
