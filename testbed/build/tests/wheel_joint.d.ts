import * as b2 from "@box2d";
import * as testbed from "@testbed";
export declare class WheelJoint extends testbed.Test {
    constructor();
    m_joint: b2.WheelJoint;
    private static Step_s_F;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
export declare const testIndex: number;