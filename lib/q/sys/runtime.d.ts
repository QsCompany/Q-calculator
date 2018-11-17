import { bind } from "./Corelib";
import { Controller } from "./Dom";
export declare var x: any;
export declare namespace helper {
    function TryCatch<T>(owner: any, Try: (...args: any[]) => T, Catch?: (e: Error, ...args: any[]) => T, params?: any[]): T;
    function $defineProperty(o: any, p: string, attributes: PropertyDescriptor & ThisType<any>, onError?: (o: any, p: string, attributes: PropertyDescriptor & ThisType<any>) => any): any;
}
declare module basic {
    interface IBindable {
        Owner?: any;
        Invoke(...args: any[]): any;
    }
    interface ITBindable<T extends (...args: any[]) => void> extends IBindable {
        Invoke: T;
    }
    type Invoker<T extends (...args: any[]) => void> = ITBindable<T> | T;
}
export declare namespace reflection {
    type GFunction = Function | reflection.GenericType | reflection.DelayedType;
    interface ICallHistory {
        caller: any;
        arguments: any[];
        fn: Function;
    }
    type Method<RET, T extends (...args: any[]) => RET> = MethodGroup<RET, T> | T | basic.ITBindable<T>;
    class MethodGroup<RET, T extends (...args: any[]) => RET> implements basic.ITBindable<T> {
        Owner?: any;
        private _list;
        constructor(f?: Method<RET, T>, Owner?: any);
        Invoke: T;
        add(m: T | Method<RET, T>): this;
        With(owner: any, ...args: any[]): RET;
        Clone(): MethodGroup<RET, T>;
    }
    function ToMethodGroup<RET, T extends (...args: any[]) => RET>(x: Method<RET, T>): MethodGroup<{}, T>;
    function Invoke<RET, T extends (...args: any[]) => RET>(f: Method<RET, T>, owner: any, args: any[]): RET;
    interface IDebuggerInfo {
        obsArgs: boolean;
        Stack?: ICallHistory[];
        debug?: boolean;
        save?: boolean;
        callback?: Function;
        fn: Function;
        proxy?: Function;
        ReCalc?: (callHistory: ICallHistory | number, direct: boolean) => any;
    }
    function isInstanceOfClassName(instance: any, className: any): boolean;
    function isInstanceOfClass(instance: any, type: any): boolean;
    function _isInstanceOf(type: Function, superType: Function): boolean;
    function GetBaseType(type: any): any;
    function GetBaseTypes(type: any, totype?: any): typeof Object[];
    function IsInstanceOf(type: any, superType: any): boolean;
    class Type {
        private passed;
        type: Function;
        constructor(type: any);
        _getPath(root: any): any;
        GetType(root: any): any;
    }
    class GenericType {
        Constructor: Function;
        Params: Function[];
        prototype: any;
        constructor(Constructor: Function, Params: Function[], base: Function);
        readonly base: Function;
        GetBaseType(): Function;
        static GetType(type: Function, params?: Function[], checkOnly?: boolean, base?: Function): GenericType | Function;
        private static i;
        static IsInstanceOf(type: any, superType: any): any;
        static _isInstanceOf: (((type: Function, superType: Function) => boolean) | ((type: Function, superGType: GenericType) => boolean) | ((gtype: GenericType, superGType: GenericType) => boolean) | ((gtype: GenericType, superType: Function) => boolean))[];
    }
    class DelayedType {
        readonly Type: Function;
        private _type;
        constructor(type: () => Function);
    }
    namespace Observable {
        function observeProperty(obj: any, propName: string, evnt: string): void;
        function setObservableProperty<T>(obj: any, propName: string, get: () => T, set: (val: T) => void, evnt: string): void;
        function ObjectToObservable(o: Object): void;
    }
    function IsClass(obj: ObjectConstructor): boolean;
    function IsPrototype(obj: any): boolean;
    function IsInstance(obj: any): boolean;
}
export declare namespace Attributes {
    interface Attribute<T> extends Function {
        (arg: T): any;
        declare?(_target: any, data: T): void;
        getData?(_target: any): T;
    }
    enum AttributeTargets {
        Class = 2,
        Object = 4,
        Function = 8,
        Property = 16,
        All = -1
    }
    interface AttributeDefinition {
        AllowMultiple?: boolean;
        Heritable?: boolean;
        Target?: AttributeTargets;
    }
    function asAttribute(attributer: Function, e: AttributeDefinition): void;
    function getAttributeDef(attr: Function): AttributeDefinition;
    function check(attr: Function, args: IArguments): boolean;
    function getAttributesOf(_target: any): Map<any, Attribute<any>>;
    function getAttributeOf<T>(_target: any, _attribute: Attribute<T>): T;
}
export declare namespace thread {
    interface IDispatcherCallback {
        callback: (delegate: (...param: any[]) => void, param: any, _this: any) => void;
        params: JobParam;
        _this: any;
        optimizable: boolean;
        isWaiting: boolean;
        id: number;
        children: IDispatcherCallback[];
        ce: number;
    }
    class JobParam {
        id: number;
        params: any[];
        constructor(id: number, params?: any[]);
        Set(...params: any[]): this;
        Set1(params: any[]): this;
        Clone(): JobParam;
    }
    class Dispatcher {
        static OnIdle(owner: any, callback: () => void, once?: boolean): void;
        static InIdle(): boolean;
        static GC(): void;
        static clone(ojob: IDispatcherCallback, params: any[], __this?: any): IDispatcherCallback;
        static cretaeJob(delegate: (...param: any[]) => void, param: any[], _this: any, optimizable: boolean): JobParam;
        static Clear(o: JobParam): void;
        static readonly CurrentJob: IDispatcherCallback;
        private static start;
        static Push(ojob: JobParam, params?: any[], _this?: any): IDispatcherCallback;
        static call(_this: any, fn: Function, ...args: any[]): void;
        static IsRunning(): boolean;
    }
}
export declare namespace PaintThread {
    interface task2 {
        owner: any;
        method: Function;
        args: any[];
    }
    function Push(ins: bind.JobInstance, e: bind.EventArgs<any, any>, scop?: bind.Scop): void;
    function OnPaint(task: task2): void;
}
export declare namespace Dom {
    function OnNodeInserted(controller: Controller, dom: Node): void;
    function RemoveListener(dom: Node): void;
    function pushToIdl(f: any): void;
    namespace UIDispatcher {
        function OnIdle(f: () => void): void;
    }
}
export declare namespace mvc {
    var _Instance: mvc.Initializer;
    abstract class ITemplate {
        abstract Create(): HTMLElement;
        Name: string;
        constructor(Name: string);
    }
    class iTemplate extends ITemplate {
        private _Url;
        readonly Url: string;
        private _Shadow;
        Shadow: HTMLTemplateElement;
        Create(): HTMLElement;
        constructor(relativeUrl: string, name: string, shadow?: HTMLTemplateElement);
        Load(): void;
    }
    enum Devices {
        Desktop = 0,
        Mobile = 1,
        Tablete = 2
    }
    class NULL {
    }
    interface ITemplateGroup {
        Url: string;
        OnError(init: Initializer): any;
        OnSuccess(init: Initializer): any;
    }
    interface FolderEntries {
        [name: string]: MvcDescriptor;
    }
    interface TemplateEntries {
        [name: string]: ITemplate;
    }
    class MvcDescriptor {
        Name: string;
        private _dataType;
        DataType: Function | string;
        Subs: FolderEntries;
        Items: TemplateEntries;
        Parent: MvcDescriptor;
        Default: ITemplate;
        constructor(Name: string, dataType?: Function | string);
        readonly Root: MvcDescriptor;
        Get(path: string | string[]): ITemplate;
        GetFoder(path: string | string[], max?: number): MvcDescriptor;
        CreateFolder(path: string | string[], type?: Function): MvcDescriptor;
        Add(templ: ITemplate): this;
        AddFolder(name: string, dataType?: Function | string): MvcDescriptor;
        private registerTemplates;
        private registerTemplate;
        static Root: MvcDescriptor;
        static Get(path: string | string[]): ITemplate;
        static GetByType(datatype: Function): MvcDescriptor;
        static GetByName(folderName: string): MvcDescriptor;
        static Add(template: HTMLTemplateElement, path: string, name?: string): MvcDescriptor;
        static New(name: string, dataType: Function): MvcDescriptor;
        Register(path: string, tmp: HTMLTemplateElement, url: string, name?: string): MvcDescriptor;
        Process(des: HTMLElement, url: string, getType: (t: string) => Function): MvcDescriptor;
    }
    class Initializer {
        private require;
        static readonly Instances: Initializer;
        constructor(require: (modules: string, onsuccss?: (result: any) => void, onerror?: (result: any) => void, context?: any) => void);
        Init(): void;
        Dispose(): void;
        readonly System: Array<MvcDescriptor>;
        private readonly _system;
        Add(templGroup: ITemplateGroup, require?: (modules: string, onsuccss?: (result: any) => void, onerror?: (result: any) => void, context?: any) => any): void;
        private static typeResolvers;
        static SetTypeResolver(name: any, typeResolver: (typeName: string) => Function): void;
        private _pending;
        private pending;
        private static gonsuccess;
        private static gonerror;
        static html2Template(html: string): HTMLTemplateElement;
        static htmlToElements(html: any): HTMLDivElement;
        then(call: (Initializer: Initializer) => void): void;
        static then(call: (Initializer: Initializer) => void): void;
        private static callbacks;
        protected onfinish(): void;
        private static onfinish;
        static Get(type: Function): MvcDescriptor;
        getDescriptor(name: string, type: Function): MvcDescriptor;
        private templatesDescrpt;
        ExcecuteTemplate(url: string, templ: HTMLElement, typeResolver?: (typeName: string) => Function, e?: ITemplateExport): void;
        static Register(e: PluginsEvent): void;
        static MakeAsParsed(r: ITemplateExport): void;
        private static parsed;
    }
    class Template {
        private static _store;
        static TempplatesPath: string;
        private _type;
        private _view;
        private _name;
        private _for;
        readonly forType: any;
        readonly View: HTMLElement;
        readonly Name: string;
        readonly For: string;
        constructor(templateDOM: HTMLElement);
        static getTemplates(type: any): Template[];
        private static fromInside;
        private static createTemplate;
        static GetAll(name: string): any[];
        static Get(name: string, vtype: string): any;
        static Foreach(callback: (tmplate: Template) => boolean): void;
    }
}
export { };
