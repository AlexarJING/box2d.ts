export declare function b2Assert(condition: boolean, ...args: any[]): void;
export declare function b2Maybe<T>(value: T | undefined, def: T): T;
export declare const b2_maxFloat: number;
export declare const b2_epsilon: number;
export declare const b2_epsilon_sq: number;
export declare const b2_pi: number;
export declare const b2_maxManifoldPoints: number;
export declare const b2_maxPolygonVertices: number;
export declare const b2_aabbExtension: number;
export declare const b2_aabbMultiplier: number;
export declare const b2_linearSlop: number;
export declare const b2_angularSlop: number;
export declare const b2_polygonRadius: number;
export declare const b2_maxSubSteps: number;
export declare const b2_maxTOIContacts: number;
export declare const b2_velocityThreshold: number;
export declare const b2_maxLinearCorrection: number;
export declare const b2_maxAngularCorrection: number;
export declare const b2_maxTranslation: number;
export declare const b2_maxTranslationSquared: number;
export declare const b2_maxRotation: number;
export declare const b2_maxRotationSquared: number;
export declare const b2_baumgarte: number;
export declare const b2_toiBaumgarte: number;
export declare const b2_invalidParticleIndex: number;
export declare const b2_maxParticleIndex: number;
export declare const b2_particleStride: number;
export declare const b2_minParticleWeight: number;
export declare const b2_maxParticlePressure: number;
export declare const b2_maxParticleForce: number;
export declare const b2_maxTriadDistance: number;
export declare const b2_maxTriadDistanceSquared: number;
export declare const b2_minParticleSystemBufferCapacity: number;
export declare const b2_barrierCollisionTime: number;
export declare const b2_timeToSleep: number;
export declare const b2_linearSleepTolerance: number;
export declare const b2_angularSleepTolerance: number;
export declare function b2Alloc(size: number): any;
export declare function b2Free(mem: any): void;
export declare function b2Log(message: string, ...args: any[]): void;
export declare class b2Version {
    major: number;
    minor: number;
    revision: number;
    constructor(major?: number, minor?: number, revision?: number);
    toString(): string;
}
export declare const b2_version: b2Version;
export declare const b2_branch: string;
export declare const b2_commit: string;
export declare function b2ParseInt(v: string): number;
export declare function b2ParseUInt(v: string): number;
export declare function b2MakeArray<T>(length: number, init: (i: number) => T): T[];
export declare function b2MakeNullArray<T>(length: number): Array<T | null>;
export declare function b2MakeNumberArray(length: number, init?: number): number[];
//# sourceMappingURL=b2_settings.d.ts.map