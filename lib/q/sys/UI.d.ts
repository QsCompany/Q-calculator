import { bind } from './Corelib';
import { collection } from './collections';
import { defs } from './defs';
import { mvc, Dom as dom } from './runtime';
import { attributes, Controller, Processor } from "./Dom";
import { Parser } from './Syntaxer';
import { basic } from './utils';
export declare type conv2template = mvc.ITemplate | string | Function | UI.Template | HTMLElement;
export declare module UI {
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
export declare module UI {
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
export declare module UI {
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
export declare module UI {
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
export declare module UI {
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
export declare module UI {
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
//# sourceMappingURL=UI.d.ts.map