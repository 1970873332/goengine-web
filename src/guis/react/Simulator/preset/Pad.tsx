import { ReactNode } from "react";
import ViewComponent, { ViewComponentProps } from "../../View";
import { CommonSimulatorProps } from "../component/Common";
import PadDeviceData from "../data/PadDevice";
import { CommonSimulator } from "../Index";

/**
 * pad端
 */
export default class Pad extends ViewComponent<IProps> {
    public static readonly simulatorProps: CommonSimulatorProps = {
        scale: 1,
        width: 800,
        height: 480,
        device: new PadDeviceData(),
    };

    render(): ReactNode {
        return (
            <CommonSimulator {...Pad.simulatorProps} {...this.mergerProps} />
        );
    }
}

interface IProps extends ViewComponentProps, Partial<CommonSimulatorProps> {}
