import { bind } from "./Corelib";
import { basic } from "./utils";
export declare namespace net {
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
export declare namespace net {
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
export declare class GuidManager {
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
export declare function setGuidRange(start: number, end: number): void;
//# sourceMappingURL=net.d.ts.map