/*
* Copyright (c) 2006-2007 Erin Catto http://www.box2d.org
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
import { b2_linearSlop, b2Maybe, b2_maxFloat } from "../common/b2_settings.js";
import { b2Abs, b2Clamp, b2Vec2, b2Rot, b2Max, b2Transform } from "../common/b2_math.js";
import { b2Joint, b2JointDef, b2JointType } from "./b2_joint.js";
import { b2Color } from "../common/b2_draw.js";
/// Distance joint definition. This requires defining an
/// anchor point on both bodies and the non-zero length of the
/// distance joint. The definition uses local anchor points
/// so that the initial configuration can violate the constraint
/// slightly. This helps when saving and loading a game.
/// @warning Do not use a zero or short length.
export class b2DistanceJointDef extends b2JointDef {
    constructor() {
        super(b2JointType.e_distanceJoint);
        this.localAnchorA = new b2Vec2();
        this.localAnchorB = new b2Vec2();
        this.length = 1;
        this.minLength = 0;
        this.maxLength = b2_maxFloat; // FLT_MAX;
        this.stiffness = 0;
        this.damping = 0;
    }
    Initialize(b1, b2, anchor1, anchor2) {
        this.bodyA = b1;
        this.bodyB = b2;
        this.bodyA.GetLocalPoint(anchor1, this.localAnchorA);
        this.bodyB.GetLocalPoint(anchor2, this.localAnchorB);
        this.length = b2Max(b2Vec2.DistanceVV(anchor1, anchor2), b2_linearSlop);
        this.minLength = this.length;
        this.maxLength = this.length;
    }
}
export class b2DistanceJoint extends b2Joint {
    constructor(def) {
        super(def);
        this.m_stiffness = 0;
        this.m_damping = 0;
        this.m_bias = 0;
        this.m_length = 0;
        this.m_minLength = 0;
        this.m_maxLength = 0;
        // Solver shared
        this.m_localAnchorA = new b2Vec2();
        this.m_localAnchorB = new b2Vec2();
        this.m_gamma = 0;
        this.m_impulse = 0;
        this.m_lowerImpulse = 0;
        this.m_upperImpulse = 0;
        // Solver temp
        this.m_indexA = 0;
        this.m_indexB = 0;
        this.m_u = new b2Vec2();
        this.m_rA = new b2Vec2();
        this.m_rB = new b2Vec2();
        this.m_localCenterA = new b2Vec2();
        this.m_localCenterB = new b2Vec2();
        this.m_currentLength = 0;
        this.m_invMassA = 0;
        this.m_invMassB = 0;
        this.m_invIA = 0;
        this.m_invIB = 0;
        this.m_softMass = 0;
        this.m_mass = 0;
        this.m_qA = new b2Rot();
        this.m_qB = new b2Rot();
        this.m_lalcA = new b2Vec2();
        this.m_lalcB = new b2Vec2();
        this.m_localAnchorA.Copy(b2Maybe(def.localAnchorA, b2Vec2.ZERO));
        this.m_localAnchorB.Copy(b2Maybe(def.localAnchorB, b2Vec2.ZERO));
        this.m_length = b2Max(b2Maybe(def.length, this.GetCurrentLength()), b2_linearSlop);
        this.m_minLength = b2Max(b2Maybe(def.minLength, this.m_length), b2_linearSlop);
        this.m_maxLength = b2Max(b2Maybe(def.maxLength, this.m_length), this.m_minLength);
        this.m_stiffness = b2Maybe(def.stiffness, 0);
        this.m_damping = b2Maybe(def.damping, 0);
    }
    GetAnchorA(out) {
        return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
    }
    GetAnchorB(out) {
        return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
    }
    GetReactionForce(inv_dt, out) {
        // b2Vec2 F = inv_dt * (m_impulse + m_lowerImpulse - m_upperImpulse) * m_u;
        out.x = inv_dt * (this.m_impulse + this.m_lowerImpulse - this.m_upperImpulse) * this.m_u.x;
        out.y = inv_dt * (this.m_impulse + this.m_lowerImpulse - this.m_upperImpulse) * this.m_u.y;
        return out;
    }
    GetReactionTorque(inv_dt) {
        return 0;
    }
    GetLocalAnchorA() { return this.m_localAnchorA; }
    GetLocalAnchorB() { return this.m_localAnchorB; }
    SetLength(length) {
        this.m_impulse = 0;
        this.m_length = b2Max(b2_linearSlop, length);
        return this.m_length;
    }
    GetLength() {
        return this.m_length;
    }
    SetMinLength(minLength) {
        this.m_lowerImpulse = 0;
        this.m_minLength = b2Clamp(minLength, b2_linearSlop, this.m_maxLength);
        return this.m_minLength;
    }
    SetMaxLength(maxLength) {
        this.m_upperImpulse = 0;
        this.m_maxLength = b2Max(maxLength, this.m_minLength);
        return this.m_maxLength;
    }
    GetCurrentLength() {
        const pA = this.m_bodyA.GetWorldPoint(this.m_localAnchorA, new b2Vec2());
        const pB = this.m_bodyB.GetWorldPoint(this.m_localAnchorB, new b2Vec2());
        return b2Vec2.DistanceVV(pA, pB);
    }
    SetStiffness(stiffness) {
        this.m_stiffness = stiffness;
    }
    GetStiffness() {
        return this.m_stiffness;
    }
    SetDamping(damping) {
        this.m_damping = damping;
    }
    GetDamping() {
        return this.m_damping;
    }
    Dump(log) {
        const indexA = this.m_bodyA.m_islandIndex;
        const indexB = this.m_bodyB.m_islandIndex;
        log("  const jd: b2DistanceJointDef = new b2DistanceJointDef();\n");
        log("  jd.bodyA = bodies[%d];\n", indexA);
        log("  jd.bodyB = bodies[%d];\n", indexB);
        log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
        log("  jd.localAnchorA.Set(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
        log("  jd.localAnchorB.Set(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
        log("  jd.length = %.15f;\n", this.m_length);
        log("  jd.minLength = %.15f;\n", this.m_minLength);
        log("  jd.maxLength = %.15f;\n", this.m_maxLength);
        log("  jd.stiffness = %.15f;\n", this.m_stiffness);
        log("  jd.damping = %.15f;\n", this.m_damping);
        log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
    }
    InitVelocityConstraints(data) {
        this.m_indexA = this.m_bodyA.m_islandIndex;
        this.m_indexB = this.m_bodyB.m_islandIndex;
        this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
        this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
        this.m_invMassA = this.m_bodyA.m_invMass;
        this.m_invMassB = this.m_bodyB.m_invMass;
        this.m_invIA = this.m_bodyA.m_invI;
        this.m_invIB = this.m_bodyB.m_invI;
        const cA = data.positions[this.m_indexA].c;
        const aA = data.positions[this.m_indexA].a;
        const vA = data.velocities[this.m_indexA].v;
        let wA = data.velocities[this.m_indexA].w;
        const cB = data.positions[this.m_indexB].c;
        const aB = data.positions[this.m_indexB].a;
        const vB = data.velocities[this.m_indexB].v;
        let wB = data.velocities[this.m_indexB].w;
        // const qA: b2Rot = new b2Rot(aA), qB: b2Rot = new b2Rot(aB);
        const qA = this.m_qA.SetAngle(aA), qB = this.m_qB.SetAngle(aB);
        // m_rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
        b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
        b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
        // m_rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
        b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
        b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
        // m_u = cB + m_rB - cA - m_rA;
        this.m_u.x = cB.x + this.m_rB.x - cA.x - this.m_rA.x;
        this.m_u.y = cB.y + this.m_rB.y - cA.y - this.m_rA.y;
        // Handle singularity.
        this.m_currentLength = this.m_u.Length();
        if (this.m_currentLength > b2_linearSlop) {
            this.m_u.SelfMul(1 / this.m_currentLength);
        }
        else {
            this.m_u.SetZero();
            this.m_mass = 0;
            this.m_impulse = 0;
            this.m_lowerImpulse = 0;
            this.m_upperImpulse = 0;
        }
        // float32 crAu = b2Cross(m_rA, m_u);
        const crAu = b2Vec2.CrossVV(this.m_rA, this.m_u);
        // float32 crBu = b2Cross(m_rB, m_u);
        const crBu = b2Vec2.CrossVV(this.m_rB, this.m_u);
        // float32 invMass = m_invMassA + m_invIA * crAu * crAu + m_invMassB + m_invIB * crBu * crBu;
        let invMass = this.m_invMassA + this.m_invIA * crAu * crAu + this.m_invMassB + this.m_invIB * crBu * crBu;
        this.m_mass = invMass !== 0 ? 1 / invMass : 0;
        if (this.m_stiffness > 0 && this.m_minLength < this.m_maxLength) {
            // soft
            const C = this.m_currentLength - this.m_length;
            const d = this.m_damping;
            const k = this.m_stiffness;
            // magic formulas
            const h = data.step.dt;
            // gamma = 1 / (h * (d + h * k))
            // the extra factor of h in the denominator is since the lambda is an impulse, not a force
            this.m_gamma = h * (d + h * k);
            this.m_gamma = this.m_gamma !== 0 ? 1 / this.m_gamma : 0;
            this.m_bias = C * h * k * this.m_gamma;
            invMass += this.m_gamma;
            this.m_softMass = invMass !== 0 ? 1 / invMass : 0;
        }
        else {
            // rigid
            this.m_gamma = 0;
            this.m_bias = 0;
            this.m_softMass = this.m_mass;
        }
        if (data.step.warmStarting) {
            // Scale the impulse to support a variable time step.
            this.m_impulse *= data.step.dtRatio;
            this.m_lowerImpulse *= data.step.dtRatio;
            this.m_upperImpulse *= data.step.dtRatio;
            const P = b2Vec2.MulSV(this.m_impulse + this.m_lowerImpulse - this.m_upperImpulse, this.m_u, b2DistanceJoint.InitVelocityConstraints_s_P);
            vA.SelfMulSub(this.m_invMassA, P);
            wA -= this.m_invIA * b2Vec2.CrossVV(this.m_rA, P);
            vB.SelfMulAdd(this.m_invMassB, P);
            wB += this.m_invIB * b2Vec2.CrossVV(this.m_rB, P);
        }
        else {
            this.m_impulse = 0;
        }
        // data.velocities[this.m_indexA].v = vA;
        data.velocities[this.m_indexA].w = wA;
        // data.velocities[this.m_indexB].v = vB;
        data.velocities[this.m_indexB].w = wB;
    }
    SolveVelocityConstraints(data) {
        const vA = data.velocities[this.m_indexA].v;
        let wA = data.velocities[this.m_indexA].w;
        const vB = data.velocities[this.m_indexB].v;
        let wB = data.velocities[this.m_indexB].w;
        if (this.m_minLength < this.m_maxLength) {
            if (this.m_stiffness > 0) {
                // Cdot = dot(u, v + cross(w, r))
                const vpA = b2Vec2.AddVCrossSV(vA, wA, this.m_rA, b2DistanceJoint.SolveVelocityConstraints_s_vpA);
                const vpB = b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2DistanceJoint.SolveVelocityConstraints_s_vpB);
                const Cdot = b2Vec2.DotVV(this.m_u, b2Vec2.SubVV(vpB, vpA, b2Vec2.s_t0));
                const impulse = -this.m_softMass * (Cdot + this.m_bias + this.m_gamma * this.m_impulse);
                this.m_impulse += impulse;
                const P = b2Vec2.MulSV(impulse, this.m_u, b2DistanceJoint.SolveVelocityConstraints_s_P);
                vA.SelfMulSub(this.m_invMassA, P);
                wA -= this.m_invIA * b2Vec2.CrossVV(this.m_rA, P);
                vB.SelfMulAdd(this.m_invMassB, P);
                wB += this.m_invIB * b2Vec2.CrossVV(this.m_rB, P);
            }
            // lower
            {
                const C = this.m_currentLength - this.m_minLength;
                const bias = b2Max(0, C) * data.step.inv_dt;
                const vpA = b2Vec2.AddVCrossSV(vA, wA, this.m_rA, b2DistanceJoint.SolveVelocityConstraints_s_vpA);
                const vpB = b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2DistanceJoint.SolveVelocityConstraints_s_vpB);
                const Cdot = b2Vec2.DotVV(this.m_u, b2Vec2.SubVV(vpB, vpA, b2Vec2.s_t0));
                let impulse = -this.m_mass * (Cdot + bias);
                const oldImpulse = this.m_lowerImpulse;
                this.m_lowerImpulse = b2Max(0, this.m_lowerImpulse + impulse);
                impulse = this.m_lowerImpulse - oldImpulse;
                const P = b2Vec2.MulSV(impulse, this.m_u, b2DistanceJoint.SolveVelocityConstraints_s_P);
                vA.SelfMulSub(this.m_invMassA, P);
                wA -= this.m_invIA * b2Vec2.CrossVV(this.m_rA, P);
                vB.SelfMulAdd(this.m_invMassB, P);
                wB += this.m_invIB * b2Vec2.CrossVV(this.m_rB, P);
            }
            // upper
            {
                const C = this.m_maxLength - this.m_currentLength;
                const bias = b2Max(0, C) * data.step.inv_dt;
                const vpA = b2Vec2.AddVCrossSV(vA, wA, this.m_rA, b2DistanceJoint.SolveVelocityConstraints_s_vpA);
                const vpB = b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2DistanceJoint.SolveVelocityConstraints_s_vpB);
                const Cdot = b2Vec2.DotVV(this.m_u, b2Vec2.SubVV(vpA, vpB, b2Vec2.s_t0));
                let impulse = -this.m_mass * (Cdot + bias);
                const oldImpulse = this.m_upperImpulse;
                this.m_upperImpulse = b2Max(0, this.m_upperImpulse + impulse);
                impulse = this.m_upperImpulse - oldImpulse;
                const P = b2Vec2.MulSV(-impulse, this.m_u, b2DistanceJoint.SolveVelocityConstraints_s_P);
                vA.SelfMulSub(this.m_invMassA, P);
                wA -= this.m_invIA * b2Vec2.CrossVV(this.m_rA, P);
                vB.SelfMulAdd(this.m_invMassB, P);
                wB += this.m_invIB * b2Vec2.CrossVV(this.m_rB, P);
            }
        }
        else {
            // Equal limits
            // Cdot = dot(u, v + cross(w, r))
            const vpA = b2Vec2.AddVCrossSV(vA, wA, this.m_rA, b2DistanceJoint.SolveVelocityConstraints_s_vpA);
            const vpB = b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2DistanceJoint.SolveVelocityConstraints_s_vpB);
            const Cdot = b2Vec2.DotVV(this.m_u, b2Vec2.SubVV(vpB, vpA, b2Vec2.s_t0));
            const impulse = -this.m_mass * Cdot;
            this.m_impulse += impulse;
            const P = b2Vec2.MulSV(impulse, this.m_u, b2DistanceJoint.SolveVelocityConstraints_s_P);
            vA.SelfMulSub(this.m_invMassA, P);
            wA -= this.m_invIA * b2Vec2.CrossVV(this.m_rA, P);
            vB.SelfMulAdd(this.m_invMassB, P);
            wB += this.m_invIB * b2Vec2.CrossVV(this.m_rB, P);
        }
        // data.velocities[this.m_indexA].v = vA;
        data.velocities[this.m_indexA].w = wA;
        // data.velocities[this.m_indexB].v = vB;
        data.velocities[this.m_indexB].w = wB;
    }
    SolvePositionConstraints(data) {
        const cA = data.positions[this.m_indexA].c;
        let aA = data.positions[this.m_indexA].a;
        const cB = data.positions[this.m_indexB].c;
        let aB = data.positions[this.m_indexB].a;
        // const qA: b2Rot = new b2Rot(aA), qB: b2Rot = new b2Rot(aB);
        const qA = this.m_qA.SetAngle(aA), qB = this.m_qB.SetAngle(aB);
        // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
        const rA = b2Rot.MulRV(qA, this.m_lalcA, this.m_rA); // use m_rA
        // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
        const rB = b2Rot.MulRV(qB, this.m_lalcB, this.m_rB); // use m_rB
        // b2Vec2 u = cB + rB - cA - rA;
        const u = this.m_u; // use m_u
        u.x = cB.x + rB.x - cA.x - rA.x;
        u.y = cB.y + rB.y - cA.y - rA.y;
        const length = this.m_u.Normalize();
        let C;
        if (this.m_minLength == this.m_maxLength) {
            C = length - this.m_minLength;
        }
        else if (length < this.m_minLength) {
            C = length - this.m_minLength;
        }
        else if (this.m_maxLength < length) {
            C = length - this.m_maxLength;
        }
        else {
            return true;
        }
        const impulse = -this.m_mass * C;
        const P = b2Vec2.MulSV(impulse, u, b2DistanceJoint.SolvePositionConstraints_s_P);
        cA.SelfMulSub(this.m_invMassA, P);
        aA -= this.m_invIA * b2Vec2.CrossVV(rA, P);
        cB.SelfMulAdd(this.m_invMassB, P);
        aB += this.m_invIB * b2Vec2.CrossVV(rB, P);
        // data.positions[this.m_indexA].c = cA;
        data.positions[this.m_indexA].a = aA;
        // data.positions[this.m_indexB].c = cB;
        data.positions[this.m_indexB].a = aB;
        return b2Abs(C) < b2_linearSlop;
    }
    Draw(draw) {
        const xfA = this.m_bodyA.GetTransform();
        const xfB = this.m_bodyB.GetTransform();
        const pA = b2Transform.MulXV(xfA, this.m_localAnchorA, b2DistanceJoint.Draw_s_pA);
        const pB = b2Transform.MulXV(xfB, this.m_localAnchorB, b2DistanceJoint.Draw_s_pB);
        const axis = b2Vec2.SubVV(pB, pA, b2DistanceJoint.Draw_s_axis);
        axis.Normalize();
        const c1 = b2DistanceJoint.Draw_s_c1; // b2Color c1(0.7f, 0.7f, 0.7f);
        const c2 = b2DistanceJoint.Draw_s_c2; // b2Color c2(0.3f, 0.9f, 0.3f);
        const c3 = b2DistanceJoint.Draw_s_c3; // b2Color c3(0.9f, 0.3f, 0.3f);
        const c4 = b2DistanceJoint.Draw_s_c4; // b2Color c4(0.4f, 0.4f, 0.4f);
        draw.DrawSegment(pA, pB, c4);
        // b2Vec2 pRest = pA + this.m_length * axis;
        const pRest = b2Vec2.AddVMulSV(pA, this.m_length, axis, b2DistanceJoint.Draw_s_pRest);
        draw.DrawPoint(pRest, 8.0, c1);
        if (this.m_minLength != this.m_maxLength) {
            if (this.m_minLength > b2_linearSlop) {
                // b2Vec2 pMin = pA + this.m_minLength * axis;
                const pMin = b2Vec2.AddVMulSV(pA, this.m_minLength, axis, b2DistanceJoint.Draw_s_pMin);
                draw.DrawPoint(pMin, 4.0, c2);
            }
            if (this.m_maxLength < b2_maxFloat) {
                // b2Vec2 pMax = pA + this.m_maxLength * axis;
                const pMax = b2Vec2.AddVMulSV(pA, this.m_maxLength, axis, b2DistanceJoint.Draw_s_pMax);
                draw.DrawPoint(pMax, 4.0, c3);
            }
        }
    }
}
b2DistanceJoint.InitVelocityConstraints_s_P = new b2Vec2();
b2DistanceJoint.SolveVelocityConstraints_s_vpA = new b2Vec2();
b2DistanceJoint.SolveVelocityConstraints_s_vpB = new b2Vec2();
b2DistanceJoint.SolveVelocityConstraints_s_P = new b2Vec2();
b2DistanceJoint.SolvePositionConstraints_s_P = new b2Vec2();
b2DistanceJoint.Draw_s_pA = new b2Vec2();
b2DistanceJoint.Draw_s_pB = new b2Vec2();
b2DistanceJoint.Draw_s_axis = new b2Vec2();
b2DistanceJoint.Draw_s_c1 = new b2Color(0.7, 0.7, 0.7);
b2DistanceJoint.Draw_s_c2 = new b2Color(0.3, 0.9, 0.3);
b2DistanceJoint.Draw_s_c3 = new b2Color(0.9, 0.3, 0.3);
b2DistanceJoint.Draw_s_c4 = new b2Color(0.4, 0.4, 0.4);
b2DistanceJoint.Draw_s_pRest = new b2Vec2();
b2DistanceJoint.Draw_s_pMin = new b2Vec2();
b2DistanceJoint.Draw_s_pMax = new b2Vec2();
//# sourceMappingURL=b2_distance_joint.js.map