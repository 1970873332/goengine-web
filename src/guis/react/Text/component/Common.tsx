import { Typography, TypographyProps } from "@mui/material";
import { ForwardedRef, forwardRef } from "react";
import { normalTypographyConfig, PresetType } from "../data/Preset";

/**
 * 通用文本
 */
export const CommonText = forwardRef(
    (props: IProps, ref: ForwardedRef<HTMLPreElement>) => {
        const { preset, children, ...Rest } = props;

        return (
            <Typography
                ref={ref}
                color="#fff"
                whiteSpace="pre-line"
                {...normalTypographyConfig(preset)}
                {...Rest}
            >
                {children}
            </Typography>
        );
    },
);

interface IProps extends TypographyProps {
    /**
     * 预设样式
     */
    preset: PresetType;
}

type TConfig = {
    [K in PresetType]: {
        size?: TypographyProps["fontSize"];
        weight?: TypographyProps["fontWeight"];
        lineHeight?: TypographyProps["lineHeight"];
        letterSpacing?: TypographyProps["letterSpacing"];
        textTransform?: TypographyProps["textTransform"];
    };
};

export { TConfig as TextConfig, IProps as TextProps };
