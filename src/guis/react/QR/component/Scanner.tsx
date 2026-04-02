import { CloseOutlined } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import {
    Html5Qrcode,
    QrcodeErrorCallback,
    QrcodeSuccessCallback,
} from "html5-qrcode";
import { ReactNode } from "react";
import ViewComponent, { ViewComponentProps } from "../../View";
import PopupManager from "../../Popup/manager/Popup";
import { SubFully } from "../../Wrap/Index";

/**
 * 二维码扫描仪
 */
export default class QRScanner extends ViewComponent<IProps> {
    /**
     * 扫描器
     */
    public scanner?: Html5Qrcode;
    /**
     * 视频流ID
     */
    public readonly videoStreamID: string = "video-stream";

    render(): ReactNode {
        return (
            <SubFully
                backgroundNode={
                    <Box
                        id={this.videoStreamID}
                        sx={{
                            "& video": {
                                maxHeight: "100%",
                                objectFit: "cover",
                                aspectRatio: "3/4",
                            },
                        }}
                        height="100%"
                    />
                }
                height={this.mergerProps.show ? "100%" : "0"}
            >
                <IconButton onClick={this.handleClose.bind(this)}>
                    <CloseOutlined color="info" />
                </IconButton>
            </SubFully>
        );
    }

    /**
     * 初始化扫描器
     */
    public initScanner(): void {
        try {
            this.scanner ??= new Html5Qrcode(this.videoStreamID);
            this.scanner
                ?.start(
                    { facingMode: "environment" },
                    { fps: 10, qrbox: 250 },
                    this.mergerProps.success,
                    this.mergerProps.error,
                )
                .then((_) => {
                    this.mergerProps.ready?.();
                })
                .catch((error: unknown) => {
                    PopupManager.alert("启动扫描器失败", { severity: "error" });
                });
        } catch (error: unknown) {
            PopupManager.alert("初始化扫描器失败", { severity: "error" });
        }
    }
    /**
     * 关闭
     */
    public handleClose(): void {
        this.mergerProps.close?.() ?? this.scanner?.stop();
    }
}

interface IProps extends ViewComponentProps {
    /**
     * 显示
     */
    show?: boolean;
    /**
     * 就绪回调
     * @returns
     */
    ready?: () => void;
    /**
     * 关闭回调
     * @returns
     */
    close?: () => void;
    /**
     * 成功回调
     * @param decodedText
     * @returns
     */
    success?: QrcodeSuccessCallback;
    /**
     * 失败回调
     * @returns
     */
    error?: QrcodeErrorCallback;
}
