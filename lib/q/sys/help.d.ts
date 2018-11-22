import { Parser } from "./Syntaxer";
import { bind } from "./Corelib";
import { basic } from "./utils";
export declare namespace string {
    function IsPrintable(keyCode: number, charCode: number): boolean;
}
export declare module code {
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
//# sourceMappingURL=help.d.ts.map