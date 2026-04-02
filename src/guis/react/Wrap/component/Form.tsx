import { ToggleUtils } from "@core/utils/Toggle";
import {
    Box,
    Checkbox,
    Divider,
    FormControl,
    FormHelperText,
    FormLabel,
    Grid,
    GridProps,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Stack,
    Switch,
    TextareaAutosize,
    TextField,
} from "@mui/material";
import { cloneElement, Fragment, ReactElement, ReactNode } from "react";
import ReactFormData, {
    ReactFormDataConfig,
    ReactFormDataMaping,
} from "../../../../datas/form/React";
import ViewComponent, {
    ViewComponentProps,
    ViewComponentState,
} from "../../View";

/**
 * 表单
 */
export default class Form extends ViewComponent<IProps, IState> {
    renderDivider(data: ReactFormData): ReactNode {
        if (data.value.type !== ReactFormDataMaping.DIVIDER) return <></>;
        const {
            value: { props },
        } = data;
        return <Divider {...props} />;
    }

    renderInput(data: ReactFormData): ReactNode {
        if (data.value.type !== ReactFormDataMaping.INPUT) return <></>;
        const {
            value: { iv, label, error, props },
        } = data;
        return (
            <Fragment>
                {label && <FormLabel>{label}</FormLabel>}
                <TextField label={label} value={iv} {...props} />
                {error && (
                    <FormHelperText>{ToggleUtils.lazy(error)}</FormHelperText>
                )}
            </Fragment>
        );
    }

    renderCheckbox(data: ReactFormData): ReactNode {
        if (data.value.type !== ReactFormDataMaping.CHECKBOX) return <></>;
        const {
            value: { iv, label, error, props, list },
        } = data;
        return (
            <Fragment>
                {label && <FormLabel>{label}</FormLabel>}
                <Box>
                    {list?.map((item, index) => (
                        <Checkbox
                            key={index}
                            value={item}
                            checked={iv?.includes(item as never)}
                            {...props}
                        />
                    ))}
                </Box>
                {error && (
                    <FormHelperText>{ToggleUtils.lazy(error)}</FormHelperText>
                )}
            </Fragment>
        );
    }

    renderRadio(data: ReactFormData): ReactNode {
        if (data.value.type !== ReactFormDataMaping.RADIO) return <></>;
        const {
            value: { iv, label, error, props, list },
        } = data;
        return (
            <Fragment>
                {label && <FormLabel>{label}</FormLabel>}
                <RadioGroup>
                    {list?.map((item, index) => (
                        <Radio
                            key={index}
                            value={item}
                            checked={iv === item}
                            {...props}
                        />
                    ))}
                </RadioGroup>
                {error && (
                    <FormHelperText>{ToggleUtils.lazy(error)}</FormHelperText>
                )}
            </Fragment>
        );
    }

    renderSwitch(data: ReactFormData): ReactNode {
        if (data.value.type !== ReactFormDataMaping.SWITCH) return <></>;
        const {
            value: { iv, label, error, props },
        } = data;
        return (
            <Fragment>
                {label && <FormLabel>{label}</FormLabel>}
                <Switch value={iv} {...props} />
                {error && (
                    <FormHelperText>{ToggleUtils.lazy(error)}</FormHelperText>
                )}
            </Fragment>
        );
    }

    renderSelect(data: ReactFormData): ReactNode {
        if (data.value.type !== ReactFormDataMaping.SELECT) return <></>;
        const {
            value: { iv, label, error, props, list },
        } = data;
        return (
            <Fragment>
                {label && <InputLabel>{label}</InputLabel>}
                <Select label={label} value={iv} {...props}>
                    {list?.map((item, index) => (
                        <MenuItem key={index} children={item.value} {...item} />
                    )) ?? (
                        <MenuItem disabled>
                            <em>暂无数据</em>
                        </MenuItem>
                    )}
                </Select>
                {error && (
                    <FormHelperText>{ToggleUtils.lazy(error)}</FormHelperText>
                )}
            </Fragment>
        );
    }

    renderTextarea(data: ReactFormData): ReactNode {
        if (data.value.type !== ReactFormDataMaping.TEXTAREA) return <></>;
        const {
            value: { iv, label, error, props },
        } = data;
        return (
            <Fragment>
                {label && <FormLabel>{label}</FormLabel>}
                <TextareaAutosize
                    value={iv}
                    className="border border-black/30 min-h-12 p-1 resize"
                    {...props}
                />
                {error && (
                    <FormHelperText>{ToggleUtils.lazy(error)}</FormHelperText>
                )}
            </Fragment>
        );
    }

    renderElement(data: ReactFormData): ReactNode {
        const {
            value: { type },
        } = data;
        switch (type) {
            case ReactFormDataMaping.DIVIDER:
                return this.renderDivider(data);
            case ReactFormDataMaping.INPUT:
                return this.renderInput(data);
            case ReactFormDataMaping.CHECKBOX:
                return this.renderCheckbox(data);
            case ReactFormDataMaping.RADIO:
                return this.renderRadio(data);
            case ReactFormDataMaping.SWITCH:
                return this.renderSwitch(data);
            case ReactFormDataMaping.SELECT:
                return this.renderSelect(data);
            case ReactFormDataMaping.TEXTAREA:
                return this.renderTextarea(data);
            default:
                return <></>;
        }
    }

    renderResultElement(data: ReactFormData): ReactNode {
        const {
            value: { type, element, props, list },
        } = data;
        return type === ReactFormDataMaping.GRID ? (
            list && this.renderGroupElement(list, props)
        ) : (
            <FormControl fullWidth sx={{ minHeight: "100%" }}>
                {element ?? this.renderElement(data)}
            </FormControl>
        );
    }

    renderGroupElement(data: TModule, props?: GridProps): ReactNode {
        const array: TPropsData[] = Array.isArray(data) ? data : [data];
        return (
            <Grid container flexWrap="nowrap" {...props}>
                {array.map((item, index) => {
                    const itemData: ReactFormData = this.formatData(item);
                    if (itemData.value.type === ReactFormDataMaping.DIVIDER)
                        return this.renderDivider(itemData);
                    return (
                        <Grid key={index} size="grow">
                            {this.renderResultElement(itemData)}
                        </Grid>
                    );
                })}
            </Grid>
        );
    }

    renderDatas(data: TModule[]): ReactNode {
        return data.map((item, index) =>
            cloneElement(
                (Array.isArray(item)
                    ? this.renderGroupElement(item)
                    : this.renderResultElement(
                          this.formatData(item),
                      )) as ReactElement,
                {
                    key: index,
                },
            ),
        );
    }

    render(): ReactNode {
        return (
            <form className="w-full">
                <Stack gap={2}>
                    {this.renderDatas(this.mergerProps.modules)}
                </Stack>
            </form>
        );
    }

    /**
     * 格式化数据
     * @param data
     * @returns
     */
    protected formatData(data: TPropsData): ReactFormData {
        return data instanceof ReactFormData ? data : new ReactFormData(data);
    }
}

interface IState extends ViewComponentState {}

interface IProps extends ViewComponentProps {
    /**
     * 模块
     */
    modules: TModule[];
}

type TPropsData = ReactFormData | ReactFormDataConfig;

type TModule = TPropsData | TPropsData[];

export { TModule as FormModule, IProps as FormProps, IState as FormState };
