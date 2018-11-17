import { bind, basic } from "./Corelib";
import { UI } from "./UI";
import { Attributes, thread } from "./runtime";
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
        manager: Manager;
    }
    interface ComponentCreator {
        Def: Def;
        css: string[];
        context: IContext;
        TagName: string;
    }
    class Manager {
        private static _processors;
        private static enumerator;
        static maxPriority: number;
        static getPrcessorByName(name: string): Def;
        static getPrcessorByAttribute(name: string): Def;
        static stringIsNullOrWhiteSpace(s: string): boolean;
        static registerComponent(p: attributes.ComponentArgs): void;
        static register(p: Def): void;
        private static orderDefs;
        private static orderInstances;
        enumerator: Instance[];
        events: {
            [s: string]: string;
        };
        notifies: {
            [s: string]: string;
        };
        ComponentCreator: Instance;
        getProcessorByAttribute(processor: string): Instance;
        constructor(dom: Node);
    }
    class Tree {
        e: bind.IJobScop;
        parent: Tree;
        controller: Controller;
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
        readonly Depth: any;
        ContinueInto: Element;
    }
    class TreeWalker {
        static ParseBinding(data: Processor.Tree): Processor.Tree;
        private static setChild;
        private static processComponentChild;
        private static processComponentChildren;
        static strTemplate(text: Text, x: Tree): bind.StringScop;
        static ExploreTree(node: Processor.Tree): void;
    }
    function register(p: Def): void;
    class Compiler {
        private static initEvents;
        static Compile(x: Tree): Processor.Tree;
    }
    function Register(p: Processor.Def): void;
    function Compile(x: Tree): Tree;
}
export declare namespace attributes {
    enum ContentType {
        premitive = 0,
        multiple = 1,
        signle = 2,
        costum = 3
    }
    interface ContentEventArgs {
        child: Processor.Tree;
        parent: Processor.Tree;
    }
    interface ContentArgs {
        type: ContentType;
        handler: string | ((e: ContentEventArgs) => void);
        IsProperty?: boolean;
        selector?(e: ContentEventArgs): any;
        target?: typeof UI.JControl;
        getHandler?(cnt: UI.JControl): (e: ContentEventArgs) => void;
    }
    interface contentDecl extends Attributes.Attribute<ContentArgs> {
        (param: ContentArgs): any;
    }
    var Content: contentDecl;
}
export declare namespace attributes {
    interface ComponentEventArgs {
        node: Processor.Tree;
        instance: Processor.Instance;
        Services: any[];
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
    interface ComponentEventArgs {
        node: Processor.Tree;
        instance: Processor.Instance;
        Services: any[];
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
}
export declare module help {
    class EventData {
        events: events;
        interpolation: string;
        scop?: bind.Scop;
        constructor(events: events, interpolation: string);
        readonly dom: Node;
        readonly controller: Controller;
        readonly parentScop: bind.Scop;
    }
    class events implements basic.IJob, EventListenerObject {
        xx: Processor.Tree;
        private events;
        Name: string;
        Todo?(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
        Register(eventType: string, v: string): void;
        private getScop;
        handleEvent(e: Event): void;
        private exec;
        constructor(xx: Processor.Tree);
        scop: bind.Scop;
    }
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
    JCParent: UI.JControl[];
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
    static explorerJob: thread.JobParam;
    readonly CurrentControl: UI.JControl;
    instances: bind.JobInstance[];
    CompileChild(dom: Node, scop: bind.Scop, control: UI.JControl): Processor.Tree;
    private processEvent;
    constructor(cnt: UI.JControl);
    PDispose(): void;
    Dispose(): void;
    createJobInstance(name: string, x: Processor.Tree): bind.JobInstance;
}
