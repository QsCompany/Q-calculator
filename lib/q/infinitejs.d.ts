/// <reference path="F:/Q Framework/TypeScript/Infinite/qloader.d.ts" />
/// <reference path="F:/Q Framework/TypeScript/Infinite/es2015.collection.d.ts" />
/// <reference path="F:/Q Framework/TypeScript/Infinite/es2015.iterable.d.ts" />
declare module "sys/Syntaxer" {
    import { bind } from "sys/Corelib";
    export namespace Parser {
        interface ifn {
            (a: bind.IScopConst, b: bind.IScopConst): any;
            (a: bind.IScopConst): any;
            (a: any, b: any): any;
            (a: any): any;
            isComplex?: boolean;
        }
        interface IoperMap {
            [char: string]: IoperMap | ifn;
        }
        const _unaire__: IoperMap;
        const _oper_: IoperMap;
        function getOperation(b: syntaxer, _oper_: IoperMap): {
            oper: string;
            fn: (a: any, b: any) => any;
        };
    }
    export namespace Parser {
        function bi_compute(b: syntaxer, r: ParserResult): boolean;
        function uni_compute(b: syntaxer, r: ParserResult): boolean;
        enum TokenType {
            uknown = 0,
            alpha = 1,
            num = 2,
            prnt = 4,
            brkt = 8,
            dot = 16,
            prefix = 32,
            filter = 64,
            whites = 128,
            alphanum = 3
        }
        interface stat {
            index: number;
        }
        interface Token {
            index: number;
            char: string;
            code: number;
            type: TokenType;
        }
        type parser = (strm: syntaxer, result: ParserResult) => boolean;
        enum CToken {
            whitespace = 0,
            undefined = 1,
            boolean = 2,
            number = 3,
            string = 4,
            word = 5,
            keyword = 6,
            path = 7,
            functionCall = 8,
            arrayCall = 9,
            condition = 10,
            biCompute = 11,
            uniCompute = 12,
            StringTemplate = 13
        }
        interface ParserResult {
            start?: Token;
            end?: Token;
            success: boolean;
            resut?: any;
            msg?: string;
            tokon?: CToken | string;
            parent: ParserResult;
            children: ParserResult[];
        }
        function ands(parsers: parser[]): (b: syntaxer, _rslt: ParserResult) => boolean;
        function ors(parsers: parser[]): (b: syntaxer, _result: ParserResult) => boolean;
        function _ors(parsers: parser[]): (b: syntaxer, result: ParserResult) => boolean;
        enum oper {
            or = 0,
            and = 1,
            xor = 2,
            eq = 3,
            neq = 4,
            dot = 5
        }
        interface Term {
            oper: oper;
            parser: parser;
            neq: boolean;
        }
        class parserBuilder {
            token: CToken | string;
            private _parser;
            private terms;
            parent: parserBuilder;
            constructor(token: CToken | string);
            and(p: parser, neq?: boolean): this;
            set(p: parser, neq?: boolean): this;
            $open(token: CToken | string, oper: oper, neq?: boolean): parserBuilder;
            $close(): parserBuilder;
            or(p: parser, neq?: boolean): this;
            xor(p: parser, neq?: boolean): this;
            eq(p: parser, neq?: boolean): this;
            neq(p: parser, neq?: boolean): this;
            readonly Parser: parser;
            private exect;
        }
        class syntaxer {
            src: string;
            readonly CurrentString: string;
            getCurrentString(left: number, right: number): string;
            readonly ShiftIndex: number;
            static opers: number[];
            static whites: number[];
            private stack;
            Tokens: Token[];
            private index;
            validate(s?: stat): true;
            save(): stat;
            restore(s?: stat): false;
            readonly current: Token;
            getToken(offset: number): Token;
            readonly previous: Token;
            next(): Token;
            back(): Token;
            shift(): true;
            unshift(): true;
            JumpBy(length: number): void;
            JumpTo(index: number): void;
            private static getToken;
            constructor(src: string);
            currentNode: ParserResult;
            _cache_: {
                [index: number]: Map<parser, ParserResult>;
            };
            private getFromCache;
            private setIntoCache;
            exec(p: parser, nonstrorable?: boolean): ParserResult;
            fastExec(p: (...args: any[]) => boolean, ths?: any, args?: any[]): boolean;
            getChar(): string;
            testChar(chr: string): boolean;
            getNextChar(inc: any): string;
            get(shift: number): string;
            static IsDigit(character: any): boolean;
            ScanString(o: string): string | false;
            isChar(t: Token): boolean;
        }
        namespace parsers {
            namespace expr {
                function Term(s: syntaxer, rslt: ParserResult): boolean;
                function parent(s: syntaxer, _rslt: ParserResult): boolean;
                function Expre(): void;
                function chain(_s: parser): void;
            }
            function _keyword(strm: syntaxer, word: string, rslt?: ParserResult, token?: string | CToken): boolean;
            function whitespace(strm: syntaxer, rslt?: ParserResult): true;
            function keyword(word: string): parser;
            function undefined(strm: syntaxer, rslt: ParserResult): boolean;
            function boolean(strm: syntaxer, rslt: ParserResult): boolean;
            function string(strm: syntaxer, rslt: ParserResult): boolean;
            function number(b: syntaxer, rslt: ParserResult): boolean;
            function constant(strm: syntaxer, rslt: ParserResult): boolean;
            function digit(b: syntaxer, rslt: ParserResult): boolean;
            function word(strm: syntaxer, rslt: ParserResult): boolean;
            function pint(b: syntaxer, rslt: ParserResult): boolean;
            function anonymouseScop(s: syntaxer, rslt: ParserResult): boolean;
            function attributeScop(s: syntaxer, rslt: ParserResult): boolean;
            function namedScop(s: syntaxer, rslt: ParserResult): boolean;
            function subScop(s: syntaxer, rslt: ParserResult): boolean;
            function typedScop(s: syntaxer, rslt: ParserResult): boolean;
            function bindscope(b: syntaxer, rslt: ParserResult): boolean;
            function stringChainedScop(b: syntaxer, rslt: ParserResult): boolean;
            function path(b: syntaxer, rslt: ParserResult): boolean;
            function cpath(b: syntaxer, rslt: ParserResult): boolean;
            const _parent1: (b: syntaxer, result: ParserResult) => boolean;
            function parent(b: syntaxer, rslt: ParserResult): boolean;
            function condition(b: syntaxer, rslt: ParserResult): boolean;
            function expression(b: syntaxer, rslt: ParserResult): boolean;
            function fxpression(b: syntaxer, rslt: ParserResult): boolean;
            interface BiComputeResult {
                a: ParserResult;
                o: {
                    fn: ifn;
                    oper: string;
                };
                b: ParserResult;
            }
            interface UniComputeResult {
                o: {
                    fn: ifn;
                    oper: string;
                };
                a: ParserResult;
            }
            interface FunctionResult {
                caller: ParserResult;
                args: ParserResult[];
            }
            interface ConditionResult {
                condition: ParserResult;
                success: ParserResult;
                fail: ParserResult;
            }
            interface ArrayResult {
                caller: ParserResult;
                index: ParserResult;
            }
            function functionCall(b: syntaxer, rslt: ParserResult): boolean;
            function arrayCall(b: syntaxer, rslt: ParserResult): boolean;
            enum coPathType {
                bindscope = 0,
                typedscope = 1,
                subscop = 2,
                parentscop = 3,
                namedscop = 4,
                anonymousscop = 5,
                thisscope = 6,
                keyword = 7
            }
        }
        interface IComposePath {
            t: parsers.coPathType;
            v: string | string[] | ISubsScop | ITypedScop | INamedScop | IParentScop | IKeywordScop | IBindScope;
        }
        interface ITypedScop {
            type: undefined | ':' | '=';
            path: string;
        }
        type INamedScop = string;
        type IParentScop = number;
        type ISubsScop = string[];
        type IBindScope = string[];
        type IKeywordScop = string;
        function parseComposePath(str: string): ParserResult;
        function parseExpression(str: string): ParserResult;
        function parseStringTemplate(str: string): ParserResult;
        function Execute(code: string, parser: Parser.parser): ParserResult;
    }
    export namespace Parser {
        interface ICode {
            Code: string;
            scop?: bind.Scop;
            result?: any;
            pb?: bind.PropBinding;
        }
        class StringTemplate {
            private code;
            private curs;
            private len;
            private stack;
            private pcurs;
            private isCode;
            private readonly currentChar;
            private readonly nextChar;
            private readonly MoveNext;
            private init;
            private getString;
            private _toStack;
            Compile(code: string): (string | ICode)[];
            static default: StringTemplate;
            static Compile(code: string): (string | ICode)[];
            static GenearteString(stack: (string | ICode)[]): string;
        }
    }
}
declare module "sys/Dom" {
    import { UI } from "sys/UI";
    import { Attributes, Dom } from "sys/runtime";
    import { Parser } from "sys/Syntaxer";
    import { basic } from "sys/utils";
    import { bind } from "sys/Corelib";
    export namespace Processor {
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
    export namespace attributes {
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
    export namespace attributes {
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
        function PushTest(title: string, fn: Function, owner?: any, ...args: any[]): void;
        function PushMultiTest(title: string, fn: Function, owner?: any, ...args: any[]): void;
        function Test(title: string, owner?: any, ...args: any[]): (target: any, _propertyKey: string, des?: PropertyDescriptor) => void;
        function MultiTest(title: string, owner?: any, ...args: any[][]): (target: any, _propertyKey: string, des?: PropertyDescriptor) => void;
        function runTests(): ITestData[];
        interface ITestData {
            test: Itest;
            args: any[];
            result?: any;
            start: number;
            end?: number;
            success?: boolean;
        }
        interface Itest {
            fn: Function;
            args: any[];
            owner: any;
            title: string;
            multiTest?: boolean;
        }
    }
    export namespace attributes {
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
    export namespace attributes {
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
    export namespace attributes {
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
    export enum ProcessStat {
        NotProcessed = 0,
        Processing = 1,
        Processed = 2
    }
    export class Controller extends bind.DObject implements basic.IDisposable {
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
    export class xNode<T> {
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
}
declare module "sys/runtime" {
    import { bind } from "sys/Corelib";
    import { Controller } from "sys/Dom";
    import { defs } from "sys/defs";
    import { UI } from "sys/UI";
    export namespace helper {
        var MaxSafeInteger: number;
        function detach(node: any): (nnode?: any) => void;
        function TryCatch<T>(owner: any, Try: (...args: any[]) => T, Catch?: (e: Error, ...args: any[]) => T, params?: any[]): T;
        function $defineProperty(o: any, p: string, attributes: PropertyDescriptor & ThisType<any>, onError?: (o: any, p: string, attributes: PropertyDescriptor & ThisType<any>) => any): any;
    }
    export namespace reflection {
        type GFunction = Function | reflection.GenericType | reflection.DelayedType;
        namespace basic {
            interface IBindable {
                Owner?: any;
                Invoke(...args: any[]): any;
            }
            interface ITBindable<T extends (...args: any[]) => void> extends IBindable {
                Invoke: T;
            }
            type Invoker<T extends (...args: any[]) => void> = ITBindable<T> | T;
        }
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
        enum NativeTypes {
            Nullable = 0,
            Boolean = 1,
            Number = 2,
            String = 3,
            Function = 4,
            Array = 5,
            Object = 6,
            DObject = 7
        }
    }
    export namespace Attributes {
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
    export namespace thread {
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
    export namespace PaintThread {
        interface task2 {
            owner: any;
            method: Function;
            args: any[];
        }
        function Push(ins: bind.JobInstance, e: bind.EventArgs<any, any>, scop?: bind.Scop): void;
        function OnPaint(task: task2): void;
    }
    export namespace Dom {
        interface ISlot {
            nextSible: Node;
            parent: Node;
            children: Node[];
        }
        interface SlotChildrenMap {
            [s: string]: Node[];
        }
        interface SlotsMap {
            [s: string]: ISlot;
        }
        function OnNodeInserted(controller: Controller, dom: Node): void;
        function RemoveListener(dom: Node): void;
        function pushToIdl(f: any): void;
        namespace UIDispatcher {
            function OnIdle(f: () => void): void;
        }
    }
    export namespace mvc {
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
    export namespace Msg {
        function register(api: defs.ModalApi, name?: string): void;
        function getModalApi(name?: string): defs.ModalApi;
        function New(name?: string, args?: any[]): defs.$UI.IModal;
        function ShowDialog(name: string, title: string, msg: string | HTMLElement | UI.JControl, callback?: (e: UI.MessageEventArgs) => void, ok?: string, cancel?: string, abort?: string): defs.$UI.IModal;
        function NextZIndex(): number;
        function getApiNames(): string[];
        function defaultApi(): defs.ModalApi;
    }
}
declare module "sys/utils" {
    import { bind } from "sys/Corelib";
    import { collection } from "sys/collections";
    export namespace html {
        function fromText(t: string): Element;
        function indexOf(node: Node): number;
        function replace(child: Node, by: Node): Node;
        function wrap(child: Element, into: Element): Element;
    }
    export namespace css {
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
    export namespace math {
        function round1(_n: any, x: any): string;
        function round(_n: any, x: any): string;
    }
    export namespace basic {
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
    export namespace query {
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
    export function $$(dom: Node | Node[]): query.__ | query._;
    export namespace basic {
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
}
declare module "sys/Encoding" {
    import { reflection } from "sys/runtime";
    export module serialization {
        interface colReader {
            value: string;
            cursor: charReader;
            EOF: boolean;
        }
        interface charReader {
            cursor: number;
            value: string;
            len?: number;
            newLine?: boolean;
            EOF?: boolean;
        }
        interface CsvEventArgs {
            csv: CSV;
            index?: number;
            value?: any;
            set(this: CsvEventArgs, value: any, index: number): CsvEventArgs;
        }
        interface fillArgs {
            csv?: CSV;
            parser?: (e: CsvEventArgs) => any;
            header?: string[];
            cols?: Object | any[];
            e?: CsvEventArgs;
        }
        class CSV {
            private input;
            private autoParse;
            private asJson;
            static separator: string;
            static emptyArray: string[];
            private e;
            Columns: any[];
            private _cursor;
            private _startCursor;
            static ReadAllLines(s: string): string[];
            private parse;
            private static isEmptyLine;
            private static trim;
            private static nextChar;
            private static readString;
            private static readColumn;
            private static clear;
            private static fillColumns;
            private static readLine;
            constructor(input: string, autoParse: boolean, asJson: any);
            ColumnName(index: number): string;
            ColumnIndex(name: string): number;
            private _current;
            readonly Cursor: charReader;
            Reset(): this;
            AllowNullValue: boolean;
            Next(e?: fillArgs): boolean;
            swapArgs(e: fillArgs): fillArgs;
            private jsonParser;
            readonly Current: any[] | Object;
            Field(name_index: string | number): any;
        }
    }
    export module encoding {
        interface IPath<OB, DP> {
            Owner: OB;
            Property: DP;
            Set<T>(value: T): T;
            executed: boolean;
        }
        interface Serialization<T> {
            FromJson(json: any, context: SerializationContext, ref: IRef): T;
            ToJson(data: T, context: SerializationContext, indexer: encoding.IIndexer): any;
        }
        interface IRef {
            __ref__: number;
        }
        interface IIndexer {
            ref: IRef;
            json: any;
            valid: boolean;
        }
        class SerializationContext {
            static GlobalContext: SerializationContext;
            private _store;
            private _ext;
            RequireNew: (json: any, type: Function | reflection.GenericType) => boolean;
            Dispose(): void;
            constructor(isDefault: boolean);
            Register<T>(type: Function, ser: Serialization<T>): void;
            UnRegister<T>(type: Function): Serialization<any>;
            GetRegistration(type: Function): Serialization<any>;
            Append(con: SerializationContext): void;
            Get(type: Function): Serialization<any>;
            private indexer;
            private refs;
            get(ref: number, path: IPath<any, any>): any;
            set(ref: number, obj: any): void;
            private cnt;
            getJson(obj: any): IIndexer;
            reset(): this;
            static getType(type: Function): Function;
            FromJson(json: any, type: Function | reflection.GenericType, path: IPath<any, any>): any;
            ToJson(obj: any): any;
            private _toJson;
            toString(): void;
            _arrayToJson(arr: Array<any>, ret: IIndexer): {
                "__type__": reflection.NativeTypes;
                "__value__": any[];
                "@ref": number;
            };
        }
    }
}
declare module "sys/collections" {
    import { basic } from "sys/utils";
    import { bind } from "sys/Corelib";
    import { reflection } from "sys/runtime";
    import { encoding } from "sys/Encoding";
    export namespace utils {
        class ListEventArgs<P, T> implements basic.IDisposable {
            oldItem: T;
            newItem: T;
            startIndex: P;
            event: collection.CollectionEvent;
            collection?: T[];
            constructor(oldItem: T, newItem: T, startIndex: P, event: collection.CollectionEvent, collection?: T[]);
            Dispose(): void;
            static readonly ResetEvent: any;
            private static _r;
        }
        interface IPatent<T> {
            Check(s: T): boolean;
            equals(p: IPatent<T>): boolean;
        }
        abstract class Filter<T, P extends IPatent<T>> extends bind.DObject {
            protected _patent: P;
            Patent: P | string;
            protected abstract convertFromString(x: string): P;
            abstract Begin(deb: number, count: number): any;
            private _store;
            constructor();
            OnChanged(callback: (filter: Filter<T, P>, data: any) => void, data: any, name?: string): number;
            OffChanged(name_id: string | number): void;
            protected _ismath(str: string[]): boolean;
            abstract IsMatch(index: number, item: T): any;
        }
        class CostumeFilter<T, P extends IPatent<T>> extends Filter<T, P> {
            _isMatch: (patent: P, item: T) => boolean;
            constructor(_isMatch: (patent: P, item: T) => boolean);
            IsMatch(index: number, item: T): boolean;
            convertFromString(x: string): P;
            Begin(deb: number, count: number): void;
        }
        class filterCallback<T, P extends IPatent<T>> {
            callback: (filter: utils.Filter<T, P>, data: any) => void;
            data: any;
            name?: string;
            id?: number;
            constructor(callback: (filter: utils.Filter<T, P>, data: any) => void, data: any, name?: string, id?: number);
        }
        interface Node<T> {
            Depth: number;
            Value: T;
            param?: any;
            children: Node<T>[];
            Parent: Node<T>;
        }
        class Tree<T> {
            private source;
            private getParent;
            private dic;
            constructor(source: collection.List<T>, getParent: (item: T) => T, listen: (base: Node<T>, target: Node<T>, add_remove_clear: boolean) => void);
            Remove(c: T): void;
            Add(c: T): void;
            Clear(): void;
            Reset(): void;
            _new(target: T): Node<T>;
            private getOrAdd;
            private OnAdd;
            getNodes(): IterableIterator<Node<T>>;
            getBases(): Node<T>[];
            private OnRemove;
            private OnClear;
            OnChange: bind.EventListener<(base: Node<T>, target: Node<T>, add_remove_clear: boolean) => void>;
        }
    }
    export namespace collection {
        enum CollectionEvent {
            Added = 0,
            Removed = 1,
            Replace = 2,
            Cleared = 3,
            Reset = 4,
            Setted = 5
        }
        type ListEventInvoker<T> = (e: utils.ListEventArgs<number, T>) => void;
        type ListEventHandler<T> = ListEventInvoker<T> | (basic.ITBindable<ListEventInvoker<T>>);
        type ListEventBindable<T> = basic.ITBindable<ListEventInvoker<T>>;
        class List<T> extends bind.DObject {
            protected argType: Function;
            static __fields__(): any[];
            static DPCount: bind.DProperty<number, List<any>>;
            private UCount;
            protected _list: T[];
            readonly ArgType: Function;
            GetType(): Function | reflection.GenericType;
            constructor(argType: Function, array?: T[]);
            AsList(): T[];
            Order(comp: (a: T, b: T) => boolean | number): void;
            OrderBy(comp: (a: T, b: T) => number): void;
            Filtred(filter: utils.Filter<T, utils.IPatent<T>>): ExList<T, utils.IPatent<T>>;
            Set(i: number, item: T): boolean;
            Get(i: number): T;
            Insert(i: number, item: T): boolean;
            Add(item: T): this;
            AddRange(items: T[]): void;
            CheckIndex(i: number): boolean;
            Remove(item: T | number): boolean;
            RemoveAt(item: number): boolean;
            Clear(): void;
            readonly Count: number;
            IndexOf(item: T): number;
            Listen: ListEventHandler<T>;
            Unlisten: ListEventHandler<T>;
            private OnChanged;
            private _changed;
            private _changing;
            protected getArgType(json: any): Function;
            ToJson(x: encoding.SerializationContext, indexer: encoding.IIndexer): any;
            FromJson(json: any, x: encoding.SerializationContext, update?: boolean, callback?: (prop: string, val: any) => Object): this;
            OnDeserialize(list: T[]): void;
            private static getType;
            UpdateDelegate: () => T[];
            static GenType(T: Function): Function | reflection.GenericType;
        }
        interface IKeyValuePair<T, P> {
            Key: T;
            Value: P;
        }
        class Dictionary<T, P> extends bind.DObject {
            Name: string;
            ReadOnly?: boolean;
            private keys;
            private values;
            constructor(Name: string, ReadOnly?: boolean);
            GetKeyAt(i: number): T;
            GetValueAt(i: number): P;
            readonly Count: number;
            Clear(): void;
            IndexOf(key: T, fromIndex?: number): number;
            IndexOfValue(val: P, fromIndex?: number): number;
            Set(key: T, value: P): void;
            Remove(key: T): P;
            RemoveAllValues(val: P): T[];
            RemoveAt(i: number): IKeyValuePair<T, P>;
            getValues(): P[];
            Get(key: T): P;
            GetOrAdd(key: T, value?: P): P;
            GetOrCreate<S>(key: T, New: (key: T, param?: S) => P, param?: S): P;
            GetKeyOf(val: P): T;
            Listen: (e: utils.ListEventArgs<T, P>) => void;
            Unlisten: (e: utils.ListEventArgs<T, P>) => void;
            private OnChanged;
            private _changed;
            UpdateDelegate: () => T[];
        }
        class ExList<T, P extends utils.IPatent<T>> extends List<T> {
            static DPSource: bind.DProperty<List<any>, ExList<any, any>>;
            Source: List<T>;
            static DPFilter: bind.DProperty<utils.Filter<any, any>, ExList<any, any>>;
            Filter: utils.Filter<T, P>;
            static DPMaxResult: bind.DProperty<number, ExList<any, any>>;
            MaxResult: number;
            static DPShift: bind.DProperty<number, ExList<any, any>>;
            Shift: number;
            static __fields__(): (bind.DProperty<utils.Filter<any, any>, ExList<any, any>> | bind.DProperty<number, ExList<any, any>> | bind.DProperty<List<any>, ExList<any, any>>)[];
            private _fid;
            private filterChanged;
            private sourceChanged;
            private sicd;
            private MaxResultChanged;
            static New<T, P extends utils.IPatent<T>>(source: List<T>, filter: utils.Filter<T, P>, argType?: Function): ExList<T, P>;
            constructor(argType: Function);
            private static patentChanged;
            private sourceItemChanged;
            private isMatch;
            start: number;
            Reset(): void;
        }
        interface Converter<A, B> {
            ConvertA2B(sender: TransList<A, B>, index: number, a: A, d: any): B;
            ConvertB2A(sender: TransList<A, B>, index: number, b: B, d: any): A;
        }
        class TransList<From, To> extends List<To> {
            private converter;
            private stat?;
            static __fields__(): bind.DProperty<List<any>, TransList<any, any>>[];
            private sli;
            private SourceChanged;
            static DPSource: bind.DProperty<List<any>, TransList<any, any>>;
            Source: List<any>;
            constructor(argType: Function, converter: Converter<From, To>, stat?: any);
            private _internal;
            private OnSourceChanged;
            private Reset;
            Add(t: To): this;
            Remove(x: To): boolean;
            Insert(i: number, item: To): boolean;
            Clear(): void;
            Order(n: (a: To, b: To) => boolean): void;
            OrderBy(n: (a: To, b: To) => number): void;
            Set(i: number, item: To): boolean;
        }
        abstract class Binding<T> {
            GetType(): typeof Binding;
            private _dataContext;
            DataContext: collection.List<T>;
            constructor(dataContext: collection.List<T>);
            abstract OnItemAdded(item: T, index: number): any;
            abstract OnItemRemoved(item: T, index: number): any;
            abstract OnSourceCleared(): any;
            abstract OnSourceInitialized(_old: collection.List<T>, _nex: collection.List<T>): any;
            abstract OnSourceReset(): any;
            abstract OnSourceReplace(oldItem: T, newItem: T, index: number): any;
            private initChanged;
        }
        abstract class Render<T, P> extends Binding<T> {
            GetType(): typeof Render;
            private _rendredList;
            readonly RendredList: collection.List<P>;
            constructor(dataContext: collection.List<T>);
            abstract Render(item: T): P;
            OnItemAdded(item: T, index: number): void;
            OnItemRemoved(item: T, index: number): void;
            OnSourceCleared(): void;
            OnSourceInitialized(_old: collection.List<T>, _nex: collection.List<T>): void;
        }
        class SyncQuee<T> extends bind.DObject {
            handler: basic.ITBindable<(e: QueeEventArgs<T>) => void>;
            private quee;
            private _isExecuting;
            CurrentData: T;
            push(data: T): void;
            constructor(handler: basic.ITBindable<(e: QueeEventArgs<T>) => void>);
            EndOperation(e: QueeEventArgs<T>): void;
        }
        interface QueeEventArgs<T> {
            quee: SyncQuee<T>;
            data: T;
        }
    }
}
declare module "sys/Filters" {
    import { bind } from "sys/Corelib";
    import { collection, utils } from "sys/collections";
    export module filters {
        namespace scopic {
            interface IListFilterParam {
                Filter: string;
                Source: string;
                Patent: string;
                shift: string;
                max: string;
            }
            class ListFilter<T> extends bind.Filter<collection.List<T>, collection.ExList<T, list.StringPatent<T>>> {
                private p;
                private fl?;
                private isConst;
                constructor(s: bind.Scop, p: string, fl?: collection.ExList<T, filters.list.StringPatent<T>>);
                private getFilter;
                private getSource;
                private getPatent;
                protected Convert(data: collection.List<T>): collection.ExList<T, any>;
                protected ConvertBack(data: collection.ExList<T, any>): collection.List<T>;
                Initialize(): void;
            }
        }
        namespace list {
            class SubListPatent implements utils.IPatent<any> {
                Start: number;
                End: number;
                constructor(start: number, end: number);
                Check(i: any): boolean;
                equals(p: SubListPatent): boolean;
                Refresh(): this;
                private _refresh;
            }
            class StringPatent<T> implements utils.IPatent<T> {
                private p;
                private o;
                constructor(s: string);
                Check(s: any): boolean;
                equals(p: StringPatent<any>): boolean;
            }
            class PropertyPatent<T> implements utils.IPatent<T> {
                s: T;
                constructor(s: T);
                Check(s: any): boolean;
                equals(p: PropertyPatent<any>): boolean;
            }
            class PropertyFilter<T extends bind.DObject> extends utils.Filter<T, PropertyPatent<T>> {
                DP: bind.DProperty<any, any>;
                private _skip;
                Begin(deb: number, count: number): void;
                IsMatch(i: number, item: T): any;
                protected convertFromString(x: string): PropertyPatent<T>;
                constructor(DP: bind.DProperty<any, any>);
            }
            class StringFilter<T> extends utils.Filter<T, StringPatent<T>> {
                Begin(deb: number, count: number): void;
                IsMatch(i: number, item: T): boolean;
                protected convertFromString(x: string): StringPatent<T>;
            }
            class BoundStringFilter<T> extends utils.Filter<T, StringPatent<T>> {
                private deb;
                private fin;
                Begin(deb: number, count: number): void;
                IsMatch(i: number, item: T): boolean;
                protected convertFromString(x: string): StringPatent<T>;
            }
            class DObjectPatent implements utils.IPatent<bind.DObject> {
                private o;
                constructor(s: string);
                Check(s: bind.DObject): boolean;
                equals(p: DObjectPatent): boolean;
            }
            class DObjectFilter<T> extends utils.Filter<T, StringPatent<T>> {
                Begin(deb: number, count: number): void;
                IsMatch(i: number, item: T): boolean;
                protected convertFromString(x: string): StringPatent<T>;
            }
            abstract class PatentGroup<T> implements utils.IPatent<T> {
                left: utils.IPatent<T>;
                right: utils.IPatent<T>;
                constructor(left: utils.IPatent<T>, right: utils.IPatent<T>);
                abstract Clone(): any;
                abstract Check(item: T): any;
                equals(p: utils.IPatent<T>): boolean;
                protected areEquals(a: utils.IPatent<T>, b: utils.IPatent<T>): boolean;
            }
            class ANDPatentGroup<T> extends PatentGroup<T> {
                Check(item: T): boolean;
                Clone(): ANDPatentGroup<T>;
            }
            class ORPatentGroup<T> extends PatentGroup<T> {
                Clone(): ORPatentGroup<T>;
                Check(item: T): boolean;
            }
            class FilterGroup<T> extends utils.Filter<T, PatentGroup<T>> {
                constructor(patent: PatentGroup<T>);
                Begin(deb: number, count: number): void;
                IsMatch(i: number, item: T): any;
                protected convertFromString(x: string): PatentGroup<T>;
                LeftPatent: utils.IPatent<T>;
                RightPatent: utils.IPatent<T>;
            }
            class LStringFilter<T> extends utils.Filter<T, StringPatent<T>> {
                private deb;
                private count;
                Begin(deb: number, count: number): void;
                IsMatch(i: number, item: T): boolean;
                protected convertFromString(x: string): StringPatent<T>;
            }
            class SubListFilter<T> extends utils.Filter<T, SubListPatent> {
                private deb;
                private count;
                Begin(deb: number, count: number): void;
                IsMatch(i: number, item: T): boolean;
                protected convertFromString(x: string): SubListPatent;
            }
            function indexdFilter(source: collection.List<any>, count: number): {
                update(): void;
                reset(): void;
                next(): void;
                previouse(): void;
                readonly List: collection.ExList<any, utils.IPatent<any>>;
                readonly numPages: number;
                Index: number;
                CountPerPage: number;
            };
        }
    }
}
declare module "sys/UI" {
    import { bind } from "sys/Corelib";
    import { collection } from "sys/collections";
    import { defs } from "sys/defs";
    import { mvc, Dom as dom } from "sys/runtime";
    import { attributes, Controller, Processor } from "sys/Dom";
    import { Parser } from "sys/Syntaxer";
    import { basic } from "sys/utils";
    export type conv2template = mvc.ITemplate | string | Function | UI.Template | HTMLElement;
    export module UI {
        enum KeyboardControllerResult {
            Handled = 0,
            Release = -1,
            ByPass = 2
        }
        var ms: string[];
        enum Keys {
            Enter = 13,
            Tab = 9,
            Esc = 27,
            Escape = 27,
            Up = 38,
            Down = 40,
            Left = 37,
            Right = 39,
            PgDown = 34,
            PageDown = 34,
            PgUp = 33,
            PageUp = 33,
            End = 35,
            Home = 36,
            Insert = 45,
            Delete = 46,
            Backspace = 8,
            Space = 32,
            Meta = 91,
            Win = 91,
            Mac = 91,
            Multiply = 106,
            Add = 107,
            Subtract = 109,
            Decimal = 110,
            Divide = 111,
            Scrollock = 145,
            Pausebreak = 19,
            Numlock = 144,
            "5numlocked" = 12,
            Shift = 16,
            Capslock = 20,
            F1 = 112,
            F2 = 113,
            F3 = 114,
            F4 = 115,
            F5 = 116,
            F6 = 117,
            F7 = 118,
            F8 = 119,
            F9 = 120,
            F10 = 121,
            F11 = 122,
            F12 = 123,
            AltLeft = 18,
            AltRight = 18,
            ShiftLeft = 18,
            ShiftRight = 18,
            ControlLeft = 17,
            ControlRight = 17,
            MetaLeft = 91,
            MetaRight = 91
        }
        enum Controlkeys {
            Alt = 18,
            Shift = 16,
            Control = 17,
            Meta = 91
        }
        enum Events {
            keydown = 2,
            keyup = 3,
            keypress = 5
        }
        enum MetricType {
            Pixel = 0,
            Percentage = 1,
            Inch = 2,
            Em = 3
        }
        enum SearchActionMode {
            None = 0,
            Validated = 1,
            Instantany = 2,
            NoSearch = 3
        }
        enum MessageResult {
            Exit = 0,
            ok = 1,
            cancel = 2,
            abort = 3
        }
        enum NotifyType {
            Focuse = 0,
            UnFocus = 1
        }
        enum ServiceType {
            Main = 0,
            Stackable = 1,
            Instantany = 3
        }
        interface IContextMenuEventArgs<T> {
            ObjectStat?: any;
            e: MouseEvent;
            x: number;
            y: number;
            selectedItem?: T;
            cancel?: boolean;
            callback(e: IContextMenuEventArgs<T>): any;
        }
        interface IContextMenu<T> {
            getTarget(): JControl;
            OnAttached(e: IContextMenuEventArgs<T>): any;
            OnClosed(result: T, e: IContextMenuEventArgs<T>): boolean;
            getView(): UI.JControl;
        }
        interface IService {
            GetLeftBar(): JControl;
            GetRightBar(): JControl;
            Handler?: EventTarget;
            ServiceType: ServiceType;
            Notify?: bind.EventListener<(s: IService, notifyTYpe: NotifyType) => void>;
            Callback(args: any): any;
            Handled(): boolean;
        }
        interface IKeyCombinerTarget extends basic.ITBindable<(k: keyCominerEvent, e: IKeyCombinerTarget) => void> {
            target?: Node | JControl;
        }
        interface IKeyA {
            [s: string]: IKeyCombinerTarget[];
        }
        interface IKeyboardControllerEventArgs {
            e?: KeyboardEvent;
            Result?: UI.KeyboardControllerResult;
            Controller: IKeyboardController;
        }
        interface IKeyboardController {
            owner?: any;
            invoke(e: IKeyboardControllerEventArgs): any;
            onResume?(e: IKeyboardControllerEventArgs): boolean;
            onPause?(e: IKeyboardControllerEventArgs): boolean;
            onStop?(e: IKeyboardControllerEventArgs): boolean;
            stackable?: boolean;
            params?: any[];
        }
        type IItem = defs.IItem;
        enum HorizontalAlignement {
            Left = 0,
            Center = 1,
            Right = 2
        }
        enum VerticalAlignement {
            Top = 0,
            Center = 1,
            Bottom = 2
        }
    }
    export module UI {
        class Point {
            x: number;
            y: number;
            constructor(x: number, y: number);
        }
        class Size {
            w: Metric;
            h: Metric;
            constructor(w: Metric | string | number, h: Metric | number | string);
        }
        class Metric {
            Value: number;
            Type: MetricType;
            constructor(value: number | string, type?: MetricType);
            minus(v: any): Metric;
            toString(): string;
            fromString(s: string): void;
        }
        class MessageEventArgs {
            Modal: defs.$UI.IModal;
            Result: MessageResult;
            msg: string;
            private _stayOpen;
            readonly stayOpen: boolean;
            StayOpen(): void;
            Close(): void;
            constructor(Modal: defs.$UI.IModal, Result: MessageResult, msg: string);
        }
        class HotKey {
            private _key;
            private __ctrl;
            Key: Keys;
            Control: Controlkeys;
            IsPressed(e: KeyboardEvent): boolean;
            private checkKey;
            private checkControl;
        }
        function processHTML(dom: HTMLElement, data?: any): TControl<any>;
        class DragableElement implements EventListenerObject {
            element: HTMLElement;
            header: HTMLElement;
            pos1: number;
            pos2: number;
            pos3: number;
            pos4: number;
            private closeDragElementHandler;
            private elementDragHandler;
            elementDrag(e: MouseEvent): void;
            closeDragElement(): void;
            handleEvent(e: MouseEvent): void;
            constructor(element: HTMLElement, header: HTMLElement);
            initialize(element: HTMLElement, header: HTMLElement): void;
            Dispose(): void;
        }
        class DragManager {
            private handler;
            private target;
            private View;
            private loc;
            constructor(handler: JControl, target: JControl);
            private mouseloc;
            private cntloc;
            handleEvent(e: DragEvent): void;
            Location: Point;
            private RelocationJob;
            reLocation(hr: boolean, vr: boolean): void;
        }
        class keyCominerEvent {
            Owner: any;
            OnComined: bind.EventListener<(owner: this, e: IKeyCombinerTarget) => void>;
            private _keyA;
            private _keyB;
            private handlers;
            sort(ar: IKeyCombinerTarget[]): undefined;
            sort1(ar: Node[]): void;
            KeyA: KeyboardEvent;
            KeyB: KeyboardEvent;
            constructor(Owner: any);
            private elementInViewport1;
            private elementInViewport;
            Cancel: boolean;
            private _stopEvent;
            private _rise;
            reset(): void;
            handleEvent(e: KeyboardEvent): void;
            private isValid;
            On(keyA: string, keyB: string, handle: (s: keyCominerEvent, e: IKeyCombinerTarget) => void, target?: JControl | Node, owner?: any): IKeyCombinerTarget;
            Off(keyA: string, keyB: string, e: IKeyCombinerTarget): void;
            private _pause;
            protected dom: HTMLElement;
            pause(): void;
            resume(): void;
            attachTo(dom: HTMLElement): void;
            stopPropagation(): void;
        }
        class DesktopKeyboardManager extends keyCominerEvent {
            protected desk: Desktop;
            constructor(desk: Desktop);
            dom: HTMLElement;
            attachTo(v: HTMLElement): void;
        }
        class KeyboardControllerManager {
            Desktop: UI.Desktop;
            private _controllers;
            _current: IKeyboardController;
            constructor(Desktop: UI.Desktop);
            Current(): IKeyboardController;
            GetController(nc: IKeyboardController): boolean;
            Release(c: IKeyboardController): boolean;
            ResumeStack(): boolean;
            Invoke(e: KeyboardEvent): UI.KeyboardControllerResult;
        }
    }
    export module UI {
        abstract class JControl extends bind.Scop implements EventListenerObject {
            protected _view: HTMLElement;
            protected $slots: dom.SlotChildrenMap;
            protected OnTemplateCompiled(node: Processor.Tree): void;
            Is(toke: string | Parser.CToken): boolean;
            private _parentScop;
            getParent(): bind.Scop;
            protected _OnValueChanged(e: bind.EventArgs<any, any>): void;
            setParent(v: bind.Scop): boolean;
            CombinatorKey(keyA: string, keyB: string, callback: (this: this, e: keyCominerEvent) => void): IKeyCombinerTarget;
            SearchParents<T extends JControl>(type: Function): T;
            static LoadCss(url: any): HTMLLinkElement;
            static __fields__(): any[];
            readonly InnerHtml: string;
            Float(v: HorizontalAlignement): void;
            Clear(): void;
            protected parent: JControl;
            _presenter: JControl;
            private _hotKey;
            _onInitialize: bind.EventListener<(s: JControl) => void>;
            OnInitialized: (s: this) => void;
            Presenter: JControl;
            setAttribute(name: any, value: any): this;
            OnKeyDown(e: KeyboardEvent): any | void;
            OnContextMenu(e: MouseEvent): any;
            OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget): any | void;
            setAttributes(attributes: {
                [s: string]: string;
            }): this;
            applyStyle(a: string, b: string, c: string, d: string, e: string, f: string): any;
            applyStyle(a: string, b: string, c: string, d: string, e: string): any;
            applyStyle(a: string, b: string, c: string, d: string): any;
            applyStyle(a: string, b: string, c: string): any;
            applyStyle(a: string, b: string): any;
            applyStyle(a: string): any;
            disapplyStyle(a: string, b: string, c: string, d: string, e: string, f: string, x: string): any;
            disapplyStyle(a: string, b: string, c: string, d: string, e: string, f: string): any;
            disapplyStyle(a: string, b: string, c: string, d: string, e: string): any;
            disapplyStyle(a: string, b: string, c: string, d: string): any;
            disapplyStyle(a: string, b: string, c: string): any;
            disapplyStyle(a: string, b: string): any;
            disapplyStyle(a: string): any;
            private _display;
            Visible: boolean;
            Wait: boolean;
            Enable: boolean;
            Parent: JControl;
            private static counter;
            private _id;
            private init;
            readonly IsInit: boolean;
            protected OnFullInitialized(): void;
            protected OnPaint: (this: this, n: this) => void;
            protected OnParentChanged(_old: JControl, _new: JControl): void;
            protected instantanyInitializeParent(): boolean;
            ToolTip: string;
            readonly View: HTMLElement;
            constructor(_view: HTMLElement);
            protected _hasValue_(): boolean;
            protected abstract initialize(): any;
            static createDiv(): HTMLDivElement;
            addEventListener<T>(event: string, handle: (sender: this, e: Event, param: T) => void, param: T, owner?: any): basic.DomEventHandler<any, any>;
            private static _handle;
            AddRange(chidren: JControl[]): this;
            Add(child: JControl): this;
            IndexOf(child: JControl): void;
            Insert(child: JControl, to: number): this;
            Remove(child: JControl, dispose?: boolean): boolean;
            protected getTemplate(child: JControl): JControl;
            readonly Id: number;
            Dispose(): void;
            protected OnHotKey(): void;
            HotKey: HotKey;
            handleEvent(e: Event): void;
            private _events;
            private isEventRegistred;
            private registerEvent;
            static toggleClass(dom: any, className: any): void;
            private _events_;
            watch(name: string, callback: (e: attributes.EventEventArgs<this, any>) => void, owner?: any): this;
            protected notify(name: string, e: attributes.EventEventArgs<this, any>): void;
            unwatch(name: string, callback: (e: attributes.EventEventArgs<any, any>) => void, owner?: any): void;
        }
        interface IContentControl extends JControl {
            Content: JControl;
        }
        abstract class Control<T extends JControl> extends JControl {
            private _c;
            readonly Children: T[];
            Add(child: T): this;
            NativeAdd(child: JControl): void;
            Insert(child: T, to: number): this;
            Remove(child: T, dispose?: boolean): boolean;
            RemoveAt(i: number, dispose: boolean): boolean;
            protected abstract Check(child: T): any;
            protected readonly HasTemplate: boolean;
            protected getTemplate(child: T): JControl;
            protected OnChildAdded(child: T): void;
            getChild(i: number): T;
            IndexOf(item: T): number;
            constructor(view: HTMLElement);
            readonly Count: number;
            CloneChildren(): void;
            Clear(dispose?: boolean): void;
            Dispose(): void;
        }
        class Dom extends JControl {
            constructor(tagName?: string | HTMLElement, classList?: string[]);
            initialize(): void;
        }
        class Div extends UI.Control<JControl> {
            constructor();
            initialize(): void;
            Check(item: JControl): boolean;
        }
        class Label extends UI.JControl {
            constructor(text: string);
            initialize(): void;
            Text: string;
        }
        class Input extends UI.JControl {
            Disable(disable: any): void;
            constructor(dom?: any);
            initialize(): void;
            Placeholder: string;
            Text: string;
            Blur(): void;
            handleEvent(e: FocusEvent): void;
            OnFocusIn(e: FocusEvent): void;
            OnKeyPressed(e: KeyboardEvent): UI.KeyboardControllerResult;
            OnFocusOut(e: FocusEvent): void;
        }
        class DivControl extends Control<JControl> {
            constructor(tag?: string | HTMLElement);
            initialize(): void;
            Check(child: JControl): boolean;
        }
        class ContentControl extends JControl implements IContentControl {
            constructor(dom?: HTMLElement);
            initialize(): void;
            private _content;
            Content: JControl;
            OnKeyDown(e: any): any;
            OnContextMenu(e: any): any;
        }
    }
    export module UI {
        class Desktop extends Control<defs.$UI.IApp> {
            WrapPage(e: attributes.ContentEventArgs): void;
            static DPCurrentApp: bind.DProperty<defs.$UI.IApp, Desktop>;
            static DPCurrentLayout: bind.DProperty<JControl, Desktop>;
            CurrentLayout: JControl;
            Logout(): any;
            OpenSignin(): void;
            isReq: number;
            KeyCombiner: keyCominerEvent;
            CurrentApp: defs.$UI.IApp;
            static ctor(): void;
            private _currentLayoutChanged;
            private selectApp;
            static __fields__(): bind.DProperty<JControl, Desktop>[];
            AuthStatChanged(v: boolean): void;
            private apps;
            IsSingleton: boolean;
            constructor();
            initialize(): void;
            private observer;
            private mouseController;
            KeyboardManager: UI.KeyboardControllerManager;
            private _keyboardControllers;
            private _keyboardController;
            private KeyboardController;
            GetKeyControl(owner: any, invoke: (e: KeyboardEvent, ...params: any[]) => UI.KeyboardControllerResult, params: any[]): void;
            ReleaseKeyControl(): void;
            private focuser;
            private handleTab;
            OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget): void;
            defaultKeys: string;
            OnKeyDown(e: KeyboardEvent): void;
            handleEvent(e: Event): any;
            OnContextMenu(e: MouseEvent): any;
            private ShowStart;
            static readonly Current: Desktop;
            Check(v: defs.$UI.IApp): boolean;
            Show(app: defs.$UI.IApp): void;
            private to;
            private loadApp;
            Add(i: defs.$UI.IApp): this;
            Register(app: defs.$UI.IApp): void;
            AuthenticationApp: defs.$UI.IAuthApp;
            private Redirect;
            OnUsernameChanged(job: any, e: any): void;
        }
        class ServiceNavBar<T extends IItem> extends JControl {
            App: defs.$UI.IApp;
            constructor(App: defs.$UI.IApp);
            initialize(): void;
            private _lefttabs;
            private _righttabs;
            private bi;
            LeftTabs: defs.INavbar<T>;
            RightTabs: defs.INavbar<T>;
            OnPageSelected: (page: T) => void;
            OnClick(page: T): void;
            Add(child: JControl): this;
            AddRange(child: JControl[]): this;
            Remove(child: JControl): boolean;
            serviceNotified(s: IService, n: NotifyType): void;
            private services;
            private readonly currentStack;
            private CurrentService;
            PushGBar(ser: IService): void;
            PopGBar(ser: IService): void;
            ExitBar(): void;
            PushBar(ser: IService): void;
            PopBar(): void;
            private HideCurrentService;
            private ShowCurrentService;
            Push(s: IService): void;
            private Has;
            Pop(s?: IService): void;
            Register(service: IService): void;
            private _services;
        }
        interface IActionText extends JControl {
        }
        class BarStack {
            private _current;
            private others;
            constructor(current: IService);
            readonly Current: IService;
            Push(s: IService): void;
            Pop(): IService;
            Has(s: IService): number;
            Exit(): void;
        }
        class Error extends JControl {
            IsInfo: boolean;
            private container;
            private _text;
            Message: string;
            Expire: number;
            constructor();
            initialize(): void;
            handleEvent(e: any): void;
            Push(): void;
            private timeout;
            Pop(): void;
            Dispose(): void;
        }
        class InfoArea extends Control<JControl> {
            static readonly Default: InfoArea;
            constructor();
            initialize(): void;
            Check(j: JControl): boolean;
            static push(msg: string, isInfo?: boolean, expire?: number): void;
        }
        abstract class Layout<T extends defs.$UI.IPage> extends Control<T> implements defs.$UI.IApp {
            readonly IsAuthentication: boolean;
            protected OnPageChanging(e: bind.EventArgs<T, this>): void;
            protected OnPageChanged(e: bind.EventArgs<T, this>): void;
            static DPSelectedPage: bind.DProperty<defs.$UI.IPage, Layout<any>>;
            static DPCurrentModal: bind.DProperty<defs.$UI.IModal, Layout<any>>;
            CurrentModal: defs.$UI.IModal;
            SelectedPage: T;
            static __fields__(): (bind.DProperty<defs.$UI.IPage, Layout<any>> | bind.DProperty<defs.$UI.IModal, Layout<any>>)[];
            Name: string;
            Foot: ServiceNavBar<IItem>;
            SearchBox: IActionText;
            Pages: collection.List<T>;
            protected abstract showPage(page: T): any;
            protected Check(child: T): boolean;
            Logout(): void;
            constructor(view: any);
            protected silentSelectPage(oldPage: T, page: T): void;
            Open(page: T): void;
            private PagesChanged;
            OpenPage(pageNme: string): boolean;
            AddPage(child: T): void;
            SelectNaxtPage(): void;
            SelectPrevPage(): void;
            private opcd;
            Update(): void;
            OnKeyDown(e: KeyboardEvent): void;
            OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget): any;
            OnPrint(): any;
            OnDeepSearche(): void;
            OnContextMenu(e: MouseEvent): void;
            handleEvent(e: KeyboardEvent): void;
            Show(): void;
            initialize(): void;
            protected static getView(): HTMLElement;
            protected searchActioned(s: IActionText, o: string, n: string): void;
            OnAttached(): void;
            OnDetached(): void;
            OpenModal(m: defs.$UI.IModal): void;
            CloseModal(m: defs.$UI.IModal): void;
            _onCurrentModalChanged(e: bind.EventArgs<defs.$UI.IModal, Layout<any>>): any;
            private openedModal;
            private zIndex;
            OpenContextMenu<T>(cm: IContextMenu<T>, e: IContextMenuEventArgs<T>): boolean;
            CloseContextMenu<T>(r?: T): boolean;
            private _contextMenuLayer;
            private _currentContextMenu;
            private _currentContextMenuEventArgs;
            private _contextMenuZIndex;
        }
        function CurrentDesktop(): Desktop;
        function CurrentApp(): defs.$UI.IApp;
    }
    export module UI {
        interface ITemplateShadow {
            setDataContext(data: any): any;
            getDataContext(): any;
        }
        abstract class TemplateShadow extends JControl implements ITemplateShadow {
            abstract setDataContext(data: any): any;
            abstract getDataContext(): any;
            static Create(item: any): ScopicTemplateShadow;
            abstract getScop(): bind.Scop;
            abstract readonly Controller: Controller;
        }
        class ScopicTemplateShadow extends TemplateShadow {
            private scop?;
            readonly Controller: Controller;
            private cnt;
            setDataContext(data: any): void;
            getDataContext(): any;
            constructor(dom: HTMLElement, scop?: bind.Scop, cnt?: UI.JControl);
            initialize(): void;
            Check(c: JControl): boolean;
            readonly Scop: bind.Scop;
            getScop(): bind.Scop;
            Dispose(): void;
        }
        class EScopicTemplateShadow {
            private control;
            private scop?;
            readonly Controller: Controller;
            private cnt;
            setDataContext(data: any): void;
            getDataContext(): any;
            constructor(control: JControl, scop?: bind.Scop);
            initialize(): void;
            Check(c: JControl): boolean;
            readonly Scop: bind.Scop;
            getScop(): bind.Scop;
        }
        interface ITemplate {
            CreateShadow<T>(data: T | bind.Scop, cnt: UI.JControl): TemplateShadow;
        }
        abstract class Template implements ITemplate {
            abstract CreateShadow<T>(data?: T | bind.Scop, cnt?: UI.JControl): TemplateShadow;
            static ToTemplate(itemTemplate: conv2template, asTemplate: boolean): Template;
        }
        class HtmlTemplate implements Template {
            dom: HTMLElement;
            private asTemplate;
            constructor(dom: HTMLElement, asTemplate?: boolean);
            CreateShadow<T>(data?: T | bind.Scop, cnt?: UI.JControl): TemplateShadow;
        }
        class ScopicTemplate implements Template {
            private template;
            CreateShadow<T>(data?: T | bind.Scop, cnt?: UI.JControl): TemplateShadow;
            constructor(templatePath: string | mvc.ITemplate);
        }
        class TControl<T> extends JControl {
            private data;
            static DPData: bind.DProperty<any, TControl<any>>;
            Data: T;
            static Me: any;
            constructor(itemTemplate: mvc.ITemplate | string | Function | Template | HTMLElement, data: T | bind.Scop);
            protected OnFullInitialized(): void;
            private _onTemplateCompiled;
            protected OnCompileEnd(cnt: Controller): void;
            private Shadow;
            getScop(): bind.Scop;
            private _template;
            initialize(): void;
            _onCompiled: bind.EventListener<(s: this, cnt: Controller) => void>;
            private compiled;
            OnCompiled: (s: this) => void;
            readonly IsCompiled: boolean;
            OnDataChanged(e: bind.EventArgs<T, this>): void;
        }
        interface ListAdapterEventArgs<T, P> {
            sender: ListAdapter<T, P>;
            index: number;
            template: TemplateShadow;
            oldIndex?: number;
            oldTemplate?: TemplateShadow;
            Cancel?: boolean;
            Event?: Event;
        }
        class ListAdapter<T, P> extends TControl<P> {
            instantanyInitializeParent(): boolean;
            private garbage;
            static __fields__(): bind.DProperty<any, ListAdapter<any, any>>[];
            static DPSource: bind.DProperty<collection.List<any>, ListAdapter<any, any>>;
            Source: collection.List<T>;
            static DPSelectedIndex: bind.DProperty<number, ListAdapter<any, any>>;
            private __checkSelectedIndex;
            AcceptNullValue: boolean;
            private swap;
            SelectedIndex: number;
            static DPItemStyle: bind.DProperty<string[], ListAdapter<any, any>>;
            ItemStyle: string[];
            static DPTemplate: bind.DProperty<ITemplate, ListAdapter<any, any>>;
            Template: ITemplate;
            OnItemSelected: bind.EventListener<(s: ListAdapter<T, P>, index: number, template: TemplateShadow, oldIndex?: number, oldTemplate?: TemplateShadow) => void>;
            OnItemInserted: bind.EventListener<(s: ListAdapter<T, P>, index: number, data: T, template: TemplateShadow) => void>;
            OnItemRemoved: bind.EventListener<(s: ListAdapter<T, P>, index: number, data: T, template: TemplateShadow) => void>;
            OnChildClicked: bind.EventListener<(e: ListAdapterEventArgs<T, P>) => void>;
            static DPSelectedItem: bind.DProperty<any, ListAdapter<any, any>>;
            private _content;
            readonly Content: Control<TemplateShadow>;
            _selectedItem: TemplateShadow;
            readonly SelectedChild: TemplateShadow;
            SelectedItem: T;
            activateClass: string;
            private OnSelectedIndexChanged;
            private riseItemSelectedEvent;
            Select(t: TemplateShadow): void;
            SelectItem(t: T): void;
            static _getTemplate(template: mvc.ITemplate | string | Function): mvc.ITemplate;
            static _getTemplateShadow(template: mvc.ITemplate | string | Function | HTMLElement): HTMLElement;
            static ctor(): void;
            constructor(template: conv2template, itemTemplate?: conv2template, data?: P | bind.Scop, getSourceFromScop?: boolean);
            private params;
            private initTemplate;
            private static getFirstChild;
            private static getTemplate;
            private sli;
            private getSourceFromScop;
            private CmdExecuter;
            private AttachSelectedItem;
            private CmdAttacheSelectedItemExecuter;
            private RlSourceScop;
            initialize(): void;
            private OnSourceChanged;
            private ReSelect;
            private _scop;
            private readonly Scop;
            BindTo(scop: bind.Scop): void;
            private OnScopValueChanged;
            OnItemClicked(s: TemplateShadow, e: Event, t: ListAdapter<any, any>): void;
            protected getItemShadow(item: T, i: number): TemplateShadow;
            protected disposeItemShadow(item: T, child: TemplateShadow, i: number): TemplateShadow;
            protected disposeItemsShadow(items: T[], child: TemplateShadow[]): void;
            private _insert;
            private _remove;
            private count;
            private OnAdd;
            private OnSet;
            private OnClear;
            private OnRemove;
            private OnReplace;
            private Reset;
            protected clearGarbage(): void;
            private Recycle;
            Dispose(): void;
            Add(child: JControl): this;
            AddRange(children: JControl[]): this;
            Remove(child: JControl, dispose: boolean): boolean;
            RemoveAt(i: number, dispose: boolean): boolean;
            Clear(dispose?: boolean): void;
            Insert(c: JControl, i: number): this;
            CloneChildren(): void;
            Check(c: JControl): boolean;
            OnKeyDown(e: KeyboardEvent): boolean;
        }
        class Spinner extends JControl {
            private container;
            private circle;
            private message;
            constructor(test: any);
            initialize(): void;
            private isStarted;
            Start(logo: string): void;
            Pause(): void;
            Message: string;
            static Default: Spinner;
        }
        class CostumizedShadow extends TemplateShadow {
            private data?;
            Controller: any;
            setDataContext(data: any): void;
            getDataContext(): any;
            constructor(dom: HTMLOptionElement, data?: any);
            initialize(): void;
            getScop(): bind.Scop;
        }
        module help {
            function createHeader<Owner>(hd: HTMLTableRowElement, cols: IColumnTableDef[], orderBy?: basic.ITBindable<(sender: Owner, orderBy: string, col: IColumnCellHeaderDef, view: HTMLTableHeaderCellElement) => void>): HTMLTableRowElement;
            function createTemplate(cols: IColumnTableDef[], tmp?: HTMLTableRowElement): HTMLTableRowElement;
            function generateCell<T extends HTMLTableHeaderCellElement | HTMLTableDataCellElement>(h: IColumnCellDef<T>, stype: 'th' | 'td'): T;
            interface IAttribute {
                values: string[];
                spliter: string;
            }
            interface IColumnCellDef<T extends HTMLTableHeaderCellElement | HTMLTableDataCellElement> {
                Attributes?: {
                    [s: string]: IAttribute | string;
                };
                TdAttributes?: {
                    [s: string]: IAttribute | string;
                };
                Content?: string | T | Node;
                ContentAsHtml?: boolean;
            }
            interface IColumnCellHeaderDef extends IColumnCellDef<HTMLTableHeaderCellElement> {
                OrderBy?: string;
            }
            interface IColumnCellDataDef extends IColumnCellDef<HTMLTableDataCellElement> {
            }
            interface IColumnTableDef {
                Header: IColumnCellHeaderDef | string;
                Cell: IColumnCellDataDef;
                editable?: boolean;
            }
        }
    }
    export module UI {
        function Init(acb: defs.$UI.IAutoCompleteBox<any>): void;
        type AutoCompleteCallback<T> = (box: defs.$UI.IAutoCompleteBox<T>, oldValue: T, newValue: T) => void;
        class ProxyAutoCompleteBox<T> implements defs.$UI.IAutoCompleteBox<T> {
            Box: Input;
            Template: ITemplate;
            PrintSelection?: boolean;
            Blur(): void;
            AutoPopup: boolean;
            private callback;
            private _value;
            DataSource: collection.List<any>;
            OnValueChanged(owner: any, invoke: AutoCompleteCallback<T>): void;
            readonly View: HTMLElement;
            Value: T;
            IsChanged: boolean;
            constructor(Box: Input, source: collection.List<T>);
            initialize(): this;
        }
    }
}
declare module "sys/Corelib" {
    import { UI } from "sys/UI";
    import { Parser } from "sys/Syntaxer";
    import { reflection } from "sys/runtime";
    import { Controller } from "sys/Dom";
    import { basic } from "sys/utils";
    import { encoding } from "sys/Encoding";
    export namespace bind {
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
    export namespace bind {
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
    export namespace bind {
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
    export namespace bind {
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
            protected _setPrivateValue(v: any, keepEvent?: boolean): void | EventArgs<any, this>;
            protected privateValue: any;
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
    export namespace ScopicControl {
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
    export namespace ScopicCommand {
        function Register<T>(callback: basic.ITBindable<(n: string, dom: HTMLElement, scop: bind.Scop, param: T) => void>, param?: T, name?: string): string;
        function Call(n: string, dom: Node, scop: bind.Scop): any;
        function Delete(n: string): void;
        function contains(n: string): boolean;
    }
    export namespace Api {
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
    export namespace injecter {
        function observe(obj: any, prop: string, callback: (s: bind.PropBinding, e: bind.EventArgs<any, any>) => void, owner?: any): bind.PropBinding;
        function observePath(obj: any, props: string[], callback: (s: bind.PropBinding, e: bind.EventArgs<any, any>) => void, owner?: any): void;
        function unobserve(obj: any, prop: string, stat: bind.PropBinding | ((s: bind.PropBinding, e: bind.EventArgs<any, any>) => void), owner?: any): boolean | bind.PropBinding[];
    }
    export namespace Notification {
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
    export namespace bind {
        class Path implements encoding.IPath<any | bind.DObject, string | bind.DProperty<any, any>> {
            Owner: any | bind.DObject;
            Property: string | bind.DProperty<any, any>;
            executed: boolean;
            Set(value: any): any;
            constructor(Owner: any | bind.DObject, Property: string | bind.DProperty<any, any>);
        }
    }
}
declare module "sys/defs" {
    import { bind } from "sys/Corelib";
    import { collection } from "sys/collections";
    import { UI } from "sys/UI";
    import { basic } from "sys/utils";
    export module defs {
        namespace $UI {
            interface IPage extends UI.JControl, UI.IService {
                Name: string;
                HasSearch: UI.SearchActionMode;
                OnSearche(o?: string, n?: string): any;
                OnDeepSearche(): any;
                OnContextMenu(e: MouseEvent): any;
                OnPrint(): any;
                OnSelected: bind.EventListener<(p: this) => void>;
                Update(): any;
                OnKeyDown(e: KeyboardEvent): any;
                ContextMenu?: IContextMenu<IItem>;
            }
            interface IApp extends UI.JControl {
                Name: string;
                SearchBox: IActionText;
                Foot: UI.ServiceNavBar<IItem>;
                Update(): any;
                OnContextMenu(e: MouseEvent): any;
                OnKeyDown(e: KeyboardEvent): any | void;
                OnPrint(): any;
                OnDeepSearche(): any;
                OpenPage(pageNme: string): any;
                Logout(): any;
                Open(page: IPage): any;
                AddPage(child: IPage): any;
                Show(): any;
                SelectedPage: IPage;
                SelectNaxtPage(): any;
                SelectPrevPage(): any;
                CloseModal(m: IModal): any;
                OpenModal(m: IModal): any;
                CurrentModal: IModal;
                IsAuthentication: boolean;
                OpenContextMenu<T>(cm: UI.IContextMenu<T>, e: UI.IContextMenuEventArgs<T>): boolean;
                CloseContextMenu<T>(r?: T): any;
                OnAttached(): any;
                OnDetached(): any;
            }
            interface IAuthApp extends IApp {
                IsLogged<T>(callback: (v: boolean, param: T) => void, param: T): any;
                RedirectApp: IApp;
                OnStatStatChanged: bind.EventListener<(auth: this, isLogged: boolean) => void>;
            }
        }
        interface IActionText extends UI.JControl {
        }
        interface IItem {
            Tag: any;
            Content: string | HTMLElement | UI.JControl;
            Url: string;
            OnItemSelected(menuItem: IMenuItem): any;
        }
        interface IMenuItem extends UI.JControl, EventListenerObject, basic.IDisposable {
            Source: IItem;
            Dispose(): any;
            OnClick: (page: IItem, sender: IMenuItem) => void;
            Text: string;
            Href: string;
        }
        interface IContextMenu<IItem extends defs.IItem> extends UI.JControl {
            Items: collection.List<IItem>;
            AddItems(items?: (IItem | string)[]): any;
            OnMenuItemSelected: bind.EventListener<(s: this, i: IMenuItem) => void>;
            Show(x: any, y: any): any;
            handleEvent(e: MouseEvent): any;
            Target: UI.JControl;
        }
        interface INavbar<T extends IItem> extends UI.JControl {
            selectable: boolean;
            SelectedItem: IMenuItem;
            Float(v: UI.HorizontalAlignement): any;
            Items: collection.List<T>;
            OnSelectedItem: bind.EventListener<(item: T) => void>;
            NavType: 'navbar';
        }
    }
    export namespace defs.$UI {
        interface IAutoCompleteBox<T> {
            Box: UI.Input;
            DataSource: collection.List<T>;
            View: HTMLElement;
            IsChanged: boolean;
            Value: T;
            PrintSelection?: boolean;
            AutoPopup: boolean;
            Blur(): any;
            Template: UI.ITemplate;
        }
        interface IModal extends UI.JControl {
            Content: UI.JControl;
            focuser: basic.focuser;
            onSearch: (modal: this, s: IAutoCompleteBox<any>, oldValue: any, newValue: any) => void;
            OnSearch(i: (modal: this, s: IAutoCompleteBox<any>, oldValue: any, newValue: any) => void): void;
            OkTitle(v: string): this;
            AbortTitle(v: string): this;
            Canceltitle(v: string): this;
            Title(v: string): this;
            Search(d: collection.List<any>): void;
            SetDialog(title: string, content: UI.JControl): void;
            readonly IsOpen: boolean;
            Open(): void;
            targetApp: defs.$UI.IApp;
            silentClose(): void;
            Close(msg: UI.MessageResult): void;
            SetVisible(role: UI.MessageResult, visible: boolean): void;
            Dispose(): void;
            readonly OnClosed: bind.EventListener<(e: UI.MessageEventArgs) => void>;
            Clear(): void;
            setWidth(value: string): this;
            setHeight(value: string): this;
            IsMaterial: boolean;
            OnContextMenu(e: any): any;
        }
    }
    export namespace defs {
        interface ModalApi {
            New(...args: any[]): defs.$UI.IModal;
            ShowDialog(title: string, msg: string | HTMLElement | UI.JControl, callback?: (e: UI.MessageEventArgs) => void, ok?: string, cancel?: string, abort?: string): defs.$UI.IModal;
            NextZIndex(): number;
        }
    }
}
declare module "sys/net" {
    import { bind } from "sys/Corelib";
    import { basic } from "sys/utils";
    export namespace net {
        class Header {
            private _key;
            readonly key: string;
            private _value;
            readonly value: string;
            constructor(key: any, value: any);
        }
        enum ResponseType {
            json = 0,
            document = 1,
            text = 2,
            arraybuffer = 3,
            blob = 4
        }
        enum WebRequestMethod {
            Get = 0,
            Post = 1,
            Head = 2,
            Put = 3,
            Delete = 4,
            Options = 5,
            Connect = 6,
            Create = 7,
            Open = 8,
            Close = 9,
            Validate = 10,
            FastValidate = 11,
            Print = 12,
            UPDATE = 13,
            SUPDATE = 14,
            Set = 15
        }
        class WebRequest implements basic.IDisposable {
            crypt?: basic.ICrypto;
            Uid: string;
            Pwd: string;
            private http;
            private _responseType;
            getResponseType(): ResponseType;
            setResponseType(v: ResponseType): ResponseType;
            Crypto: basic.ICrypto;
            private key;
            private downloadDelegate;
            constructor(crypt?: basic.ICrypto);
            Dispose(): void;
            private _onprogress;
            readonly IsSuccess: boolean;
            Download(req: IRequestUrl, data: any): void;
            Download2(c: Request): void;
            private getUrlOf;
            private getDataOf;
            GetFileSize(url: any, callback: any): void;
            RequestHeader(url: any, callback: any): void;
            OnComplete: bind.EventListener<(e: WebRequest) => void>;
            readonly Response: string;
            GetHeader(name: string): string;
            GetHeaders(): string;
        }
        abstract class RequestParams<T, S> {
            protected callback: (sender: S, result: any) => void;
            data: T;
            isPrivate?: boolean;
            IsSuccess: boolean;
            constructor(callback: (sender: S, result: any) => void, data: T, isPrivate?: boolean);
            Callback(sender: S, result: any): void;
            abstract OutputData(): string;
            InputData: string;
        }
        interface RequestMethodShema {
            Method: WebRequestMethod;
            Name: string;
            SendData: boolean;
            ParamsFormat?: basic.StringCompile;
        }
        interface IRequestParams {
            [name: string]: string | number | boolean;
        }
        class Request {
            url: IRequestUrl;
            data: RequestParams<any, QueeDownloader>;
            params: IRequestParams;
            fail: boolean;
            constructor(url: IRequestUrl, data: RequestParams<any, QueeDownloader>, params: IRequestParams);
        }
        class QueeDownloader {
            crypt: basic.ICrypto;
            private webr;
            Uid: string;
            Pwd: string;
            readonly Request: net.WebRequest;
            private quee;
            private isRunning;
            private isDownloading;
            Crypto: basic.ICrypto;
            constructor(crypt: basic.ICrypto);
            current: Request;
            private OnError;
            private DownloadComplete;
            Push(url: IRequestUrl, data: RequestParams<any, QueeDownloader>, params: IRequestParams): void;
            Insert(dcall: Request): void;
            Start(): void;
            Next(): void;
            Restart(): void;
            OnSuccess: bind.EventListener<any>;
            OnFail: bind.EventListener<any>;
            OnFinish: bind.EventListener<any>;
        }
    }
    export namespace net {
        interface IRequestHeader {
            [key: string]: string;
        }
        interface IRequestUrl {
            beforRequest?: (req: net.IRequestUrl) => void;
            Url: string;
            Method?: net.WebRequestMethod;
            Header?: IRequestHeader;
            HasBody?: boolean;
            timeout?: number;
            ResponseType?: ResponseType;
        }
        class RequestUrl implements IRequestUrl {
            private _url;
            private context;
            Header?: IRequestHeader;
            Method?: net.WebRequestMethod;
            HasBody?: boolean;
            ResponseType?: ResponseType;
            beforRequest: (req: net.IRequestUrl) => void;
            timeout?: number;
            Url: string;
            constructor(_url: string, context: basic.IContext, Header?: IRequestHeader, Method?: net.WebRequestMethod, HasBody?: boolean, ResponseType?: ResponseType);
        }
        function New(): number;
    }
    export class GuidManager {
        vars: any;
        static readonly current: number;
        constructor(vars: any);
        static readonly isValid: boolean;
        static readonly Next: number;
        static New<T>(callback: (id: number, param: T) => void, pram: T): void;
        static t: net.WebRequest;
        static isLoading: boolean;
        static update<T>(callback?: (id: number, param: T) => void, pram?: T): void;
    }
    export function setGuidRange(start: number, end: number): void;
}
declare module "sys/System" {
    import { bind } from "sys/Corelib";
    import { reflection } from "sys/runtime";
    import { serialization, encoding } from "sys/Encoding";
    import { net } from "sys/net";
    import { basic } from "sys/utils";
    import { collection } from "sys/collections";
    export module Controller {
        type RequestMethodShema = net.RequestMethodShema;
        function Register(service: IService): void;
        function decorator<C>(ClassDefinition: C): C;
        abstract class Api<T> {
            abstract GetType(): any;
            abstract GetRequest(data: T, shema: RequestMethodShema | string | net.WebRequestMethod, params: net.IRequestParams): net.RequestUrl;
            abstract OnResponse(response: JSON, data: T, context: encoding.SerializationContext): any;
            constructor(reg?: boolean);
            Register(method: RequestMethodShema): void;
            ERegister(method: net.WebRequestMethod, name: string, paramsFormat: string, sendData: boolean): void;
            GetMethodShema(m: net.WebRequestMethod | string | net.RequestMethodShema): net.RequestMethodShema;
            private _methodsShema;
        }
        class CostumeApi<T> extends Api<T> {
            private _type;
            private _getRequest;
            private _onResponse;
            GetType(): Function;
            GetRequest(data: T): net.RequestUrl;
            OnResponse(response: JSON, data: T): void;
            constructor(_type: Function, _getRequest: (data: T) => net.RequestUrl, _onResponse: (response: JSON, data: T) => void);
        }
        interface IService {
            Name: string;
            OnResponse(proxy: ProxyCallback<any>, webr: net.QueeDownloader, json: IServiceResponse): any;
        }
        interface IServiceResponse {
            __service__: string;
            dropRequest: boolean;
            iss: boolean;
            rdata: any;
            sdata: any;
        }
        class ProxyCallback<T> extends net.RequestParams<T, net.QueeDownloader> {
            param: any;
            api: Api<T>;
            context?: encoding.SerializationContext;
            callBack?: (s: ProxyCallback<T>, result: T, success: boolean, req?: net.WebRequest) => void;
            method?: net.WebRequestMethod;
            constructor(data: T, param: any, api: Api<T>, context?: encoding.SerializationContext, callBack?: (s: ProxyCallback<T>, result: T, success: boolean, req?: net.WebRequest) => void, method?: net.WebRequestMethod);
            private static parse;
            Callback(sender: net.QueeDownloader, result: net.WebRequest): void;
            OutputData(): string;
        }
        class ProxyData {
            private http;
            private quee;
            private apis;
            SetAuth(uid: string, pwd: string): void;
            Crypto: basic.ICrypto;
            constructor(crpt: basic.ICrypto, isCostume: boolean);
            Register<T>(api: Api<any>): void;
            private static getMethod;
            Costume<T>(url: net.IRequestUrl, data: T, parms: net.IRequestParams, callback: (s: ProxyCallback<T>, result: T, success: boolean, req?: net.WebRequest) => void, objectStat: any): void;
            Request<T>(type: Function | reflection.GenericType, method: string | net.RequestMethodShema | net.WebRequestMethod, data?: T, params?: net.IRequestParams, callback?: RequestCallback<T>, costumize?: RequestCostumize<T>, beforRequest?: (req: net.IRequestUrl) => void, objectStat?: any): void;
            Push<T>(type: Function | reflection.GenericType, data: T, param: any, callBack?: RequestCallback<T>, method?: net.WebRequestMethod, costumize?: RequestCostumize<T>, serializer?: encoding.SerializationContext, beforRequest?: (req: net.IRequestUrl) => void, params?: net.IRequestParams): void;
            Post<T>(type: Function | reflection.GenericType, data: T, param: any, callBack?: RequestCallback<T>, costumize?: RequestCostumize<T>, serializer?: encoding.SerializationContext, params?: net.IRequestParams): void;
            Put<T>(type: Function | reflection.GenericType, data: T, param: any, callBack?: RequestCallback<T>, costumize?: RequestCostumize<T>, serializer?: encoding.SerializationContext, params?: net.IRequestParams): void;
            Get<T>(type: Function | reflection.GenericType, data: T, param: any, callBack?: RequestCallback<T>, costumize?: RequestCostumize<T>, serializer?: encoding.SerializationContext, params?: net.IRequestParams): void;
            Delete<T>(type: Function | reflection.GenericType, data: T, param: any, callBack?: RequestCallback<T>, costumize?: RequestCostumize<T>, serializer?: encoding.SerializationContext, params?: net.IRequestParams): net.RequestUrl;
            static readonly Default: ProxyData;
        }
        type RequestCallback<T> = (_s: ProxyCallback<T>, r: JSON, issuccess: boolean, result?: net.WebRequest) => void;
        type RequestCostumize<T> = (_req: net.IRequestUrl, t: ProxyCallback<any>) => void;
    }
    export module sdata {
        enum DataStat {
            IsNew = 0,
            Modified = 1,
            Saved = 2,
            Updating = 4,
            Uploading = 8,
            Updated = 16,
            Frozed = 32
        }
        interface INew {
            CreateNew(id: number): DataRow;
            getById(id: number): DataRow;
        }
        abstract class DataRow extends bind.DObject implements basic.IId {
            static DPId: bind.DProperty<number, DataRow>;
            protected static DPStat: bind.DProperty<DataStat, DataRow>;
            Stat: sdata.DataStat;
            static DPLastModified: bind.DProperty<Date, DataRow>;
            LastModified: Date;
            static CreateFromJson(json: any, type: typeof DataRow, requireNew: boolean): any;
            protected OnIdChanged(old: number, nw: number): void;
            protected abstract getStore(): collection.Dictionary<number, this>;
            Id: number;
            constructor(id: number);
            static __fields__(): Array<any>;
            static getById(id: number, type: Function): DataRow;
            FromJson(json: any, context: encoding.SerializationContext, update?: boolean): this;
            readonly TableName: string;
            abstract Update(): any;
            abstract Upload(): any;
        }
        abstract class QShopRow extends sdata.DataRow {
            static __fields__(): any[];
            GenType(): Function;
            private static _QueryApi;
            static readonly QueryApi: string;
            constructor(id?: number);
            Update(): void;
            Upload(): void;
        }
        abstract class DataTable<T extends DataRow> extends collection.List<T> {
            private _parent;
            private ctor;
            private static DPOwner;
            static DPStat: bind.DProperty<DataStat, DataTable<any>>;
            Stat: DataStat;
            static __fields__(): bind.DProperty<DataRow, DataTable<any>>[];
            Owner: DataRow;
            constructor(_parent: DataRow, argType: Function, ctor: (id: number) => T, array?: T[]);
            CreateNewItem(id: number): T;
            FromJson(json: any, x: encoding.SerializationContext, update?: boolean, callback?: (prop: string, val: any) => Object): this;
            GetById(id: number): T;
            Update(): void;
            Upload(): void;
            Add(item: T): this;
            FromCsv(input: string, context?: encoding.SerializationContext, parser?: serialization.fillArgs): void;
        }
        type bindCallback = (e: bind.EventArgs<any, any>) => void;
        interface Property {
            jname?: string;
            sname?: string;
            type: Function | reflection.DelayedType | reflection.GenericType;
            default?: any;
            onchange?: bindCallback;
            check?: bindCallback;
            get: () => any;
            set: (v: any) => any;
        }
        interface Properties {
            [name: string]: Property | Function;
        }
        interface Model {
            namespace: string;
            class: string;
            super: string | Model;
            properties: Properties;
            prototype: any;
            init(): any;
            ctor(): any;
            cctor(): any;
            onPropertyChanged(e: bindCallback): any;
        }
    }
    export module base {
        interface Vecteur<T> extends bind.DObject {
            From: T;
            To: T;
            Check(val: T): any;
        }
        class DateVecteur extends bind.DObject implements Vecteur<Date> {
            static DPFrom: bind.DProperty<Date, DateVecteur>;
            static DPTo: bind.DProperty<Date, DateVecteur>;
            From: Date;
            To: Date;
            static __fields__(): bind.DProperty<Date, DateVecteur>[];
            Check(date: Date): boolean;
        }
        class NumberVecteur extends bind.DObject implements Vecteur<number> {
            static DPFrom: bind.DProperty<number, NumberVecteur>;
            static DPTo: bind.DProperty<number, NumberVecteur>;
            From: number;
            To: number;
            static __fields__(): bind.DProperty<number, NumberVecteur>[];
            Check(val: number): boolean;
        }
    }
}
declare module "sys/QModel" {
    import { sdata, Controller } from "sys/System";
    import { collection } from "sys/collections";
    import { net } from "sys/net";
    export namespace models {
        enum MessageType {
            Info = 0,
            Error = 1,
            Command = 2,
            Confirm = 3
        }
        class CallBackMessage {
            ProxyCallback: Controller.ProxyCallback<any>;
            Request: net.Request;
            QueeDownloader: net.QueeDownloader;
        }
        class Message extends sdata.QShopRow {
            static DPContent: any;
            static DPTitle: any;
            static DPOkText: any;
            static DPCancelText: any;
            static DPAction: any;
            static DPType: any;
            static DPData: any;
            Data: string;
            Content: string;
            Title: string;
            OKText: string;
            Callback: CallBackMessage;
            Type: MessageType;
            Action: string;
            static DPAbortText: any;
            AbortText: string;
            CancelText: string;
            privateDecompress: boolean;
            constructor(id: number, message?: string);
            static getById(id: number, type: Function): Message;
            getStore(): collection.Dictionary<number, any>;
            private static pstore;
        }
    }
}
declare module "sys/db" {
    import { bind } from "sys/Corelib";
    import { collection } from "sys/collections";
    import { sdata } from "sys/System";
    import { basic } from "sys/utils";
    export module db {
        type callback<T> = (iss: boolean, sender: Database, sqlTrans: any, result?: SQLResultSet<T>) => void;
        interface IExecCmd {
            cmd: string;
            callback: (iss: boolean, sender: Database, sqlTrans: any, result?: any) => void;
        }
        interface IDatabase {
            transaction(callback: (db: any) => void, onerror: (db: any, b: any) => void): any;
        }
        interface Command {
            async: boolean;
            result?: any;
            executed?: boolean;
        }
        interface ScalCommand extends Command {
            cmd: string;
            callback?: (iss: boolean, sender: Database, sqlTrans: any, result?: SQLResultSet<any>) => void;
        }
        interface VectorCommand extends Command {
            cmd: string[];
            callback?: (index: number, iss: boolean, sender: Database, sqlTrans: any, result?: SQLResultSet<any>) => void;
        }
        class Database {
            databaseName: string;
            databaseDesc: string;
            sqlLiteDBVersion: string;
            FIVE_MB: number;
            tableName: string;
            database: IDatabase;
            private _tables__;
            shemas: DatabaseTable<_Table__>;
            initialize(): this;
            IsLoaded: boolean;
            OnLoad: bind.FEventListener<(sb: this) => void>;
            private isExecuting;
            private queue;
            Push(cmd: ScalCommand | VectorCommand): void;
            execute(async: boolean, command: string, callback?: (iss: boolean, sender: this, sqlTrans: any, result?: SQLResultSet<any>) => void): void;
            _exeScalSQL(db: any, cmd: ScalCommand): void;
            _exeVectorSQL(db: any, cmd: VectorCommand): void;
            executes(async: boolean, commands: string[], callback?: (index: number, iss: boolean, sender: this, sqlTrans: any, result?: SQLResultSet<any>) => void): void;
            syncExecute(command: any, callback?: (iss: boolean, sender: this, sqlTrans: any, result?: any) => void): void;
            private _commands;
            private _current;
            private _IsExecuting;
            private _Push;
            private _job;
            private _runCmd;
            private _transaction;
            private _OnSuccess;
            private _OnError;
            private _next;
            CreateTable(name: string, rowType: Function): this;
            Get(tableName: string): IDBTableInfo;
            private _store;
            MakeUpdate(tableName: string, date: Date | number): void;
            __info__: DatabaseTable<__ExeInfo__>;
        }
        class SQLInstructureBuilder {
            tableName: any;
            type: Function;
            private _key;
            private _map;
            cretaeCmd: basic.StringCompile;
            insertCmd: basic.StringCompile;
            updateCmd: basic.StringCompile;
            selectCmd: basic.StringCompile;
            deleteCmd: basic.StringCompile;
            readonly Key: bind.DProperty<any, bind.DObject>;
            constructor(tableName: any, type: Function);
            init(): void;
            private getSB;
            getCreateCmd(): basic.StringCompile;
            getInsertCmd(): basic.StringCompile;
            getUpdateCmd(): basic.StringCompile;
            getSelectCmd(): basic.StringCompile;
            getDeleteCmd(): basic.StringCompile;
            private getTypeName;
            private getDbValue;
            getNumber(v: any): string;
            static emptyDate: Date;
            private static parseBool;
            private getJsValue;
            getAvaibleCmd(extCols: string | string[]): string;
            jointCols(cols: string[]): string;
        }
        class DatabaseTable<T extends sdata.DataRow> {
            database: Database;
            builder: SQLInstructureBuilder;
            constructor(database: Database, tableName: string, type: Function);
            Insert(row: T, callback: (iss: boolean, sender: Database, sqlTrans: any, result: any) => void): void;
            Delete(row: T, callback: (iss: boolean, sender: Database, sqlTrans: any, result: any) => void): void;
            Update(row: T, callback: (iss: boolean, sender: Database, sqlTrans: any, result: any) => void): void;
            Select(row: T, callback: (iss: boolean, sender: Database, sqlTrans: any, result: any) => void): void;
            Create(callback: (iss: boolean, sender: Database, sqlTrans: any, result: any) => void): void;
            ExecuteOperation(cm: IOperation, callback?: db.callback<T>): void;
            getAvaible(exCols?: string | string[], callback?: (iss: boolean, sender: Database, sqlTrans: any, result?: any) => void): void;
            ExecuteOperations(ops: IOperation[], callback: (succ: boolean, nfail: number) => void): void;
            static __count: number;
            ExecuteOperations1(ops: IOperation[], callback: (succ: boolean, nfail: number) => void): void;
            UpdateTableToDB(tbl: sdata.DataTable<T> | T[], callback: (succ: boolean, nfail: number) => void, full?: boolean): void;
            LoadTableFromDB(tbl: sdata.DataTable<T>, callback?: (succ: boolean) => void): void;
            getCmd(op: IOperation): string;
            MakeUpdate(date: Date | number): void;
            IsExist(callback: (isExist: boolean) => void): void;
            CreateIfNotExist(callback?: (isExist: boolean, sender: this) => void): void;
            Created: boolean;
        }
        class _Table__ extends sdata.QShopRow {
            table: DatabaseTable<any>;
            private static store;
            protected getStore(): collection.Dictionary<number, this>;
            static DPTableName: bind.DProperty<string, _Table__>;
            TableName: string;
            static DPType: bind.DProperty<string, _Table__>;
            Type: string;
            static DPLastUpdate: bind.DProperty<number, _Table__>;
            LastUpdate: number;
            static __fields__(): (bind.DProperty<string, _Table__> | bind.DProperty<number, _Table__>)[];
            onPropertyChanged(ev: bind.EventArgs<any, any>): void;
            constructor(table: DatabaseTable<any>);
        }
        class _Tables__ extends sdata.DataTable<_Table__> {
            database: Database;
            constructor(database: Database);
            gettableByName(name: string, type?: Function): _Table__;
        }
        class __ExeInfo__ extends sdata.DataRow {
            static DPCount: bind.DProperty<number, __ExeInfo__>;
            Count: number;
            static __fields__(): bind.DProperty<number, __ExeInfo__>[];
            protected getStore(): collection.Dictionary<number, this>;
            Update(): void;
            Upload(): void;
        }
        interface IDBTableInfo {
            table: db.DatabaseTable<any>;
            info: _Table__;
            _dbInfo_: db.DatabaseTable<_Table__>;
        }
        interface IOperation {
            op: Operation;
            row: sdata.DataRow;
        }
        enum Operation {
            None = 0,
            Update = 1,
            Insert = 2,
            Delete = 3,
            UpdateOnly = 4,
            InsertOnly = 5
        }
        interface SQLResultSet<T> {
            rows: T[];
            rowsAffected: number;
            insertId: number;
        }
    }
}
declare module "sys/help" {
    import { Parser } from "sys/Syntaxer";
    import { bind } from "sys/Corelib";
    import { basic } from "sys/utils";
    export namespace string {
        function IsPrintable(keyCode: number, charCode: number): boolean;
    }
    export module code {
        class CodeCompiler {
            private script;
            constructor();
            private toRegString;
            private static params;
            generateFn(stack: (string | Parser.ICode)[], hasNoReturn?: boolean): IReg;
            private _push;
            push(code: string | string[]): any[] | IReg;
            Compile(): void;
            reset(): void;
            private _onload;
            private _onerror;
            private OnFnSuccess;
            onFnLoad: (fn: Function, t: IReg) => void;
            onload: (t: this) => void;
            onerror: (t: this) => void;
            remove(t: IReg): void;
        }
        class EvalCode {
            static Compile(code: string, callback?: Function, onerror?: Function, stat?: any): void;
            static CompileExpression(expression: string, params: string[], callback?: (exprFn: Function, stat: any) => void, stat?: any, exludeReturn?: boolean): void;
        }
        interface IReg {
            name: string;
            stat?: any;
            callback: (exprFn: Function, IReg: this) => void;
            onError?: (stat: any) => void;
            code: string;
            evalCode?: Function;
            IsString?: boolean;
        }
        type delg = (ovalue: any, value: any, scop: bind.Scop, job: bind.JobInstance, event: bind.EventArgs<any, any>) => void;
        class interpolation implements basic.IJob {
            Name: string;
            Todo(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
            OnError(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
            OnInitialize(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
            OnScopDisposing(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
        }
    }
}
declare module "sys/Jobs" {
    import { bind } from "sys/Corelib";
    import { basic } from "sys/utils";
    export function ParseTarget(dom: Element): {
        depth: number;
        href: string;
    };
    export function GetTarget(dom: Element, depth: number, id: any): Element;
    export function GetTarget1(dom: Element): Element;
    export function GetTarget2(ji: bind.JobInstance): HTMLElement;
    export module Jobs {
        class CheckBox implements basic.IJob {
            Name: string;
            Todo(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
            OnError(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
            OnInitialize(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
            OnScopDisposing(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
            Handle(ji: bind.JobInstance): void;
        }
        class FloatJob implements basic.IJob {
            Name: string;
            reg: (str: any) => boolean;
            Todo(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
            OnInitialize(ji: bind.JobInstance, e: bind.EventArgs<any, any>): void;
            handleEvent(ji: bind.JobInstance): void;
            OnScopDisposing(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
        }
        class AccordionSelectJob implements basic.IJob {
            Name: string;
            Todo(ji: bind.JobInstance, e: bind.EventArgs<any, any>): void;
            OnError(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
            OnInitialize(ji: bind.JobInstance, e: bind.EventArgs<any, any>): void;
            callback(): void;
            OnScopDisposing(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
        }
        var ratingJob: basic.IJob;
    }
}
declare module "sys/Thread" {
    export namespace Workers {
        interface IWorker {
            addEventListener(k: 'error', handler: (e: ErrorEvent) => any, options?: boolean | AddEventListenerOptions): any;
            addEventListener(k: 'message', handler: (e: MessageEvent) => any, options?: boolean | AddEventListenerOptions): any;
            postMessage(message: any, targetOrigin: string, transfer?: any[]): void;
        }
        namespace WebWorker {
            interface IMessageAction<T> {
                Id: number;
                Handler: string;
                Data: T;
            }
            interface IMessageResult<T> {
                Id: number;
                IsError?: boolean;
                Data?: T;
                keepAlive: boolean;
            }
            interface MessageEventArgs<T> {
                e: MessageEvent;
                Msg: IMessageAction<T>;
                Handled: boolean;
                Result: any;
                Error?: boolean;
                Thread: Server;
                keepAlive?: boolean;
            }
            interface ThreadPacket {
                handler: string;
                data: any;
                callback(owner: ThreadPacket, data: IMessageResult<any>): void;
                Id: number;
            }
            function registerHandler<T>(name: string, handler: (e: MessageEventArgs<T>) => any): boolean;
            function getHandler(name: string): false | ((e: MessageEventArgs<any>) => any);
            function unregisterHandler(name: string): boolean;
            class Server {
                private _worker;
                constructor();
                Start(): void;
                private _onerror;
                private _onmessage;
                private _onHandlerError;
                postMessage<T>(data: IMessageResult<T>, targetOrigin?: string, transfers?: any[], ports?: MessagePort[]): void;
                private onPostMessageError;
                static Default: Server;
                static Start(): void;
            }
            class Client {
                private _url;
                private _worker;
                private _quee;
                private static counter;
                constructor(_url: string);
                Start(): void;
                Send(packet: ThreadPacket): void;
                private _onmessage;
                private _onerror;
            }
        }
        class ServiceWorker {
            static Start(url: string, scope: string): Promise<void>;
            static postMessageToSW<T>(data: Workers.WebWorker.IMessageAction<T>): Promise<{
                Action: Workers.WebWorker.IMessageAction<T>;
                Result: Workers.WebWorker.IMessageResult<T>;
            }>;
        }
    }
}
declare module "sys/Initializer" {
    import { bind } from "sys/Corelib";
    import { Processor } from "sys/Dom";
    import { Parser } from "sys/Syntaxer";
    export class AttributeScop extends bind.Scop {
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
    export class AttributeDerectives implements Processor.Def {
        static _default: AttributeDerectives;
        static readonly default: AttributeDerectives;
        name: string;
        attribute: string;
        check?(_x: Processor.Tree, _e: Processor.Instance): boolean;
        static flip(mode: bind.BindingMode): 0 | 1 | 3 | 2;
        static observeAttribute(dom: any, attribute: any, mode: any): {
            scop: bind.ValueScop;
            attrScop: AttributeScop;
            binder: bind.TwoBind<any>;
        };
        execute(xx: Processor.Tree, m: Processor.Instance): Processor.Tree;
        valueParser?(_value: string): void;
        readonly priority: number;
        isPrimitive: boolean;
        isFinalizer: boolean;
    }
    export class PropertyDerectives implements Processor.Def {
        static _default: PropertyDerectives;
        static readonly default: PropertyDerectives;
        name: string;
        attribute: string;
        check?(_x: Processor.Tree, _e: Processor.Instance): boolean;
        private getName;
        private buildDeriScop;
        static observeAttribute(dom: any, attribute: any, mode: any): {
            scop: bind.ValueScop;
            attrScop: AttributeScop;
            binder: bind.TwoBind<any>;
        };
        execute(xx: Processor.Tree, m: Processor.Instance): Processor.Tree;
        valueParser?(_value: string): void;
        readonly priority: number;
        isPrimitive: boolean;
        isFinalizer: boolean;
    }
    export module bom {
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
}
declare module "sys/Services" {
    import { Controller } from "sys/System";
    export namespace services {
        function LoadServices(_requester: Controller.ProxyData): void;
    }
}
declare module "sys/Critere" {
    import { bind } from "sys/Corelib";
    import { utils } from "sys/collections";
    import { UI } from "sys/UI";
    import { reflection } from "sys/runtime";
    export namespace Critere {
        abstract class Critere<T> extends utils.Filter<T, utils.IPatent<T>> implements utils.IPatent<T> {
            Check(s: T): boolean;
            private deb;
            private fin;
            protected convertFromString(x: string): utils.IPatent<T>;
            Begin(deb: number, count: number): boolean;
            IsMatch(i: number, item: T): boolean;
            equals(p: utils.IPatent<T>): boolean;
            abstract IsQuerable(): boolean;
            protected _view: UI.JControl;
            protected abstract getView(): UI.JControl;
            Activate(): void;
            Disactivate(): void;
            GetMatchs(p: T[]): T[];
            abstract clear(): void;
            constructor();
            protected Scop: bind.ValueScop;
            readonly View: UI.JControl;
            isMatch(v: T): boolean;
            IsActivated(): boolean;
            protected abstract _isMatch(v: T): boolean;
            protected init(): void;
            protected static getTypeOf(type: Function | reflection.GenericType | reflection.DelayedType): Function;
            protected smartClear(): void;
            static ctor(): void;
            static Register(PropertyType: Function, CritereType: Function, Properties: any, CreateView: (owner: Critere<any>, prop: bind.DProperty<any, any>, CritereMVC: any, params: {
                [n: string]: any;
            }) => Critere<any>): void;
            static Get(type: Function | reflection.GenericType | reflection.DelayedType, strict?: boolean): CritereMVC;
            Open(callback: (n: this) => void): void;
            private modal;
        }
        interface CritereMVC {
            PropertyType: Function;
            CritereType: Function;
            Properties: any;
            CreateView(owner: Critere<any>, prop: bind.DProperty<any, any>, desc: CritereMVC, params: {
                [n: string]: any;
            }): Critere<any>;
        }
        abstract class Unaire<T> extends Critere<T> {
            clear(): void;
            static __fields__(): bind.DProperty<any, Unaire<any>>[];
            static CheckType(e: bind.EventArgs<any, Unaire<any>>): void;
            static DPValue: bind.DProperty<any, Unaire<any>>;
            Value: T;
            constructor();
            protected abstract CheckType(e: bind.EventArgs<T, Unaire<T>>): void;
        }
        abstract class Couple<T> extends Critere<T> {
            static __fields__(): bind.DProperty<Object, Couple<any>>[];
            static CheckType(e: bind.EventArgs<any, Couple<any>>): void;
            static DPX: bind.DProperty<Object, Couple<any>>;
            X: T;
            static DPY: bind.DProperty<Object, Couple<any>>;
            Y: T;
            constructor();
            protected abstract CheckType(e: bind.EventArgs<T, Couple<T>>): void;
            abstract clear(): any;
        }
        class Text extends Unaire<string | any> {
            clear(): void;
            getView(): UI.JControl;
            Label: string;
            protected CheckType(e: bind.EventArgs<string | any, Unaire<string | any>>): void;
            protected _isMatch(v: string | any): any;
            constructor(label: string);
            Value: any;
            IsQuerable(): boolean;
        }
        class Boolean extends Unaire<boolean> {
            clear(): void;
            getView(): UI.JControl;
            Label: string;
            protected CheckType(e: bind.EventArgs<boolean, Unaire<boolean>>): void;
            protected _isMatch(v: boolean): boolean;
            IsQuerable(): boolean;
            constructor(label: string);
        }
        class Vector extends Couple<number> {
            protected getView(): UI.JControl;
            protected CheckType(e: bind.EventArgs<number, Couple<number>>): void;
            protected _isMatch(v: number): boolean;
            Title: string;
            constructor(title: string);
            clear(): void;
            IsQuerable(): boolean;
        }
        class Period extends Couple<Date> {
            protected getView(): UI.JControl;
            protected CheckType(e: bind.EventArgs<Date, Couple<Date>>): Date;
            IsQuerable(): boolean;
            protected _isMatch(v: Date): boolean;
            Title: string;
            constructor(title: string);
            clear(): void;
        }
        abstract class ComplexCritere<T extends bind.DObject> extends Critere<T> {
            protected static __shema: CritereShema;
            protected readonly Shema: Critere.CritereShema;
            protected static generateFieldsFrom(type: Function, fields?: bind.DProperty<any, any>[]): bind.DProperty<any, any>[];
            protected InitProperties(prams?: any): void;
            protected init(): void;
            protected getView(container?: UI.JControl): UI.JControl;
            clear(): void;
            IsQuerable(): boolean;
            isMatch(p: T): boolean;
            protected _isMatch(v: T): boolean;
            constructor();
            private indexes;
        }
        interface PropertyCritereShema {
            critereDP: bind.DProperty<any, any>;
            propertyDP: bind.DProperty<any, any>;
        }
        interface PropertyCritere {
            critereValue: Critere<any>;
            propertyDP: bind.DProperty<any, any>;
        }
        interface CritereShema {
            proxyType: Function;
            critereType: Function;
            propertiesSheam: PropertyCritereShema[];
            critereProperties: Array<bind.DProperty<any, any>>;
        }
    }
}
declare module "sys/AI" {
    export namespace AI {
        namespace tools {
            function isFlattenable(value: any): boolean;
            function baseFlatten<T>(array: any, depth: any, predicate?: typeof isFlattenable, isStrict?: boolean, result?: Array<T>): T[];
            function flattenDeep<T>(array: any[]): T[];
            class SegmentRunner {
                Disposed: Segment[];
                Last: Segment;
                Reader: Segment;
                Writer: Segment;
                Cursor: any;
                Next(): number;
                constructor(start: number, end: number);
            }
            class Iterator {
                private runner;
                Read(): number;
                Write(): void;
            }
            class Segment {
                Start: number;
                End: number;
                Cursor: any;
                NextSegment: Segment;
                constructor(parent: Segment, Start?: number, End?: number);
            }
        }
        namespace StringSimiarity {
            interface IRating {
                target: string;
                rating: number;
            }
            interface IRatings {
                ratings: IRating[];
                bestMatch: IRating;
            }
            function compareTwoStrings(str1: string, str2: string): number;
            function findBestMatch(mainString: string, targetStrings: string[]): IRatings;
            function bestMatch(ratings: IRating[]): any;
            function Sort(rattings: IRatings): IRating[];
        }
        namespace Math {
            class GCDExtended {
                GCD: number;
                FactorA: number;
                FactorB: number;
                constructor(gcd: number, factorA: number, factorB: number);
                SetValues(gcd: number, factorA: number, factorB: number): this;
            }
            function mul_mod(a: number, b: number, m: number): number;
            function PowMod(base: number, exp: number, modulus: number): number;
            function getRandomPrime(cond: (p: any) => boolean, maxIndex?: number): number;
            function get_common_denom(e: number, PHI: number): number;
            function GCD(a1: number, b1: number): number;
            function ExGCD(a1: number, b1: number, rem?: number): {
                result: number;
                factor: number;
                rem: number;
                x: number;
            };
            function gcd_extended(p: number, q: number): GCDExtended;
            function SolveCongurentEqu(factor: number, rem: number, modulus: number): number[];
        }
        namespace Encryption {
            interface ITransform {
                transform(byte: number): number;
                isValideByte(byte: number): boolean;
            }
            interface RSAKey {
                n: number;
                e: number;
            }
            interface RSACrypter {
                Encrypter: RSA;
                Decripter: RSA;
            }
            class RSA implements ITransform {
                private key;
                constructor(key: RSAKey);
                transform(byte: number): number;
                isValideByte(byte: number): boolean;
            }
            class FastRSA implements ITransform {
                private key;
                private array;
                constructor(key: RSAKey);
                transform(byte: number): any;
                isValideByte(byte: number): boolean;
            }
            function GenerateRSAKey(sourceMaxByte: number, transformedMaxByte: number): RSACrypter;
            function test(f: Function, iter: number, args: any[]): number;
        }
    }
}
declare module "sys/resources" {
    export module Resources {
        var result: {
            heavyTable: ITemplateExport;
            uiTemplate: ITemplateExport;
            components: ITemplateExport;
            strechyButton: ITemplateExport;
        };
        function OnInitalized(callback: (success: boolean) => void): number | void;
        function Initialize(): void;
    }
    export namespace Ids {
        class t1 {
        }
        class t2 {
        }
        class t3 {
        }
    }
    export namespace TemplateTypes {
        class RichMenu {
        }
    }
}
declare module "Core" {
    export * from 'context';
    export * from "sys/defs";
    export * from "sys/Syntaxer";
    export * from "sys/System";
    export * from "sys/Filters";
    export * from "sys/QModel";
    export * from "sys/Corelib";
    export * from "sys/db";
    export * from "sys/runtime";
    export * from "sys/Encoding";
    export * from "sys/Jobs";
    export * from "sys/Thread";
    export * from "sys/Initializer";
    export * from "sys/Services";
    export * from "sys/Critere";
    export * from "sys/AI";
    export * from "sys/UI";
}
declare module "sys/Components" {
    import { UI } from "sys/UI";
    import { bind } from "sys/Corelib";
    import { collection } from "sys/collections";
    import { attributes as _attributes, Controller } from "sys/Dom";
    import { defs } from "sys/defs";
    import { basic } from "sys/utils";
    export namespace Components {
        class MdTextbox<T> extends UI.JControl {
            Label: string;
            Value: T;
            private _input;
            private _label;
            private _isChanging;
            _hasValue_(): boolean;
            _OnValueChanged(e: bind.EventArgs<any, this>): void;
            OnLabelChanged(e: bind.EventArgs<string, this>): void;
            constructor(_view?: HTMLElement);
            private createElemnt;
            initialize(): void;
            handleEvent(e: Event): void;
            private onInputChanged;
            Type: string;
            private _auto;
            InputBox: UI.Input;
            readonly AutoCompleteBox: UI.ProxyAutoCompleteBox<T>;
            Suggestions: collection.List<T>;
            OnSuggesionsChanged(e: bind.EventArgs<collection.List<T>, this>): void;
            static componenet(e: _attributes.ComponentEventArgs): any;
            static ctor(): void;
        }
        interface MenuItem {
            type: string;
            nonSelectable: boolean;
        }
        interface MdMenuItem extends MenuItem {
            type: 'menu-item';
            iconName: string;
            label: string;
            commandName: string;
            control?: UI.JControl;
        }
        interface Separator extends MenuItem {
            type: 'separator';
            nonSelectable: false;
        }
        interface Label extends MenuItem {
            type: 'label';
            value: string;
            nonSelectable: false;
        }
        interface MdIconGroupItem {
            iconName: string;
            commandName: string;
        }
        interface IconGroup extends MenuItem {
            type: 'icongroup';
            value: MdIconGroupItem[];
        }
        class MdIconGroup extends UI.ListAdapter<MdIconGroupItem, any> implements UI.ITemplateShadow {
            private _data;
            setDataContext(data: IconGroup): void;
            getDataContext(): IconGroup;
            constructor();
            initialize(): void;
        }
        class ContextMenuTemplate extends UI.Template {
            private static _labelTemplate;
            private static _menuItemTemplate;
            private static store;
            private garbage;
            private static readonly EmptyArray;
            static ctor(): void;
            CreateShadow<T>(data: T | bind.Scop, cnt: UI.JControl): UI.TemplateShadow;
            CacheTemplateShadow(item: MenuItem, child: UI.TemplateShadow): void;
            constructor();
        }
        class MdContextMenu extends UI.ListAdapter<MenuItem, any> implements UI.IContextMenu<MenuItem> {
            OnClosed(result: MenuItem, e: UI.IContextMenuEventArgs<MenuItem>): boolean;
            getView(): UI.JControl;
            ItemsSource: collection.List<MdMenuItem | Separator | Label>;
            static ctor(): void;
            constructor(items?: MenuItem[]);
            protected getItemShadow(item: MenuItem, i: number): any;
            private OnIconGroupItemCliced;
            protected disposeItemShadow(item: MenuItem, child: UI.TemplateShadow, i: number): UI.TemplateShadow;
            protected disposeItemsShadow(items: MenuItem[], childs: UI.TemplateShadow[]): void;
            initialize(): void;
            getTarget(): UI.JControl;
            private _revalidate;
            OnAttached(e: UI.IContextMenuEventArgs<MenuItem>): void;
            OnItemClicked(s: UI.TemplateShadow, e: Event, t: UI.ListAdapter<MenuItem, MenuItem>): void;
        }
    }
    export namespace Components {
        function getTemplates(): {
            heavyTable: ITemplateExport;
            uiTemplate: ITemplateExport;
            components: ITemplateExport;
            strechyButton: ITemplateExport;
        };
        interface OrderMap {
            factorHandled?: boolean;
            factor: number;
            lastStat: any;
        }
        interface OrderByEventArgs<This> {
            sender: This;
            orderBy: string;
            col: UI.help.IColumnCellHeaderDef;
            view: HTMLTableHeaderCellElement;
            state: OrderMap;
            previous?: OrderByEventArgs<This>;
        }
        class HeavyTable<T> extends UI.ListAdapter<T, any> {
            private cols;
            Rebound: boolean;
            visibleCols: number[];
            private Controller;
            constructor(cols: UI.help.IColumnTableDef[]);
            initialize(): void;
            protected OnCompileEnd(cnt: Controller): void;
            setName(name: string, dom: HTMLElement, cnt: UI.JControl, e: bind.IJobScop): void;
            OnOrderBy(sender: this, orderBy: string, col: UI.help.IColumnCellHeaderDef, view: HTMLTableHeaderCellElement): void;
            currentOrderMap: OrderByEventArgs<this>;
            private _orderHandler;
            private orderMap;
            setOrderHandler<Owner>(handler: basic.ITBindable<(e: OrderByEventArgs<this>) => void>): void;
            private endEdit;
            private beginEdit;
            edit(currentElement: HTMLTableDataCellElement): boolean;
            readonly EOF: boolean;
            OnKeyDown(e: KeyboardEvent): boolean;
            _x: number;
            _y: number;
            oldInnerText: any;
            private x;
            private ColCount;
            private y;
            private stat;
            private _selectedCell;
            setXY(x: number, y: number): boolean;
            private isfocussed;
            private getStat;
            getCurrentCell(): HTMLTableDataCellElement;
            selectCell(): HTMLTableDataCellElement;
            deselectCell(): void;
            private editCell;
            static ctor(): void;
        }
    }
    export namespace Components {
        class ActionButton<T> extends UI.JControl {
            static __fields__(): bind.DProperty<any, ActionButton<any>>[];
            static DPSource: bind.DProperty<collection.List<any>, ActionButton<any>>;
            static DPValue: bind.DProperty<any, ActionButton<any>>;
            Value: T;
            Source: collection.List<T>;
            Caption: UI.Label;
            Box: UI.Input;
            AutocompleteBox: UI.ProxyAutoCompleteBox<T>;
            constructor();
            initialize(): void;
            OnSourceChanged(e: bind.EventArgs<collection.List<T>, this>): void;
            OnValueChanged(box: defs.$UI.IAutoCompleteBox<T>, oldValue: T, newValue: T): void;
        }
    }
    export namespace Components {
        class StrechyButton extends UI.TControl<StrechyButton> {
            private _Title;
            private _Items;
            private _Trigger;
            constructor();
            setName(name: string, dom: HTMLElement, cnt: UI.JControl, e: bind.IJobScop): void;
            initialize(): void;
            OnCompileEnd(): void;
            handleEvent(event: Event): void;
            static ctor(): void;
        }
    }
}
declare module "sys/scops" { }
