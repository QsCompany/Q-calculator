import { reflection } from "./runtime";
export declare module serialization {
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
export declare module encoding {
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
//# sourceMappingURL=Encoding.d.ts.map