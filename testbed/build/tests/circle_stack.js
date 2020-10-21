/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, SphereStack, testIndex;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_1) {
                b2 = b2_1;
            },
            function (testbed_1) {
                testbed = testbed_1;
            }
        ],
        execute: function () {
            SphereStack = class SphereStack extends testbed.Test {
                constructor() {
                    super();
                    this.m_bodies = [];
                    {
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    {
                        const shape = new b2.CircleShape();
                        shape.m_radius = 1.0;
                        for (let i = 0; i < SphereStack.e_count; ++i) {
                            const bd = new b2.BodyDef();
                            bd.type = b2.BodyType.b2_dynamicBody;
                            bd.position.Set(0.0, 4.0 + 3.0 * i);
                            this.m_bodies[i] = this.m_world.CreateBody(bd);
                            this.m_bodies[i].CreateFixture(shape, 1.0);
                            this.m_bodies[i].SetLinearVelocity(new b2.Vec2(0.0, -50.0));
                        }
                    }
                }
                Step(settings) {
                    super.Step(settings);
                    // for (let i: number = 0; i < SphereStack.e_count; ++i)
                    // {
                    //   printf("%g ", this.m_bodies[i].GetWorldCenter().y);
                    // }
                    // for (let i: number = 0; i < SphereStack.e_count; ++i)
                    // {
                    //   printf("%g ", this.m_bodies[i].GetLinearVelocity().y);
                    // }
                    // printf("\n");
                }
                static Create() {
                    return new SphereStack();
                }
            };
            exports_1("SphereStack", SphereStack);
            SphereStack.e_count = 10;
            exports_1("testIndex", testIndex = testbed.RegisterTest("Stacking", "Circles", SphereStack.Create));
        }
    };
});
//# sourceMappingURL=circle_stack.js.map