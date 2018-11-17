import { basic, bind } from "./Corelib";
export declare function parseTarget(dom: Element): {
    depth: number;
    href: string;
};
export declare function getTarget(dom: Element, depth: number, id: any): Element;
export declare function getTargetFrom(dom: Element): Element;
export declare module Jobs {
    function InputChecks(): void;
    function Load(): void;
    class interpolation implements basic.IJob {
        Name: string;
        Todo(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
        OnError(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
        OnInitialize(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
        OnScopDisposing(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
    }
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
    var LabelJob: basic.IJob;
    var LabelJob: basic.IJob;
    var LabelJob: basic.IJob;
    var LabelJob: basic.IJob;
    var LabelJob: basic.IJob;
    var LabelJob: basic.IJob;
    var textboxJob: basic.IJob;
    var LabelJob: basic.IJob;
    var ratingJob: basic.IJob;
    var LabelJob: basic.IJob;
    var LabelJob: basic.IJob;
    var LabelJob: basic.IJob;
    var LabelJob: basic.IJob;
    var LabelJob: basic.IJob;
    var LabelJob: basic.IJob;
    var LabelJob: basic.IJob;
    var TextJob: basic.IJob;
    var TextJob: basic.IJob;
    var TextJob: basic.IJob;
    var CheckJob: basic.IJob;
}
