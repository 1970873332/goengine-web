import { CharUtils } from "@core/utils/Char";
import { Button, buttonClasses, ButtonProps, styled } from "@mui/material";
import { ForwardedRef, forwardRef, ReactNode } from "react";

/**
 * 通用按钮
 */
export const CommonButton = forwardRef(
    (props: IProps, ref: ForwardedRef<HTMLButtonElement>) => {
        const {
            normal,
            pressed,
            children,
            initialPressed = false,
            ...Rest
        } = props;

        return (
            <Root ref={ref} {...Rest}>
                {children ?? (initialPressed ? pressed : normal)}
            </Root>
        );
    },
);

const Root = styled(Button)(({ theme }) => {
    const hover: Partial<CSSStyleDeclaration> = {
        opacity: `0.7`,
    };
    const focusVisible: Partial<CSSStyleDeclaration> = {
        outline: `2px solid ${theme.palette.primary.main}`,
    };
    const disabled: Partial<CSSStyleDeclaration> = {
        cursor: `default`,
        transform: `scale(1)`,
    };
    return {
        cursor: `pointer`,
        transition: `all 150ms ease`,
        ":hover": hover,
        [CharUtils.normalStyledName(buttonClasses.focusVisible)]: focusVisible,
        [CharUtils.normalStyledName(buttonClasses.disabled)]: disabled,
    };
});

interface IProps extends ButtonProps {
    /**
     * 按钮是否按下
     */
    initialPressed?: boolean;
    /**
     * 按钮正常状态的组件
     */
    normal?: ReactNode;
    /**
     * 按钮按下状态的组件
     */
    pressed?: ReactNode;
}
