// tslint:disable-next-line:no-reference
/// <reference path="./lib/qloader.d.ts" />
import * as css1 from 'style|./lib/q/assets/style/bundle.css';
import * as css from "style|./calc.css";
import {template} from "template|./calc.html";
import {attributes, bind, UI} from "./lib/q/Core";
import * as Q from "./lib/q/Core";
import { context } from "context";
ValidateImport(css,css1);
export class  CalcData extends bind.DObject {

    
    public static  DPResult:bind.DProperty<number,CalcData>;
    @attributes.property1(Number,{StaticName:"DPResult"})
    public Result: number;
    
    @attributes.property(String,'')
    public Oper: string;

    @attributes.property(Number,0)
    public Num: number;

    @attributes.property(String,'')
    public Stream: string;
    constructor() {
        super();
        this.Result = 0;
        this.Num = 0;
        this.Oper = "+";
    }
    private static opers={
        '':function (a,b){return b},
        '=':function (a,b){return a},
        '+':function (a,b){return a+b},
        '-':function (a,b){return a-b},
        '*':function (a,b){return a*b},
        '/':function (a,b){return a/b}
    }
    private getChar(c:MouseEvent){
        var s=((c.currentTarget || c.target ) as HTMLElement).getAttribute('arg');
        var x=s;
        if(x>='0' && x<='9') return parseInt(x);
        return x;
    }
    private lc='';
    public append(c){
        c=this.getChar(c);
        if(typeof c=='number')
            this.Num=!this.hasDot? this.Num*10+c: this.Num+c/(this.ndec*=10);            
        else if(c=='.' )
        {
            if(this.hasDot) return;
            this.hasDot=true;
            this.ndec=1;
        }
        else{
            var fn=CalcData.opers[this.Oper];
            if(this.lc){
                this.Stream=this.Stream.substr(0,this.Stream.length-1)+c;
                this.Oper=c;
                return;
            }
            
            if(c=='='){
                if(fn)
                    var r=fn(this.Result,this.Num);                
                return this.clear(r,c);
            }
            else if(fn){
                var r=fn(this.Result,this.Num);
                this.lc=c;
                this.clear(r,c,true);
                this.Stream+=c;
                return;

            }
            else if(c=='c') return this.clear();
            else return;
        }
        this.lc=void 0;
        this.Stream+=c;
    }
    clear(result?:number,oper?:string,keepStrm?:boolean){
        this.Result=typeof result==='number'?result:0;
        this.Oper=typeof oper==='string'?oper:'';
        this.hasDot=false;
        this.ndec=1;
        this.Num=0;
        if(keepStrm) return;
        this.Stream="";
        this.lc=void 0;
    }
    private hasDot=false;
    private ndec=1;

}

// tslint:disable-next-line:max-classes-per-file
export class Calc extends UI.TControl<CalcData> {
    public Value: CalcData;
    private rslt:HTMLDivElement
    @attributes.property(Number)
    public fontSize: number;
    
    constructor() {
        super(template.get("calcView"), UI.TControl.Me);
        this.Value = new CalcData();
        this.Value.OnPropertyChanged( CalcData.DPResult, (s, e) => {
           this.rslt.style.fontSize= (50 - (((e._new||0)).toString().length * 1.25))+'px';
        });
    }
    setName(e,d){
        if(e==='rslt')
            this.rslt=d;
    }

}
class App extends UI.Layout<any>{
    Check(){

    }
    Foot:any;
    SearchBox: UI.ActionText;
    showPage(){
        UI.Desktop.Current.Add(this);
        UI.Desktop.Current.CurrentApp=this;    
    }
    initialize(){
        super.initialize();
        
        this.modal.OnInitialized=m=>{
            this.modal.Content=this.calculator;
             m.OkTitle("Close");
             m.Canceltitle(null);
            // m.AbortTitle(null);
        }
        
    }
    ShowApp(){
        UI.Desktop.Current.Add(this);
        UI.Desktop.Current.CurrentApp=this;
        this.modal.Open();
        UI.Spinner.Default.Pause();
    }
    constructor(){
        super(document.createElement('div'));
        (require as any)('style|./lib/q/assets/style/bundle.css',void 0,void 0, context);
        this.addEventListener('click',(s,e,p)=>{
            if(this.modal.IsOpen) return;
            this.modal.Open();
        },this);
    }
    private modal=new UI.Modal();
    private calculator=new Calc();
}
function test() {
    //  const c = new Calc();
    // var app=new App();
    // app.showPage();
    // var m= UI.Modal.ShowDialog('Calculator',c,void 0,null,null,null);
    // m.OnInitialized=n=>{
     
    // }
    (new App()).ShowApp();
    //UI.Desktop.Current.CurrentApp=new App();
}
test();