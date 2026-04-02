import { DocumentUtils } from "@core/utils/Document";
import { Dialog, Stack } from "@mui/material";
import { ForwardedRef, forwardRef } from "react";
import PopupManager, {
    PopupManagerConfig,
    PopupManagerOptions,
    PopupManagerProps,
} from "../manager/Popup";

/**
 * 自定义对话框
 */
export const CustomDialog = forwardRef(
    (props: PopupManagerOptions, ref: ForwardedRef<HTMLDivElement>) => {
        const mergeConfig: Partial<IConfig> = {
            autoClose: true,
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
                onClose={(...Rest) => {
                    mergeProps.onClose?.(...Rest);
                    mergeConfig.autoClose && PopupManager.unmountDialog();
                }}
            >
                <Stack
                    height="100%"
                    alignItems="center"
                    justifyContent="center"
                >
                    {mergeProps.children}
                </Stack>
            </Dialog>
        );
    },
);

interface IProps extends PopupManagerProps {}

interface IConfig extends PopupManagerConfig {}

export { IConfig as CustomDialogConfig, IProps as CustomDialogProps };
