import { ReactNode } from "react";
import ViewComponent, { ViewComponentProps } from "../../View";
import { CommonSimulatorProps } from "../component/Common";
import MobileDeviceData from "../data/MobileDevice";
import { CommonSimulator } from "../Index";

/**
 * 移动端
 */
export default class Mobile extends ViewComponent<IProps> {
    public static readonly simulatorProps: CommonSimulatorProps = {
        scale: 1,
        width: 390,
        height: 844,
        device: new MobileDeviceData(),
    };

    render(): ReactNode {
        return (
            <CommonSimulator
                title="移动端"
                {...Mobile.simulatorProps}
                {...this.mergerProps}
            />
        );
    }
}

interface IProps extends ViewComponentProps, Partial<CommonSimulatorProps> {}
