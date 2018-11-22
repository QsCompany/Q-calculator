import { thread } from "../lib/q/Core";

declare type reject<T> = (error: string | Error) => Promise<T>;
declare type resolve<T> = (data: T) => Promise<T>;
declare type runner<T> = (resolve: resolve<T>, reject: reject<T>) => void;
export class Promise<T> {
    private _success: boolean;
    _result: T | string | Error;
    public get success() { return this._success; }
    public get result() { return this._result; }

    constructor(private runner: runner<T>) {
        thread.Dispatcher.call(this, this.handle, runner);
    }
    handle(runner: runner<T>) {
        try {
            runner((d: T) => this._resolve(d), (d) => this._reject(d));
        } catch (e) {
            this._reject(e);
        }
    }
    then(resolve: resolve<T>) {
        if (this._success === true)
            try {
                resolve(this._result as T);

            } catch (e) { }
        else if (this._success === void 0)
            this._thenStack.push(resolve);
        return this;
    }
    catch(reject: reject<T>) {
        if (this._success === false)
            try {
                reject(this._result as string | Error);

            } catch (e) { }
        else if (this._success === void 0)
            this._catchStack.push(reject);
        return this;
    }
    private _resolve(d: T) {
        this._success = true;
        this._result = d;
        for (const t of this._thenStack) {
            try {
                t(d);
            } catch{
            }
        }
        return this;
    }
    private _reject(d: string | Error) {
        this._success = false;
        this._result = d;
        for (const t of this._catchStack) {
            try {
                t(d);
            } catch{
            }
        }
        return this;
    }

    private _thenStack: resolve<T>[] = [];
    private _catchStack: reject<T>[] = [];

}