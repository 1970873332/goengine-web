import { ReactNode } from "react";
import ViewComponent, { ViewComponentProps } from "../../View";
import { CommonSimulatorProps } from "../component/Common";
import DesktopDeviceData from "../data/DesktopDevice";
import { CommonSimulator } from "../Index";

/**
 * 桌面端
 */
export default class Desktop extends ViewComponent<IProps> {
    public static readonly simulatorProps: CommonSimulatorProps = {
        scale: 0.5,
        width: 1920,
        height: 1080,
        device: new DesktopDeviceData(),
    };

    render(): ReactNode {
        return (
            <CommonSimulator
                title="桌面端"
                {...Desktop.simulatorProps}
                {...this.mergerProps}
            />
        );
    }
}

interface IProps extends ViewComponentProps, Partial<CommonSimulatorProps> {}
