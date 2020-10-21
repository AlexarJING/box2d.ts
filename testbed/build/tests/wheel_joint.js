/*
* Copyright (c) 2006-2012 Erin Catto http://www.box2d.org
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
    var b2, testbed, WheelJoint, testIndex;
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
            WheelJoint = class WheelJoint extends testbed.Test {
                constructor() {
                    super();
                    // b2Body* ground = NULL;
                    let ground = null;
                    {
                        // b2BodyDef bd;
                        const bd = new b2.BodyDef();
                        // ground = m_world->CreateBody(&bd);
                        ground = this.m_world.CreateBody(bd);
                        // b2EdgeShape shape;
                        const shape = new b2.EdgeShape();
                        // shape.SetTwoSided(b2Vec2(-40.0f, 0.0f), b2Vec2(40.0f, 0.0f));
                        shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
                        // ground->CreateFixture(&shape, 0.0f);
                        ground.CreateFixture(shape, 0.0);
                    }
                    // m_enableLimit = true;
                    // m_enableMotor = false;
                    // m_motorSpeed = 10.0f;
                    {
                        // b2CircleShape shape;
                        const shape = new b2.CircleShape();
                        // shape.m_radius = 2.0f;
                        shape.m_radius = 2.0;
                        // b2BodyDef bd;
                        const bd = new b2.BodyDef();
                        // bd.type = b2_dynamicBody;
                        bd.type = b2.dynamicBody;
                        // bd.position.Set(0.0f, 10.0f);
                        bd.position.Set(0.0, 10.0);
                        // bd.allowSleep = false;
                        bd.allowSleep = false;
                        // b2Body* body = m_world->CreateBody(&bd);
                        const body = this.m_world.CreateBody(bd);
                        // body->CreateFixture(&shape, 5.0f);
                        body.CreateFixture(shape, 5.0);
                        // b2WheelJointDef jd;
                        const jd = new b2.WheelJointDef();
                        // Horizontal
                        // jd.Initialize(ground, body, bd.position, b2Vec2(0.0f, 1.0f));
                        jd.Initialize(ground, body, bd.position, new b2.Vec2(0.0, 1.0));
                        // jd.motorSpeed = m_motorSpeed;
                        jd.motorSpeed = 10.0;
                        // jd.maxMotorTorque = 10000.0f;
                        jd.maxMotorTorque = 10000.0;
                        // jd.enableMotor = m_enableMotor;
                        jd.enableMotor = true;
                        // jd.lowerTranslation = -3.0f;
                        jd.lowerTranslation = -3.0;
                        // jd.upperTranslation = 3.0f;
                        jd.upperTranslation = 3.0;
                        // jd.enableLimit = m_enableLimit;
                        jd.enableLimit = true;
                        // float hertz = 1.0f;
                        const hertz = 1.0;
                        // float dampingRatio = 0.7f;
                        const dampingRatio = 0.7;
                        // b2LinearStiffness(jd.stiffness, jd.damping, hertz, dampingRatio, ground, body);
                        b2.LinearStiffness(jd, hertz, dampingRatio, ground, body);
                        // m_joint = (b2WheelJoint*)m_world->CreateJoint(&jd);
                        this.m_joint = this.m_world.CreateJoint(jd);
                    }
                }
                Step(settings) {
                    super.Step(settings);
                    // float torque = m_joint->GetMotorTorque(settings.m_hertz);
                    const torque = this.m_joint.GetMotorTorque(settings.m_hertz);
                    // g_debugDraw.DrawString(5, m_textLine, "Motor Torque = %4.0f", torque);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `Motor Torque = ${torque.toFixed(0)}`);
                    // m_textLine += m_textIncrement;
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    // b2Vec2 F = m_joint->GetReactionForce(settings.m_hertz);
                    const F = this.m_joint.GetReactionForce(settings.m_hertz, WheelJoint.Step_s_F);
                    // g_debugDraw.DrawString(5, m_textLine, "Reaction Force = (%4.1f, %4.1f)", F.x, F.y);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `Reaction Force = (${F.x.toFixed(1)}, ${F.y.toFixed(1)})`);
                    // m_textLine += m_textIncrement;
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                }
                static Create() {
                    return new WheelJoint();
                }
            };
            exports_1("WheelJoint", WheelJoint);
            WheelJoint.Step_s_F = new b2.Vec2();
            exports_1("testIndex", testIndex = testbed.RegisterTest("Joints", "Wheel", WheelJoint.Create));
        }
    };
});
//# sourceMappingURL=wheel_joint.js.map