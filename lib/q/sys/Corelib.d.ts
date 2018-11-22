/// <reference path="../../qloader.d.ts" />
import { UI } from './UI';
import { Parser } from './Syntaxer';
import { reflection } from './runtime';
import { Controller } from "./Dom";
import { basic } from './utils';
import { encoding } from './Encoding';
export declare namespace bind {
    function property<PropertyType, ClassType>(type: Function | reflection.GenericType | reflection.DelayedType, defaultValue?: PropertyType, Name?: string, changed?: (e: bind.EventArgs<PropertyType, ClassType>) => void, check?: (e: bind.EventArgs<PropertyType, ClassType>) => void, attribute?: bind.PropertyAttribute, StaticName?: string, override?: boolean): (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => any;
    function property1<PropertyType, ClassType>(type: Function | reflection.GenericType | reflection.DelayedType, options?: {
        Name?: string;
        StaticName?: string;
        defaultValue?: PropertyType;
        changed?: (e: bind.EventArgs<PropertyType, ClassType>) => void;
        check?: (e: bind.EventArgs<PropertyType, ClassType>) => void;
        attribute?: bind.PropertyAttribute;
        override?: boolean;
    }): (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => any;
    function getProperties<classType>(type: any): bind.DProperty<any, classType>[];
    function Delete(type: any): boolean;
}
export declare namespace bind {
    class Job implements basic.IJob {
        Name: string;
        Todo: (job: JobInstance, e: bind.EventArgs<any, any>) => void;
        Check?: (job: JobInstance, e: bind.EventArgs<any, any>) => void;
        OnError?: (job: JobInstance, e: bind.EventArgs<any, any>) => void;
        OnInitialize?: (job: JobInstance, e: bind.EventArgs<any, any>) => void;
        OnScopDisposing?: (job: JobInstance, e: bind.EventArgs<any, any>) => void;
        constructor(Name: string, Todo: (job: JobInstance, e: bind.EventArgs<any, any>) => void, Check?: (job: JobInstance, e: bind.EventArgs<any, any>) => void, OnError?: (job: JobInstance, e: bind.EventArgs<any, any>) => void, OnInitialize?: (job: JobInstance, e: bind.EventArgs<any, any>) => void, OnScopDisposing?: (job: JobInstance, e: bind.EventArgs<any, any>) => void);
    }
    class Jobs implements basic.IJob {
        Name: string;
        Todo(job: JobInstance, e: bind.EventArgs<any, any>): void;
        Check(job: JobInstance, e: bind.EventArgs<any, any>): void;
        OnError(job: JobInstance, e: bind.EventArgs<any, any>): void;
        OnInitialize(job: JobInstance, e: bind.EventArgs<any, any>): void;
        OnScopDisposing(job: JobInstance, e: bind.EventArgs<any, any>): void;
        constructor(Name: string);
        push(jobName: any): void;
    }
    class JobInstance implements EventListenerObject {
        Scop: bind.Scop;
        job: basic.IJob;
        dom: Node;
        Control: UI.JControl;
        private _events;
        Handle: (ji: JobInstance, e: Event) => void;
        addEventListener(name: string, event: string, delegate: EventListenerOrEventListenerObject | any): void;
        removeEventListener(name: string): void;
        getEvent(name: string): EventListenerOrEventListenerObject;
        constructor(Scop: bind.Scop, job: basic.IJob, dom: Node);
        private propb;
        private ValueChanged;
        Dispose(): void;
        IsDisposed: any;
        _store: any;
        addValue(name: string, value: any): void;
        getValue(name: string): any;
        Checker: (value: any) => boolean;
        Ischanging: boolean;
        handleEvent(e: Event): void;
    }
    function GetJob(name: string): basic.IJob;
    function Register(job: basic.IJob, override?: boolean): basic.IJob;
}
export declare namespace bind {
    class DProperty<T, P> {
        Attribute: PropertyAttribute;
        Name: string;
        Type: reflection.GFunction;
        DefaultValue?: T;
        Changed?: (e: EventArgs<T, P>) => void;
        Check?: (e: EventArgs<T, P>) => void;
        setCostumChecker(c: (val: T) => boolean): this;
        Base: DProperty<T, P>;
        AsOverride(): this;
        AsVirtual(): void;
        Override: boolean;
        Virtual: boolean;
        Index: number;
        GType: reflection.GenericType;
        constructor(Attribute: PropertyAttribute, Name: string, Type: reflection.GFunction, DefaultValue?: T, Changed?: (e: EventArgs<T, P>) => void, Check?: (e: EventArgs<T, P>) => void);
        readonly IsKey: boolean;
        private RedifineChecker;
        checkType(val: T): boolean;
        _checkType<T>(val: T): boolean;
        private isGenerictype;
        private static isObject;
        private static isString;
        private static isNumber;
        private static isBoolean;
    }
    class EventArgs<T, P> implements basic.IDisposable {
        static New<T, P>(prop: DProperty<T, P>, ithis: P, _old: T, _new: T): EventArgs<T, P>;
        prop: DProperty<T, P>;
        __this: P;
        _old: T;
        _new: T;
        IsValid: boolean;
        Dispose(): void;
    }
    class Ref<T> {
        private _key;
        key: T;
    }
    class EventListener<T extends Function> implements basic.IDisposable {
        private _deleagtes;
        private key;
        private isSingliton;
        constructor(key: any, isSingliton?: boolean);
        On: T;
        private locks;
        Off: T;
        private lock;
        Invoke(key: Object, params: any[]): void;
        Invok(key: Object, callBack: (delegate: T) => any): any;
        PInvok(key: Object, params: any[], owner?: any): any;
        Add(delegate: T, key?: any): void;
        Remove(key: any): void;
        private _store;
        Dispose(): void;
    }
    class FEventListener<T extends basic.Invoker<(...args: any[]) => void>> implements basic.IDisposable {
        private _deleagtes;
        private key;
        private isSingliton;
        constructor(key: any, isSingliton?: boolean);
        On: T;
        Off: T;
        private currentIndex;
        PInvok(key: Object, params: any[], owner?: any): any;
        Add(delegate: T, key?: any): void;
        Remove(key: any): void;
        private _store;
        Dispose(): void;
    }
    class PropBinding implements basic.IDisposable, basic.IDelegate {
        Invoke: (sender: PropBinding, e: EventArgs<any, any>) => void;
        Owner?: any;
        IsWaiting: boolean;
        constructor(Invoke: (sender: PropBinding, e: EventArgs<any, any>) => void, Owner?: any);
        private _isIvnoked;
        handleEvent(e: EventArgs<any, any>): boolean;
        Dispose(): void;
    }
    class PropertyStore implements basic.IDisposable {
        Value?: any;
        _bindings: Array<PropBinding>;
        readonly InsBindings: PropBinding[];
        constructor(Value?: any);
        Dispose(): void;
    }
    enum PropertyAttribute {
        NonSerializable = 2,
        Private = 4,
        SerializeAsId = 8,
        IsKey = 16,
        Optional = 32
    }
    abstract class DObject implements basic.IDisposable {
        private static _dpStore;
        private static _isOpen;
        GetType(): any;
        static __fields__(): bind.DProperty<any, any>[];
        static __attributes__(): void;
        static readonly isOpen: boolean;
        static GetProperty(type: Function, name: string): DProperty<any, DObject>;
        static GetDPropertyAt(type: Function, index: number): DProperty<any, any>;
        GetProperty(name: string): DProperty<any, DObject>;
        ToJson(_context: encoding.SerializationContext, indexer?: encoding.IIndexer): Object;
        FromJson(json: any, context: encoding.SerializationContext, update?: boolean): this;
        static IsClass(x: any): boolean;
        static CreateField<PropertyType, ClassType>(name: string, type: Function | reflection.GenericType | reflection.DelayedType, defaultValue?: PropertyType, changed?: (e: EventArgs<PropertyType, ClassType>) => void, check?: (e: EventArgs<PropertyType, ClassType>) => void, attribute?: PropertyAttribute): DProperty<PropertyType, ClassType>;
        private static typeCount;
        private static getId;
        private static _buildProperty;
        IsPropertiesChanged(m: BuckupList<this>): boolean;
        static ToDObject(obj: any, props: string[]): any;
        private static register;
        private store;
        private __events__;
        getType(): any;
        constructor();
        static getFieldsCount(): number;
        static getFields(type?: Function): DProperty<any, DObject>[];
        protected _isFrozen: boolean;
        protected set<T>(prop: DProperty<T, this>, value: T, keepEvent?: boolean): void | EventArgs<T, this>;
        protected raise<T>(e: DProperty<T, this>): void;
        protected get<T>(prop: DProperty<T, this>): T;
        protected GetValues(): any[];
        GetValue<T>(prop: DProperty<T, this>): T;
        SetValue<T>(prop: DProperty<T, this>, p: T): void;
        private _propertyChanged;
        removeListener(v: (ev: EventArgs<any, this>) => void): boolean;
        addListener(v: (ev: EventArgs<any, this>) => void): boolean;
        protected onPropertyChanged(ev: EventArgs<any, any>): void;
        Observe<T>(prop: DProperty<T, this>, ev: (sender: PropBinding, ev: EventArgs<T, this>) => void, owner?: any): PropBinding;
        UnObserve<T>(prop: DProperty<T, this>, y: PropBinding | ((sender: PropBinding, ev: EventArgs<T, this>) => void), owner?: any): boolean;
        private _disposeProp;
        OnPropertyChanged<T>(prop: DProperty<T, this>, ev: (sender: PropBinding, ev: EventArgs<T, this>) => void, owner?: any): PropBinding;
        addEvent<T>(prop: DProperty<T, this>, b: PropBinding): void;
        removeEvent<T>(prop: DProperty<T, this>, y: PropBinding): boolean;
        readonly Disposed: boolean;
        protected DisposingStat: DisposingStat;
        protected OnDispose(): boolean;
        Dispose(): void;
        private _onDisposing;
        OnDisposing: (s: this) => void;
        OffDisposing: (s: this) => void;
        CloneTo(o: DObject): void;
        Freeze(): void;
        UnFreeze(): void;
        IsFrozen(): boolean;
        CreateBackup(OnUndo?: (self: this, bl: BuckupList<this>) => void): BuckupList<this>;
        Commit(r?: BuckupList<any>): boolean;
        Rollback(b?: BuckupList<this>, walkTrougth?: boolean): boolean;
        private UndoTo;
    }
    enum DisposingStat {
        None = 0,
        Disposing = 1,
        Disposed = 2
    }
    class XPath {
        Name: string;
        Property: bind.DProperty<any, DObject>;
        Value: any;
        Binding: bind.PropBinding;
        d: DObject;
        constructor(name: string);
        ListenTo(d: bind.DObject, callback: (sender: bind.PropBinding, e: bind.EventArgs<any, any>) => void, owner?: any): void;
        Dispose(): void;
    }
    class Observer extends bind.DObject {
        private controller?;
        static DPMe: DProperty<any, Observer>;
        Me: any;
        static DPPath: DProperty<string[], Observer>;
        Path: string[];
        static DPValue: DProperty<any, Observer>;
        Value: any;
        static __fields__(): DProperty<any, Observer>[];
        GenType(): typeof Observer;
        xpath: XPath[];
        constructor(me: any, path: string[], controller?: Controller);
        private rebuidPath;
        private disposePath;
        getValue(l: number): any;
        private Start;
        ESetValue(value: any): void;
        private callMe;
        Dispose(): void;
    }
    interface IJobScop {
        Scop: Scop;
        Jobs: JobInstance[];
        Control: UI.JControl;
        dom?: Node;
        skipProcessing?: boolean;
        ContinueInto?: Element;
    }
}
export declare namespace bind {
    function cloneScopBuilderEventArgs(e: bind.ScopBuilderEventArg, presult: Parser.ParserResult, parentScop: bind.Scop): bind.ScopBuilderEventArg;
    function cloneScop_Mode(e: bind.ScopBuilderEventArg, mode: BindingMode): bind.ScopBuilderEventArg;
    function mixIn(src: ScopBuilderEventArg, target: ScopBuilderEventArg): ScopBuilderEventArg;
    interface ScopBuilderEventArg {
        parseResult: Parser.ParserResult;
        parent: bind.Scop;
        bindingMode: bind.BindingMode;
        controller?: Controller;
        dom: Node;
    }
    type ScopBuilderHandler = (e: ScopBuilderEventArg) => Scop;
    interface IJobCollection {
        [s: string]: basic.IJob;
    }
    abstract class Scop extends bind.DObject {
        abstract Is(toke: Parser.CToken | string): any;
        Invoke(): void;
        private _scops;
        protected _parent: Scop;
        Value: any;
        getScop(path: string, createIfNotEist?: boolean): Scop;
        findScop(path: string[]): void;
        getParent(): Scop;
        setParent(v: Scop): boolean;
        protected canBeParent(v: Scop): boolean;
        SetExParent(scop: Scop, parent: Scop): boolean;
        private findAttribute;
        private static getAttribute;
        setAttribute(name: string, value: any): void;
        getAttribute(name: string, createIfNotEist?: boolean): Scop;
        static __fields__(): DProperty<any, Scop>[];
        static DPValue: DProperty<any, Scop>;
        BindingMode: BindingMode;
        protected _setValue(v: any, keepEvent?: boolean): void | EventArgs<any, this>;
        protected _bindingMode: BindingMode;
        constructor(_bindingMode: BindingMode);
        protected valueChanged(sender: bind.PropBinding, e: bind.EventArgs<any, this>): void;
        protected abstract _OnValueChanged(e: bind.EventArgs<any, any>): any;
        static Create(s: string, e: bind.ScopBuilderEventArg): Scop;
        private static _scopsRegister;
        static RegisterScop(token: string | Parser.CToken, handler: ScopBuilderHandler): void;
        static GetScopHandler(token: string | Parser.CToken): ScopBuilderHandler;
        static BuildScop(e: bind.ScopBuilderEventArg): Scop;
        setController(controller: Controller): this;
        static GenerateScop(s: string, e: bind.ScopBuilderEventArg): Scop;
        AddJob(job: basic.IJob, dom: Node): JobInstance;
        private __jobs__;
        Dispose(): void;
        RegisterJob(job: basic.IJob): void;
        GetJob(name: string): basic.IJob;
        protected __mjobs__: IJobCollection;
        __Controller__: Controller;
        getThis(): UI.JControl;
        readonly __hasSegments__: boolean;
        forEach<T>(callback: (s: any, param: T) => boolean, param?: T): void;
        readonly ParentValue: any;
        WhenIschanged<T>(callback: (s: bind.PropBinding, e: bind.EventArgs<T, any>) => void, owner?: any): () => void;
        OffIsIchangeing(callback: ($new: any, $old?: any) => void): void;
        private _valueChanegedCallbacks;
    }
    class IScopConst {
        Dispose(): any;
        scop: bind.Scop;
        isConstant: boolean;
        pb?: bind.PropBinding;
        value?: any;
        Value: any;
        constructor(e: bind.ScopBuilderEventArg);
        CaptureEvent(callback: (s: bind.PropBinding, ev: bind.EventArgs<any, bind.Scop>) => void, owner: any): this;
    }
    function GetStringScop(s: string, e: ScopBuilderEventArg): Scop | string;
    class StringScop extends bind.Scop {
        template: (string | Parser.ICode)[];
        Is(toke: string | Parser.CToken): boolean;
        private _dom;
        AttacheTo(Dom: Node): any;
        private pb;
        constructor(template: (string | Parser.ICode)[], e: bind.ScopBuilderEventArg);
        static GetStringScop(s: string, e: bind.ScopBuilderEventArg): string | StringScop;
        protected _OnValueChanged(e: bind.EventArgs<any, any>): void;
        setParent(v: Scop): boolean;
        Reset(sender?: bind.PropBinding, e?: bind.EventArgs<any, any>): void;
        FromJson(json: any, context: encoding.SerializationContext, update: any): this;
        ToJson(context: encoding.SerializationContext, iintexder?: encoding.IIndexer): Object;
        Dispose(): void;
    }
    class NamedScop extends Scop {
        Is(toke: string | Parser.CToken): boolean;
        private _name;
        readonly Name: string;
        constructor(name: string, bindingMode: BindingMode);
        static Get(name: string): bind.NamedScop;
        protected _OnValueChanged(e: bind.EventArgs<any, any>): void;
        static Create(name: string, value?: any, twoWay?: BindingMode): NamedScop;
        Dispose(): void;
    }
    namespace AnonymouseScop {
        function Register(scop: Scop): number;
        function UnRegister(i: number): Scop;
        function Get(i: number): Scop;
    }
    class ValueScop extends Scop {
        Is(toke: string | Parser.CToken): boolean;
        constructor(value: any, bindMode?: BindingMode);
        _OnValueChanged(e: EventArgs<any, any>): void;
    }
    class db {
        todo: string;
        init: {
            [n: string]: any;
        };
        bind: string;
        name: string;
        job: string;
        twoway: BindingMode;
        filter: string;
        cmd: string;
        exec: string;
        template: string;
        dec: string;
        control: string;
        stop: string;
        foreach: string;
        way: string;
        events: {
            [eventName: string]: string;
        };
        constructor(dom: Element);
    }
    interface DomCompilerArgs {
        parentScop: Scop;
        parentControl: UI.JControl;
        controller: Controller;
        e: bind.IJobScop;
        attributes?: db;
    }
    class Todo implements basic.IJob {
        private scopFunction;
        readonly Name: string;
        Todo?(job: JobInstance, e: EventArgs<any, any>): void;
        constructor(scopFunction: bind.Scop);
    }
    abstract class Filter<T, CT> extends Scop {
        protected source: Scop;
        Is(toke: string | Parser.CToken): boolean;
        private dbb;
        constructor(source: Scop, bindingMode?: BindingMode);
        Initialize(): void;
        protected isChanging: boolean;
        protected SourceChanged(p: PropBinding, e: EventArgs<any, Scop>): void;
        protected _OnValueChanged(e: bind.EventArgs<any, any>): void;
        Update(): void;
        UpdateBack(): void;
        protected abstract Convert(data: T): CT;
        protected abstract ConvertBack(data: CT): T;
        getParent(): Scop;
        setParent(v: Scop): boolean;
        Dispose(): void;
    }
    class DoubleFilter extends Filter<number, number> {
        Fraction: number;
        private fraction;
        protected Convert(data: number): number;
        protected ConvertBack(data: number): number;
    }
    interface IFilter {
        Name: string;
        BindingMode: BindingMode;
        CreateNew(source: Scop, bindingMode: BindingMode, param: string): Filter<any, any>;
    }
    function RegisterFilter(filter: IFilter): boolean;
    function CreateFilter(filterName: string, parent: Scop, bindingMode: BindingMode): Scop;
    enum BindingMode {
        SourceToTarget = 1,
        TwoWay = 3,
        TargetToSource = 2
    }
    class TwoBind<T> {
        private bindingMode;
        private a;
        private b;
        private pa;
        private pb;
        private dba;
        private dbb;
        private IsChanging;
        constructor(bindingMode: BindingMode, a: DObject, b: DObject, pa: DProperty<T, any>, pb: DProperty<T, any>);
        protected init(): void;
        protected initB(): void;
        protected pac(p: PropBinding, e: EventArgs<any, any>): void;
        protected pab(p: PropBinding, e: EventArgs<any, any>): void;
        private disposed;
        Dispose(): void;
    }
    class TwoDBind<T, P> {
        private bindingMode;
        private a;
        private b;
        private pa;
        private pb;
        private con;
        private conBack;
        private dba;
        private dbb;
        private IsChanging;
        constructor(bindingMode: BindingMode, a: DObject, b: DObject, pa: DProperty<T, any>, pb: DProperty<P, any>, con: (v: T) => P, conBack: (v: P) => T);
        protected pac(p: PropBinding, e: EventArgs<any, any>): void;
        protected pab(p: PropBinding, e: EventArgs<any, any>): void;
        protected init(): void;
        protected initB(): void;
        private disposed;
        Dispose(): void;
    }
}
export declare namespace ScopicControl {
    interface ControlCreatorEventArgs {
        name: string;
        dom: HTMLElement;
        currentScop: bind.Scop;
        parentScop: bind.Scop;
        parentControl: UI.JControl;
        controller: Controller;
        e: bind.IJobScop;
        Result?: UI.JControl;
    }
    type IControlCreater = (e: ControlCreatorEventArgs) => UI.JControl;
    function register(name: string, creator: IControlCreater): void;
    function create(e: ControlCreatorEventArgs): UI.JControl;
}
export declare namespace ScopicCommand {
    function Register<T>(callback: basic.ITBindable<(n: string, dom: HTMLElement, scop: bind.Scop, param: T) => void>, param?: T, name?: string): string;
    function Call(n: string, dom: Node, scop: bind.Scop): any;
    function Delete(n: string): void;
    function contains(n: string): boolean;
}
export declare namespace Api {
    interface IApiTrigger {
        Name: string;
        Filter: (cmdCallback: IApiCallback, params: any) => boolean;
        CheckAccess: (t: IApiTrigger) => boolean;
        Params?: any;
    }
    interface IApiCallback {
        hash?: string;
        Name: string;
        DoApiCallback: (trigger: IApiTrigger, callback: IApiCallback, params: IApiParam) => void;
        Owner?: any;
        Params?: any;
    }
    function RegisterApiCallback(api: IApiCallback): boolean;
    function RegisterTrigger(api: IApiTrigger): boolean;
    function RiseApi(apiName: string, params: IApiParam): void;
    interface IApiParam {
        data: any;
        callback?(p: IApiParam, args: any): any;
    }
    interface IApi {
        Trigger: IApiTrigger;
        Callback: IApiCallback[];
    }
    interface apiGarbage {
        [name: string]: IApi;
    }
}
export interface BuckupList<T> {
    values: any[];
    OnUndo?: (self: T, bl: BuckupList<T>) => void;
}
export declare namespace injecter {
    function observe(obj: any, prop: string, callback: (s: bind.PropBinding, e: bind.EventArgs<any, any>) => void, owner?: any): bind.PropBinding;
    function observePath(obj: any, props: string[], callback: (s: bind.PropBinding, e: bind.EventArgs<any, any>) => void, owner?: any): void;
    function unobserve(obj: any, prop: string, stat: bind.PropBinding | ((s: bind.PropBinding, e: bind.EventArgs<any, any>) => void), owner?: any): boolean | bind.PropBinding[];
}
export declare namespace Notification {
    interface NotificationArgs {
        name: string;
        data: any;
        handler: NotificationHandler<any>;
    }
    interface NotificationHandler<Owner> {
        Id?: any;
        callback: (this: Owner, e: NotificationArgs, ...args: any[]) => void;
        owner?: Owner;
        params?: any;
        context?: IContext;
    }
    function on(name: string, handler: NotificationHandler<any>): void;
    function fire(name: string, params: any[]): void;
    function off(name: string, hndl_id: NotificationHandler<any> | any): boolean;
}
export declare namespace bind {
    class Path implements encoding.IPath<any | bind.DObject, string | bind.DProperty<any, any>> {
        Owner: any | bind.DObject;
        Property: string | bind.DProperty<any, any>;
        executed: boolean;
        Set(value: any): any;
        constructor(Owner: any | bind.DObject, Property: string | bind.DProperty<any, any>);
    }
}
//# sourceMappingURL=Corelib.d.ts.map