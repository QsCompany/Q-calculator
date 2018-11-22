// tslint:disable-next-line:no-reference
/// <reference path="../lib/qloader.d.ts" />
import { template } from "template|../src/calc.html";
import { UI } from "../lib/q/Core";
import { bind } from "../lib/q/sys/Corelib";

import { context } from "context";
import { CalcData } from './calc-logic';

import { attributes as _attributes, Controller } from "../lib/q/sys/Dom";
import { thread } from "../lib/q/sys/runtime";
import { loadMDResources } from "./md/md";

Object.defineProperty(Object.prototype, 'string', { get() { return this.toString(); }, configurable: false, enumerable: false });

@_attributes.Component({ name: "calc-button", handler: CalcButton.creator })
export class CalcButton extends UI.JControl {
    constructor(view: HTMLElement, label: string) {
        super(view);
        this.applyStyle('btn');
        var l = document.createElement('div');
        l.classList.add('number');
        l.innerText = label;
        this._view.appendChild(l);
    }
    static creator(e: _attributes.ComponentEventArgs) {
        var c = e.node;
        var cnt = new CalcButton(c.Dom as any, (c.Dom as HTMLElement).getAttribute("label"));
        c.e.Control = cnt;
        return c;
    }
    initialize() { }
}
@_attributes.Content({ keepInTree: true, handler: (e) => { }, type: _attributes.ContentType.multiple })
@_attributes.Component({
    name: 'q-calc',
    handler: Calc.creator
})
@_attributes.Event({ name: "result" })
export class Calc extends UI.TControl<CalcData> {
    static creator(e: _attributes.ComponentEventArgs) {
        e.node.e.Control = new Calc(e);
        return e.node;
    }
    public Value: CalcData;
    @bind.property(Number) public fontSize: number;
    OnKeyDown(e: KeyboardEvent) {
        if (!this._view.contains(document.activeElement)) return;
        this.Value.append(e);
        e.stopPropagation();
        return true;
    }
    static get(e?: _attributes.ComponentEventArgs) {
        var tm = template.get("calcView");
        if (!e) return tm;
        var t = tm.content.firstElementChild.cloneNode(true);
        e.node.e.dom.appendChild(t);
        return new UI.HtmlTemplate(e.node.e.dom as any, false);
    }
    constructor(e?: _attributes.ComponentEventArgs) {
        super(Calc.get(e), e.node.Scop || UI.TControl.Me);
        if (e) {
            var s = e.node.Scop;
            var v = s instanceof CalcData ? s : s.Value instanceof CalcData ? s.Value : null;
        }
        this.Value = v || new CalcData();
        this.Value.OnPropertyChanged(CalcData.DPResult, (s, e) => {
            this.notify("result", { name: "result", Data: e._new, sender: this });
        });

    }
}

function loadResources1() {
    var t = ['../lib/q/assets/style/bundle.css', '../src/calc.css'];
    for (const s of t)
        (require as any)('style|' + s, void 0, void 0, context);
}
//Controller.Attach(UI.Desktop.Current, new CalcData());
thread.Dispatcher.OnIdle(UI.Spinner.Default, UI.Spinner.Default.Pause, true);
loadMDResources();
var app = $('#app', document.body) as any;

UI.processHTML(app, new CalcData())

// debugger;


// var scopA = new bind.ValueScop("A Value", 1);
// var scopB = new bind.ValueScop("B Value", 2);

// var tbAB = new bind.TwoBind(1, scopA, scopB, bind.Scop.DPValue, bind.Scop.DPValue);
// var tbBA = new bind.TwoBind(1, scopB, scopA, bind.Scop.DPValue, bind.Scop.DPValue);
// window['test'] = {
//     scopA, scopB, tbAB, tbBA
// }