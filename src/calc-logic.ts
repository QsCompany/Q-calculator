import { bind } from "../lib/q/Core";

export class CalcData extends bind.DObject {

    public static DPResult: bind.DProperty<number, CalcData>;
    @bind.property1(Number, { StaticName: "DPResult" })
    public Result: number;

    @bind.property(String, '')
    public Oper: string;

    @bind.property(Number, 0)
    public Num: number;

    @bind.property(String, '')
    public Stream: string;
    constructor() {
        super();
        this.Result = 0;
        this.Num = 0;
        this.Oper = "+";
    }
    private static opers = {
        '': function (a, b) { return b },
        '=': function (a, b) { return b },
        'Enter': function (a, b) { return b },
        '+': function (a, b) { return a + b },
        '-': function (a, b) { return a - b },
        '*': function (a, b) { return a * b },
        '/': function (a, b) { return a / b }
    }
    private getChar(c: MouseEvent | KeyboardEvent) {
        if (c instanceof KeyboardEvent) var s = c.key;
        else if (c instanceof MouseEvent) s = ((c.currentTarget || c.target) as HTMLElement).getAttribute('arg');
        var x = s;
        if (x >= '0' && x <= '9') return parseInt(x);
        return x;
    }
    private lc = '';
    public AppendChar(c: number | string) {
        if (typeof c == 'number')
            this.Num = !this.hasDot ? this.Num * 10 + c : this.Num + c / (this.ndec *= 10);
        else if (c == '.') {
            if (this.hasDot) return;
            this.hasDot = true;
            this.ndec = 1;
        }
        else if (c == 'c' || c == "Escape")
            return this.clear();
        else if (c == "Backspace") {
            if (
                this.Num == 0) return;
            var x = this.Num.toString();
            x = x.substr(0, x.length - 1);
            var v = parseFloat(x);;
            this.Num = isNaN(v) ? 0 : v;
            this.Stream = this.Stream.substr(0, this.Stream.length - 1);
            return;
        }
        else {
            var cfn = CalcData.opers[c];
            if (!cfn) return;
            var fn = CalcData.opers[this.Oper];
            if (this.lc) {
                this.Stream = this.Stream.substr(0, this.Stream.length - 1) + c;
                this.Oper = c;
                return;
            }
            if (c == '=' || c == 'Enter') {
                if (fn)
                    var r = fn(this.Result, this.Num);
                return this.clear(r, c);
            }
            else if (fn) {
                var r = fn(this.Result, this.Num);
                this.lc = c;
                this.clear(r, c, true);
                this.Stream += c;
                return;

            }
            else return;
        }
        this.lc = void 0;
        this.Stream += c;
    }
    public append(c: KeyboardEvent | MouseEvent) {
        this.AppendChar(this.getChar(c));
    }
    clear(result?: number, oper?: string, keepStrm?: boolean) {
        this.Result = typeof result === 'number' ? result : 0;
        this.Oper = typeof oper === 'string' ? oper : '';
        this.hasDot = false;
        this.ndec = 1;
        this.Num = 0;
        if (keepStrm) return;
        this.Stream = "";
        this.lc = void 0;
    }
    private hasDot = false;
    private ndec = 1;

}
