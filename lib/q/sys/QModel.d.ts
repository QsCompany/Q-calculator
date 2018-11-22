import { sdata, Controller } from './System';
import { collection } from './collections';
import { net } from './net';
export declare namespace models {
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
//# sourceMappingURL=QModel.d.ts.map