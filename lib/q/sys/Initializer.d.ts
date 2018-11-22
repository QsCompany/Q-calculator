import { bind } from "./Corelib";
import { Processor } from "./Dom";
import { Parser } from "./Syntaxer";
export declare class AttributeScop extends bind.Scop {
    getAttrValue(): any;
    static _build(e: bind.ScopBuilderEventArg): AttributeScop;
    Is(toke: string | Parser.CToken): boolean;
    protected _OnValueChanged(e: bind.EventArgs<any, any>): void;
    dom: Element;
    attribute: null | string | string[];
    constructor(e: bind.ScopBuilderEventArg);
    MdObserverElement(el: Element, config: MutationObserverInit): MutationObserver;
    private observer;
    onAttributeChanged(mutations: MutationRecord[], _observer: MutationObserver): void;
    Dispose(): void;
}
export declare class AttributeDerectives implements Processor.Def {
    static _default: AttributeDerectives;
    static readonly default: AttributeDerectives;
    name: string;
    attribute: string;
    check?(_x: Processor.Tree, _e: Processor.Instance): boolean;
    static flip(mode: bind.BindingMode): 0 | 1 | 2 | 3;
    execute(xx: Processor.Tree, m: Processor.Instance): Processor.Tree;
    valueParser?(_value: string): void;
    readonly priority: number;
    isPrimitive: boolean;
    isFinalizer: boolean;
}
export declare class PropertyDerectives implements Processor.Def {
    static _default: PropertyDerectives;
    static readonly default: PropertyDerectives;
    name: string;
    attribute: string;
    check?(_x: Processor.Tree, _e: Processor.Instance): boolean;
    private getName;
    private buildDeriScop;
    execute(xx: Processor.Tree, m: Processor.Instance): Processor.Tree;
    valueParser?(_value: string): void;
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
//# sourceMappingURL=Initializer.d.ts.map