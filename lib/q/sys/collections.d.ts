import { basic } from "./utils";
import { bind } from "./Corelib";
import { reflection } from "./runtime";
import { encoding } from "./Encoding";
export declare namespace utils {
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
export declare namespace collection {
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
//# sourceMappingURL=collections.d.ts.map