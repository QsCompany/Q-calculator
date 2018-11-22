import { bind } from './Corelib';
import { collection } from './collections';
import { UI } from './UI';
import { basic } from './utils';
export declare module defs {
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
export declare namespace defs.$UI {
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
export declare namespace defs {
    interface ModalApi {
        New(...args: any[]): defs.$UI.IModal;
        ShowDialog(title: string, msg: string | HTMLElement | UI.JControl, callback?: (e: UI.MessageEventArgs) => void, ok?: string, cancel?: string, abort?: string): defs.$UI.IModal;
        NextZIndex(): number;
    }
}
//# sourceMappingURL=defs.d.ts.map