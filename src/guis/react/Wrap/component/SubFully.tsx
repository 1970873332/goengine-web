import { Box, BoxProps } from "@mui/material";
import clsx from "clsx";
import { ForwardedRef, forwardRef, ReactNode } from "react";

/**
 * 子元素
 */
export const SubFully = forwardRef(
    (props: IProps, ref: ForwardedRef<HTMLDivElement>) => {
        const {
            wrapProps = {},
            backgroundNode,
            className,
            children,
            wrapRef,
            ...Rest
        } = props;

        const { className: wrapClassName, ...wrapRest } = wrapProps;

        return (
            <Box ref={ref} position="relative" className={className} {...Rest}>
                {backgroundNode}
                <Box
                    ref={wrapRef}
                    className={clsx(
                        "absolute inset-0 overflow-auto",
                        wrapClassName,
                    )}
                    {...wrapRest}
                >
                    {children}
                </Box>
            </Box>
        );
    },
);

interface IProps extends BoxProps {
    wrapProps?: BoxProps;
    backgroundNode?: ReactNode;
    wrapRef?: ForwardedRef<HTMLDivElement>;
}
