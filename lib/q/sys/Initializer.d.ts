import { Processor } from "./Dom";
export declare class AttributeDerectives implements Processor.Def {
    static _default: AttributeDerectives;
    static readonly default: AttributeDerectives;
    name: string;
    attribute: string;
    check?(x: Processor.Tree, e: Processor.Instance): boolean;
    execute(xx: Processor.Tree, m: Processor.Instance): Processor.Tree;
    valueParser?(value: string): void;
    readonly priority: number;
    isPrimitive: boolean;
    isFinalizer: boolean;
}
export declare class PropertyDerectives implements Processor.Def {
    static _default: PropertyDerectives;
    static readonly default: PropertyDerectives;
    name: string;
    attribute: string;
    check?(x: Processor.Tree, e: Processor.Instance): boolean;
    execute(xx: Processor.Tree, m: Processor.Instance): Processor.Tree;
    valueParser?(value: string): void;
    readonly priority: number;
    isPrimitive: boolean;
    isFinalizer: boolean;
}
export declare module bom {
    function extractScopString(v: string, bm?: number): {
        scop: string;
        mode: number;
        dotted: boolean;
    };
    function extractCommand(v: string): {
        job: string;
        scop: {
            scop: string;
            mode: number;
            dotted: boolean;
        };
    };
    function load(): void;
}
