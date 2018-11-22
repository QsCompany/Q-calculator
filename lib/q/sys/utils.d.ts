import { bind } from "./Corelib";
import { collection } from './collections';
export declare namespace html {
    function fromText(t: string): Element;
    function indexOf(node: Node): number;
    function replace(child: Node, by: Node): Node;
    function wrap(child: Element, into: Element): Element;
}
export declare namespace css {
    var cssRules: any[];
    class CSSRule {
        constructor(cssrule: any, parent: any);
        Dispose(): void;
        readonly Selectors: any;
        IsMatch(selector: any): void;
    }
    function collectCss(): void;
    function getVar(name: string): void;
    function toValidCssName(c: any): any;
    function toValidEnumName(c: any): any;
    function Css2Less<T>(css: string, callback: (less: string, param: T) => void, param: T): void;
    namespace animation {
        interface animateProperties<T> {
            dom: HTMLElement;
            props: propValues<T>[];
            oncomplete?(e: this): any;
            onstart?(e: this): any;
            timespan: number;
            start?: number;
            cursor?: number;
            thread?: number;
            interval?: number;
            stat?: T;
        }
        interface animations {
            animations: animateProperties<any>[];
            thread?: number;
            timespan: number;
            interval?: number;
        }
        interface propValues<T> {
            func?: (cur: number) => number;
            name: string;
            animate(e: animateProperties<T>): void;
            oncomplete?(e: animateProperties<T>): void;
            val?: any;
        }
        function animate<T>(anim: animateProperties<T>): animateProperties<T>;
        function animates<T>(anim: animations): animations;
        function stopAnimation<T>(e: animateProperties<T>): animateProperties<T>;
        function stopAnimations(e: animations): animations;
        interface cssDebugger {
            elements: {
                dom: HTMLElement;
                result: any[];
            }[];
            attrs: string[];
            interval: number;
            thread: number;
            timespan: number;
        }
        function trigger(prop: string, from: number, to: number, finalvalue?: string, suffx?: string): propValues<any>;
        namespace constats {
            var hideOpacity: propValues<any>;
            var showOpacity: propValues<any>;
        }
    }
}
export declare namespace math {
    function round1(_n: any, x: any): string;
    function round(_n: any, x: any): string;
}
export declare namespace basic {
    namespace Settings {
        function get(name: any): any;
        function set(name: any, value: any): void;
    }
    enum DataStat {
        Fail = 0,
        Success = 1,
        OperationCanceled = 2,
        UnknownStat = 3,
        DataCheckError = 4,
        DataWasChanged = 16,
        None = 5
    }
    namespace polyfill {
        var supportTemplate: boolean;
        function IsTemplate(x: any): boolean;
    }
    var host: any;
    interface ICrypto {
        Encrypt(data: Uint8Array | number[]): (Uint8Array | number[]);
        Decrypt(data: Uint8Array | number[]): (Uint8Array | number[]);
        SEncrypt(data: string): string;
        SDecrypt(data: string): string;
    }
    const Crypto: ICrypto;
    function isFocused(v: Element): boolean;
    class focuser {
        bound: HTMLElement;
        private andButton;
        focuse(rebound: boolean, toPrev: boolean): any;
        constructor(bound: HTMLElement, andButton: boolean);
        _focuseOn(v: Element): Element;
        getNext(p: Element): any;
        _focuseNext(v: Element, array: Element[]): any;
        getPrev(p: Element): any;
        _focusePrev(v: Element, array: Element[]): any;
        focusePrev(rebound: boolean): any;
        focuseNext(rebound: boolean): any;
        reFocuseOn(): any;
        focusOn(): any;
    }
    function focuseOn(v: HTMLElement): boolean;
    function _focuseOn(v: HTMLElement): boolean;
    function focuseNext(v: Element): any;
    interface IRef<T> {
        value: T;
        aux?: any;
    }
    interface IEventHandler extends IDisposable {
        Started: boolean;
        Start(): any;
        Pause(): any;
        Dispose(): any;
        Reset(): any;
    }
    interface Module {
    }
    interface IContext {
        CanAccessToMe(type: string, folder: string, name: string): any;
        GetPath(path: string): string;
        NameOf(type: Function): string;
        GetType(path: string): Function;
    }
    interface IDisposable {
        Dispose(force?: boolean): any;
    }
    interface IBindable {
        Owner?: any;
        Invoke(...args: any[]): any;
    }
    interface ITBindable<T extends (...args: any[]) => void> extends IBindable {
        Invoke: T;
    }
    type Invoker<T extends (...args: any[]) => void> = ITBindable<T> | T;
    interface IOnDisposing extends IDisposable {
        OnDisposing: (s: this) => void;
        Dispose(): any;
    }
    interface IDelegate extends IDisposable, EventListenerObject, IBindable {
        handleEvent(...args: any[]): void;
    }
    class Delegate<T> implements IDelegate {
        Owner: T;
        Invoke: (...args: any[]) => void;
        private _dispose;
        objectStat?: any;
        constructor(Owner: T, Invoke: (...args: any[]) => void, _dispose: (ihe: Delegate<T>) => void, objectStat?: any);
        handleEvent(...args: any[]): void;
        Dispose(): void;
    }
    interface IValueCheck {
        [s: string]: (v: any) => boolean;
    }
    interface IJob {
        Name: string;
        Todo?(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
        Check?(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
        OnError?(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
        OnInitialize?(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
        OnScopDisposing?(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
    }
    class Rectangle {
        private _x;
        Left: number;
        private _y;
        Top: number;
        private _w;
        Width: number;
        private _h;
        Height: number;
        private OnChanged;
        private _onchanged;
        constructor();
        Set(left: number, top: number, width: number, height: number): void;
    }
    interface EqualInterface {
        Equals(o: Object): boolean;
    }
    interface scopCollection {
        [s: string]: bind.Scop;
    }
    class SessionId {
        static Id: number[];
        readonly Data: number[];
        constructor(guid: string);
        static parse(guid: string): void;
    }
    class iGuid implements EqualInterface {
        static Empty: iGuid;
        private _id;
        readonly Id: string;
        constructor(g: string);
        Equals(o: any): boolean;
        toString(): string;
        private static FromNumber;
        static readonly New: iGuid;
    }
    interface IId {
        Id: number;
    }
    class EnumValue {
        Name: string;
        Value: number;
        constructor(Name: string, Value: number);
        toString(): string;
        static GetValue(lst: collection.List<EnumValue>, n: number | string): EnumValue;
    }
    function getEnum(enumPath: string, enumValue?: Object): collection.List<EnumValue>;
    interface SIndex {
        Name: string;
        Index: number;
    }
    function CompileString(s: string, getString?: (value: any, param: any) => string, params?: any): StringCompile;
    class StringCompile {
        protected indexer: (string | SIndex)[];
        private getString;
        params: any;
        constructor(indexer: (string | SIndex)[], getString: (name: string, value: any) => string, params: any);
        private static generateIndexer;
        static Compile(s: string, getString?: (name: string, value: any) => string, params?: any): StringCompile;
        apply(data: any): string;
        bind(data: bind.DObject): void;
        private data;
        private onDataChanged;
        Value: string;
    }
    interface Stat {
        Data: any;
        Back(): any;
        Go(): any;
        Forward(): any;
    }
    class History {
        private index;
        private stats;
        Push(stat: Stat): void;
        goBack(): void;
        goForward(): void;
        readonly Current: Stat;
        private Index;
    }
    namespace Routing {
        namespace history {
            var supported: boolean;
            var fallback: null;
            var initial: {
                popped: boolean;
                URL: string;
            };
            function pushState(state: any, title: any, path: any): void;
            function popState(event: any): void;
            function listen(fallback: any): void;
        }
        namespace Path {
            function map(path: any): any;
            function root(path: any): void;
            function rescue(fn: any): void;
            function match(path: string, parameterize?: any): any;
            function dispatch(passed_route: string): boolean;
            function listen(): void;
            namespace core {
                class route {
                    path: string;
                    action: any;
                    do_enter: any[];
                    do_exit: any;
                    params: {};
                    constructor(path: string);
                    to(fn: any): this;
                    enter(fns: any): this;
                    exit(fn: any): this;
                    partition(): any[];
                    run(): void;
                }
            }
            var routes: {
                'current': any;
                'root': any;
                'rescue': any;
                'previous': any;
                'defined': {};
            };
        }
    }
    interface IUrl {
        moduleType: ModuleType;
        IsExternal: boolean;
        host: string;
        path: string[];
        moduleName: string;
        ext: string;
        isAsset: boolean;
        params: string;
        getEName(defaultExt?: string): string;
        IsInternal: boolean;
        FullPath: string;
    }
    class Url implements IUrl {
        private _path;
        moduleType: ModuleType;
        host: string;
        moduleName: string;
        ext: string;
        getEName(defaultExt?: string): string;
        params: string;
        IsFolder: boolean;
        constructor(url?: string);
        toString(): string;
        private init;
        static getHost(url: string): [string, string[]];
        static getFullHost(url: string): [string, string[]];
        Combine(path: string | Url): Url;
        readonly IsExternal: boolean;
        readonly isAsset: boolean;
        path: string[];
        readonly FullPath: string;
        SameHostAs(url: Url): boolean;
        static RevalidatePath(ary: string[], isFullPath?: boolean): void;
        intersect(url: Url): Url;
        readonly IsInternal: boolean;
        static rootUrl: Url;
    }
}
export declare namespace query {
    type selector = (t: _$, node: Node, param: any) => boolean;
    interface _$ {
        detach(): this;
        insertBefore(thisDom: Node): this;
        insertAfter(thisDom: Node): this;
        children(selector: selector, param: any): __;
        removeChildren(selector: selector, param: any): this;
        find(selector: selector, param: any): __;
        add(dom: Node | Node[]): any;
        toggleClass(calssName: string): any;
        siblings(selector: selector, param: any): __;
        appendTo(dom: Node): any;
        length: number;
        submit(): any;
        parent(selector: selector, param: any): _$;
        hasClass(className: string): boolean;
        removeClass(className: string): this;
        addClass(className: string): this;
        eq(n: number): _$;
        toArray(): Node[];
    }
    function hasClass(t: _$, d: Node, param: string): boolean;
    function hasTag(t: _$, d: Node, param: string): boolean;
    class __ implements _$ {
        private dom;
        eq(n: number): _$;
        removeClass(className: string): this;
        addClass(className: string): this;
        hasClass(className: string): boolean;
        parent(selector: selector, param: any): _$;
        submit(): void;
        siblings(selector: selector, param: any): __;
        appendTo(dom: Node): void;
        constructor(dom: Node[]);
        readonly length: number;
        detach(): this;
        insertBefore(thisDom: Node): this;
        insertAfter(referenceNode: Node): this;
        find(selector: selector, param: any): __;
        children(selector: selector, param: any): __;
        removeChildren(selector: selector, param: any): this;
        add(dom: Node | Node[]): this;
        toggleClass(className: string): this;
        toArray(): Node[];
    }
    class _ implements _$ {
        private dom;
        eq(n: number): _$;
        hasClass(className: string): boolean;
        parent(selector: selector, param: any): _$;
        constructor(dom: Node);
        readonly length: number;
        submit(): void;
        siblings(selector: selector, param: any): __;
        detach(): this;
        add(dom: Node | Node[]): __;
        toggleClass(className: string): void;
        insertBefore(thisDom: Node): this;
        insertAfter(thisDom: Node): this;
        children(selector: selector, param: any): __;
        removeChildren(selector: selector, param: any): this;
        appendTo(dom: Node): void;
        find(selector: selector, param: any): __;
        removeClass(className: string): this;
        addClass(className: string): this;
        toArray(): Node[];
    }
    function $$(dom: Node | Node[]): __ | _;
}
export declare function $$(dom: Node | Node[]): query.__ | query._;
export declare namespace basic {
    class DomEventHandler<T extends Event, P> implements IEventHandler, EventListenerObject {
        dom: Element;
        event: string;
        private owner;
        private handle;
        private param?;
        Started: boolean;
        constructor(dom: Element, event: string, owner: any, handle: (eh: DomEventHandler<T, P>, ev: T, param: P) => void, param?: P);
        Start(): void;
        Pause(): void;
        Dispose(): void;
        Reset(): void;
        handleEvent(evt: Event): void;
        static Dispose(dom: EventTarget, event?: string): void;
    }
}
//# sourceMappingURL=utils.d.ts.map