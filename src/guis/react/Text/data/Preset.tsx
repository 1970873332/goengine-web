import { BoxProps, TypographyProps } from "@mui/material";
import { BoxConfig } from "../component/Box";
import { TextConfig } from "../component/Common";

/**
 * 预设配置
 */
export const Preset: TConfig = {
    title: {
        size: {
            xs: "1.2rem",
            sm: "1.8rem",
            md: "2.6rem",
            lg: "3.0rem",
            xl: "3.4rem",
        },
        weight: "bold",
    },
    middleTitle: {
        size: {
            xs: "0.9rem",
            sm: "1.5rem",
            md: "2.0rem",
            lg: "2.4rem",
            xl: "2.8rem",
        },
        weight: "bold",
    },
    smallTitle: {
        size: {
            xs: "0.7rem",
            sm: "1.3rem",
            md: "1.8rem",
            lg: "2.2rem",
            xl: "2.6rem",
        },
        weight: "bold",
    },
    viceTitle: {
        size: {
            xs: "1.1rem",
            sm: "1.4rem",
            md: "2.0rem",
            lg: "2.4rem",
            xl: "2.8rem",
        },
        weight: "regular",
        textTransform: "uppercase",
    },
    middleViceTitle: {
        size: {
            xs: "0.9rem",
            sm: "1.2rem",
            md: "1.8rem",
            lg: "2.2rem",
            xl: "2.6rem",
        },
        weight: "regular",
        textTransform: "uppercase",
    },
    smallViceTitle: {
        size: {
            xs: "0.7rem",
            sm: "1.0rem",
            md: "1.6rem",
            lg: "2.0rem",
            xl: "2.4rem",
        },
        weight: "regular",
        textTransform: "uppercase",
    },
    bigContent: {
        size: {
            xs: "0.9rem",
            sm: "1.2rem",
            md: "1.3rem",
            lg: "1.7rem",
            xl: "2.1rem",
        },
        weight: "medium",
        letterSpacing: "0.1rem",
    },
    content: {
        size: {
            xs: "0.7rem",
            sm: "1.0rem",
            md: "1.1rem",
            lg: "1.5rem",
            xl: "1.9rem",
        },
        weight: "medium",
        letterSpacing: "0.1rem",
    },
    middleContent: {
        size: {
            xs: "0.6rem",
            sm: "0.9rem",
            md: "1.0rem",
            lg: "1.4rem",
            xl: "1.8rem",
        },
        weight: "medium",
        letterSpacing: "0.1rem",
    },
    smallContent: {
        size: {
            xs: "0.5rem",
            sm: "0.8rem",
            md: "0.9rem",
            lg: "1.3rem",
            xl: "1.7rem",
        },
        weight: "medium",
        letterSpacing: "0.1rem",
    },
};

/**
 * 标准化配置
 * @param preset
 * @returns
 */
export function normalConfig(preset: TPreset): Partial<BoxProps> {
    const { size, weight, lineHeight, letterSpacing, textTransform } =
        Preset[preset];

    return {
        fontSize: size,
        fontWeight: weight,
        lineHeight: lineHeight,
        letterSpacing: letterSpacing,
        textTransform: textTransform,
    };
}
/**
 * 标准化配置
 * @param preset
 * @returns
 */
export function normalTypographyConfig(
    preset: TPreset,
): Partial<TypographyProps> {
    const { size, weight, lineHeight, letterSpacing, textTransform } =
        Preset[preset];

    return {
        fontSize: size,
        fontWeight: weight,
        lineHeight: lineHeight,
        letterSpacing: letterSpacing,
        textTransform: textTransform,
    };
}

/**
 * 预设类型
 */
type TPreset =
    | "title"
    | "middleTitle"
    | "smallTitle"
    | "viceTitle"
    | "middleViceTitle"
    | "smallViceTitle"
    | "bigContent"
    | "content"
    | "middleContent"
    | "smallContent";
/**
 * 配置
 */
type TConfig = BoxConfig & TextConfig;

export { TConfig as PresetDataConfig, TPreset as PresetType };
