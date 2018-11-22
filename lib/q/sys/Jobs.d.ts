import { bind } from "./Corelib";
import { basic } from "./utils";
export declare function ParseTarget(dom: Element): {
    depth: number;
    href: string;
};
export declare function GetTarget(dom: Element, depth: number, id: any): Element;
export declare function GetTarget1(dom: Element): Element;
export declare function GetTarget2(ji: bind.JobInstance): HTMLElement;
export declare module Jobs {
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
//# sourceMappingURL=Jobs.d.ts.map