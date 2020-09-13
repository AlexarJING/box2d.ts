import * as testbed from "../testbed.js";
/**
 * This stress tests the dynamic tree broad-phase. This also
 * shows that tile based collision is _not_ smooth due to Box2D
 * not knowing about adjacency.
 */
export declare class Tiles extends testbed.Test {
    static readonly e_count = 20;
    m_fixtureCount: number;
    m_createTime: number;
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=tiles.d.ts.map