import { UI } from "./UI";
import { Attributes, Dom } from "./runtime";
import { Parser } from "./Syntaxer";
import { basic } from "./utils";
import { bind } from "./Corelib";
export declare namespace Processor {
    class debug {
        private static lst;
        static OnAttribute(name: any, value: any): void;
        static check(p: Instance): void;
    }
    enum Stat {
        None = 0,
        Waitting = 1,
        Executing = 2,
        Executed = 3
    }
    interface Def {
        name: string;
        attribute: string;
        check?(x: Tree, e: Instance): boolean;
        execute: (x: Processor.Tree, e: Instance) => Tree;
        valueParser?(value: string): any;
        priority?: number;
        isPrimitive?: boolean;
        isFinalizer?: boolean;
    }
    interface Instance {
        stat: Stat;
        value: any;
        instance: Def;
        manager: DerictivesExtractor;
    }
    interface ComponentCreator {
        Def: Def;
        css: string[];
        context: IContext;
        TagName: string;
    }
    class DerictivesExtractor {
        private dom;
        private static _processors;
        private static enumerator;
        static maxPriority: number;
        static getPrcessorByName(name: string): Def;
        static getPrcessorByAttribute(name: string): Def;
        static stringIsNullOrWhiteSpace(s: string): boolean;
        static registerComponent(p: attributes.ComponentArgs): void;
        static register(p: Def): Def;
        private static orderDefs;
        private static orderInstances;
        enumerator: Instance[];
        ComponentCreator: Instance;
        getProcessorByAttribute(processor: string): Instance;
        constructor(dom: HTMLElement, _attributes: Attr[], skipTag: any, insertAttributes: any);
        static CompileDerictives(x: Tree): Processor.Tree;
        private Compile;
    }
    class Tree {
        e: bind.IJobScop;
        parent: Tree;
        controller: Controller;
        creteScopBuilderEventArgs(mode?: bind.BindingMode): bind.ScopBuilderEventArg;
        readonly Scop: bind.Scop;
        readonly ParentScop: bind.Scop;
        readonly Control: UI.JControl;
        readonly Dom: Node;
        readonly IsNew: boolean;
        constructor(e: bind.IJobScop, parent: Tree, controller: Controller);
        validateE(): void;
        static New(dom: Node, parent: Tree, controller: Controller): Tree;
        static Root(dom: Node, Scop: bind.Scop, Control: UI.JControl, controller?: Controller): Tree;
        New(dom: Node): Tree;
        NewScop(scop: bind.Scop): Tree;
        NewControlScop(scop: bind.Scop): Tree;
        readonly Depth: any;
        ContinueInto: Element;
        skipProcessingChildren: boolean;
        componentData: {
            attributes: Attr[];
            slots: Dom.SlotChildrenMap;
        };
    }
    class TreeWalker {
        static ParseBinding(data: Processor.Tree): Processor.Tree;
        private static setChild;
        private static processComponentChild;
        private static processComponentChildren;
        static strTemplate(text: Text, x: Tree): bind.Scop;
        static ExploreTree(node: Processor.Tree): void;
    }
    function register(p: Def): void;
    class Compiler {
    }
    function Register(p: Processor.Def): Def;
    function Compile(x: Tree): Tree;
}
export declare namespace attributes {
    enum ContentType {
        multiple = 0,
        premitive = 1,
        signle = 2,
        costum = 3
    }
    interface ContentEventArgs {
        child: Processor.Tree;
        parent: Processor.Tree;
        slot: string;
    }
    interface ContentArgs {
        type?: ContentType;
        handler: string | ((e: ContentEventArgs) => void);
        IsProperty?: boolean;
        selector?(e: ContentEventArgs): any;
        target?: typeof UI.JControl;
        getHandler?(cnt: UI.JControl): (e: ContentEventArgs) => void;
        keepInTree?: boolean;
    }
    interface contentDecl extends Attributes.Attribute<ContentArgs> {
        (param: ContentArgs): any;
    }
    var Content: contentDecl;
    function ContentHandler(keepInTree: boolean): (target: any, propertyKey: string, des?: PropertyDescriptor) => void;
}
export declare namespace attributes {
    interface ComponentEventArgs {
        node: Processor.Tree;
        instance: Processor.Instance;
        Services: any[];
        processChildrens: boolean;
        nodesToProcess: Node[];
    }
    interface ComponentArgs {
        name: string;
        handler: string | ((e: ComponentEventArgs) => Processor.Tree);
        Serices?: Array<Function | string>;
        target?: typeof UI.JControl;
    }
    interface componentType extends Attributes.Attribute<ComponentArgs> {
        (param: ComponentArgs): any;
    }
    var Component: componentType;
    function ComponentHandler(name: string, initializer?: (ins: Processor.Instance, dom: HTMLElement) => void): (target: any, _propertyKey: string, des?: PropertyDescriptor) => void;
}
export declare namespace attributes {
    type Prototype = any;
    interface EventsList {
        [name: string]: EventArgs;
    }
    interface EventAttribute extends Attributes.Attribute<EventsList> {
        (param: EventArgs): any;
        getEventData?(type: typeof UI.JControl, name: string): EventArgs;
    }
    interface EventArgs {
        signliton?: boolean;
        name?: string;
        target?: any;
    }
    interface EventEventArgs<Sender extends UI.JControl, Data> {
        name: string;
        sender: Sender;
        Data: Data;
    }
    const Event: EventAttribute;
}
export declare namespace attributes {
    interface ComponentArgs {
        name: string;
        handler: string | ((e: ComponentEventArgs) => Processor.Tree);
        Serices?: Array<Function | string>;
        target?: typeof UI.JControl;
        initialize?: (string | ((ins: Processor.Instance, dom: HTMLElement) => void));
    }
    interface componentType extends Attributes.Attribute<ComponentArgs> {
        (param: ComponentArgs): any;
    }
    var Component: componentType;
}
export declare namespace attributes {
    interface ScopHandlerAttribute extends Attributes.Attribute<ScopHandlerArgs> {
        (param: ScopHandlerArgs): any;
    }
    interface ScopHandlerArgs {
        token: Parser.CToken | string;
        handler?: bind.ScopBuilderHandler;
        target?: typeof bind.Scop;
    }
    const Parser2Scop: ScopHandlerAttribute;
    function Parser2ScopHandler(token: Parser.CToken | string): (target: any, propertyKey: string, des?: PropertyDescriptor) => void;
}
export declare enum ProcessStat {
    NotProcessed = 0,
    Processing = 1,
    Processed = 2
}
export declare class Controller extends bind.DObject implements basic.IDisposable {
    private scops;
    registerScop(scop: bind.Scop): any;
    unregisterScop(arg0: bind.Scop): any;
    OnNodeLoaded(): any;
    readonly MainControll: UI.JControl;
    static Attach(control: UI.JControl, data?: any | bind.Scop): Controller;
    getStat(): ProcessStat;
    private Stat;
    private _stat;
    processHowEver: boolean;
    static __feilds__(): bind.DProperty<HTMLElement, Controller>[];
    static DPView: bind.DProperty<HTMLElement, Controller>;
    View: HTMLElement;
    private _JCParent;
    private _onCompiled;
    OnCompiled: basic.ITBindable<(t: this) => void>;
    private _onCompiling;
    OnCompiling: basic.ITBindable<(t: this) => void>;
    private ViewChanged;
    unlistenForNodeInsertion(odom: Node, ndisp?: boolean): void;
    private listenForNodeInsertion;
    private implemented;
    handleEvent(e: Event): void;
    private ProcessBinding;
    private static pb;
    Scop: bind.Scop;
    CurrentControl: UI.JControl;
    OldControl: UI.JControl;
    instances: bind.JobInstance[];
    private processEvent;
    constructor(cnt: UI.JControl);
    PDispose(): void;
    Dispose(): void;
    createJobInstance(name: string, x: Processor.Tree): bind.JobInstance;
}
export declare class xNode<T> {
    node: Node;
    param: T;
    unknown?: xNode<T>[];
    children: xNode<T>[];
    parent: xNode<T>;
    constructor(node: Node, param: T, unknown?: xNode<T>[]);
    add(node: Node, param: T): xNode<T>;
    __add(v: xNode<T>): xNode<T>;
    Validate(): this;
    ReValidate(callback: (node: xNode<T>) => void): void;
    get(node: Node): xNode<T>;
    private _add;
    remove(node: Node): xNode<T>;
    hasChild(node: Node): xNode<T>;
    foreach(callback: (parent: xNode<T>, child: xNode<T>) => number, parent?: xNode<T>): number;
}
//# sourceMappingURL=Dom.d.ts.map