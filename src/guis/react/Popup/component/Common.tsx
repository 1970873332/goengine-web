import { DocumentUtils } from "@core/utils/Document";
import {
    Button,
    ButtonProps,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { ForwardedRef, forwardRef, ReactNode } from "react";
import PopupManager, {
    PopupManagerConfig,
    PopupManagerOptions,
    PopupManagerProps,
} from "../manager/Popup";

/**
 * 通用对话框
 */
export const CommonDialog = forwardRef(
    (props: PopupManagerOptions, ref: ForwardedRef<HTMLDivElement>) => {
        const mergeConfig: Partial<IConfig> = {
            autoClose: true,
            okText: "确定",
            cancelText: "取消",
            ...props.config,
        };

        const mergeProps: IProps = {
            ...props.props,
        };

        return (
            <Dialog
                open
                ref={ref}
                container={DocumentUtils.popupWrap}
                {...mergeProps}
                onClose={(...args) => {
                    mergeProps.onClose?.(...args);
                    mergeConfig.autoClose && PopupManager.unmountDialog();
                }}
            >
                <DialogTitle>{mergeConfig.title}</DialogTitle>
                <DialogContent>{mergeConfig.content}</DialogContent>
                <DialogActions>
                    {mergeConfig.onOk && (
                        <Button
                            variant="outlined"
                            onClick={mergeConfig.onOk}
                            {...mergeConfig.okProps}
                        >
                            {mergeConfig.okText}
                        </Button>
                    )}
                    {mergeConfig.onCancel && (
                        <Button
                            variant="contained"
                            onClick={mergeConfig.onCancel}
                            {...mergeConfig.cancelProps}
                        >
                            {mergeConfig.cancelText}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        );
    },
);

interface IProps extends PopupManagerProps {}

interface IConfig extends PopupManagerConfig {
    /**
     * 对话框标题
     */
    title: string;
    /**
     * 对话框内容
     */
    content: string | ReactNode;
    /**
     * 确定文本
     */
    okText?: string;
    /**
     * 确定按钮参数
     */
    okProps?: Partial<ButtonProps>;
    /**
     * 取消文本
     */
    cancelText?: string;
    /**
     * 取消按钮参数
     */
    cancelProps?: Partial<ButtonProps>;
    /**
     * 确定
     * @returns
     */
    onOk?: () => void;
    /**
     * 取消
     * @returns
     */
    onCancel?: () => void;
}

export { IConfig as CommonDialogConfig, IProps as CommonDiaologProps };
