import { bind } from "./Corelib";
export declare namespace Parser {
    interface ifn {
        (a: bind.IScopConst, b: bind.IScopConst): any;
        (a: bind.IScopConst): any;
        (a: any, b: any): any;
        (a: any): any;
        isComplex?: boolean;
    }
    interface IoperMap {
        [char: string]: IoperMap | ifn;
    }
    const _unaire__: IoperMap;
    const _oper_: IoperMap;
    function getOperation(b: syntaxer, _oper_: IoperMap): {
        oper: string;
        fn: (a: any, b: any) => any;
    };
}
export declare namespace Parser {
    function bi_compute(b: syntaxer, r: ParserResult): boolean;
    function uni_compute(b: syntaxer, r: ParserResult): boolean;
    enum TokenType {
        uknown = 0,
        alpha = 1,
        num = 2,
        prnt = 4,
        brkt = 8,
        dot = 16,
        prefix = 32,
        filter = 64,
        whites = 128,
        alphanum = 3
    }
    interface stat {
        index: number;
    }
    interface Token {
        index: number;
        char: string;
        code: number;
        type: TokenType;
    }
    type parser = (strm: syntaxer, result: ParserResult) => boolean;
    enum CToken {
        whitespace = 0,
        undefined = 1,
        boolean = 2,
        number = 3,
        string = 4,
        word = 5,
        keyword = 6,
        path = 7,
        functionCall = 8,
        arrayCall = 9,
        condition = 10,
        biCompute = 11,
        uniCompute = 12,
        StringTemplate = 13
    }
    interface ParserResult {
        start?: Token;
        end?: Token;
        success: boolean;
        resut?: any;
        msg?: string;
        tokon?: CToken | string;
        parent: ParserResult;
        children: ParserResult[];
    }
    function ands(parsers: parser[]): (b: syntaxer, _rslt: ParserResult) => boolean;
    function ors(parsers: parser[]): (b: syntaxer, _result: ParserResult) => boolean;
    function _ors(parsers: parser[]): (b: syntaxer, result: ParserResult) => boolean;
    enum oper {
        or = 0,
        and = 1,
        xor = 2,
        eq = 3,
        neq = 4,
        dot = 5
    }
    interface Term {
        oper: oper;
        parser: parser;
        neq: boolean;
    }
    class parserBuilder {
        token: CToken | string;
        private _parser;
        private terms;
        parent: parserBuilder;
        constructor(token: CToken | string);
        and(p: parser, neq?: boolean): this;
        set(p: parser, neq?: boolean): this;
        $open(token: CToken | string, oper: oper, neq?: boolean): parserBuilder;
        $close(): parserBuilder;
        or(p: parser, neq?: boolean): this;
        xor(p: parser, neq?: boolean): this;
        eq(p: parser, neq?: boolean): this;
        neq(p: parser, neq?: boolean): this;
        readonly Parser: parser;
        private exect;
    }
    class syntaxer {
        src: string;
        readonly CurrentString: string;
        getCurrentString(left: number, right: number): string;
        readonly ShiftIndex: number;
        static opers: number[];
        static whites: number[];
        private stack;
        Tokens: Token[];
        private index;
        validate(s?: stat): true;
        save(): stat;
        restore(s?: stat): false;
        readonly current: Token;
        getToken(offset: number): Token;
        readonly previous: Token;
        next(): Token;
        back(): Token;
        shift(): true;
        unshift(): true;
        JumpBy(length: number): void;
        JumpTo(index: number): void;
        private static getToken;
        constructor(src: string);
        currentNode: ParserResult;
        _cache_: {
            [index: number]: Map<parser, ParserResult>;
        };
        private getFromCache;
        private setIntoCache;
        exec(p: parser, nonstrorable?: boolean): ParserResult;
        fastExec(p: (...args: any[]) => boolean, ths?: any, args?: any[]): boolean;
        getChar(): string;
        testChar(chr: string): boolean;
        getNextChar(inc: any): string;
        get(shift: number): string;
        static IsDigit(character: any): boolean;
        ScanString(o: string): string | false;
        isChar(t: Token): boolean;
    }
    namespace parsers {
        namespace expr {
            function Term(s: syntaxer, rslt: ParserResult): boolean;
            function parent(s: syntaxer, _rslt: ParserResult): boolean;
            function Expre(): void;
            function chain(_s: parser): void;
        }
        function _keyword(strm: syntaxer, word: string, rslt?: ParserResult, token?: string | CToken): boolean;
        function whitespace(strm: syntaxer, rslt?: ParserResult): true;
        function keyword(word: string): parser;
        function undefined(strm: syntaxer, rslt: ParserResult): boolean;
        function boolean(strm: syntaxer, rslt: ParserResult): boolean;
        function string(strm: syntaxer, rslt: ParserResult): boolean;
        function number(b: syntaxer, rslt: ParserResult): boolean;
        function constant(strm: syntaxer, rslt: ParserResult): boolean;
        function digit(b: syntaxer, rslt: ParserResult): boolean;
        function word(strm: syntaxer, rslt: ParserResult): boolean;
        function pint(b: syntaxer, rslt: ParserResult): boolean;
        function anonymouseScop(s: syntaxer, rslt: ParserResult): boolean;
        function attributeScop(s: syntaxer, rslt: ParserResult): boolean;
        function namedScop(s: syntaxer, rslt: ParserResult): boolean;
        function subScop(s: syntaxer, rslt: ParserResult): boolean;
        function typedScop(s: syntaxer, rslt: ParserResult): boolean;
        function bindscope(b: syntaxer, rslt: ParserResult): boolean;
        function stringChainedScop(b: syntaxer, rslt: ParserResult): boolean;
        function path(b: syntaxer, rslt: ParserResult): boolean;
        function cpath(b: syntaxer, rslt: ParserResult): boolean;
        const _parent1: (b: syntaxer, result: ParserResult) => boolean;
        function parent(b: syntaxer, rslt: ParserResult): boolean;
        function condition(b: syntaxer, rslt: ParserResult): boolean;
        function expression(b: syntaxer, rslt: ParserResult): boolean;
        function fxpression(b: syntaxer, rslt: ParserResult): boolean;
        interface BiComputeResult {
            a: ParserResult;
            o: {
                fn: ifn;
                oper: string;
            };
            b: ParserResult;
        }
        interface UniComputeResult {
            o: {
                fn: ifn;
                oper: string;
            };
            a: ParserResult;
        }
        interface FunctionResult {
            caller: ParserResult;
            args: ParserResult[];
        }
        interface ConditionResult {
            condition: ParserResult;
            success: ParserResult;
            fail: ParserResult;
        }
        interface ArrayResult {
            caller: ParserResult;
            index: ParserResult;
        }
        function functionCall(b: syntaxer, rslt: ParserResult): boolean;
        function arrayCall(b: syntaxer, rslt: ParserResult): boolean;
        enum coPathType {
            bindscope = 0,
            typedscope = 1,
            subscop = 2,
            parentscop = 3,
            namedscop = 4,
            anonymousscop = 5,
            thisscope = 6,
            keyword = 7
        }
    }
    interface IComposePath {
        t: parsers.coPathType;
        v: string | string[] | ISubsScop | ITypedScop | INamedScop | IParentScop | IKeywordScop | IBindScope;
    }
    interface ITypedScop {
        type: undefined | ':' | '=';
        path: string;
    }
    type INamedScop = string;
    type IParentScop = number;
    type ISubsScop = string[];
    type IBindScope = string[];
    type IKeywordScop = string;
    function parseComposePath(str: string): ParserResult;
    function parseExpression(str: string): ParserResult;
    function parseStringTemplate(str: string): ParserResult;
    function Execute(code: string, parser: Parser.parser): ParserResult;
}
export declare namespace Parser {
    interface ICode {
        Code: string;
        scop?: bind.Scop;
        result?: any;
        pb?: bind.PropBinding;
    }
    class StringTemplate {
        private code;
        private curs;
        private len;
        private stack;
        private pcurs;
        private isCode;
        private readonly currentChar;
        private readonly nextChar;
        private readonly MoveNext;
        private init;
        private getString;
        private _toStack;
        Compile(code: string): (string | ICode)[];
        static default: StringTemplate;
        static Compile(code: string): (string | ICode)[];
        static GenearteString(stack: (string | ICode)[]): string;
    }
}
//# sourceMappingURL=Syntaxer.d.ts.map