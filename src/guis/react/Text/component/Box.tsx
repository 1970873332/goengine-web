import { Box, BoxProps } from "@mui/material";
import { ForwardedRef, forwardRef } from "react";
import { normalConfig, PresetType } from "../data/Preset";

/**
 * 标准化盒子
 */
export const NormalTextBox = forwardRef(
    (props: IProps, ref: ForwardedRef<HTMLDivElement>) => {
        const { preset, children, ...Rest } = props;

        return (
            <Box ref={ref} {...normalConfig(preset)} {...Rest}>
                {children}
            </Box>
        );
    },
);

interface IProps extends BoxProps {
    /**
     * 预设样式
     */
    preset: PresetType;
}

type TConfig = {
    [K in PresetType]: {
        size?: BoxProps["fontSize"];
        weight?: BoxProps["fontWeight"];
        lineHeight?: BoxProps["lineHeight"];
        letterSpacing?: BoxProps["letterSpacing"];
        textTransform?: BoxProps["textTransform"];
    };
};

export { TConfig as BoxConfig };
