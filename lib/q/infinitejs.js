var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define("sys/Syntaxer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Parser;
    (function (Parser) {
        function asComplex(f) {
            f.isComplex = true;
            return f;
        }
        Parser._unaire__ = {
            '!': {
                '': function (a) { return !a; },
                '!': function (a) { return !!a; },
            },
            '-': {
                '': function (a) { return -a; },
                '-': function (a) { return --a; },
                '+': function (a) { return -+a; },
            },
            '+': {
                '': function (a) { return +a; },
                '+': function (a) { return ++a; },
                '-': function (a) { return +-a; },
            }
        };
        Parser._oper_ = {
            '+': {
                '': (function (a, b) { return a + b; }),
                '=': asComplex(function (a, b) { var s = a.Value + b.Value; a.Value = s; return s; })
            },
            '-': {
                '': function (a, b) { return a - b; },
                '=': asComplex(function (a, b) { a.Value -= b.Value; return a.Value; })
            },
            '*': {
                '': function (a, b) { return a * b; },
                '=': asComplex(function (a, b) { a.Value *= b.Value; return a.Value; }),
                '*': function (a, b) {
                    try {
                        if (a == null)
                            return -1;
                        var f = (typeof a)[0];
                        if (f == 'n' || f == 'b')
                            a = String(a);
                        else if (!(f === 'o' && 'indexOf' in a))
                            a = String(a);
                        return a.indexOf(b);
                    }
                    catch (_a) {
                        return -1;
                    }
                }
            },
            '/': {
                '': function (a, b) { return a / b; },
                '=': asComplex(function (a, b) { a.Value /= b.Value; return a.Value; })
            },
            '|': {
                '': function (a, b) { return a | b; },
                '|': function (a, b) { return a || b; },
                '=': asComplex(function (a, b) { a.Value |= b.Value; return a.Value; })
            },
            '&': {
                '': function (a, b) { return a & b; },
                '&': function (a, b) { return a && b; },
                '=': asComplex(function (a, b) { a.Value &= b.Value; return a.Value; })
            },
            '!': {
                '=': {
                    '': function (a, b) { return a != b; },
                    '=': function (a, b) { return a !== b; },
                }
            },
            '>': {
                '': function (a, b) { return a > b; }, '=': function (a, b) { return a >= b; }
            },
            '=': {
                '': asComplex(function (a, b) { a.Value = b.Value; return a.Value; }),
                '=': {
                    '': function (a, b) { return a == b; },
                    '=': function (a, b) { return a === b; }
                }
            },
            '<': {
                '': function (a, b) { return a < b; },
                '=': function (a, b) { return a <= b; }
            },
            '?': {
                '?': function (a, b) { return a || b; }
            },
            '%': function (a, b) { return a % b; }
        };
        function getOperation(b, _oper_) {
            var c = b.current;
            if (!c)
                return null;
            var s = c.char;
            var x = _oper_[s];
            while (typeof x === 'object') {
                c = b.getToken(s.length);
                var d = x[c.char];
                if (d) {
                    s += c.char;
                    x = d;
                }
                else {
                    x = x[''];
                }
            }
            if (!x)
                return null;
            b.JumpBy(s.length);
            return { oper: s, fn: x };
        }
        Parser.getOperation = getOperation;
    })(Parser = exports.Parser || (exports.Parser = {}));
    (function (Parser) {
        function bi_compute(b, r) {
            b.exec(Parser.parsers.whitespace, true);
            var oper1 = b.exec(parsers.expression, true);
            if (!oper1.success)
                return false;
            b.exec(Parser.parsers.whitespace, true);
            var oper = Parser.getOperation(b, Parser._oper_);
            if (!oper)
                return false;
            b.exec(parsers.whitespace, true);
            var oper2 = b.exec(parsers.expression, true);
            if (!oper2.success)
                return false;
            r.resut = {
                a: oper1,
                o: oper,
                b: oper2
            };
            r.tokon = CToken.biCompute;
            return true;
        }
        Parser.bi_compute = bi_compute;
        function uni_compute(b, r) {
            b.exec(parsers.whitespace, true);
            var oper = Parser.getOperation(b, Parser._unaire__);
            if (!oper)
                return false;
            b.exec(parsers.whitespace, true);
            var oper1 = b.exec(parsers.expression, true);
            if (!oper1.success)
                return false;
            r.resut = {
                a: oper1,
                o: oper
            };
            r.tokon = CToken.uniCompute;
            return true;
        }
        Parser.uni_compute = uni_compute;
        var TokenType;
        (function (TokenType) {
            TokenType[TokenType["uknown"] = 0] = "uknown";
            TokenType[TokenType["alpha"] = 1] = "alpha";
            TokenType[TokenType["num"] = 2] = "num";
            TokenType[TokenType["prnt"] = 4] = "prnt";
            TokenType[TokenType["brkt"] = 8] = "brkt";
            TokenType[TokenType["dot"] = 16] = "dot";
            TokenType[TokenType["prefix"] = 32] = "prefix";
            TokenType[TokenType["filter"] = 64] = "filter";
            TokenType[TokenType["whites"] = 128] = "whites";
            TokenType[TokenType["alphanum"] = 3] = "alphanum";
        })(TokenType = Parser.TokenType || (Parser.TokenType = {}));
        var CToken;
        (function (CToken) {
            CToken[CToken["whitespace"] = 0] = "whitespace";
            CToken[CToken["undefined"] = 1] = "undefined";
            CToken[CToken["boolean"] = 2] = "boolean";
            CToken[CToken["number"] = 3] = "number";
            CToken[CToken["string"] = 4] = "string";
            CToken[CToken["word"] = 5] = "word";
            CToken[CToken["keyword"] = 6] = "keyword";
            CToken[CToken["path"] = 7] = "path";
            CToken[CToken["functionCall"] = 8] = "functionCall";
            CToken[CToken["arrayCall"] = 9] = "arrayCall";
            CToken[CToken["condition"] = 10] = "condition";
            CToken[CToken["biCompute"] = 11] = "biCompute";
            CToken[CToken["uniCompute"] = 12] = "uniCompute";
            CToken[CToken["StringTemplate"] = 13] = "StringTemplate";
        })(CToken = Parser.CToken || (Parser.CToken = {}));
        function ands(parsers) {
            return function (b, _rslt) {
                for (var i = 0; i < parsers.length; i++) {
                    var p = parsers[i];
                    if (!b.exec(p).success)
                        return false;
                }
                return true;
            };
        }
        Parser.ands = ands;
        function ors(parsers) {
            return function (b, _result) {
                for (var i = 0; i < parsers.length; i++)
                    if (b.exec(parsers[i]).success)
                        return true;
                return false;
            };
        }
        Parser.ors = ors;
        function _ors(parsers) {
            return function (b, result) {
                for (var i = 0; i < parsers.length; i++) {
                    var p = parsers[i];
                    var x = b.exec(p, true);
                    if (x.success)
                        return clone(x, result);
                }
                return false;
            };
        }
        Parser._ors = _ors;
        var oper;
        (function (oper) {
            oper[oper["or"] = 0] = "or";
            oper[oper["and"] = 1] = "and";
            oper[oper["xor"] = 2] = "xor";
            oper[oper["eq"] = 3] = "eq";
            oper[oper["neq"] = 4] = "neq";
            oper[oper["dot"] = 5] = "dot";
        })(oper = Parser.oper || (Parser.oper = {}));
        var parserBuilder = (function () {
            function parserBuilder(token) {
                this.token = token;
                this.terms = [];
            }
            parserBuilder.prototype.and = function (p, neq) {
                this.terms.push({ oper: oper.and, parser: p, neq: neq });
                return this;
            };
            parserBuilder.prototype.set = function (p, neq) {
                this.terms.push({ oper: oper.dot, parser: p, neq: neq });
                return this;
            };
            parserBuilder.prototype.$open = function (token, oper, neq) {
                var t = new parserBuilder(token);
                t.parent = this;
                this.terms.push({ oper: oper, neq: neq, parser: t.Parser });
                return t;
            };
            parserBuilder.prototype.$close = function () {
                return this.parent;
            };
            parserBuilder.prototype.or = function (p, neq) {
                this.terms.push({ oper: oper.or, parser: p, neq: neq });
                return this;
            };
            parserBuilder.prototype.xor = function (p, neq) {
                this.terms.push({ oper: oper.xor, parser: p, neq: neq });
                return this;
            };
            parserBuilder.prototype.eq = function (p, neq) {
                this.terms.push({ oper: oper.eq, parser: p, neq: neq });
                return this;
            };
            parserBuilder.prototype.neq = function (p, neq) {
                this.terms.push({ oper: oper.neq, parser: p, neq: neq });
                return this;
            };
            Object.defineProperty(parserBuilder.prototype, "Parser", {
                get: function () {
                    var _this = this;
                    if (this._parser)
                        return this._parser;
                    return function (b, rslt) {
                        rslt.tokon = _this.token;
                        if (_this.terms.length == 0)
                            return true;
                        var r = _this.exect(_this.terms[0], b);
                        for (var i = 1; i < _this.terms.length; i++) {
                            var term = _this.terms[i];
                            switch (term.oper) {
                                case oper.and:
                                    r = r && _this.exect(term, b);
                                    break;
                                case oper.or:
                                    r = r || _this.exect(term, b);
                                    break;
                                case oper.eq:
                                    r = r == _this.exect(term, b);
                                    break;
                                case oper.neq:
                                case oper.xor:
                                    r = r != _this.exect(term, b);
                                    break;
                                case oper.dot:
                                    r = _this.exect(term, b);
                                    break;
                                default: throw "";
                            }
                        }
                        return true;
                    };
                },
                enumerable: true,
                configurable: true
            });
            parserBuilder.prototype.exect = function (term, b) {
                var r = b.exec(term.parser).success;
                if (term.neq)
                    r = !r;
                return r;
            };
            return parserBuilder;
        }());
        Parser.parserBuilder = parserBuilder;
        var syntaxer = (function () {
            function syntaxer(src) {
                this.src = src;
                this.stack = [];
                this.index = -1;
                this._cache_ = {};
                var tokens = new Array(src.length);
                for (var i = 0; i < src.length; i++) {
                    var c = src[i];
                    tokens[i] = {
                        index: i,
                        char: c, code: c.charCodeAt(0), type: syntaxer.getToken(c)
                    };
                }
                this.Tokens = tokens;
                this.currentNode = { success: null, children: [], start: tokens[0], end: tokens[tokens.length - 1], tokon: 'prg', parent: null };
                this.index = 0;
            }
            Object.defineProperty(syntaxer.prototype, "CurrentString", {
                get: function () {
                    return this.src.substring(this.currentNode.start.index, this.index);
                },
                enumerable: true,
                configurable: true
            });
            syntaxer.prototype.getCurrentString = function (left, right) {
                return this.src.substring(this.currentNode.start.index + left, this.index - right);
            };
            Object.defineProperty(syntaxer.prototype, "ShiftIndex", {
                get: function () { return this.index - this.currentNode.start.index; },
                enumerable: true,
                configurable: true
            });
            syntaxer.prototype.validate = function (s) {
                if (!s)
                    return this.stack.pop(), true;
                var i = this.stack.indexOf(s);
                if (i == -1)
                    return;
                this.stack.splice(i, this.stack.length - i);
                return true;
            };
            syntaxer.prototype.save = function () {
                var t = { index: this.index };
                this.stack.push(t);
                return t;
            };
            syntaxer.prototype.restore = function (s) {
                var i = s ? this.stack.indexOf(s) : this.stack.length - 1;
                if (i == -1)
                    return;
                this.stack.splice(i, this.stack.length - i);
                this.index = s.index;
                return false;
            };
            Object.defineProperty(syntaxer.prototype, "current", {
                get: function () {
                    return this.Tokens[this.index];
                },
                enumerable: true,
                configurable: true
            });
            syntaxer.prototype.getToken = function (offset) {
                return this.Tokens[this.index + offset];
            };
            Object.defineProperty(syntaxer.prototype, "previous", {
                get: function () {
                    return this.Tokens[this.index - 1];
                },
                enumerable: true,
                configurable: true
            });
            syntaxer.prototype.next = function () {
                if (this.index < this.Tokens.length)
                    this.index++;
                else
                    return null;
                return this.Tokens[this.index];
            };
            syntaxer.prototype.back = function () {
                if (this.index > 0)
                    this.index--;
                else
                    return null;
                return this.Tokens[this.index];
            };
            syntaxer.prototype.shift = function () {
                this.index++;
                return true;
            };
            syntaxer.prototype.unshift = function () {
                this.index--;
                return true;
            };
            syntaxer.prototype.JumpBy = function (length) {
                this.index += length;
                this.index = this.index < -1 ? -1 : this.index > this.src.length ? this.src.length : this.index;
            };
            syntaxer.prototype.JumpTo = function (index) {
                this.index = index;
            };
            syntaxer.getToken = function (c) {
                var code = c.charCodeAt(0);
                if (code > 64 && code < 91 || code === 95 || code > 96 && code < 123)
                    return TokenType.alpha;
                if (code > 47 && code < 58)
                    return TokenType.num;
                if (syntaxer.opers.indexOf(code) != -1)
                    return TokenType.prefix;
                if (code == 91 || code == 93)
                    return TokenType.brkt;
                if (code == 124)
                    return TokenType.filter;
                if (code === 46)
                    return TokenType.dot;
                if (syntaxer.whites.indexOf(code) != -1)
                    return TokenType.whites;
                if (code === 40 || code === 41)
                    return TokenType.prnt;
                return TokenType.uknown;
            };
            syntaxer.prototype.getFromCache = function (p, nonstrorable) {
                var x = this._cache_[this.index];
                if (!x)
                    return void 0;
                var y = x.get(p);
                if (!y)
                    return void 0;
                if (!y.success)
                    return y;
                this.index = y.end ? y.end.index + 1 : 0;
                if (!nonstrorable && this.currentNode)
                    this.currentNode.children.push(y);
                return y;
            };
            syntaxer.prototype.setIntoCache = function (p, rslt) {
                var x = this._cache_[rslt.start.index];
                if (!x)
                    this._cache_[rslt.start.index] = x = new Map();
                x.set(p, rslt);
                return rslt;
            };
            syntaxer.prototype.exec = function (p, nonstrorable) {
                var t = this.getFromCache(p, nonstrorable);
                if (t !== void 0)
                    return t;
                var s = this.save();
                var prnt = this.currentNode;
                var t = { success: false, start: this.current, parent: this.currentNode, children: [] };
                try {
                    if (!this.current)
                        return t;
                    this.currentNode = t;
                    this.setIntoCache(p, t);
                    t.success = p(this, t);
                    t.end = this.previous;
                    if (t.success) {
                        this.validate(s);
                        if (!nonstrorable)
                            prnt.children.push(t);
                    }
                    else
                        this.restore(s);
                }
                catch (e) {
                    this.restore(s);
                }
                this.currentNode = prnt;
                return t;
            };
            syntaxer.prototype.fastExec = function (p, ths, args) {
                var s = this.save();
                try {
                    if (!this.current)
                        return false;
                    var t = p.apply(ths || this, args);
                    if (t)
                        return true;
                    else
                        this.restore(s);
                }
                catch (e) {
                    this.restore(s);
                }
                return false;
            };
            syntaxer.prototype.getChar = function () {
                var c = this.Tokens[this.index];
                return c && c.char || '';
            };
            syntaxer.prototype.testChar = function (chr) {
                var c = this.Tokens[this.index];
                var x = c ? c.char == chr : false;
                if (x)
                    this.index++;
                return x;
            };
            syntaxer.prototype.getNextChar = function (inc) {
                var i = this.index;
                if (inc)
                    this.index++;
                var c = this.Tokens[i + 1];
                return c ? c.char : '';
            };
            syntaxer.prototype.get = function (shift) {
                var c = this.Tokens[this.index + shift];
                return c && c.char;
            };
            syntaxer.IsDigit = function (character) {
                return '0' <= character && character <= '9';
            };
            syntaxer.prototype.ScanString = function (o) {
                var ci = this.index - 1;
                var t = this.current;
                if (!t)
                    return false;
                do {
                    if (t.char == o) {
                        this.shift();
                        return this.src.substr(ci, this.index - ci);
                    }
                    if (t.char == '\\')
                        this.shift();
                } while (t = this.next());
                this.index = ci + 1;
                return null;
            };
            syntaxer.prototype.isChar = function (t) {
                return !t.type ? false : ((t.type & TokenType.alphanum) == t.type) || (t.code == 36 || t.code == 95);
            };
            syntaxer.opers = [36, 38, 42, 43, 45, 58, 60, 61, 62, 63, 64, 94, 126];
            syntaxer.whites = [0, 9, 10, 10, 13, 32];
            return syntaxer;
        }());
        Parser.syntaxer = syntaxer;
        function clone(from, to) {
            to.tokon = from.tokon;
            to.resut = from.resut;
            to.msg = from.msg;
            to.children = from.children;
            return true;
        }
        var parsers;
        (function (parsers) {
            var _str = {};
            var expr;
            (function (expr) {
                var suffix_inc = '+-';
                function suffix(s, rslt) {
                    var p = s.current.char;
                    if (suffix_inc.indexOf(p) != -1 && s.next() && s.current.char == p) {
                        s.next();
                        rslt.resut = p + p;
                        rslt.tokon = 'suffix_inc';
                        return true;
                    }
                    return false;
                }
                function preffix(s, rslt) {
                    var p = s.current.char;
                    rslt.tokon = 'suffix_inc';
                    if (suffix_inc.indexOf(p) != -1) {
                        if (p !== '!') {
                            if (s.next() && s.current.char == p)
                                rslt.resut = p + p;
                            else
                                return false;
                        }
                        else
                            rslt.resut = p;
                        return true;
                    }
                    return false;
                }
                function Term(s, rslt) {
                    var pre = s.exec(preffix, false);
                    var exp;
                    if (!exp.success)
                        return false;
                    var suff = s.exec(suffix, false);
                    rslt.tokon = 'term';
                    rslt.resut = {
                        pre: pre,
                        exp: exp,
                        suff: suff
                    };
                    return true;
                }
                expr.Term = Term;
                function parent(s, _rslt) {
                    if (s.current.char != '(')
                        return false;
                    s.exec(expression);
                }
                expr.parent = parent;
                function Expre() {
                }
                expr.Expre = Expre;
                function expression(_strm, _rslt) {
                    return false;
                }
                function chain(_s) {
                }
                expr.chain = chain;
            })(expr = parsers.expr || (parsers.expr = {}));
            function isChar(t) {
                return !t.type ? false : ((t.type & TokenType.alphanum) == t.type) || (t.code == 36 || t.code == 95);
            }
            function _keyword(strm, word, rslt, token) {
                var t = strm.current;
                if (rslt)
                    rslt.tokon = token === void 0 ? 'keyword' : token;
                var i = 0;
                for (var i = 0; i < word.length && t; i++) {
                    if (t.char !== word[i])
                        return false;
                    t = strm.next();
                    if (!t) {
                        rslt.resut = word;
                        return i === word.length - 1;
                    }
                }
                if (rslt)
                    rslt.resut = word;
                return true;
            }
            parsers._keyword = _keyword;
            function whitespace(strm, rslt) {
                if (rslt)
                    rslt.tokon = CToken.whitespace;
                var t;
                ;
                while ((t = strm.current) && t.type == TokenType.whites)
                    strm.next();
                return true;
            }
            parsers.whitespace = whitespace;
            function keyword(word) {
                if (_str[word])
                    return _str[word];
                return _str[word] = function (b, rslt) {
                    return _keyword(b, word, rslt);
                };
            }
            parsers.keyword = keyword;
            function undefined(strm, rslt) {
                rslt.tokon = CToken.undefined;
                var b;
                if (strm.exec(keyword('null'), true).success)
                    b = null;
                else if (strm.exec(keyword('undefined'), true).success)
                    b = void 0;
                else
                    return false;
                rslt.resut = b;
                return true;
            }
            parsers.undefined = undefined;
            function boolean(strm, rslt) {
                rslt.tokon = CToken.boolean;
                var b = null;
                if (strm.exec(keyword('true'), true).success)
                    b = true;
                else if (strm.exec(keyword('false'), true).success)
                    b = false;
                else
                    return false;
                rslt.resut = b;
                return true;
            }
            parsers.boolean = boolean;
            function string(strm, rslt) {
                var t = strm.current;
                rslt.tokon = CToken.string;
                var o = t.char;
                if (o === '\'' || o === '"')
                    while (t = strm.next())
                        if (t.char == o) {
                            strm.shift();
                            rslt.resut = strm.getCurrentString(1, 1);
                            return true;
                        }
                        else if (t.char == '\\')
                            strm.shift();
                return false;
            }
            parsers.string = string;
            function number(b, rslt) {
                rslt.tokon = CToken.number;
                whitespace(b);
                if (!b.exec(digit).success)
                    return false;
                b.exec(ands([keyword('e'), digit]), true);
                rslt.resut = parseFloat(b.CurrentString);
                return true;
            }
            parsers.number = number;
            function constant(strm, rslt) {
                var str = strm.exec(string, true);
                if (str.success
                    || (str = strm.exec(number, true)).success
                    || (str = strm.exec(boolean, true)).success
                    || (str = strm.exec(undefined, true)).success)
                    return clone(str, rslt);
                return false;
            }
            parsers.constant = constant;
            function uint(b) {
                var t;
                var hdig;
                while ((t = b.current) && (t.char >= '0' && t.char <= '9') && (hdig = true) && b.next())
                    ;
                return hdig;
            }
            function digit(b, rslt) {
                var t = b.current;
                rslt.tokon = CToken.number;
                while (t.char === '-' || t.char === '+')
                    t = b.next();
                var fdig = uint(b);
                if (!fdig)
                    return false;
                if (b.current && b.current.char == '.') {
                    b.next();
                    if (!uint(b))
                        b.back();
                }
                rslt.resut = parseFloat(b.CurrentString);
                rslt.tokon = CToken.number;
                return true;
            }
            parsers.digit = digit;
            function wstring(strm, rslt) {
                var t = strm.current;
                var o = t.char;
                while (t = strm.next()) {
                    if (t.char == o) {
                        strm.shift();
                        rslt.resut = strm.CurrentString;
                        return true;
                    }
                    if (t.char == '\\')
                        strm.shift();
                }
                return false;
            }
            function word(strm, rslt) {
                var t = strm.current;
                rslt.tokon = CToken.word;
                if (t.char == '\'' || t.char == '"')
                    return wstring(strm, rslt);
                if (t.type === TokenType.num || !isChar(t))
                    return false;
                while ((t = strm.next()) && isChar(t))
                    ;
                rslt.resut = strm.CurrentString;
                return true;
            }
            parsers.word = word;
            function pint(b, rslt) {
                var t = b.current;
                rslt.tokon = 'pint';
                var s = t.char;
                if (s == '+' || s == '-') {
                    if (s == '-')
                        b.shift();
                }
                if (t.type != TokenType.num)
                    return false;
                while (t = b.next())
                    if (t.type != TokenType.num)
                        break;
                rslt.resut = parseInt(b.CurrentString);
                return true;
            }
            parsers.pint = pint;
            function anonymouseScop(s, rslt) {
                var t = s.current;
                rslt.tokon = 'anonymousscop';
                if (t.char == '~' && !!s.next()) {
                    var x = s.exec(pint, true);
                    rslt.resut = x.resut;
                    return x.success;
                }
                return false;
            }
            parsers.anonymouseScop = anonymouseScop;
            function attributeScop(s, rslt) {
                var t = s.current;
                rslt.tokon = 'attributescop';
                if (t.char == '@' && !!s.next()) {
                    var x = s.exec(word, true);
                    rslt.resut = toSlashStrings(x.resut);
                    return x.success;
                }
                return false;
            }
            parsers.attributeScop = attributeScop;
            var _cache = {};
            function toSlashStrings(s) {
                var o = _cache[s];
                if (o)
                    return o;
                o = "";
                for (var i = 0; i < s.length; i++) {
                    var c = s[i];
                    if (c >= 65 && c <= 90)
                        o += "-" + c;
                    else
                        o += c;
                }
                return o;
            }
            function namedScop(s, rslt) {
                var t = s.current;
                rslt.tokon = 'namedscop';
                if (t.char == '$' && !!s.next()) {
                    var x = s.exec(word, true);
                    rslt.resut = x.resut;
                    return x.success;
                }
                return false;
            }
            parsers.namedScop = namedScop;
            function subScop(s, rslt) {
                var t = s.current;
                rslt.tokon = 'subscop';
                if (t.char == '*' && !!s.next()) {
                    var x = s.exec(word, true);
                    rslt.resut = x.resut;
                    return x.success;
                }
                return false;
            }
            parsers.subScop = subScop;
            function typedScop(s, rslt) {
                var t = s.current;
                rslt.tokon = 'typedscope';
                var ist;
                var path;
                if (t.char !== '[')
                    return false;
                if (!(t = s.next()))
                    return false;
                if (t.char == ':')
                    ist = t.char, s.next();
                else if (t.char == '=')
                    ist = t.char, s.next();
                var r = (path = s.exec(stringChainedScop)).success && s.current && s.current.char == "]" && s.shift();
                if (r)
                    rslt.resut = { type: ist, path: path.resut };
                return r;
            }
            parsers.typedScop = typedScop;
            function bindscope(b, rslt) {
                rslt.tokon = 'bindscope';
                b.exec(whitespace, true);
                var r = b.exec(word, true);
                if (!r.success)
                    return false;
                rslt.resut = [r.resut];
                while (b.current && b.current.type == TokenType.dot) {
                    b.next();
                    var r = b.exec(word, true);
                    if (!r.success)
                        return b.unshift();
                    rslt.resut.push(r.resut);
                }
                return true;
            }
            parsers.bindscope = bindscope;
            function stringChainedScop(b, rslt) {
                b.exec(whitespace, true);
                var r = b.exec(word, true);
                if (!r.success)
                    return false;
                while (b.current && b.current.type == TokenType.dot) {
                    b.next();
                    if (!b.exec(word, true))
                        return b.unshift();
                }
                rslt.resut = b.CurrentString;
                return true;
            }
            parsers.stringChainedScop = stringChainedScop;
            function parents(b, rslt) {
                var t = b.current;
                rslt.tokon = 'parentscop';
                rslt.resut = 0;
                do {
                    if (t.char != '^')
                        break;
                    rslt.resut++;
                } while (t = b.next());
                return !!rslt.resut;
            }
            var _path0 = _ors([keyword('this'), keyword('data'), keyword('window'), constant, parent, anonymouseScop, attributeScop, namedScop, parents]);
            var _path = _ors([parent, subScop, typedScop, bindscope]);
            var _cpath = _ors([functionCall, arrayCall, parent, subScop, typedScop, bindscope]);
            function path(b, rslt) {
                var path = rslt.resut = [];
                rslt.tokon = CToken.path;
                var c = whitespace(b, void 0) && b.exec(_path0, true);
                if (c.success)
                    path.push(c);
                var dotTour = !c.success;
                do {
                    dotTour = !dotTour;
                    var goNext = false;
                    whitespace(b, void 0);
                    if (!b.current)
                        break;
                    if (dotTour) {
                        if (b.current.char !== '.')
                            break;
                        b.next();
                        goNext = true;
                    }
                    else {
                        if ((c = b.exec(_path, true)).success) {
                            path.push(c);
                            goNext = true;
                            continue;
                        }
                        if (path.length)
                            b.back();
                        else
                            return false;
                        break;
                    }
                } while (goNext && b.current);
                if (path.length == 1)
                    return clone(path[0], rslt);
                return true;
            }
            parsers.path = path;
            function cpath(b, rslt) {
                var path = rslt.resut = [];
                rslt.tokon = CToken.path;
                var c = whitespace(b, void 0) && b.exec(_path0, true);
                if (c.success)
                    path.push(c);
                var dotTour = !c.success;
                do {
                    dotTour = !dotTour;
                    var goNext = false;
                    whitespace(b, void 0);
                    if (dotTour) {
                        if (b.current && b.current.char !== '.')
                            break;
                        b.next();
                        goNext = true;
                    }
                    else {
                        if ((c = b.exec(_cpath, true)).success) {
                            path.push(c);
                            goNext = true;
                            continue;
                        }
                        if (path.length)
                            b.back();
                        else
                            return false;
                        break;
                    }
                } while (goNext && b.current);
                if (path.length == 1)
                    return clone(path[0], rslt);
                return true;
            }
            parsers.cpath = cpath;
            parsers._parent1 = _ors([condition, bi_compute, uni_compute, expression]);
            function parent(b, rslt) {
                var pr;
                if (b.exec(keyword('('), true).success && (pr = b.exec(parsers._parent1, true)).success && b.exec(keyword(')'), true).success)
                    return clone(pr, rslt);
                return false;
            }
            parsers.parent = parent;
            function condition(b, rslt) {
                var cnd = b.exec(expression, true);
                if (!cnd.success)
                    return false;
                if (!b.exec(keyword('?'), false).success)
                    return false;
                var _true = b.exec(expression, true);
                if (!_true.success)
                    return false;
                if (!b.exec(keyword(':'), false).success)
                    return false;
                var _false = b.exec(expression, true);
                if (!_false.success)
                    return false;
                if (isConstant(cnd))
                    return clone(cnd.resut ? _true : _false, rslt);
                rslt.resut = {
                    condition: cnd,
                    success: _true,
                    fail: _false
                };
                rslt.tokon = CToken.condition;
                return true;
            }
            parsers.condition = condition;
            var _expression = [condition, cpath, bi_compute, uni_compute];
            var __expression1 = _ors(_expression);
            function expression(b, rslt) {
                var pr;
                if ((pr = b.exec(__expression1, true)).success)
                    return clone(pr, rslt);
                return false;
            }
            parsers.expression = expression;
            function fxpression(b, rslt) {
                var pr;
                for (var _i = 0, _expression_1 = _expression; _i < _expression_1.length; _i++) {
                    var i = _expression_1[_i];
                    var s = b.save();
                    if ((pr = b.exec(i)).success && !b.current)
                        return clone(pr, rslt);
                    b.restore(s);
                }
                return false;
            }
            parsers.fxpression = fxpression;
            function functionCall(b, rslt) {
                b.exec(whitespace, true);
                rslt.tokon = CToken.functionCall;
                var result = { args: [], caller: void 0 };
                var child;
                rslt.resut;
                if ((child = b.exec(path, true)).success && b.exec(keyword('('), true).success) {
                    result.caller = child;
                    child = b.exec(expression, true);
                    if (child.success) {
                        result.args.push(child);
                        while (b.current && (b.current.char !== ')') && b.exec(keyword(','), true).success && (child = b.exec(expression, true)).success)
                            result.args.push(child);
                    }
                    if (b.exec(keyword(')'), false).success) {
                        rslt.resut = result;
                        return true;
                    }
                }
                return false;
            }
            parsers.functionCall = functionCall;
            function arrayCall(b, rslt) {
                b.exec(whitespace, true);
                rslt.tokon = CToken.arrayCall;
                var arg = expression;
                var child;
                if ((child = b.exec(path, true)).success && b.exec(keyword('['), true).success) {
                    var result = { index: void 0, caller: child };
                    if ((child = b.exec(arg, true)).success && b.exec(keyword(']')).success) {
                        result.index = child;
                        rslt.resut = result;
                        return true;
                    }
                }
                return false;
            }
            parsers.arrayCall = arrayCall;
            var coPathType;
            (function (coPathType) {
                coPathType[coPathType["bindscope"] = 0] = "bindscope";
                coPathType[coPathType["typedscope"] = 1] = "typedscope";
                coPathType[coPathType["subscop"] = 2] = "subscop";
                coPathType[coPathType["parentscop"] = 3] = "parentscop";
                coPathType[coPathType["namedscop"] = 4] = "namedscop";
                coPathType[coPathType["anonymousscop"] = 5] = "anonymousscop";
                coPathType[coPathType["thisscope"] = 6] = "thisscope";
                coPathType[coPathType["keyword"] = 7] = "keyword";
            })(coPathType = parsers.coPathType || (parsers.coPathType = {}));
        })(parsers = Parser.parsers || (Parser.parsers = {}));
        var _cache__ = new Map();
        function parseComposePath(str) {
            return Execute(str, Parser.parsers.cpath);
        }
        Parser.parseComposePath = parseComposePath;
        function parseExpression(str) {
            return Execute(str, Parser.parsers.fxpression);
        }
        Parser.parseExpression = parseExpression;
        function parseStringTemplate(str) {
            return Execute(str, Parser.parsers.fxpression);
        }
        Parser.parseStringTemplate = parseStringTemplate;
        function Execute(code, parser) {
            if (!DEBUG) {
                var y = _cache__.get(parser);
                if (y && (y = y.get(code)))
                    return y;
            }
            var s = new Parser.syntaxer(code);
            var r = s.exec(parser);
            if (!y)
                _cache__.set(parser, y = new Map());
            y.set(code, r);
            return r;
        }
        Parser.Execute = Execute;
    })(Parser = exports.Parser || (exports.Parser = {}));
    (function (Parser) {
        var StringTemplate = (function () {
            function StringTemplate() {
                this.stack = [];
                this.pcurs = 0;
                this.isCode = false;
            }
            Object.defineProperty(StringTemplate.prototype, "currentChar", {
                get: function () {
                    return this.code[this.curs];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(StringTemplate.prototype, "nextChar", {
                get: function () {
                    return this.code[this.curs + 1];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(StringTemplate.prototype, "MoveNext", {
                get: function () {
                    this.curs++;
                    return this.curs < this.len;
                },
                enumerable: true,
                configurable: true
            });
            StringTemplate.prototype.init = function (code) {
                this.code = code;
                this.curs = -1;
                this.len = code.length;
                this.stack = [];
                this.pcurs = 0;
                this.isCode = false;
            };
            StringTemplate.prototype.getString = function () {
                var end = this.currentChar;
                var s = this.curs + 1;
                var pc = '\0';
                while (this.MoveNext) {
                    {
                        if (pc === '\\')
                            continue;
                        pc = this.currentChar;
                        if (pc === end)
                            return this.code.substr(s, this.curs - s);
                    }
                }
                throw "Error";
            };
            StringTemplate.prototype._toStack = function () {
                var len = this.curs - this.pcurs;
                if (len != 0) {
                    var str = this.code.substr(this.pcurs, len);
                    if (str == 'debugger') {
                        debugger;
                        return;
                    }
                    this.stack.push(this.isCode ? { Code: str } : str);
                }
                if (this.curs < this.len) {
                    this.curs += 1;
                    this.pcurs = this.curs + 1;
                    this.isCode = !this.isCode;
                }
                else
                    this.isCode = false;
                return this.stack;
            };
            StringTemplate.prototype.Compile = function (code) {
                if (code[0] !== "=")
                    this.init(code);
                else
                    this.init(code.substr(1));
                while (this.MoveNext) {
                    var c = this.currentChar;
                    if (this.isCode) {
                        if (c === '"')
                            this.getString();
                        else if (c === "'")
                            this.getString();
                        else if (c === '}' && this.nextChar === "}")
                            this._toStack();
                    }
                    else if (c === '{' && this.nextChar === '{')
                        this._toStack();
                }
                return this._toStack();
            };
            StringTemplate.Compile = function (code) {
                return this.default.Compile(code);
            };
            StringTemplate.GenearteString = function (stack) {
                var strs = new Array(stack.length);
                for (var i = 0; i < stack.length; i++) {
                    var s = stack[i];
                    if (typeof s === 'string')
                        strs[i] = s;
                    else {
                        strs[i] = s.result;
                    }
                }
                return strs.join('');
            };
            StringTemplate.default = new StringTemplate();
            return StringTemplate;
        }());
        Parser.StringTemplate = StringTemplate;
    })(Parser = exports.Parser || (exports.Parser = {}));
    function isConstant(t) {
        return t.tokon <= Parser.CToken.string;
    }
    window['p'] = Parser;
});
define("sys/Dom", ["require", "exports", "sys/runtime", "sys/utils", "sys/Corelib"], function (require, exports, runtime_1, utils_1, Corelib_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var t;
    var Processor;
    (function (Processor) {
        var debug = (function () {
            function debug() {
            }
            debug.OnAttribute = function (name, value) {
                this.lst.push({ check: function (p) { return p.instance.attribute == name && p.value == value; } });
            };
            debug.check = function (p) {
                for (var _i = 0, _a = this.lst; _i < _a.length; _i++) {
                    var i = _a[_i];
                    if (i.check(p))
                        debugger;
                }
            };
            debug.lst = [];
            return debug;
        }());
        Processor.debug = debug;
        var Stat;
        (function (Stat) {
            Stat[Stat["None"] = 0] = "None";
            Stat[Stat["Waitting"] = 1] = "Waitting";
            Stat[Stat["Executing"] = 2] = "Executing";
            Stat[Stat["Executed"] = 3] = "Executed";
        })(Stat = Processor.Stat || (Processor.Stat = {}));
        var ComponentDef = (function () {
            function ComponentDef(arg) {
                this.arg = arg;
                var n = this.arg.name = this.name.toUpperCase();
                if (DEBUG && ComponentDef._store[n])
                    console.warn("The component " + n + " was overrided");
                ComponentDef._store[n] = this;
            }
            ComponentDef.get = function (tagName) {
                return this._store[tagName];
            };
            Object.defineProperty(ComponentDef.prototype, "name", {
                get: function () { return this.arg.name; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComponentDef.prototype, "attribute", {
                get: function () { return this.arg.name; },
                enumerable: true,
                configurable: true
            });
            ComponentDef.prototype.check = function (x, e) {
                return true;
            };
            ComponentDef.prototype.execute = function (x, e) {
                var a = this.arg;
                x.componentData = e.value;
                var f = typeof a.handler === 'function' ? a.handler : a.target[a.handler];
                var nd = f.call(a.target, {
                    node: x, instance: e, Services: this.getServices(a.Serices)
                }) || x;
                var cnt = nd.e.Control;
                if (!cnt)
                    return nd;
                cnt.$slots = x.componentData.slots;
                var parentControl = x.parent.Control;
                if (!cnt.Parent)
                    cnt.Parent = parentControl;
                if (cnt.View !== nd.e.dom)
                    nd.e.dom = utils_1.html.replace(nd.e.dom, cnt.View);
                return nd;
            };
            ComponentDef.prototype.getServices = function (Serices) {
                return ComponentDef.empty;
            };
            ComponentDef.prototype.valueParser = function (value) {
            };
            Object.defineProperty(ComponentDef.prototype, "priority", {
                get: function () { return 9007199254740000; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComponentDef.prototype, "isPrimitive", {
                get: function () { return true; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComponentDef.prototype, "isFinalizer", {
                get: function () { return false; },
                enumerable: true,
                configurable: true
            });
            ComponentDef.prototype.getSlots = function (dom) {
                var slots = {};
                var s;
                var x;
                while ((x = dom.firstChild)) {
                    dom.removeChild(x);
                    var a = x instanceof Element ? x.getAttribute('slot') || 'default' : 'default';
                    if (!(s = slots[a]))
                        slots[a] = [x];
                    else
                        s.push(x);
                }
                return slots;
            };
            ComponentDef.prototype.Initialize = function (ins, dom) {
                var arr = new Array(dom.attributes.length);
                ins.value = {
                    attributes: arr,
                    slots: this.getSlots(dom)
                };
                var src = Array.prototype.slice.call(dom.attributes, 0);
                var j = 0;
                var attrs = dom.attributes;
                for (var i = 0; i < src.length; i++) {
                    var a = attrs[i];
                    if (a.name[0] == '@')
                        dom.setAttribute(a.name.substr(0), a.value);
                    else
                        arr[j++] = a;
                }
                arr.length = j;
                for (var _i = 0, _a = ins.value; _i < _a.length; _i++) {
                    var c = _a[_i];
                    dom.removeChild(c);
                }
                this.arg.initialize && this.arg.initialize(ins, dom);
            };
            ComponentDef._store = {};
            ComponentDef.empty = [];
            return ComponentDef;
        }());
        var DerictivesExtractor = (function () {
            function DerictivesExtractor(dom, _attributes, skipTag, insertAttributes) {
                this.dom = dom;
                this.enumerator = [];
                var attributes = attributes || dom.attributes;
                if (!skipTag) {
                    var instance = ComponentDef.get(dom.tagName);
                    if (instance) {
                        (this.ComponentCreator = {
                            instance: instance,
                            manager: this, stat: Stat.Waitting,
                            value: dom
                        });
                        instance.Initialize(this.ComponentCreator, dom);
                    }
                }
                var notifies;
                var props;
                var attrbs;
                var events;
                Tree;
                var p;
                for (var i = 0; i < attributes.length; i++) {
                    var n = attributes[i].name;
                    if (n.indexOf('on-') === 0) {
                        if (!notifies)
                            this.enumerator.push({ manager: this, instance: DerictivesExtractor.getPrcessorByAttribute('on-'), value: events = {}, stat: Stat.Waitting });
                        events[n.substr(3)] = attributes[i].value;
                    }
                    else if (n.indexOf('on:') === 0) {
                        if (!notifies)
                            this.enumerator.push({ manager: this, instance: DerictivesExtractor.getPrcessorByAttribute('on:'), value: notifies = {}, stat: Stat.Waitting });
                        notifies[n.substr(3)] = attributes[i].value;
                    }
                    else if (n[0] == ':') {
                        if (!attrbs)
                            this.enumerator.push({
                                manager: this,
                                instance: DerictivesExtractor.getPrcessorByAttribute(':'),
                                value: attrbs = {}, stat: Stat.Waitting
                            });
                        attrbs[n.substr(1)] = attributes[i].value;
                    }
                    else if (n[1] == ':' && n[0] == 'p') {
                        if (!props)
                            this.enumerator.push({ manager: this, instance: DerictivesExtractor.getPrcessorByAttribute('p:'), value: props = {}, stat: Stat.Waitting });
                        props[n.substr(2)] = attributes[i].value;
                    }
                    else if (p = DerictivesExtractor._processors[n]) {
                        if (n.indexOf('db-') === 0) {
                            if (p) {
                                this.enumerator.push({ manager: this, instance: p, value: p.valueParser ? p.valueParser(attributes[i].value) : attributes[i].value, stat: Stat.Waitting });
                            }
                            else
                                throw new Error('the processor ' + n + ' is not defined');
                        }
                        else {
                            p && this.enumerator.push({ instance: p, value: p.valueParser ? p.valueParser(attributes[i].value) : attributes[i].value, manager: this, stat: Stat.Waitting });
                        }
                    }
                    else {
                        if (insertAttributes)
                            dom.setAttributeNode(attributes[i]);
                        continue;
                    }
                    dom && dom.removeAttribute(n);
                    if (!_attributes)
                        i--;
                }
                this.enumerator = this.enumerator.sort(DerictivesExtractor.orderInstances);
            }
            DerictivesExtractor.getPrcessorByName = function (name) {
                for (var i in this._processors) {
                    if (this._processors[i].name == name)
                        return this._processors[i];
                }
                return undefined;
            };
            DerictivesExtractor.getPrcessorByAttribute = function (name) {
                return this._processors[name];
            };
            DerictivesExtractor.stringIsNullOrWhiteSpace = function (s) {
                return !(s && s.trim());
            };
            DerictivesExtractor.registerComponent = function (p) {
                new ComponentDef(p);
            };
            DerictivesExtractor.register = function (p) {
                if (this.stringIsNullOrWhiteSpace(p.attribute))
                    throw new Error("attribute value is null");
                if (p.check && typeof p.check != 'function')
                    throw new Error("check value is not function");
                if (this.stringIsNullOrWhiteSpace(p.name))
                    p.name = p.attribute;
                p.attribute = p.attribute.toLowerCase();
                p.name = p.name.toLowerCase();
                if (!p.priority)
                    p.priority = ++this.maxPriority;
                if (this.maxPriority < p.priority)
                    this.maxPriority = p.priority;
                if (this._processors[p.attribute])
                    throw 'processor ' + p.attribute + ' cannot be re-define ';
                p.isPrimitive = !!p.isPrimitive;
                p.isFinalizer = !!p.isFinalizer;
                if (p.isFinalizer === p.isPrimitive && p.isFinalizer === true)
                    throw new Error("invalid arguments isPremitive && isFinalizer set to true");
                this._processors[p.attribute] = p;
                this.enumerator.push(p);
                this.enumerator.sort(this.orderDefs);
                return p;
            };
            DerictivesExtractor.orderDefs = function (a, b) {
                if (!!a.isPrimitive == !!b.isPrimitive)
                    return a.priority - b.priority;
                else if (a.isPrimitive)
                    return -1;
                else if (a.isFinalizer)
                    return 1;
            };
            DerictivesExtractor.orderInstances = function (a, b) {
                return DerictivesExtractor.orderDefs(a.instance, b.instance);
            };
            DerictivesExtractor.prototype.getProcessorByAttribute = function (processor) {
                for (var _i = 0, _a = this.enumerator; _i < _a.length; _i++) {
                    var i = _a[_i];
                    if (i.instance.attribute == processor)
                        return i;
                }
                return undefined;
            };
            DerictivesExtractor.CompileDerictives = function (x) {
                var dom = x.e.dom;
                if (dom.hasAttribute('compiled')) {
                    x.e.skipProcessing = true;
                    return x;
                }
                var cmp = new DerictivesExtractor(dom, void 0, false, false);
                if (cmp.ComponentCreator) {
                    var cnt = cmp.ComponentCreator.instance.execute(x, cmp.ComponentCreator);
                    x.controller.CurrentControl = cnt.Control;
                    cmp.Compile(cnt.NewScop(cnt.Control));
                    return new DerictivesExtractor(cnt.Dom, cmp.ComponentCreator.value.attributes, true, true).Compile(cnt);
                }
                else
                    return cmp.Compile(x);
            };
            DerictivesExtractor.prototype.Compile = function (x) {
                if (!this.enumerator.length)
                    return;
                var dom = x.e.dom;
                var y = x;
                var _cnt;
                dom.setAttribute('compiled', '');
                for (var _i = 0, _a = this.enumerator; _i < _a.length; _i++) {
                    var i = _a[_i];
                    if (!i.instance.check || i.instance.check(x, i)) {
                        y = i.instance.execute(y, i) || y || x;
                        var nc = (y || x).e.Control;
                        if (nc !== _cnt) {
                            x.controller.OldControl = _cnt;
                            x.controller.CurrentControl = nc;
                            _cnt = nc;
                        }
                    }
                }
                x.validateE();
                return y;
            };
            DerictivesExtractor._processors = {};
            DerictivesExtractor.enumerator = [];
            DerictivesExtractor.maxPriority = 0;
            return DerictivesExtractor;
        }());
        Processor.DerictivesExtractor = DerictivesExtractor;
        var Tree = (function () {
            function Tree(e, parent, controller) {
                this.e = e;
                this.parent = parent;
                this.controller = controller;
            }
            Tree.prototype.creteScopBuilderEventArgs = function (mode) {
                return {
                    bindingMode: mode, parent: this.Scop, parseResult: void 0, dom: this.Dom, controller: this.controller
                };
            };
            Object.defineProperty(Tree.prototype, "Scop", {
                get: function () { return this.e.Scop || (this.parent && this.parent.Scop) || (this.controller.Scop); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Tree.prototype, "ParentScop", {
                get: function () { return (this.parent && this.parent.Scop) || this.controller.Scop; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Tree.prototype, "Control", {
                get: function () { return this.e.Control || (this.parent && this.parent.Control) || this.controller.CurrentControl || this.controller.MainControll; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Tree.prototype, "Dom", {
                get: function () { return this.e.dom; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Tree.prototype, "IsNew", {
                get: function () {
                    if (this.parent)
                        return this.e.Scop != this.parent.Scop || this.e.Control != this.parent.Control || this.e.Jobs.length != 0;
                    else
                        return this.e.Scop != null || this.e.Jobs.length != 0;
                },
                enumerable: true,
                configurable: true
            });
            Tree.prototype.validateE = function () {
                if (this.IsNew) {
                    this.e.Scop = this.Scop;
                }
            };
            Tree.New = function (dom, parent, controller) {
                return new Tree({ dom: dom, Scop: null, Control: null, Jobs: [] }, parent, controller || (parent && parent.controller));
            };
            Tree.Root = function (dom, Scop, Control, controller) {
                return new Tree({ dom: dom, Scop: Scop, Control: Control, Jobs: [] }, null, controller || Control.__Controller__);
            };
            Tree.prototype.New = function (dom) {
                return new Tree({ dom: dom, Scop: null, Control: null, Jobs: [] }, this, this.controller);
            };
            Tree.prototype.NewScop = function (scop) {
                return new Tree({ dom: this.Dom, Scop: scop, Control: this.e.Control, Jobs: this.e.Jobs }, this.parent, this.controller);
            };
            Tree.prototype.NewControlScop = function (scop) {
                return new Tree({ dom: this.Dom, Scop: scop, Control: this.e.Control, Jobs: this.e.Jobs }, this.parent, this.controller);
            };
            Object.defineProperty(Tree.prototype, "Depth", {
                get: function () {
                    return this.parent ? this.parent.Depth + 1 : 1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Tree.prototype, "ContinueInto", {
                get: function () { return this.e.ContinueInto; },
                set: function (v) { this.e.ContinueInto = v; },
                enumerable: true,
                configurable: true
            });
            return Tree;
        }());
        Processor.Tree = Tree;
        var TreeWalker = (function () {
            function TreeWalker() {
            }
            TreeWalker.ParseBinding = function (data) {
                var data = Processor.DerictivesExtractor.CompileDerictives(data) || data;
                var instance = data.e;
                if (!instance.skipProcessing)
                    if (!instance.Control) {
                        if (instance.ContinueInto === null)
                            return data;
                        if (instance.ContinueInto)
                            TreeWalker.ParseBinding(data.New(instance.ContinueInto));
                        else
                            TreeWalker.ExploreTree(data);
                    }
                    else {
                        var i = instance.Control;
                        data.controller.CurrentControl = i;
                        var attr = attributes.Content.getData(instance.Control.getType());
                        if (!attr)
                            TreeWalker.ExploreTree(data);
                        else if (attr.type !== attributes.ContentType.premitive) {
                            if (instance.ContinueInto === null)
                                return data;
                            if (!instance.ContinueInto)
                                TreeWalker.processComponentChildren(data, instance, attr);
                            else
                                TreeWalker.processComponentChild(data, attr);
                        }
                        data.controller.OldControl = i;
                    }
                return data;
            };
            TreeWalker.setChild = function (e, attr) {
                var cnt = e.parent.Control;
                var arg = attr.selector ? attr.selector(e) : e;
                if (attr.IsProperty) {
                    cnt[attr.handler] = arg;
                    return e.child;
                }
                if (typeof attr.handler === 'string')
                    h = cnt[attr.handler];
                else if (typeof attr.handler === 'function')
                    var h = attr.handler;
                else
                    throw "Unvalide component handler";
                if (h)
                    h.call(cnt, arg);
                return e.child;
            };
            TreeWalker.processComponentChild = function (data, attr) {
                var x = TreeWalker.ParseBinding(data.New(data.ContinueInto));
                var c = x.Dom instanceof Element ? x.Dom.getAttribute('slot') || 'default' : 'default';
                this.setChild({ child: x, parent: data, slot: c }, attr);
            };
            TreeWalker.processComponentChildren = function (node, resultOfNode, attr) {
                TreeWalker.ExploreTree(node.NewScop(node.Control));
                node.Control.OnTemplateCompiled(node);
                var cs = node.componentData.slots;
                var child;
                for (var name_1 in cs) {
                    var slot = cs[name_1];
                    for (var i = 0; i < slot.length; i++) {
                        var c = slot[i];
                        if (c instanceof Element)
                            child = TreeWalker.ParseBinding(node.New(c));
                        else if (c instanceof Text) {
                            this.strTemplate(c, child = node.New(c));
                        }
                        else
                            child = node.New(c);
                        this.setChild({ child: child, parent: node, slot: name_1 }, attr);
                    }
                }
            };
            TreeWalker.strTemplate = function (text, x) {
                var c = Corelib_1.bind.GetStringScop(text.wholeText, { parent: x.Scop, controller: x.controller, dom: x.Dom, bindingMode: 1, parseResult: void 0 });
                if (typeof c === 'string')
                    return;
                c.AttacheTo(text);
                x.controller.registerScop(c);
                return c;
            };
            TreeWalker.ExploreTree = function (node) {
                if (node.skipProcessingChildren == true)
                    return;
                var cs = Array.prototype.slice.call(node.Dom.childNodes, 0);
                for (var i = 0; i < cs.length; i++) {
                    var el = cs[i];
                    if (!(el instanceof Element)) {
                        if (el.constructor === Text)
                            TreeWalker.strTemplate(el, node);
                        continue;
                    }
                    if (el.hasAttribute('controlled'))
                        continue;
                    this.ParseBinding(node.New(el));
                }
            };
            return TreeWalker;
        }());
        Processor.TreeWalker = TreeWalker;
        function register(p) {
            DerictivesExtractor.register(p);
        }
        Processor.register = register;
        var Compiler = (function () {
            function Compiler() {
            }
            return Compiler;
        }());
        Processor.Compiler = Compiler;
        function Register(p) {
            return Processor.DerictivesExtractor.register(p);
        }
        Processor.Register = Register;
        function Compile(x) {
            return DerictivesExtractor.CompileDerictives(x);
        }
        Processor.Compile = Compile;
    })(Processor = exports.Processor || (exports.Processor = {}));
    var attributes;
    (function (attributes) {
        var ContentType;
        (function (ContentType) {
            ContentType[ContentType["multiple"] = 0] = "multiple";
            ContentType[ContentType["premitive"] = 1] = "premitive";
            ContentType[ContentType["signle"] = 2] = "signle";
            ContentType[ContentType["costum"] = 3] = "costum";
        })(ContentType = attributes.ContentType || (attributes.ContentType = {}));
        attributes.Content = function (param) {
            return function (target) {
                param.target = target;
                param.type = param.type || ContentType.multiple;
                attributes.Content.declare(target, param);
                if (!param.getHandler)
                    param.getHandler = getHandler;
            };
        };
        function getHandler(cnt) {
            var _this = this;
            if (this.IsProperty)
                return function (a) {
                    cnt[_this.handler] = a;
                    return a;
                };
            if (typeof this.handler === 'string')
                return cnt[this.handler];
            else if (typeof this.handler === 'function')
                return this.handler;
            throw "Unvalide component handler";
        }
        runtime_1.Attributes.asAttribute(attributes.Content, { AllowMultiple: false, Heritable: true, Target: runtime_1.Attributes.AttributeTargets.Class });
        function ContentHandler(keepInTree) {
            return function (target, propertyKey, des) {
                var isfn = des && (typeof des.value === 'function');
                var type = runtime_1.reflection.IsPrototype(target) ? target.constructor : target;
                var param = {
                    handler: isfn ? des.value : propertyKey, keepInTree: keepInTree, type: type,
                    IsProperty: !isfn,
                };
                if (typeof param.handler !== 'function')
                    throw "Function required";
                attributes.Content.declare(type, param);
                param.getHandler = getHandler;
            };
        }
        attributes.ContentHandler = ContentHandler;
    })(attributes = exports.attributes || (exports.attributes = {}));
    (function (attributes) {
        attributes.Component = function (param) {
            return function (target) {
                param.target = target;
                if (typeof param.handler == 'string')
                    param.handler = target[param.handler];
                if (typeof param.initialize == 'string')
                    param.initialize = target[param.initialize];
                attributes.Component.declare(target, param);
                Processor.DerictivesExtractor.registerComponent(param);
            };
        };
        runtime_1.Attributes.asAttribute(attributes.Component, { AllowMultiple: false, Heritable: false, Target: runtime_1.Attributes.AttributeTargets.Class });
        function ComponentHandler(name, initializer) {
            return function (target, _propertyKey, des) {
                var param = {
                    name: name, handler: des && des.value,
                    initialize: initializer
                };
                if (typeof param.handler !== 'function')
                    throw "Function required";
                attributes.Component.declare(target, param);
                Processor.DerictivesExtractor.registerComponent(param);
            };
        }
        attributes.ComponentHandler = ComponentHandler;
        function PushTest(title, fn, owner) {
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            if (!(fn instanceof Function))
                throw "function erquired";
            else
                throw "function erquired";
            _tests.push({ fn: fn, owner: owner, args: args, title: title });
        }
        attributes.PushTest = PushTest;
        function PushMultiTest(title, fn, owner) {
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            if (!(fn instanceof Function))
                throw "function erquired";
            _tests.push({ fn: fn, owner: owner, args: args, title: title });
        }
        attributes.PushMultiTest = PushMultiTest;
        function Test(title, owner) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return function (target, _propertyKey, des) {
                var fn;
                if (des && des.value instanceof Function)
                    fn = des.value;
                else
                    throw "function erquired";
                if (!owner && runtime_1.reflection.IsClass(target))
                    owner = target;
                _tests.push({ fn: fn, owner: owner, args: args, title: title });
            };
        }
        attributes.Test = Test;
        function MultiTest(title, owner) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return function (target, _propertyKey, des) {
                var fn;
                if (des && des.value instanceof Function)
                    fn = des.value;
                if (!owner && runtime_1.reflection.IsClass(target))
                    owner = target;
                _tests.push({ fn: fn, owner: owner, args: args, title: title, multiTest: true });
            };
        }
        attributes.MultiTest = MultiTest;
        function runTests() {
            var log = new Array();
            function exec(test, args) {
                var cx = { args: args, test: test, start: performance.now() };
                try {
                    if (args && !(args instanceof Array))
                        if (!('length' in args))
                            args = [args];
                    cx.result = test.fn.apply(test.owner, args);
                    cx.success = true;
                }
                catch (error) {
                    cx.result = error;
                    cx.success = false;
                }
                cx.end = performance.now();
                return cx;
            }
            for (var _i = 0, _tests_1 = _tests; _i < _tests_1.length; _i++) {
                var test = _tests_1[_i];
                if (test.multiTest) {
                    if (test.args)
                        for (var _a = 0, _b = test.args; _a < _b.length; _a++) {
                            var stest = _b[_a];
                            log.push(exec(test, stest));
                        }
                    else
                        log.push(exec(test));
                }
                else
                    log.push(exec(test, test.args));
            }
            console.log(log);
            return log;
        }
        attributes.runTests = runTests;
        Object.defineProperty(window, 'runTests', { get: function () { return runTests; } });
        var _tests = [];
    })(attributes = exports.attributes || (exports.attributes = {}));
    (function (attributes) {
        attributes.Event = function (param) {
            return function (target) {
                if (!param)
                    param = {};
                param.target = target;
                var data = attributes.Event.getData(target);
                if (!data)
                    attributes.Event.declare(target, data = {});
                data[param.name] = param;
            };
        };
        runtime_1.Attributes.asAttribute(attributes.Event, { AllowMultiple: false, Heritable: false, Target: runtime_1.Attributes.AttributeTargets.Class });
        attributes.Event.getEventData = function (type, name) {
            var data = attributes.Event.getData(type);
            return data ? data[name] : void 0;
        };
    })(attributes = exports.attributes || (exports.attributes = {}));
    (function (attributes) {
        attributes.Component = function (param) {
            return function (target) {
                param.target = target;
                attributes.Component.declare(target, param);
                Processor.DerictivesExtractor.registerComponent(param);
            };
        };
        runtime_1.Attributes.asAttribute(attributes.Component, { AllowMultiple: false, Heritable: false, Target: runtime_1.Attributes.AttributeTargets.Class });
    })(attributes = exports.attributes || (exports.attributes = {}));
    (function (attributes) {
        attributes.Parser2Scop = function (param) {
            return function (target) {
                param.target = target;
                attributes.Parser2Scop.declare(target, param);
                if (!param.handler)
                    param.handler = function (e) {
                        return new target(e);
                    };
                Corelib_1.bind.Scop.RegisterScop(param.token, param.handler);
            };
        };
        runtime_1.Attributes.asAttribute(attributes.Parser2Scop, { AllowMultiple: false, Heritable: false, Target: runtime_1.Attributes.AttributeTargets.Class });
        function Parser2ScopHandler(token) {
            return function (target, propertyKey, des) {
                var isfn = des && typeof des.value === 'function';
                if (!isfn)
                    throw "Implimentation function expected";
                target = runtime_1.reflection.IsPrototype(target) ? target.constructor : target;
                var param = {
                    target: target, token: token, handler: des.value
                };
                attributes.Parser2Scop.declare(target, param);
                Corelib_1.bind.Scop.RegisterScop(param.token, param.handler);
            };
        }
        attributes.Parser2ScopHandler = Parser2ScopHandler;
    })(attributes = exports.attributes || (exports.attributes = {}));
    var ProcessStat;
    (function (ProcessStat) {
        ProcessStat[ProcessStat["NotProcessed"] = 0] = "NotProcessed";
        ProcessStat[ProcessStat["Processing"] = 1] = "Processing";
        ProcessStat[ProcessStat["Processed"] = 2] = "Processed";
    })(ProcessStat = exports.ProcessStat || (exports.ProcessStat = {}));
    var Controller = (function (_super) {
        __extends(Controller, _super);
        function Controller(cnt) {
            var _this = _super.call(this) || this;
            _this.scops = [];
            _this._stat = 0;
            _this._JCParent = [];
            _this._onCompiled = [];
            _this._onCompiling = [];
            _this.instances = [];
            if (cnt)
                _this.CurrentControl = cnt;
            return _this;
        }
        Controller.prototype.registerScop = function (scop) {
            this.scops.push(scop);
        };
        Controller.prototype.unregisterScop = function (arg0) {
            var i = 0;
            while ((i = this.scops.indexOf(arg0)) != -1) {
                this.scops.splice(i, 1);
            }
        };
        Controller.prototype.OnNodeLoaded = function () {
            this.ProcessBinding();
        };
        Object.defineProperty(Controller.prototype, "MainControll", {
            get: function () { return this._JCParent[0]; },
            enumerable: true,
            configurable: true
        });
        Controller.Attach = function (control, data) {
            var t = new Controller(control);
            t.Scop = data instanceof Corelib_1.bind.Scop || data == null ? data : new Corelib_1.bind.ValueScop(data);
            t.View = control.View;
            return t;
        };
        Controller.prototype.getStat = function () { return this._stat; };
        ;
        Object.defineProperty(Controller.prototype, "Stat", {
            set: function (v) {
                if (v <= this._stat)
                    return;
                this._stat = v;
                if (v === 1 || v === 2)
                    this.processEvent(v);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Controller.prototype, "processHowEver", {
            get: function () { return false; },
            set: function (v) { },
            enumerable: true,
            configurable: true
        });
        Controller.__feilds__ = function () { return [Controller.DPView]; };
        Object.defineProperty(Controller.prototype, "View", {
            get: function () { return this.get(Controller.DPView); },
            set: function (value) { this.set(Controller.DPView, value); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Controller.prototype, "OnCompiled", {
            set: function (callback) {
                if (this._stat > 1)
                    callback.Invoke.call(callback.Owner, this);
                else
                    this._onCompiled.push(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Controller.prototype, "OnCompiling", {
            set: function (callback) {
                if (this._stat > 0)
                    callback.Invoke.call(callback.Owner, this);
                else
                    this._onCompiling.push(callback);
            },
            enumerable: true,
            configurable: true
        });
        Controller.prototype.ViewChanged = function (e) {
            var dom = e._new;
            var odom = e._old;
            if (dom === odom)
                return;
            if (odom)
                this.unlistenForNodeInsertion(odom), odom.removeAttribute('controlled');
            if (dom == null)
                return;
            dom.setAttribute('controlled', '');
            if (this.processHowEver || this.implemented(dom)) {
                this.Stat = 0;
                this.ProcessBinding();
            }
            else
                this.listenForNodeInsertion(dom);
        };
        Controller.prototype.unlistenForNodeInsertion = function (odom, ndisp) {
            if (!ndisp)
                this.PDispose();
            runtime_1.Dom.RemoveListener(odom);
        };
        Controller.prototype.listenForNodeInsertion = function (dom) {
            runtime_1.Dom.OnNodeInserted(this, dom);
        };
        Controller.prototype.implemented = function (d) {
            return document.body.contains(d);
        };
        Controller.prototype.handleEvent = function (e) {
            var v = this.View;
            if (e.srcElement == e.target && e.currentTarget == v) {
                e.preventDefault();
                this.unlistenForNodeInsertion(v, true);
                this.ProcessBinding(e);
            }
        };
        Controller.prototype.ProcessBinding = function (e) {
            if (this._stat)
                return;
            if (this.Scop == null)
                debugger;
            runtime_1.PaintThread.OnPaint({ args: [this, runtime_1.helper.detach(this.View)], method: Controller.pb, owner: this });
        };
        Controller.pb = function (t, attacher) {
            if (t._stat)
                return;
            t.Stat = 1;
            var root = Processor.Tree.Root(null, t.Scop, t.CurrentControl, t);
            if (t.Scop == null)
                debugger;
            var v = t.View;
            var x = runtime_1.helper.TryCatch(t, Processor.TreeWalker.ParseBinding, void 0, [root.New(t.View)]);
            attacher && attacher(x && x.Dom);
            t.Stat = 2;
        };
        Object.defineProperty(Controller.prototype, "CurrentControl", {
            get: function () { return this._JCParent[this._JCParent.length - 1]; },
            set: function (v) {
                if (!v)
                    return;
                var i = this._JCParent.indexOf(v);
                if (i == -1)
                    this._JCParent.push(v);
                else
                    this._JCParent.splice(i + 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Controller.prototype, "OldControl", {
            set: function (v) {
                if (!v || this._JCParent.length < 2)
                    return;
                var i = this._JCParent.indexOf(v);
                if (i !== -1)
                    this._JCParent.splice(i);
            },
            enumerable: true,
            configurable: true
        });
        Controller.prototype.processEvent = function (v) {
            var c = v === 1 ? this._onCompiling : this._onCompiled;
            var x = c.slice();
            c.length = 0;
            for (var i = 0; i < x.length; i++) {
                var t = x[i];
                runtime_1.helper.TryCatch(t.Owner, t.Invoke, void 0, [this]);
            }
        };
        Controller.prototype.PDispose = function () {
            var v = this.View;
            if (v != null)
                this.unlistenForNodeInsertion(v);
            for (var j = this.instances.length - 1; j >= 0; j--)
                this.instances[j].Dispose();
            for (var i = 0; i < this.scops.length; i++) {
                this.scops[i].Dispose();
            }
            this.Stat = 0;
            this.instances.length = 0;
        };
        Controller.prototype.Dispose = function () {
            var h = this.OnDispose();
            if (h === null)
                return;
            this.PDispose();
            _super.prototype.Dispose.call(this);
            if (!h)
                this.DisposingStat = 2;
        };
        Controller.prototype.createJobInstance = function (name, x) {
            var s = x.Scop;
            if (name[0] == '.')
                c = s.GetJob(name.substring(0));
            else
                var c = Corelib_1.bind.GetJob(name);
            var ji = s.AddJob(c, x.Dom);
            this.instances.push(ji);
            return ji;
        };
        Controller.DPView = Corelib_1.bind.DObject.CreateField("View", HTMLElement, null, function (e) { return e.__this.ViewChanged(e); }, function (e) { return e.__this.PDispose(); });
        return Controller;
    }(Corelib_1.bind.DObject));
    exports.Controller = Controller;
    var xNode = (function () {
        function xNode(node, param, unknown) {
            this.node = node;
            this.param = param;
            this.unknown = unknown;
            this.children = [];
            if (!unknown)
                this.unknown = [];
        }
        xNode.prototype.add = function (node, param) {
            var v = new xNode(node, param, this.unknown);
            v = this.__add(v);
            if (this.unknown.length)
                return this.Validate();
            return v;
        };
        xNode.prototype.__add = function (v) {
            var t = this._add(v);
            if (t)
                return t;
            for (var i = 0; i < this.unknown.length; i++) {
                if (t = this.unknown[i]._add(v))
                    return t;
            }
            for (var i = 0; i < this.unknown.length; i++)
                if (this.unknown[i].node == v.node)
                    return this;
            this.unknown.push(v);
            return this;
        };
        xNode.prototype.Validate = function () {
            var t = this;
            for (var i = 0; i < this.unknown.length; i++) {
                var t1 = this._add(this.unknown[i]);
                if (t1) {
                    this.unknown.splice(i, 1);
                    i--;
                }
            }
            return this;
        };
        xNode.prototype.ReValidate = function (callback) {
            if (this.unknown) {
                for (var i = 0; i < this.unknown.length; i++) {
                    if (this.node.contains(this.unknown[i].node)) {
                        callback(this.unknown[i]);
                        this.unknown.splice(i, 1);
                        i--;
                    }
                }
            }
        };
        xNode.prototype.get = function (node) {
            for (var i = 0; i < this.children.length; i++) {
                var c = this.children[i];
                if (c.node == node)
                    return c;
                if (c = c.get(node))
                    return c;
            }
        };
        xNode.prototype._add = function (node) {
            var s = false;
            if (this.node.contains(node.node)) {
                for (var i = 0; i < this.children.length; i++) {
                    var c = this.children[i];
                    if (node.node == c.node)
                        return this;
                    if (c._add(node))
                        return this;
                    if (node.node.contains(c.node))
                        this.children.splice(i, 1, c);
                }
                if (this.children.indexOf(node) == -1)
                    this.children.push(node);
                return this;
            }
            if (this.node == node.node)
                return this;
            if (node.node.contains(this.node))
                return node._add(this);
            return undefined;
        };
        xNode.prototype.remove = function (node) {
            for (var i = 0; i < this.children.length; i++) {
                var c = this.children[i];
                if (c.node == node) {
                    this.children.push.apply(this.children, c.children);
                    this.children.splice(i, 1);
                    return c;
                }
                else if (c = c.remove(node))
                    return c;
            }
        };
        xNode.prototype.hasChild = function (node) {
            for (var i = 0; i < this.children.length; i++) {
                var c = this.children[i];
                if (node.contains(c.node))
                    return c;
                if (c = c.hasChild(node))
                    return c;
            }
        };
        xNode.prototype.foreach = function (callback, parent) {
            var t = callback(parent, this);
            if (t > 0)
                return t;
            for (var i = 0; i < this.children.length; i++) {
                var t = this.children[i].foreach(callback, this);
                if (t > 0)
                    return t - 1;
            }
            return 0;
        };
        return xNode;
    }());
    exports.xNode = xNode;
    function removeItem(arr, elem, count) {
        var i = arr.indexOf(elem);
        if (i != -1)
            arr.splice(i, count);
    }
});
define("sys/runtime", ["require", "exports", "context"], function (require, exports, context_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var helper;
    (function (helper) {
        helper.MaxSafeInteger = 9223372036854775807;
        function detach(node) {
            var parent = node.parentNode;
            var next = node.nextSibling;
            if (parent)
                parent.removeChild(node);
            return function reattach(nnode) {
                parent && parent.insertBefore(nnode || node, next);
            };
        }
        helper.detach = detach;
        function TryCatch(owner, Try, Catch, params) {
            try {
                if (Try)
                    return Try.apply(owner, params);
                var e = new Error('Undefined Try Block');
            }
            catch (ei) {
                e = ei;
            }
            return Catch && Catch.apply(owner, (params = params.slice(), params.unshift(e), params));
        }
        helper.TryCatch = TryCatch;
        function $defineProperty(o, p, attributes, onError) {
            return helper.TryCatch(Object, Object.defineProperty, onError, [o, p, attributes]) || false;
        }
        helper.$defineProperty = $defineProperty;
    })(helper = exports.helper || (exports.helper = {}));
    var reflection;
    (function (reflection) {
        var _p = false;
        var MethodGroup = (function () {
            function MethodGroup(f, Owner) {
                this.Owner = Owner;
                this._list = [];
                if (f)
                    this._list.push(f);
            }
            MethodGroup.prototype.add = function (m) {
                this._list.push(m);
                return this;
            };
            MethodGroup.prototype.With = function (owner) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var x = this.Owner;
                this.Owner = owner;
                var r = helper.TryCatch(this, this.Invoke, void 0, args);
                this.Owner = x;
                return r;
            };
            MethodGroup.prototype.Clone = function () {
                var t = new MethodGroup();
                t._list = this._list.slice();
                return t;
            };
            return MethodGroup;
        }());
        reflection.MethodGroup = MethodGroup;
        MethodGroup.prototype.Invoke = function () {
            for (var i = 0; i < this._list.length; i++) {
                var f = this._list[i];
                var r;
                try {
                    if (typeof f === 'function') {
                        r = f.apply(this.Owner, arguments);
                    }
                    else if (f instanceof MethodGroup)
                        r = f.Invoke.apply(f, arguments);
                    else if ('Invoke' in f) {
                        r = f.Invoke.apply(f.Owner || this.Owner, arguments);
                    }
                }
                catch (e) {
                }
            }
            return r;
        };
        function ToMethodGroup(x) {
            if (x instanceof MethodGroup)
                return x;
            return new MethodGroup(x);
        }
        reflection.ToMethodGroup = ToMethodGroup;
        function Invoke(f, owner, args) {
            var r;
            try {
                if (typeof f === 'function') {
                    r = f.apply(owner, args);
                }
                else if (f instanceof MethodGroup)
                    r = f.Invoke.apply(f, args);
                else if ('Invoke' in f) {
                    r = f.Invoke.apply(f.Owner || owner, args);
                }
            }
            catch (e) {
            }
            return r;
        }
        reflection.Invoke = Invoke;
        var $slice = Array.prototype.slice;
        function ReCalc(callHistory, befor, direct) {
            if (!callHistory)
                callHistory = this.Stack[this.Stack.length - 1];
            if (typeof callHistory === 'number')
                var callHistory = this.Stack[callHistory];
            if (befor)
                befor.apply(callHistory.caller, callHistory.arguments);
            if (callHistory)
                return (direct ? this.fn : this.proxy).apply(callHistory.caller, callHistory.arguments);
        }
        function debug(dbgInfo, callback) {
            if (!dbgInfo.Stack)
                dbgInfo.Stack = [];
            dbgInfo.ReCalc = ReCalc;
            dbgInfo.proxy = function () {
                var args = $slice.call(arguments);
                if (dbgInfo.obsArgs !== false)
                    for (var i = 0; i < args.length; i++) {
                        if (typeof args[i] === 'function')
                            if (args[i].__isProxy)
                                debug({
                                    save: dbgInfo.save,
                                    callback: dbgInfo.callback,
                                    obsArgs: dbgInfo.obsArgs,
                                    Stack: dbgInfo.Stack,
                                    fn: args[i],
                                    ReCalc: ReCalc,
                                    debug: false
                                }, function (s) { args[i] = s.proxy; });
                    }
                if (dbgInfo.debug)
                    stop();
                if (dbgInfo.save)
                    dbgInfo.Stack.push({ caller: this, arguments: args, fn: dbgInfo.fn });
                if (dbgInfo.callback)
                    dbgInfo.callback.apply(this, args);
                return dbgInfo.fn && dbgInfo.fn.apply(this, args);
            };
            dbgInfo.proxy.__isProxy = true;
            dbgInfo.proxy.__Fn = dbgInfo.fn;
            if (callback)
                callback(dbgInfo);
            return dbgInfo;
        }
        function debugObj(obj, stack) {
            for (var i in obj) {
                try {
                    var v = obj[i];
                }
                catch (e) {
                    continue;
                }
                if (typeof v === 'function')
                    (function (fName) {
                        debug({ save: true, Stack: stack, fn: obj[fName], debug: false }, function (s) { obj[fName] = s.proxy; });
                    })(i);
            }
        }
        function isInstanceOfClassName(instance, className) {
            while ((instance = instance.__proto__)) {
                if (instance.constructor.name == className)
                    return true;
            }
            return false;
        }
        reflection.isInstanceOfClassName = isInstanceOfClassName;
        function isInstanceOfClass(instance, type) {
            while ((instance = instance.__proto__)) {
                if (instance.constructor === type)
                    return true;
            }
            return false;
        }
        reflection.isInstanceOfClass = isInstanceOfClass;
        function _isInstanceOf(type, superType) {
            var t = type;
            while (type) {
                if (type == superType)
                    return true;
                t = t.base;
            }
            return false;
        }
        reflection._isInstanceOf = _isInstanceOf;
        function GetBaseType(type) {
            if (type instanceof reflection.GenericType) {
                return type.GetBaseType();
            }
            var p = type.prototype.__proto__;
            if (p == null)
                return null;
            return p.constructor;
        }
        reflection.GetBaseType = GetBaseType;
        function GetBaseTypes(type, totype) {
            var l = [];
            var pr = type.prototype;
            do {
                if (pr.constructor == totype)
                    break;
                l.push(pr.constructor);
                pr = pr.__proto__;
            } while (pr !== null);
            return l;
        }
        reflection.GetBaseTypes = GetBaseTypes;
        function IsInstanceOf(type, superType) {
            if (type === superType || superType === Object)
                return true;
            if (type.constructor == reflection.GenericType)
                type = type.Constructor;
            if (superType.constructor == reflection.GenericType)
                superType = superType.Constructor;
            var pr = type.prototype;
            do {
                if (pr.constructor === superType)
                    return true;
                pr = pr.__proto__;
            } while (pr !== null);
            return false;
        }
        reflection.IsInstanceOf = IsInstanceOf;
        var Type = (function () {
            function Type(type) {
                this.passed = [];
                this.type = type;
            }
            Type.prototype._getPath = function (root) {
                for (var i in root) {
                    var v = root[i];
                    if (this.passed.indexOf(v) !== -1)
                        continue;
                    this.passed.push(v);
                    switch (typeof v) {
                        case 'string':
                        case 'number':
                        case 'boolean':
                        case 'undefined': continue;
                        default:
                            if (v === this.type) {
                                return i;
                            }
                            if (v instanceof Function)
                                continue;
                            var x = this._getPath(v);
                            if (x != null)
                                return i + '.' + x;
                            break;
                    }
                }
            };
            Type.prototype.GetType = function (root) {
                if (this.passed == null)
                    this.passed = [];
                this.passed.length = 0;
                return this._getPath(root);
            };
            return Type;
        }());
        reflection.Type = Type;
        var _gtypes;
        function gtypes() {
            return _gtypes || (_gtypes = new Map());
        }
        var GenericType = (function () {
            function GenericType(Constructor, Params, base) {
                this.Constructor = Constructor;
                this.Params = Params;
                this.prototype = Constructor.prototype;
                if (!_p)
                    throw this;
                gtypes().set(this, base);
                _p = false;
            }
            Object.defineProperty(GenericType.prototype, "base", {
                get: function () { return gtypes().get(this); },
                enumerable: true,
                configurable: true
            });
            GenericType.prototype.GetBaseType = function () {
                return gtypes().get(this);
            };
            GenericType.GetType = function (type, params, checkOnly, base) {
                if (typeof type !== 'function')
                    throw 'type must be fanction';
                if (params == null || params.length === 0)
                    return type;
                var i = this.i(type);
                for (var iter = gtypes().entries(), c = iter.next(); !c.done; c = iter.next()) {
                    var k = c.value[0];
                    var v = c.value[1];
                    if (type == k.Constructor) {
                        if (params.length == k.Params.length) {
                            var p = k.Params;
                            for (var j = p.length - 1; j >= 0; j--) {
                                if (p[j] != params[j]) {
                                    p = undefined;
                                    break;
                                }
                            }
                            if (p)
                                return k;
                        }
                    }
                }
                if (checkOnly)
                    return;
                _p = true;
                return new GenericType(type, params, base == null ? GetBaseType(type) : base);
            };
            GenericType.i = function (f) { return f instanceof GenericType ? 1 : 0; };
            GenericType.IsInstanceOf = function (type, superType) {
                return this._isInstanceOf[this.i(type) + this.i(superType) * 2](type, superType);
            };
            GenericType._isInstanceOf = [
                function (type, superType) {
                    return IsInstanceOf(type, superType);
                },
                function (type, superGType) {
                    return IsInstanceOf(type, superGType.Constructor);
                },
                function (gtype, superGType) {
                    return IsInstanceOf(gtype.Constructor, superGType.Constructor);
                },
                function (gtype, superType) {
                    return IsInstanceOf(gtype.Constructor, superType);
                }
            ];
            return GenericType;
        }());
        reflection.GenericType = GenericType;
        Function.prototype.IsInstanceOf = reflection.IsInstanceOf;
        var DelayedType = (function () {
            function DelayedType(type) {
                this._type = type;
            }
            Object.defineProperty(DelayedType.prototype, "Type", {
                get: function () {
                    return this._type();
                },
                enumerable: true,
                configurable: true
            });
            return DelayedType;
        }());
        reflection.DelayedType = DelayedType;
        ;
        var Observable;
        (function (Observable) {
            var events = [];
            function observeProperty(obj, propName, evnt) {
                var c = Object.getOwnPropertyDescriptor(obj, propName);
                helper.$defineProperty(obj, propName, {
                    get: c.get,
                    set: function (v) {
                        var oldValue = c.get.call(this);
                        if (v === oldValue)
                            return;
                        c.set.call(this, v);
                        var event = events.length == 0 ? document.createEvent('Event') : events.pop();
                        event.initEvent(evnt, true, true);
                        event.oldValue = oldValue;
                        event.newValue = v;
                        dispatchEvent(new Event(evnt, { bubbles: false, cancelable: true, scoped: false }));
                        if (this instanceof EventTarget)
                            this.dispatchEvent(event);
                        else
                            dispatchEvent(event);
                        events.push(event);
                    }
                });
            }
            Observable.observeProperty = observeProperty;
            function setObservableProperty(obj, propName, get, set, evnt) {
                helper.$defineProperty(obj, propName, {
                    get: get,
                    set: function (v) {
                        var oldValue = get.call(this);
                        if (v === oldValue)
                            return;
                        set.call(this, v);
                        var event = events.length == 0 ? document.createEvent('Event') : events.pop();
                        event.initEvent(evnt, true, true);
                        event.oldValue = oldValue;
                        event.newValue = v;
                        dispatchEvent(new Event(evnt, { bubbles: true, cancelable: true, scoped: true }));
                        if (this instanceof EventTarget)
                            this.dispatchEvent(event);
                        else
                            dispatchEvent(event);
                        events.push(event);
                    }
                });
            }
            Observable.setObservableProperty = setObservableProperty;
            helper.$defineProperty(Node.prototype, 'value', { get: function () { return this.textContent; }, set: function (v) { this.textContent = v; } });
            observeProperty(Node.prototype, 'textContent', 'textContentChanged');
            function ObjectToObservable(o) {
            }
            Observable.ObjectToObservable = ObjectToObservable;
        })(Observable = reflection.Observable || (reflection.Observable = {}));
        function IsClass(obj) {
            return obj && 'prototype' in obj && typeof obj === 'function';
        }
        reflection.IsClass = IsClass;
        function IsPrototype(obj) {
            return typeof obj === 'object' && 'constructor' in obj && IsClass(obj.constructor) && !(obj instanceof obj.constructor);
        }
        reflection.IsPrototype = IsPrototype;
        function IsInstance(obj) {
            return 'constructor' in obj && obj instanceof obj.constructor;
        }
        reflection.IsInstance = IsInstance;
        var NativeTypes;
        (function (NativeTypes) {
            NativeTypes[NativeTypes["Nullable"] = 0] = "Nullable";
            NativeTypes[NativeTypes["Boolean"] = 1] = "Boolean";
            NativeTypes[NativeTypes["Number"] = 2] = "Number";
            NativeTypes[NativeTypes["String"] = 3] = "String";
            NativeTypes[NativeTypes["Function"] = 4] = "Function";
            NativeTypes[NativeTypes["Array"] = 5] = "Array";
            NativeTypes[NativeTypes["Object"] = 6] = "Object";
            NativeTypes[NativeTypes["DObject"] = 7] = "DObject";
        })(NativeTypes = reflection.NativeTypes || (reflection.NativeTypes = {}));
    })(reflection = exports.reflection || (exports.reflection = {}));
    var Attributes;
    (function (Attributes) {
        var AttributeTargets;
        (function (AttributeTargets) {
            AttributeTargets[AttributeTargets["Class"] = 2] = "Class";
            AttributeTargets[AttributeTargets["Object"] = 4] = "Object";
            AttributeTargets[AttributeTargets["Function"] = 8] = "Function";
            AttributeTargets[AttributeTargets["Property"] = 16] = "Property";
            AttributeTargets[AttributeTargets["All"] = -1] = "All";
        })(AttributeTargets = Attributes.AttributeTargets || (Attributes.AttributeTargets = {}));
        var __attributes = new Map();
        var __defs = new Map();
        function getAttributes(_target) {
            return __attributes.get(_target);
        }
        function setAttributeToClass(_target, _attribute, value) {
            var x = __attributes.get(_target);
            if (!x)
                __attributes.set(_target, x = new Map());
            x.set(_attribute, value);
        }
        function _declare(_target, value) {
            setAttributeToClass(_target, this, value);
        }
        function getData(_target) {
            return getAttributeOf(_target, this);
        }
        function asAttribute(attributer, e) {
            attributer['declare'] = _declare;
            attributer['getData'] = getData;
            __defs.set(attributer, e);
        }
        Attributes.asAttribute = asAttribute;
        function getAttributeDef(attr) {
            return __defs.get(attr);
        }
        Attributes.getAttributeDef = getAttributeDef;
        function check(attr, args) {
            var a = getAttributeDef(attr);
            if (!a)
                return true;
            var d = args[2];
            var n = args[1];
            var t = args[0];
            switch (a.Target) {
                case AttributeTargets.All:
                    return true;
                case AttributeTargets.Class:
                    return reflection.IsClass(t);
                case AttributeTargets.Function:
                    return !!(d && (typeof d.value === 'function'));
                case AttributeTargets.Object:
                    return !!reflection.IsInstance(t);
                case AttributeTargets.Property:
                    return !!d;
                default:
                    return false;
            }
        }
        Attributes.check = check;
        function _getAttributeOf(_target, _attribute) {
            var x = __attributes.get(_target);
            return x && x.get(_attribute);
        }
        function getAttributesOf(_target) {
            return __attributes.get(_target);
        }
        Attributes.getAttributesOf = getAttributesOf;
        function getAttributeOf(_target, _attribute) {
            var x = _getAttributeOf(_target, _attribute);
            if (!x) {
                var def = getAttributeDef(_attribute);
                if (def && def.Heritable) {
                    var types = reflection.GetBaseTypes(_target, Object);
                    for (var i = 1; i < types.length; i++)
                        if (x = _getAttributeOf(types[i], _attribute))
                            return x;
                }
            }
            return x;
        }
        Attributes.getAttributeOf = getAttributeOf;
    })(Attributes = exports.Attributes || (exports.Attributes = {}));
    var thread;
    (function (thread) {
        var isRunning = false;
        var id = -1;
        var stack = [];
        var djobs = [];
        var cj = 0;
        ;
        var JobParam = (function () {
            function JobParam(id, params) {
                this.id = id;
                this.params = params || [];
            }
            JobParam.prototype.Set = function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i] = arguments[_i];
                }
                var p;
                for (var i = params.length - 1; i >= 0; i--)
                    if ((p = params[i]) === undefined)
                        continue;
                    else
                        this.params[i] = p;
                return this;
            };
            JobParam.prototype.Set1 = function (params) {
                var p;
                for (var i = params.length - 1; i >= 0; i--)
                    if ((p = params[i]) === undefined)
                        continue;
                    else
                        this.params[i] = p;
                return this;
            };
            JobParam.prototype.Clone = function () {
                var t = new JobParam(this.id);
                t.Set1(this.params);
                return t;
            };
            return JobParam;
        }());
        thread.JobParam = JobParam;
        var OnIdle = [];
        var isIdle;
        function asIdle() {
            isIdle = true;
            var idls = OnIdle.slice();
            var j = 0;
            for (var i = 0; i < idls.length; i++) {
                var t = idls[i];
                if (t.once) {
                    OnIdle.splice(i - j, 1);
                    j++;
                }
                helper.TryCatch(t.owner, t.callback);
            }
            isIdle = false;
            if (stack.length != 0) {
                clearTimeout(id);
                id = setTimeout(Dispatcher.start, 1);
                isRunning = true;
            }
        }
        var Dispatcher = (function () {
            function Dispatcher() {
            }
            Dispatcher.OnIdle = function (owner, callback, once) {
                if (isIdle || !isRunning)
                    helper.TryCatch(owner, callback);
                else
                    OnIdle.push({ owner: owner, callback: callback, once: once == true });
            };
            Dispatcher.InIdle = function () { return !isRunning; };
            Dispatcher.GC = function () {
                for (var i = 0, l = djobs.length; i < l; i++) {
                    var c = djobs[i];
                    c.children.length = 0;
                    c.ce = 0;
                }
                stack.length = 0;
                cj = 0;
                asIdle();
            };
            Dispatcher.clone = function (ojob, params, __this) {
                var l = {
                    callback: ojob.callback,
                    _this: __this === undefined ? ojob._this : __this,
                    id: ojob.id,
                    isWaiting: true,
                    optimizable: false,
                    params: new JobParam(ojob.id).Set1(params || ojob.params.params)
                };
                ojob.children.push(l);
                return l;
            };
            Dispatcher.cretaeJob = function (delegate, param, _this, optimizable) {
                var t = {
                    callback: delegate,
                    params: new JobParam(djobs.length, param),
                    _this: _this,
                    optimizable: optimizable,
                    isWaiting: false,
                    id: djobs.length, children: [], ce: 0
                };
                djobs.push(t);
                return t.params;
            };
            Dispatcher.Clear = function (o) {
                var k = djobs[o.id];
                var pj = k.children;
                var ce = k.ce;
                var l = pj.length;
                for (var i = l - 1; i > ce; i--) {
                    var c = pj[i];
                    c.isWaiting = false;
                    c.optimizable = true;
                }
                pj.length = 0;
                k.ce = 0;
            };
            Object.defineProperty(Dispatcher, "CurrentJob", {
                get: function () {
                    return stack[cj];
                },
                enumerable: true,
                configurable: true
            });
            Dispatcher.start = function () {
                isRunning = true;
                if (stack.length === 0) {
                    isRunning = false;
                    asIdle();
                    return;
                }
                isIdle = false;
                var to = cj + Math.min(3, stack.length - cj);
                for (; cj < to; cj++) {
                    var c = stack[cj];
                    if (c.isWaiting)
                        helper.TryCatch(c._this, c.callback, void 0, c.params.params);
                    if (!c.optimizable) {
                        var pj = djobs[c.id];
                        pj.ce++;
                    }
                    c.isWaiting = false;
                    stack[cj] = null;
                }
                isRunning = cj < stack.length;
                if (isRunning)
                    id = setTimeout(Dispatcher.start, 0);
                else
                    Dispatcher.GC();
            };
            Dispatcher.Push = function (ojob, params, _this) {
                var job = djobs[ojob.id];
                if (!job.optimizable)
                    job = this.clone(job, params, _this);
                else {
                    if (params)
                        job.params.Set(params);
                    job._this = _this === undefined ? job._this : _this;
                    if (job.isWaiting) {
                        return;
                    }
                }
                job.isWaiting = true;
                stack.push(job);
                if (!isRunning)
                    if (stack.length > 0) {
                        clearTimeout(id);
                        id = setTimeout(Dispatcher.start, 0);
                        isRunning = true;
                        isIdle = false;
                    }
                return job;
            };
            Dispatcher.call = function (_this, fn) {
                var args = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args[_i - 2] = arguments[_i];
                }
                this.Push(delayedJob, [_this, fn, args]);
            };
            Dispatcher.IsRunning = function () {
                return isRunning;
            };
            return Dispatcher;
        }());
        thread.Dispatcher = Dispatcher;
        var delayedJob = thread.Dispatcher.cretaeJob(function (context, fun, args) {
            fun.apply(context, args);
        }, [], null, false);
    })(thread = exports.thread || (exports.thread = {}));
    var PaintThread;
    (function (PaintThread) {
        var JobsQueeStat;
        (function (JobsQueeStat) {
            JobsQueeStat[JobsQueeStat["Stoped"] = 0] = "Stoped";
            JobsQueeStat[JobsQueeStat["Waitting"] = 1] = "Waitting";
            JobsQueeStat[JobsQueeStat["Executing"] = 2] = "Executing";
        })(JobsQueeStat || (JobsQueeStat = {}));
        var _stat = 0;
        var _array = new Array(100);
        var currIndex = -1;
        function Push(ins, e, scop) {
            if (!ins)
                throw "Argument inst is null";
            switch (_stat) {
                case JobsQueeStat.Stoped:
                    _stat = JobsQueeStat.Waitting;
                    _defreredExecution();
                case JobsQueeStat.Waitting:
                    _array[++currIndex] = { ins: ins, e: e, scop: scop };
                    break;
                case JobsQueeStat.Executing:
                    _execute1({ ins: ins, e: e, scop: scop });
                    break;
            }
        }
        PaintThread.Push = Push;
        function OnPaint(task) {
            if (!task.method)
                throw "Argument inst is null";
            switch (_stat) {
                case JobsQueeStat.Stoped:
                    _stat = JobsQueeStat.Waitting;
                    _defreredExecution();
                case JobsQueeStat.Waitting:
                    _array[++currIndex] = task;
                    break;
                case JobsQueeStat.Executing:
                    _execute2(task);
                    break;
            }
        }
        PaintThread.OnPaint = OnPaint;
        function _defreredExecution() {
            var raf = window.requestAnimationFrame
                || (window).webkitRequestAnimationFrame
                || window.mozRequestAnimationFrame
                || window.msRequestAnimationFrame;
            if (raf) {
                raf(_executeAll);
            }
            else
                thread.Dispatcher.OnIdle(PaintThread, _executeAll, true);
        }
        function _execute1(e) {
            try {
                var j = e.ins.job;
                j && j.Todo && j.Todo(e.ins, e.e);
            }
            catch (_a) { }
        }
        function _execute2(e) {
            try {
                var x = e;
                x.method && x.method.apply(x.owner, x.args);
            }
            catch (_a) { }
        }
        function _execute(e) {
            try {
                if (e.ins) {
                    var j = e.ins.job;
                    j && j.Todo && j.Todo(e.ins, e.e);
                }
                else {
                    var x = e;
                    x.method && x.method.apply(x.owner, x.args);
                }
            }
            catch (_a) { }
        }
        function _executeAll() {
            _stat = JobsQueeStat.Executing;
            for (; currIndex >= 0; currIndex--)
                _execute(_array[currIndex]);
            _stat = JobsQueeStat.Stoped;
        }
    })(PaintThread = exports.PaintThread || (exports.PaintThread = {}));
    var Dom;
    (function (Dom) {
        var uiListDispatcher = [];
        var isExecuting;
        var f;
        function OnNodeInserted(controller, dom) {
            f.add(dom, controller);
            if (!__global.useListenerOrMutation)
                dom.addEventListener("DOMNodeInsertedIntoDocument", controller);
        }
        Dom.OnNodeInserted = OnNodeInserted;
        function RemoveListener(dom) {
            var c = f.Dispose(dom);
            if (!__global.useListenerOrMutation)
                dom.removeEventListener("DOMNodeInsertedIntoDocument", c);
        }
        Dom.RemoveListener = RemoveListener;
        function observe(mutations, observer) {
            var cmd;
            var n;
            var t = [];
            if (f.dic.size)
                for (var i = 0; i < mutations.length; i++) {
                    var m = mutations[i];
                    if (m.type == 'childList') {
                        n = m.addedNodes;
                        for (var j = 0; j < n.length; j++) {
                            var c = f.GetAndRemove(n[j]);
                            if (c)
                                c.OnNodeLoaded();
                        }
                    }
                }
            if (f.unknown.size)
                thread.Dispatcher.call(f, f.ReValidate, function (node, controller) {
                    controller.OnNodeLoaded();
                }, OnMutationFinished);
        }
        function OnMutationFinished() {
            if (isExecuting)
                return;
            runQueue();
        }
        function runQueue() {
            if (uiListDispatcher.length == 0)
                return;
            isExecuting = true;
            if (thread.Dispatcher.IsRunning())
                return thread.Dispatcher.OnIdle(null, runQueue);
            else
                thread.Dispatcher.call(null, execute);
        }
        function execute() {
            for (var i = 0; i < uiListDispatcher.length; i++)
                helper.TryCatch(undefined, uiListDispatcher[i]);
            uiListDispatcher.splice(0, uiListDispatcher.length);
            isExecuting = false;
        }
        function pushToIdl(f) {
            if (!(f instanceof Function))
                return;
            uiListDispatcher.push(f);
            OnMutationFinished();
        }
        Dom.pushToIdl = pushToIdl;
        function init() {
            f = new fast();
            if (__global.useListenerOrMutation) {
                var t = new MutationObserver(observe);
                t.observe(document.body, { childList: true, subtree: true });
            }
        }
        var fast = (function () {
            function fast() {
                this.dic = new Map();
                this.unknown = new Map();
            }
            fast.prototype.add = function (node, param) {
                var x = this.dic.get(node);
                if (x)
                    return;
                var l = this.unknown.get(node);
                if (l)
                    return;
                if (window.document.body.contains(node))
                    return this.dic.set(node, param);
                else
                    this.unknown.set(node, param);
            };
            fast.prototype.ReValidate = function (callback, onficish) {
                if (this.unknown) {
                    for (var iter = this.unknown.entries(), c = iter.next(); !c.done; c = iter.next()) {
                        var k = c.value[0];
                        var v = c.value[1];
                        if (window.document.body.contains(k)) {
                            callback(k, v);
                            this.unknown.delete(k);
                        }
                    }
                }
                onficish && onficish();
            };
            fast.prototype.Remove = function (node) {
                var c = this.dic.delete(node);
            };
            fast.prototype.GetAndRemove = function (node) {
                var v = this.dic.get(node);
                this.dic.delete(node);
                return v;
            };
            fast.prototype.Dispose = function (node) {
                var l = this.dic.get(node) || this.unknown.get(node);
                this.dic.delete(node);
                this.unknown.delete(node);
                return l;
            };
            return fast;
        }());
        var UIDispatcher;
        (function (UIDispatcher) {
            function OnIdle(f) {
                Dom.pushToIdl(f);
            }
            UIDispatcher.OnIdle = OnIdle;
        })(UIDispatcher = Dom.UIDispatcher || (Dom.UIDispatcher = {}));
        init();
    })(Dom = exports.Dom || (exports.Dom = {}));
    var mvc;
    (function (mvc) {
        var ITemplate = (function () {
            function ITemplate(Name) {
                this.Name = Name.toLowerCase();
            }
            return ITemplate;
        }());
        mvc.ITemplate = ITemplate;
        var iTemplate = (function (_super) {
            __extends(iTemplate, _super);
            function iTemplate(relativeUrl, name, shadow) {
                var _this_1 = _super.call(this, name) || this;
                if (relativeUrl == null)
                    throw "url is null";
                if (name == null)
                    throw "category is null";
                _this_1._Url = relativeUrl;
                if (shadow == undefined)
                    return _this_1;
                _this_1.Shadow = shadow;
                return _this_1;
            }
            Object.defineProperty(iTemplate.prototype, "Url", {
                get: function () {
                    return this._Url;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(iTemplate.prototype, "Shadow", {
                get: function () {
                    return this._Shadow;
                },
                set: function (v) {
                    if (v != null) {
                        if (!(v instanceof HTMLElement))
                            throw 'shadow is not HTMLElement';
                    }
                    this._Shadow = v;
                },
                enumerable: true,
                configurable: true
            });
            iTemplate.prototype.Create = function () {
                var s = this._Shadow;
                return s == null ? null : s.content.firstElementChild.cloneNode(true);
            };
            iTemplate.prototype.Load = function () {
            };
            return iTemplate;
        }(ITemplate));
        mvc.iTemplate = iTemplate;
        var Devices;
        (function (Devices) {
            Devices[Devices["Desktop"] = 0] = "Desktop";
            Devices[Devices["Mobile"] = 1] = "Mobile";
            Devices[Devices["Tablete"] = 2] = "Tablete";
        })(Devices = mvc.Devices || (mvc.Devices = {}));
        var NULL = (function () {
            function NULL() {
            }
            return NULL;
        }());
        mvc.NULL = NULL;
        var des = new Map();
        var MvcDescriptor = (function () {
            function MvcDescriptor(Name, dataType) {
                this.Subs = {};
                this.Items = {};
                this.Name = Name.toLowerCase();
                this.DataType = dataType;
            }
            Object.defineProperty(MvcDescriptor.prototype, "DataType", {
                get: function () {
                    return this._dataType;
                },
                set: function (dataType) {
                    if (dataType == this._dataType)
                        return;
                    if (!dataType)
                        return;
                    if (this._dataType != NULL && typeof this._dataType == "function" && dataType)
                        throw "Conflit types";
                    var tt = des.get(this._dataType || NULL);
                    if (tt) {
                        var i = tt.indexOf(this);
                        if (i !== -1)
                            tt.splice(i, 1);
                    }
                    var tt = des.get(dataType || NULL);
                    if (!tt)
                        des.set(dataType || NULL, tt = new Array());
                    tt.push(this);
                    this._dataType = dataType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MvcDescriptor.prototype, "Root", {
                get: function () {
                    var c = this;
                    while (c.Parent)
                        c = c.Parent;
                    return c;
                },
                enumerable: true,
                configurable: true
            });
            MvcDescriptor.prototype.Get = function (path) {
                path = typeof path == 'string' ? path.toLowerCase().split('.') : path;
                var t = this.GetFoder(path, path.length - 1);
                return t && t.Items[path[path.length - 1]];
            };
            MvcDescriptor.prototype.GetFoder = function (path, max) {
                path = path || "";
                if (typeof path == 'string') {
                    path = path.trim().toLowerCase();
                    if (path == '')
                        return this;
                    path = path.split('.');
                }
                var t = this;
                for (var i = 0, max = max || path.length - 1; i < max; i++) {
                    var n = path[i];
                    if (!t)
                        return undefined;
                    switch (n) {
                        case '':
                        case '.':
                            continue;
                        case '..':
                            t = t.Parent;
                            break;
                        case '/':
                            t = t.Root;
                        default:
                            t = t.Subs[n];
                    }
                }
                return t;
            };
            MvcDescriptor.prototype.CreateFolder = function (path, type) {
                path = path || "";
                if (typeof path == 'string') {
                    path = path.trim().toLowerCase();
                    if (path == '') {
                        this.DataType = type;
                    }
                    path = path.split('.');
                }
                var t = this;
                for (var i = 0, max = path.length; i < max; i++) {
                    var n = path[i];
                    if (!t)
                        return undefined;
                    switch (n) {
                        case '':
                        case '.':
                            continue;
                        case '..':
                            t = t.Parent || t;
                            break;
                        case '/':
                            t = t.Root;
                        default:
                            t = t.Subs[n] || t.AddFolder(n, i == max - 1 ? type : undefined);
                    }
                }
                return t;
            };
            MvcDescriptor.prototype.Add = function (templ) {
                if (!this.Subs)
                    this.Subs = {};
                this.Items[templ.Name] = templ;
                if (!this.Default)
                    this.Default = templ;
                return this;
            };
            MvcDescriptor.prototype.AddFolder = function (name, dataType) {
                var x = this.Subs[name = name.toLowerCase()];
                if (x)
                    if (x.DataType) {
                        if (dataType && x.DataType != dataType)
                            throw "Conflit types";
                        return x;
                    }
                    else {
                        x.DataType = dataType;
                        return x;
                    }
                this.Subs[name] = x = new MvcDescriptor(name, dataType);
                return x;
            };
            MvcDescriptor.prototype.registerTemplates = function (dom, url, getType) {
                var des;
                var name = dom.getAttribute('name');
                var type = dom.hasAttribute('type') ? getType(dom.getAttribute('type')) : undefined;
                for (var i = 0; i < dom.children.length; i++) {
                    des = dom.children.item(i);
                    this.Process(des, url, getType);
                }
                return this;
            };
            MvcDescriptor.prototype.registerTemplate = function (cat, url, name) {
                var templateName = name || cat.getAttribute('name');
                if (templateName == null) {
                    console.error('template must have a name \r\nfrom :' + url, cat);
                    return;
                }
                if (cat.children.length > 1) {
                    var v = document.createElement('div');
                    var x = cat.children;
                    for (var i = 0; i < x.length; i++) {
                        var f = x.item(i);
                        f.remove();
                        v.appendChild(f);
                    }
                    cat.appendChild(v);
                }
                var p;
                this.Add(p = new mvc.iTemplate(url + '#' + name + '+' + templateName, templateName, cat));
                if (cat.hasAttribute('default'))
                    this.Default = p;
                return this;
            };
            MvcDescriptor.Get = function (path) {
                return this.Root.Get(path);
            };
            MvcDescriptor.GetByType = function (datatype) {
                var t = des.get(datatype || NULL);
                return t && t[0];
            };
            MvcDescriptor.GetByName = function (folderName) {
                var r = this.Root;
                for (var f in r.Subs)
                    if (f == folderName)
                        return r.Subs[f];
                return null;
            };
            MvcDescriptor.Add = function (template, path, name) {
                var t = this.Root.CreateFolder('templates', Object);
                return t.registerTemplate(template, path, name);
            };
            MvcDescriptor.New = function (name, dataType) {
                return new MvcDescriptor(name, dataType);
            };
            MvcDescriptor.prototype.Register = function (path, tmp, url, name) {
                var t = this.CreateFolder(path, undefined);
                return t.registerTemplate(tmp, url, name);
            };
            MvcDescriptor.prototype.Process = function (des, url, getType) {
                switch (des.tagName) {
                    case 'TEMPLATE':
                        return this.registerTemplate(des, url);
                    case 'DESCRIPTOR':
                    case 'TEMPLATES':
                        var name = des.getAttribute('name');
                        var type = des.hasAttribute('type') ? getType(des.getAttribute('type')) : undefined;
                        return this.CreateFolder(name, type).registerTemplates(des, url, getType);
                    case 'IMPORT': {
                        var name = des.getAttribute('name');
                        if (!name)
                            return;
                        var from = this.GetFoder(des.getAttribute('from') || '');
                        from.Subs[name] = from;
                        return;
                    }
                    case 'DEBUGGER':
                        stop();
                        return;
                    case 'REQUIRE':
                    case 'DEBUGGER':
                        return;
                    default:
                        console.error('Tag {' + des.tagName + "} Unresolved");
                }
            };
            MvcDescriptor.Root = new MvcDescriptor('root', function () { });
            return MvcDescriptor;
        }());
        mvc.MvcDescriptor = MvcDescriptor;
        var Initializer = (function () {
            function Initializer(require) {
                this.require = require;
                this._system = new Array();
                this._pending = 0;
                this.templatesDescrpt = this.getDescriptor("templates", Object);
                if (require == null)
                    throw 'require argument is null';
                if (mvc._Instance)
                    throw "App cannot have more than initializer";
                mvc._Instance = this;
                this.Init();
            }
            Object.defineProperty(Initializer, "Instances", {
                get: function () {
                    return mvc._Instance || (mvc._Instance = new Initializer(require));
                },
                enumerable: true,
                configurable: true
            });
            Initializer.prototype.Init = function () { };
            Initializer.prototype.Dispose = function () { };
            Object.defineProperty(Initializer.prototype, "System", {
                get: function () { return this._system; },
                enumerable: true,
                configurable: true
            });
            Initializer.prototype.Add = function (templGroup, require) {
                this.pending++;
                (require || this.require)('template|' + templGroup.Url, Initializer.gonsuccess, Initializer.gonerror, { _this: this, tmpl: templGroup });
            };
            Initializer.SetTypeResolver = function (name, typeResolver) {
                Initializer.typeResolvers[name] = typeResolver;
            };
            Object.defineProperty(Initializer.prototype, "pending", {
                get: function () {
                    return this._pending;
                },
                set: function (v) {
                    if (v < 0)
                        throw "pending cannot be less then 0";
                    if (v === this._pending)
                        return;
                    this._pending = v;
                    if (v === 0)
                        Initializer.onfinish(this);
                },
                enumerable: true,
                configurable: true
            });
            Initializer.gonsuccess = function (r) {
                var t = this;
                var __this = t._this;
                try {
                    Initializer.MakeAsParsed(r);
                    __this.ExcecuteTemplate(t.tmpl.Url, r.html);
                    if (t.tmpl.OnSuccess)
                        thread.Dispatcher.call(t.tmpl, t.tmpl.OnSuccess, t._this);
                }
                catch (e) {
                }
                __this.pending--;
            };
            Initializer.gonerror = function (r) {
                var t = this;
                console.error(" Group of templates [" + t.tmpl.Url + "]: error downloading");
                if (t.tmpl && t.tmpl.OnError)
                    thread.Dispatcher.call(t.tmpl, t.tmpl.OnError, t._this);
                t._this.pending--;
            };
            Initializer.html2Template = function (html) {
                var t = document.createElement('template');
                t.innerHTML = html;
                return t;
            };
            Initializer.htmlToElements = function (html) {
                var t = document.createElement('div');
                t.innerHTML = html;
                return t;
            };
            Initializer.prototype.then = function (call) {
                if (this.pending <= 0)
                    return call(this);
                Initializer.callbacks.push(call);
            };
            Initializer.then = function (call) {
                Initializer.callbacks.push(call);
            };
            Initializer.prototype.onfinish = function () {
                var c = Initializer.callbacks;
                while (c.length)
                    c.shift()(this);
            };
            Initializer.onfinish = function (t) {
                for (var i = 0; i < Initializer.callbacks.length; i++)
                    Initializer.callbacks[i](t);
            };
            Initializer.Get = function (type) {
                var n = mvc._Instance.System;
                {
                    var l = n.length;
                    for (var i = 0; i < l; i++) {
                        var e = n[i];
                        if (e.DataType == type)
                            return e;
                    }
                }
                return null;
            };
            Initializer.prototype.getDescriptor = function (name, type) {
                name = name.toLowerCase();
                if (!name && !type)
                    return this.templatesDescrpt;
                if (name)
                    var descipter = MvcDescriptor.GetByName(name);
                if (!descipter && type)
                    descipter = MvcDescriptor.GetByType(type);
                if (descipter && descipter.Name.toLowerCase() != name.toLowerCase())
                    descipter = null;
                if (!descipter)
                    descipter = MvcDescriptor.Root.AddFolder(name, type);
                else if (descipter.Name !== name.toLowerCase() || descipter.DataType !== type)
                    console.log("Conflit with others template: Name(" + name + "," + descipter.Name + ")==Type(" + type + "," + descipter.DataType + ")");
                return descipter;
            };
            Initializer.prototype.ExcecuteTemplate = function (url, templ, typeResolver, e) {
                var types = {};
                var templatesDescrpt = this.getDescriptor("templates", Object);
                function getType(name) {
                    var t = types[name = name];
                    if (t != null)
                        return t;
                    if (typeResolver)
                        t = typeResolver(name);
                    if (t == null || !(t instanceof Function)) {
                        t = (e && e.context && e.context.GetType(name)) || context_1.context.GetType(name);
                        if (t == undefined || !(t instanceof Function))
                            throw "type " + name + " unresolved";
                    }
                    types[name] = t;
                    return t;
                }
                MvcDescriptor.Root.Process(templ, url, getType);
            };
            Initializer.Register = function (e) {
                var tempate = e.exports;
                if (this.parsed.indexOf(tempate) !== -1)
                    return;
                else if (tempate.html.hasAttribute('private'))
                    return;
                else
                    this.Instances.ExcecuteTemplate(e.url.toString(), tempate.html, null, tempate);
            };
            Initializer.MakeAsParsed = function (r) {
                this.parsed.push(r);
            };
            Initializer.typeResolvers = {};
            Initializer.callbacks = [];
            Initializer.parsed = [];
            return Initializer;
        }());
        mvc.Initializer = Initializer;
        var Template = (function () {
            function Template(templateDOM) {
                this._name = "";
                this._for = "";
                if (Template._store === undefined)
                    Template._store = new Array();
                if (Template.fromInside == true) {
                    this._view = templateDOM;
                    this._name = templateDOM.getAttribute("name");
                    this._for = templateDOM.getAttribute("for");
                    if (this._name == null)
                        throw "name is null";
                    Template._store.Add(this);
                }
                else
                    throw "Access violatile";
            }
            Object.defineProperty(Template.prototype, "forType", {
                get: function () { return this._type; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Template.prototype, "View", {
                get: function () { return this._view; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Template.prototype, "Name", {
                get: function () { return this._name; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Template.prototype, "For", {
                get: function () { return this._for; },
                enumerable: true,
                configurable: true
            });
            Template.getTemplates = function (type) {
                var c = Template._store;
                var rt = [];
                for (var i = c.Count - 1; i >= 0; i--) {
                    var t = c.Get(i);
                    if (t.forType == type)
                        rt.push(t);
                }
                return rt;
            };
            Template.createTemplate = function (tmplate) {
                Template.fromInside = true;
                var t = null;
                try {
                    t = new Template(tmplate);
                }
                catch (error) {
                }
                Template.fromInside = false;
                return t;
            };
            Template.GetAll = function (name) {
                if (arguments.length == 2)
                    var a = Template._store;
                var x = [];
                for (var i = 0; i < a.Count; i++) {
                    var t = a.Get(i);
                    if (t._name == name)
                        x.push(t);
                }
                return x;
            };
            Template.Get = function (name, vtype) {
                var a = Template._store;
                for (var i = 0; i < a.Count; i++) {
                    var t = a.Get(i);
                    if (t._name == name && vtype == t._for)
                        return t;
                }
                return null;
            };
            Template.Foreach = function (callback) {
                var s = Template._store;
                for (var i = s.Count - 1; i >= 0; i--) {
                    var t = s.Get(i);
                    if (callback(t))
                        return;
                }
            };
            Template.TempplatesPath = "./templates/";
            Template.fromInside = false;
            return Template;
        }());
        mvc.Template = Template;
    })(mvc = exports.mvc || (exports.mvc = {}));
    var Msg;
    (function (Msg) {
        var msgsApi = new Map();
        var _default;
        function register(api, name) {
            if (!_default)
                _default = api;
            if (!name)
                _default = api;
            msgsApi.set((name || msgsApi), api);
        }
        Msg.register = register;
        function getModalApi(name) {
            if (!name)
                return _default;
            return msgsApi.get(name);
        }
        Msg.getModalApi = getModalApi;
        function New(name, args) {
            var api = getModalApi(name);
            return api.New.apply(api, args);
        }
        Msg.New = New;
        function ShowDialog(name, title, msg, callback, ok, cancel, abort) {
            var api = getModalApi(name);
            return api.ShowDialog(title, msg, callback, ok, cancel, abort);
        }
        Msg.ShowDialog = ShowDialog;
        var _zIndex = 10000;
        function NextZIndex() { return ++_zIndex; }
        Msg.NextZIndex = NextZIndex;
        function getApiNames() {
            var arr = new Array(msgsApi.size);
            var t = msgsApi.keys();
            var x;
            var i = 0;
            while (!(x = t.next()).done) {
                arr[i++] = x.value;
            }
            return arr;
        }
        Msg.getApiNames = getApiNames;
        function defaultApi() {
            return _default;
        }
        Msg.defaultApi = defaultApi;
    })(Msg = exports.Msg || (exports.Msg = {}));
});
define("sys/utils", ["require", "exports", "sys/runtime", "context", "sys/collections"], function (require, exports, runtime_2, context_2, collections_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var __corelib__;
    (function (__corelib__) {
        function $defineProperty(o, p, attributes, onError) {
            return runtime_2.helper.TryCatch(Object, Object.defineProperty, onError, [o, p, attributes]) || false;
        }
        __corelib__.$defineProperty = $defineProperty;
        function setProperty(type, p) {
            $defineProperty(type.prototype, p.Name, {
                get: function () { return this.get(p); },
                set: function (v) { this.set(p, v); },
                configurable: false,
                enumerable: false
            });
        }
        __corelib__.setProperty = setProperty;
        (function (constructor) {
            if (constructor &&
                constructor.prototype && !('childElementCount' in constructor.prototype)) {
                Object.defineProperty(constructor.prototype, 'childElementCount', {
                    get: function () {
                        var i = 0, count = 0, node, nodes = this.childNodes;
                        while (node = nodes[i++]) {
                            if (node.nodeType === 1)
                                count++;
                        }
                        return count;
                    }
                });
            }
        })(window.Node || window.Element);
        __corelib__.max = 9223372036854775807;
    })(__corelib__ || (__corelib__ = {}));
    var vars;
    (function (vars) {
        vars._c = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
        vars._cnts = [7, 11, 15, 19, 32];
        vars.names_scop_fromIn = false;
    })(vars || (vars = {}));
    var html;
    (function (html) {
        function fromText(t) {
            var c = document.createElement('div');
            c.innerHTML = t.trim();
            return c.firstElementChild;
        }
        html.fromText = fromText;
        function indexOf(node) {
            var p = node.parentNode && node.parentNode.childNodes;
            if (p)
                for (var i = 0; i < p.length; i++)
                    if (p[i] === node)
                        return i;
            return -1;
        }
        html.indexOf = indexOf;
        function replace(child, by) {
            var p = child.parentNode;
            if (!p)
                return null;
            p.insertBefore(by, child);
            p.removeChild(child);
            return by;
        }
        html.replace = replace;
        function wrap(child, into) {
            html.replace(child, into).appendChild(child);
            return into;
        }
        html.wrap = wrap;
    })(html = exports.html || (exports.html = {}));
    var css;
    (function (css_1) {
        css_1.cssRules = [];
        var CSSRule = (function () {
            function CSSRule(cssrule, parent) {
                var t;
                t = this;
                if (cssrule instanceof CSSMediaRule) {
                    var mr = cssrule;
                    var rs = mr.cssRules;
                    for (var j = 0; j < rs.length; j++) {
                        var r = rs[j];
                        if (r instanceof CSSMediaRule)
                            new CSSRule(r, this);
                    }
                    t.IsMedia = true;
                }
                if (parent) {
                    t.Parent = parent;
                    if (!parent.children)
                        parent.children = [this];
                    else
                        parent.children.push(this);
                }
                css_1.cssRules.push(this);
                t.Rule = cssrule;
            }
            CSSRule.prototype.Dispose = function () {
                var i = css_1.cssRules.indexOf(this);
                if (i == -1)
                    return;
                css_1.cssRules.splice(i, 1);
            };
            Object.defineProperty(CSSRule.prototype, "Selectors", {
                get: function () {
                    var t = null;
                    t = this;
                    var r = t.Rule;
                    if (t.IsMedia) {
                        return [];
                    }
                    t._selectors = r.selectorText.split(',');
                    return t._selectors;
                },
                enumerable: true,
                configurable: true
            });
            CSSRule.prototype.IsMatch = function (selector) {
                var c = this.Selectors;
                for (var i = 0; c.length; i++) {
                }
            };
            return CSSRule;
        }());
        css_1.CSSRule = CSSRule;
        function collectCss() {
            var d;
            d = document;
            var ss = d.styleSheets;
            for (var i = 0; i < ss.length; i++) {
                var s = ss.item(i);
                var rs = s.cssRules;
                for (var j = 0; j < rs.length; j++) {
                    var r = rs[j];
                    new CSSRule(r, null);
                }
            }
        }
        css_1.collectCss = collectCss;
        function getVar(name) {
        }
        css_1.getVar = getVar;
        function toValidCssName(c) {
            if (typeof c !== 'string')
                return c;
            for (var i = 0; i < c.length; i++) {
                var h = c.charCodeAt(i);
                if (h > 64 && h < 91) {
                    c = c.substring(0, i) + '-' + String.fromCharCode(h + 32) + c.substring(i + 1);
                    i++;
                }
                else if (h === 36) {
                    c = c.substring(0, i) + '-' + c.substring(++i);
                }
                else if (h === 95) {
                    c = c.substring(0, i) + '--' + c.substring(++i);
                }
            }
            return c;
        }
        css_1.toValidCssName = toValidCssName;
        function toValidEnumName(c) {
            if (typeof c !== 'string')
                return c;
            for (var i = 0; i < c.length; i++) {
                var h = c.charCodeAt(i);
                if (h >= 65 && h <= 90)
                    throw "InvalidCssName";
                var nh = c.charCodeAt(i + 1);
                if (h === 45) {
                    if (nh >= 97 && nh <= 122) {
                        c = c.substring(0, i) + String.fromCharCode(nh - 32) + c.substring(i + 2);
                    }
                    else {
                        if (c.charCodeAt(i + 1) === 45) {
                            {
                                c = c.substring(0, i) + '_' + c.substring(i + 2);
                                continue;
                            }
                        }
                        else
                            c = c.substring(0, i) + '$' + c.substring(i + 1);
                        i += 1;
                    }
                }
            }
            return c;
        }
        css_1.toValidEnumName = toValidEnumName;
        function Css2Less(css, callback, param) {
            var t = new XMLHttpRequest();
            t.open("POST", '/css-to-less.php');
            t.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            t.setRequestHeader('Access-Control-Allow-Origin', 'true');
            t.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            t.send(encodeURIComponent("data") + "=" + encodeURIComponent("body{display:none}"));
            t.onload = function (t) {
                stop();
            };
        }
        css_1.Css2Less = Css2Less;
        var animation;
        (function (animation) {
            function animate(anim) {
                stopAnimation(anim);
                anim.start = performance.now();
                anim.cursor = 0;
                anim.onstart && anim.onstart(anim);
                anim.thread = setInterval(function () {
                    var n = performance.now();
                    anim.cursor = (n - anim.start) / anim.timespan;
                    if (anim.cursor >= 1) {
                        clearInterval(anim.thread);
                        anim.cursor = 1;
                    }
                    for (var i = 0; i < anim.props.length; i++)
                        anim.props[i].animate(anim);
                    if (anim.cursor == 1) {
                        anim.oncomplete && anim.oncomplete(anim);
                        var t;
                        for (var i = 0; i < anim.props.length; i++)
                            (t = anim.props[i]).oncomplete && t.oncomplete(anim);
                    }
                }, anim.interval);
                return anim;
            }
            animation.animate = animate;
            function animates(anim) {
                var start = performance.now();
                stopAnimations(anim);
                anim.thread = setInterval(function () {
                    var es = anim.animations;
                    var n = performance.now();
                    var cursor = (n - start) / anim.timespan;
                    if (cursor >= 1) {
                        clearInterval(anim.thread);
                        cursor = 1;
                    }
                    cursor = 1 - (1 - cursor) * (1 - cursor);
                    for (var i = 0; i < es.length; i++) {
                        var e = es[i];
                        e.cursor = cursor;
                        for (var j = 0; j < e.props.length; j++)
                            e.props[j].animate(e);
                    }
                    if (cursor == 1)
                        complete(es);
                }, anim.interval);
                var es = anim.animations;
                for (var i = 0; i < es.length; i++) {
                    var ae = es[i];
                    ae.start = start;
                    ae.cursor = 0;
                    ae.onstart && ae.onstart(ae);
                }
                return anim;
            }
            animation.animates = animates;
            function stopAnimation(e) {
                if (!e.thread)
                    return;
                clearInterval(e.thread);
                complete([e]);
                return e;
            }
            animation.stopAnimation = stopAnimation;
            function stopAnimations(e) {
                if (!e.thread)
                    return;
                clearInterval(e.thread);
                complete(e.animations);
                return e;
            }
            animation.stopAnimations = stopAnimations;
            function complete(es) {
                for (var i = 0; i < es.length; i++) {
                    var e = es[i];
                    e.thread = 0;
                    e.oncomplete && e.oncomplete(e);
                    var t;
                    for (var j = 0; j < e.props.length; j++)
                        (t = e.props[j]).oncomplete && t.oncomplete(e);
                }
            }
            function colect(f, attrs) {
                var r = {};
                for (var _i = 0, attrs_1 = attrs; _i < attrs_1.length; _i++) {
                    var i = attrs_1[_i];
                    r[i] = f.style[i];
                }
                return r;
            }
            function grabber(e) {
                var d = performance.now();
                for (var i = 0; i < e.elements.length; i++)
                    e.elements[i].result = [colect(e.elements[i].dom, e.attrs)];
                e.thread = setInterval(function () {
                    if (performance.now() - d > e.timespan) {
                        clearInterval(e.thread);
                    }
                    for (var i = 0; i < e.elements.length; i++)
                        e.elements[i].result.push(colect(e.elements[i].dom, e.attrs));
                }, e.interval);
            }
            function trigger(prop, from, to, finalvalue, suffx) {
                if (finalvalue === void 0) { finalvalue = ''; }
                if (suffx === void 0) { suffx = 'px'; }
                return {
                    name: prop,
                    def: to - from,
                    from: from,
                    fnl: finalvalue,
                    suffx: suffx || 'px',
                    animate: function (e) {
                        e.dom.style[this.name] = (this.from + this.def * e.cursor) + suffx;
                    },
                    oncomplete: function (e) {
                        e.dom.style[this.name] = this.fnl;
                    }
                };
            }
            animation.trigger = trigger;
            var constats;
            (function (constats) {
                constats.hideOpacity = { name: 'opacity', animate: function (e) { e.dom.style.opacity = String(1 - e.cursor); }, oncomplete: function (e) { e.dom.style[this.name] = ''; } };
                constats.showOpacity = { name: 'opacity', animate: function (e) { e.dom.style.opacity = String(e.cursor); } };
            })(constats = animation.constats || (animation.constats = {}));
        })(animation = css_1.animation || (css_1.animation = {}));
    })(css = exports.css || (exports.css = {}));
    var math;
    (function (math) {
        function round1(_n, x) {
            var n = _n + '';
            var i = n.indexOf('.');
            var e = n.indexOf('e');
            if (i === -1)
                i = n.length;
            var ex = 0;
            if (e !== -1)
                if (i > e)
                    return n;
                else {
                    ex = parseFloat(n.substring(e + 1));
                    if (ex < x - 1)
                        return '0';
                    n = n.substring(0, e);
                }
            var l = n.length;
            if (ex !== 0) {
                if (i + ex > 1) {
                    var fi = n.substr(0, i);
                    var li = n.substring(i + 1);
                    var shift = l - i <= ex ? l - i : ex;
                    shift--;
                    ex -= shift;
                    i += shift;
                    if (shift > 0) {
                        n = fi + li.substr(0, shift);
                        var lm = li.substring(shift);
                        if (lm.length > 0)
                            n += lm;
                        i = n.indexOf('.');
                    }
                    if (i === -1)
                        i = n.length;
                    l = n.length;
                }
            }
            var l1 = x == 0 ? i : i + x + 1;
            var r = l1 - l;
            if (r > 0)
                l1 = l;
            n = n.substr(0, l1);
            if (r > 0) {
                if (i == l) {
                    n += '.';
                    r--;
                }
                for (; r > 0; r--)
                    n += '0';
            }
            n = ex !== 0 ? n + 'e' + ex : n;
            return n;
        }
        math.round1 = round1;
        function round(_n, x) {
            var n = _n + '';
            var i = n.indexOf('.');
            var e = n.indexOf('e');
            if (i === -1)
                i = e === -1 ? n.length : e;
            var ex = 0;
            if (e !== -1)
                if (i <= e) {
                    ex = parseFloat(n.substring(e + 1));
                    if (ex < x - 1)
                        return '0';
                    n = n.substring(0, e);
                }
                else {
                    ex = parseFloat(n.substring(e + 1));
                    n = n.substring(0, e);
                }
            var l = n.length;
            if (ex !== 0) {
                if (i + ex > 1) {
                    var fi = n.substr(0, i);
                    var li = n.substring(i + 1);
                    var shift = l - i <= ex ? l - i : ex;
                    shift = Math.abs(shift + shift === 0 ? 0 : (shift < 0 ? 1 : -1));
                    ex -= shift;
                    i += shift;
                    if (shift > 0) {
                        n = fi + li.substr(0, shift);
                        var lm = li.substring(shift);
                        if (lm.length > 0)
                            n += lm;
                        i = n.indexOf('.');
                    }
                    if (i === -1)
                        i = n.length;
                    l = n.length;
                }
            }
            var l1 = x == 0 ? i : i + x + 1;
            var r = x - (n.length - i);
            if (r > 0)
                l1 = l;
            n = n.substr(0, l1);
            if (r > 0) {
                if (i == l) {
                    n += '.';
                    r--;
                }
                for (; r >= 0; r--)
                    n += '0';
            }
            n = ex !== 0 ? n + 'e' + ex : n;
            return n;
        }
        math.round = round;
    })(math = exports.math || (exports.math = {}));
    var basic;
    (function (basic) {
        var Settings;
        (function (Settings) {
            var _store = {};
            function get(name) {
                return _store[name];
            }
            Settings.get = get;
            function set(name, value) {
                _store[name] = value;
                value = runtime_2.helper.TryCatch(JSON, JSON.stringify, void 0, [value]);
                localStorage.setItem(name, value || "null");
            }
            Settings.set = set;
            (function () {
                var arr = new Array(1);
                for (var i = 0; i < localStorage.length; i++) {
                    var n = localStorage.key(i);
                    arr[0] = localStorage.getItem(n);
                    if (!arr[0] || arr[0] === 'undefined')
                        _store[n] = void 0;
                    _store[n] = runtime_2.helper.TryCatch(JSON, JSON.parse, void 0, arr);
                }
            })();
        })(Settings = basic.Settings || (basic.Settings = {}));
        var DataStat;
        (function (DataStat) {
            DataStat[DataStat["Fail"] = 0] = "Fail";
            DataStat[DataStat["Success"] = 1] = "Success";
            DataStat[DataStat["OperationCanceled"] = 2] = "OperationCanceled";
            DataStat[DataStat["UnknownStat"] = 3] = "UnknownStat";
            DataStat[DataStat["DataCheckError"] = 4] = "DataCheckError";
            DataStat[DataStat["DataWasChanged"] = 16] = "DataWasChanged";
            DataStat[DataStat["None"] = 5] = "None";
        })(DataStat = basic.DataStat || (basic.DataStat = {}));
        var polyfill;
        (function (polyfill) {
            polyfill.supportTemplate = 'content' in document.createElement('template');
            function IsTemplate(x) {
                return polyfill.supportTemplate ? x instanceof HTMLTemplateElement : (x instanceof HTMLUnknownElement) && x.tagName === 'TEMPLATE';
            }
            polyfill.IsTemplate = IsTemplate;
            if (!polyfill.supportTemplate)
                __corelib__.$defineProperty(HTMLUnknownElement.prototype, 'content', { get: function () { return this.tagName === 'TEMPLATE' ? this : undefined; } });
        })(polyfill = basic.polyfill || (basic.polyfill = {}));
        function defaultUrl(url) {
            if (!url)
                url = document.location.origin;
            if (url.endsWith('/')) {
                url = url.substr(0, url.length - 1);
            }
            return url;
        }
        basic.host = defaultUrl(true ? null : 'http://127.0.0.1:801');
        basic.Crypto = { Decrypt: function (d) { return d; }, Encrypt: function (d) { return d; }, SEncrypt: function (d) { return d; }, SDecrypt: function (d) { return d; } };
        function isFocused(v) {
            var t = document.activeElement;
            while (t) {
                if (t == v)
                    return true;
                t = t.parentElement;
            }
            return false;
        }
        basic.isFocused = isFocused;
        var focuser = (function () {
            function focuser(bound, andButton) {
                this.bound = bound;
                this.andButton = andButton;
            }
            focuser.prototype.focuse = function (rebound, toPrev) {
                return this[toPrev ? 'focusePrev' : 'focuseNext'](rebound);
            };
            focuser.prototype._focuseOn = function (v) {
                try {
                    v.focus();
                    if (document.activeElement == v) {
                        if (v.select)
                            v.select();
                        return v;
                    }
                }
                catch (_a) { }
            };
            focuser.prototype.getNext = function (p) {
                var ns;
                while (p && !(ns = p.nextElementSibling)) {
                    if (this.bound.contains(p))
                        p = p.parentElement;
                    else
                        return null;
                }
                return ns;
            };
            focuser.prototype._focuseNext = function (v, array) {
                if (!v)
                    return false;
                if (array.indexOf(v) !== -1)
                    return false;
                array.push(v);
                if (v === document.activeElement) {
                    v = this.getNext(v);
                    if (!v)
                        return true;
                    array.push(v);
                }
                var tmp;
                if (v.tabIndex >= 0 && typeof v.focus === 'function') {
                    if (this.andButton || v.constructor !== HTMLButtonElement) {
                        if (this._focuseOn(v))
                            return v;
                    }
                }
                if (v instanceof HTMLElement)
                    if ((tmp = this._focuseNext(v.firstElementChild, array)))
                        return tmp;
                var n = this.getNext(v);
                if (n)
                    return this._focuseNext(n, array);
                return true;
            };
            focuser.prototype.getPrev = function (p) {
                var ns;
                while (p && !(ns = p.previousElementSibling)) {
                    if (this.bound.contains(p))
                        p = p.parentElement;
                    else
                        return null;
                }
                return ns;
            };
            focuser.prototype._focusePrev = function (v, array) {
                if (!v)
                    return false;
                if (array.indexOf(v) !== -1)
                    return false;
                array.push(v);
                if (v === document.activeElement) {
                    v = this.getPrev(v);
                    if (!v)
                        return true;
                    array.push(v);
                }
                var tmp;
                if (v.tabIndex >= 0 && typeof v.focus === 'function')
                    if (this._focuseOn(v))
                        return v;
                if (v instanceof HTMLElement)
                    if ((tmp = this._focusePrev(v.lastElementChild, array)))
                        return tmp;
                var n = this.getPrev(v);
                if (n)
                    return this._focusePrev(n, array);
                return true;
            };
            focuser.prototype.focusePrev = function (rebound) {
                if (this.bound.contains(document.activeElement))
                    var x = this._focusePrev(document.activeElement, []);
                else
                    x = true;
                if (rebound)
                    if (x == true)
                        return this._focusePrev(this.bound, []);
                return x;
            };
            focuser.prototype.focuseNext = function (rebound) {
                if (this.bound.contains(document.activeElement))
                    var x = this._focuseNext(document.activeElement, []);
                else
                    x = true;
                if (rebound)
                    if (x == true)
                        return this._focuseNext(this.bound, []);
                return x;
            };
            focuser.prototype.reFocuseOn = function () {
                return this._focuseNext(this.bound, []);
            };
            focuser.prototype.focusOn = function () {
                if (this.bound.contains(document.activeElement))
                    return;
                return this._focuseNext(this.bound, []);
            };
            return focuser;
        }());
        basic.focuser = focuser;
        var _fc = new focuser(null, false);
        function focuseOn(v) {
            _fc.bound = v;
            return _fc.focuseNext(true);
        }
        basic.focuseOn = focuseOn;
        function _focuseOn(v) {
            _fc.bound = v;
            return _fc.focusOn();
        }
        basic._focuseOn = _focuseOn;
        function __focuseOn(v) {
            try {
                v.focus();
                if (document.activeElement == v) {
                    if (v.select)
                        v.select();
                    return v;
                }
            }
            catch (_a) { }
        }
        function getNext(p) {
            var ns;
            while (p && !(ns = p.nextElementSibling))
                p = p.parentElement;
            return ns;
        }
        function _xfocuseNext(v, array) {
            if (!v)
                return false;
            if (array.indexOf(v) != -1)
                return false;
            array.push(v);
            if (v === document.activeElement) {
                v = getNext(v);
                if (!v)
                    return true;
                array.push(v);
            }
            var tmp;
            if (v instanceof HTMLInputElement)
                if (__focuseOn(v))
                    return v;
            if (v instanceof HTMLElement)
                if ((tmp = _xfocuseNext(v.firstElementChild, array)))
                    return tmp;
            var n = getNext(v);
            if (n)
                return _xfocuseNext(n, array);
            return true;
        }
        function focuseNext(v) {
            return _xfocuseNext(v || document.activeElement, []);
        }
        basic.focuseNext = focuseNext;
        var Delegate = (function () {
            function Delegate(Owner, Invoke, _dispose, objectStat) {
                this.Owner = Owner;
                this.Invoke = Invoke;
                this._dispose = _dispose;
                this.objectStat = objectStat;
            }
            Delegate.prototype.handleEvent = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                this.Invoke.apply(this.Owner, args);
            };
            Delegate.prototype.Dispose = function () {
                this._dispose(this);
                this.Owner = null;
                this._dispose = null;
                this.Invoke = null;
            };
            return Delegate;
        }());
        basic.Delegate = Delegate;
        var Rectangle = (function () {
            function Rectangle() {
                this._onchanged = [];
                Object.freeze(this);
                Object.preventExtensions(this);
            }
            Object.defineProperty(Rectangle.prototype, "Left", {
                get: function () {
                    return this._x;
                },
                set: function (v) {
                    this._x = v;
                    this.OnChanged();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "Top", {
                get: function () {
                    return this._y;
                },
                set: function (v) {
                    this._y = v;
                    this.OnChanged();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "Width", {
                get: function () {
                    return this._w;
                },
                set: function (v) {
                    this._w = v;
                    this.OnChanged();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "Height", {
                get: function () {
                    return this._h;
                },
                set: function (v) {
                    this._h = v;
                    this.OnChanged();
                },
                enumerable: true,
                configurable: true
            });
            Rectangle.prototype.OnChanged = function () {
                for (var i = 0; i < this._onchanged.length; i++) {
                    var dlg = this._onchanged[i];
                    dlg(this);
                }
            };
            Rectangle.prototype.Set = function (left, top, width, height) {
                this._x = left;
                this._y = top;
                this._w = width;
                this._h = height;
                this.OnChanged();
            };
            return Rectangle;
        }());
        basic.Rectangle = Rectangle;
        var SessionId = (function () {
            function SessionId(guid) {
                SessionId.parse(guid);
            }
            Object.defineProperty(SessionId.prototype, "Data", {
                get: function () { return SessionId.Id; },
                enumerable: true,
                configurable: true
            });
            SessionId.parse = function (guid) {
                if (guid == null) {
                    return;
                }
                var t = SessionId.Id;
                var i = 0;
                for (var i = 0; i < 16; i++) {
                    var c = guid.substr(2 * i, 2);
                    if (c === '')
                        break;
                    t[i] = parseInt(c, 16);
                }
            };
            SessionId.Id = new Array(16);
            return SessionId;
        }());
        basic.SessionId = SessionId;
        var iGuid = (function () {
            function iGuid(g) {
                this._id = g.toUpperCase();
            }
            Object.defineProperty(iGuid.prototype, "Id", {
                get: function () { return this._id; },
                enumerable: true,
                configurable: true
            });
            iGuid.prototype.Equals = function (o) {
                if (o instanceof iGuid)
                    return this._id == o._id;
                return false;
            };
            iGuid.prototype.toString = function () { return this._id.toString(); };
            iGuid.FromNumber = function (v) {
                var c = vars._c;
                var cnts = vars._cnts;
                var cc = 0;
                var l = "";
                var i = 0;
                while (i < 32) {
                    var d, r;
                    if (v !== 0) {
                        var d = v / 16;
                        var r = Math.floor(v % 16);
                        v = Math.floor(d);
                    }
                    else
                        r = Math.floor(Math.random() * 16);
                    l += c[r];
                    if (i == cnts[cc]) {
                        l += '-';
                        cc++;
                    }
                    i++;
                }
                return new iGuid(l);
            };
            Object.defineProperty(iGuid, "New", {
                get: function () {
                    return iGuid.FromNumber(Date.now());
                },
                enumerable: true,
                configurable: true
            });
            iGuid.Empty = new iGuid('00000000-0000-0000-0000-000000000000');
            return iGuid;
        }());
        basic.iGuid = iGuid;
        var EnumValue = (function () {
            function EnumValue(Name, Value) {
                this.Name = Name;
                this.Value = Value;
                Object.freeze(this);
            }
            EnumValue.prototype.toString = function () { return this.Name; };
            EnumValue.GetValue = function (lst, n) {
                var c = lst.AsList();
                if (typeof n === 'number') {
                    for (var i = 0; i < c.length; i++)
                        if (c[i].Value === n)
                            return c[i];
                }
                else {
                    for (var i = 0; i < c.length; i++)
                        if (c[i].Name === n)
                            return c[i];
                }
                return undefined;
            };
            return EnumValue;
        }());
        basic.EnumValue = EnumValue;
        var enums = {};
        function getEnum(enumPath, enumValue) {
            var _enum;
            if (typeof enumPath === 'string')
                _enum = enums[enumPath] || enumValue || context_2.context.GetEnum(enumPath);
            else
                throw "the Path Inspecified";
            if (!(_enum instanceof collections_1.collection.List && _enum.IsFrozen())) {
                if (_enum == null)
                    return undefined;
                if (_enum.constructor !== Object)
                    throw "Error Parsing Enum";
                enums[enumPath] = _enum = new collections_1.collection.List(EnumValue, gen(_enum));
                _enum.Freeze();
            }
            return _enum;
        }
        basic.getEnum = getEnum;
        function gen(_enum) {
            var o = [];
            for (var i in _enum)
                if (isNaN(parseFloat(i)))
                    o.push(new basic.EnumValue(i, _enum[i]));
            return o;
        }
        var t = /@([a-zA-Z][a-zA-Z\d\.]*)/mgi;
        function CompileString(s, getString, params) {
            return StringCompile.Compile(s, getString, params);
        }
        basic.CompileString = CompileString;
        var StringCompile = (function () {
            function StringCompile(indexer, getString, params) {
                this.indexer = indexer;
                this.getString = getString;
                this.params = params;
                this.onDataChanged = this.onDataChanged.bind(this);
            }
            StringCompile.generateIndexer = function (s, array) {
                var x = [];
                var lcur = 0;
                for (var i = 0; i < array.length; i++) {
                    var n = array[i];
                    var l = n.Index - lcur;
                    if (l > 0)
                        x.push(s.substr(lcur, l));
                    x.push(n);
                    lcur = n.Index + n.Name.length + 1;
                }
                l = s.length - lcur;
                if (l > 0)
                    x.push(s.substr(lcur, l));
                return x;
            };
            StringCompile.Compile = function (s, getString, params) {
                var rslt;
                var array = [];
                while (rslt = t.exec(s))
                    array.push({ Name: rslt[1], Index: rslt.index });
                return new StringCompile(this.generateIndexer(s, array), getString, params);
            };
            StringCompile.prototype.apply = function (data) {
                var a = this.indexer.slice();
                for (var i = 0; i < a.length; i++) {
                    var t = a[i];
                    if (typeof t !== 'string')
                        a[i] = this.getString ? this.getString(t.Name, data[t.Name]) : String(data[t.Name]);
                }
                return String.prototype.concat.apply("", a);
            };
            StringCompile.prototype.bind = function (data) {
                var ld = this.data;
                if (ld)
                    ld.removeListener(this.onDataChanged);
                if (data)
                    data.addListener(this.onDataChanged);
                this.data = data;
                return this.onDataChanged(null);
            };
            StringCompile.prototype.onDataChanged = function (ev) {
                var a = this.indexer.slice();
                for (var i = 0; i < a.length; i++) {
                    var t = a[i];
                    if (typeof t !== 'string')
                        a[i] = this.data[t.Name] || "";
                }
                return this.Value = String.prototype.concat.apply("", a);
            };
            return StringCompile;
        }());
        basic.StringCompile = StringCompile;
        var History = (function () {
            function History() {
                this.index = -1;
                this.stats = [];
            }
            History.prototype.Push = function (stat) {
                this.stats.splice(this.index + 1, 0, stat);
            };
            History.prototype.goBack = function () {
                var c = this.Current;
                c.Back();
                this.Index--;
                var c = this.Current;
                if (c)
                    c.Go();
            };
            History.prototype.goForward = function () {
                var c = this.Current;
                if (c)
                    c.Forward();
                this.Index++;
                var c = this.Current;
                if (c)
                    c.Go();
            };
            Object.defineProperty(History.prototype, "Current", {
                get: function () { return this.stats[this.index]; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(History.prototype, "Index", {
                get: function () { return this.index; },
                set: function (i) {
                    if (i < 0)
                        this.index = -1;
                    else if (i >= this.stats.length)
                        this.index = this.stats.length - 1;
                    else
                        this.index = i;
                },
                enumerable: true,
                configurable: true
            });
            return History;
        }());
        basic.History = History;
        var Routing;
        (function (Routing) {
            var history;
            (function (history) {
                history.supported = !!(window.history && window.history.pushState);
                history.initial = {
                    popped: null,
                    URL: null
                };
                function pushState(state, title, path) {
                    if (history.supported) {
                        if (Path.dispatch(path)) {
                            history.pushState(state, title, path);
                        }
                    }
                    else {
                        if (history.fallback) {
                            window.location.hash = "#" + path;
                        }
                    }
                }
                history.pushState = pushState;
                function popState(event) {
                    var initialPop = !history.initial.popped && location.href == history.initial.URL;
                    history.initial.popped = true;
                    if (initialPop)
                        return;
                    Path.dispatch(document.location.pathname);
                }
                history.popState = popState;
                function listen(fallback) {
                    history.supported = !!(window.history && window.history.pushState);
                    history.fallback = fallback;
                    if (history.supported) {
                        history.initial.popped = ('state' in window.history), history.initial.URL = location.href;
                        window.onpopstate = history.popState;
                    }
                    else {
                        if (history.fallback) {
                            for (var route in Path.routes.defined) {
                                if (route.charAt(0) != "#") {
                                    Path.routes.defined["#" + route] = Path.routes.defined[route];
                                    Path.routes.defined["#" + route].path = "#" + route;
                                }
                            }
                            Path.listen();
                        }
                    }
                }
                history.listen = listen;
            })(history = Routing.history || (Routing.history = {}));
            var Path;
            (function (Path) {
                function map(path) {
                    if (Path.routes.defined.hasOwnProperty(path)) {
                        return Path.routes.defined[path];
                    }
                    else {
                        return new Path.core.route(path);
                    }
                }
                Path.map = map;
                function root(path) {
                    Path.routes.root = path;
                }
                Path.root = root;
                function rescue(fn) {
                    Path.routes.rescue = fn;
                }
                Path.rescue = rescue;
                function match(path, parameterize) {
                    var params = {}, route = null, possible_routes, slice, i, j, compare;
                    for (route in Path.routes.defined) {
                        if (route !== null && route !== undefined) {
                            route = Path.routes.defined[route];
                            possible_routes = route.partition();
                            for (j = 0; j < possible_routes.length; j++) {
                                slice = possible_routes[j];
                                compare = path;
                                if (slice.search(/:/) > 0) {
                                    for (i = 0; i < slice.split("/").length; i++) {
                                        if ((i < compare.split("/").length) && (slice.split("/")[i].charAt(0) === ":")) {
                                            params[slice.split('/')[i].replace(/:/, '')] = compare.split("/")[i];
                                            compare = compare.replace(compare.split("/")[i], slice.split("/")[i]);
                                        }
                                    }
                                }
                                if (slice === compare) {
                                    if (parameterize) {
                                        route.params = params;
                                    }
                                    return route;
                                }
                            }
                        }
                    }
                    return null;
                }
                Path.match = match;
                function dispatch(passed_route) {
                    var previous_route, matched_route;
                    if (Path.routes.current !== passed_route) {
                        Path.routes.previous = Path.routes.current;
                        Path.routes.current = passed_route;
                        matched_route = Path.match(passed_route, true);
                        if (Path.routes.previous) {
                            previous_route = Path.match(Path.routes.previous);
                            if (previous_route !== null && previous_route.do_exit !== null) {
                                previous_route.do_exit();
                            }
                        }
                        if (matched_route !== null) {
                            matched_route.run();
                            return true;
                        }
                        else {
                            if (Path.routes.rescue !== null) {
                                Path.routes.rescue();
                            }
                        }
                    }
                }
                Path.dispatch = dispatch;
                function listen() {
                    var fn = function () { Path.dispatch(location.hash); };
                    if (location.hash === "" && Path.routes.root !== null)
                        location.hash = Path.routes.root;
                    if ("onhashchange" in window && (!document.documentMode || document.documentMode >= 8)) {
                        var cc = Object.getOwnPropertyDescriptor(window, 'onhashchange');
                        __corelib__.$defineProperty(window, 'onhashchange', { set: function (v) { cc.set.call(this, fn); }, get: function () { return fn; }, configurable: false, enumerable: false });
                        var cc = Object.getOwnPropertyDescriptor(window, 'onpopstate');
                        __corelib__.$defineProperty(window, 'onpopstate', { set: function (v) { cc.set.call(this, fn); }, get: function () { return fn; }, configurable: false, enumerable: false });
                    }
                    else {
                        setInterval(fn, 50);
                    }
                    if (location.hash !== "") {
                        Path.dispatch(location.hash);
                    }
                }
                Path.listen = listen;
                var core;
                (function (core) {
                    var route = (function () {
                        function route(path) {
                            this.path = path;
                            this.action = null;
                            this.do_enter = [];
                            this.do_exit = null;
                            this.params = {};
                            Path.routes.defined[path] = this;
                        }
                        route.prototype.to = function (fn) {
                            this.action = fn;
                            return this;
                        };
                        route.prototype.enter = function (fns) {
                            if (fns instanceof Array) {
                                this.do_enter = this.do_enter.concat(fns);
                            }
                            else {
                                this.do_enter.push(fns);
                            }
                            return this;
                        };
                        route.prototype.exit = function (fn) {
                            this.do_exit = fn;
                            return this;
                        };
                        route.prototype.partition = function () {
                            var parts = [], options = [], re = /\(([^}]+?)\)/g, text, i;
                            while (text = re.exec(this.path)) {
                                parts.push(text[1]);
                            }
                            options.push(this.path.split("(")[0]);
                            for (i = 0; i < parts.length; i++) {
                                options.push(options[options.length - 1] + parts[i]);
                            }
                            return options;
                        };
                        route.prototype.run = function () {
                            var halt_execution = false, i, result;
                            if (Path.routes.defined[this.path].hasOwnProperty("do_enter")) {
                                if (Path.routes.defined[this.path].do_enter.length > 0) {
                                    for (i = 0; i < Path.routes.defined[this.path].do_enter.length; i++) {
                                        result = Path.routes.defined[this.path].do_enter[i].apply(this, null);
                                        if (result === false) {
                                            halt_execution = true;
                                            break;
                                        }
                                    }
                                }
                            }
                            if (!halt_execution) {
                                Path.routes.defined[this.path].action();
                            }
                        };
                        return route;
                    }());
                    core.route = route;
                })(core = Path.core || (Path.core = {}));
                Path.routes = {
                    'current': null,
                    'root': null,
                    'rescue': null,
                    'previous': null,
                    'defined': {},
                };
            })(Path = Routing.Path || (Routing.Path = {}));
            ;
        })(Routing = basic.Routing || (basic.Routing = {}));
        var Url = (function () {
            function Url(url) {
                if (url)
                    this.init(url);
            }
            Url.prototype.getEName = function (defaultExt) {
                if (this.IsFolder)
                    return "";
                var defaultExt = this.ext ? this.ext : this.moduleType >= 0 ? ModuleExt[this.moduleType] || defaultExt : defaultExt;
                var s = this.moduleName;
                if (defaultExt)
                    s += "." + defaultExt;
                if (this.params)
                    s += "?" + this.params;
                return s;
            };
            Url.prototype.toString = function () {
                var s = "";
                if (this.IsExternal)
                    s = this.host;
                s += "/";
                if (this.path.length > 0)
                    s += this.path.join('/') + '/';
                s += this.getEName();
                return s;
            };
            Url.prototype.init = function (url) {
                var _a, _b;
                url = url.toLowerCase().trim();
                var i = url.indexOf('|');
                if (i !== -1) {
                    this.moduleType = ModuleType[url.substr(0, i)];
                    url = url.substr(i + 1);
                }
                if (url.indexOf('//') === 0)
                    _a = Url.getHost(url = url.substr(2)), this.host = _a[0], this.path = _a[1];
                else
                    _b = Url.getFullHost(url), this.host = _b[0], this.path = _b[1];
                var lp = this.path.pop();
                if (lp) {
                    this.IsFolder = false;
                    var iq = lp.indexOf('?');
                    var ename = iq === -1 ? lp : lp.substr(0, iq);
                    if (iq == -1)
                        this.params = "";
                    else
                        this.params = lp.substr(iq + 1);
                    iq = iq === -1 ? lp.length - 1 : i;
                    var iext = ename.lastIndexOf('.');
                    if (iext !== -1) {
                        this.ext = ename.substr(iext + 1);
                        this.moduleName = ename.substr(0, iext);
                    }
                    else {
                        this.moduleName = ename;
                    }
                }
                else {
                    this.IsFolder = true;
                    this.moduleType = ModuleType.folder;
                }
                if (this.moduleType == undefined)
                    this.moduleType = !this.ext ? ModuleType.code : (ModuleType[ModuleType[ModuleExt[this.ext]]]);
                if (this.moduleType === undefined && this.ext)
                    this.moduleType = ModuleType.uknown;
                return this;
            };
            Url.getHost = function (url) {
                var i = url.indexOf('://');
                var pi = url.indexOf('/');
                if (pi < i) {
                    path = url.split('/');
                    if (pi === 0)
                        path.shift(), host = Url.rootUrl.host;
                    ;
                    return [host, path];
                }
                if (i === -1)
                    throw " Invalid Url ";
                var s = url.indexOf('/', i + 3);
                var host = s === -1 ? url : url.substr(0, s);
                var path = s === -1 ? [""] : url.substr(s + 1).split('/');
                return [host, path];
            };
            Url.getFullHost = function (url) {
                var i = url.indexOf('://');
                var pi = url.indexOf('/');
                if (i === -1 || pi < i) {
                    path = url.split('/');
                    if (pi === 0)
                        path.shift(), host = Url.rootUrl.host;
                    ;
                }
                else {
                    var s = url.indexOf('/', i + 3);
                    var host = s === -1 ? url : url.substr(0, s);
                    var path = s === -1 ? [""] : url.substr(s + 1).split('/');
                }
                return [host, path];
            };
            Url.prototype.Combine = function (path) {
                var t = typeof path === 'string' ? new Url(path) : path;
                if (t.IsExternal)
                    return t;
                var c = new Url();
                c.host = this.host;
                c.path = this.path == null ? t.path : t.path == null ? null : this.path.concat(t.path);
                c.moduleType = t.moduleType;
                c.moduleName = t.moduleName;
                c.ext = t.ext;
                c.params = t.params;
                return c;
            };
            Object.defineProperty(Url.prototype, "IsExternal", {
                get: function () { return this.host != null && this.host != ""; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Url.prototype, "isAsset", {
                get: function () { return this.moduleType !== ModuleType.code; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Url.prototype, "path", {
                get: function () { return this._path; },
                set: function (v) { Url.RevalidatePath(v, this.IsExternal); this._path = v; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Url.prototype, "FullPath", {
                get: function () { return this.toString(); },
                enumerable: true,
                configurable: true
            });
            Url.prototype.SameHostAs = function (url) {
                var h1 = this.IsExternal ? this.host : Url.rootUrl.host;
                var h2 = url.IsExternal ? url.host : Url.rootUrl.host;
                return h1 === h2;
            };
            Url.RevalidatePath = function (ary, isFullPath) {
                if (!ary)
                    return;
                var i;
                var part;
                for (i = 0; i < ary.length; i++) {
                    part = ary[i];
                    if (part === '.') {
                        ary.splice(i, 1);
                        i -= 1;
                    }
                    else if (part === '..') {
                        if (isFullPath) {
                            if (i == 0) {
                                ary.splice(i, 1);
                                i -= 1;
                            }
                            else {
                                ary.splice(i - 1, 2);
                                i -= 2;
                            }
                        }
                        else if (i === 0 || (i === 1 && ary[2] === '..') || ary[i - 1] === '..') {
                            continue;
                        }
                        else if (i > 0) {
                            ary.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
            };
            Url.prototype.intersect = function (url) {
                if (!this.SameHostAs(url))
                    return null;
                var c = new Url();
                c.host = this.host;
                return c;
            };
            Object.defineProperty(Url.prototype, "IsInternal", {
                get: function () {
                    return this.IsExternal ? Url.rootUrl.SameHostAs(this) : true;
                },
                enumerable: true,
                configurable: true
            });
            Url.rootUrl = new Url(document.location.href);
            return Url;
        }());
        basic.Url = Url;
    })(basic = exports.basic || (exports.basic = {}));
    var query;
    (function (query) {
        function hasClass(t, d, param) {
            return d instanceof Element && d.classList.contains(param);
        }
        query.hasClass = hasClass;
        function hasTag(t, d, param) {
            return d instanceof Element && d.tagName === param.toUpperCase();
        }
        query.hasTag = hasTag;
        function insertAfter(newNode, referenceNode) {
            var next = referenceNode.nextSibling;
            if (next)
                referenceNode.parentNode.insertBefore(newNode, next);
            else
                referenceNode.parentNode.appendChild(newNode);
        }
        var __ = (function () {
            function __(dom) {
                this.dom = dom;
            }
            __.prototype.eq = function (n) {
                var d = n < 0 ? this.dom[this.dom.length - n] : this.dom[n];
                if (d)
                    return new _(d);
                return new ___();
            };
            __.prototype.removeClass = function (className) {
                for (var i = 0; i < this.dom.length; i++) {
                    var d = this.dom[i];
                    if (d instanceof Element)
                        d.classList.remove(className);
                }
                return this;
            };
            __.prototype.addClass = function (className) {
                for (var i = 0; i < this.dom.length; i++) {
                    var d = this.dom[i];
                    if (d instanceof Element)
                        d.classList.add(className);
                }
                return this;
            };
            __.prototype.hasClass = function (className) {
                for (var i = 0; i < this.dom.length; i++) {
                    var cd = this.dom[i];
                    if (cd instanceof Element)
                        if (cd.classList.contains(className))
                            return true;
                }
                return false;
            };
            __.prototype.parent = function (selector, param) {
                if (this.dom.length == 1)
                    return new _(this.dom[0]).parent(selector, param);
                else if (this.dom.length === 0)
                    return new ___();
                throw null;
            };
            __.prototype.submit = function () {
                for (var i = 0; i < this.dom.length; i++) {
                    var cd = this.dom[i];
                    if (cd instanceof HTMLFormElement)
                        cd.submit();
                }
            };
            __.prototype.siblings = function (selector, param) {
                throw new Error("Method not implemented.");
            };
            __.prototype.appendTo = function (dom) {
                throw new Error("Method not implemented.");
            };
            Object.defineProperty(__.prototype, "length", {
                get: function () { return this.dom.length; },
                enumerable: true,
                configurable: true
            });
            __.prototype.detach = function () {
                for (var i = 0; i < this.dom.length; i++) {
                    var cd = this.dom[i];
                    cd.parentNode.removeChild(cd);
                }
                return this;
            };
            __.prototype.insertBefore = function (thisDom) {
                for (var i = 0; i < this.dom.length; i++) {
                    var cd = this.dom[i];
                    if (cd != null)
                        cd.parentNode.removeChild(cd);
                    thisDom.parentElement.insertBefore(cd, thisDom);
                }
                return this;
            };
            __.prototype.insertAfter = function (referenceNode) {
                for (var i = 0; i < this.dom.length; i++) {
                    var cd = this.dom[i];
                    if (cd != null)
                        cd.parentNode.removeChild(cd);
                    insertAfter(cd, referenceNode);
                }
                return this;
            };
            __.prototype.find = function (selector, param) {
                var array = [];
                for (var i = 0; i < this.dom.length; i++) {
                    var d = this.dom[i];
                    var w = document.createTreeWalker(d, NodeFilter.SHOW_ALL, {
                        param: param,
                        this: this,
                        acceptNode: function (node) {
                            return selector(this.this, node, this.param) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
                        }
                    }, false);
                    while (w.nextNode())
                        array.push(w.currentNode);
                }
                return new __(array);
            };
            __.prototype.children = function (selector, param) {
                var r = [];
                for (var i = 0; i < this.dom.length; i++) {
                    var d = this.dom[i];
                    if (d instanceof Element)
                        for (var i = 0; i < d.children.length; i++) {
                            var t = d.children[i];
                            if (selector(this, t, param))
                                r.push(t);
                        }
                }
                return new __(r);
            };
            __.prototype.removeChildren = function (selector, param) {
                for (var i = 0; i < this.dom.length; i++) {
                    var d = this.dom[i];
                    if (d instanceof Element)
                        for (var i = 0; i < d.children.length; i++) {
                            var t = d.children[i];
                            if (selector(this, t, param)) {
                                d.removeChild(t);
                                i--;
                            }
                        }
                }
                return this;
            };
            __.prototype.add = function (dom) {
                if (dom instanceof Array) {
                    for (var i = 0; i < dom.length; i++)
                        this.dom.push(dom[i]);
                }
                else
                    this.dom.push(dom);
                return this;
            };
            __.prototype.toggleClass = function (className) {
                var d = this.dom;
                for (var i = 0; i < d.length; i++) {
                    var c = d[i];
                    if (c instanceof Element)
                        if (c.classList.contains(className))
                            c.classList.remove(className);
                        else
                            c.classList.add(className);
                }
                return this;
            };
            __.prototype.toArray = function () {
                return this.dom;
            };
            return __;
        }());
        query.__ = __;
        var _ = (function () {
            function _(dom) {
                this.dom = dom;
            }
            _.prototype.eq = function (n) {
                if (n === 0 || n === -1)
                    return this;
                return new ___();
            };
            _.prototype.hasClass = function (className) {
                var cd = this.dom;
                if (cd instanceof Element)
                    if (cd.classList.contains(className))
                        return true;
                return false;
            };
            _.prototype.parent = function (selector, param) {
                var t = this.dom.parentNode;
                while (t != document) {
                    if (selector(this, t, param))
                        return new _(t);
                    t = t.parentNode;
                }
                return new ___();
            };
            Object.defineProperty(_.prototype, "length", {
                get: function () { return 1; },
                enumerable: true,
                configurable: true
            });
            _.prototype.submit = function () {
                var cd = this.dom;
                if (cd instanceof HTMLFormElement)
                    cd.submit();
            };
            _.prototype.siblings = function (selector, param) {
                var t = this.dom;
                while (t.previousSibling) {
                    t = t.previousSibling;
                }
                var arr = [];
                do {
                    if (selector(this, t, param))
                        arr.push(t);
                    t = t.nextSibling;
                } while (t);
                return new __(arr);
            };
            _.prototype.detach = function () {
                if (this.dom.parentNode != null)
                    this.dom.parentNode.removeChild(this.dom);
                return this;
            };
            _.prototype.add = function (dom) {
                var array;
                if (dom instanceof Array) {
                    array = dom.slice();
                    array.unshift(this.dom);
                }
                else
                    array = [this.dom, dom];
                return new __(array);
            };
            _.prototype.toggleClass = function (className) {
                var c = this.dom;
                if (c instanceof Element)
                    if (c.classList.contains(className))
                        c.classList.remove(className);
                    else
                        c.classList.add(className);
            };
            _.prototype.insertBefore = function (thisDom) {
                if (this.dom.parentNode != null)
                    this.dom.parentNode.removeChild(this.dom);
                thisDom.parentElement.insertBefore(this.dom, thisDom);
                return this;
            };
            _.prototype.insertAfter = function (thisDom) {
                if (this.dom.parentNode != null)
                    this.dom.parentNode.removeChild(this.dom);
                insertAfter(this.dom, thisDom);
                return this;
            };
            _.prototype.children = function (selector, param) {
                var r = [];
                var d = this.dom;
                if (d instanceof HTMLElement)
                    for (var i = 0; i < d.children.length; i++) {
                        var t = d.children[i];
                        if (selector(this, t, param))
                            r.push(t);
                    }
                return new __(r);
            };
            _.prototype.removeChildren = function (selector, param) {
                var d = this.dom;
                if (d instanceof HTMLElement)
                    for (var i = 0; i < d.children.length; i++) {
                        var t = d.children[i];
                        if (selector(this, t, param)) {
                            d.removeChild(t);
                            i--;
                        }
                    }
                return this;
            };
            _.prototype.appendTo = function (dom) {
                this.detach();
                dom.appendChild(this.dom);
            };
            _.prototype.find = function (selector, param) {
                var array = [];
                var w = document.createTreeWalker(this.dom, NodeFilter.SHOW_ALL, {
                    param: param,
                    this: this,
                    acceptNode: function (node) {
                        return selector(this.this, node, this.param) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
                    }
                }, false);
                while (w.nextNode())
                    array.push(w.currentNode);
                return new __(array);
            };
            _.prototype.removeClass = function (className) {
                var d = this.dom;
                if (d instanceof Element)
                    d.classList.remove(className);
                return this;
            };
            _.prototype.addClass = function (className) {
                var d = this.dom;
                if (d instanceof Element)
                    d.classList.add(className);
                return this;
            };
            _.prototype.toArray = function () {
                return [this.dom];
            };
            return _;
        }());
        query._ = _;
        var ___ = (function () {
            function ___() {
            }
            ___.prototype.eq = function (n) {
                return this;
            };
            ___.prototype.removeClass = function (className) {
                return this;
            };
            ___.prototype.addClass = function (classNm) { return this; };
            ___.prototype.hasClass = function (className) {
                return false;
            };
            ___.prototype.detach = function () {
                return this;
            };
            ___.prototype.insertBefore = function (thisDom) {
                return this;
            };
            ___.prototype.insertAfter = function (thisDom) {
                return this;
            };
            ___.prototype.children = function (selector, param) {
                return new __([]);
            };
            ___.prototype.removeChildren = function (selector, param) {
                return this;
            };
            ___.prototype.find = function (selector, param) {
                return new __([]);
            };
            ___.prototype.add = function (dom) {
                return query.$$(dom);
            };
            ___.prototype.toggleClass = function (calssName) {
                return this;
            };
            ___.prototype.siblings = function (selector, param) {
                return new __([]);
            };
            ___.prototype.appendTo = function (dom) {
                return this;
            };
            Object.defineProperty(___.prototype, "length", {
                get: function () { return 0; },
                enumerable: true,
                configurable: true
            });
            ___.prototype.submit = function () {
                return this;
            };
            ___.prototype.parent = function (selector, param) {
                return this;
            };
            ___.prototype.toArray = function () {
                return [];
            };
            return ___;
        }());
        function $$(dom) {
            return dom instanceof Array ? new __(dom) : new _(dom);
        }
        query.$$ = $$;
    })(query = exports.query || (exports.query = {}));
    function $$(dom) { return query.$$(dom); }
    exports.$$ = $$;
    (function (basic) {
        var _events = new collections_1.collection.Dictionary("ethandler");
        var DomEventHandler = (function () {
            function DomEventHandler(dom, event, owner, handle, param) {
                this.dom = dom;
                this.event = event;
                this.owner = owner;
                this.handle = handle;
                this.param = param;
                this.Started = false;
                _events.Set(this, dom);
            }
            DomEventHandler.prototype.Start = function () {
                if (this.Started === false) {
                    this.Started = true;
                    this.dom.addEventListener(this.event, this);
                }
            };
            DomEventHandler.prototype.Pause = function () {
                if (this.Started === true) {
                    this.Started = false;
                    this.dom.removeEventListener(this.event, this);
                }
            };
            DomEventHandler.prototype.Dispose = function () {
                if (this.Started === undefined)
                    return;
                this.Pause();
                _events.Remove(this);
                this.dom = undefined;
                this.event = undefined;
                this.handle = undefined;
                this.Started = undefined;
                this.param = undefined;
            };
            DomEventHandler.prototype.Reset = function () {
                this.Pause();
                this.Start();
            };
            DomEventHandler.prototype.handleEvent = function (evt) {
                this.handle.call(this.owner, this, evt, this.param);
            };
            DomEventHandler.Dispose = function (dom, event) {
                var i;
                if (event == null)
                    for (var i_1 = 0, ks = _events.RemoveAllValues(dom); i_1 < ks.length; i_1++)
                        ks[i_1].Dispose();
                else
                    do
                        if ((i = _events.IndexOfValue(dom, i)) === -1)
                            break;
                        else
                            _events.RemoveAt(i).Key.Dispose();
                    while (true);
            };
            return DomEventHandler;
        }());
        basic.DomEventHandler = DomEventHandler;
    })(basic = exports.basic || (exports.basic = {}));
});
define("sys/Encoding", ["require", "exports", "sys/runtime", "context", "sys/Corelib"], function (require, exports, runtime_3, context_3, Corelib_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var serialization;
    (function (serialization) {
        function error(e) {
            try {
                return e.parser ? e.parser(e.e) : e.e.value;
            }
            catch (e) {
                return e.e.value;
            }
        }
        var CSV = (function () {
            function CSV(input, autoParse, asJson) {
                this.input = input;
                this.autoParse = autoParse;
                this.asJson = asJson;
                this.e = {
                    csv: this, index: -1, value: void 0, set: function (value, index) { this.value = value; this.index = index; return this; }
                };
                this.Columns = new Array();
                this._current = void 0;
                this._cursor = CSV.readLine(input, void 0, { cols: this.Columns, csv: this, e: this.e, parser: function (v) { return v.value; } });
                Object.defineProperty(this, '_startCursor', { value: this._cursor, configurable: false, writable: false, enumerable: false });
                this._current = asJson ? {} : new Array(this.Columns.length);
            }
            CSV.ReadAllLines = function (s) {
                var t = [];
                var pi = 0;
                var inq = false;
                for (var i = 0; i < s.length; i++) {
                    var c = s[i];
                    if (c == '\\') {
                        i++;
                        continue;
                    }
                    if (c == '"' && s[i - 1] !== '\\')
                        inq = !inq;
                    if (inq)
                        continue;
                    if (c == '\r') {
                        t.push(s.substr(pi, i - pi));
                        if (s[i + 1] == '\n')
                            i++;
                        pi = i + 1;
                    }
                }
                return t;
            };
            CSV.prototype.parse = function (pind, s) {
            };
            CSV.isEmptyLine = function (s, pchar) {
                if (!pchar)
                    pchar = { cursor: 0, value: void 0 };
                else if (pchar.EOF)
                    return true;
                var c = pchar.cursor || 0;
                var cchar = s[c];
                var r = s[c + 1];
                if (r == '\r') {
                    var n = s[c + 2];
                    if (n == '\n')
                        var nchar = { cursor: c + 3, EOF: s[c + 3] == null, len: 2, newLine: true, value: '\r\n' };
                    else
                        nchar = { cursor: c + 2, EOF: n == void 0, len: 1, newLine: true, value: '\r' };
                }
                else
                    nchar = { cursor: c + 1, EOF: r == void 0, len: 0, newLine: false, value: '' };
                if (nchar.EOF)
                    return true;
                if (nchar.newLine && pchar.newLine)
                    return true;
                return false;
            };
            CSV.trim = function (s, pchar) {
                if (!pchar)
                    pchar = { cursor: 0, value: void 0 };
                else if (pchar.EOF)
                    return pchar;
                var c = pchar.cursor || 0;
                var cchar = s[c];
                var r = s[c + 1];
                if (r == '\r') {
                    var n = s[c + 2];
                    if (n == '\n')
                        var nchar = { cursor: c + 3, EOF: s[c + 3] == null, len: 2, newLine: true, value: '\r\n' };
                    else
                        nchar = { cursor: c + 2, EOF: n == void 0, len: 1, newLine: true, value: '\r' };
                }
                else if (r == void 0) {
                    nchar = { cursor: c + 1, EOF: true, len: 0, newLine: void 0, value: void 0 };
                }
                else
                    return pchar;
                return nchar;
            };
            CSV.nextChar = function (s, pchar) {
                if (!pchar)
                    pchar = { cursor: 0, value: void 0 };
                else if (pchar.EOF)
                    return pchar;
                var start = pchar.cursor;
                var i = start;
                var lc;
                while (i < s.length) {
                    lc = c;
                    var c = s[i++];
                    if (c === this.separator)
                        return { value: c, cursor: i };
                    if (c === '"') {
                        if (lc !== '\\')
                            return { value: '"', cursor: i - 1 };
                    }
                    else if (c === '\r') {
                        var hasn = s[i] === '\n';
                        if (hasn)
                            i++;
                        return { value: hasn ? '\r\n' : c, cursor: i, newLine: true, len: hasn ? 2 : 1 };
                    }
                }
                return { value: void 0, cursor: s.length, EOF: true };
            };
            CSV.readString = function (s, stat) {
                var start = stat.cursor;
                var i = start;
                var lc = s[i];
                if (lc !== '"')
                    return null;
                while (++i < s.length) {
                    if (s[i] == '"' && lc !== '\\')
                        return { value: s.substring(stat.cursor, i + 1), cursor: i + 1, EOF: i == s.length - 1 };
                    else
                        lc = s[i];
                }
                return { value: s.substring(start), cursor: s.length, EOF: true };
            };
            CSV.readColumn = function (s, cursor) {
                if (!cursor)
                    cursor = { cursor: 0, value: void 0 };
                else if (cursor.EOF)
                    return void 0;
                var i = cursor;
                while (true) {
                    var nchar = this.nextChar(s, i);
                    if (nchar.value === this.separator)
                        return { value: s.substring(cursor.cursor, nchar.cursor - 1), EOF: false, cursor: nchar };
                    else if (nchar.EOF) {
                        return { value: s.substr(cursor.cursor), EOF: true, cursor: nchar };
                    }
                    else if (nchar.newLine)
                        return { value: s.substring(cursor.cursor, nchar.cursor - nchar.len), EOF: false, cursor: nchar };
                    else if (nchar.value === '"') {
                        var t = this.readString(s, nchar);
                        i = t;
                    }
                }
            };
            CSV.clear = function (arr, start) {
                for (; start < arr.length; start++)
                    arr[start] = void 0;
                return arr;
            };
            CSV.fillColumns = function (s, stat, e) {
                if (!e.e) {
                    e.e = {
                        csv: void 0,
                        set: function (v, i) { this.value = v; this.index = i; return this; }
                    };
                }
                ;
                var cols = e.cols;
                var header = e.header;
                var isarr = cols instanceof Array;
                if (stat && stat.EOF) {
                    if (isarr)
                        this.clear(cols, 0);
                    return stat;
                }
                var i = 0;
                var cursor = stat;
                do {
                    var p = this.readColumn(s, cursor);
                    if (!p) {
                        if (isarr)
                            this.clear(cols, i);
                        return { EOF: true, cursor: s.length, value: void 0 };
                    }
                    cursor = p.cursor;
                    e.e.set(p.value, i);
                    var v = error(e);
                    if (isarr)
                        cols[i] = v;
                    else if (header[i])
                        cols[header[i]] = v;
                    i++;
                } while (!cursor.EOF && i < (isarr ? cols : header).length && !cursor.newLine);
                if (!cursor.EOF && !p.cursor.newLine)
                    while (cursor && !cursor.EOF && !cursor.newLine)
                        p = this.readColumn(s, cursor), cursor = p && p.cursor;
                if (isarr)
                    this.clear(cols, i);
                return cursor;
            };
            CSV.readLine = function (s, stat, e) {
                if (!e.e) {
                    e.e = {
                        csv: void 0,
                        set: function (v, i) { this.value = v; this.index = i; return this; }
                    };
                }
                ;
                var cols = e.cols;
                var header = e.header;
                var isarr = cols instanceof Array;
                if (isarr)
                    cols.length = 0;
                if (stat && stat.EOF)
                    return stat;
                var cursor = stat;
                var i = 0;
                do {
                    var p = this.readColumn(s, cursor);
                    if (!p)
                        return { EOF: true, cursor: s.length, value: void 0 };
                    cursor = p.cursor;
                    e.e.set(p.value, i);
                    var v = error(e);
                    if (isarr)
                        cols.push(v);
                    else if (header[i])
                        cols[header[i]] = v;
                    i++;
                } while (!p.EOF && !p.cursor.newLine);
                return cursor;
            };
            CSV.prototype.ColumnName = function (index) {
                return this.Columns[index] || "";
            };
            CSV.prototype.ColumnIndex = function (name) { return this.Columns.indexOf(name); };
            Object.defineProperty(CSV.prototype, "Cursor", {
                get: function () { return this._cursor; },
                enumerable: true,
                configurable: true
            });
            CSV.prototype.Reset = function () { this._cursor = this._startCursor; return this; };
            CSV.prototype.Next = function (e) {
                if (this._cursor.EOF)
                    return false;
                if (!this.AllowNullValue)
                    while (true) {
                        var x = CSV.trim(this.input, this._cursor);
                        if (x === this._cursor)
                            break;
                        if (x.EOF)
                            return false;
                        if (x.newLine) {
                            this._cursor = x;
                            continue;
                        }
                        else
                            break;
                    }
                this._cursor = CSV.fillColumns(this.input, this._cursor, this.swapArgs(e));
                return true;
            };
            CSV.prototype.swapArgs = function (e) {
                if (!e)
                    return {
                        cols: this._current,
                        parser: this.autoParse ? this.jsonParser : void 0,
                        header: this.Columns || [],
                        csv: this, e: this.e
                    };
                if (!e.cols)
                    e.cols = this._current;
                if (!e.header)
                    e.header = this.Columns || [];
                if (!e.csv)
                    e.csv = this;
                if (!e.e)
                    e.e = this.e;
                return e;
            };
            CSV.prototype.jsonParser = function (e) { return !e.value ? void 0 : JSON.parse(e.value); };
            Object.defineProperty(CSV.prototype, "Current", {
                get: function () { return this._current; },
                enumerable: true,
                configurable: true
            });
            CSV.prototype.Field = function (name_index) {
                var c = this.Current;
                return c ? this.Current[typeof name_index === 'string' ? this.Columns.indexOf(name_index) : name_index] : null;
            };
            CSV.separator = ';';
            CSV.emptyArray = Object.freeze([]);
            return CSV;
        }());
        serialization.CSV = CSV;
    })(serialization = exports.serialization || (exports.serialization = {}));
    var encoding;
    (function (encoding) {
        var plg_json = require('plugin|json');
        if (plg_json)
            plg_json.addEventListener(ModuleStat.Executed, function (e) {
                var c = encoding.SerializationContext.GlobalContext.reset();
                var v = e.exports.value;
                var type = v.__type__;
                var name = v.__name__;
                var tt = c.FromJson(v, context_3.context.GetType(type) || Object, new Corelib_2.bind.Path(e, 'data'));
            }, null);
        var _sstore = new Map();
        var SerializationContext = (function () {
            function SerializationContext(isDefault) {
                this._ext = [];
                this.indexer = new Map();
                this.refs = [];
                this.cnt = 0;
                if (isDefault)
                    this._store = _sstore;
                else
                    this._store = new Map();
            }
            SerializationContext.prototype.Dispose = function () {
                this.reset();
                this._ext = null;
                this._store = null;
                this.cnt = null;
                this.indexer = null;
                this.refs = null;
            };
            SerializationContext.prototype.Register = function (type, ser) {
                this._store.set(type, ser);
            };
            SerializationContext.prototype.UnRegister = function (type) {
                var x = this._store.get(type);
                return this._store.delete(type) ? x : void 0;
            };
            SerializationContext.prototype.GetRegistration = function (type) {
                return this._store.get(type);
            };
            SerializationContext.prototype.Append = function (con) {
                this._ext.push(con);
            };
            SerializationContext.prototype.Get = function (type) {
                var v = this._store.get(type);
                if (v)
                    return v;
                var c = this._ext;
                for (var i = c.length - 1; i >= 0; i--)
                    if ((v = c[i].Get(type)) != null)
                        return v;
                return null;
            };
            SerializationContext.prototype.get = function (ref, path) {
                var dref = this.refs[ref];
                if (dref) {
                    if (dref.setted)
                        return path ? path.Set(this.refs[ref].val) : this.refs[ref].val;
                    else if (path) {
                        if (!dref.paths)
                            dref.paths = [path];
                        else
                            dref.paths.push(path);
                    }
                    else
                        throw "entry Point not Found";
                }
                else {
                    var i = { val: undefined, paths: [path] };
                    this.refs[ref] = i;
                }
                return undefined;
            };
            SerializationContext.prototype.set = function (ref, obj) {
                var x = this.refs[ref];
                if (x) {
                    x.val = obj;
                    x.setted = true;
                    if (x.paths)
                        for (var i = 0; i < x.paths.length; i++)
                            x.paths[i].Set(obj);
                }
                else
                    this.refs[ref] = { val: obj, setted: true };
            };
            SerializationContext.prototype.getJson = function (obj) {
                var l = this.indexer.get(obj);
                if (l == null) {
                    var ref = { __ref__: ++this.cnt };
                    var json = { '@ref': ref };
                    this.indexer.set(obj, l = { ref: ref, json: json, valid: false });
                    if (obj instanceof Corelib_2.bind.DObject) {
                        var type = context_3.context.NameOf(obj.constructor);
                        if (type != null)
                            json['__type__'] = type;
                    }
                }
                return l;
            };
            SerializationContext.prototype.reset = function () {
                this.indexer.clear();
                this.cnt = 0;
                this.refs.length = 0;
                return this;
            };
            SerializationContext.getType = function (type) {
                while (true) {
                    if (type instanceof runtime_3.reflection.DelayedType)
                        type = type.Type;
                    else if (type instanceof runtime_3.reflection.GenericType)
                        type = type.Constructor;
                    else
                        return type;
                }
            };
            SerializationContext.prototype.FromJson = function (json, type, path) {
                if (json == null)
                    return path ? path.Set(json) : json;
                if (type instanceof runtime_3.reflection.DelayedType)
                    type = type.Type;
                if (type instanceof runtime_3.reflection.GenericType)
                    type = type.Constructor;
                if (type === String || type === Number || type === Boolean)
                    return path ? path.Set(json) : json;
                else if (type === Date) {
                    if (typeof json === 'string')
                        return path.Set(new Date(Date.parse(json)));
                    return path.Set(new Date(json));
                }
                if (typeof json.__ref__ == 'number')
                    return this.get(json.__ref__, path);
                var obj;
                var ref = json['@ref'];
                delete json['@ref'];
                if (runtime_3.reflection.IsInstanceOf(type, Corelib_2.bind.DObject)) {
                    if (type.CreateFromJson)
                        obj = type.CreateFromJson(json, type, this.RequireNew ? this.RequireNew(json, type) : false);
                    if (obj == null)
                        obj = new type();
                    if (ref)
                        this.set(ref.__ref__, obj);
                    obj = obj.FromJson(json, this);
                }
                else {
                    if (type.prototype != null && type.prototype.hasOwnProperty('fromJson'))
                        obj = type.prototype.fromJson(json, context_3.context, ref);
                    else {
                        var c = this.Get(type);
                        obj = c != null ? c.FromJson(json, this, ref) : json;
                    }
                    if (ref)
                        this.set(ref.__ref__, obj);
                }
                return path ? path.Set(obj) : obj;
            };
            SerializationContext.prototype.ToJson = function (obj) {
                if (obj === null)
                    return null;
                switch (typeof obj) {
                    case 'undefined':
                    case 'boolean':
                    case 'number':
                    case 'string':
                        return obj;
                    case 'function':
                        return obj.toString();
                    default:
                        var ref_json = this.getJson(obj);
                        if (ref_json.valid)
                            return ref_json.ref;
                        if (obj === Object)
                            return this._toJson(obj, ref_json);
                        else if (obj instanceof Corelib_2.bind.DObject)
                            return obj.ToJson(this, ref_json);
                        else {
                            var c = this.Get(obj.constructor);
                            if (c) {
                                return c.ToJson(obj, this, ref_json);
                            }
                            else
                                return this._toJson(obj, ref_json);
                        }
                }
            };
            SerializationContext.prototype._toJson = function (obj, ret) {
                ret.valid = true;
                if (obj instanceof Array)
                    return this._arrayToJson(obj, ret);
                ret.json = {};
                for (var i in obj)
                    ret.json[i] = this.ToJson(obj[i]);
                return ret.json;
            };
            SerializationContext.prototype.toString = function () {
                JSON.stringify(this);
            };
            SerializationContext.prototype._arrayToJson = function (arr, ret) {
                var lst = [];
                var json = { "__type__": runtime_3.reflection.NativeTypes.Array, "__value__": lst, "@ref": ret.ref.__ref__ };
                for (var i = 0; i < arr.length; i++)
                    lst[i] = this.ToJson(arr[i]);
                return json;
            };
            SerializationContext.GlobalContext = new SerializationContext(true);
            return SerializationContext;
        }());
        encoding.SerializationContext = SerializationContext;
    })(encoding = exports.encoding || (exports.encoding = {}));
});
define("sys/collections", ["require", "exports", "sys/Corelib", "sys/runtime", "context"], function (require, exports, Corelib_3, runtime_4, context_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var utils;
    (function (utils) {
        var ListEventArgs = (function () {
            function ListEventArgs(oldItem, newItem, startIndex, event, collection) {
                this.oldItem = oldItem;
                this.newItem = newItem;
                this.startIndex = startIndex;
                this.event = event;
                this.collection = collection;
            }
            ListEventArgs.prototype.Dispose = function () {
                this.oldItem = null;
                this.newItem = null;
                this.startIndex = null;
                this.event = null;
            };
            Object.defineProperty(ListEventArgs, "ResetEvent", {
                get: function () {
                    return this._r || (this._r = new ListEventArgs(null, null, 0, collection.CollectionEvent.Reset, []));
                },
                enumerable: true,
                configurable: true
            });
            return ListEventArgs;
        }());
        utils.ListEventArgs = ListEventArgs;
        var Filter = (function (_super) {
            __extends(Filter, _super);
            function Filter() {
                var _this = _super.call(this) || this;
                _this._store = [];
                return _this;
            }
            Object.defineProperty(Filter.prototype, "Patent", {
                get: function () { return this._patent; },
                set: function (p) {
                    if (typeof p == 'string')
                        v = this.convertFromString(p);
                    var v = p;
                    if (!v) {
                        if (!this._patent)
                            return;
                        else if (this._patent.equals(null))
                            return;
                    }
                    else if (this._patent) {
                        if (v.equals(this._patent))
                            return;
                    }
                    this._patent = v;
                    var s = this._store;
                    for (var i = 0; i < s.length; i++) {
                        var e = s[i];
                        e.callback(this, e.data);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Filter.prototype.OnChanged = function (callback, data, name) {
                var t = new filterCallback(callback, data, name, Date.now());
                this._store.push(t);
                return t.id;
            };
            Filter.prototype.OffChanged = function (name_id) {
                if (typeof (name_id) == 'string') {
                    var name = name_id;
                    var s = this._store;
                    for (var i = s.length - 1; i >= 0; i--) {
                        var e = s[i];
                        if (e.name == name) {
                            s.splice(i, 1);
                        }
                    }
                }
                else if (typeof (name_id) == 'number') {
                    var id = name_id;
                    var s = this._store;
                    for (var i = s.length - 1; i >= 0; i--) {
                        var e = s[i];
                        if (e.id == id) {
                            s.splice(i, 1);
                            return;
                        }
                    }
                }
            };
            Filter.prototype._ismath = function (str) {
                for (var i = 0; i < str.length; i++)
                    if (str[i].indexOf(this._patent) !== -1)
                        return true;
                return false;
            };
            return Filter;
        }(Corelib_3.bind.DObject));
        utils.Filter = Filter;
        var CostumeFilter = (function (_super) {
            __extends(CostumeFilter, _super);
            function CostumeFilter(_isMatch) {
                var _this = _super.call(this) || this;
                _this._isMatch = _isMatch;
                return _this;
            }
            CostumeFilter.prototype.IsMatch = function (index, item) {
                return this._isMatch == null ? true : this._isMatch(this._patent, item);
            };
            CostumeFilter.prototype.convertFromString = function (x) { return x; };
            CostumeFilter.prototype.Begin = function (deb, count) { };
            return CostumeFilter;
        }(Filter));
        utils.CostumeFilter = CostumeFilter;
        var filterCallback = (function () {
            function filterCallback(callback, data, name, id) {
                this.callback = callback;
                this.data = data;
                this.name = name;
                this.id = id;
                if (id == void 0)
                    id = Date.now();
            }
            return filterCallback;
        }());
        utils.filterCallback = filterCallback;
        var Tree = (function () {
            function Tree(source, getParent, listen) {
                this.source = source;
                this.getParent = getParent;
                this.dic = new Map();
                this.OnChange = new Corelib_3.bind.EventListener(this.source);
                this.OnChange.On = listen;
                this.Reset();
            }
            Tree.prototype.Remove = function (c) {
                if (this.OnRemove(c))
                    this.source.Remove(c);
            };
            Tree.prototype.Add = function (c) {
                this.OnAdd(c);
                this.source.Add(c);
            };
            Tree.prototype.Clear = function () {
                this.OnClear();
                this.source.Clear();
            };
            Tree.prototype.Reset = function () {
                this.OnClear();
                var e = this.source.AsList();
                for (var i = 0; i < e.length; i++)
                    this.OnAdd(e[i]);
            };
            Tree.prototype._new = function (target) {
                return {
                    children: [], Value: target, Parent: null, get Depth() {
                        return this._depth ? this._depth : (this._depth = this.Parent ? this.Prent.Depth + 1 : 0);
                    }
                };
            };
            Tree.prototype.getOrAdd = function (key, value) {
                var c = this.dic.get(key);
                if (!c)
                    this.dic.set(key, value);
                return c;
            };
            Tree.prototype.OnAdd = function (target) {
                var parent = this.getParent(target);
                var node_parent;
                var node_target = this.getOrAdd(target, this._new(target));
                if (parent) {
                    (node_parent = this.getOrAdd(parent, this._new(parent))).children.push(node_target);
                    node_target.Parent = node_parent;
                }
                this.OnChange.Invoke(this.source, [node_parent, node_target, true]);
            };
            Tree.prototype.getNodes = function () { return this.dic.values(); };
            Tree.prototype.getBases = function () {
                var t = [];
                var e = this.dic.values();
                var c;
                while (!(c = e.next()).done)
                    if (c.value.Parent == null)
                        t.push(c.value);
                return t;
            };
            Tree.prototype.OnRemove = function (item) {
                var node_target = this.dic.get(item), parent = this.getParent(item);
                if (node_target)
                    if (node_target.children.length > 0)
                        return false;
                    else if (parent) {
                        var node_parent = this.dic.get(parent);
                        var t = node_parent.children.indexOf(node_target);
                        if (t >= 0)
                            node_parent.children.splice(t, 1);
                    }
                this.OnChange.Invoke(this.source, [node_parent, node_target, false]);
                return true;
            };
            Tree.prototype.OnClear = function () {
                this.OnChange.Invoke(this.source, []);
                this.dic.clear();
            };
            return Tree;
        }());
        utils.Tree = Tree;
    })(utils = exports.utils || (exports.utils = {}));
    var _encoding;
    (function (_encoding) {
        var BPath = (function () {
            function BPath(Owner, Property) {
                this.Owner = Owner;
                this.Property = Property;
            }
            BPath.prototype.Set = function (value) {
                this.Owner.set(this.Property, value);
                this.executed = true;
                return value;
            };
            return BPath;
        }());
        _encoding.BPath = BPath;
        var LPath = (function () {
            function LPath(Owner, Property) {
                this.Owner = Owner;
                this.Property = Property;
            }
            LPath.prototype.Set = function (value) {
                if (!this.Owner.Insert(this.Property, value))
                    this.Owner.Add(value);
                this.executed = true;
                return value;
            };
            return LPath;
        }());
        _encoding.LPath = LPath;
    })(_encoding || (_encoding = {}));
    var collection;
    (function (collection_1) {
        var CollectionEvent;
        (function (CollectionEvent) {
            CollectionEvent[CollectionEvent["Added"] = 0] = "Added";
            CollectionEvent[CollectionEvent["Removed"] = 1] = "Removed";
            CollectionEvent[CollectionEvent["Replace"] = 2] = "Replace";
            CollectionEvent[CollectionEvent["Cleared"] = 3] = "Cleared";
            CollectionEvent[CollectionEvent["Reset"] = 4] = "Reset";
            CollectionEvent[CollectionEvent["Setted"] = 5] = "Setted";
        })(CollectionEvent = collection_1.CollectionEvent || (collection_1.CollectionEvent = {}));
        var List = (function (_super) {
            __extends(List, _super);
            function List(argType, array) {
                var _this = _super.call(this) || this;
                _this.argType = argType;
                _this._list = [];
                _this._changed = [];
                _this._changing = [];
                if (array)
                    if (array.length)
                        for (var i = 0, len = array.length; i < len; i++)
                            _this._list.push(array[i]);
                _this.UCount();
                return _this;
            }
            List.__fields__ = function () { return [List.DPCount]; };
            List.prototype.UCount = function () { this.set(List.DPCount, this._list.length); };
            Object.defineProperty(List.prototype, "ArgType", {
                get: function () { return this.argType; },
                enumerable: true,
                configurable: true
            });
            List.prototype.GetType = function () { return runtime_4.reflection.GenericType.GetType(this.constructor, [this.argType]); };
            List.prototype.AsList = function () {
                return this._list;
            };
            List.prototype.Order = function (comp) {
                var p = this._list;
                var l = p.length;
                for (var i = 0; i < l; i++)
                    for (var j = i + 1; j < l; j++) {
                        if (comp(p[i], p[j]) > 0) {
                            var c = p[j];
                            p[j] = p[i];
                            p[i] = c;
                        }
                    }
            };
            List.prototype.OrderBy = function (comp) {
                var x = this._list.sort(comp);
                this.OnChanged(null, 0, CollectionEvent.Reset, null, x);
            };
            List.prototype.Filtred = function (filter) {
                var c = new ExList(this.argType);
                c.Filter = filter;
                c.Source = this;
                return c;
            };
            List.prototype.Set = function (i, item) {
                if (i < 0)
                    return false;
                if (this._list.length <= i)
                    return false;
                var old = this._list[i];
                if (old === item)
                    return true;
                this._list[i] = item;
                this.OnChanged(item, i, CollectionEvent.Setted, old);
            };
            List.prototype.Get = function (i) {
                if (i < 0)
                    return null;
                if (this._list.length <= i)
                    return null;
                return this._list[i];
            };
            List.prototype.Insert = function (i, item) {
                if (this._isFrozen)
                    return;
                if (i >= 0 && i <= this._list.length) {
                    this._list.splice(i, 0, item);
                    this.OnChanged(item, i, CollectionEvent.Added, null);
                    return true;
                }
                return false;
            };
            List.prototype.Add = function (item) {
                if (this._isFrozen)
                    return;
                if (item == null)
                    throw 'NullArgument detected';
                this._list.push(item);
                this.OnChanged(item, this._list.length - 1, CollectionEvent.Added, null);
                return this;
            };
            List.prototype.AddRange = function (items) {
                if (this._isFrozen)
                    return;
                for (var i = 0; i < items.length; i++) {
                    this.Add(items[i]);
                }
            };
            List.prototype.CheckIndex = function (i) {
                return i >= 0 && i < this._list.length;
            };
            List.prototype.Remove = function (item) {
                if (this._isFrozen)
                    return;
                if (typeof item != "number")
                    item = this.IndexOf(item);
                return this.RemoveAt(item);
            };
            List.prototype.RemoveAt = function (item) {
                if (this._isFrozen)
                    return;
                if (typeof item != "number")
                    return;
                if (this.CheckIndex(item)) {
                    var t = this._list[item];
                    this._list.splice(item, 1);
                    this.OnChanged(t, item, CollectionEvent.Removed, t);
                    return true;
                }
                return false;
            };
            List.prototype.Clear = function () {
                if (this._isFrozen)
                    return;
                var l = this._list.length;
                if (l > 0) {
                    this.OnChanged(null, 0, CollectionEvent.Cleared, null, this._list.splice(0, this._list.length));
                }
            };
            Object.defineProperty(List.prototype, "Count", {
                get: function () { return this._list.length; },
                enumerable: true,
                configurable: true
            });
            List.prototype.IndexOf = function (item) {
                return this._list.indexOf(item);
            };
            Object.defineProperty(List.prototype, "Listen", {
                set: function (delegate) {
                    this._changed.push(delegate);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(List.prototype, "Unlisten", {
                set: function (delegate) {
                    var x = this._changed.indexOf(delegate);
                    if (x < 0)
                        return;
                    this._changed.splice(x, 1);
                },
                enumerable: true,
                configurable: true
            });
            List.prototype.OnChanged = function (item, startIndex, event, oldItem, collection) {
                var e = new utils.ListEventArgs(oldItem, item, startIndex, event, collection);
                var l = this._changed.length;
                this.UCount();
                for (var i = 0; i < l; i++) {
                    var con = this._changed[i];
                    if (typeof con === 'function')
                        con(e);
                    else {
                        con.Invoke.call(con.Owner, e);
                    }
                }
            };
            List.prototype.getArgType = function (json) {
                var type = this.ArgType;
                if (type != null)
                    return type;
                var typeName = json['__argtype__'];
                type = (typeName == undefined ? Object : context_4.context.GetType(typeName));
                return (type == undefined) ? this.argType == undefined ? Object : this.argType : type;
            };
            List.prototype.ToJson = function (x, indexer) {
                indexer = indexer == undefined ? x.getJson(this) : indexer;
                var ret = x.getJson(this);
                if (indexer.valid)
                    return indexer.ref;
                else
                    ret = _super.prototype.ToJson.call(this, x, indexer);
                indexer.valid = true;
                var list = [];
                var t = this._list;
                for (var i = 0; i < t.length; i++) {
                    var d = t[i];
                    d = x.ToJson(d);
                    list.push(d);
                }
                ret['__list__'] = list;
                ret['__argtype__'] = context_4.context.NameOf(this.argType);
                return ret;
            };
            List.prototype.FromJson = function (json, x, update, callback) {
                var list = json['__list__'] || [];
                this._list = new Array(0);
                var type = this.argType = this.getArgType(json);
                for (var i = 0; i < list.length; i++) {
                    var c = list[i];
                    if (c === undefined)
                        continue;
                    var st = List.getType(c);
                    if (st === undefined)
                        st = this.argType;
                    x.FromJson(c, st === undefined ? type : st, new _encoding.LPath(this, i));
                }
                _super.prototype.FromJson.call(this, json, x, update);
                this.OnDeserialize(this._list);
                if (json != null && json.IsFrozen)
                    this.Freeze();
                return this;
            };
            List.prototype.OnDeserialize = function (list) {
            };
            List.getType = function (json) {
                var tn = json['__type__'];
                if (tn == undefined)
                    return undefined;
                return context_4.context.GetType(tn);
            };
            List.GenType = function (T) { return runtime_4.reflection.GenericType.GetType(this, [T]); };
            List.DPCount = List.CreateField('Count', Number, 0, null, null, 2);
            return List;
        }(Corelib_3.bind.DObject));
        collection_1.List = List;
        var Dictionary = (function (_super) {
            __extends(Dictionary, _super);
            function Dictionary(Name, ReadOnly) {
                var _this = _super.call(this) || this;
                _this.Name = Name;
                _this.ReadOnly = ReadOnly;
                _this.keys = [];
                _this.values = [];
                _this._changed = [];
                ReadOnly = ReadOnly == null ? true : false;
                return _this;
            }
            Dictionary.prototype.GetKeyAt = function (i) { return this.keys[i]; };
            Dictionary.prototype.GetValueAt = function (i) { return this.values[i]; };
            Object.defineProperty(Dictionary.prototype, "Count", {
                get: function () { return this.keys.length; },
                enumerable: true,
                configurable: true
            });
            Dictionary.prototype.Clear = function () {
                this.keys.length = 0;
                this.values.length = 0;
                this.OnChanged(null, null, CollectionEvent.Cleared, null);
            };
            Dictionary.prototype.IndexOf = function (key, fromIndex) {
                return this.keys.indexOf(key, fromIndex);
            };
            Dictionary.prototype.IndexOfValue = function (val, fromIndex) {
                return this.values.indexOf(val, fromIndex);
            };
            Dictionary.prototype.Set = function (key, value) {
                var i = this.keys.indexOf(key);
                if (i === -1) {
                    i = this.keys.length;
                    this.keys.push(key);
                }
                else if (this.ReadOnly)
                    if (this.values[i] === value)
                        return;
                    else
                        throw "key is exist";
                this.values[i] = value;
            };
            Dictionary.prototype.Remove = function (key) {
                var i = this.keys.indexOf(key);
                if (i === -1)
                    return undefined;
                var val = this.values[i];
                this.values.splice(i, 1);
                this.keys.splice(i, 1);
                return val;
            };
            Dictionary.prototype.RemoveAllValues = function (val) {
                var keys = [];
                do {
                    var i = this.values.indexOf(val, i);
                    if (i === -1)
                        return keys;
                    keys.push(this.keys[i]);
                    this.values.splice(i, 1);
                    this.keys.splice(i, 1);
                } while (true);
            };
            Dictionary.prototype.RemoveAt = function (i) {
                if (i < this.keys.length && i >= 0) {
                    var r = { Key: this.keys[i], Value: this.values[i] };
                    this.values.splice(i, 1);
                    this.keys.splice(i, 1);
                    return r;
                }
                return undefined;
            };
            Dictionary.prototype.getValues = function () { return this.values; };
            Dictionary.prototype.Get = function (key) {
                var i = this.keys.indexOf(key);
                return i === -1 ? undefined : this.values[i];
            };
            Dictionary.prototype.GetOrAdd = function (key, value) {
                var i = this.keys.indexOf(key);
                if (i !== -1)
                    return this.values[i];
                this.keys.push(key);
                this.values.push(value);
                return value;
            };
            Dictionary.prototype.GetOrCreate = function (key, New, param) {
                var i = this.keys.indexOf(key);
                if (i !== -1)
                    return this.values[i];
                var value = New(key, param);
                this.keys.push(key);
                this.values.push(value);
                return value;
            };
            Dictionary.prototype.GetKeyOf = function (val) {
                var i = this.values.indexOf(val);
                return i === -1 ? undefined : this.keys[i];
            };
            Object.defineProperty(Dictionary.prototype, "Listen", {
                set: function (delegate) {
                    this._changed.push(delegate);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Dictionary.prototype, "Unlisten", {
                set: function (delegate) {
                    var x = this._changed.indexOf(delegate);
                    if (x < 0)
                        return;
                    this._changed.splice(x, 1);
                },
                enumerable: true,
                configurable: true
            });
            Dictionary.prototype.OnChanged = function (item, startIndex, event, oldItem) {
                var e = new utils.ListEventArgs(oldItem, item, startIndex, event);
                var l = this._changed.length;
                for (var i = 0; i < l; i++) {
                    var con = this._changed[i];
                    con(e);
                }
            };
            return Dictionary;
        }(Corelib_3.bind.DObject));
        collection_1.Dictionary = Dictionary;
        var ExList = (function (_super) {
            __extends(ExList, _super);
            function ExList(argType) {
                var _this = _super.call(this, argType) || this;
                _this._fid = null;
                _this.sicd = { Owner: _this, Invoke: _this.sourceItemChanged };
                return _this;
            }
            Object.defineProperty(ExList.prototype, "Source", {
                get: function () { return this.get(ExList.DPSource); },
                set: function (value) { this.set(ExList.DPSource, value); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ExList.prototype, "Filter", {
                get: function () { return this.get(ExList.DPFilter); },
                set: function (value) { this.set(ExList.DPFilter, value); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ExList.prototype, "MaxResult", {
                get: function () { return this.get(ExList.DPMaxResult); },
                set: function (value) { this.set(ExList.DPMaxResult, value); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ExList.prototype, "Shift", {
                get: function () { return this.get(ExList.DPShift); },
                set: function (value) { this.set(ExList.DPShift, value); },
                enumerable: true,
                configurable: true
            });
            ExList.__fields__ = function () { return [ExList.DPFilter, ExList.DPMaxResult, ExList.DPShift, ExList.DPSource]; };
            ExList.prototype.filterChanged = function (e) {
                if (e._old)
                    e._old.OffChanged(this._fid);
                if (e._new)
                    this._fid = e._new.OnChanged(ExList.patentChanged, this);
                this.Reset();
            };
            ExList.prototype.sourceChanged = function (e) {
                if (e._old)
                    e._old.Unlisten = this.sicd;
                if (e._new)
                    e._new.Listen = this.sicd;
                this.Reset();
            };
            ExList.prototype.MaxResultChanged = function (e) {
                this.Reset();
            };
            ExList.New = function (source, filter, argType) {
                var t = new ExList(source == null ? argType : source.ArgType);
                t.Filter = filter;
                t.Source = source;
                return t;
            };
            ExList.patentChanged = function (e, t) {
                t.Reset();
            };
            ExList.prototype.sourceItemChanged = function (e) {
                switch (e.event) {
                    case CollectionEvent.Added:
                        if (this.MaxResult <= this.Count)
                            return;
                        if (this.isMatch(e.startIndex, e.newItem))
                            _super.prototype.Add.call(this, e.newItem);
                        return;
                    case CollectionEvent.Cleared:
                        return _super.prototype.Clear.call(this);
                    case CollectionEvent.Removed:
                        _super.prototype.Remove.call(this, e.oldItem);
                        return;
                    case CollectionEvent.Replace:
                        var i = this.IndexOf(e.oldItem);
                        var m = this.isMatch(e.startIndex, e.newItem);
                        if (m) {
                            if (i == -1)
                                _super.prototype.Add.call(this, e.newItem);
                            else
                                this.Set(i, e.newItem);
                        }
                        else if (i != -1)
                            _super.prototype.RemoveAt.call(this, i);
                        return;
                    case CollectionEvent.Reset:
                        return this.Reset();
                    case CollectionEvent.Setted:
                        var i = this.IndexOf(e.oldItem);
                        var m = this.isMatch(e.startIndex, e.newItem);
                        if (m)
                            if (i == -1)
                                _super.prototype.Add.call(this, e.newItem);
                            else
                                _super.prototype.Set.call(this, i, e.newItem);
                        else if (i !== -1)
                            _super.prototype.RemoveAt.call(this, i);
                        return;
                }
            };
            ExList.prototype.isMatch = function (i, item) {
                var f = this.Filter;
                if (f == null)
                    return true;
                return f.IsMatch(i, item);
            };
            ExList.prototype.Reset = function () {
                _super.prototype.Clear.call(this);
                var s = this.Source;
                if (s == null)
                    return;
                var f = this.Filter;
                var fin = f == null;
                var max = this.MaxResult;
                if (!fin)
                    if (f.Begin(this.Shift, this.MaxResult))
                        _super.prototype.AddRange.call(this, s.AsList());
                    else
                        for (var i = 0, l = s.Count; i < l && max > 0; i++) {
                            var e = s.Get(i);
                            if (fin)
                                _super.prototype.Add.call(this, e);
                            else {
                                var r = f.IsMatch(i, e);
                                if (r === null)
                                    break;
                                if (r)
                                    _super.prototype.Add.call(this, e);
                            }
                        }
            };
            ExList.DPSource = Corelib_3.bind.DObject.CreateField("Source", List, null, function (e) { e.__this.sourceChanged(e); });
            ExList.DPFilter = Corelib_3.bind.DObject.CreateField("Filter", utils.Filter, null, function (e) { e.__this.filterChanged(e); });
            ExList.DPMaxResult = Corelib_3.bind.DObject.CreateField("MaxResult", Number, Infinity, function (e) { e.__this.MaxResultChanged(e); });
            ExList.DPShift = Corelib_3.bind.DObject.CreateField("Shift", Number, 0, function (e) { e.__this.MaxResultChanged(e); });
            return ExList;
        }(List));
        collection_1.ExList = ExList;
        var TransList = (function (_super) {
            __extends(TransList, _super);
            function TransList(argType, converter, stat) {
                var _this = _super.call(this, argType) || this;
                _this.converter = converter;
                _this.stat = stat;
                _this.sli = { Owner: _this, Invoke: _this.OnSourceChanged };
                return _this;
            }
            TransList.__fields__ = function () { return [this.DPSource]; };
            TransList.prototype.SourceChanged = function (e) {
                var o = e._old;
                var n = e._new;
                if (o)
                    o.Unlisten = this.sli;
                if (n)
                    n.Listen = this.sli;
                this.Reset();
            };
            TransList.prototype.OnSourceChanged = function (e) {
                this._internal = true;
                try {
                    switch (e.event) {
                        case CollectionEvent.Added:
                            var x = this.converter.ConvertA2B(this, e.startIndex, e.newItem, this.stat);
                            _super.prototype.Add.call(this, x);
                            break;
                        case CollectionEvent.Cleared:
                            _super.prototype.Clear.call(this);
                            break;
                        case CollectionEvent.Removed:
                            _super.prototype.Remove.call(this, e.startIndex);
                            break;
                        case CollectionEvent.Replace:
                            var x = this.converter.ConvertA2B(this, e.startIndex, e.newItem, this.stat);
                            _super.prototype.Set.call(this, e.startIndex, x);
                            break;
                        case CollectionEvent.Reset:
                            this.Reset();
                            break;
                    }
                }
                catch (e) {
                }
                this._internal = false;
            };
            TransList.prototype.Reset = function () {
                _super.prototype.Clear.call(this);
                var n = this.Source;
                if (!n)
                    return;
                n = n.AsList();
                for (var i = 0, l = n.length; i < l; i++) {
                    var x = this.converter.ConvertA2B(this, i, n[i], this.stat);
                    _super.prototype.Add.call(this, x);
                }
            };
            TransList.prototype.Add = function (t) {
                if (this._internal)
                    return _super.prototype.Add.call(this, t);
                this.Source.Add(this.converter.ConvertB2A(this, this._list.length, t, this.stat));
            };
            TransList.prototype.Remove = function (x) {
                if (this._internal)
                    return _super.prototype.Remove.call(this, x);
                this.Source.Remove(this.converter.ConvertB2A(this, this._list.indexOf(x), x, this.stat));
            };
            TransList.prototype.Insert = function (i, item) {
                if (this._internal)
                    return _super.prototype.Insert.call(this, i, item);
                this.Source.Insert(i, this.converter.ConvertB2A(this, i, item, this.stat));
            };
            TransList.prototype.Clear = function () {
                if (this._internal)
                    return _super.prototype.Clear.call(this);
                this.Source.Clear();
            };
            TransList.prototype.Order = function (n) {
            };
            TransList.prototype.OrderBy = function (n) {
            };
            TransList.prototype.Set = function (i, item) {
                if (this._internal)
                    return _super.prototype.Set.call(this, i, item);
                this.Source.Set(i, this.converter.ConvertB2A(this, i, item, this.stat));
            };
            TransList.DPSource = Corelib_3.bind.DObject.CreateField("Source", List, null, TransList.prototype.SourceChanged);
            return TransList;
        }(List));
        collection_1.TransList = TransList;
        var Binding = (function () {
            function Binding(dataContext) {
                this.DataContext = dataContext;
            }
            Binding.prototype.GetType = function () { return Binding; };
            Object.defineProperty(Binding.prototype, "DataContext", {
                get: function () { return this._dataContext; },
                set: function (value) {
                    if (value == this._dataContext)
                        return;
                    var t = this._dataContext;
                    if (t != null)
                        t.Unlisten = this.initChanged;
                    if (value != null)
                        value.Listen = this.initChanged;
                    this._dataContext = value;
                    this.OnSourceInitialized(t, value);
                },
                enumerable: true,
                configurable: true
            });
            Binding.prototype.initChanged = function (e) {
                switch (e.event) {
                    case collection.CollectionEvent.Added:
                        this.OnItemAdded(e.newItem, e.startIndex);
                        break;
                    case collection.CollectionEvent.Removed:
                        this.OnItemRemoved(e.oldItem, e.startIndex);
                        break;
                    case collection.CollectionEvent.Cleared:
                        this.OnSourceCleared();
                        break;
                    case collection.CollectionEvent.Reset:
                        this.OnSourceReset();
                        break;
                    case collection.CollectionEvent.Replace:
                        this.OnSourceReplace(e.oldItem, e.newItem, e.startIndex);
                }
            };
            return Binding;
        }());
        collection_1.Binding = Binding;
        var Render = (function (_super) {
            __extends(Render, _super);
            function Render(dataContext) {
                return _super.call(this, dataContext) || this;
            }
            Render.prototype.GetType = function () { return Render; };
            Object.defineProperty(Render.prototype, "RendredList", {
                get: function () {
                    if (this._rendredList == null)
                        this._rendredList = new collection.List(Object, []);
                    return this._rendredList;
                },
                enumerable: true,
                configurable: true
            });
            Render.prototype.OnItemAdded = function (item, index) {
                this.RendredList.Insert(index, this.Render(item));
            };
            Render.prototype.OnItemRemoved = function (item, index) {
                this.RendredList.RemoveAt(index);
            };
            Render.prototype.OnSourceCleared = function () {
                this.RendredList.Clear();
            };
            Render.prototype.OnSourceInitialized = function (_old, _nex) {
                if (_nex != null) {
                    var c = _nex.Count;
                    this.RendredList.Clear();
                    for (var i = 0; i < c; i++) {
                        var e = _nex.Count;
                        this._rendredList.Add(this.Render(_nex.Get(e)));
                    }
                }
            };
            return Render;
        }(Binding));
        collection_1.Render = Render;
        var SyncQuee = (function (_super) {
            __extends(SyncQuee, _super);
            function SyncQuee(handler) {
                var _this = _super.call(this) || this;
                _this.quee = [];
                _this._isExecuting = false;
                if (!_this.handler || !_this.handler.Invoke)
                    throw "argument (handler) null";
                _this.handler = { Invoke: handler.Invoke, Owner: handler.Owner };
                Object.preventExtensions(_this);
                return _this;
            }
            SyncQuee.prototype.push = function (data) {
                this.quee.push(data);
                if (!this._isExecuting)
                    this.EndOperation(void 0);
            };
            SyncQuee.prototype.EndOperation = function (e) {
                if (qstore.Get(this) !== e)
                    throw new Error("Unknown frame");
                if (this.quee.length) {
                    this._isExecuting = true;
                    this.CurrentData = this.quee.shift();
                    var e = {
                        data: this.CurrentData, quee: this
                    };
                    qstore.Set(this, e);
                    runtime_4.helper.TryCatch(this.handler.Owner || this, this.handler.Invoke, function (error, e) { e.quee.EndOperation(e); }, [e]);
                }
                else {
                    this._isExecuting = false;
                    this.CurrentData = void 0;
                    qstore.Set(this, void 0);
                }
            };
            __decorate([
                Corelib_3.bind.property(Object),
                __metadata("design:type", Object)
            ], SyncQuee.prototype, "CurrentData", void 0);
            return SyncQuee;
        }(Corelib_3.bind.DObject));
        collection_1.SyncQuee = SyncQuee;
        var qstore = new collection.Dictionary("quee_sync_frame");
    })(collection = exports.collection || (exports.collection = {}));
});
define("sys/Filters", ["require", "exports", "sys/Corelib", "sys/collections"], function (require, exports, Corelib_4, collections_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var filters;
    (function (filters) {
        var scopic;
        (function (scopic) {
            var ListFilter = (function (_super) {
                __extends(ListFilter, _super);
                function ListFilter(s, p, fl) {
                    var _this = _super.call(this, s, 1) || this;
                    _this.p = p;
                    _this.fl = fl;
                    return _this;
                }
                ListFilter.prototype.getFilter = function () {
                    return null;
                };
                ListFilter.prototype.getSource = function (s) {
                    if (s instanceof Array) {
                        this.fl.Source = new collections_2.collection.List(Object, s);
                        this.isConst = true;
                    }
                    return null;
                };
                ListFilter.prototype.getPatent = function (s) {
                    return s;
                };
                ListFilter.prototype.Convert = function (data) {
                    if (this.isConst)
                        return;
                    if (this.fl == null)
                        this.fl = new collections_2.collection.ExList(Object);
                    this.fl.Source = data;
                    return this.fl;
                };
                ListFilter.prototype.ConvertBack = function (data) {
                    return data.Source;
                };
                ListFilter.prototype.Initialize = function () {
                    var fl = this.fl;
                    var p = this.p;
                    if (!fl)
                        this.fl = fl = new collections_2.collection.ExList(Object);
                    if (p) {
                        var x = JSON.parse(decodeURI(p));
                        for (var i in x) {
                            if (i === 'filter')
                                fl.Filter = this.getFilter();
                            if (i === 'source')
                                fl.Source = this.getSource(x[i]);
                            if (i === 'patent') {
                                if (fl.Filter == null)
                                    fl.Filter = new list.LStringFilter();
                                fl.Filter.Patent = this.getPatent(x[i]);
                            }
                            if (i === 'max')
                                fl.MaxResult = parseInt(i);
                            if (i === 'shift')
                                fl.Shift = parseInt(i);
                        }
                    }
                    if (fl.Filter == null)
                        fl.Filter = new list.LStringFilter();
                    if (fl.Source == null && this.source)
                        fl.Source = this.source.Value;
                    _super.prototype.Initialize.call(this);
                };
                return ListFilter;
            }(Corelib_4.bind.Filter));
            scopic.ListFilter = ListFilter;
            Corelib_4.bind.RegisterFilter({
                BindingMode: 1, Name: 'listfilter',
                CreateNew: function (s, m, p) {
                    return new ListFilter(s, p);
                }
            });
        })(scopic = filters.scopic || (filters.scopic = {}));
        var list;
        (function (list) {
            var SubListPatent = (function () {
                function SubListPatent(start, end) {
                    if (start > end) {
                        this.Start = end;
                        this.End = start;
                    }
                    else {
                        this.Start = start;
                        this.End = end;
                    }
                }
                SubListPatent.prototype.Check = function (i) {
                    return i <= this.End && i >= this.Start;
                };
                SubListPatent.prototype.equals = function (p) {
                    return this._refresh ? (delete this._refresh && false) : this.Start == p.Start && this.End == p.End;
                };
                SubListPatent.prototype.Refresh = function () { this._refresh = true; return this; };
                return SubListPatent;
            }());
            list.SubListPatent = SubListPatent;
            var StringPatent = (function () {
                function StringPatent(s) {
                    this.o = s = s.trim().toLowerCase();
                    this.p = s === '' ? [] : s.split(' ');
                }
                StringPatent.prototype.Check = function (s) {
                    if (!s)
                        return true;
                    var p = this.p;
                    s = s.toLowerCase();
                    for (var i = 0, l = p.length; i < l; i++)
                        if (s.indexOf(p[i]) === -1)
                            return false;
                    return true;
                };
                StringPatent.prototype.equals = function (p) {
                    return p.o === this.o;
                };
                return StringPatent;
            }());
            list.StringPatent = StringPatent;
            var PropertyPatent = (function () {
                function PropertyPatent(s) {
                    this.s = s;
                }
                PropertyPatent.prototype.Check = function (s) {
                    return this.s === undefined ? true : s === this.s;
                };
                PropertyPatent.prototype.equals = function (p) {
                    return p.s === this.s;
                };
                return PropertyPatent;
            }());
            list.PropertyPatent = PropertyPatent;
            var PropertyFilter = (function (_super) {
                __extends(PropertyFilter, _super);
                function PropertyFilter(DP) {
                    var _this = _super.call(this) || this;
                    _this.DP = DP;
                    return _this;
                }
                PropertyFilter.prototype.Begin = function (deb, count) {
                    if (!this._patent)
                        this._skip = true;
                    if (!this._patent.s)
                        this._skip = true;
                    this._skip = false;
                };
                PropertyFilter.prototype.IsMatch = function (i, item) {
                    return (this._skip || !item) || this._patent.Check(item.GetValue(this.DP));
                };
                PropertyFilter.prototype.convertFromString = function (x) {
                    return null;
                };
                return PropertyFilter;
            }(collections_2.utils.Filter));
            list.PropertyFilter = PropertyFilter;
            var StringFilter = (function (_super) {
                __extends(StringFilter, _super);
                function StringFilter() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                StringFilter.prototype.Begin = function (deb, count) {
                };
                StringFilter.prototype.IsMatch = function (i, item) {
                    return (this._patent == null) || this._patent.Check(item.toString());
                };
                StringFilter.prototype.convertFromString = function (x) {
                    var p = new StringPatent(x);
                    return (this._patent && this._patent.equals(p)) ? this._patent : p;
                };
                return StringFilter;
            }(collections_2.utils.Filter));
            list.StringFilter = StringFilter;
            var BoundStringFilter = (function (_super) {
                __extends(BoundStringFilter, _super);
                function BoundStringFilter() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                BoundStringFilter.prototype.Begin = function (deb, count) {
                    this.deb = deb;
                    this.fin = deb + count;
                };
                BoundStringFilter.prototype.IsMatch = function (i, item) {
                    return i >= this.deb && i < this.fin ? (this._patent == null) || this._patent.Check(item.toString()) : null;
                };
                BoundStringFilter.prototype.convertFromString = function (x) {
                    var p = new StringPatent(x);
                    return (this._patent && this._patent.equals(p)) ? this._patent : p;
                };
                return BoundStringFilter;
            }(collections_2.utils.Filter));
            list.BoundStringFilter = BoundStringFilter;
            var DObjectPatent = (function () {
                function DObjectPatent(s) {
                    this.o = s = s.trim().toLowerCase();
                }
                DObjectPatent.prototype.Check = function (s) {
                    if (!s)
                        return true;
                };
                DObjectPatent.prototype.equals = function (p) {
                    return p.o === this.o;
                };
                return DObjectPatent;
            }());
            list.DObjectPatent = DObjectPatent;
            var DObjectFilter = (function (_super) {
                __extends(DObjectFilter, _super);
                function DObjectFilter() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                DObjectFilter.prototype.Begin = function (deb, count) {
                };
                DObjectFilter.prototype.IsMatch = function (i, item) {
                    return (this._patent == null) || this._patent.Check(item.toString());
                };
                DObjectFilter.prototype.convertFromString = function (x) {
                    var p = new StringPatent(x);
                    return (this._patent && this._patent.equals(p)) ? this._patent : p;
                };
                return DObjectFilter;
            }(collections_2.utils.Filter));
            list.DObjectFilter = DObjectFilter;
            var PatentGroup = (function () {
                function PatentGroup(left, right) {
                    this.left = left;
                    this.right = right;
                }
                PatentGroup.prototype.equals = function (p) {
                    var v = p;
                    var l, r;
                    if (v)
                        l = v.left, r = v.right;
                    if (!p || p instanceof this.constructor)
                        return this.areEquals(this.left, l) && this.areEquals(this.right, r);
                    return false;
                };
                PatentGroup.prototype.areEquals = function (a, b) {
                    if (a == null && b == null)
                        return true;
                    if (a == null)
                        return b.equals(a);
                    return a.equals(b);
                };
                return PatentGroup;
            }());
            list.PatentGroup = PatentGroup;
            var ANDPatentGroup = (function (_super) {
                __extends(ANDPatentGroup, _super);
                function ANDPatentGroup() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ANDPatentGroup.prototype.Check = function (item) {
                    var l = !this.left || this.left.Check(item);
                    if (l == null)
                        return null;
                    var r = !this.right || this.right.Check(item);
                    if (r == null)
                        return null;
                    return l && r;
                };
                ANDPatentGroup.prototype.Clone = function () {
                    return new ANDPatentGroup(this.left, this.right);
                };
                return ANDPatentGroup;
            }(PatentGroup));
            list.ANDPatentGroup = ANDPatentGroup;
            var ORPatentGroup = (function (_super) {
                __extends(ORPatentGroup, _super);
                function ORPatentGroup() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ORPatentGroup.prototype.Clone = function () {
                    return new ORPatentGroup(this.left, this.right);
                };
                ORPatentGroup.prototype.Check = function (item) {
                    var l = !!this.left && this.left.Check(item);
                    if (l == null)
                        return null;
                    var r = !!this.right && this.right.Check(item);
                    if (r == null)
                        return null;
                    return r || l;
                };
                return ORPatentGroup;
            }(PatentGroup));
            list.ORPatentGroup = ORPatentGroup;
            var FilterGroup = (function (_super) {
                __extends(FilterGroup, _super);
                function FilterGroup(patent) {
                    var _this = _super.call(this) || this;
                    if (!patent)
                        throw "";
                    _this.Patent = patent;
                    return _this;
                }
                FilterGroup.prototype.Begin = function (deb, count) {
                };
                FilterGroup.prototype.IsMatch = function (i, item) {
                    return (this._patent == null) || this._patent.Check(item);
                };
                FilterGroup.prototype.convertFromString = function (x) {
                    throw "null";
                };
                Object.defineProperty(FilterGroup.prototype, "LeftPatent", {
                    set: function (v) {
                        this.Patent.left = v;
                        this.Patent = this.Patent.Clone();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FilterGroup.prototype, "RightPatent", {
                    set: function (v) {
                        this.Patent.right = v;
                        this.Patent = this.Patent.Clone();
                    },
                    enumerable: true,
                    configurable: true
                });
                return FilterGroup;
            }(collections_2.utils.Filter));
            list.FilterGroup = FilterGroup;
            var LStringFilter = (function (_super) {
                __extends(LStringFilter, _super);
                function LStringFilter() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                LStringFilter.prototype.Begin = function (deb, count) {
                    this.deb = deb || 0;
                    this.count = count;
                };
                LStringFilter.prototype.IsMatch = function (i, item) {
                    if (this.deb === 0) {
                        if (this.count > 0) {
                            if (!(this._patent == null || this._patent.Check(item.toString())))
                                return false;
                            this.count--;
                            return true;
                        }
                    }
                    else
                        this.deb--;
                    return false;
                };
                LStringFilter.prototype.convertFromString = function (x) {
                    var p = new StringPatent(x);
                    return (this._patent && this._patent.equals(p)) ? this._patent : p;
                };
                return LStringFilter;
            }(collections_2.utils.Filter));
            list.LStringFilter = LStringFilter;
            var SubListFilter = (function (_super) {
                __extends(SubListFilter, _super);
                function SubListFilter() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.deb = 0;
                    _this.count = 50;
                    return _this;
                }
                SubListFilter.prototype.Begin = function (deb, count) {
                    this.deb = deb;
                    this.count = count;
                };
                SubListFilter.prototype.IsMatch = function (i, item) {
                    var t = (this._patent == null) || this._patent.Check(i);
                    if (t) {
                        if (this.deb > 0) {
                            this.deb--;
                            return false;
                        }
                        if (this.count > 0) {
                            this.count--;
                            return true;
                        }
                        return null;
                    }
                    return false;
                };
                SubListFilter.prototype.convertFromString = function (x) {
                    var e = x.split(/[\s|\\|\.|\/]+/);
                    var s = 0;
                    var n = 0;
                    if (e.length > 0)
                        s = parseFloat(e[0]);
                    if (e.length > 1)
                        n = parseFloat(e[1]);
                    else
                        n = s + (this._patent == null ? 10 : this._patent.End - this._patent.Start);
                    var p = new SubListPatent(s, n);
                    return (this._patent && this._patent.equals(p)) ? this._patent : p;
                };
                return SubListFilter;
            }(collections_2.utils.Filter));
            list.SubListFilter = SubListFilter;
            function indexdFilter(source, count) {
                var filter = new filters.list.SubListFilter();
                var index = 0;
                var data = source.Filtred(filter);
                function numPages() {
                    var c = source.Count / count;
                    if (c % 1 == 0)
                        return c;
                    return Math.floor(c) + 1;
                }
                function getPatent() {
                    var np = numPages();
                    index = Math.max(0, Math.min(index, np - 1));
                    return new filters.list.SubListPatent(index * count, ((index + 1) * count - 1));
                }
                filter.Patent = getPatent();
                return {
                    update: function () {
                        filter.Patent = getPatent();
                    },
                    reset: function () {
                        index = 0;
                        filter.Patent = getPatent();
                    },
                    next: function () {
                        ++index;
                        filter.Patent = getPatent();
                    },
                    previouse: function () {
                        --index;
                        filter.Patent = getPatent();
                    },
                    get List() { return data; },
                    get numPages() {
                        var c = source.Count / count;
                        if (c % 1 == 0)
                            return c;
                        return c + 1;
                    },
                    get Index() { return index; },
                    set Index(v) {
                        index = v;
                        filter.Patent = getPatent();
                    },
                    get CountPerPage() { return count; },
                    set CountPerPage(v) {
                        count = v;
                        filter.Patent = getPatent();
                    }
                };
            }
            list.indexdFilter = indexdFilter;
        })(list = filters.list || (filters.list = {}));
    })(filters = exports.filters || (exports.filters = {}));
});
define("sys/UI", ["require", "exports", "sys/Corelib", "sys/collections", "sys/Filters", "sys/runtime", "sys/Dom", "sys/utils"], function (require, exports, Corelib_5, collections_3, Filters_1, runtime_5, Dom_1, utils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var $Error = Error;
    var authApp;
    function _() {
        this.init = true;
        this.initialize();
        this.OnFullInitialized();
    }
    function __(v) {
        var _this = this;
        if (v != null && !this.init) {
            if (v.init) {
                _.call(this);
            }
            else {
                var pv = this.parent;
                if (pv && !pv.init)
                    pv._onInitialize.Remove(this._id);
                v._onInitialize.Add(function (_v) {
                    if (_this.parent == _v)
                        _.call(_this);
                    else
                        throw "";
                }, this._id);
            }
        }
    }
    var UI;
    (function (UI) {
        var KeyboardControllerResult;
        (function (KeyboardControllerResult) {
            KeyboardControllerResult[KeyboardControllerResult["Handled"] = 0] = "Handled";
            KeyboardControllerResult[KeyboardControllerResult["Release"] = -1] = "Release";
            KeyboardControllerResult[KeyboardControllerResult["ByPass"] = 2] = "ByPass";
        })(KeyboardControllerResult = UI.KeyboardControllerResult || (UI.KeyboardControllerResult = {}));
        UI.ms = ['px', '%', 'in', 'em'];
        var Keys;
        (function (Keys) {
            Keys[Keys["Enter"] = 13] = "Enter";
            Keys[Keys["Tab"] = 9] = "Tab";
            Keys[Keys["Esc"] = 27] = "Esc";
            Keys[Keys["Escape"] = 27] = "Escape";
            Keys[Keys["Up"] = 38] = "Up";
            Keys[Keys["Down"] = 40] = "Down";
            Keys[Keys["Left"] = 37] = "Left";
            Keys[Keys["Right"] = 39] = "Right";
            Keys[Keys["PgDown"] = 34] = "PgDown";
            Keys[Keys["PageDown"] = 34] = "PageDown";
            Keys[Keys["PgUp"] = 33] = "PgUp";
            Keys[Keys["PageUp"] = 33] = "PageUp";
            Keys[Keys["End"] = 35] = "End";
            Keys[Keys["Home"] = 36] = "Home";
            Keys[Keys["Insert"] = 45] = "Insert";
            Keys[Keys["Delete"] = 46] = "Delete";
            Keys[Keys["Backspace"] = 8] = "Backspace";
            Keys[Keys["Space"] = 32] = "Space";
            Keys[Keys["Meta"] = 91] = "Meta";
            Keys[Keys["Win"] = 91] = "Win";
            Keys[Keys["Mac"] = 91] = "Mac";
            Keys[Keys["Multiply"] = 106] = "Multiply";
            Keys[Keys["Add"] = 107] = "Add";
            Keys[Keys["Subtract"] = 109] = "Subtract";
            Keys[Keys["Decimal"] = 110] = "Decimal";
            Keys[Keys["Divide"] = 111] = "Divide";
            Keys[Keys["Scrollock"] = 145] = "Scrollock";
            Keys[Keys["Pausebreak"] = 19] = "Pausebreak";
            Keys[Keys["Numlock"] = 144] = "Numlock";
            Keys[Keys["5numlocked"] = 12] = "5numlocked";
            Keys[Keys["Shift"] = 16] = "Shift";
            Keys[Keys["Capslock"] = 20] = "Capslock";
            Keys[Keys["F1"] = 112] = "F1";
            Keys[Keys["F2"] = 113] = "F2";
            Keys[Keys["F3"] = 114] = "F3";
            Keys[Keys["F4"] = 115] = "F4";
            Keys[Keys["F5"] = 116] = "F5";
            Keys[Keys["F6"] = 117] = "F6";
            Keys[Keys["F7"] = 118] = "F7";
            Keys[Keys["F8"] = 119] = "F8";
            Keys[Keys["F9"] = 120] = "F9";
            Keys[Keys["F10"] = 121] = "F10";
            Keys[Keys["F11"] = 122] = "F11";
            Keys[Keys["F12"] = 123] = "F12";
            Keys[Keys["AltLeft"] = 18] = "AltLeft";
            Keys[Keys["AltRight"] = 18] = "AltRight";
            Keys[Keys["ShiftLeft"] = 18] = "ShiftLeft";
            Keys[Keys["ShiftRight"] = 18] = "ShiftRight";
            Keys[Keys["ControlLeft"] = 17] = "ControlLeft";
            Keys[Keys["ControlRight"] = 17] = "ControlRight";
            Keys[Keys["MetaLeft"] = 91] = "MetaLeft";
            Keys[Keys["MetaRight"] = 91] = "MetaRight";
        })(Keys = UI.Keys || (UI.Keys = {}));
        var Controlkeys;
        (function (Controlkeys) {
            Controlkeys[Controlkeys["Alt"] = 18] = "Alt";
            Controlkeys[Controlkeys["Shift"] = 16] = "Shift";
            Controlkeys[Controlkeys["Control"] = 17] = "Control";
            Controlkeys[Controlkeys["Meta"] = 91] = "Meta";
        })(Controlkeys = UI.Controlkeys || (UI.Controlkeys = {}));
        var Events;
        (function (Events) {
            Events[Events["keydown"] = 2] = "keydown";
            Events[Events["keyup"] = 3] = "keyup";
            Events[Events["keypress"] = 5] = "keypress";
        })(Events = UI.Events || (UI.Events = {}));
        var MetricType;
        (function (MetricType) {
            MetricType[MetricType["Pixel"] = 0] = "Pixel";
            MetricType[MetricType["Percentage"] = 1] = "Percentage";
            MetricType[MetricType["Inch"] = 2] = "Inch";
            MetricType[MetricType["Em"] = 3] = "Em";
        })(MetricType = UI.MetricType || (UI.MetricType = {}));
        var SearchActionMode;
        (function (SearchActionMode) {
            SearchActionMode[SearchActionMode["None"] = 0] = "None";
            SearchActionMode[SearchActionMode["Validated"] = 1] = "Validated";
            SearchActionMode[SearchActionMode["Instantany"] = 2] = "Instantany";
            SearchActionMode[SearchActionMode["NoSearch"] = 3] = "NoSearch";
        })(SearchActionMode = UI.SearchActionMode || (UI.SearchActionMode = {}));
        var MessageResult;
        (function (MessageResult) {
            MessageResult[MessageResult["Exit"] = 0] = "Exit";
            MessageResult[MessageResult["ok"] = 1] = "ok";
            MessageResult[MessageResult["cancel"] = 2] = "cancel";
            MessageResult[MessageResult["abort"] = 3] = "abort";
        })(MessageResult = UI.MessageResult || (UI.MessageResult = {}));
        var NotifyType;
        (function (NotifyType) {
            NotifyType[NotifyType["Focuse"] = 0] = "Focuse";
            NotifyType[NotifyType["UnFocus"] = 1] = "UnFocus";
        })(NotifyType = UI.NotifyType || (UI.NotifyType = {}));
        var ServiceType;
        (function (ServiceType) {
            ServiceType[ServiceType["Main"] = 0] = "Main";
            ServiceType[ServiceType["Stackable"] = 1] = "Stackable";
            ServiceType[ServiceType["Instantany"] = 3] = "Instantany";
        })(ServiceType = UI.ServiceType || (UI.ServiceType = {}));
        var HorizontalAlignement;
        (function (HorizontalAlignement) {
            HorizontalAlignement[HorizontalAlignement["Left"] = 0] = "Left";
            HorizontalAlignement[HorizontalAlignement["Center"] = 1] = "Center";
            HorizontalAlignement[HorizontalAlignement["Right"] = 2] = "Right";
        })(HorizontalAlignement = UI.HorizontalAlignement || (UI.HorizontalAlignement = {}));
        var VerticalAlignement;
        (function (VerticalAlignement) {
            VerticalAlignement[VerticalAlignement["Top"] = 0] = "Top";
            VerticalAlignement[VerticalAlignement["Center"] = 1] = "Center";
            VerticalAlignement[VerticalAlignement["Bottom"] = 2] = "Bottom";
        })(VerticalAlignement = UI.VerticalAlignement || (UI.VerticalAlignement = {}));
    })(UI = exports.UI || (exports.UI = {}));
    (function (UI) {
        var Point = (function () {
            function Point(x, y) {
                this.x = x;
                this.y = y;
            }
            return Point;
        }());
        UI.Point = Point;
        var Size = (function () {
            function Size(w, h) {
                if (typeof w === 'number' || typeof w === 'string')
                    this.w = new Metric(w, 0);
                else
                    this.w = w;
                if (typeof h === 'number' || typeof h === 'string')
                    this.h = new Metric(h, 0);
                else
                    this.h = h;
            }
            return Size;
        }());
        UI.Size = Size;
        var Metric = (function () {
            function Metric(value, type) {
                if (typeof value === 'string') {
                    this.fromString(value);
                }
                else {
                    this.Value = value;
                    this.Type = type;
                }
            }
            Metric.prototype.minus = function (v) {
                if (this.Type == UI.MetricType.Pixel)
                    return new Metric(this.Value - v, UI.MetricType.Pixel);
                if (this.Type == UI.MetricType.Percentage)
                    return new Metric(this.Value - v, UI.MetricType.Percentage);
                if (this.Type == UI.MetricType.Em)
                    return new Metric(this.Value - v, UI.MetricType.Em);
                if (this.Type == UI.MetricType.Inch)
                    return new Metric(this.Value - v, UI.MetricType.Inch);
            };
            Metric.prototype.toString = function () { return this.Value + UI.ms[this.Type || 0]; };
            Metric.prototype.fromString = function (s) {
                for (var i = 0; i < UI.ms.length; i++)
                    if (s.endsWith(UI.ms[i])) {
                        this.Value = parseFloat(s);
                        this.Type = i;
                        return;
                    }
            };
            return Metric;
        }());
        UI.Metric = Metric;
        var MessageEventArgs = (function () {
            function MessageEventArgs(Modal, Result, msg) {
                this.Modal = Modal;
                this.Result = Result;
                this.msg = msg;
            }
            Object.defineProperty(MessageEventArgs.prototype, "stayOpen", {
                get: function () {
                    return this._stayOpen;
                },
                enumerable: true,
                configurable: true
            });
            MessageEventArgs.prototype.StayOpen = function () {
                this._stayOpen = true;
            };
            MessageEventArgs.prototype.Close = function () {
                this._stayOpen = true;
            };
            return MessageEventArgs;
        }());
        UI.MessageEventArgs = MessageEventArgs;
        var HotKey = (function () {
            function HotKey() {
            }
            Object.defineProperty(HotKey.prototype, "Key", {
                get: function () { return this._key; },
                set: function (v) { if (UI.Keys[v] === undefined)
                    throw "controls key is uncorrect"; this._key = v; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HotKey.prototype, "Control", {
                get: function () { return this.__ctrl; },
                set: function (v) { if (UI.Controlkeys[v] === undefined)
                    throw "controls key is uncorrect"; this.__ctrl = v; },
                enumerable: true,
                configurable: true
            });
            ;
            ;
            HotKey.prototype.IsPressed = function (e) {
                return this.checkKey(e) && this.checkControl(e);
            };
            HotKey.prototype.checkKey = function (e) {
                var l = this.Key;
                if (l == null)
                    return true;
                return e.keyCode == l;
            };
            HotKey.prototype.checkControl = function (e) {
                switch (this.Control) {
                    case 18:
                        return e.altKey;
                    case 16:
                        return e.shiftKey;
                    case 17:
                        return e.ctrlKey;
                    case 91:
                        return e.metaKey;
                }
                return true;
            };
            return HotKey;
        }());
        UI.HotKey = HotKey;
        function processHTML(dom, data) {
            var t = new UI.TControl(dom, data);
            t.Parent = UI.Desktop.Current;
            return t;
        }
        UI.processHTML = processHTML;
        var DragableElement = (function () {
            function DragableElement(element, header) {
                this.element = element;
                this.header = header;
                this.pos1 = 0;
                this.pos2 = 0;
                this.pos3 = 0;
                this.pos4 = 0;
                this.closeDragElementHandler = {
                    handleEvent: function (e) {
                        this.owner.closeDragElement();
                    }, owner: this
                };
                this.elementDragHandler = {
                    handleEvent: function (e) {
                        this.owner.elementDrag(e);
                    }, owner: this
                };
                this.initialize(element, header);
            }
            DragableElement.prototype.elementDrag = function (e) {
                e = e || window.event;
                e.preventDefault();
                this.pos1 = this.pos3 - e.clientX;
                this.pos2 = this.pos4 - e.clientY;
                this.pos3 = e.clientX;
                this.pos4 = e.clientY;
                this.element.style.top = (this.element.offsetTop - this.pos2) + "px";
                this.element.style.left = (this.element.offsetLeft - this.pos1) + "px";
            };
            DragableElement.prototype.closeDragElement = function () {
                document.removeEventListener('mouseup', this.closeDragElementHandler);
                document.removeEventListener('mousemove', this.elementDragHandler);
            };
            DragableElement.prototype.handleEvent = function (e) {
                e = e || window.event;
                e.preventDefault();
                this.pos3 = e.clientX;
                this.pos4 = e.clientY;
                document.addEventListener('mouseup', this.closeDragElementHandler);
                document.addEventListener('mousemove', this.elementDragHandler);
            };
            DragableElement.prototype.initialize = function (element, header) {
                this.Dispose();
                this.element = element;
                this.header = header;
                this.header.addEventListener('mousedown', this);
            };
            DragableElement.prototype.Dispose = function () {
                this.closeDragElement();
                this.header.removeEventListener('mousedown', this);
                this.element = void 0;
                this.header = void 0;
            };
            return DragableElement;
        }());
        UI.DragableElement = DragableElement;
        var DragManager = (function () {
            function DragManager(handler, target) {
                this.handler = handler;
                this.target = target;
                this.loc = new Point(0, 0);
                this.mouseloc = { x: undefined, y: undefined };
                this.cntloc = { x: this.loc.x, y: this.loc.y };
                this.RelocationJob = runtime_5.thread.Dispatcher.cretaeJob(this.reLocation, [], this, true);
                handler.View.addEventListener('dragstart', this);
                this.handler.View.draggable = true;
                this.View = target.View;
            }
            DragManager.prototype.handleEvent = function (e) {
                if (e.type == 'dragstart') {
                    this.mouseloc = { x: e.x, y: e.y };
                    this.cntloc = { x: this.target.View.offsetLeft, y: this.target.View.offsetTop };
                    this.handler.View.addEventListener('dragend', this);
                }
                else if (e.type == 'dragend') {
                    var c = this.cntloc;
                    var m = this.mouseloc;
                    this.Location = { x: c.x + (e.x - m.x), y: Math.max(0, c.y + (e.y - m.y)) };
                    this.handler.View.removeEventListener('dragend', this);
                }
                if (e.type === 'resize')
                    runtime_5.thread.Dispatcher.Push(this.RelocationJob.Set(true, true));
            };
            Object.defineProperty(DragManager.prototype, "Location", {
                set: function (l) {
                    this.loc = l;
                    this.RelocationJob[0] = true;
                    this.RelocationJob[1] = true;
                    runtime_5.thread.Dispatcher.Push(this.RelocationJob.Set(true, true));
                },
                enumerable: true,
                configurable: true
            });
            DragManager.prototype.reLocation = function (hr, vr) {
                var v = this.View;
                var s = v.style;
                var l = this.loc;
                var w = window;
                if (hr) {
                    s.left = l.x + 'px';
                }
                if (vr) {
                    s.top = l.y + 'px';
                }
            };
            return DragManager;
        }());
        UI.DragManager = DragManager;
        var keyCominerEvent = (function () {
            function keyCominerEvent(Owner) {
                this.Owner = Owner;
                this.OnComined = new Corelib_5.bind.EventListener(0);
                this.handlers = {};
            }
            keyCominerEvent.prototype.sort = function (ar) {
                function depth(el) {
                    var i = 0;
                    while (el) {
                        i++;
                        el = el.parentElement;
                    }
                    return i;
                }
                function order(a1, a2) {
                    if (a1 == a2)
                        return 0;
                    while (a1) {
                        a1 = a1.nextSibling;
                        if (a1 == a2)
                            return -1;
                    }
                    return 1;
                }
                ar.sort(function (a, b) {
                    if (!a.target)
                        return -1;
                    if (!b.target)
                        return 1;
                    if (!a.target && !b.target)
                        return 0;
                    var v1 = a.target instanceof UI.JControl ? a.target.View : a.target;
                    var v2 = b.target instanceof UI.JControl ? b.target.View : b.target;
                    var x;
                    return v1.contains(v2) ? 1 : v2.contains(v1) ? -1 : x = (depth(v2) - depth(v1)) > 0 ? 1 : x < 0 ? -1 : order(v1, v2);
                });
                return void 0;
            };
            keyCominerEvent.prototype.sort1 = function (ar) {
                function depth(el) {
                    var i = 0;
                    while (el) {
                        i++;
                        el = el.parentElement;
                    }
                    return i;
                }
                function order(a1, a2) {
                    if (a1 == a2)
                        return 0;
                    while (a1) {
                        a1 = a1.nextSibling;
                        if (a1 == a2)
                            return -1;
                    }
                    return 1;
                }
                ar.sort(function (v1, v2) {
                    var x;
                    return v1.contains(v2) ? 1 : v2.contains(v1) ? -1 : x = (depth(v2) - depth(v1)) > 0 ? 1 : x < 0 ? -1 : order(v1, v2);
                });
            };
            Object.defineProperty(keyCominerEvent.prototype, "KeyA", {
                get: function () { return this._keyA; },
                set: function (v) {
                    this._keyA = v;
                    this._keyB = null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(keyCominerEvent.prototype, "KeyB", {
                get: function () { return this._keyB; },
                set: function (v) {
                    if (this._keyA == null) {
                        this._keyA = v;
                        this._keyB = null;
                        return;
                    }
                    this._keyB = v;
                    this._rise();
                },
                enumerable: true,
                configurable: true
            });
            keyCominerEvent.prototype.elementInViewport1 = function (el) {
                var top = el.offsetTop;
                var left = el.offsetLeft;
                var width = el.offsetWidth;
                var height = el.offsetHeight;
                while (el.offsetParent) {
                    el = el.offsetParent;
                    top += el.offsetTop;
                    left += el.offsetLeft;
                }
                return (top < (window.pageYOffset + window.innerHeight) &&
                    left < (window.pageXOffset + window.innerWidth) &&
                    (top + height) > window.pageYOffset &&
                    (left + width) > window.pageXOffset);
            };
            keyCominerEvent.prototype.elementInViewport = function (el) {
                if (!this.dom.contains(el))
                    return false;
                var top = el.offsetTop;
                var left = el.offsetLeft;
                var width = el.offsetWidth;
                var height = el.offsetHeight;
                while (el.offsetParent) {
                    el = el.offsetParent;
                    top += el.offsetTop;
                    left += el.offsetLeft;
                }
                var window = this.dom;
                return (top < (window.offsetTop + window.offsetHeight) &&
                    left < (window.offsetLeft + window.offsetWidth) &&
                    (top + height) > window.offsetTop &&
                    (left + width) > window.offsetLeft);
            };
            Object.defineProperty(keyCominerEvent.prototype, "Cancel", {
                set: function (v) {
                    this._stopEvent = !!v;
                },
                enumerable: true,
                configurable: true
            });
            keyCominerEvent.prototype._rise = function () {
                var c = this.handlers[this._keyA.key.toUpperCase()] && this.handlers[this._keyA.key.toUpperCase()][this._keyB.key.toUpperCase()];
                this._stopEvent = false;
                if (c)
                    for (var i = this.sort(c) || 0; i < c.length; i++) {
                        try {
                            var k = c[i];
                            var t = k.target;
                            if (t) {
                                if (!this.elementInViewport(t instanceof UI.JControl ? t.View : t))
                                    continue;
                            }
                            k.Invoke.call(k.Owner || k.target || this.Owner, this, k);
                        }
                        catch (e) {
                        }
                        if (this._stopEvent)
                            break;
                    }
                this._stopEvent = undefined;
                this.OnComined.PInvok(0, [this], this.Owner);
                this.reset();
            };
            keyCominerEvent.prototype.reset = function () {
                this._keyB = null;
                this._keyA = null;
            };
            keyCominerEvent.prototype.handleEvent = function (e) {
                e.preventDefault();
                if (!this._pause && e.ctrlKey) {
                    if ((e.keyCode > 47 && e.keyCode < 91) || (e.keyCode > 97 && e.keyCode < 123)) {
                        this.KeyB = e;
                    }
                    return;
                }
                this.reset();
            };
            keyCominerEvent.prototype.isValid = function (keyA) {
                if (typeof keyA === 'string') {
                    if (keyA.length == 1) {
                        keyA = keyA.charCodeAt(0);
                        return (keyA > 47 && keyA < 91) || (keyA > 97 && keyA < 123);
                    }
                }
                else if (typeof keyA === 'number')
                    return (keyA > 47 && keyA < 91) || (keyA > 97 && keyA < 123);
                return false;
            };
            keyCominerEvent.prototype.On = function (keyA, keyB, handle, target, owner) {
                if (this.isValid(keyA) && this.isValid(keyB) && typeof handle === 'function') {
                    keyA = keyA.toUpperCase();
                    keyB = keyB.toUpperCase();
                    !this.handlers[keyA] && (this.handlers[keyA] = {});
                    var c = this.handlers[keyA][keyB];
                    !c && (this.handlers[keyA][keyB] = c = []);
                    var x = { Invoke: handle, Owner: owner, target: target };
                    c.push(x);
                    c.sort();
                    return x;
                }
                else
                    throw "unvalide arguments";
            };
            keyCominerEvent.prototype.Off = function (keyA, keyB, e) {
                if (this.isValid(keyA) && this.isValid(keyB)) {
                    keyA = keyA.toUpperCase();
                    keyB = keyB.toUpperCase();
                    var c = this.handlers[keyA] && this.handlers[keyA][keyB];
                    if (!c)
                        return;
                    var i = c.indexOf(e);
                    if (i !== -1)
                        c.splice(i, 1);
                }
                else
                    throw "unvalide arguments";
            };
            keyCominerEvent.prototype.pause = function () { this._pause = true; };
            keyCominerEvent.prototype.resume = function () { this._pause = false; };
            keyCominerEvent.prototype.attachTo = function (dom) {
                if (this.dom)
                    this.dom.removeEventListener('keyup', this);
                this.dom = dom;
                this.dom.addEventListener('keyup', this);
            };
            keyCominerEvent.prototype.stopPropagation = function () {
            };
            return keyCominerEvent;
        }());
        UI.keyCominerEvent = keyCominerEvent;
        var DesktopKeyboardManager = (function (_super) {
            __extends(DesktopKeyboardManager, _super);
            function DesktopKeyboardManager(desk) {
                var _this = _super.call(this, desk) || this;
                _this.desk = desk;
                _super.prototype.attachTo.call(_this, desk.View);
                return _this;
            }
            Object.defineProperty(DesktopKeyboardManager.prototype, "dom", {
                get: function () {
                    var app = this.desk.CurrentApp;
                    return ((app && app.CurrentModal) || app || this.desk).View;
                },
                set: function (v) { },
                enumerable: true,
                configurable: true
            });
            DesktopKeyboardManager.prototype.attachTo = function (v) {
            };
            return DesktopKeyboardManager;
        }(keyCominerEvent));
        UI.DesktopKeyboardManager = DesktopKeyboardManager;
        var KeyboardControllerManager = (function () {
            function KeyboardControllerManager(Desktop) {
                this.Desktop = Desktop;
                this._controllers = [];
            }
            KeyboardControllerManager.prototype.Current = function () {
                return this._current;
            };
            KeyboardControllerManager.prototype.GetController = function (nc) {
                if (!nc)
                    throw 'Argument null exception';
                if (this._current == nc)
                    return true;
                if (!nc)
                    throw "Argument null exception";
                var c = this._current;
                var e = { Controller: nc };
                if (c)
                    if (c.stackable ? c.onStop && !c.onStop(e) : c.onPause && !c.onPause(e))
                        return false;
                if (nc.onResume && !nc.onResume(e))
                    return this.ResumeStack();
                if (c)
                    if (!c.stackable)
                        this._controllers.pop();
                this._controllers.push(nc);
                return true;
            };
            KeyboardControllerManager.prototype.Release = function (c) {
                var i = this._controllers.indexOf(c);
                if (i == -1)
                    return false;
                var j = this._controllers.length - i;
                while (j-- >= 0) {
                    var c = this._controllers[this._controllers.length - 1];
                    if (c && c.onStop && !c.onStop({ Controller: c }))
                        return false;
                    this._controllers.pop();
                    this._current = this._controllers[this._controllers.length - 1];
                }
                return true;
            };
            KeyboardControllerManager.prototype.ResumeStack = function () {
                var nc = this._controllers[this._controllers.length - 1];
                var e;
                while (nc && nc.onResume && !nc.onResume(e = { Controller: nc })) {
                    this._controllers.pop();
                    this._current = nc = this._controllers[this._controllers.length - 1];
                }
                return true;
            };
            KeyboardControllerManager.prototype.Invoke = function (e) {
                var c;
                var i = this._controllers.length;
                var a = [void 0];
                while (c = c = this._controllers[--i]) {
                    a[0] = { Controller: c, e: e };
                    runtime_5.helper.TryCatch(c, c.invoke, void 0, a);
                    var r = a[0].Result || 0;
                    if ((r & UI.KeyboardControllerResult.Release) == UI.KeyboardControllerResult.Release)
                        this.Release(c);
                    if ((r & UI.KeyboardControllerResult.ByPass) !== UI.KeyboardControllerResult.ByPass)
                        return r;
                }
                return r || 0;
            };
            return KeyboardControllerManager;
        }());
        UI.KeyboardControllerManager = KeyboardControllerManager;
    })(UI = exports.UI || (exports.UI = {}));
    (function (UI) {
        var JControl = (function (_super) {
            __extends(JControl, _super);
            function JControl(_view) {
                var _this = _super.call(this, 3) || this;
                _this._view = _view;
                _this._onInitialize = new Corelib_5.bind.EventListener(_this, true);
                _this._display = undefined;
                _this._id = ++JControl.counter;
                _this.init = false;
                _this._events = 0;
                _this._events_ = {};
                if (_view) {
                    if (_view.id === '')
                        _view.id = _this._id + "";
                }
                if (!_this._hasValue_())
                    _this.Value = _this;
                return _this;
            }
            JControl.prototype.OnTemplateCompiled = function (node) {
            };
            JControl.prototype.Is = function (toke) {
                return toke == 'component';
            };
            JControl.prototype.getParent = function () {
                return this.Parent || this._parentScop;
            };
            JControl.prototype._OnValueChanged = function (e) {
            };
            JControl.prototype.setParent = function (v) {
                if (!this.canBeParent(v))
                    throw null;
                if (v instanceof JControl)
                    v.Add(this);
                else
                    this._parentScop = v;
                return true;
            };
            JControl.prototype.CombinatorKey = function (keyA, keyB, callback) {
                return UI.Desktop.Current.KeyCombiner.On(keyA, keyB, callback, this, this);
            };
            JControl.prototype.SearchParents = function (type) {
                var p = this.Parent;
                while (p)
                    if (p instanceof type)
                        return p;
                    else
                        p = p.Parent;
            };
            JControl.LoadCss = function (url) {
                var head = document.head;
                var link = document.createElement('link');
                link.setAttribute('as', 'style');
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = url;
                link.media = 'all';
                head.appendChild(link);
                return link;
            };
            JControl.__fields__ = function () { return []; };
            Object.defineProperty(JControl.prototype, "InnerHtml", {
                get: function () { return this._view.innerHTML; },
                enumerable: true,
                configurable: true
            });
            JControl.prototype.Float = function (v) {
                this._view.style.cssFloat = v === 0 ? 'left' : (v === 1 ? 'initiale' : 'right');
            };
            JControl.prototype.Clear = function () {
                this._view.innerHTML = '';
            };
            Object.defineProperty(JControl.prototype, "OnInitialized", {
                set: function (m) {
                    if (this.init)
                        m(this);
                    else
                        this._onInitialize.On = m;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(JControl.prototype, "Presenter", {
                get: function () { return this._presenter || this; },
                set: function (v) { this._presenter = v || this; },
                enumerable: true,
                configurable: true
            });
            JControl.prototype.setAttribute = function (name, value) {
                this.View.setAttribute(name, value);
                return this;
            };
            JControl.prototype.OnKeyDown = function (e) { };
            JControl.prototype.OnContextMenu = function (e) {
            };
            JControl.prototype.OnKeyCombined = function (e, v) { };
            JControl.prototype.setAttributes = function (attributes) {
                var v = this.View;
                for (var i in attributes)
                    v.setAttribute(i, attributes[i]);
                return this;
            };
            JControl.prototype.applyStyle = function () {
                this._view.classList.add.apply(this._view.classList, arguments);
                return this;
            };
            JControl.prototype.disapplyStyle = function () {
                this._view.classList.remove.apply(this._view.classList, arguments);
                return this;
            };
            Object.defineProperty(JControl.prototype, "Visible", {
                get: function () {
                    return this.View.style.display != 'none' && this.View.style.visibility == 'visible';
                },
                set: function (v) {
                    v = v === true;
                    if (v === this._display)
                        return;
                    this._display = this.View.style.display !== 'none' ? this.View.style.display : "";
                    if (v)
                        this.View.style.display = this._display;
                    else
                        this.View.style.display = 'none';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(JControl.prototype, "Wait", {
                set: function (v) {
                    if (v)
                        this.applyStyle('Wait');
                    else
                        this.disapplyStyle('Wait');
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(JControl.prototype, "Enable", {
                get: function () {
                    return this.View.style.pointerEvents != 'none';
                },
                set: function (v) {
                    this.View.style.pointerEvents = v ? 'all' : 'none';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(JControl.prototype, "Parent", {
                get: function () {
                    return this.parent;
                },
                set: function (v) {
                    var old = this.parent;
                    if (old === v)
                        return;
                    this.parent = v;
                    __.call(this, v);
                    this.OnParentChanged(old, v);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(JControl.prototype, "IsInit", {
                get: function () { return this.init; },
                enumerable: true,
                configurable: true
            });
            JControl.prototype.OnFullInitialized = function () {
                this._onInitialize.PInvok(this, [this], this);
            };
            Object.defineProperty(JControl.prototype, "OnPaint", {
                set: function (method) {
                    runtime_5.PaintThread.OnPaint({ args: [this], method: method, owner: this });
                },
                enumerable: true,
                configurable: true
            });
            JControl.prototype.OnParentChanged = function (_old, _new) {
            };
            JControl.prototype.instantanyInitializeParent = function () { return false; };
            Object.defineProperty(JControl.prototype, "ToolTip", {
                set: function (t) { this.View.title = t; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(JControl.prototype, "View", {
                get: function () {
                    return this._view;
                },
                enumerable: true,
                configurable: true
            });
            JControl.prototype._hasValue_ = function () { return false; };
            JControl.createDiv = function () { return document.createElement('div'); };
            JControl.prototype.addEventListener = function (event, handle, param, owner) {
                var x = new utils_2.basic.DomEventHandler(this._view, event, owner, JControl._handle, { jc: this, handle: handle, p: param });
                x.Start();
                return x;
            };
            JControl._handle = function (eth, ev, p) {
                p.handle.call(this, p.jc, ev, p.p);
            };
            JControl.prototype.AddRange = function (chidren) {
                for (var i = 0, l = chidren.length; i < l; i++)
                    this.Add(chidren[i]);
                return this;
            };
            JControl.prototype.Add = function (child) {
                if (child.parent != null) {
                    if (child.parent === this)
                        return;
                    child.parent.Remove(child, false);
                }
                child = this.getTemplate(child);
                child.Parent = this;
                this.View.appendChild(child.View);
                return this;
            };
            JControl.prototype.IndexOf = function (child) {
            };
            JControl.prototype.Insert = function (child, to) {
                if (child.parent != null) {
                    child.parent.Remove(child, false);
                }
                child = this.getTemplate(child);
                child.Parent = this;
                this.View.insertChildAtIndex(child.View, to);
                return this;
            };
            JControl.prototype.Remove = function (child, dispose) {
                if (child.parent != this)
                    return false;
                child.Parent = null;
                if (this.View.contains(child.View))
                    this.View.removeChild(child.View);
                else if (child._view.parentNode != null)
                    child.View.remove();
                if (dispose)
                    child.Dispose();
                return true;
            };
            JControl.prototype.getTemplate = function (child) {
                return child;
            };
            Object.defineProperty(JControl.prototype, "Id", {
                get: function () {
                    return this._id;
                },
                enumerable: true,
                configurable: true
            });
            JControl.prototype.Dispose = function () {
                var h = this.OnDispose();
                if (h === null)
                    return;
                if (this.parent)
                    this.parent.Remove(this, false);
                if ((this._presenter != null) && (this._presenter != this))
                    this._presenter.Dispose();
                this._presenter = null;
                this.Parent = null;
                this._view = null;
                this._display = null;
                this._onInitialize.Dispose();
                this._presenter = null;
                this.parent = null;
                this.Presenter;
                utils_2.basic.DomEventHandler.Dispose(this._view);
                _super.prototype.Dispose.call(this);
                if (!h)
                    this.DisposingStat = 2;
            };
            JControl.prototype.OnHotKey = function () {
            };
            Object.defineProperty(JControl.prototype, "HotKey", {
                get: function () { return this._hotKey; },
                set: function (v) {
                    if (!this.isEventRegistred(UI.Events.keyup))
                        this.registerEvent(UI.Events.keypress);
                    this._hotKey = v;
                },
                enumerable: true,
                configurable: true
            });
            JControl.prototype.handleEvent = function (e) {
                switch (UI.Events[e.type]) {
                    case UI.Events.keydown:
                        break;
                    case UI.Events.keyup:
                        if (this._hotKey && this._hotKey.IsPressed(e))
                            this.OnHotKey();
                        break;
                    case UI.Events.keypress:
                        break;
                }
            };
            JControl.prototype.isEventRegistred = function (event) {
                var t = typeof (event) == 'number' ? event : UI.Events[event];
                if (t === undefined)
                    throw "event is not registred";
                return (this._events / t) % 1 === 0;
            };
            JControl.prototype.registerEvent = function (event) {
                this._view.addEventListener(UI.Events[event], this);
            };
            JControl.toggleClass = function (dom, className) {
                if (dom.classList.contains(className))
                    dom.classList.remove(className);
                else
                    dom.classList.add(className);
            };
            JControl.prototype.watch = function (name, callback, owner) {
                var s = this._events_[name];
                if (!s) {
                    var data = Dom_1.attributes.Event.getEventData(this.GetType(), name);
                    if (!data)
                        throw "The Event " + name + " is not declared in " + this.GetType().name;
                    this._events_[name] = s = new Corelib_5.bind.FEventListener(this._events_, data.signliton);
                }
                s.On = { Invoke: callback, Owner: owner };
                return this;
            };
            JControl.prototype.notify = function (name, e) {
                var s = this._events_[name];
                if (s)
                    s.PInvok(this._events_, [e], this);
            };
            JControl.prototype.unwatch = function (name, callback, owner) {
                var s = this._events_[name];
                if (!s)
                    return;
                s.Off = { Invoke: callback, Owner: owner };
            };
            JControl.counter = 0;
            return JControl;
        }(Corelib_5.bind.Scop));
        UI.JControl = JControl;
        var Control = (function (_super) {
            __extends(Control, _super);
            function Control(view) {
                return _super.call(this, view) || this;
            }
            Object.defineProperty(Control.prototype, "Children", {
                get: function () { return this._c || (this._c = []); },
                enumerable: true,
                configurable: true
            });
            Control.prototype.Add = function (child) {
                if (!this.Check(child))
                    throw 'Uncompatible';
                var t;
                if (child instanceof JControl) {
                    if ((t = child.Presenter) == undefined)
                        t = child;
                    if (t.Parent != null)
                        t.Parent.Remove(t, false);
                }
                t = this.getTemplate(child);
                t.Parent = this;
                if (t !== child)
                    child._presenter = t;
                this.Children.push(child);
                this.NativeAdd(t);
                this.OnChildAdded(child);
                return this;
            };
            Control.prototype.NativeAdd = function (child) {
                child.View.remove();
                this.View.appendChild(child.View);
            };
            Control.prototype.Insert = function (child, to) {
                if (!this.Check(child))
                    throw 'Uncompatible';
                var t;
                if (child instanceof JControl) {
                    t = child.Presenter;
                    if (t === undefined)
                        t = child;
                    if (t.Parent != null) {
                        t.Parent.Remove(t, false);
                    }
                }
                t = this.getTemplate(child);
                t.Parent = this;
                this.Children.splice(to, 0, child);
                this.View.insertChildAtIndex(child.View, to);
                this.OnChildAdded(child);
                return this;
            };
            Control.prototype.Remove = function (child, dispose) {
                var i = this.Children.indexOf(child);
                if (i == -1)
                    return true;
                var t = child.Presenter;
                if (t.Parent != this)
                    return false;
                t.Parent = null;
                if (this.Children.splice(i, 1).length != 0)
                    this.View.removeChild(t.View);
                return true;
            };
            Control.prototype.RemoveAt = function (i, dispose) {
                var child = this.Children[i];
                if (!child)
                    return;
                var t = child.Presenter;
                t.Parent = null;
                this.Children.splice(i, 1);
                this.View.removeChild(this.Presenter ? t.Presenter.View : t.View);
                if (dispose)
                    child.Dispose();
                return true;
            };
            Object.defineProperty(Control.prototype, "HasTemplate", {
                get: function () { return false; },
                enumerable: true,
                configurable: true
            });
            Control.prototype.getTemplate = function (child) {
                return child;
            };
            Control.prototype.OnChildAdded = function (child) {
            };
            Control.prototype.getChild = function (i) {
                return this.Children[i];
            };
            Control.prototype.IndexOf = function (item) {
                return this.Children.indexOf(item);
            };
            Object.defineProperty(Control.prototype, "Count", {
                get: function () {
                    return this.Children.length;
                },
                enumerable: true,
                configurable: true
            });
            Control.prototype.CloneChildren = function () {
                var c = this.Children;
                var arr = new Array(c.length);
                for (var i = 0, l = arr.length; i < l; i++)
                    arr[i] = c[i];
            };
            Control.prototype.Clear = function (dispose) {
                for (var i = 0, l = this.Count; i < l; i++)
                    this.RemoveAt(0, dispose);
            };
            Control.prototype.Dispose = function () {
                var h = this.OnDispose();
                if (h === null)
                    return;
                this.Clear(true);
                this._c.length = 0;
                this._c = null;
                _super.prototype.Dispose.call(this);
                if (!h)
                    this.DisposingStat = 2;
            };
            return Control;
        }(JControl));
        UI.Control = Control;
        var Dom = (function (_super) {
            __extends(Dom, _super);
            function Dom(tagName, classList) {
                if (tagName === void 0) { tagName = 'div'; }
                var _this = _super.call(this, typeof tagName == 'string' ? document.createElement(tagName) : tagName) || this;
                if (classList)
                    for (var i = 0; i < classList.length; i++)
                        _this.View.classList.add(classList[i]);
                return _this;
            }
            Dom.prototype.initialize = function () {
            };
            return Dom;
        }(JControl));
        UI.Dom = Dom;
        var Div = (function (_super) {
            __extends(Div, _super);
            function Div() {
                return _super.call(this, document.createElement('div')) || this;
            }
            Div.prototype.initialize = function () {
            };
            Div.prototype.Check = function (item) { return true; };
            return Div;
        }(UI.Control));
        UI.Div = Div;
        var Label = (function (_super) {
            __extends(Label, _super);
            function Label(text) {
                var _this = _super.call(this, f = document.createElement('label')) || this;
                var f;
                f.textContent = text;
                return _this;
            }
            Label.prototype.initialize = function () { };
            Object.defineProperty(Label.prototype, "Text", {
                get: function () {
                    return this.View.textContent;
                },
                set: function (v) {
                    this.View.textContent = v;
                },
                enumerable: true,
                configurable: true
            });
            return Label;
        }(UI.JControl));
        UI.Label = Label;
        var Input = (function (_super) {
            __extends(Input, _super);
            function Input(dom) {
                return _super.call(this, dom || document.createElement('input')) || this;
            }
            Input.prototype.Disable = function (disable) {
                var c = $('input', this._view);
                for (var i = 0; i < c.length; i++) {
                    c[i].disabled = disable;
                }
            };
            Input.prototype.initialize = function () {
                this.applyStyle('input', 'form-control');
                if (this._view instanceof HTMLInputElement) {
                    this._view.addEventListener('focusout', this);
                    this._view.addEventListener('focusin', this);
                }
            };
            Object.defineProperty(Input.prototype, "Placeholder", {
                set: function (v) { this.View.placeholder = v; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Input.prototype, "Text", {
                get: function () { return this.View.value; },
                set: function (v) { this.View.value = v; },
                enumerable: true,
                configurable: true
            });
            Input.prototype.Blur = function () {
                this._view && this._view.blur();
            };
            Input.prototype.handleEvent = function (e) {
                if (e.type === 'focusout')
                    this.OnFocusOut(e);
                else if (e.type === 'focusin')
                    this.OnFocusIn(e);
            };
            Input.prototype.OnFocusIn = function (e) {
                UI.Desktop.Current.GetKeyControl(this, this.OnKeyPressed, []);
            };
            Input.prototype.OnKeyPressed = function (e) {
                if (e.keyCode == 27 || e.keyCode == 13)
                    this.Blur();
                return UI.KeyboardControllerResult.Handled;
            };
            Input.prototype.OnFocusOut = function (e) {
                UI.Desktop.Current.ReleaseKeyControl();
            };
            return Input;
        }(UI.JControl));
        UI.Input = Input;
        var DivControl = (function (_super) {
            __extends(DivControl, _super);
            function DivControl(tag) {
                return _super.call(this, typeof tag === 'string' ? document.createElement(tag || 'div') : tag) || this;
            }
            DivControl.prototype.initialize = function () {
            };
            DivControl.prototype.Check = function (child) {
                return child instanceof UI.JControl;
            };
            return DivControl;
        }(Control));
        UI.DivControl = DivControl;
        var ContentControl = (function (_super) {
            __extends(ContentControl, _super);
            function ContentControl(dom) {
                return _super.call(this, dom || document.createElement('div')) || this;
            }
            ContentControl_1 = ContentControl;
            ContentControl.prototype.initialize = function () { };
            Object.defineProperty(ContentControl.prototype, "Content", {
                get: function () { return this._content; },
                set: function (v) {
                    if (this._content == v)
                        return;
                    if (this._content)
                        this.Remove(this._content);
                    this._content = v;
                    if (v)
                        this.Add(v);
                },
                enumerable: true,
                configurable: true
            });
            ContentControl.prototype.OnKeyDown = function (e) {
                return this._content && this._content.OnKeyDown(e);
            };
            ContentControl.prototype.OnContextMenu = function (e) {
                return this._content && this._content.OnContextMenu(e);
            };
            var ContentControl_1;
            ContentControl = ContentControl_1 = __decorate([
                Dom_1.attributes.Content({ IsProperty: true, selector: function (e) { return e.child.Control; }, handler: "Content", type: Dom_1.attributes.ContentType.signle, keepInTree: true }),
                Dom_1.attributes.Component({
                    name: 'q-content', handler: function (e) {
                        e.node.e.Control = new ContentControl_1(e.node.Dom);
                        return e.node;
                    }
                }),
                __metadata("design:paramtypes", [HTMLElement])
            ], ContentControl);
            return ContentControl;
        }(JControl));
        UI.ContentControl = ContentControl;
    })(UI = exports.UI || (exports.UI = {}));
    (function (UI) {
        var Desktop = (function (_super) {
            __extends(Desktop, _super);
            function Desktop() {
                var _this = _super.call(this, document.body) || this;
                _this.KeyCombiner = new UI.DesktopKeyboardManager(_this);
                _this.apps = new collections_3.collection.List(Object);
                _this.IsSingleton = true;
                _this.KeyboardManager = new UI.KeyboardControllerManager(_this);
                _this._keyboardControllers = [];
                _this.focuser = new utils_2.basic.focuser(_this.View, true);
                _this.defaultKeys = 'jtpneruosdfhgkwl';
                _this.loadApp = runtime_5.thread.Dispatcher.cretaeJob(function (app) {
                    _this.CurrentApp = app;
                }, [null], _this, !true);
                _.call(_this);
                if (_dsk != null)
                    throw '';
                _dsk = _this;
                return _this;
            }
            Desktop_1 = Desktop;
            Desktop.prototype.WrapPage = function (e) {
                var c = e.child.e.Control;
                if (c instanceof Layout)
                    this.Add(c);
                else
                    throw "the type of dom must be a layout";
            };
            Desktop.prototype.Logout = function () {
                if (this.AuthenticationApp)
                    this.AuthenticationApp.Logout();
                else
                    this.CurrentApp.Logout();
            };
            Desktop.prototype.OpenSignin = function () {
                this.CurrentApp = this.AuthenticationApp;
            };
            Desktop.ctor = function () {
                this.DPCurrentApp = Corelib_5.bind.DObject.CreateField('CurrentApp', Object, null, function (e) {
                    e.__this.selectApp(e._old, e._new);
                });
                this.DPCurrentLayout = Corelib_5.bind.DObject.CreateField("CurrentLayout", UI.JControl, null, this.prototype._currentLayoutChanged);
            };
            Desktop.prototype._currentLayoutChanged = function (e) {
            };
            Desktop.prototype.selectApp = function (oldApp, app) {
                if (oldApp) {
                    this.Remove(oldApp, false);
                    _app = null;
                    runtime_5.helper.TryCatch(oldApp, oldApp.OnDetached);
                }
                if (app) {
                    _super.prototype.Add.call(this, app);
                    _app = app;
                    this.CurrentLayout = (app && app.CurrentModal) || app;
                    runtime_5.helper.TryCatch(app, app.OnAttached);
                }
                else
                    this.CurrentLayout = this;
                window.sessionStorage.setItem('app', app && app.Name);
            };
            Desktop.__fields__ = function () {
                return [Desktop_1.DPCurrentApp, Desktop_1.DPCurrentLayout];
            };
            Desktop.prototype.AuthStatChanged = function (v) {
                if (v)
                    this.Show(this.AuthenticationApp.RedirectApp);
                else
                    this.Show(this.AuthenticationApp);
            };
            Desktop.prototype.initialize = function () {
                var _this = this;
                document.addEventListener('keydown', this);
                document.addEventListener('contextmenu', this);
                this.KeyCombiner.attachTo(this.View);
                this.KeyCombiner.OnComined.Add(this.OnKeyCombined);
                this.observer = new Corelib_5.bind.Observer(this, ['CurrentApp', 'CurrentModal']);
                this.observer.OnPropertyChanged(Corelib_5.bind.Observer.DPValue, function (s, e) {
                    _this.CurrentLayout = e._new || _this.CurrentApp || _this;
                });
            };
            Desktop.prototype.mouseController = function (e) {
            };
            Object.defineProperty(Desktop.prototype, "KeyboardController", {
                get: function () {
                    return this._keyboardController;
                },
                set: function (v) {
                    this._keyboardController = v;
                },
                enumerable: true,
                configurable: true
            });
            Desktop.prototype.GetKeyControl = function (owner, invoke, params) {
                this.KeyCombiner.pause();
                this.KeyboardController = { owner: owner, invoke: invoke, params: params };
            };
            Desktop.prototype.ReleaseKeyControl = function () {
                this.KeyCombiner.resume();
                this.KeyboardController = null;
            };
            Desktop.prototype.handleTab = function (e, _view) {
                this.focuser.bound = _view;
                this.focuser.focuse(true, e.shiftKey);
                e.stopImmediatePropagation();
                e.preventDefault();
            };
            Desktop.prototype.OnKeyCombined = function (e, v) {
                var b = this.CurrentApp;
                if (b)
                    b.OnKeyCombined(e, v);
            };
            Desktop.prototype.OnKeyDown = function (e) {
                if (e.ctrlKey && this.defaultKeys.indexOf(e.key && e.key.toLowerCase()) != -1 || e.altKey && e.keyCode == 18)
                    e.preventDefault();
                var x = this.KeyboardController;
                var currentApp = this.CurrentApp;
                if (x) {
                    var p = x.params.slice();
                    p.unshift(e);
                    var r = x.invoke.apply(this.KeyboardController.owner, p);
                    if ((r & UI.KeyboardControllerResult.Release) == UI.KeyboardControllerResult.Release)
                        this.ReleaseKeyControl();
                    if ((r & UI.KeyboardControllerResult.ByPass) != UI.KeyboardControllerResult.ByPass)
                        return;
                }
                var cd = currentApp && currentApp.CurrentModal;
                if (e.keyCode > 111 && e.keyCode < 124) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                if (cd) {
                    if (!cd.OnKeyDown(e))
                        if (e.keyCode === 9)
                            this.handleTab(e, cd.View);
                        else
                            ;
                    else {
                        e.stopImmediatePropagation();
                        e.stopPropagation();
                        e.preventDefault();
                    }
                    return;
                }
                if (e.keyCode === 114) {
                    if (e.ctrlKey)
                        this.CurrentApp.ToggleTitle();
                    else
                        this.CurrentApp.OnDeepSearche();
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
                if (e.keyCode === UI.Keys.F5) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    this.CurrentApp.Update();
                }
                else if (e.keyCode == UI.Keys.F12) {
                    if (e.ctrlKey) {
                        this.Logout();
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        e.stopPropagation();
                        return;
                    }
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                }
                else if (e.ctrlKey && e.shiftKey && e.keyCode == 66) {
                    if ((Date.now() - this.isReq) < 500) {
                        Corelib_5.Api.RiseApi('Settings', { data: e, callback: function () { } });
                    }
                    else
                        this.isReq = Date.now();
                }
                else if (e.ctrlKey && (e.keyCode == 112 || e.keyCode === 80)) {
                    currentApp.OnPrint();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                }
                else {
                    if (currentApp && e.ctrlKey && e.keyCode === 80)
                        this.CurrentApp.OnPrint();
                    currentApp && currentApp.OnKeyDown(e);
                }
            };
            Desktop.prototype.handleEvent = function (e) {
                switch (e.type) {
                    case 'keydown':
                        if (e.keyCode !== 93)
                            return this.OnKeyDown(e);
                        else {
                            var oe = e;
                            var r = e.srcElement;
                            var x = r.clientLeft, y = r.clientTop;
                            e = {
                                preventDefault: function () { oe.preventDefault(); }, stopPropagation: function () { oe.stopPropagation(); }, x: x, y: y, screenX: x, screenY: y, clientY: y, clientX: x, pageX: x, pageY: y
                            };
                        }
                    case 'contextmenu':
                        return this.OnContextMenu(e);
                    default:
                }
            };
            Desktop.prototype.OnContextMenu = function (e) {
                e.preventDefault();
                var currentApp = this.CurrentApp;
                var cd = currentApp && currentApp.CurrentModal;
                if (cd)
                    return cd.OnContextMenu(e);
                else if (currentApp)
                    return currentApp.OnContextMenu(e);
            };
            Desktop.prototype.ShowStart = function () {
                var t = this.apps;
                var s = "Select app :";
                var ap = this.CurrentApp == null ? null : this.CurrentApp.Name;
                for (var i = 0, l = t.Count; i < l; i++) {
                    if (ap == null)
                        ap = t.Get(i).Name;
                    s += "\r        " + t.Get(i).Name;
                }
                var e = prompt(s, ap == null ? "" : ap);
                for (var i = 0, l = t.Count; i < l; i++)
                    if (t.Get(i).Name.toLowerCase() == e) {
                        {
                            this.Show(t.Get(i));
                        }
                        return;
                    }
            };
            Object.defineProperty(Desktop, "Current", {
                get: function () { return _dsk; },
                enumerable: true,
                configurable: true
            });
            Desktop.prototype.Check = function (v) {
                return v instanceof Object;
            };
            Desktop.prototype.Show = function (app) {
                var _this = this;
                if (authApp)
                    authApp.IsLogged(function (v, app) {
                        var currentApp = _this.CurrentApp;
                        if (!v) {
                            if (currentApp && currentApp.IsAuthentication)
                                return;
                            if (app !== _this.AuthenticationApp)
                                _this.AuthenticationApp.RedirectApp = app;
                            app = _this.AuthenticationApp;
                        }
                        else {
                            app = app && app.IsAuthentication ? app.RedirectApp : app;
                        }
                        if (!app)
                            for (var i = 0; i < _this.apps.Count; i++) {
                                var appx = _this.apps.Get(i);
                                if (!(appx && appx.IsAuthentication)) {
                                    app = appx;
                                    break;
                                }
                            }
                        runtime_5.thread.Dispatcher.Push(_this.loadApp.Set(app));
                    }, app);
                else
                    runtime_5.thread.Dispatcher.Push(this.loadApp.Set(app));
            };
            Desktop.prototype.Add = function (i) {
                if (i.IsAuthentication)
                    this.AuthenticationApp = i;
                else
                    this.Register(i);
                return this;
            };
            Desktop.prototype.Register = function (app) {
                if (this.apps.IndexOf(app) !== -1)
                    return;
                this.apps.Add(app);
                app.Parent = this;
            };
            Object.defineProperty(Desktop.prototype, "AuthenticationApp", {
                get: function () { return authApp; },
                set: function (v) {
                    var _this = this;
                    if (authApp || v == null)
                        throw '';
                    authApp = v;
                    v.OnStatStatChanged.On = function (auth, v) {
                        if (v) {
                            _this.Redirect(auth);
                        }
                        else {
                            _this.Show(auth);
                        }
                    };
                },
                enumerable: true,
                configurable: true
            });
            Desktop.prototype.Redirect = function (app) {
                this.Show(app.RedirectApp);
            };
            Desktop.prototype.OnUsernameChanged = function (job, e) {
            };
            var Desktop_1;
            Desktop = Desktop_1 = __decorate([
                Dom_1.attributes.Content({ handler: Desktop_1.prototype.WrapPage, type: Dom_1.attributes.ContentType.multiple, keepInTree: false }),
                __metadata("design:paramtypes", [])
            ], Desktop);
            return Desktop;
        }(UI.Control));
        UI.Desktop = Desktop;
        var ServiceNavBar = (function (_super) {
            __extends(ServiceNavBar, _super);
            function ServiceNavBar(App) {
                var _this = _super.call(this, document.createElement('div')) || this;
                _this.App = App;
                _this.services = [];
                _this._services = [];
                _this.OnClick = _this.OnClick.bind(_this);
                _this.serviceNotified = _this.serviceNotified.bind(_this);
                return _this;
            }
            ServiceNavBar.prototype.initialize = function () {
                this.applyStyle('navbar', 'navbar-fixed-bottom', 'appFoot', 'uncolapsed');
            };
            Object.defineProperty(ServiceNavBar.prototype, "LeftTabs", {
                set: function (v) {
                    var _this = this;
                    if (this._lefttabs === v)
                        return;
                    if (this._lefttabs) {
                        _super.prototype.Remove.call(this, this._lefttabs);
                        this._lefttabs.OnSelectedItem.Remove(this);
                    }
                    if (v) {
                        _super.prototype.Add.call(this, v);
                        v.OnSelectedItem.Add(function (s) { if (_this.OnPageSelected)
                            _this.OnPageSelected(s); }, this);
                        v.Float(UI.HorizontalAlignement.Left);
                    }
                    this._lefttabs = v;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ServiceNavBar.prototype, "RightTabs", {
                set: function (v) {
                    var _this = this;
                    if (this._righttabs === v)
                        return;
                    if (this._righttabs) {
                        _super.prototype.Remove.call(this, this._righttabs);
                        this._righttabs.OnSelectedItem.Remove(this);
                    }
                    if (v) {
                        _super.prototype.Add.call(this, v);
                        v.OnSelectedItem.Add(function (s) { if (_this.OnPageSelected)
                            _this.OnPageSelected(s); }, this);
                        v.Float(UI.HorizontalAlignement.Right);
                    }
                    this._righttabs = v;
                },
                enumerable: true,
                configurable: true
            });
            ServiceNavBar.prototype.OnClick = function (page) {
                if (this.OnPageSelected)
                    this.OnPageSelected(page);
            };
            ServiceNavBar.prototype.Add = function (child) {
                throw "Not Allowed";
            };
            ServiceNavBar.prototype.AddRange = function (child) {
                throw "Not Allowed";
            };
            ServiceNavBar.prototype.Remove = function (child) {
                if (child === this._lefttabs)
                    this.LeftTabs = null;
                else if (child === this._righttabs)
                    this.RightTabs = null;
                else
                    throw "Not Allowed";
                return true;
            };
            ServiceNavBar.prototype.serviceNotified = function (s, n) {
                if (this.App === Desktop.Current.CurrentApp)
                    if (n === UI.NotifyType.Focuse)
                        this.Push(s);
                    else if (n === UI.NotifyType.UnFocus)
                        this.Pop(s);
            };
            Object.defineProperty(ServiceNavBar.prototype, "currentStack", {
                get: function () { return this.services[this.services.length - 1]; },
                enumerable: true,
                configurable: true
            });
            ServiceNavBar.prototype.CurrentService = function () { var t = this.services[this.services.length - 1]; if (t)
                return t.Current; return null; };
            ServiceNavBar.prototype.PushGBar = function (ser) {
                this.HideCurrentService();
                this.services.push(new BarStack(ser));
                this.ShowCurrentService();
            };
            ServiceNavBar.prototype.PopGBar = function (ser) {
                this.HideCurrentService();
                this.services.pop();
                this.Add(ser.GetLeftBar());
            };
            ServiceNavBar.prototype.ExitBar = function () {
                this.HideCurrentService();
                this.currentStack.Exit();
                this.ShowCurrentService();
            };
            ServiceNavBar.prototype.PushBar = function (ser) {
                this.HideCurrentService();
                this.currentStack.Push(ser);
                this.ShowCurrentService();
            };
            ServiceNavBar.prototype.PopBar = function () {
                this.HideCurrentService();
                this.currentStack.Pop();
                this.ShowCurrentService();
            };
            ServiceNavBar.prototype.HideCurrentService = function () {
                var cs = this.currentStack;
                if (cs) {
                    var l = cs.Current.GetLeftBar();
                    var r = cs.Current.GetRightBar();
                    if (l) {
                        if (l.NavType === 'navbar')
                            this.LeftTabs = null;
                        else
                            this.Remove(l);
                    }
                    if (r) {
                        if (r.NavType === 'navbar')
                            this.RightTabs = null;
                        else
                            this.Remove(r);
                    }
                }
            };
            ServiceNavBar.prototype.ShowCurrentService = function () {
                var cs = this.currentStack;
                if (cs) {
                    var l = cs.Current.GetLeftBar();
                    var r = cs.Current.GetRightBar();
                    if (l) {
                        if (l.NavType === 'navbar')
                            this.LeftTabs = l;
                        else
                            this.Add(l);
                    }
                    if (r) {
                        if (l.NavType === 'navbar')
                            this.RightTabs = r;
                        else {
                            this.Add(r);
                        }
                    }
                    this.Visible = l != null || r != null;
                }
            };
            ServiceNavBar.prototype.Push = function (s) {
                if (!s || s === this.CurrentService())
                    return;
                this.HideCurrentService();
                var c = this.CurrentService();
                if (c)
                    if (c.ServiceType == UI.ServiceType.Instantany)
                        this.currentStack.Pop();
                if (s.ServiceType == UI.ServiceType.Main)
                    this.services.push(new BarStack(s));
                else {
                    var t = this.currentStack;
                    if (t == null)
                        this.services.push(new BarStack(s));
                    else
                        this.currentStack.Push(s);
                }
                this.ShowCurrentService();
            };
            ServiceNavBar.prototype.Has = function (s) {
                var c = this.services;
                var r;
                var l = c.length;
                for (var i = l - 1; i >= 0; i--) {
                    var x = c[i];
                    if ((r = x.Has(s)) !== 0)
                        return { stack: l - i + (r === -1 ? 0 : -1), serv: r };
                }
                return null;
            };
            ServiceNavBar.prototype.Pop = function (s) {
                this.HideCurrentService();
                if (s) {
                    var t = this.Has(s);
                    if (t) {
                        while (t.stack > 0) {
                            this.services.pop();
                            t.stack--;
                        }
                        var l = this.currentStack;
                        while (t.serv > 0) {
                            l.Pop();
                            t.serv--;
                        }
                    }
                }
                else {
                    var c = this.CurrentService();
                    if (c)
                        if (c.ServiceType === UI.ServiceType.Main)
                            this.services.pop();
                        else
                            this.currentStack.Pop();
                }
                this.ShowCurrentService();
            };
            ServiceNavBar.prototype.Register = function (service) {
                if (service.Handler && !service.Handled()) {
                    service.Handler.addEventListener('pointerenter', function (e) {
                        Desktop.Current.CurrentApp.Foot.Push(service);
                    });
                    service.Handler.addEventListener('pointerout', function (e) {
                        Desktop.Current.CurrentApp.Foot.Pop(service);
                    });
                }
                if (service.Notify)
                    service.Notify.On = this.serviceNotified;
            };
            return ServiceNavBar;
        }(UI.JControl));
        UI.ServiceNavBar = ServiceNavBar;
        var BarStack = (function () {
            function BarStack(current) {
                this.others = [];
                this._current = current;
            }
            Object.defineProperty(BarStack.prototype, "Current", {
                get: function () {
                    if (this.others.length == 0)
                        return this._current;
                    return this.others[this.others.length - 1];
                },
                enumerable: true,
                configurable: true
            });
            BarStack.prototype.Push = function (s) {
                this.others.push(s);
            };
            BarStack.prototype.Pop = function () {
                return this.others.pop();
            };
            BarStack.prototype.Has = function (s) {
                var c = this.others, l = c.length;
                if (this._current == s)
                    return -1;
                for (var i = l - 1; i >= 0; i--) {
                    var x = c[i];
                    if (x == s)
                        return l - i;
                }
                return 0;
            };
            BarStack.prototype.Exit = function () { this.others.length = 0; };
            return BarStack;
        }());
        UI.BarStack = BarStack;
        var Error = (function (_super) {
            __extends(Error, _super);
            function Error() {
                return _super.call(this, document.createElement('div')) || this;
            }
            Object.defineProperty(Error.prototype, "Message", {
                get: function () { return this._text; },
                set: function (v) {
                    this._text = v;
                    if (this.container)
                        this.container.textContent = v;
                },
                enumerable: true,
                configurable: true
            });
            Error.prototype.initialize = function () {
                this.applyStyle(this.IsInfo ? 'webix_info' : 'webix_error');
                this.container = document.createElement('div');
                this.container.innerHTML = this._text;
                this._view.appendChild(this.container);
                this._view.addEventListener('mousedown', this);
            };
            Error.prototype.handleEvent = function (e) {
                if (e.type == 'mousedown') {
                    this._view.removeEventListener('mousedown', this);
                    this.Pop();
                }
                else
                    _super.prototype.handleEvent.call(this, e);
            };
            Error.prototype.Push = function () {
                InfoArea.Default.Add(this);
                this.timeout = setTimeout(function (t) { t.Pop(); }, this.Expire || 3000, this);
            };
            Error.prototype.Pop = function () {
                this.applyStyle('ihidden');
                var x = {};
                clearTimeout(this.timeout);
                x.id = setTimeout(function (t, x) { clearTimeout(x.id); InfoArea.Default.Remove(t); t.Dispose(); }, 2000, this, x);
            };
            Error.prototype.Dispose = function () {
                this.container = null;
                this._text = null;
                _super.prototype.Dispose.call(this);
            };
            return Error;
        }(UI.JControl));
        UI.Error = Error;
        var ia;
        var InfoArea = (function (_super) {
            __extends(InfoArea, _super);
            function InfoArea() {
                var _this = _super.call(this, document.createElement('div')) || this;
                _this.initialize();
                return _this;
            }
            Object.defineProperty(InfoArea, "Default", {
                get: function () {
                    if (!ia) {
                        ia = new InfoArea();
                        ia.Parent = Desktop.Current;
                    }
                    return ia;
                },
                enumerable: true,
                configurable: true
            });
            InfoArea.prototype.initialize = function () {
                this.applyStyle('webix_message_area');
                document.body.appendChild(this._view);
            };
            InfoArea.prototype.Check = function (j) {
                return j instanceof Error;
            };
            InfoArea.push = function (msg, isInfo, expire) {
                var t = new Error();
                t.Message = msg;
                t.IsInfo = isInfo;
                t.Expire = expire;
                t.Push();
            };
            return InfoArea;
        }(UI.Control));
        UI.InfoArea = InfoArea;
        var _app = null;
        var Empty = new collections_3.collection.List(String);
        Empty.Freeze();
        var Layout = (function (_super) {
            __extends(Layout, _super);
            function Layout(view) {
                var _this = _super.call(this, view) || this;
                _this.Pages = new collections_3.collection.List(Object);
                _this.opcd = { Owner: _this, Invoke: _this.PagesChanged };
                _this.openedModal = [];
                _this.zIndex = 1000;
                _this._contextMenuLayer = void 0;
                _this._currentContextMenu = void 0;
                _this._currentContextMenuEventArgs = void 0;
                _this._contextMenuZIndex = 1000000;
                _this.PagesChanged = _this.PagesChanged.bind(_this);
                return _this;
            }
            Object.defineProperty(Layout.prototype, "IsAuthentication", {
                get: function () { return false; },
                enumerable: true,
                configurable: true
            });
            Layout.prototype.OnPageChanging = function (e) { };
            Layout.prototype.OnPageChanged = function (e) {
                var page = e._new;
                this.silentSelectPage(e._old, page);
                page && page.OnSelected.Invoke(page, [page]);
            };
            Layout.__fields__ = function () { return [this.DPSelectedPage, this.DPCurrentModal = Corelib_5.bind.DObject.CreateField("CurrentModal", Object, null, this.prototype._onCurrentModalChanged)]; };
            Layout.prototype.Check = function (child) { return true; };
            Layout.prototype.Logout = function () {
                this.Check;
            };
            Layout.prototype.silentSelectPage = function (oldPage, page) {
                this.Foot.Pop(oldPage);
                this.showPage(page);
                this.Foot.Push(page);
            };
            Layout.prototype.Open = function (page) {
                this.SelectedPage = page;
            };
            Layout.prototype.PagesChanged = function (e) {
                if (e.event == collections_3.collection.CollectionEvent.Added) {
                    this.Foot.Register(e.newItem);
                }
            };
            Layout.prototype.OpenPage = function (pageNme) {
                var ps = this.Pages.AsList();
                for (var i = 0, l = ps.length; i < l; i++) {
                    var p = ps[i];
                    if (p.Name !== pageNme)
                        continue;
                    this.SelectedPage = p;
                    return true;
                }
                return false;
            };
            Layout.prototype.AddPage = function (child) {
                if (child == null)
                    return;
                this.Pages.Add(child);
            };
            Layout.prototype.SelectNaxtPage = function () {
                var t = this.Pages;
                var i = t.IndexOf(this.SelectedPage);
                var p = t.Get(i + 1);
                if (p)
                    this.SelectedPage = p;
            };
            Layout.prototype.SelectPrevPage = function () {
                var t = this.Pages;
                var i = t.IndexOf(this.SelectedPage);
                var p = t.Get(i - 1);
                if (p)
                    this.SelectedPage = p;
            };
            Layout.prototype.Update = function () {
                var s = this.SelectedPage;
                if (s)
                    s.Update();
            };
            Layout.prototype.OnKeyDown = function (e) {
                var s = this.SelectedPage;
                if (s)
                    s.OnKeyDown(e);
            };
            Layout.prototype.OnKeyCombined = function (e, v) {
                var s = this.SelectedPage;
                if (s)
                    return s.OnKeyCombined(e, v);
            };
            Layout.prototype.OnPrint = function () {
                var s = this.SelectedPage;
                if (s)
                    s.OnPrint();
            };
            Layout.prototype.OnDeepSearche = function () {
                var s = this.SelectedPage;
                if (s)
                    s.OnDeepSearche();
            };
            Layout.prototype.OnContextMenu = function (e) {
                var cp = this.SelectedPage;
                if (cp)
                    cp.OnContextMenu(e);
            };
            Layout.prototype.handleEvent = function (e) { };
            Layout.prototype.Show = function () {
                if (_app != null)
                    document.body.removeChild(_app.View);
                _app = this;
                Desktop.Current.Show(this);
            };
            Layout.prototype.initialize = function () {
                this.Pages.Listen = this.opcd;
            };
            Layout.getView = function () {
                var app = document.createElement('app');
                app.id = 'app-' + Date.now();
                return app;
            };
            Layout.prototype.searchActioned = function (s, o, n) {
                this.SelectedPage.OnSearche(o, n);
            };
            Layout.prototype.OnAttached = function () {
            };
            Layout.prototype.OnDetached = function () { };
            Layout.prototype.OpenModal = function (m) {
                this.CurrentModal = m;
            };
            Layout.prototype.CloseModal = function (m) {
                var im = this.openedModal.indexOf(m);
                if (im != -1)
                    this.openedModal.splice(im, 1);
                this.CurrentModal = this.openedModal[this.openedModal.length - 1];
            };
            Layout.prototype._onCurrentModalChanged = function (e) {
                var m = e._old;
                if (m) {
                    m.disapplyStyle('in');
                    if (m.View.parentNode)
                        runtime_5.helper.TryCatch(m.View, Element.prototype.remove);
                    m.Parent = null;
                    m.Visible = false;
                }
                m = e._new;
                if (m) {
                    if (this.openedModal.indexOf(m) == -1)
                        this.openedModal.push(m);
                    if (m.View.parentNode)
                        runtime_5.helper.TryCatch(m.View, Element.prototype.remove);
                    this._view.appendChild(m.View);
                    m.applyStyle('in');
                    this.applyStyle('modal-open');
                    m.View.style.display = 'block';
                    m.View.style.zIndex = this.zIndex++ + "";
                    m.Visible = true;
                    m.Parent = this;
                }
                else
                    this.disapplyStyle('modal-open');
            };
            Layout.prototype.OpenContextMenu = function (cm, e) {
                var _this = this;
                if (!this._contextMenuLayer) {
                    this._contextMenuLayer = new UI.ContentControl().applyStyle('context-menu-layer');
                    this._contextMenuLayer.Parent = this;
                    this._contextMenuLayer.addEventListener('click', function (s, e, p) {
                        var src = e.target || e.srcElement;
                        if (src === _this._contextMenuLayer.View) {
                            _this.CloseContextMenu(void 0);
                        }
                    }, void 0, this);
                    this._view.appendChild(this._contextMenuLayer.View);
                }
                else if (this._currentContextMenu && !this.CloseContextMenu())
                    return false;
                this._contextMenuLayer.disapplyStyle('hidden');
                this._contextMenuLayer.View.style.zIndex = "" + (++this._contextMenuZIndex);
                this._contextMenuLayer.Content = cm.getView();
                this._currentContextMenu = cm;
                this._currentContextMenuEventArgs = e;
                cm.OnAttached(e);
            };
            Layout.prototype.CloseContextMenu = function (r) {
                if (this._currentContextMenuEventArgs) {
                    this._currentContextMenuEventArgs.cancel = false;
                    if (this._currentContextMenu && this._currentContextMenu.OnClosed(r, this._currentContextMenuEventArgs))
                        return false;
                }
                this._contextMenuLayer.Content = void 0;
                this._currentContextMenu = void 0;
                this._currentContextMenuEventArgs = void 0;
                this._contextMenuLayer.applyStyle('hidden');
                return true;
            };
            Layout.DPSelectedPage = Corelib_5.bind.DObject.CreateField("SelectedPage", Object, null, function (e) { return e.__this.OnPageChanged(e); }, function (e) { return e.__this.OnPageChanging(e); });
            return Layout;
        }(UI.Control));
        UI.Layout = Layout;
        var QApp = (function (_super) {
            __extends(QApp, _super);
            function QApp(dom) {
                var _this = _super.call(this, dom || document.createElement('m-app')) || this;
                _this.applyStyle('app');
                _this._view.tabIndex = 1;
                return _this;
            }
            QApp_1 = QApp;
            QApp._insertComponent = function (e) {
                var t = e.child.e;
                var app = e.parent.Control;
                if (t.Control)
                    app.Children.push(t.Control);
            };
            QApp.component = function (e) {
                var c = new QApp_1(e.node.Dom);
                UI.Desktop.Current.Add(c);
                if (!UI.Desktop.Current.CurrentApp)
                    UI.Desktop.Current.CurrentApp = c;
                e.node.e.Control = c;
                return e.node;
            };
            QApp.prototype.Check = function () { return true; };
            QApp.prototype.showPage = function () { };
            QApp.prototype.ShowApp = function () { };
            QApp.prototype.OnKeyDown = function (e) {
                for (var i = 0; i < this.Count; i++) {
                    var c = this.getChild(i);
                    if (c.OnKeyDown(e))
                        return true;
                }
            };
            var QApp_1;
            QApp = QApp_1 = __decorate([
                Dom_1.attributes.Component({ name: 'q-app', handler: QApp_1.component }),
                Dom_1.attributes.Content({ handler: QApp_1._insertComponent, type: Dom_1.attributes.ContentType.multiple, keepInTree: true }),
                __metadata("design:paramtypes", [Element])
            ], QApp);
            return QApp;
        }(UI.Layout));
        var _dsk = new UI.Desktop();
        function CurrentDesktop() { return _dsk; }
        UI.CurrentDesktop = CurrentDesktop;
        function CurrentApp() { return _dsk.CurrentApp; }
        UI.CurrentApp = CurrentApp;
    })(UI = exports.UI || (exports.UI = {}));
    (function (UI) {
        var TemplateShadow = (function (_super) {
            __extends(TemplateShadow, _super);
            function TemplateShadow() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            TemplateShadow.Create = function (item) {
                var isscop = item instanceof Corelib_5.bind.Scop;
                var c = document.createElement('label');
                c.textContent = ((isscop ? item.Value : item) || '').toString();
                return new ScopicTemplateShadow(c, isscop ? item : new Corelib_5.bind.ValueScop(item));
            };
            return TemplateShadow;
        }(UI.JControl));
        UI.TemplateShadow = TemplateShadow;
        var ScopicTemplateShadow = (function (_super) {
            __extends(ScopicTemplateShadow, _super);
            function ScopicTemplateShadow(dom, scop, cnt) {
                var _this = _super.call(this, dom) || this;
                _this.scop = scop;
                _this.cnt = new Dom_1.Controller(cnt || _this);
                _this.cnt.Scop = scop;
                return _this;
            }
            Object.defineProperty(ScopicTemplateShadow.prototype, "Controller", {
                get: function () { return this.cnt; },
                enumerable: true,
                configurable: true
            });
            ScopicTemplateShadow.prototype.setDataContext = function (data) { if (this.scop)
                this.scop.Value = data; };
            ScopicTemplateShadow.prototype.getDataContext = function () { return this.scop ? this.scop.Value : null; };
            ScopicTemplateShadow.prototype.initialize = function () {
                if (this.scop == undefined) {
                    var c = this._view.getAttribute('db-bind');
                    if (c)
                        if (c.indexOf('$') === 0)
                            this.scop = Corelib_5.bind.Scop.Create(c, { dom: this._view, controller: this.Controller, parent: this.Scop, bindingMode: 3, parseResult: void 0 });
                }
                var oldAttribute = this._view.getAttribute('db-bind');
                this._view.setAttribute('db-bind', '~' + Corelib_5.bind.AnonymouseScop.Register(this.scop) + (oldAttribute && oldAttribute != '' ? '.' + oldAttribute : ''));
                this.cnt.processHowEver = true;
                this.cnt.Scop = this.Scop;
                this.cnt.View = this._view;
            };
            ScopicTemplateShadow.prototype.Check = function (c) {
                return false;
            };
            Object.defineProperty(ScopicTemplateShadow.prototype, "Scop", {
                get: function () { return this.scop; },
                enumerable: true,
                configurable: true
            });
            ScopicTemplateShadow.prototype.getScop = function () { return this.scop; };
            ScopicTemplateShadow.prototype.Dispose = function () {
                stop();
            };
            return ScopicTemplateShadow;
        }(TemplateShadow));
        UI.ScopicTemplateShadow = ScopicTemplateShadow;
        var EScopicTemplateShadow = (function () {
            function EScopicTemplateShadow(control, scop) {
                this.control = control;
                this.scop = scop;
                this.cnt = new Dom_1.Controller(control);
                this.initialize();
            }
            Object.defineProperty(EScopicTemplateShadow.prototype, "Controller", {
                get: function () { return this.cnt; },
                enumerable: true,
                configurable: true
            });
            EScopicTemplateShadow.prototype.setDataContext = function (data) { if (this.scop)
                this.scop.Value = data; };
            EScopicTemplateShadow.prototype.getDataContext = function () { return this.scop ? this.scop.Value : null; };
            EScopicTemplateShadow.prototype.initialize = function () {
                if (this.scop == undefined) {
                    var c = this.control.View.getAttribute('db-bind');
                    if (c)
                        if (c.indexOf('$') === 0)
                            this.scop = Corelib_5.bind.Scop.Create(c, { dom: this.control.View, controller: this.cnt, parent: this.scop, bindingMode: 3, parseResult: void 0 });
                }
                var oldAttribute = this.control.View.getAttribute('db-bind');
                this.control.View.setAttribute('db-bind', '~' + Corelib_5.bind.AnonymouseScop.Register(this.scop) + (oldAttribute && oldAttribute != '' ? '.' + oldAttribute : ''));
                this.cnt.processHowEver = true;
                this.cnt.View = this.control.View;
            };
            EScopicTemplateShadow.prototype.Check = function (c) {
                return false;
            };
            Object.defineProperty(EScopicTemplateShadow.prototype, "Scop", {
                get: function () { return this.scop; },
                enumerable: true,
                configurable: true
            });
            EScopicTemplateShadow.prototype.getScop = function () { return this.scop; };
            return EScopicTemplateShadow;
        }());
        UI.EScopicTemplateShadow = EScopicTemplateShadow;
        var Template = (function () {
            function Template() {
            }
            Template.ToTemplate = function (itemTemplate, asTemplate) {
                if (itemTemplate instanceof Template || itemTemplate instanceof HtmlTemplate)
                    return itemTemplate;
                else if (itemTemplate instanceof HTMLTemplateElement)
                    return new HtmlTemplate(itemTemplate.content.firstElementChild, true);
                else if (itemTemplate instanceof HTMLElement)
                    return new HtmlTemplate(itemTemplate, asTemplate);
                else if (typeof itemTemplate === "string") {
                    var x = ListAdapter._getTemplate(itemTemplate);
                    if (x == null) {
                        var cc = "the template { " + itemTemplate + " } was not found";
                        console.error(new $Error(cc));
                        var d = document.createElement('error');
                        d.innerText = cc;
                        return new HtmlTemplate(d, false);
                    }
                    return new ScopicTemplate(x);
                }
                else
                    return new ScopicTemplate(ListAdapter._getTemplate(itemTemplate));
            };
            return Template;
        }());
        UI.Template = Template;
        var HtmlTemplate = (function () {
            function HtmlTemplate(dom, asTemplate) {
                this.dom = dom;
                if (dom instanceof HTMLTemplateElement) {
                    this.dom = dom.content.firstElementChild;
                    this.asTemplate = true;
                }
                else
                    this.asTemplate = !!asTemplate;
                Object.freeze(this);
            }
            HtmlTemplate.prototype.CreateShadow = function (data, cnt) {
                return new ScopicTemplateShadow(this.asTemplate ? this.dom.cloneNode(true) : this.dom, data instanceof Corelib_5.bind.Scop ? data : new Corelib_5.bind.ValueScop(data), cnt);
            };
            return HtmlTemplate;
        }());
        UI.HtmlTemplate = HtmlTemplate;
        var ScopicTemplate = (function () {
            function ScopicTemplate(templatePath) {
                this.template = typeof templatePath === 'string' ? runtime_5.mvc.MvcDescriptor.Get(templatePath) : templatePath;
                if (this.template == null) {
                    throw new $Error("the template { " + templatePath + " } was not found");
                }
            }
            ScopicTemplate.prototype.CreateShadow = function (data, cnt) {
                return new ScopicTemplateShadow(this.template.Create(), data instanceof Corelib_5.bind.Scop ? data : (new Corelib_5.bind.ValueScop(data)), cnt);
            };
            return ScopicTemplate;
        }());
        UI.ScopicTemplate = ScopicTemplate;
        var actions;
        var TControl = (function (_super) {
            __extends(TControl, _super);
            function TControl(itemTemplate, data) {
                var _this = _super.call(this, null) || this;
                _this.data = data;
                _this._onCompiled = new Corelib_5.bind.EventListener(_this, true);
                _this.compiled = false;
                _this._template = Template.ToTemplate(itemTemplate, false);
                _this.Shadow = _this._template.CreateShadow(data === TControl.Me ? _this : data, _this);
                _this.Shadow.Parent = _this;
                _this._view = _this.Shadow.View;
                return _this;
            }
            TControl.prototype.OnFullInitialized = function () {
                var c = this.Shadow.Controller;
                c && (c.OnCompiled = { Owner: this, Invoke: this._onTemplateCompiled });
                _super.prototype.OnFullInitialized.call(this);
            };
            TControl.prototype._onTemplateCompiled = function (cnt) {
                this.compiled = true;
                this.OnCompileEnd(cnt);
                this._onCompiled.PInvok(this, [this, cnt]);
            };
            TControl.prototype.OnCompileEnd = function (cnt) {
            };
            TControl.prototype.getScop = function () { return this.Shadow instanceof ScopicTemplateShadow ? this.Shadow.Scop : null; };
            TControl.prototype.initialize = function () {
            };
            Object.defineProperty(TControl.prototype, "OnCompiled", {
                set: function (m) {
                    if (this.compiled)
                        m(this);
                    else
                        this._onCompiled.On = m;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TControl.prototype, "IsCompiled", {
                get: function () {
                    return this.compiled;
                },
                enumerable: true,
                configurable: true
            });
            TControl.prototype.OnDataChanged = function (e) {
                this.Shadow.setDataContext(e._new);
            };
            TControl.Me = new Object();
            __decorate([
                Corelib_5.bind.property1(Object, { changed: TControl.prototype.OnDataChanged }),
                __metadata("design:type", Object)
            ], TControl.prototype, "Data", void 0);
            return TControl;
        }(UI.JControl));
        UI.TControl = TControl;
        var ListAdapter = (function (_super) {
            __extends(ListAdapter, _super);
            function ListAdapter(template, itemTemplate, data, getSourceFromScop) {
                var _this = _super.call(this, template || document.createElement('div'), data) || this;
                _this.garbage = [];
                _this.AcceptNullValue = true;
                _this.OnItemSelected = new Corelib_5.bind.EventListener('');
                _this.OnItemInserted = new Corelib_5.bind.EventListener('');
                _this.OnItemRemoved = new Corelib_5.bind.EventListener('');
                _this.OnChildClicked = new Corelib_5.bind.EventListener('');
                _this.sli = { Owner: _this, Invoke: _this.OnSourceChanged };
                _this.count = 0;
                _this.initTemplate(itemTemplate, getSourceFromScop);
                return _this;
            }
            ListAdapter.prototype.instantanyInitializeParent = function () { return true; };
            ListAdapter.__fields__ = function () { return [ListAdapter.DPSelectedIndex, ListAdapter.DPTemplate, ListAdapter.DPSource, this.DPSelectedItem]; };
            Object.defineProperty(ListAdapter.prototype, "Source", {
                get: function () { return this.get(ListAdapter.DPSource); },
                set: function (v) { this.set(ListAdapter.DPSource, v); },
                enumerable: true,
                configurable: true
            });
            ListAdapter.prototype.__checkSelectedIndex = function (e) {
                var s = this.Source;
                var l = s == null ? 0 : s.Count;
                var n = isNaN(e._new) || e._new == null || e._new < 0 ? -1 : e._new;
                if (n === -1)
                    e._new = this.AcceptNullValue || l == 0 ? -1 : 0;
                else if (n >= l)
                    e._new = this.AcceptNullValue ? l : l - 1;
            };
            ListAdapter.prototype.swap = function (i) {
                var s = this.Source;
                var l = s == null ? 0 : s.Count;
                var n = i;
                if (i < 0)
                    return -1;
                else if (n >= l)
                    return l - 1;
                return i;
            };
            Object.defineProperty(ListAdapter.prototype, "SelectedIndex", {
                get: function () { return this.get(ListAdapter.DPSelectedIndex); },
                set: function (v) { this.set(ListAdapter.DPSelectedIndex, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListAdapter.prototype, "ItemStyle", {
                get: function () {
                    return this.get(ListAdapter.DPItemStyle);
                },
                set: function (v) {
                    this.set(ListAdapter.DPItemStyle, v);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListAdapter.prototype, "Template", {
                get: function () {
                    return this.get(ListAdapter.DPTemplate);
                },
                set: function (v) {
                    this.set(ListAdapter.DPTemplate, v);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListAdapter.prototype, "Content", {
                get: function () { return this._content; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListAdapter.prototype, "SelectedChild", {
                get: function () { return this._selectedItem; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListAdapter.prototype, "SelectedItem", {
                get: function () { return this._selectedItem && this._selectedItem.getDataContext(); },
                set: function (v) {
                    this.SelectedIndex = this.Source && this.Source.IndexOf(v);
                },
                enumerable: true,
                configurable: true
            });
            ListAdapter.prototype.OnSelectedIndexChanged = function (_old, _new) {
                var x = this._content.getChild(_new);
                var lx = this._content.getChild(_old);
                var li = _old;
                if (lx)
                    lx.disapplyStyle(this.activateClass || 'active');
                if (x)
                    x.applyStyle(this.activateClass || 'active');
                this._selectedItem = x;
                if (_old !== _new) {
                    this.set(ListAdapter.DPSelectedItem, x && x.getDataContext());
                    this.riseItemSelectedEvent(this.SelectedIndex, x, li, lx);
                    return true;
                }
            };
            ListAdapter.prototype.riseItemSelectedEvent = function (ni, nc, oi, oc) {
                this.OnItemSelected.Invoke('', [this, ni, nc, oi, oc]);
                var v = nc && nc.View;
                if (v)
                    if (v.scrollIntoViewIfNeeded)
                        v.scrollIntoViewIfNeeded();
                    else
                        v.scrollIntoView();
            };
            ListAdapter.prototype.Select = function (t) {
                this.SelectedIndex = this._content.IndexOf(t);
            };
            ListAdapter.prototype.SelectItem = function (t) {
                var s = this.Source;
                if (s)
                    this.SelectedIndex = s.IndexOf(t);
            };
            ListAdapter._getTemplate = function (template) {
                switch (typeof template) {
                    case 'string':
                        return runtime_5.mvc.MvcDescriptor.Get(template);
                    case 'function':
                        return runtime_5.mvc.MvcDescriptor.GetByType(template).Default;
                    default:
                        if (template instanceof runtime_5.mvc.ITemplate)
                            return template;
                        var c = runtime_5.mvc.MvcDescriptor.GetByType(template);
                        return c ? c.Default : undefined;
                }
            };
            ListAdapter._getTemplateShadow = function (template) {
                if (template instanceof HTMLElement)
                    return template;
                var t = ListAdapter._getTemplate(template);
                return t == undefined ? document.createElement('div') : t.Create();
            };
            ListAdapter.ctor = function () {
                actions = [this.prototype.OnAdd, this.prototype.OnRemove, this.prototype.OnReplace, this.prototype.OnClear, this.prototype.Reset, this.prototype.OnSet];
            };
            ListAdapter.prototype.initTemplate = function (itemTemplate, getSourceFromScop) {
                var dom = this._view;
                var x = $('[db-content]', dom)[0] || dom;
                var attSI = $('[attach-SelectedItem]', dom)[0];
                if (attSI)
                    this.AttachSelectedItem(attSI);
                if (getSourceFromScop)
                    this.getSourceFromScop(x);
                this._content = new UI.DivControl(x);
                var itemStyle = dom.getAttribute('item-style') || x.getAttribute('item-style');
                if (itemStyle)
                    this.ItemStyle = itemStyle.split(' ');
                this.Template = Template.ToTemplate(itemTemplate || ListAdapter.getTemplate(x) || this._content.View.getAttribute('item-template') || dom.getAttribute('item-template'), true);
                this._content.Parent = this;
            };
            ListAdapter.getFirstChild = function (dom) {
                var f = dom.firstChild;
                var node;
                while (f) {
                    if (f instanceof Element)
                        return f;
                    if (!node && f instanceof Node)
                        node = f;
                    f = f.nextSibling;
                }
                return node;
            };
            ListAdapter.getTemplate = function (d) {
                var t = d.children;
                for (var i = 0, l = t.length; i < l; i++) {
                    var x = t[i];
                    if (utils_2.basic.polyfill.IsTemplate(x)) {
                        var w = ListAdapter.getFirstChild(x.content);
                        x.remove();
                        return w;
                    }
                }
            };
            ListAdapter.prototype.getSourceFromScop = function (x) {
                x.setAttribute('db-cmd', Corelib_5.ScopicCommand.Register({ Invoke: this.CmdExecuter, Owner: this }));
            };
            ListAdapter.prototype.CmdExecuter = function (n, d, s) {
                Corelib_5.ScopicCommand.Delete(n);
                this._scop = s;
                this.Source = s.Value;
                this.RlSourceScop = new Corelib_5.bind.TwoBind(Corelib_5.bind.BindingMode.TwoWay, s, this, Corelib_5.bind.Scop.DPValue, ListAdapter.DPSource);
                this.Source = s.Value;
            };
            ListAdapter.prototype.AttachSelectedItem = function (x) {
                x.setAttribute('db-cmd', Corelib_5.ScopicCommand.Register({ Invoke: this.CmdAttacheSelectedItemExecuter, Owner: this }));
            };
            ListAdapter.prototype.CmdAttacheSelectedItemExecuter = function (n, d, s) {
                Corelib_5.ScopicCommand.Delete(n);
                this.OnPropertyChanged(ListAdapter.DPSelectedIndex, function (s, e) {
                    this.s.Value = this.t.SelectedItem;
                }, { t: this, s: s });
            };
            ListAdapter.prototype.initialize = function () {
                var _this = this;
                var s = this.Source;
                this.Content.OnInitialized = function (n) { return _this.Reset(s ? new collections_3.utils.ListEventArgs(null, null, null, collections_3.collection.CollectionEvent.Reset, s.AsList()) : undefined); };
            };
            ListAdapter.prototype.OnSourceChanged = function (e) {
                if (this.Template)
                    actions[e.event].call(this, e);
            };
            ListAdapter.prototype.ReSelect = function () {
                var i = this.get(ListAdapter.DPSelectedIndex);
                var j = this.swap(i);
                if (!this.AcceptNullValue && j < 0 && this.Source && this.Source.Count > 0)
                    j = 0;
                if (i !== j) {
                    this.SelectedIndex = j;
                    return true;
                }
                return this.OnSelectedIndexChanged(i, j);
            };
            Object.defineProperty(ListAdapter.prototype, "Scop", {
                get: function () {
                    if (!this._scop) {
                        var pscop = _super.prototype.getScop.call(this);
                        if (pscop)
                            return pscop;
                        this._scop = new Corelib_5.bind.ValueScop(this.Source);
                        this._scop.setParent(this);
                        return this._scop;
                    }
                },
                enumerable: true,
                configurable: true
            });
            ListAdapter.prototype.BindTo = function (scop) {
                if (scop) {
                    scop.OnPropertyChanged(Corelib_5.bind.Scop.DPValue, this.OnScopValueChanged, this);
                    this.Source = scop.Value;
                }
            };
            ListAdapter.prototype.OnScopValueChanged = function (pb, e) {
                this.Source = e._new;
            };
            ListAdapter.prototype.OnItemClicked = function (s, e, t) {
                var e1 = { sender: this, Event: e, index: this.Source.IndexOf(s.getDataContext()), template: s };
                this.OnChildClicked.PInvok('', [e1], this);
                if (e1.Cancel)
                    return;
                t.Select(s);
            };
            ListAdapter.prototype.getItemShadow = function (item, i) {
                var ch = this.garbage.pop();
                if (!ch) {
                    var t = this.Template;
                    ch = t == null ? TemplateShadow.Create(item) : t.CreateShadow(item, undefined);
                }
                return ch;
            };
            ListAdapter.prototype.disposeItemShadow = function (item, child, i) {
                if (item instanceof Array && i == NaN && child == void 0) {
                    this.garbage.push.apply(this.garbage, this.CloneChildren());
                }
                else {
                    if (!child)
                        return;
                    this.garbage.push(child);
                    return child;
                }
            };
            ListAdapter.prototype.disposeItemsShadow = function (items, child) {
                this.garbage.push.apply(this.garbage, this.CloneChildren());
            };
            ListAdapter.prototype._insert = function (item, i) {
                var _this = this;
                this.count++;
                var ch = this.getItemShadow(item, i);
                var sc = ch.getScop();
                if (sc)
                    sc.setParent(this.Scop);
                ch.setDataContext(item);
                if (i)
                    this.Insert(ch, i);
                else
                    this.Add(ch);
                if (i == undefined)
                    i = this.Source.Count - 1;
                var h = ch.__events;
                if (h != undefined)
                    h.Dispose();
                ch.__events = [ch.addEventListener('click', this.OnItemClicked, this, this), ch.addEventListener('contextmenu', this.OnItemClicked, this, this)];
                var c = ch.View.classList;
                if (this.ItemStyle)
                    c.add.apply(c, this.ItemStyle);
                this.OnItemInserted.Invok('', function (f) { return f(_this, i, item, ch); });
                var r = this.ReSelect();
                if (!r && i == this.SelectedIndex)
                    this.riseItemSelectedEvent(i, ch, i, this._content.getChild(i));
            };
            ListAdapter.prototype._remove = function (item, i) {
                var _this = this;
                var ch = this.disposeItemShadow(item, this._content.getChild(i), i);
                var res = i === this.SelectedIndex;
                this.count--;
                ch.disapplyStyle(this.activateClass || 'active');
                this._content.RemoveAt(i, false);
                for (var _i = 0, _a = ch.__events; _i < _a.length; _i++) {
                    var h = _a[_i];
                    if (h != undefined)
                        h.Dispose();
                }
                ch.__events = undefined;
                var c = ch.View.classList;
                if (this.ItemStyle)
                    c.remove.apply(c, this.ItemStyle);
                this.OnItemRemoved.Invok('', function (f) { return f(_this, i, item, ch); });
                var r = this.ReSelect();
                if (!r && i == this.SelectedIndex)
                    this.riseItemSelectedEvent(i, this._content.getChild(i), i, ch);
            };
            ListAdapter.prototype.OnAdd = function (e) {
                this._insert(e.newItem, e.startIndex);
            };
            ListAdapter.prototype.OnSet = function (e) {
                var ch = this._content.getChild(e.startIndex);
                if (!ch)
                    return;
                ch.setDataContext(e.newItem);
            };
            ListAdapter.prototype.OnClear = function (e) {
                this.SelectedIndex = -1;
                this.disposeItemsShadow(e && e.collection, this.CloneChildren());
                if (e && e.collection && this.count > 0)
                    for (var i = e.collection.length - 1; i >= 0; i--)
                        this._remove(e.collection[i], i);
                this.count = 0;
            };
            ListAdapter.prototype.OnRemove = function (e) {
                this._remove(e.oldItem, e.startIndex);
            };
            ListAdapter.prototype.OnReplace = function (e) {
                this._content.getChild(e.startIndex).setDataContext(e.newItem);
            };
            ListAdapter.prototype.Reset = function (e) {
                var _this = this;
                var si = this.SelectedIndex;
                var c = this.Source;
                this.OnClear(e);
                if (c)
                    for (var i = 0, l = c.Count; i < l; i++)
                        this._insert(c.Get(i), i);
                runtime_5.thread.Dispatcher.call(this, function (si) { _this.SelectedIndex = si; }, si);
            };
            ListAdapter.prototype.clearGarbage = function () {
                for (var i = 0, l = this.garbage.length; i < l; i++)
                    this.garbage[i].Dispose();
                this.garbage.length = 0;
            };
            ListAdapter.prototype.Recycle = function () {
                this.Clear();
                this.clearGarbage();
                this.Reset();
            };
            ListAdapter.prototype.Dispose = function () {
                var h = this.OnDispose();
                if (h === null)
                    return;
                this.Source.Unlisten = this.sli;
                this.sli = null;
                this.clearGarbage();
                this._content.Dispose();
                this._content = null;
                _super.prototype.Dispose.call(this);
                if (!h)
                    this.DisposingStat = 2;
            };
            ListAdapter.prototype.Add = function (child) {
                this._content.Add(child);
                return this;
            };
            ListAdapter.prototype.AddRange = function (children) {
                this._content.AddRange(children);
                return this;
            };
            ListAdapter.prototype.Remove = function (child, dispose) {
                return this._content.Remove(child);
            };
            ListAdapter.prototype.RemoveAt = function (i, dispose) {
                return this._content.RemoveAt(i, dispose);
            };
            ListAdapter.prototype.Clear = function (dispose) {
                var c = this.Source;
                if (c) {
                    for (var i = this.Content.Count - 1; i >= 0; i--)
                        this._remove(c.Get(i), i);
                }
            };
            ListAdapter.prototype.Insert = function (c, i) {
                this._content.Insert(c, i);
                return this;
            };
            ListAdapter.prototype.CloneChildren = function () { return this._content.CloneChildren(); };
            ListAdapter.prototype.Check = function (c) {
                return c instanceof TemplateShadow;
            };
            ListAdapter.prototype.OnKeyDown = function (e) {
                if (e.keyCode == UI.Keys.Down)
                    this.SelectedIndex++;
                else if (e.keyCode == UI.Keys.Up)
                    this.SelectedIndex--;
                else if (e.keyCode == UI.Keys.End)
                    this.SelectedIndex = Number.MAX_VALUE;
                else if (e.keyCode == UI.Keys.Home)
                    this.SelectedIndex = -1;
                else
                    return false;
                e.preventDefault();
                e.stopPropagation();
                return true;
            };
            ListAdapter.DPSource = Corelib_5.bind.DObject.CreateField('Source', collections_3.collection.List, null, function (e) {
                var t = e.__this;
                if (e._old)
                    e._old.Unlisten = e.__this.sli;
                if (e._new)
                    e._new.Listen = e.__this.sli;
                if (t.IsInit)
                    t.Reset(e);
            }, function (e) { if (e.__this.IsInit)
                e.__this.Clear(); });
            ListAdapter.DPSelectedIndex = Corelib_5.bind.DObject.CreateField('SelectedIndex', Number, -2, function (e) { return e.__this.OnSelectedIndexChanged(e._old, e._new); }, ListAdapter.prototype.__checkSelectedIndex);
            ListAdapter.DPItemStyle = Corelib_5.bind.DObject.CreateField('ItemStyle', Array, undefined, function (e) {
                var t = e.__this._content;
                if (!t)
                    return;
                var n = e._new;
                var o = e._old;
                for (var i = 0, l = t.Count; i < l; i++) {
                    var c = t.getChild(i).View.classList;
                    if (o)
                        c.remove.apply(c, o);
                    if (n)
                        c.add.apply(c, n);
                }
            });
            ListAdapter.DPTemplate = Corelib_5.bind.DObject.CreateField('Template', Object, null, function (e) { return e.__this.Recycle(); }, function (e) {
                if (e._new)
                    if (typeof e._new.CreateShadow !== 'function')
                        e.IsValid = false;
            });
            ListAdapter.DPSelectedItem = Corelib_5.bind.DObject.CreateField("SelectedItem", Object);
            return ListAdapter;
        }(TControl));
        UI.ListAdapter = ListAdapter;
        var Spinner = (function (_super) {
            __extends(Spinner, _super);
            function Spinner(test) {
                var _this = _super.call(this, document.createElement('div')) || this;
                _this.isStarted = false;
                return _this;
            }
            Spinner.prototype.initialize = function () {
                this.container = document.createElement('div');
                this.circle = document.createElement('div');
                this.message = document.createElement('p');
                this.message.textContent = 'Wait';
                this.applyStyle('full-fixedlayout');
                this.container.classList.add('spinner');
                this.circle.classList.add('spinner-circle');
                this.message.classList.add('spinner-message');
                this.container.appendChild(this.circle);
                this.container.appendChild(this.message);
                this._view.appendChild(this.container);
            };
            Spinner.prototype.Start = function (logo) {
                var _this = this;
                this.OnInitialized = function (l) { return l.circle.classList.add('spinner-start'); };
                this.Parent = UI.Desktop.Current;
                this.OnInitialized = function (n) {
                    _this.Message = logo || 'Wait';
                    document.body.appendChild(_this.View);
                };
                this.isStarted = true;
            };
            Spinner.prototype.Pause = function () {
                if (this.isStarted) {
                    this.Parent = null;
                    this.circle.classList.remove('spinner-start');
                    document.body.removeChild(this.View);
                }
                this.isStarted = false;
            };
            Object.defineProperty(Spinner.prototype, "Message", {
                set: function (v) { this.message.textContent = v; },
                enumerable: true,
                configurable: true
            });
            Spinner.Default = new Spinner(undefined);
            return Spinner;
        }(UI.JControl));
        UI.Spinner = Spinner;
        var CostumizedShadow = (function (_super) {
            __extends(CostumizedShadow, _super);
            function CostumizedShadow(dom, data) {
                var _this = _super.call(this, dom) || this;
                _this.data = data;
                _this.setDataContext(_this.data);
                return _this;
            }
            CostumizedShadow.prototype.setDataContext = function (data) { this.data = data; this._view.textContent = this._view.label = data ? data.toString() : ""; };
            CostumizedShadow.prototype.getDataContext = function () { return this.data; };
            CostumizedShadow.prototype.initialize = function () {
                this.setDataContext(this.data);
            };
            CostumizedShadow.prototype.getScop = function () { return this.data instanceof Corelib_5.bind.Scop ? this.data : null; };
            return CostumizedShadow;
        }(TemplateShadow));
        UI.CostumizedShadow = CostumizedShadow;
        var help;
        (function (help) {
            function createHeader(hd, cols, orderBy) {
                for (var i = 0; i < cols.length; i++) {
                    var col = cols[i];
                    if (typeof col.Header === 'string')
                        col.Header = { Content: col.Header };
                    var b = generateCell(col.Header, 'th');
                    if (orderBy && col.Header && col.Header.OrderBy) {
                        var owner = {
                            handleEvent: function (e) {
                                this.method.Invoke.apply(this.method.Owner, [this.method.Owner, this.col.Header.OrderBy, this.col, this.view]);
                            }, method: orderBy, col: clone(col), view: b
                        };
                        b.addEventListener('click', owner);
                    }
                    hd.appendChild(b);
                }
                return hd;
            }
            help.createHeader = createHeader;
            function createTemplate(cols, tmp) {
                tmp = tmp || document.createElement('tr');
                for (var i = 0; i < cols.length; i++) {
                    var col = cols[i];
                    if (typeof col.Header === 'string')
                        col.Header = { Content: col.Header };
                    tmp.appendChild(generateCell(col.Cell, 'td'));
                }
                return tmp;
            }
            help.createTemplate = createTemplate;
            function generateCell(h, stype) {
                var type = HTMLTableCellElement;
                var hdr;
                if (h.Content == null)
                    h.Content = "";
                if (h.Content instanceof type) {
                    hdr = h.Content;
                }
                else if (h.Content instanceof Node) {
                    hdr = document.createElement(stype);
                    hdr.appendChild(h.Content);
                }
                else {
                    hdr = document.createElement(stype);
                    h.ContentAsHtml ? (hdr.innerHTML = String(h.Content)) : (hdr.innerText = String(h.Content));
                }
                if (h.Attributes)
                    applyAttrybute(hdr, h.Attributes);
                return hdr;
            }
            help.generateCell = generateCell;
            function applyAttrybute(hdr, h) {
                for (var n in h) {
                    var isb = false;
                    var o = h[n];
                    if (typeof o === 'object') {
                        if (hdr.hasAttribute(n)) {
                            var t = o.values.slice();
                            t.unshift(hdr.getAttribute(n));
                            hdr.setAttribute(n, t.join(o.spliter));
                        }
                        else
                            hdr.setAttribute(n, o.values.join(o.spliter));
                    }
                    else
                        hdr.setAttribute(n, o);
                }
            }
        })(help = UI.help || (UI.help = {}));
    })(UI = exports.UI || (exports.UI = {}));
    (function (UI) {
        var fisc;
        var tm;
        var lto = false;
        var isclosed = true;
        var to;
        var okd;
        var ofo;
        var _ithis;
        var list;
        var filtred;
        var sf = new Filters_1.filters.list.LStringFilter();
        var tmp = document.createElement('li');
        tmp.innerHTML = '<div db-job="tostring"></div>';
        var defTemplate = UI.Template.ToTemplate(tmp, true);
        var lt = Date.now();
        filtred = new collections_3.collection.ExList(null);
        filtred.Filter = sf;
        var pager = Filters_1.filters.list.indexdFilter(filtred, 15);
        function keyup() {
            list.SelectedIndex--;
            var sc = list.SelectedChild;
            if (sc)
                sc.View.scrollIntoView(false);
        }
        function keydown() {
            list.SelectedIndex++;
            var sc = list.SelectedChild;
            if (sc)
                sc.View.scrollIntoView(false);
        }
        function keyleft(e, acb) {
            list.SelectedIndex -= 4;
            var sc = list.SelectedChild;
            if (sc)
                sc.View.scrollIntoView(false);
        }
        function keyright(e, acb) {
            list.SelectedIndex += 4;
            var sc = list.SelectedChild;
            if (sc)
                sc.View.scrollIntoView(false);
        }
        function pageDown() {
            pager.next();
        }
        function pageUp() {
            pager.previouse();
        }
        function del(e) {
            if (!isclosed)
                return others(e);
            if (e.shiftKey) {
                _ithis.Value = null;
                Close(true);
            }
        }
        function enter() {
            if (isclosed)
                return;
            fisc = false;
            return Close(true);
        }
        function esc() { fisc = false; Close(false); }
        function isControlKey(k) {
            if (k === 8)
                return false;
            return k < 32 || (k > 126 && k < 160);
        }
        function others(e) {
            if (isControlKey(e.keyCode))
                return;
            var lt = tm;
            var nt = Date.now();
            if (lto)
                return;
            setTimeout(function () {
                runtime_5.helper.TryCatch(filtred, function (filters) { this.Filter.Patent = new filters.list.StringPatent(_ithis.Box.Text || ''); }, null, [Filters_1.filters]);
                lto = false;
                pager.update();
            }, 200);
            lto = true;
        }
        function initPopup() {
            var ex = document.createElement('ul');
            ex.classList.add('popup', 'ihide');
            list = new UI.ListAdapter(ex, defTemplate);
            list.OnInitialized = function (list) { return list.Source = pager.List; };
            list.Parent = UI.Desktop.Current;
            document.body.appendChild(list.View);
        }
        initPopup();
        list.OnItemSelected.On = function (s, i, t) {
            if (i == -1)
                return;
            fisc = true;
            runtime_5.thread.Dispatcher.call(_ithis.Box.View, _ithis.Box.View.focus);
        };
        list.Content.addEventListener('click', function (s, e, p) {
            fisc = true;
            if (lt - (lt = Date.now()) < -500)
                return;
            else
                lt = 0;
            _ithis.Value = list.SelectedItem || _ithis.Value;
            fisc = false;
            Close(false);
        }, list);
        list.Content.View.addEventListener('pointerenter', function () { return clearTimeout(to); });
        list.Content.View.onmouseleave = function (e) { if (!fisc)
            to = setTimeout(Close, 500, e); fisc = false; };
        var fns = {
            40: keydown,
            38: keyup,
            37: keyleft,
            39: keyright,
            13: enter,
            27: esc,
            33: pageUp,
            34: pageDown,
        };
        function Init(acb) {
            clearTimeout(to);
            UI.Desktop.Current.GetKeyControl(null, _onkeydown, [acb]);
            if (_ithis !== acb)
                resetEvents(acb);
        }
        UI.Init = Init;
        function resetEvents(acb) {
            acb.IsChanged = false;
            _ithis = acb;
            filtred.Source = acb.DataSource;
            runtime_5.thread.Dispatcher.call(null, function () { filtred.Filter.Patent = new Filters_1.filters.list.StringPatent(acb.Box.Text); });
            if (okd)
                okd.Dispose();
            if (ofo)
                ofo.Dispose();
            tm = Date.now();
            lto = false;
            UI.Desktop.Current.GetKeyControl(null, _onkeydown, [acb]);
            ofo = _ithis.Box.addEventListener('focusout', onfocusout, null);
        }
        function relocate(acb) {
            var l = list.View;
            var v = acb.View.getBoundingClientRect();
            l.style.left = v.left + "px";
            l.style.top = v.top + v.height + "px";
            l.style.width = v.width + "px";
        }
        function onfocusout(s, e, acb) {
            clearTimeout(to);
            to = setTimeout(focusOutImediate, 500, false);
            fisc = false;
        }
        function focusOutImediate(valid) {
            UI.Desktop.Current.ReleaseKeyControl();
            Close(valid);
        }
        function _onkeydown(e, acb) {
            relocate(acb);
            var kc = e.keyCode;
            if (isclosed)
                if (kc === 9 || kc === 13)
                    return acb.View.hasAttribute('handleClose') ? UI.KeyboardControllerResult.Handled : UI.KeyboardControllerResult.Release || UI.KeyboardControllerResult.ByPass;
                else if (kc === 27) {
                    acb.View.blur();
                    return UI.KeyboardControllerResult.Release;
                }
                else if (kc === UI.Keys.Delete)
                    return del(e);
                else if (isControlKey(kc))
                    return UI.KeyboardControllerResult.Handled;
                else
                    return Open(acb, true);
            else if (kc == 9) {
                fisc = false;
                Close(false);
                return UI.KeyboardControllerResult.Release;
            }
            return (fns[e.keyCode] || others)(e, acb) || UI.KeyboardControllerResult.Handled;
        }
        function Open(acb, forceOpen) {
            Init(acb);
            if (acb.AutoPopup || forceOpen) {
                isclosed = false;
                list.Template = acb.Template || defTemplate;
                try {
                    list.SelectedIndex = 0;
                }
                catch (e) {
                }
                var l = list.View;
                l.classList.remove('ihide');
                relocate(acb);
            }
            return UI.KeyboardControllerResult.Handled;
        }
        function Close(valid) {
            if (fisc) {
                fisc = false;
                return;
            }
            isclosed = true;
            list.applyStyle('ihide');
            if (valid == true)
                _ithis.Value = list.SelectedItem;
            if (valid) {
                _ithis.Box.Text = (_ithis.Value || '').toString();
            }
            else {
                if (_ithis.Value != null)
                    _ithis.Box.Text = _ithis.Value.toString();
                else {
                    _ithis.Box.Text = "";
                }
            }
            return _ithis.View.hasAttribute('handleClose') ? UI.KeyboardControllerResult.Handled : UI.KeyboardControllerResult.ByPass;
        }
        var ProxyAutoCompleteBox = (function () {
            function ProxyAutoCompleteBox(Box, source) {
                this.Box = Box;
                this.callback = [];
                Box.View.setAttribute('autocomplete', 'off');
                this.DataSource = source;
            }
            ProxyAutoCompleteBox.prototype.Blur = function () {
                this.Box.Blur();
            };
            ProxyAutoCompleteBox.prototype.OnValueChanged = function (owner, invoke) {
                this.callback.push({ Invoke: invoke, Owner: owner });
            };
            Object.defineProperty(ProxyAutoCompleteBox.prototype, "View", {
                get: function () { return this.Box.View; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ProxyAutoCompleteBox.prototype, "Value", {
                get: function () { return this._value; },
                set: function (v) {
                    var ov = this._value;
                    if (v == ov)
                        return;
                    this._value = v;
                    this.Box.Text = v ? v.toString() : '';
                    for (var _i = 0, _a = this.callback; _i < _a.length; _i++) {
                        var t = _a[_i];
                        t.Invoke.call(t.Owner, this, ov, v);
                    }
                },
                enumerable: true,
                configurable: true
            });
            ProxyAutoCompleteBox.prototype.initialize = function () {
                var _this = this;
                this.Box.View.addEventListener('focusin', function (e) { return Init(_this); });
                return this;
            };
            return ProxyAutoCompleteBox;
        }());
        UI.ProxyAutoCompleteBox = ProxyAutoCompleteBox;
    })(UI = exports.UI || (exports.UI = {}));
    var init;
    (function (init) {
        var layout = [];
        function x() { }
        function RegisterLayout(View, classList, remove) {
            if (runtime_5.thread.Dispatcher.InIdle())
                runtime_5.thread.Dispatcher.call(null, x);
            layout.push({ A: View, B: classList, C: remove });
        }
        init.RegisterLayout = RegisterLayout;
        function apply() {
            var layout1 = layout.splice(0);
            for (var i = 0; i < layout1.length; i++) {
                var l = layout1[i];
                if (l.C)
                    l.A.classList.remove.apply(l.A.classList, l.B);
                else
                    l.A.classList.add.apply(l.A.classList, l.B);
            }
            if (layout.length !== 0)
                apply();
        }
        runtime_5.thread.Dispatcher.OnIdle(null, apply);
        function loadCss(callback, onerror) {
        }
        init.loadCss = loadCss;
        function for_each(e) {
            var x = new UI.ListAdapter(e.dom, undefined, e.parentScop);
            x.BindTo(e.currentScop);
            e.Result = x;
            return x;
        }
        Corelib_5.ScopicControl.register('list-view', for_each);
    })(init || (init = {}));
});
define("sys/Corelib", ["require", "exports", "sys/Syntaxer", "sys/runtime"], function (require, exports, Syntaxer_1, runtime_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var _internal;
    function checkAccess(e) {
        if (!_internal)
            if ((this._bindingMode & 2) === 2)
                e.IsValid = true;
            else
                e.IsValid = false;
        _internal = false;
    }
    function _OnValueChanged_(e) { return this._OnValueChanged(e); }
    var __corelib__;
    (function (__corelib__) {
        var plg_template = require('plugin|template');
        if (plg_template)
            plg_template.addEventListener(ModuleStat.Executed, function (e) { return runtime_6.mvc.Initializer.Register(e); }, null);
        function $defineProperty(o, p, attributes, onError) {
            return runtime_6.helper.TryCatch(Object, Object.defineProperty, onError, [o, p, attributes]) || false;
        }
        __corelib__.$defineProperty = $defineProperty;
        function setProperty(type, p) {
            $defineProperty(type.prototype, p.Name, {
                get: function () { return this.get(p); },
                set: function (v) { this.set(p, v); },
                configurable: false,
                enumerable: false
            });
        }
        __corelib__.setProperty = setProperty;
        (function (constructor) {
            if (constructor &&
                constructor.prototype && !('childElementCount' in constructor.prototype)) {
                Object.defineProperty(constructor.prototype, 'childElementCount', {
                    get: function () {
                        var i = 0, count = 0, node, nodes = this.childNodes;
                        while (node = nodes[i++]) {
                            if (node.nodeType === 1)
                                count++;
                        }
                        return count;
                    }
                });
            }
        })(window.Node || window.Element);
        __corelib__.max = 9223372036854775807;
    })(__corelib__ || (__corelib__ = {}));
    var vars;
    (function (vars) {
        vars._c = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
        vars._cnts = [7, 11, 15, 19, 32];
        vars.names_scop_fromIn = false;
    })(vars || (vars = {}));
    var internal;
    (function (internal) {
        var __data = (function () {
            function __data(name, event, delegate) {
                this.name = name;
                this.event = event;
                this.delegate = delegate;
            }
            return __data;
        }());
        internal.__data = __data;
    })(internal || (internal = {}));
    var bind;
    (function (bind) {
        var _store = new Map();
        function getOrCreate(k) {
            var v = _store.get(k);
            if (typeof v === 'undefined')
                _store.set(k, v = []);
            return v;
        }
        function setDPValue(target, name, dpprop) {
            Object.defineProperty(target, name, { value: dpprop, configurable: false, enumerable: false, writable: false });
        }
        function property(type, defaultValue, Name, changed, check, attribute, StaticName, override) {
            return function (target, propertyKey, descriptor) {
                if (!runtime_6.reflection.IsPrototype(target))
                    throw 'Invalid Implimentation of property Attribute';
                var x = getOrCreate(target.constructor);
                var y = bind.DObject.CreateField(Name || propertyKey, type, defaultValue, changed, check, attribute);
                if (StaticName === void 0)
                    StaticName = "DP" + (Name || propertyKey);
                if (StaticName)
                    setDPValue(target.constructor, StaticName, y);
                y.Override = override;
                x.push(y);
                type = void 0;
                defaultValue = void 0;
                changed = void 0;
                check = void 0;
            };
        }
        bind.property = property;
        function property1(type, options) {
            return function (target, propertyKey, descriptor) {
                if (!runtime_6.reflection.IsPrototype(target))
                    throw 'Invalid Implimentation of property Attribute';
                if (!options)
                    options = {};
                var x = getOrCreate(target.constructor);
                var y = bind.DObject.CreateField(options.Name || propertyKey, type, options.defaultValue, options.changed, options.check, options.attribute);
                setDPValue(target.constructor, options.StaticName || ("DP" + (options.Name || propertyKey)), y);
                y.Override = options.override;
                x.push(y);
                options = void 0;
            };
        }
        bind.property1 = property1;
        function getProperties(type) {
            type = runtime_6.reflection.IsClass(type) ? type : type.constructor;
            return getOrCreate(type);
        }
        bind.getProperties = getProperties;
        function Delete(type) {
            return _store.delete(type);
        }
        bind.Delete = Delete;
    })(bind = exports.bind || (exports.bind = {}));
    (function (bind) {
        var jobs = {};
        var Job = (function () {
            function Job(Name, Todo, Check, OnError, OnInitialize, OnScopDisposing) {
                this.Name = Name;
                this.Todo = Todo;
                this.Check = Check;
                this.OnError = OnError;
                this.OnInitialize = OnInitialize;
                this.OnScopDisposing = OnScopDisposing;
                jobs[Name] = this;
            }
            return Job;
        }());
        bind.Job = Job;
        var Jobs = (function () {
            function Jobs(Name) {
                this.Name = Name;
                jobs[Name] = this;
            }
            Jobs.prototype.Todo = function (job, e) {
            };
            Jobs.prototype.Check = function (job, e) {
            };
            Jobs.prototype.OnError = function (job, e) { };
            Jobs.prototype.OnInitialize = function (job, e) { };
            Jobs.prototype.OnScopDisposing = function (job, e) {
            };
            Jobs.prototype.push = function (jobName) {
            };
            return Jobs;
        }());
        bind.Jobs = Jobs;
        var JobInstance = (function () {
            function JobInstance(Scop, job, dom) {
                this.Scop = Scop;
                this.job = job;
                this.dom = dom;
                this._events = [];
                this._store = {};
                this.propb = Scop.OnPropertyChanged(bind.Scop.DPValue, this.ValueChanged, this);
            }
            JobInstance.prototype.addEventListener = function (name, event, delegate) {
                this._events.push(new internal.__data(name, event, delegate));
                this.dom.addEventListener(event, delegate);
            };
            JobInstance.prototype.removeEventListener = function (name) {
                var t = this._events;
                for (var i = t.length - 1; i >= 0; i--) {
                    var d = t[i];
                    if (d.name == name) {
                        this.dom.removeEventListener(d.event, d.delegate);
                        t.splice(i, 1);
                        return;
                    }
                }
            };
            JobInstance.prototype.getEvent = function (name) {
                var t = this._events;
                for (var i = t.length; i >= 0; i--) {
                    var d = t[i];
                    if (d.name == name)
                        return d.delegate;
                }
                return null;
            };
            JobInstance.prototype.ValueChanged = function (s, e) {
                runtime_6.PaintThread.Push(this, e, s);
            };
            JobInstance.prototype.Dispose = function () {
                var dx = this.job.OnScopDisposing;
                if (dx != null)
                    dx(this, null);
                var t = this._events;
                for (var i = t.length - 1; i >= 0; i--) {
                    var d = t[i];
                    this.dom.removeEventListener(d.event, d.delegate);
                    t[i] = null;
                }
                this._events.splice(0);
                this._events = null;
                this._store = null;
                this.Checker = null;
                this.dom = null;
                this.Handle = null;
                this.job = null;
                this.Scop.removeEvent(bind.Scop.DPValue, this.propb);
                this.Scop = null;
                this.propb.Dispose();
                this.propb = null;
                this.IsDisposed = true;
            };
            JobInstance.prototype.addValue = function (name, value) {
                this._store[name] = value;
            };
            JobInstance.prototype.getValue = function (name) {
                return this._store[name];
            };
            JobInstance.prototype.handleEvent = function (e) {
                if (this.Handle)
                    this.Handle(this, e);
            };
            return JobInstance;
        }());
        bind.JobInstance = JobInstance;
        function GetJob(name) {
            var l = jobs[name];
            if (l == null)
                return Register(new Job(name, null, null, null, null, null));
            return l;
        }
        bind.GetJob = GetJob;
        ;
        function Register(job, override) {
            var l = jobs[job.Name];
            if (l != null)
                if (override) {
                    jobs[job.Name] = job;
                    return job;
                }
                else
                    return l;
            else
                return jobs[job.Name] = job;
        }
        bind.Register = Register;
        ;
    })(bind = exports.bind || (exports.bind = {}));
    (function (bind) {
        var DProperty = (function () {
            function DProperty(Attribute, Name, Type, DefaultValue, Changed, Check) {
                this.Attribute = Attribute;
                this.Name = Name;
                this.Type = Type;
                this.DefaultValue = DefaultValue;
                this.Changed = Changed;
                this.Check = Check;
                if (Type instanceof runtime_6.reflection.GenericType)
                    this.GType = Type;
                this.RedifineChecker();
            }
            DProperty.prototype.setCostumChecker = function (c) {
                this.checkType = c;
                return this;
            };
            DProperty.prototype.AsOverride = function () { this.Override = true; return this; };
            DProperty.prototype.AsVirtual = function () { this.Virtual = true; };
            Object.defineProperty(DProperty.prototype, "IsKey", {
                get: function () {
                    return (this.Attribute & PropertyAttribute.IsKey) === PropertyAttribute.IsKey;
                },
                enumerable: true,
                configurable: true
            });
            DProperty.prototype.RedifineChecker = function () {
                switch (this.Type) {
                    case runtime_6.reflection.GenericType:
                        this.checkType = this.isGenerictype;
                        break;
                    case Object:
                        this.checkType = DProperty.isObject;
                        break;
                    case String:
                        this.checkType = DProperty.isString;
                        break;
                    case Number:
                        this.checkType = DProperty.isNumber;
                        break;
                    case Boolean:
                        this.checkType = DProperty.isBoolean;
                        break;
                    case runtime_6.reflection.DelayedType:
                        break;
                    default:
                        if (this.Type.constructor == runtime_6.reflection.DelayedType)
                            break;
                        else if (this.Type.constructor === runtime_6.reflection.GenericType)
                            this.checkType = this.isGenerictype;
                        else
                            this.checkType = this._checkType;
                        break;
                }
            };
            DProperty.prototype.checkType = function (val) {
                var t = this.Type;
                this.Type = t.Type;
                if (this.Type instanceof runtime_6.reflection.GenericType)
                    this.GType = this.Type;
                this.RedifineChecker();
                return this.checkType(val);
            };
            DProperty.prototype._checkType = function (val) {
                return val instanceof this.Type;
            };
            DProperty.prototype.isGenerictype = function (val) {
                return val instanceof this.Type.Constructor;
            };
            DProperty.isObject = function (val) {
                return true;
            };
            DProperty.isString = function (val) {
                return typeof val == 'string';
            };
            DProperty.isNumber = function (val) {
                return typeof val == 'number';
            };
            DProperty.isBoolean = function (val) {
                return typeof val == 'boolean';
            };
            return DProperty;
        }());
        bind.DProperty = DProperty;
        var _events = [];
        var EventArgs = (function () {
            function EventArgs() {
                this.IsValid = true;
            }
            EventArgs.New = function (prop, ithis, _old, _new) {
                var _this = _events.length == 0 ? new EventArgs() : _events.pop();
                _this.prop = prop;
                _this.__this = ithis;
                _this._new = _new;
                _this._old = _old;
                _this.IsValid = true;
                return _this;
            };
            EventArgs.prototype.Dispose = function () {
                _events.push(this);
            };
            return EventArgs;
        }());
        bind.EventArgs = EventArgs;
        var Ref = (function () {
            function Ref() {
            }
            Object.defineProperty(Ref.prototype, "key", {
                get: function () {
                    return this._key;
                },
                set: function (v) {
                    this._key = v;
                },
                enumerable: true,
                configurable: true
            });
            return Ref;
        }());
        bind.Ref = Ref;
        var EventListener = (function () {
            function EventListener(key, isSingliton) {
                this._deleagtes = [];
                this.key = new Object();
                this.locks = [];
                this.lock = false;
                this.key = key;
                this.isSingliton = isSingliton === true;
            }
            Object.defineProperty(EventListener.prototype, "On", {
                set: function (delegate) {
                    this._deleagtes.push(delegate);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EventListener.prototype, "Off", {
                set: function (delegate) {
                    if (this.lock) {
                        this.locks.push(delegate);
                        return;
                    }
                    var i = this._deleagtes.indexOf(delegate);
                    if (i == -1)
                        return;
                    this._deleagtes.splice(i, 1);
                },
                enumerable: true,
                configurable: true
            });
            EventListener.prototype.Invoke = function (key, params) {
                if (key != this.key || l <= 0)
                    return;
                this.lock = true;
                var locks = this.locks;
                if (this.isSingliton) {
                    while (this._deleagtes.length > 0)
                        runtime_6.helper.TryCatch(this, this._deleagtes.shift(), void 0, params);
                    this.locks.length = 0;
                }
                else {
                    for (var i = 0, l = this._deleagtes.length; i < l; i++)
                        runtime_6.helper.TryCatch(this, this._deleagtes[i], void 0, params);
                    this.lock = false;
                    while (locks.length > 0)
                        this.Off = this.locks.pop();
                }
                this.lock = false;
            };
            EventListener.prototype.Invok = function (key, callBack) {
                if (key != this.key || l <= 0)
                    return;
                var lr;
                this.lock = true;
                var x = new Array(1);
                if (this.isSingliton) {
                    while (this._deleagtes.length > 0)
                        x[0] = this._deleagtes.shift(), runtime_6.helper.TryCatch(this, callBack, void 0, x);
                    this.locks.length = 0;
                }
                else {
                    for (var i = 0, l = this._deleagtes.length; i < l; i++)
                        x[0] = this._deleagtes[i], runtime_6.helper.TryCatch(this, callBack, void 0, x);
                    this.lock = false;
                    while (this.locks.length > 0)
                        this.Off = this.locks.pop();
                }
                this.lock = false;
                return lr;
            };
            EventListener.prototype.PInvok = function (key, params, owner) {
                var l = this._deleagtes.length;
                if (key != this.key || l <= 0)
                    return;
                var dlg = this._deleagtes.slice();
                var lr;
                if (this.isSingliton)
                    this._deleagtes.length = 0;
                for (var i = 0; i < l; i++)
                    lr = runtime_6.helper.TryCatch(owner, dlg[i], void 0, params);
                this.locks.length = 0;
                return lr;
            };
            EventListener.prototype.Add = function (delegate, key) {
                if (this._store == null)
                    this._store = [];
                if (key !== undefined)
                    this._store[key] = delegate;
                this._deleagtes.push(delegate);
            };
            EventListener.prototype.Remove = function (key) {
                if (this._store) {
                    var d = this._store[key];
                    delete this._store[key];
                    this.Off = d;
                }
            };
            EventListener.prototype.Dispose = function () {
                this.key = null;
                this.locks.length = 0;
                this.locks = null;
                if (this._store) {
                    this._store.length = 0;
                    this._store = null;
                }
                this._deleagtes.length = 0;
                this._deleagtes = null;
            };
            return EventListener;
        }());
        bind.EventListener = EventListener;
        var FEventListener = (function () {
            function FEventListener(key, isSingliton) {
                this._deleagtes = [];
                this.key = new Object();
                this.currentIndex = -1;
                this.key = key;
                this.isSingliton = isSingliton === true;
            }
            Object.defineProperty(FEventListener.prototype, "On", {
                set: function (delegate) {
                    this._deleagtes.push(delegate);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FEventListener.prototype, "Off", {
                set: function (delegate) {
                    var i = this._deleagtes.indexOf(delegate);
                    if (i == -1)
                        return;
                    this._deleagtes.splice(i, 1);
                    if (this.currentIndex != -1)
                        if (i <= this.currentIndex)
                            this.currentIndex--;
                },
                enumerable: true,
                configurable: true
            });
            FEventListener.prototype.PInvok = function (key, params, owner) {
                if (this.currentIndex != -1)
                    throw "";
                var l = this._deleagtes.length;
                if (key != this.key || l <= 0)
                    return;
                var dlg = this._deleagtes.slice();
                var lr;
                for (this.currentIndex = 0; this.currentIndex < this._deleagtes.length; this.currentIndex++) {
                    var fn = dlg[this.currentIndex];
                    var crnt;
                    if (fn && typeof fn !== 'function')
                        crnt = fn.Owner, fn = fn.Invoke;
                    lr = runtime_6.helper.TryCatch(crnt || owner, fn, void 0, params);
                }
                if (this.isSingliton)
                    this._deleagtes.length = 0;
                this.currentIndex = -1;
                return lr;
            };
            FEventListener.prototype.Add = function (delegate, key) {
                if (this._store == null)
                    this._store = [];
                if (key != undefined)
                    this._store[key] = delegate;
                this._deleagtes.push(delegate);
            };
            FEventListener.prototype.Remove = function (key) {
                if (this._store) {
                    var d = this._store[key];
                    delete this._store[key];
                    this.Off = d;
                }
            };
            FEventListener.prototype.Dispose = function () {
                this.key = null;
                if (this._store) {
                    this._store.length = 0;
                    this._store = null;
                }
                this._deleagtes.length = 0;
                this._deleagtes = null;
            };
            return FEventListener;
        }());
        bind.FEventListener = FEventListener;
        var PropBinding = (function () {
            function PropBinding(Invoke, Owner) {
                this.Invoke = Invoke;
                this.Owner = Owner;
            }
            PropBinding.prototype.handleEvent = function (e) {
                if (this._isIvnoked)
                    return;
                if (this.Invoke == null)
                    return true;
                this._isIvnoked = true;
                runtime_6.helper.TryCatch(this.Owner || e.__this, this.Invoke, void 0, [this, e]);
                this._isIvnoked = false;
            };
            PropBinding.prototype.Dispose = function () {
                this.Owner = null;
                this.Invoke = null;
            };
            return PropBinding;
        }());
        bind.PropBinding = PropBinding;
        var PropertyStore = (function () {
            function PropertyStore(Value) {
                this.Value = Value;
            }
            Object.defineProperty(PropertyStore.prototype, "InsBindings", {
                get: function () { if (this._bindings === undefined)
                    this._bindings = []; return this._bindings; },
                enumerable: true,
                configurable: true
            });
            PropertyStore.prototype.Dispose = function () {
                this.Value = null;
                if (this._bindings) {
                    for (var i = this._bindings.length - 1; i >= 0; i--)
                        this._bindings[i].Dispose();
                    this._bindings.length = 0;
                    this._bindings = null;
                }
            };
            return PropertyStore;
        }());
        bind.PropertyStore = PropertyStore;
        var PropertyAttribute;
        (function (PropertyAttribute) {
            PropertyAttribute[PropertyAttribute["NonSerializable"] = 2] = "NonSerializable";
            PropertyAttribute[PropertyAttribute["Private"] = 4] = "Private";
            PropertyAttribute[PropertyAttribute["SerializeAsId"] = 8] = "SerializeAsId";
            PropertyAttribute[PropertyAttribute["IsKey"] = 16] = "IsKey";
            PropertyAttribute[PropertyAttribute["Optional"] = 32] = "Optional";
        })(PropertyAttribute = bind.PropertyAttribute || (bind.PropertyAttribute = {}));
        var TypesMap = (function () {
            function TypesMap(Base) {
                this.Base = Base;
                this.Fields = [];
                this.Fields = Base ? Base.Fields.slice(0) : [];
                this.dic = Base ? clone(Base.dic) : {};
            }
            Object.defineProperty(TypesMap.prototype, "length", {
                get: function () { return this.Fields.length; },
                enumerable: true,
                configurable: true
            });
            TypesMap.prototype.GetField = function (name) {
                var f;
                if (this.Base) {
                    f = this.Base.GetField(name);
                    if (f)
                        return f;
                }
                for (var i = 0; i < this.Fields.length; i++)
                    if ((f = this.Fields[i]).Name == name)
                        return f;
            };
            TypesMap.prototype.add = function (otype, dp) {
                var bdp = this.dic[dp.Name];
                if (dp.Override && bdp) {
                    if (!bdp.Virtual)
                        throw "You cannot override sealed property";
                    if (dp.Check === undefined)
                        dp.Check = bdp.Check;
                    if (!dp.Changed === undefined)
                        dp.Changed = bdp.Changed;
                    if (dp.Virtual === undefined)
                        dp.Virtual = true;
                    dp.Base = bdp;
                    this.Fields[dp.Index = bdp.Index] = dp;
                }
                else {
                    dp.Index = this.Fields.length;
                    this.Fields.push(dp);
                }
                this.dic[dp.Name] = dp;
                if (!(dp.Type instanceof runtime_6.reflection.DelayedType))
                    Object.freeze(dp);
                if (!otype.prototype.hasOwnProperty(dp.Name))
                    __corelib__.setProperty(otype, dp);
            };
            return TypesMap;
        }());
        var DObject = (function () {
            function DObject() {
                this.store = [];
                this._propertyChanged = [];
                DObject.register(this.constructor);
            }
            DObject.prototype.GetType = function () { return this.constructor; };
            DObject.__fields__ = function () { return []; };
            DObject.__attributes__ = function () {
            };
            Object.defineProperty(DObject, "isOpen", {
                get: function () {
                    return this._isOpen;
                },
                enumerable: true,
                configurable: true
            });
            DObject.GetProperty = function (type, name) {
                var id = DObject.getId(type);
                var s = DObject._dpStore[id];
                var f = s.Fields;
                for (var i = f.length - 1; i >= 0; i--) {
                    var p = f[i];
                    if (p.Name == name)
                        return p;
                }
            };
            DObject.GetDPropertyAt = function (type, index) {
                var map = DObject.register(type);
                return map.Fields[index];
            };
            DObject.prototype.GetProperty = function (name) {
                var types = runtime_6.reflection.GetBaseTypes(this.constructor, DObject);
                for (var j = 0; j < types.length; j++) {
                    var id = DObject.getId(types[j]);
                    var tm = DObject._dpStore[id];
                    if (tm) {
                        for (var i = tm.Fields.length - 1; i >= 0; i--) {
                            if (tm.Fields[i].Name == name) {
                                return tm.Fields[i];
                            }
                        }
                    }
                }
                return null;
            };
            DObject.prototype.ToJson = function (_context, indexer) {
                indexer = indexer == undefined ? _context.getJson(this) : indexer;
                indexer.valid = true;
                var json = indexer.json;
                for (var tm = DObject._dpStore[DObject.getId(this.constructor)].Fields, j = 0, l = tm.length; j < l; j++) {
                    var prop = tm[j];
                    if ((prop.Attribute & 2) === 2)
                        continue;
                    var v = this.get(prop);
                    if ((prop.Attribute & 8) == 8)
                        if (v && v.Id) {
                            json[prop.Name] = v.Id;
                            continue;
                        }
                        else
                            continue;
                    json[prop.Name] = _context.ToJson(v);
                }
                return json;
            };
            DObject.prototype.FromJson = function (json, context, update) {
                if (json == null)
                    return this;
                var ref = json['@ref'];
                delete json['@ref'];
                if (ref)
                    context.set(ref.__ref__, this);
                update = update || false;
                for (var tm = DObject._dpStore[DObject.getId(this.constructor)].Fields, j = 0, l = tm.length; j < l; j++) {
                    var prop = tm[j];
                    if ((prop.Attribute & 4) === 4)
                        continue;
                    var val = json[prop.Name];
                    if (val === undefined)
                        continue;
                    context.FromJson(val, prop.Type, new bind.Path(this, prop));
                }
                return this;
            };
            DObject.IsClass = function (x) {
                if (typeof x == "function") {
                    if (x == DObject.IsClass.constructor)
                        return false;
                    return true;
                }
                return false;
            };
            DObject.CreateField = function (name, type, defaultValue, changed, check, attribute) {
                if (type == null)
                    type = Object;
                return new DProperty(attribute, name, type, defaultValue, changed, check);
            };
            DObject.getId = function (type) {
                if (type.hasOwnProperty("__id__"))
                    return type.__id__;
                var val = ++DObject.typeCount;
                __corelib__.$defineProperty(type, "__id__", {
                    value: val, writable: false, configurable: false, enumerable: false
                });
                return val;
            };
            DObject._buildProperty = function (obj, propName) {
                var v = obj[propName];
                if (v != null)
                    var t = v.constructor;
                else
                    t = Object;
                return bind.DObject.CreateField(propName, t, v);
            };
            DObject.prototype.IsPropertiesChanged = function (m) {
                if (!m)
                    return true;
                var t = m.values;
                var x = this.store;
                var c;
                for (var i = 0; i < x.length; i++)
                    if (c = x[i])
                        if (c.Value !== t[i])
                            return true;
                return false;
            };
            DObject.ToDObject = function (obj, props) {
                if (obj instanceof this || obj.hasOwnProperty("__id__"))
                    return obj;
                var type = obj.getType instanceof Function ? obj.getType() : obj.constructor;
                if (!type.hasOwnProperty("__id__"))
                    __corelib__.$defineProperty(type, "__id__", {
                        value: -1, writable: false, configurable: false, enumerable: false
                    });
                else if (type !== -1)
                    throw "Invalid type";
                var flds = new Array(props.length);
                for (var i = 0; i < props.length; i++) {
                    var dp = flds[i] = this._buildProperty(obj, props[i]);
                    dp.Index = i;
                    __corelib__.setProperty(obj, dp);
                }
            };
            DObject.register = function (type) {
                var id = DObject.getId(type);
                var x = DObject._dpStore[id];
                if (x != null)
                    return x;
                var c = runtime_6.reflection.GetBaseTypes(typeof (type) === 'function' ? type : type.constructor, DObject);
                var u, lu;
                for (var i = c.length - 1; i >= 0; i--) {
                    var bc = c[i];
                    var id = DObject.getId(bc);
                    u = DObject._dpStore[id];
                    if (u == null) {
                        if (bc.hasOwnProperty('ctor'))
                            bc.ctor();
                        if (bc.hasOwnProperty('_ctor'))
                            bc._ctor();
                        if (bc.hasOwnProperty('__fields__'))
                            var nld = bc["__fields__"];
                        else
                            nld = null;
                        DObject._isOpen = true;
                        u = new TypesMap(lu);
                        var cnt = lu ? lu.length : 0;
                        var uf = nld ? bc["__fields__"]() : [];
                        uf.push.apply(uf, bind.getProperties(bc));
                        for (var j = 0; j < uf.length; j++)
                            u.add(bc, uf[j]);
                        bind.Delete(bc);
                        DObject._isOpen = false;
                        DObject._dpStore[id] = u;
                        Object.freeze(u);
                    }
                    lu = u;
                }
                return DObject._dpStore[id];
            };
            DObject.prototype.getType = function () {
                return this.constructor;
            };
            DObject.getFieldsCount = function () {
                return this.register(this).Fields.length;
            };
            DObject.getFields = function (type) {
                return this.register(type || this).Fields;
            };
            DObject.prototype.set = function (prop, value, keepEvent) {
                if (this._isFrozen)
                    return;
                if (prop.Virtual)
                    prop = DObject._dpStore[this.constructor.__id__].Fields[prop.Index];
                var ps = this.store[prop.Index] || (this.store[prop.Index] = new PropertyStore(prop.DefaultValue));
                var old = ps.Value;
                if (old === value)
                    return;
                if (value != null && !prop.checkType(value))
                    throw { message: "Uncompatible type", this: this, property: prop, value: value };
                var ev = EventArgs.New(prop, this, old, value);
                if (prop.Check)
                    prop.Check.call(this, ev);
                if (old === ev._new || !ev.IsValid)
                    return;
                ps.Value = ev._new;
                prop.Changed && prop.Changed.call(this, ev);
                this.onPropertyChanged(ev);
                if (keepEvent)
                    return ev;
                ev.Dispose();
            };
            DObject.prototype.raise = function (e) {
                var c = this.get(e);
                var ev = EventArgs.New(e, this, c, c);
                this.onPropertyChanged(ev);
            };
            DObject.prototype.get = function (prop) {
                var ps = this.store[prop.Index];
                return ps ? ps.Value : prop.DefaultValue;
            };
            DObject.prototype.GetValues = function () {
                return this.store.map(function (v, i, a) { return v && v.Value; });
            };
            DObject.prototype.GetValue = function (prop) {
                var ps = this.store[prop.Index];
                return ps ? ps.Value : prop.DefaultValue;
            };
            DObject.prototype.SetValue = function (prop, p) {
                this.set(prop, p);
            };
            DObject.prototype.removeListener = function (v) {
                var x = this._propertyChanged.indexOf(v.Ref);
                if (x !== -1)
                    this._propertyChanged.splice(x, 1);
                else
                    return false;
                return true;
            };
            DObject.prototype.addListener = function (v) {
                if (this._propertyChanged.indexOf(v) !== -1)
                    return false;
                this._propertyChanged.push(v);
                return true;
            };
            DObject.prototype.onPropertyChanged = function (ev) {
                for (var i = 0; i < this._propertyChanged.length; i++) {
                    var dlg = this._propertyChanged[i];
                    dlg(ev);
                }
                var x;
                if ((x = ((x = this.store[ev.prop.Index]) && x._bindings)))
                    for (var i = 0; i < x.length; i++)
                        if (x[i].handleEvent(ev)) {
                            x.splice(i, 1);
                            i--;
                        }
            };
            DObject.prototype.Observe = function (prop, ev, owner) {
                var ps = this.store[prop.Index] || (this.store[prop.Index] = new PropertyStore(prop.DefaultValue));
                ps.InsBindings.push(ps = new PropBinding(ev, owner));
                return ps;
            };
            DObject.prototype.UnObserve = function (prop, y, owner) {
                var ps = this.store[prop.Index] && this.store[prop.Index]._bindings;
                var i;
                if (ps) {
                    if (typeof y !== 'function') {
                        if ((i = ps.indexOf(y)) != -1)
                            return this._disposeProp(this.store[prop.Index], y, i);
                    }
                    else {
                        var t, j;
                        for (var i = ps.length - 1; i >= 0; i--) {
                            var p = ps[i];
                            if (p.Invoke === y) {
                                if (p.Owner === owner)
                                    if (!this._disposeProp(this.store[prop.Index], p, i))
                                        return true;
                                if (!t)
                                    t = p, j = i;
                            }
                        }
                        if (t)
                            return this._disposeProp(this.store[prop.Index], t, j);
                    }
                }
                return false;
            };
            DObject.prototype._disposeProp = function (prs, t, index) {
                var ps = prs._bindings;
                t.Dispose();
                if (ps.length == 1) {
                    prs._bindings = void 0;
                    return false;
                }
                ps.splice(index, 1);
                return true;
            };
            DObject.prototype.OnPropertyChanged = function (prop, ev, owner) {
                return this.Observe(prop, ev, owner);
            };
            DObject.prototype.addEvent = function (prop, b) {
                var ps = this.store[prop.Index] || (this.store[prop.Index] = new PropertyStore(prop.DefaultValue));
                ps.Bindings.push(b);
            };
            DObject.prototype.removeEvent = function (prop, y) {
                var ps = this.store[prop.Index] && this.store[prop.Index]._bindings;
                if (ps) {
                    var i = ps.indexOf(y);
                    if (i != -1) {
                        return this._disposeProp(this.store[prop.Index], y, i);
                    }
                }
                return null;
            };
            Object.defineProperty(DObject.prototype, "Disposed", {
                get: function () { return this.store.length === 0; },
                enumerable: true,
                configurable: true
            });
            DObject.prototype.OnDispose = function () {
                if (this.DisposingStat === 2)
                    return null;
                var h = this.DisposingStat == 1;
                this.DisposingStat = 1;
                if (!h && this.OnDisposing)
                    this._onDisposing.Invoke(0, [this]);
                return h;
            };
            DObject.prototype.Dispose = function () {
                var h = this.OnDispose();
                if (h === null)
                    return;
                this._propertyChanged.length = 0;
                var t = DObject.getFields(this.GetType());
                for (var i = 0, l = this.store.length; i < l; i++)
                    this.store[i] && this.store[i].Dispose();
                this.store.length = 0;
                if (!h)
                    this.DisposingStat = 2;
            };
            Object.defineProperty(DObject.prototype, "OnDisposing", {
                set: function (v) { if (this._onDisposing === undefined)
                    this._onDisposing = new bind.EventListener(0, true); this._onDisposing.On = v; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DObject.prototype, "OffDisposing", {
                set: function (v) { if (this._onDisposing == undefined)
                    return; this._onDisposing.Off = v; },
                enumerable: true,
                configurable: true
            });
            DObject.prototype.CloneTo = function (o) {
                o._propertyChanged = this._propertyChanged;
                o.addListener = this.addListener;
                o.store = this.store;
            };
            DObject.prototype.Freeze = function () {
                this._isFrozen = true;
            };
            DObject.prototype.UnFreeze = function () {
                this._isFrozen = false;
            };
            DObject.prototype.IsFrozen = function () { return this._isFrozen; };
            DObject.prototype.CreateBackup = function (OnUndo) {
                var e;
                var c = __corelib__.backups.get(this.store);
                e = { OnUndo: OnUndo, values: this.store.map(function (p, i) { return p.Value; }) };
                if (!c)
                    __corelib__.backups.set(this.store, c = [e]);
                else
                    c.push(e);
                return e;
            };
            DObject.prototype.Commit = function (r) {
                var l = __corelib__.backups.get(this.store);
                if (l == null || l.length === 0)
                    return false;
                if (r) {
                    var i = l.indexOf(r);
                    if (i === -1)
                        return;
                    l.splice(i);
                }
                else
                    l.pop();
            };
            DObject.prototype.Rollback = function (b, walkTrougth) {
                if (b)
                    return this.UndoTo(b, walkTrougth);
                var l = __corelib__.backups.get(this.store);
                if (l == null || l.length === 0)
                    return false;
                var x = l.pop();
                var ps = DObject._dpStore[this.constructor.__id__];
                var c = x.values;
                for (var i = 0; i < c.length; i++)
                    this.set(ps.Fields[i], c[i]);
                if (x.OnUndo)
                    x.OnUndo(this, x);
                return true;
            };
            DObject.prototype.UndoTo = function (b, walkTrougth) {
                var l = __corelib__.backups.get(this.store);
                if (l == null || l.length === 0)
                    return;
                var i = l.indexOf(b);
                if (i === -1)
                    return false;
                var arr = l.splice(i, l.length - i);
                var ps = DObject._dpStore[this.constructor.__id__];
                if (walkTrougth)
                    for (var i = arr.length; i >= 0; i--) {
                        var x = arr[i];
                        var c = x.values;
                        for (var i = 0; i < c.length; i++)
                            this.set(ps.Fields[i], c[i]);
                    }
                else {
                    var x = arr[0];
                    var c = x.values;
                    for (var i = 0; i < c.length; i++)
                        this.set(ps.Fields[i], c[i]);
                }
                return true;
            };
            DObject._dpStore = [];
            DObject._isOpen = false;
            DObject.typeCount = 0;
            return DObject;
        }());
        bind.DObject = DObject;
        var DisposingStat;
        (function (DisposingStat) {
            DisposingStat[DisposingStat["None"] = 0] = "None";
            DisposingStat[DisposingStat["Disposing"] = 1] = "Disposing";
            DisposingStat[DisposingStat["Disposed"] = 2] = "Disposed";
        })(DisposingStat = bind.DisposingStat || (bind.DisposingStat = {}));
        var XPath = (function () {
            function XPath(name) {
                this.Name = name;
            }
            XPath.prototype.ListenTo = function (d, callback, owner) {
                if (!this.Property && d instanceof bind.DObject)
                    this.Property = d.GetProperty(this.Name);
                if (this.Property) {
                    this.Binding != null && this.d && this.d.UnObserve(this.Property, this.Binding, owner);
                    this.Binding = void 0;
                    if (d != null) {
                        this.Value = d.GetValue(this.Property);
                        this.Binding = d.Observe(this.Property, callback, owner);
                    }
                }
                else {
                    this.Binding != null && this.d && injecter.unobserve(this.d, this.Name, this.Binding, owner);
                    this.Binding = void 0;
                    if ((d != null) && d.hasOwnProperty(this.Name))
                        this.Binding = injecter.observe(d, this.Name, callback, owner);
                    (d != null) && (this.Value = d[this.Name]);
                }
                this.d = d;
            };
            XPath.prototype.Dispose = function () {
                if (this.Property && this.d instanceof bind.DObject)
                    this.Binding != null && this.d != null && this.d.UnObserve(this.Property, this.Binding);
                else
                    this.Binding != null && this.d != null && injecter.unobserve(this.d, this.Name, this.Binding);
                this.Value = null;
                this.Binding = null;
            };
            return XPath;
        }());
        bind.XPath = XPath;
        var Observer = (function (_super) {
            __extends(Observer, _super);
            function Observer(me, path, controller) {
                var _this_1 = _super.call(this) || this;
                _this_1.controller = controller;
                _this_1.xpath = [];
                _this_1.Me = me;
                _this_1.Path = path;
                return _this_1;
            }
            Object.defineProperty(Observer.prototype, "Me", {
                get: function () { return this.get(Observer.DPMe); },
                set: function (value) { this.set(Observer.DPMe, value); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Observer.prototype, "Path", {
                get: function () { return this.get(Observer.DPPath); },
                set: function (value) { this.set(Observer.DPPath, value); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Observer.prototype, "Value", {
                get: function () { return this.get(Observer.DPValue); },
                set: function (value) { this.set(Observer.DPValue, value); },
                enumerable: true,
                configurable: true
            });
            Observer.__fields__ = function () {
                return [
                    Observer.DPMe, Observer.DPPath, Observer.DPValue
                ];
            };
            Observer.prototype.GenType = function () { return Observer; };
            Observer.prototype.rebuidPath = function (e) {
                var path = e._new;
                this.disposePath();
                this.xpath = new Array(path.length);
                for (var i = 0; i < path.length; i++) {
                    var p = path[i];
                    this.xpath[i] = new XPath(p);
                }
                this.Start(0);
            };
            Observer.prototype.disposePath = function () {
                var r = this.xpath;
                var l = r.length;
                for (var i = 0; i < l; i++) {
                    var p = r[i];
                    p.Dispose();
                }
                this.Value = null;
            };
            Observer.prototype.getValue = function (l) {
                var t = this.Me;
                var r = this.xpath;
                for (var i = 0; i < l; i++) {
                    var p = r[i];
                    if (t == null)
                        return null;
                    if (p.Property)
                        t = t.get(p.Property);
                    else
                        t = t[p.Name];
                    p.Value = t;
                }
                return t;
            };
            Observer.prototype.Start = function (i) {
                if (i == void 0)
                    i = 0;
                var r = this.xpath;
                var t = this.getValue(i);
                for (var j = i; j < r.length; j++) {
                    var p = r[j];
                    if (t != null) {
                        p.ListenTo(t, this.callMe, this);
                        t = p.Value;
                    }
                    else
                        p && p.Dispose();
                }
                this.Value = t;
            };
            Observer.prototype.ESetValue = function (value) {
                var l = this.xpath.length;
                if (l < 1)
                    return;
                var last = this.xpath[l - 1];
                var prevlast = l - 2 < 0 ? this.Me : this.xpath[l - 2].Value;
                if (prevlast)
                    if (last.Property)
                        prevlast.SetValue(last.Property, value);
                    else {
                        this.Value = value;
                        prevlast[last.Name] = value;
                    }
            };
            Observer.prototype.callMe = function (binding, e) {
                for (var i = this.xpath.length - 1; i >= 0; i--) {
                    var p = this.xpath[i];
                    if (p.Binding == binding) {
                        this.Start(i + 1);
                        break;
                    }
                }
                this.Value = this.getValue(this.xpath.length);
            };
            Observer.prototype.Dispose = function () {
                var h = this.OnDispose();
                if (h === null)
                    return;
                this.disposePath();
                _super.prototype.Dispose.call(this);
                if (!h)
                    this.DisposingStat = 2;
            };
            Observer.DPMe = bind.DObject.CreateField("Me", Object, null, function (e) { this.Start(0); }, Observer.prototype.disposePath);
            Observer.DPPath = bind.DObject.CreateField("Path", Array, null, Observer.prototype.rebuidPath);
            Observer.DPValue = bind.DObject.CreateField("Value", Object, null);
            return Observer;
        }(bind.DObject));
        bind.Observer = Observer;
    })(bind = exports.bind || (exports.bind = {}));
    (function (bind) {
        function cloneScopBuilderEventArgs(e, presult, parentScop) {
            return {
                bindingMode: e.bindingMode, dom: e.dom, parseResult: presult, parent: parentScop, controller: e.controller
            };
        }
        bind.cloneScopBuilderEventArgs = cloneScopBuilderEventArgs;
        function cloneScop_Mode(e, mode) {
            return {
                bindingMode: mode, dom: e.dom, parseResult: e.parseResult, parent: e.parent, controller: e.controller
            };
        }
        bind.cloneScop_Mode = cloneScop_Mode;
        function mixIn(src, target) {
            for (var k in src) {
                if (!target.hasOwnProperty(k))
                    target[k] = src[k];
            }
            return target;
        }
        bind.mixIn = mixIn;
        function isConstant(t) {
            return t.tokon <= Syntaxer_1.Parser.CToken.string;
        }
        var Scop = (function (_super) {
            __extends(Scop, _super);
            function Scop(_bindingMode) {
                var _this_1 = _super.call(this) || this;
                _this_1._bindingMode = _bindingMode == null ? 1 : _bindingMode;
                return _this_1;
            }
            Scop.prototype.Invoke = function () {
            };
            Scop.prototype.getScop = function (path, createIfNotEist) {
                return Scop.getAttribute(this, path.split(/[\s\\\/\.]+/), createIfNotEist);
            };
            Scop.prototype.findScop = function (path) {
                var cs = this;
                do {
                    var t = path.pop();
                    switch (t) {
                        case '.':
                            continue;
                        case '..':
                            cs = cs.getParent();
                            break;
                        default:
                            var c = t.charCodeAt(0);
                            if (c === 36 || c === 126)
                                throw "optimize your code by delete the first part befor ($|~)";
                            if (c === 64) {
                            }
                            cs = cs._scops && cs._scops[t];
                            break;
                    }
                } while (path.length > 0);
            };
            Scop.prototype.getParent = function () { return this._parent; };
            Scop.prototype.setParent = function (v) {
                if (v == this._parent)
                    return true;
                if (this.canBeParent(v))
                    this._parent = v;
                else
                    return false;
                return true;
            };
            Scop.prototype.canBeParent = function (v) {
                var t = v;
                while (t && t != this) {
                    t = t.getParent();
                }
                return !t;
            };
            Scop.prototype.SetExParent = function (scop, parent) {
                return this.setParent(scop) || this.setParent(parent);
            };
            Scop.prototype.findAttribute = function (name) {
                var scp = this;
                var x = [];
                while (scp) {
                    if (x.indexOf(scp) != -1)
                        return undefined;
                    if (scp._scops && scp._scops.hasOwnProperty(name))
                        return scp._scops[name];
                    x.push(scp);
                    scp = this.getParent();
                }
            };
            Scop.getAttribute = function (scp, name, createIfNotEist) {
                if (typeof name == 'string')
                    name = [name];
                if (!name || name.length == 0)
                    return scp;
                var fscp = scp.findAttribute(name[0]);
                if (!fscp && !createIfNotEist)
                    return null;
                if (fscp) {
                    scp = fscp;
                    name.shift();
                }
                while (name.length) {
                    var fname = name.shift();
                    var s = void 0;
                    if (scp._scops && scp._scops.hasOwnProperty(fname))
                        s = scp._scops[fname];
                    else if (createIfNotEist) {
                        if (!scp._scops)
                            scp._scops = {};
                        scp._scops[fname] = s = new ValueScop(null, 3);
                        s.setParent(scp);
                    }
                    else
                        return null;
                    scp = s;
                }
                return scp;
            };
            Scop.prototype.setAttribute = function (name, value) {
                var s = this.getScop(name, true);
                s.Value = value;
            };
            Scop.prototype.getAttribute = function (name, createIfNotEist) {
                return Scop.getAttribute(this, [name], createIfNotEist);
            };
            Scop.__fields__ = function () { return [Scop.DPValue]; };
            Object.defineProperty(Scop.prototype, "BindingMode", {
                get: function () { return this._bindingMode; },
                set: function (value) { this._bindingMode = value == null ? 1 : value; },
                enumerable: true,
                configurable: true
            });
            Scop.prototype._setPrivateValue = function (v, keepEvent) {
                _internal = true;
                return this.set(Scop.DPValue, v, keepEvent);
            };
            Object.defineProperty(Scop.prototype, "privateValue", {
                set: function (v) {
                    _internal = true;
                    this.set(Scop.DPValue, v);
                },
                enumerable: true,
                configurable: true
            });
            Scop.prototype.valueChanged = function (sender, e) {
                e.__this._OnValueChanged(e);
            };
            Scop.Create = function (s, e) {
                return this.GenerateScop(s, e);
            };
            Scop.RegisterScop = function (token, handler) {
                var x = Scop._scopsRegister.get(token);
                if (x)
                    throw "this token registered";
                Scop._scopsRegister.set(token, handler);
            };
            Scop.GetScopHandler = function (token) {
                return Scop._scopsRegister.get(token);
            };
            Scop.BuildScop = function (e) {
                var scop = e.parent;
                var h = Scop._scopsRegister.get(e.parseResult.tokon);
                if (h)
                    return h(e);
                switch (e.parseResult.tokon) {
                    case 'anonymousscop':
                        var scop = AnonymouseScop.UnRegister(e.parseResult.resut).setController(e.controller);
                        scop.setParent(e.parent);
                        break;
                    case 'namedscop':
                        scop = NamedScop.Create(e.parseResult.resut, null, e.bindingMode);
                        break;
                    case 'parentscop':
                        for (var j = e.parseResult.resut - 1; j >= 0; j--)
                            scop = scop && scop.getParent();
                        break;
                    case 'subscop':
                        scop = Scop.getAttribute(scop, e.parseResult.resut, true).setController(e.controller);
                        ;
                        break;
                    case Syntaxer_1.Parser.CToken.path:
                        for (var _i = 0, _a = e.parseResult.resut; _i < _a.length; _i++) {
                            var i = _a[_i];
                            scop = this.BuildScop(bind.cloneScopBuilderEventArgs(e, i, scop));
                        }
                        break;
                    default:
                        return null;
                }
                return scop;
            };
            Scop.prototype.setController = function (controller) {
                if (this.__Controller__)
                    this.__Controller__.unregisterScop(this);
                if (controller) {
                    this.__Controller__ = controller;
                }
                if (controller)
                    controller.registerScop(this);
                return this;
            };
            Scop.GenerateScop = function (s, e) {
                if (s == "" || s == null || s == ".")
                    return e.parent;
                e.parseResult = Syntaxer_1.Parser.parseExpression(s);
                if (!e.parseResult.success)
                    return console.error('bind path : ' + s), null;
                return Scop.BuildScop(e);
            };
            Scop.prototype.AddJob = function (job, dom) {
                var ji = new bind.JobInstance(this, job, dom);
                if (!this.__jobs__)
                    this.__jobs__ = [ji];
                else
                    this.__jobs__.push(ji);
                if (job.OnInitialize != null)
                    job.OnInitialize(ji, null);
                return ji;
            };
            Scop.prototype.Dispose = function () {
                var h = this.OnDispose();
                if (h === null)
                    return;
                this.setParent(null);
                if (this.__jobs__) {
                    for (var i = 0; i < this.__jobs__.length; i++) {
                        var ji = this.__jobs__[i];
                        if (ji.IsDisposed)
                            continue;
                        ji.Dispose();
                    }
                    this.__jobs__.length = 0;
                    this.__jobs__ = null;
                }
                _super.prototype.Dispose.call(this);
                if (!h)
                    this.DisposingStat = 2;
            };
            Scop.prototype.RegisterJob = function (job) {
                if (!this.__mjobs__)
                    this.__mjobs__ = {};
                this.__mjobs__[job.Name] = job;
            };
            Scop.prototype.GetJob = function (name) {
                return this.__mjobs__ && this.__mjobs__[name];
            };
            Scop.prototype.getThis = function () {
                return this.__Controller__ && this.__Controller__.CurrentControl;
            };
            Object.defineProperty(Scop.prototype, "__hasSegments__", {
                get: function () { return false; },
                enumerable: true,
                configurable: true
            });
            Scop.prototype.forEach = function (callback, param) {
            };
            Object.defineProperty(Scop.prototype, "ParentValue", {
                get: function () { var p = this.getParent(); return p && p.Value; },
                enumerable: true,
                configurable: true
            });
            Scop.prototype.WhenIschanged = function (callback, owner) {
                return this.OnPropertyChanged(Scop.DPValue, callback, owner).Dispose;
            };
            Scop.prototype.OffIsIchangeing = function (callback) {
            };
            Scop.DPValue = bind.DObject.CreateField("Value", Object, void 0, _OnValueChanged_, checkAccess);
            Scop._scopsRegister = new Map();
            return Scop;
        }(bind.DObject));
        bind.Scop = Scop;
        var IScopConst = (function () {
            function IScopConst(e) {
                this.isConstant = isConstant(e.parseResult);
                this.value = this.isConstant ? e.parseResult.resut : void 0;
                this.scop = this.isConstant ? void 0 : bind.Scop.BuildScop(e);
            }
            IScopConst.prototype.Dispose = function () {
                if (this.scop)
                    this.scop.Dispose();
                if (this.pb)
                    this.pb.Dispose();
                this.scop = void 0;
                this.pb = void 0;
                this.value = void 0;
            };
            Object.defineProperty(IScopConst.prototype, "Value", {
                get: function () {
                    return this.isConstant ? this.value : this.scop.Value;
                },
                set: function (v) {
                    if (this.isConstant)
                        this.value = v;
                    else
                        this.scop.Value = v;
                },
                enumerable: true,
                configurable: true
            });
            IScopConst.prototype.CaptureEvent = function (callback, owner) {
                if (!this.isConstant)
                    this.pb = this.scop.OnPropertyChanged(bind.Scop.DPValue, callback, owner);
                else
                    this.pb = injecter.observe(this, 'value', callback, owner);
                return this;
            };
            return IScopConst;
        }());
        bind.IScopConst = IScopConst;
        function GetStringScop(s, e) {
            return StringScop.GetStringScop(s, e);
        }
        bind.GetStringScop = GetStringScop;
        var StringScop = (function (_super) {
            __extends(StringScop, _super);
            function StringScop(template, e) {
                var _this_1 = _super.call(this, 1) || this;
                _this_1.template = template;
                for (var _i = 0, template_1 = template; _i < template_1.length; _i++) {
                    var str = template_1[_i];
                    if ((typeof str)[0] !== 'o')
                        continue;
                    str.scop = Scop.GenerateScop(str.Code, bind.mixIn(e, { bindingMode: 1 }));
                    str.pb = str.scop.OnPropertyChanged(Scop.DPValue, _this_1.Reset, _this_1);
                }
                _this_1.setParent(e.parent);
                _this_1.Reset(void 0, void 0);
                return _this_1;
            }
            StringScop.prototype.Is = function (toke) {
                return toke == Syntaxer_1.Parser.CToken.StringTemplate;
            };
            StringScop.prototype.AttacheTo = function (Dom) {
                this._dom = Dom;
                this._dom && (this._dom.textContent = this.Value || "");
            };
            StringScop.GetStringScop = function (s, e) {
                var d = Syntaxer_1.Parser.StringTemplate.Compile(s);
                for (var _i = 0, d_1 = d; _i < d_1.length; _i++) {
                    var x = d_1[_i];
                    if ((typeof x)[0] !== 'o')
                        continue;
                    else
                        return new StringScop(d, e);
                }
                return s;
            };
            StringScop.prototype._OnValueChanged = function (e) { this._dom && (this._dom.textContent = e._new || ""); };
            StringScop.prototype.setParent = function (v) {
                return;
                if (!this.canBeParent(v))
                    return false;
                var lp = this._parent;
                if (lp && this.pb)
                    lp.removeEvent(bind.Scop.DPValue, this.pb);
                else
                    this.pb = null;
                this._parent = v;
                for (var i = 0; i < this.template.length; i++) {
                    var r = this.template[i];
                    var s = r.scop;
                    if ((typeof r)[0] !== 'o' || !(s && s.Is('bindscope')))
                        continue;
                    s && s.setParent(v);
                }
                return true;
            };
            StringScop.prototype.Reset = function (sender, e) {
                for (var i = 0; i < this.template.length; i++) {
                    var r = this.template[i];
                    if ((typeof r)[0] !== 'o')
                        continue;
                    r.result = r.scop && r.scop.Value;
                }
                this.privateValue = Syntaxer_1.Parser.StringTemplate.GenearteString(this.template);
            };
            StringScop.prototype.Dispose = function () {
                var h = this.OnDispose();
                if (h === null)
                    return;
                this.setParent(null);
                for (var i = 0; i < this.template.length; i++) {
                    var r = this.template[i];
                    var s = r.scop;
                    if ((typeof r)[0] !== 'o' || !(s && s.Is('bindscope')))
                        continue;
                    s && s.Dispose();
                }
                _super.prototype.Dispose.call(this);
                if (!h)
                    this.DisposingStat = 2;
            };
            return StringScop;
        }(bind.Scop));
        bind.StringScop = StringScop;
        var scops = {};
        var NamedScop = (function (_super) {
            __extends(NamedScop, _super);
            function NamedScop(name, bindingMode) {
                var _this_1 = _super.call(this, bindingMode) || this;
                if (name.charAt(0) == '$')
                    throw "Name of scop cannot be started with '$' char";
                if (vars.names_scop_fromIn != true)
                    throw "Access violatil";
                _this_1._name = name;
                if (name)
                    scops[name] = _this_1;
                vars.names_scop_fromIn = false;
                return _this_1;
            }
            NamedScop.prototype.Is = function (toke) {
                return toke == 'namedscop';
            };
            Object.defineProperty(NamedScop.prototype, "Name", {
                get: function () { return this._name; },
                enumerable: true,
                configurable: true
            });
            NamedScop.Get = function (name) {
                return scops[name];
            };
            NamedScop.prototype._OnValueChanged = function (e) {
            };
            NamedScop.Create = function (name, value, twoWay) {
                var t = scops[name];
                if (t != null)
                    return t;
                vars.names_scop_fromIn = true;
                t = new NamedScop(name, twoWay);
                t.privateValue = value;
                return t;
            };
            NamedScop.prototype.Dispose = function () {
                var h = this.OnDispose();
                if (h === null)
                    return;
                _super.prototype.Dispose.call(this);
                scops[this.Name] = undefined;
                delete scops[this.Name];
                if (!h)
                    this.DisposingStat = 2;
            };
            return NamedScop;
        }(Scop));
        bind.NamedScop = NamedScop;
        var i = -1;
        var ascops = [];
        var AnonymouseScop;
        (function (AnonymouseScop) {
            function Register(scop) {
                ascops[++i] = scop;
                return i;
            }
            AnonymouseScop.Register = Register;
            function UnRegister(i) {
                var t = ascops[i];
                ascops[i] = undefined;
                return t;
            }
            AnonymouseScop.UnRegister = UnRegister;
            function Get(i) {
                return ascops[i];
            }
            AnonymouseScop.Get = Get;
        })(AnonymouseScop = bind.AnonymouseScop || (bind.AnonymouseScop = {}));
        var ValueScop = (function (_super) {
            __extends(ValueScop, _super);
            function ValueScop(value, bindMode) {
                if (bindMode === void 0) { bindMode = 3; }
                var _this_1 = _super.call(this, bindMode) || this;
                _this_1.privateValue = value;
                return _this_1;
            }
            ValueScop.prototype.Is = function (toke) {
                return toke == 'valuescope';
            };
            ValueScop.prototype._OnValueChanged = function (e) {
            };
            return ValueScop;
        }(Scop));
        bind.ValueScop = ValueScop;
        var tx = {
            '3': 3,
            '2': 2,
            '1': 1,
            '': 0,
            'false': 1,
            'true': 3
        };
        function getDbTwoWay(t) {
            if (t == null)
                return 1;
            return tx[t] || BindingMode[t];
        }
        var db = (function () {
            function db(dom) {
                this.events = {};
                var a = dom.attributes;
                for (var i = 0; i < a.length; i++) {
                    var n = a[i].name;
                    if (n.indexOf('db-') === 0)
                        this[n.substr(3)] = a[i].value;
                    else if (n.indexOf('on-') === 0) {
                        this.events[n.substr(3)] = a[i].value;
                    }
                }
                if (this.twoway)
                    this.twoway = getDbTwoWay(this.twoway);
                this.init = runtime_6.helper.TryCatch(JSON, JSON.parse, void 0, [this.init]);
                if (this.stop != undefined) {
                    if (typeof stop !== undefined)
                        stop();
                    stop();
                }
            }
            return db;
        }());
        bind.db = db;
        var Todo = (function () {
            function Todo(scopFunction) {
                this.scopFunction = scopFunction;
            }
            Object.defineProperty(Todo.prototype, "Name", {
                get: function () { return "Todo"; },
                enumerable: true,
                configurable: true
            });
            Todo.prototype.Todo = function (job, e) {
                var v = this.scopFunction.Value;
                if (!(v instanceof Function))
                    return;
                var p = this.scopFunction.getParent();
                v.call(p && p.Value, job, e);
            };
            return Todo;
        }());
        bind.Todo = Todo;
        var Filter = (function (_super) {
            __extends(Filter, _super);
            function Filter(source, bindingMode) {
                var _this_1 = _super.call(this, bindingMode) || this;
                _this_1.source = source;
                return _this_1;
            }
            Filter.prototype.Is = function (toke) {
                return toke == 'filter';
            };
            Filter.prototype.Initialize = function () {
                if (this.source)
                    this.dbb = this.source.OnPropertyChanged(Scop.DPValue, this.SourceChanged, this);
                this.privateValue = this.Convert(this.source ? this.source.Value : null);
            };
            Filter.prototype.SourceChanged = function (p, e) {
                if ((this._bindingMode & 1) === 0)
                    return;
                if (this.isChanging)
                    return;
                this.isChanging = true;
                this.privateValue = this.Convert(e._new);
                this.isChanging = false;
            };
            Filter.prototype._OnValueChanged = function (e) {
                if ((this._bindingMode & 2) === 0)
                    return;
                if (this.isChanging)
                    return;
                this.isChanging = true;
                this.source.Value = this.ConvertBack(e._new);
                this.isChanging = false;
            };
            Filter.prototype.Update = function () {
                this.privateValue = this.Convert(this.source.Value);
            };
            Filter.prototype.UpdateBack = function () {
                this.source.Value = this.ConvertBack(this.Value);
            };
            Filter.prototype.getParent = function () { return this.source; };
            Filter.prototype.setParent = function (v) {
                if (!this.canBeParent(v))
                    return false;
                if (this.source)
                    this.source.removeEvent(Scop.DPValue, this.dbb);
                if (v)
                    this.dbb = v.OnPropertyChanged(Scop.DPValue, this.SourceChanged, this);
                this.source = v;
                this.Initialize();
                return true;
            };
            Filter.prototype.Dispose = function () {
                if (this.source)
                    this.source.removeEvent(Scop.DPValue, this.dbb);
                this.source = null;
                _super.prototype.Dispose.call(this);
            };
            return Filter;
        }(Scop));
        bind.Filter = Filter;
        var DoubleFilter = (function (_super) {
            __extends(DoubleFilter, _super);
            function DoubleFilter() {
                var _this_1 = _super !== null && _super.apply(this, arguments) || this;
                _this_1.fraction = 0.3333;
                return _this_1;
            }
            Object.defineProperty(DoubleFilter.prototype, "Fraction", {
                set: function (v) {
                    if (this.fraction === v)
                        return;
                    this.fraction = v;
                    switch (this._bindingMode) {
                        case 0:
                            return;
                        case 2:
                            this.UpdateBack();
                            return;
                        case 1:
                        case 3:
                            this.Update();
                            return;
                    }
                },
                enumerable: true,
                configurable: true
            });
            DoubleFilter.prototype.Convert = function (data) { return data / this.fraction; };
            DoubleFilter.prototype.ConvertBack = function (data) { return data * this.fraction; };
            return DoubleFilter;
        }(Filter));
        bind.DoubleFilter = DoubleFilter;
        var filters = {};
        function RegisterFilter(filter) {
            if (filters[filter.Name])
                return false;
            __corelib__.$defineProperty(filters, filter.Name, { value: filter, writable: false, configurable: false, enumerable: false });
            return true;
        }
        bind.RegisterFilter = RegisterFilter;
        function CreateFilter(filterName, parent, bindingMode) {
            var i = filterName.indexOf(':');
            if (i == -1)
                var p = null, name = filterName;
            else {
                name = filterName.substring(0, i);
                p = filterName.substring(i + 1);
            }
            var f = filters[name];
            if (!f)
                return parent;
            var e = f.CreateNew(parent, bindingMode & f.BindingMode, p);
            e.Initialize();
            return e;
        }
        bind.CreateFilter = CreateFilter;
        var BindingMode;
        (function (BindingMode) {
            BindingMode[BindingMode["SourceToTarget"] = 1] = "SourceToTarget";
            BindingMode[BindingMode["TwoWay"] = 3] = "TwoWay";
            BindingMode[BindingMode["TargetToSource"] = 2] = "TargetToSource";
        })(BindingMode = bind.BindingMode || (bind.BindingMode = {}));
        var TwoBind = (function () {
            function TwoBind(bindingMode, a, b, pa, pb) {
                this.bindingMode = bindingMode;
                this.a = a;
                this.b = b;
                this.pa = pa;
                this.pb = pb;
                this.dba = a.OnPropertyChanged(pa, this.pac, this);
                this.dbb = b.OnPropertyChanged(pb, this.pab, this);
                if (DEBUG)
                    if ((bindingMode & 3) != 3) {
                        var _src = (bindingMode & 1) == 1 ? a : b;
                        var _trg = _src == a ? b : a;
                        if (_trg instanceof bind.Scop) {
                            if ((_trg.BindingMode & 2) != 2)
                                throw "Binding Error";
                        }
                    }
                this.Dispose = this.Dispose.bind(this);
                a.OnDisposing = this.Dispose;
                b.OnDisposing = this.Dispose;
                if (bindingMode == BindingMode.TargetToSource)
                    this.initB();
                else
                    this.init();
            }
            TwoBind.prototype.init = function () {
                var va = this.a.GetValue(this.pa);
                this.b.set(this.pb, va);
            };
            TwoBind.prototype.initB = function () {
                var vb = this.b.GetValue(this.pb);
                this.a.set(this.pa, vb);
            };
            TwoBind.prototype.pac = function (p, e) {
                if ((this.bindingMode & 1) == 0)
                    return;
                if (this.IsChanging)
                    return;
                this.IsChanging = true;
                try {
                    this.b.set(this.pb, e._new);
                }
                catch (_a) { }
                this.IsChanging = false;
            };
            TwoBind.prototype.pab = function (p, e) {
                if ((this.bindingMode & 2) == 0)
                    return;
                if (this.IsChanging)
                    return;
                this.IsChanging = true;
                try {
                    this.a.set(this.pa, e._new);
                }
                catch (_a) { }
                this.IsChanging = false;
            };
            TwoBind.prototype.Dispose = function () {
                if (this.disposed)
                    return;
                this.disposed = true;
                this.a.OffDisposing = this.Dispose;
                this.b.OffDisposing = this.Dispose;
                this.disposed = null;
                this.a.removeEvent(this.pa, this.dba);
                this.b.removeEvent(this.pb, this.dbb);
                this.a = null;
                this.b = null;
                this.dba = null;
                this.dbb = null;
                this.pa = null;
                this.pb = null;
            };
            return TwoBind;
        }());
        bind.TwoBind = TwoBind;
        var TwoDBind = (function () {
            function TwoDBind(bindingMode, a, b, pa, pb, con, conBack) {
                this.bindingMode = bindingMode;
                this.a = a;
                this.b = b;
                this.pa = pa;
                this.pb = pb;
                this.con = con;
                this.conBack = conBack;
                this.dba = a.OnPropertyChanged(pa, this.pac, this);
                this.dbb = b.OnPropertyChanged(pb, this.pab, this);
                this.Dispose = this.Dispose.bind(this);
                a.OnDisposing = this.Dispose;
                b.OnDisposing = this.Dispose;
                if (bindingMode == 2)
                    this.initB();
                else
                    this.init();
            }
            TwoDBind.prototype.pac = function (p, e) {
                if ((this.bindingMode & 1) == 0)
                    return;
                if (this.IsChanging)
                    return;
                this.IsChanging = true;
                this.b.set(this.pb, this.con ? this.con(e._new) : e._new);
                this.IsChanging = false;
            };
            TwoDBind.prototype.pab = function (p, e) {
                if ((this.bindingMode & 2) == 0)
                    return;
                if (this.IsChanging)
                    return;
                this.IsChanging = true;
                this.a.set(this.pa, this.conBack ? this.conBack(e._new) : e._new);
                this.IsChanging = false;
            };
            TwoDBind.prototype.init = function () {
                var va = this.a.GetValue(this.pa);
                this.b.set(this.pb, this.con ? this.con(va) : va);
            };
            TwoDBind.prototype.initB = function () {
                var vb = this.b.GetValue(this.pb);
                this.a.set(this.pa, this.con ? this.conBack(vb) : vb);
            };
            TwoDBind.prototype.Dispose = function () {
                if (this.disposed)
                    return;
                this.disposed = true;
                this.a.OffDisposing = this.Dispose;
                this.b.OffDisposing = this.Dispose;
                this.disposed = null;
                this.a.removeEvent(this.pa, this.dba);
                this.b.removeEvent(this.pb, this.dbb);
                this.a = null;
                this.b = null;
                this.dba = null;
                this.dbb = null;
                this.pa = null;
                this.pb = null;
            };
            return TwoDBind;
        }());
        bind.TwoDBind = TwoDBind;
    })(bind = exports.bind || (exports.bind = {}));
    bind.RegisterFilter({
        Name: '2bl', BindingMode: 3, CreateNew: function (s, b, p) {
            var e = new bind.DoubleFilter(s, b);
            if (p)
                e.Fraction = parseFloat(p);
            return e;
        }
    });
    var ScopicControl;
    (function (ScopicControl) {
        var _stor = {};
        function register(name, creator) {
            _stor[name] = creator;
        }
        ScopicControl.register = register;
        function create(e) {
            var c = _stor[e.name];
            if (c)
                return c(e);
        }
        ScopicControl.create = create;
    })(ScopicControl = exports.ScopicControl || (exports.ScopicControl = {}));
    var ScopicCommand;
    (function (ScopicCommand) {
        var store = {};
        var i = 0;
        function Register(callback, param, name) {
            var n = name ? name : '@' + ++i;
            store[n] = {
                callback: callback, Param: param
            };
            return n;
        }
        ScopicCommand.Register = Register;
        function Call(n, dom, scop) {
            var cb = store[n];
            return cb ? cb.callback.Invoke.call(cb.callback.Owner, n, dom, scop, cb.Param) : void 0;
        }
        ScopicCommand.Call = Call;
        function Delete(n) {
            delete store[n];
        }
        ScopicCommand.Delete = Delete;
        function contains(n) {
            return store[n] != null;
        }
        ScopicCommand.contains = contains;
    })(ScopicCommand = exports.ScopicCommand || (exports.ScopicCommand = {}));
    var Api;
    (function (Api) {
        var $freeze = Object.freeze;
        var _apis = {};
        function RegisterApiCallback(api) {
            if (typeof api.Name !== 'string')
                return false;
            if (api.DoApiCallback instanceof Function === false)
                return false;
            var c = _apis[api.Name];
            if (c == null) {
                c = { Callback: [api], Trigger: undefined };
                __corelib__.$defineProperty(_apis, api.Name, { value: c, configurable: false, enumerable: false, writable: false });
            }
            else {
                if (c.Callback.indexOf(api) !== -1)
                    return;
                c.Callback.push(api);
            }
            $freeze(api);
        }
        Api.RegisterApiCallback = RegisterApiCallback;
        function RegisterTrigger(api) {
            if (typeof api.Name !== 'string')
                return false;
            if (api.Filter && !(api.Filter instanceof Function))
                return false;
            var c = _apis[api.Name];
            if (c == null) {
                c = { Callback: [], Trigger: api };
                _apis[api.Name] = c;
                $freeze(c);
            }
            else if (c.Trigger == null) {
                c.Trigger = api;
                $freeze(c);
            }
            else
                throw "This Command Exist";
            $freeze(api);
        }
        Api.RegisterTrigger = RegisterTrigger;
        function RiseApi(apiName, params) {
            var api = _apis[apiName];
            if (!api)
                throw "Cmd Is Not Exist";
            var t = api.Trigger;
            if (t) {
                if (t.CheckAccess)
                    if (!t.CheckAccess(t))
                        throw "Access denied";
                var f = t.Filter;
            }
            var cs = api.Callback;
            for (var i = 0, l = cs.length; i < l; i++) {
                var c = cs[i];
                if (f && !t.Filter(c, params))
                    continue;
                runtime_6.helper.TryCatch(c, c.DoApiCallback, void 0, [t, c, params]);
            }
        }
        Api.RiseApi = RiseApi;
    })(Api = exports.Api || (exports.Api = {}));
    (function (__corelib__) {
        __corelib__.backups = new Map();
        bind.NamedScop.Create('window', window, 0);
    })(__corelib__ || (__corelib__ = {}));
    var injecter;
    (function (injecter) {
        var DObject = (function () {
            function DObject(obj) {
                this.obj = obj;
                this.props = {};
            }
            DObject.prototype.create = function (prop, p) {
                var x = this.props[prop];
                if (x)
                    return x;
                if (!p || p.configurable)
                    return this.props[prop] = new IEvent(this, prop, p);
                return void 0;
            };
            DObject.prototype.get = function (prop) {
                return this.props[prop];
            };
            DObject.create = function (obj) {
                var t = this.store.get(obj);
                if (!t)
                    this.store.set(obj, t = new DObject(obj));
                return t;
            };
            DObject.get = function (obj) {
                return this.store.get(obj);
            };
            DObject.prototype.observe = function (p, prop, callback, owner) {
                p = Object.getOwnPropertyDescriptor(this.obj, prop);
                var e = this.props[prop];
                if (e) {
                    e.callback.push(pb = new bind.PropBinding(callback, owner));
                    return pb;
                }
                if (!p || (p && p.configurable && !p.get)) {
                    var e = this.create(prop, p);
                    if (!p) {
                        Object.defineProperty(this.obj, prop, p = { get: e.get, set: e.set });
                    }
                    else if (p.set)
                        Object.defineProperty(this.obj, prop, { get: p.get, set: e.set, enumerable: p.enumerable });
                    else
                        Object.defineProperty(this.obj, prop, { get: e.get, set: e.set, enumerable: p.enumerable });
                    var pb;
                    e.callback.push(pb = new bind.PropBinding(callback, owner));
                    return pb;
                }
                return null;
            };
            Object.defineProperty(DObject.prototype, "Obj", {
                set: function (v) {
                    for (var i in this.props)
                        this.props[i].set(v && v[i]);
                },
                enumerable: true,
                configurable: true
            });
            DObject.prototype.unobserve = function (prop, stat, owner) {
                var e = this.get(prop);
                if (e)
                    return e.UnObserve(stat, owner);
                return false;
            };
            DObject.store = new Map();
            return DObject;
        }());
        var IEvent = (function () {
            function IEvent(parent, prop, p) {
                this.parent = parent;
                this.p = p;
                this.callback = [];
                this.prop = { Name: prop, Type: Object, Index: -1 };
                this.set = this.set.bind(this);
                this.get = this.get.bind(this);
                this.value = parent.obj[prop];
            }
            IEvent.prototype.getInstCallback = function () { return this.callback; };
            IEvent.prototype.set = function (v) {
                var o = this.value;
                if (v == o)
                    return;
                this.value = v;
                this.p && this.p.set && this.p.set.call(this.parent.obj, v);
                this.onPropertyChanged(o, v);
            };
            IEvent.prototype.get = function () {
                if (this.p && this.p.get)
                    this.p.get.call(this.parent.obj);
                return this.value;
            };
            IEvent.prototype.onPropertyChanged = function (o, v) {
                var e = bind.EventArgs.New(this.prop, this.parent.obj, o, v);
                for (var i = 0; i < this.callback.length; i++) {
                    var c = this.callback[i];
                    if (!c.Invoke) {
                        this.callback.splice(i--, 1);
                        continue;
                    }
                    runtime_6.helper.TryCatch(c, c.handleEvent, void 0, [e]);
                }
            };
            IEvent.prototype.addEventListener = function (callback, owner) {
                this.callback.push(new bind.PropBinding(callback, owner));
            };
            IEvent.prototype.UnObserve = function (y, owner) {
                if (this) {
                    if (typeof y !== 'function') {
                        var i = this.callback.indexOf(y);
                        if (i != -1) {
                            y.Dispose();
                            return this.callback.splice(i, 1);
                        }
                    }
                    else {
                        var t, j;
                        for (var i = this.callback.length - 1; i >= 0; i--) {
                            var p = this.callback[i];
                            if (p.Invoke == y) {
                                if (p.Owner === owner) {
                                    p.Dispose();
                                    this.callback.splice(i, 1);
                                    return true;
                                }
                                if (!t)
                                    t = p, j = i;
                            }
                        }
                        if (t) {
                            t.Dispose();
                            this.callback.splice(j, 1);
                            return true;
                        }
                    }
                }
                return false;
            };
            return IEvent;
        }());
        var ldobj;
        function observe(obj, prop, callback, owner) {
            prop = String(prop);
            if (obj instanceof bind.DObject) {
                var p_1 = obj.GetProperty(prop);
                if (p_1) {
                    ldobj = obj;
                    return obj.OnPropertyChanged(p_1, function (s, e) {
                        callback(e._new, e._old);
                    }, owner);
                }
            }
            var p = Object.getOwnPropertyDescriptor(obj, prop);
            var dobj = DObject.create(obj);
            return dobj.observe(p, prop, callback, owner);
        }
        injecter.observe = observe;
        function observePath(obj, props, callback, owner) {
            var path = new Array(props.length);
            var val;
            var o = obj;
            for (var i = 0; i < props.length; i++) {
                var v = o[props[i]];
                path.push({ propName: props[i], obj: null, value: v, pb: null });
                o = v;
            }
            rebuild(0);
            function rebuild(i) {
                var prevObj = obj;
                for (i = 0; i < props.length; i++) {
                    var prop = props[i];
                    var leaf = path[i];
                    var curObj = leaf.obj;
                    if (!curObj)
                        return;
                    if (leaf.pb) {
                        if (curObj instanceof DObject)
                            curObj.unobserve(leaf.propName, leaf.pb);
                        else
                            curObj.UnObserve(curObj.GetProperty(leaf.propName), leaf.pb);
                        leaf.pb = null;
                    }
                }
            }
            function dispose(i) {
                for (; i < path.length; i++) {
                    var p = path[i];
                    if (!p.obj)
                        return;
                    unobserve(p.obj, p.propName, p.pb);
                    p.pb = null;
                    p.value = null;
                }
            }
            function recalc(i) {
            }
            function onValueChanged(s, e) {
            }
        }
        injecter.observePath = observePath;
        function unobserve(obj, prop, stat, owner) {
            prop = String(prop);
            if (obj instanceof bind.DObject) {
                var p = obj.GetProperty(prop);
                if (p)
                    return obj.UnObserve(p, stat, owner);
            }
            var dobj = DObject.create(obj);
            if (!dobj)
                return false;
            dobj.unobserve(prop, stat, owner);
            var e = dobj.get(prop);
            if (e)
                return e.UnObserve(stat, owner);
            return false;
        }
        injecter.unobserve = unobserve;
        function _observe(prop, callback, owner) {
            if (!callback || !prop)
                return;
            return observe(this, typeof prop === 'string' ? prop : prop.Name, callback, owner);
        }
        function _unobserve(prop, callback, owner) {
            if (!callback || !prop)
                return;
            return unobserve(this, typeof prop === 'string' ? prop : prop.Name, callback, owner);
        }
        Object.defineProperty(Object.prototype, 'Observe', {
            writable: false, enumerable: false,
            value: _observe
        });
        Object.defineProperty(Object.prototype, 'UnObserve', {
            writable: false, enumerable: false,
            value: _unobserve
        });
    })(injecter = exports.injecter || (exports.injecter = {}));
    var Notification;
    (function (Notification) {
        var _store = {};
        var id = 0;
        function on(name, handler) {
            __corelib__.$defineProperty(handler, 'Id', { value: handler.Id || ++id, writable: false, configurable: false, enumerable: true });
            if (!_store[name])
                _store[name] = [handler];
            else
                _store[name].push(handler);
        }
        Notification.on = on;
        function fire(name, params) {
            var s = _store[name];
            if (!s || !s.length)
                return;
            var e = { data: params, name: name, handler: void 0 };
            params = params ? params.slice(0) : [];
            params.unshift(e);
            for (var i = 0; i < s.length; i++) {
                var h = s[i];
                e.handler = h;
                runtime_6.helper.TryCatch(h.owner || h, h.callback, void 0, params);
            }
        }
        Notification.fire = fire;
        function off(name, hndl_id) {
            var s = _store[name];
            if (!s || !s.length)
                return true;
            var j = s.indexOf(hndl_id);
            if (j == -1)
                for (var i = 0; i < s.length; i++) {
                    var h = s[i];
                    if (h.Id !== hndl_id)
                        continue;
                    j = i;
                    break;
                }
            if (j !== -1)
                s.splice(j, 1);
            return true;
        }
        Notification.off = off;
    })(Notification = exports.Notification || (exports.Notification = {}));
    (function (bind) {
        var Path = (function () {
            function Path(Owner, Property) {
                this.Owner = Owner;
                this.Property = Property;
            }
            Path.prototype.Set = function (value) {
                if (this.Property instanceof bind.DProperty)
                    this.Owner.set(this.Property, value);
                else
                    this.Owner[this.Property] = value;
                this.executed = true;
                return value;
            };
            return Path;
        }());
        bind.Path = Path;
    })(bind = exports.bind || (exports.bind = {}));
});
define("sys/defs", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("sys/net", ["require", "exports", "sys/Corelib", "sys/runtime", "sys/utils"], function (require, exports, Corelib_6, runtime_7, utils_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var net;
    (function (net) {
        var Header = (function () {
            function Header(key, value) {
                this._key = key;
                this._value = value;
            }
            Object.defineProperty(Header.prototype, "key", {
                get: function () {
                    return this._key;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Header.prototype, "value", {
                get: function () {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return Header;
        }());
        net.Header = Header;
        var ResponseType;
        (function (ResponseType) {
            ResponseType[ResponseType["json"] = 0] = "json";
            ResponseType[ResponseType["document"] = 1] = "document";
            ResponseType[ResponseType["text"] = 2] = "text";
            ResponseType[ResponseType["arraybuffer"] = 3] = "arraybuffer";
            ResponseType[ResponseType["blob"] = 4] = "blob";
        })(ResponseType = net.ResponseType || (net.ResponseType = {}));
        var WebRequestMethod;
        (function (WebRequestMethod) {
            WebRequestMethod[WebRequestMethod["Get"] = 0] = "Get";
            WebRequestMethod[WebRequestMethod["Post"] = 1] = "Post";
            WebRequestMethod[WebRequestMethod["Head"] = 2] = "Head";
            WebRequestMethod[WebRequestMethod["Put"] = 3] = "Put";
            WebRequestMethod[WebRequestMethod["Delete"] = 4] = "Delete";
            WebRequestMethod[WebRequestMethod["Options"] = 5] = "Options";
            WebRequestMethod[WebRequestMethod["Connect"] = 6] = "Connect";
            WebRequestMethod[WebRequestMethod["Create"] = 7] = "Create";
            WebRequestMethod[WebRequestMethod["Open"] = 8] = "Open";
            WebRequestMethod[WebRequestMethod["Close"] = 9] = "Close";
            WebRequestMethod[WebRequestMethod["Validate"] = 10] = "Validate";
            WebRequestMethod[WebRequestMethod["FastValidate"] = 11] = "FastValidate";
            WebRequestMethod[WebRequestMethod["Print"] = 12] = "Print";
            WebRequestMethod[WebRequestMethod["UPDATE"] = 13] = "UPDATE";
            WebRequestMethod[WebRequestMethod["SUPDATE"] = 14] = "SUPDATE";
            WebRequestMethod[WebRequestMethod["Set"] = 15] = "Set";
        })(WebRequestMethod = net.WebRequestMethod || (net.WebRequestMethod = {}));
        var WebRequest = (function () {
            function WebRequest(crypt) {
                this.crypt = crypt;
                this.http = new XMLHttpRequest();
                this._responseType = null;
                this.key = new Object();
                this.OnComplete = new Corelib_6.bind.EventListener(this.key);
                this.http.addEventListener('loadend', this.downloadDelegate = new utils_3.basic.Delegate(this, this._onprogress, function (p) {
                    p.Owner.http.removeEventListener('loadend', p);
                    p.Owner.http.removeEventListener('error', p);
                }));
                this.http.addEventListener('error', this.downloadDelegate);
            }
            WebRequest.prototype.getResponseType = function () {
                return typeof this._responseType === 'number' ? this._responseType : ResponseType.text;
            };
            WebRequest.prototype.setResponseType = function (v) {
                this._responseType = v;
                return v;
            };
            Object.defineProperty(WebRequest.prototype, "Crypto", {
                set: function (v) {
                    this.crypt = v;
                },
                enumerable: true,
                configurable: true
            });
            WebRequest.prototype.Dispose = function () {
                this.OnComplete.Dispose();
                this.downloadDelegate.Dispose();
                this.key = null;
                this.http = null;
                this.OnComplete = null;
                this.downloadDelegate = null;
            };
            WebRequest.prototype._onprogress = function (e) {
                var cur = null;
                switch (this.http.readyState) {
                    case 4:
                        cur = this.OnComplete;
                        break;
                    default: return;
                }
                if (cur) {
                    var t = this;
                    cur.Invoke(this.key, [t]);
                }
            };
            Object.defineProperty(WebRequest.prototype, "IsSuccess", {
                get: function () { return this.http.status == 200 && this.http.readyState == 4; },
                enumerable: true,
                configurable: true
            });
            WebRequest.prototype.Download = function (req, data) {
                this.http.open(WebRequestMethod[req.Method], req.Url, true, this.Uid, this.Pwd);
                this.http.setRequestHeader('xreq', btoa((this.Uid || '') + ':' + (this.Pwd || '')));
                this.http.responseType = ResponseType[this.getResponseType()].toLowerCase();
                if (req.Method === WebRequestMethod.Get)
                    this.http.send();
                else
                    this.http.send(JSON.stringify(data));
            };
            WebRequest.prototype.Download2 = function (c) {
                if (c.url.beforRequest && !c.url.beforRequest(c.url))
                    return this.OnComplete && this.OnComplete.Invoke(this.key, [this]);
                var req = c.url;
                this.http.open(WebRequestMethod[req.Method], this.getUrlOf(c), true, this.Uid, this.Pwd);
                this.http.setRequestHeader('xreq', btoa((this.Uid || '') + ':' + (this.Pwd || '')));
                this.http.setRequestHeader('Access-Control-Allow-Origin', '*');
                if (c.url.timeout)
                    this.http.timeout = c.url.timeout;
                else
                    this.http.timeout = 0;
                this.http.responseType = ResponseType[c.url.ResponseType] || 'text';
                this.http.send(this.getDataOf(c));
            };
            WebRequest.prototype.getUrlOf = function (c) {
                var req = c.url;
                var url = req.Url;
                if (c.params) {
                    var s = url.lastIndexOf('?') != -1;
                    for (var i in c.params)
                        url += (!s ? ((s = true) && '?') : '&') + (encodeURI(i) + '=' + encodeURI(String(c.params[i])));
                }
                return url;
            };
            WebRequest.prototype.getDataOf = function (c) {
                var req = c.url;
                if (req.HasBody === true && req.Method !== WebRequestMethod.Get && c.data !== undefined) {
                    return c.data.OutputData();
                }
            };
            WebRequest.prototype.GetFileSize = function (url, callback) {
                this.http.open("HEAD", url, true, this.Uid, this.Pwd);
                this.http.onreadystatechange = function () {
                    if (this.readyState == this.DONE) {
                        if (callback)
                            callback(parseInt(this.getResponseHeader("Content-Length")));
                    }
                };
                this.http.send();
            };
            WebRequest.prototype.RequestHeader = function (url, callback) {
                this.http.open("HEAD", url, true);
                this.http.onreadystatechange = function () {
                    if (this.readyState == this.DONE) {
                        if (callback) {
                            var h = this.getAllResponseHeaders().split('\r\n');
                            var t = [];
                            for (var i = h.length - 1; i >= 0; i--) {
                                var p = h[i];
                                if (p) {
                                    var vk = p.split(': ');
                                    t.push(new Header(vk[0], vk[1]));
                                }
                            }
                            callback(t);
                        }
                    }
                };
                this.http.send();
            };
            Object.defineProperty(WebRequest.prototype, "Response", {
                get: function () {
                    return this.http.response;
                },
                enumerable: true,
                configurable: true
            });
            WebRequest.prototype.GetHeader = function (name) {
                return this.http.getResponseHeader(name);
            };
            WebRequest.prototype.GetHeaders = function () {
                return this.http.getAllResponseHeaders();
            };
            return WebRequest;
        }());
        net.WebRequest = WebRequest;
        var RequestParams = (function () {
            function RequestParams(callback, data, isPrivate) {
                this.callback = callback;
                this.data = data;
                this.isPrivate = isPrivate;
                this.IsSuccess = null;
                if (isPrivate == void 0)
                    this.isPrivate = false;
            }
            RequestParams.prototype.Callback = function (sender, result) {
                if (this.callback)
                    this.callback(sender, result);
            };
            return RequestParams;
        }());
        net.RequestParams = RequestParams;
        var Request = (function () {
            function Request(url, data, params) {
                this.url = url;
                this.data = data;
                this.params = params;
                this.fail = undefined;
            }
            return Request;
        }());
        net.Request = Request;
        var QueeDownloader = (function () {
            function QueeDownloader(crypt) {
                this.crypt = crypt;
                this.quee = [];
                this.isRunning = false;
                this.isDownloading = false;
                this.OnSuccess = new Corelib_6.bind.EventListener(1);
                this.OnFail = new Corelib_6.bind.EventListener(1);
                this.OnFinish = new Corelib_6.bind.EventListener(1);
                this.webr = new net.WebRequest(crypt);
                this.webr.setResponseType(net.ResponseType.text);
                this.webr.OnComplete.Add(this.DownloadComplete.bind(this), "DCT");
            }
            Object.defineProperty(QueeDownloader.prototype, "Uid", {
                set: function (v) { this.webr.Uid = v; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QueeDownloader.prototype, "Pwd", {
                set: function (v) { this.webr.Pwd = v; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QueeDownloader.prototype, "Request", {
                get: function () { return this.webr; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QueeDownloader.prototype, "Crypto", {
                set: function (v) {
                    this.webr.Crypto = v;
                },
                enumerable: true,
                configurable: true
            });
            QueeDownloader.prototype.OnError = function () {
                this.isDownloading = false;
                if (this.current) {
                    var ip = true;
                    var c = this.current.data;
                    if (c instanceof RequestParams) {
                        c.IsSuccess = false;
                        runtime_7.helper.TryCatch(c, c.Callback, void 0, [this, this.webr]);
                        ip = !(c.isPrivate);
                    }
                    if (ip)
                        this.OnFail.PInvok(1, [this, c], this);
                }
                this.Next();
            };
            QueeDownloader.prototype.DownloadComplete = function (xmlRequest) {
                this.isDownloading = false;
                var x = this.webr.IsSuccess ? this.OnSuccess : this.OnFail;
                if (this.current) {
                    var ip = true;
                    var c = this.current.data;
                    if (c instanceof RequestParams) {
                        c.IsSuccess = this.webr.IsSuccess;
                        runtime_7.helper.TryCatch(c, c.Callback, void 0, [this, this.webr]);
                        ip = !(c.isPrivate);
                    }
                    if (ip)
                        x.PInvok(1, [this, c], this);
                }
                this.Next();
            };
            QueeDownloader.prototype.Push = function (url, data, params) {
                this.quee.push(new Request(url, data, params));
                if (!this.isRunning)
                    this.Start();
            };
            QueeDownloader.prototype.Insert = function (dcall) {
                this.quee.push(dcall);
                if (!this.isRunning)
                    this.Start();
            };
            QueeDownloader.prototype.Start = function () {
                if (this.isDownloading)
                    return;
                this.isRunning = true;
                this.Next();
            };
            QueeDownloader.prototype.Next = function () {
                if (0 == this.quee.length) {
                    this.isRunning = false;
                    this.isDownloading = false;
                    var ___this = this;
                    this.OnFinish.Invoke(1, [___this, ___this.current.data]);
                    return;
                }
                try {
                    this.webr.Download2(this.current = this.quee.shift());
                    this.isDownloading = true;
                }
                catch (e) {
                    this.isDownloading = false;
                    this.OnError();
                }
            };
            QueeDownloader.prototype.Restart = function () {
                this.isDownloading = false;
                this.Start();
            };
            return QueeDownloader;
        }());
        net.QueeDownloader = QueeDownloader;
    })(net = exports.net || (exports.net = {}));
    (function (net) {
        var RequestUrl = (function () {
            function RequestUrl(_url, context, Header, Method, HasBody, ResponseType) {
                this._url = _url;
                this.context = context;
                this.Header = Header;
                this.Method = Method;
                this.HasBody = HasBody;
                this.ResponseType = ResponseType;
                if (Method == undefined)
                    this.Method = net.WebRequestMethod.Get;
            }
            Object.defineProperty(RequestUrl.prototype, "Url", {
                get: function () {
                    if (this.context)
                        return this.context.GetPath(this._url);
                    return this._url;
                },
                set: function (v) { this._url = v; },
                enumerable: true,
                configurable: true
            });
            return RequestUrl;
        }());
        net.RequestUrl = RequestUrl;
        function New() {
            if (_guid == null || _guid >= _end) {
                var x = Date.now() * 100000 + Math.floor(Math.random() * 775823);
                return x < runtime_7.helper.MaxSafeInteger ? x : (Date.now() * 10000) / 10000 | (Math.random() * 771);
            }
            else {
                if (_guid >= _end - 300)
                    GuidManager.update();
                return _guid++;
            }
        }
        net.New = New;
    })(net = exports.net || (exports.net = {}));
    var _guid = null;
    var _end = null;
    var GuidManager = (function () {
        function GuidManager(vars) {
            this.vars = vars;
        }
        Object.defineProperty(GuidManager, "current", {
            get: function () {
                return _guid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GuidManager, "isValid", {
            get: function () {
                return _guid !== 0 && _guid < _end;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GuidManager, "Next", {
            get: function () {
                return ++_guid;
            },
            enumerable: true,
            configurable: true
        });
        GuidManager.New = function (callback, pram) {
            if (_guid !== 0 && _guid < _end)
                callback(++_guid, pram);
            else {
                this.update(callback, pram);
            }
        };
        GuidManager.update = function (callback, pram) {
            if (this.t != null)
                return;
            this.t = new net.WebRequest(null);
            this.t.Download({ Url: '/~Guid', HasBody: false, Method: net.WebRequestMethod.Get }, callback);
            this.t.OnComplete.On = function (e) {
                GuidManager.t.Dispose();
                GuidManager.t = null;
                callback && callback(++_guid, pram);
            };
        };
        return GuidManager;
    }());
    exports.GuidManager = GuidManager;
    function setGuidRange(start, end) {
        _guid = start;
        _end = end;
    }
    exports.setGuidRange = setGuidRange;
});
define("sys/System", ["require", "exports", "sys/Corelib", "context", "sys/Encoding", "sys/net", "sys/utils", "sys/collections"], function (require, exports, Corelib_7, context_5, Encoding_1, net_1, utils_4, collections_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var _services = {};
    var _defualt;
    var apis = new collections_4.collection.Dictionary("Apis", false);
    var Controller;
    (function (Controller) {
        function Register(service) {
            Object.freeze(service);
            Object.defineProperty(_services, service.Name, {
                configurable: false,
                enumerable: false,
                value: service,
                writable: false
            });
        }
        Controller.Register = Register;
        function decorator(ClassDefinition) {
            return ClassDefinition;
        }
        Controller.decorator = decorator;
        var Api = (function () {
            function Api(reg) {
                this._methodsShema = {};
                apis.Set(this.GetType(), this);
            }
            Api.prototype.Register = function (method) {
                method.Name = method.Name.toUpperCase();
                if (typeof method.ParamsFormat === 'string')
                    method.ParamsFormat = utils_4.basic.CompileString(method.ParamsFormat);
                this._methodsShema[method.Name] = method;
            };
            Api.prototype.ERegister = function (method, name, paramsFormat, sendData) {
                this.Register({ Method: method, Name: name, ParamsFormat: paramsFormat && utils_4.basic.CompileString(paramsFormat), SendData: sendData });
            };
            Api.prototype.GetMethodShema = function (m) {
                if (typeof m === 'string')
                    return this._methodsShema[m.toUpperCase()];
                if (typeof m === 'number') {
                    var x = this._methodsShema[net_1.net.WebRequestMethod[m].toUpperCase()];
                    if (x != null)
                        return x;
                    for (var i in this._methodsShema) {
                        var v = this._methodsShema[i];
                        if (v.Method === m)
                            return v;
                    }
                    return;
                }
                else if (m) {
                    if (!m.Name)
                        return m;
                }
                for (var i in this._methodsShema) {
                    return this._methodsShema[i];
                }
            };
            return Api;
        }());
        Controller.Api = Api;
        var CostumeApi = (function (_super) {
            __extends(CostumeApi, _super);
            function CostumeApi(_type, _getRequest, _onResponse) {
                var _this = _super.call(this) || this;
                _this._type = _type;
                _this._getRequest = _getRequest;
                _this._onResponse = _onResponse;
                return _this;
            }
            CostumeApi.prototype.GetType = function () { return this._type; };
            CostumeApi.prototype.GetRequest = function (data) { return this._getRequest(data); };
            CostumeApi.prototype.OnResponse = function (response, data) { return this._onResponse(response, data); };
            return CostumeApi;
        }(Api));
        Controller.CostumeApi = CostumeApi;
        var mt;
        function messageType() { return mt || (mt = context_5.context.GetType('models.Message')); }
        var ProxyCallback = (function (_super) {
            __extends(ProxyCallback, _super);
            function ProxyCallback(data, param, api, context, callBack, method) {
                var _this = _super.call(this, null, data, true) || this;
                _this.param = param;
                _this.api = api;
                _this.context = context;
                _this.callBack = callBack;
                _this.method = method;
                return _this;
            }
            ProxyCallback.parse = function (json) {
                if (json == null || json.trim() == "")
                    return null;
                try {
                    return JSON.parse(json);
                }
                catch (e) {
                    return null;
                }
            };
            ProxyCallback.prototype.Callback = function (sender, result) {
                var iss = true;
                try {
                    var r = sender.Request.IsSuccess ? ProxyCallback.parse(result.Response) : null;
                    if (r && r.hasOwnProperty('__service__')) {
                        var sr = r;
                        if (sr.__service__) {
                            var s = _services[sr.__service__];
                            if (s)
                                s.OnResponse(this, sender, sr);
                            if (sr.dropRequest)
                                return;
                        }
                        iss = sr.iss;
                        r = sr.rdata;
                    }
                    if (this.api)
                        this.api.OnResponse(r, this.data, this.context || Encoding_1.encoding.SerializationContext.GlobalContext);
                }
                catch (ee) {
                    iss = false;
                }
                if (this.callBack)
                    this.callBack(this, r, iss && this.IsSuccess, result);
            };
            ProxyCallback.prototype.OutputData = function () {
                if ('string' === typeof this.data)
                    return this.data;
                if (this.data instanceof ArrayBuffer)
                    return this.data;
                var r = this.context == null;
                var e = r ? new Encoding_1.encoding.SerializationContext(true) : this.context.reset();
                var d = e.ToJson(this.data);
                if (r)
                    e.Dispose();
                return JSON.stringify(d);
            };
            return ProxyCallback;
        }(net_1.net.RequestParams));
        Controller.ProxyCallback = ProxyCallback;
        var ProxyData = (function () {
            function ProxyData(crpt, isCostume) {
                this.quee = [];
                if (_defualt != null)
                    throw null;
                this.http = new net_1.net.QueeDownloader(crpt);
                this.apis = isCostume ? new collections_4.collection.Dictionary("Apis", false) : apis;
            }
            ProxyData.prototype.SetAuth = function (uid, pwd) {
                this.http.Uid = uid;
                this.http.Pwd = pwd;
            };
            Object.defineProperty(ProxyData.prototype, "Crypto", {
                set: function (v) {
                    this.http.Crypto = v;
                },
                enumerable: true,
                configurable: true
            });
            ProxyData.prototype.Register = function (api) {
                this.apis.Set(api.GetType(), api);
            };
            ProxyData.getMethod = function (api, m) {
                if (typeof m === 'number')
                    return m;
                if (typeof m === 'string') {
                    var x = api.GetMethodShema(m);
                    return x ? x.Method : 0;
                }
                if (x.Name)
                    return net_1.net.WebRequestMethod[m.Name] || 0;
                return 0;
            };
            ProxyData.prototype.Costume = function (url, data, parms, callback, objectStat) {
                return this.http.Push(url, new ProxyCallback(data, objectStat, void 0, Encoding_1.encoding.SerializationContext.GlobalContext, callback), parms);
            };
            ProxyData.prototype.Request = function (type, method, data, params, callback, costumize, beforRequest, objectStat) {
                var api = this.apis.Get(type != null ? type : data.constructor);
                var t = new ProxyCallback(data, objectStat, api, Encoding_1.encoding.SerializationContext.GlobalContext, callback, ProxyData.getMethod(api, method));
                var req = api.GetRequest(data, method, params);
                req.beforRequest = beforRequest;
                if (costumize)
                    costumize(req, t);
                this.http.Push(req, t, null);
            };
            ProxyData.prototype.Push = function (type, data, param, callBack, method, costumize, serializer, beforRequest, params) {
                var api = this.apis.Get(type != null ? type : data.constructor);
                var t = new ProxyCallback(data, param, api, serializer || new Encoding_1.encoding.SerializationContext(true) || Encoding_1.encoding.SerializationContext.GlobalContext, callBack);
                var req = api.GetRequest(data, null, params);
                req.HasBody = true;
                req.beforRequest = beforRequest;
                if (method != undefined)
                    req.Method = method;
                if (costumize)
                    costumize(req, t);
                this.http.Push(req, t, params);
            };
            ProxyData.prototype.Post = function (type, data, param, callBack, costumize, serializer, params) {
                var api = this.apis.Get(type != null ? type : data.constructor);
                var t = new ProxyCallback(data, param, api, serializer || Encoding_1.encoding.SerializationContext.GlobalContext, callBack);
                var req = api.GetRequest(data, null, params);
                req.HasBody = true;
                req.Method = net_1.net.WebRequestMethod.Post;
                if (costumize)
                    costumize(req, t);
                this.http.Push(req, t, params);
            };
            ProxyData.prototype.Put = function (type, data, param, callBack, costumize, serializer, params) {
                var api = this.apis.Get(type != null ? type : data.constructor);
                var t = new ProxyCallback(data, param, api, serializer || Encoding_1.encoding.SerializationContext.GlobalContext, callBack);
                var req = api.GetRequest(data, null, params);
                req.HasBody = true;
                req.Method = net_1.net.WebRequestMethod.Put;
                if (costumize)
                    costumize(req, t);
                this.http.Push(req, t, params);
            };
            ProxyData.prototype.Get = function (type, data, param, callBack, costumize, serializer, params) {
                var api = this.apis.Get(type != null ? type : data.constructor);
                var t = new ProxyCallback(data, param, api, serializer || Encoding_1.encoding.SerializationContext.GlobalContext, callBack);
                var req = api.GetRequest(data, null, params);
                req.Method = net_1.net.WebRequestMethod.Get;
                if (costumize)
                    costumize(req, t);
                this.http.Push(req, t, params);
            };
            ProxyData.prototype.Delete = function (type, data, param, callBack, costumize, serializer, params) {
                var api = this.apis.Get(type != null ? type : data.constructor);
                var t = new ProxyCallback(data, param, api, serializer || Encoding_1.encoding.SerializationContext.GlobalContext, callBack);
                var req = api.GetRequest(data, null, params);
                req.Method = net_1.net.WebRequestMethod.Delete;
                if (costumize)
                    costumize(req, t);
                this.http.Push(req, t, params);
                return req;
            };
            Object.defineProperty(ProxyData, "Default", {
                get: function () { return _defualt || (_defualt = new ProxyData(utils_4.basic.Crypto, false)); },
                enumerable: true,
                configurable: true
            });
            return ProxyData;
        }());
        Controller.ProxyData = ProxyData;
    })(Controller = exports.Controller || (exports.Controller = {}));
    var sdata;
    (function (sdata) {
        var DataStat;
        (function (DataStat) {
            DataStat[DataStat["IsNew"] = 0] = "IsNew";
            DataStat[DataStat["Modified"] = 1] = "Modified";
            DataStat[DataStat["Saved"] = 2] = "Saved";
            DataStat[DataStat["Updating"] = 4] = "Updating";
            DataStat[DataStat["Uploading"] = 8] = "Uploading";
            DataStat[DataStat["Updated"] = 16] = "Updated";
            DataStat[DataStat["Frozed"] = 32] = "Frozed";
        })(DataStat = sdata.DataStat || (sdata.DataStat = {}));
        var dic = new collections_4.collection.Dictionary('sd');
        var DataRow = (function (_super) {
            __extends(DataRow, _super);
            function DataRow(id) {
                var _this = _super.call(this) || this;
                var st = _this.getStore();
                if (id && st) {
                    if (st.Get(id) != null)
                        return st.Get(id);
                    _this.set(DataRow.DPId, id);
                }
                return _this;
            }
            Object.defineProperty(DataRow.prototype, "Stat", {
                get: function () { return this.get(DataRow.DPStat); },
                set: function (s) { this.set(DataRow.DPStat, s); },
                enumerable: true,
                configurable: true
            });
            DataRow.CreateFromJson = function (json, type, requireNew) {
                if (requireNew)
                    return null;
                var id = (typeof json === 'number' ? json : json.Id);
                if (!requireNew)
                    if (typeof id === 'number')
                        var x = type.getById(id, type);
                if (!x) {
                    var c = dic.Get(type);
                    if (c)
                        x = c.CreateNew(id);
                    if (!x)
                        x = new type(id);
                }
                return x;
            };
            DataRow.prototype.OnIdChanged = function (old, nw) {
                var store = this.getStore();
                if (old)
                    store.Remove(old);
                if (nw)
                    store.Set(nw, this);
            };
            Object.defineProperty(DataRow.prototype, "Id", {
                get: function () {
                    return this.get(DataRow.DPId);
                },
                set: function (v) {
                    this.set(DataRow.DPId, v);
                },
                enumerable: true,
                configurable: true
            });
            DataRow.__fields__ = function () {
                return [
                    DataRow.DPId, this.DPLastModified, DataRow.DPStat
                ];
            };
            DataRow.getById = function (id, type) {
                return undefined;
            };
            DataRow.prototype.FromJson = function (json, context, update) {
                var _this = this;
                if (typeof json === 'number') {
                    if (this.Stat >= DataStat.Updating)
                        return this;
                    this.Id = json;
                    this.set(DataRow.DPStat, DataStat.Updating);
                    Controller.ProxyData.Default.Request(this.constructor, "UPDATE", this, this, function () { if (_this.Stat > DataStat.Updating) {
                        return false;
                    } return true; });
                }
                else {
                    this.set(DataRow.DPStat, DataStat.Updated);
                    _super.prototype.FromJson.call(this, json, context, update);
                    if (json != null && json.IsFrozen == true) {
                        this.Freeze();
                    }
                }
                return this;
            };
            Object.defineProperty(DataRow.prototype, "TableName", {
                get: function () {
                    return context_5.context.NameOf(this.constructor).replace("models.", "");
                },
                enumerable: true,
                configurable: true
            });
            DataRow.DPId = Corelib_7.bind.DObject.CreateField("Id", Number, 0, function (e) {
                e.__this.OnIdChanged(e._old, e._new);
            }, function (e) {
                if (e._new == null || e._new === 0)
                    e._new = net_1.net.New();
            }, Corelib_7.bind.PropertyAttribute.IsKey);
            DataRow.DPStat = Corelib_7.bind.DObject.CreateField("Stat", Number, 0, null, null, Corelib_7.bind.PropertyAttribute.Private | Corelib_7.bind.PropertyAttribute.NonSerializable);
            DataRow.DPLastModified = Corelib_7.bind.DObject.CreateField("LastModified", Date);
            return DataRow;
        }(Corelib_7.bind.DObject));
        sdata.DataRow = DataRow;
        var QShopRow = (function (_super) {
            __extends(QShopRow, _super);
            function QShopRow(id) {
                return _super.call(this, id) || this;
            }
            QShopRow.__fields__ = function () { return []; };
            QShopRow.prototype.GenType = function () { return QShopRow; };
            Object.defineProperty(QShopRow, "QueryApi", {
                get: function () {
                    return this._QueryApi;
                },
                enumerable: true,
                configurable: true
            });
            QShopRow.prototype.Update = function () {
            };
            QShopRow.prototype.Upload = function () {
            };
            return QShopRow;
        }(sdata.DataRow));
        sdata.QShopRow = QShopRow;
        var DataTable = (function (_super) {
            __extends(DataTable, _super);
            function DataTable(_parent, argType, ctor, array) {
                var _this = _super.call(this, argType, array) || this;
                _this._parent = _parent;
                _this.ctor = ctor;
                _this.Owner = _parent;
                return _this;
            }
            DataTable.__fields__ = function () {
                return [DataTable.DPOwner];
            };
            Object.defineProperty(DataTable.prototype, "Owner", {
                get: function () { return this.get(DataTable.DPOwner); },
                set: function (v) { this.set(DataTable.DPOwner, v); },
                enumerable: true,
                configurable: true
            });
            DataTable.prototype.CreateNewItem = function (id) {
                return DataRow.getById(id, this.ArgType) || this.ctor(id);
            };
            DataTable.prototype.FromJson = function (json, x, update, callback) {
                if (this.Stat == sdata.DataStat.Frozed)
                    return;
                this.set(DataTable.DPStat, DataStat.Updating);
                var obj = _super.prototype.FromJson.call(this, json, x, update, callback);
                this.set(DataTable.DPStat, DataStat.Updated);
                if (json == null)
                    return this;
                if (json != null && json.IsFrozen == true)
                    this.Freeze();
                return this;
            };
            DataTable.prototype.GetById = function (id) {
                var t = this.AsList();
                var _ = DataRow.DPId;
                for (var i = 0, l = t.length; i < l; i++)
                    if (t[i].GetValue(_) === id)
                        return t[i];
                return undefined;
            };
            DataTable.prototype.Update = function () {
            };
            DataTable.prototype.Upload = function () {
            };
            DataTable.prototype.Add = function (item) {
                return (this._list.indexOf(item) == -1) ? _super.prototype.Add.call(this, item) : this;
            };
            DataTable.prototype.FromCsv = function (input, context, parser) {
                var csv = new Encoding_1.serialization.CSV(input, true, true);
                var key = csv.ColumnIndex("Id");
                if (key == -1)
                    key = void 0;
                context = context || Encoding_1.encoding.SerializationContext.GlobalContext;
                var lst = [];
                while (csv.Next(parser)) {
                    var c = csv.Current;
                    var t = this.CreateNewItem(key === void 0 ? net_1.net.New() : c.Id || net_1.net.New());
                    lst.push(t.FromJson(c, context));
                }
                this.AddRange(lst);
            };
            DataTable.DPOwner = DataTable.CreateField('Owner', DataRow, null, null, null, Corelib_7.bind.PropertyAttribute.SerializeAsId);
            DataTable.DPStat = Corelib_7.bind.DObject.CreateField('Stat', Number, 0, null, null, Corelib_7.bind.PropertyAttribute.Private);
            return DataTable;
        }(collections_4.collection.List));
        sdata.DataTable = DataTable;
        var stp = true;
    })(sdata = exports.sdata || (exports.sdata = {}));
    var base;
    (function (base) {
        var DateVecteur = (function (_super) {
            __extends(DateVecteur, _super);
            function DateVecteur() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(DateVecteur.prototype, "From", {
                get: function () { return this.get(DateVecteur.DPFrom); },
                set: function (v) { this.set(DateVecteur.DPFrom, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DateVecteur.prototype, "To", {
                get: function () { return this.get(DateVecteur.DPTo); },
                set: function (v) { this.set(DateVecteur.DPTo, v); },
                enumerable: true,
                configurable: true
            });
            DateVecteur.__fields__ = function () { return [DateVecteur.DPFrom, DateVecteur.DPTo]; };
            DateVecteur.prototype.Check = function (date) {
                if (!sdata)
                    return true;
                var f = this.From;
                var t = this.To;
                var val = date.getTime();
                return (f == null || f.getTime() <= val) && (t == null || t.getTime() >= val);
            };
            DateVecteur.DPFrom = Corelib_7.bind.DObject.CreateField('From', Date);
            DateVecteur.DPTo = Corelib_7.bind.DObject.CreateField('To', Date);
            return DateVecteur;
        }(Corelib_7.bind.DObject));
        base.DateVecteur = DateVecteur;
        var NumberVecteur = (function (_super) {
            __extends(NumberVecteur, _super);
            function NumberVecteur() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(NumberVecteur.prototype, "From", {
                get: function () { return this.get(NumberVecteur.DPFrom); },
                set: function (v) { this.set(NumberVecteur.DPFrom, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NumberVecteur.prototype, "To", {
                get: function () { return this.get(NumberVecteur.DPTo); },
                set: function (v) { this.set(NumberVecteur.DPTo, v); },
                enumerable: true,
                configurable: true
            });
            NumberVecteur.__fields__ = function () { return [NumberVecteur.DPFrom, NumberVecteur.DPTo]; };
            NumberVecteur.prototype.Check = function (val) {
                if (!val)
                    return true;
                return (this.From == null || this.From <= val) && (this.To == null || this.To >= val);
            };
            NumberVecteur.DPFrom = Corelib_7.bind.DObject.CreateField('From', Number);
            NumberVecteur.DPTo = Corelib_7.bind.DObject.CreateField('To', Number);
            return NumberVecteur;
        }(Corelib_7.bind.DObject));
        base.NumberVecteur = NumberVecteur;
    })(base = exports.base || (exports.base = {}));
});
define("sys/QModel", ["require", "exports", "sys/System", "sys/Corelib", "sys/collections", "sys/net"], function (require, exports, System_1, Corelib_8, collections_5, net_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var models;
    (function (models) {
        var MessageType;
        (function (MessageType) {
            MessageType[MessageType["Info"] = 0] = "Info";
            MessageType[MessageType["Error"] = 1] = "Error";
            MessageType[MessageType["Command"] = 2] = "Command";
            MessageType[MessageType["Confirm"] = 3] = "Confirm";
        })(MessageType = models.MessageType || (models.MessageType = {}));
        var CallBackMessage = (function () {
            function CallBackMessage() {
            }
            return CallBackMessage;
        }());
        models.CallBackMessage = CallBackMessage;
        var Message = (function (_super) {
            __extends(Message, _super);
            function Message(id, message) {
                var _this = _super.call(this, id || net_2.net.New()) || this;
                _this.Content = message;
                return _this;
            }
            Message.getById = function (id, type) {
                return Message.pstore.Get(id);
            };
            Message.prototype.getStore = function () { return Message.pstore; };
            Message.pstore = new collections_5.collection.Dictionary("Messages", true);
            __decorate([
                Corelib_8.bind.property1(Object),
                __metadata("design:type", String)
            ], Message.prototype, "Data", void 0);
            __decorate([
                Corelib_8.bind.property1(String, { attribute: Corelib_8.bind.PropertyAttribute.NonSerializable, defaultValue: "" }),
                __metadata("design:type", String)
            ], Message.prototype, "Content", void 0);
            __decorate([
                Corelib_8.bind.property1(String, { attribute: Corelib_8.bind.PropertyAttribute.NonSerializable, defaultValue: "" }),
                __metadata("design:type", String)
            ], Message.prototype, "Title", void 0);
            __decorate([
                Corelib_8.bind.property1(String, { attribute: Corelib_8.bind.PropertyAttribute.NonSerializable }),
                __metadata("design:type", String)
            ], Message.prototype, "OKText", void 0);
            __decorate([
                Corelib_8.bind.property1(Number, { attribute: Corelib_8.bind.PropertyAttribute.NonSerializable, defaultValue: MessageType.Info }),
                __metadata("design:type", Number)
            ], Message.prototype, "Type", void 0);
            __decorate([
                Corelib_8.bind.property1(String),
                __metadata("design:type", String)
            ], Message.prototype, "Action", void 0);
            __decorate([
                Corelib_8.bind.property1(String, { attribute: Corelib_8.bind.PropertyAttribute.NonSerializable }),
                __metadata("design:type", String)
            ], Message.prototype, "AbortText", void 0);
            __decorate([
                Corelib_8.bind.property1(String, { attribute: Corelib_8.bind.PropertyAttribute.NonSerializable }),
                __metadata("design:type", String)
            ], Message.prototype, "CancelText", void 0);
            return Message;
        }(System_1.sdata.QShopRow));
        models.Message = Message;
    })(models = exports.models || (exports.models = {}));
});
define("sys/db", ["require", "exports", "sys/Corelib", "sys/collections", "sys/System", "context", "sys/runtime", "sys/utils", "sys/net", "sys/Encoding"], function (require, exports, Corelib_9, collections_6, System_2, context_6, runtime_8, utils_5, net_3, Encoding_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var db;
    (function (db_1) {
        var __SUPPORT_OPENDATABASE__ = typeof openDatabase === 'function';
        var Database = (function () {
            function Database() {
                this.databaseName = "data_store";
                this.databaseDesc = "Data store";
                this.sqlLiteDBVersion = "1.0";
                this.FIVE_MB = 5120;
                this.tableName = "data-store";
                this._tables__ = new _Tables__(this);
                this.shemas = new DatabaseTable(this, "__tables__", _Table__);
                this.OnLoad = new Corelib_9.bind.FEventListener(0, true);
                this.queue = [];
                this._commands = [];
                this._current = { value: null };
                this._IsExecuting = false;
                this._job = runtime_8.thread.Dispatcher.cretaeJob(this._runCmd, [], this, false);
                this._store = {};
                this.__info__ = new DatabaseTable(this, '__info__', __ExeInfo__);
            }
            Database.prototype.initialize = function () {
                var _this_1 = this;
                if (!__SUPPORT_OPENDATABASE__)
                    return this;
                this.database = openDatabase(this.databaseName, this.sqlLiteDBVersion, this.databaseDesc, this.FIVE_MB);
                this._transaction = this._transaction.bind(this);
                this._OnError = this._OnError.bind(this);
                this._OnSuccess = this._OnSuccess.bind(this);
                this.shemas.CreateIfNotExist(function (ise, s) {
                    _this_1.__info__.CreateIfNotExist(function (iss, s) {
                        _this_1.shemas.LoadTableFromDB(_this_1._tables__, function (succ) {
                            _this_1.IsLoaded = true;
                            _this_1.OnLoad.PInvok(0, [_this_1], _this_1);
                        });
                    });
                });
                return this;
            };
            Database.prototype.Push = function (cmd) {
                var _this_1 = this;
                if (!__SUPPORT_OPENDATABASE__)
                    return;
                if (cmd.async) {
                    this.queue.push(cmd);
                    if (this.isExecuting)
                        return;
                    this.queue = [];
                    this.isExecuting = true;
                    var oldQuee = this.queue;
                    this.database.transaction(function (db) {
                        for (var i = 0; i < _this_1.queue.length; i++) {
                            if (typeof _this_1.queue[i].cmd === 'string')
                                _this_1._exeScalSQL(db, _this_1.queue[i]);
                            else
                                _this_1._exeVectorSQL(db, _this_1.queue[i]);
                        }
                        _this_1.isExecuting = false;
                    }, function (err) {
                        for (var i = 0; i < oldQuee.length; i++) {
                            var q = oldQuee[i];
                            if (typeof q.cmd === 'string')
                                q.callback && q.callback(false, _this_1, err);
                            else
                                q.callback && q.callback(0, false, _this_1, err);
                        }
                    });
                }
                else {
                    this.database.transaction(function (db) {
                        if (typeof cmd.cmd === 'string')
                            _this_1._exeScalSQL(db, cmd);
                        else
                            _this_1._exeVectorSQL(db, cmd);
                    }, function (err) {
                        if (typeof cmd.cmd === 'string')
                            cmd.callback && cmd.callback(false, _this_1, err);
                        else
                            cmd.callback && cmd.callback(0, false, _this_1, err);
                    });
                }
            };
            Database.prototype.execute = function (async, command, callback) {
                this.Push({ cmd: command, callback: callback, async: async });
            };
            Database.prototype._exeScalSQL = function (db, cmd) {
                var _this_1 = this;
                db.executeSql(cmd.cmd, [], cmd.callback ? function (s, r) { cmd.callback(true, _this_1, s, r); cmd.callback = undefined; } : void 0);
            };
            Database.prototype._exeVectorSQL = function (db, cmd) {
                var _this_1 = this;
                var j = -1;
                var _callback = cmd.callback ? function (s, r) {
                    j++;
                    cmd.callback && cmd.callback(j, true, _this_1, s, r);
                    if (j == commands.length - 1)
                        cmd.callback = undefined;
                } : void 0;
                var commands = cmd.cmd;
                for (var i = 0; i < commands.length; i++)
                    db.executeSql(commands[i], [], _callback);
            };
            Database.prototype.executes = function (async, commands, callback) {
                this.Push({ async: async, cmd: commands, callback: callback });
            };
            Database.prototype.syncExecute = function (command, callback) {
                if (!__SUPPORT_OPENDATABASE__)
                    return;
                this._Push({ cmd: command, callback: callback });
            };
            Database.prototype._Push = function (cmd) {
                this._commands.push(cmd);
                if (!this._IsExecuting)
                    return this._next();
            };
            Database.prototype._runCmd = function () {
                this.database.transaction(this._transaction, this._OnError);
            };
            Database.prototype._transaction = function (db) {
                db.executeSql(this._current.value.cmd, [], this._OnSuccess);
            };
            Database.prototype._OnSuccess = function (sql, rslt) {
                try {
                    this._current.value.callback && this._current.value.callback(true, this, sql, rslt);
                }
                catch (e) {
                }
                this._next();
            };
            Database.prototype._OnError = function (sqlE) {
                try {
                    this._current.value.callback && this._current.value.callback(false, this, sqlE);
                }
                catch (e) {
                }
                this._next();
            };
            Database.prototype._next = function () {
                if (this._commands.length === 0) {
                    this._IsExecuting = false;
                    return;
                }
                this._IsExecuting = true;
                this._current.value = this._commands.pop();
                runtime_8.thread.Dispatcher.Push(this._job, [this._current]);
            };
            Database.prototype.CreateTable = function (name, rowType) {
                if (!__SUPPORT_OPENDATABASE__)
                    return this;
                var x = new DatabaseTable(this, name, rowType);
                var tbl = {
                    table: x,
                    info: this._tables__.gettableByName(name, rowType),
                    _dbInfo_: this.shemas
                };
                x.CreateIfNotExist();
                this._store[name] = tbl;
                return this;
            };
            Database.prototype.Get = function (tableName) {
                return this._store[tableName];
            };
            Database.prototype.MakeUpdate = function (tableName, date) {
                if (!__SUPPORT_OPENDATABASE__)
                    return;
                if (date == null)
                    date = 0;
                if (typeof date !== 'number')
                    date = date.valueOf();
                var q = this._store[tableName];
                if (!q)
                    return;
                q.info.LastUpdate = date;
                q._dbInfo_.ExecuteOperation({ op: Operation.Update, row: q.info }, function (a, b, c, d) {
                });
            };
            return Database;
        }());
        db_1.Database = Database;
        var SQLInstructureBuilder = (function () {
            function SQLInstructureBuilder(tableName, type) {
                this.tableName = tableName;
                this.type = type;
                this._map = {};
                this.init();
            }
            Object.defineProperty(SQLInstructureBuilder.prototype, "Key", {
                get: function () {
                    return this._key;
                },
                enumerable: true,
                configurable: true
            });
            SQLInstructureBuilder.prototype.init = function () {
                var flds = Corelib_9.bind.DObject.getFields(this.type);
                for (var i = 0; i < flds.length; i++) {
                    var fld = flds[i];
                    if (fld.IsKey)
                        this._key = fld;
                    this._map[fld.Name] = fld.Type;
                }
                this.cretaeCmd = this.getCreateCmd();
                this.insertCmd = this.getInsertCmd();
                this.updateCmd = this.getUpdateCmd();
                this.selectCmd = this.getSelectCmd();
                this.deleteCmd = this.getDeleteCmd();
            };
            SQLInstructureBuilder.prototype.getSB = function (s) {
                return utils_5.basic.CompileString(s, this.getDbValue, this);
            };
            SQLInstructureBuilder.prototype.getCreateCmd = function () {
                var flds = Corelib_9.bind.DObject.getFields(this.type);
                var s = "CREATE TABLE IF NOT EXISTS [" + this.tableName + "] (";
                for (var i = 0; i < flds.length; i++) {
                    var fld = flds[i];
                    var type = this.getTypeName(fld.Type);
                    if (type == undefined) {
                        console.error("Filed [" + fld.Name + "] of table " + this.tableName + " cannot be created");
                        continue;
                    }
                    if (i !== 0)
                        s += ",";
                    s += "[" + fld.Name + "] " + type + ((fld.Attribute & Corelib_9.bind.PropertyAttribute.IsKey) === Corelib_9.bind.PropertyAttribute.IsKey ? " PRIMARY KEY" : " ");
                }
                s += ")";
                return this.getSB(s);
            };
            SQLInstructureBuilder.prototype.getInsertCmd = function () {
                var flds = Corelib_9.bind.DObject.getFields(this.type);
                var names = "", values = "";
                for (var i = 0; i < flds.length; i++) {
                    var fld = flds[i];
                    if (i !== 0) {
                        names += ",";
                        values += ",";
                    }
                    names += "[" + fld.Name + "]";
                    values += "@" + fld.Name;
                }
                return this.getSB("INSERT INTO [" + this.tableName + "] (" + names + ") VALUES (" + values + ')');
            };
            SQLInstructureBuilder.prototype.getUpdateCmd = function () {
                var flds = Corelib_9.bind.DObject.getFields(this.type);
                var inst = "";
                var key = null;
                for (var i = 0; i < flds.length; i++) {
                    var fld = flds[i];
                    if (i !== 0)
                        inst += ",";
                    if (!key && fld.IsKey)
                        key = fld;
                    inst += "[" + fld.Name + "] = @" + fld.Name + "";
                }
                inst = "UPDATE [" + this.tableName + "] SET " + inst + " WHERE [" + key.Name + "] = @" + key.Name;
                return this.getSB(inst);
            };
            SQLInstructureBuilder.prototype.getSelectCmd = function () {
                return this.getSB("SELECT * FROM [" + this.tableName + "] WHERE [" + this._key.Name + "] = @" + this._key.Name + " LIMIT 1");
            };
            SQLInstructureBuilder.prototype.getDeleteCmd = function () {
                return this.getSB("DELETE FROM [" + this.tableName + "] WHERE [" + this._key.Name + "] = @" + this._key.Name);
            };
            SQLInstructureBuilder.prototype.getTypeName = function (type) {
                if (type === String)
                    return 'TEXT';
                if (type === Number || type === Date)
                    return 'Number';
                if (type === Boolean)
                    return 'Boolean';
                if (runtime_8.reflection.IsInstanceOf(type, System_2.sdata.DataRow))
                    return 'number';
                if (runtime_8.reflection.IsInstanceOf(type, System_2.sdata.DataTable))
                    return undefined;
                console.error("Unresolved Type = " + type, type);
                throw "unresolved type";
            };
            SQLInstructureBuilder.prototype.getDbValue = function (name, v) {
                if (v == null)
                    return 'null';
                var _this = this.params;
                var type = _this._map[name];
                switch (type) {
                    case String:
                        return v == null ? "null" : "'" + v + "'";
                    case Number:
                        return _this.getNumber(v);
                    case Boolean:
                        return v == undefined ? 'null' : v ? '1' : '0';
                    case Date:
                        return _this.getNumber(v && v.valueOf());
                    default:
                        if (runtime_8.reflection.IsInstanceOf(type, System_2.sdata.DataRow)) {
                            var id = v && v.Id;
                            if (id == null)
                                return 'null';
                            return String(id);
                        }
                        else
                            return undefined;
                }
            };
            SQLInstructureBuilder.prototype.getNumber = function (v) {
                return v == null || isNaN(v) ? 'null' : String(Math.abs(v) > Number.MAX_VALUE ? Number.MAX_VALUE : v);
            };
            SQLInstructureBuilder.parseBool = function (v) {
                if (v == null)
                    return null;
                switch (typeof v) {
                    case 'string':
                        if (v === 'true')
                            return true;
                        if (v === 'false')
                            return false;
                        v = parseFloat(v);
                        return !!v;
                    case 'number':
                        break;
                    case 'boolean':
                        return v;
                    default:
                        return !!v;
                }
            };
            SQLInstructureBuilder.prototype.getJsValue = function (name, v) {
                var _this = this.params;
                var type = _this._map[name];
                switch (type) {
                    case String:
                        return v;
                    case Number:
                        return typeof v === 'string' ? parseFloat(v) : v;
                    case Boolean:
                        return SQLInstructureBuilder.parseBool(v);
                    case Date:
                        return v === null ? SQLInstructureBuilder.emptyDate : new Date(typeof v === 'string' ? parseInt(v) : v);
                    default:
                        if (runtime_8.reflection.IsInstanceOf(type, System_2.sdata.DataRow)) {
                            var id = v && v.Id;
                            if (id == null)
                                return 'null';
                            return String(id);
                        }
                        else
                            return undefined;
                }
            };
            SQLInstructureBuilder.prototype.getAvaibleCmd = function (extCols) {
                if (extCols == null)
                    extCols = "[" + this._key.Name + "]";
                else if (extCols == '*')
                    extCols = "*";
                else if (typeof extCols !== 'string')
                    extCols = this.jointCols(extCols);
                return "SELECT " + extCols + " FROM [" + this.tableName + "]";
            };
            SQLInstructureBuilder.prototype.jointCols = function (cols) {
                if (cols.length == 0)
                    return "";
                if (cols.length == 1)
                    return "[" + cols[0] + "]";
                return "[" + cols.join("],[") + "]";
            };
            SQLInstructureBuilder.emptyDate = new Date(0);
            return SQLInstructureBuilder;
        }());
        db_1.SQLInstructureBuilder = SQLInstructureBuilder;
        var DatabaseTable = (function () {
            function DatabaseTable(database, tableName, type) {
                this.database = database;
                if (!runtime_8.reflection.IsInstanceOf(type, Corelib_9.bind.DObject))
                    throw "Type not implimented";
                this.builder = new SQLInstructureBuilder(tableName, type);
            }
            DatabaseTable.prototype.Insert = function (row, callback) {
                this.database.syncExecute(this.builder.insertCmd.apply(row), callback);
            };
            DatabaseTable.prototype.Delete = function (row, callback) {
                this.database.syncExecute(this.builder.deleteCmd.apply(row), callback);
            };
            DatabaseTable.prototype.Update = function (row, callback) {
                this.database.syncExecute(this.builder.updateCmd.apply(row), callback);
            };
            DatabaseTable.prototype.Select = function (row, callback) {
                this.database.syncExecute(this.builder.selectCmd.apply(row), callback);
            };
            DatabaseTable.prototype.Create = function (callback) {
                this.database.syncExecute(this.builder.cretaeCmd.apply({}), callback);
            };
            DatabaseTable.prototype.ExecuteOperation = function (cm, callback) {
                var _this_1 = this;
                var cmd = this.getCmd(cm);
                var reExec;
                this.database.execute(false, cmd, reExec = function (iss, sb, sql, rslt) {
                    iss = iss && !((cm.op == Operation.Update || cm.op == Operation.UpdateOnly) && rslt.rowsAffected == 0);
                    if (!iss)
                        do {
                            if (cm.op == 2)
                                cm = { op: 4, row: cm.row };
                            else if (cm.op == 1)
                                cm = { op: 5, row: cm.row };
                            else
                                break;
                            return _this_1.database.execute(false, _this_1.getCmd(cm), reExec);
                        } while (false);
                    if (cm)
                        callback && callback(iss, sb, sql, rslt);
                });
            };
            DatabaseTable.prototype.getAvaible = function (exCols, callback) {
                this.database.execute(false, this.builder.getAvaibleCmd(exCols), callback);
            };
            DatabaseTable.prototype.ExecuteOperations = function (ops, callback) {
                var _this_1 = this;
                if (ops.length == 0)
                    return callback && callback(true, 0);
                var ccmds = 0;
                var nfails = 0;
                var reExec;
                this.ExecuteOperation(ops[ccmds], reExec = function (iss, db, sql, rslt) {
                    if (!iss)
                        nfails++;
                    ccmds++;
                    if (ops.length == ccmds)
                        return callback && callback(nfails == 0, nfails);
                    else
                        _this_1.ExecuteOperation(ops[ccmds], reExec);
                });
            };
            DatabaseTable.prototype.ExecuteOperations1 = function (ops, callback) {
                var id = DatabaseTable.__count;
                if (ops.length == 0)
                    return callback && callback(true, 0);
                for (var i = 0; i < ops.length; i++) {
                    ops[i] = this.getCmd(ops[i]);
                }
                var nsuccess = [];
                var reExec;
                this.database.executes(false, ops, reExec = function (j, iss, sb, sql, rslt) {
                    if (!iss)
                        nsuccess.push(ops[j]);
                    if (j == ops.length - 1)
                        return callback && callback(nsuccess.length != 0, nsuccess.length);
                });
            };
            DatabaseTable.prototype.UpdateTableToDB = function (tbl, callback, full) {
                var _this_1 = this;
                var tbls = tbl instanceof System_2.sdata.DataTable ? tbl.AsList() : tbl;
                var toInsert = tbls.slice(0);
                var eI = toInsert.map(function (c) { return c.Id; });
                var cmds = [];
                var toSkip = 0;
                if (!full && !eI.length)
                    return;
                this.getAvaible(["Id", "LastModified"], function (iss, s, sql, rslt) {
                    if (rslt == null)
                        return console.error('HardError');
                    var rs = rslt.rows;
                    for (var i = 0; i < rs.length; i++) {
                        var dbRow = rs[i];
                        var j = eI.indexOf(dbRow.Id);
                        if (j == -1) {
                            if (full)
                                cmds.push({ row: srcRow, op: 3 });
                        }
                        else {
                            var lm = dbRow.LastModified || 0;
                            var srcRow = tbls[j];
                            if (dbRow.LastModified < srcRow.LastModified) {
                                cmds.push({ row: srcRow, op: 1 });
                            }
                        }
                        var x;
                        while ((x = toInsert.indexOf(srcRow)) != -1)
                            toInsert.splice(x, 1);
                    }
                    for (var i = 0; i < toInsert.length; i++)
                        cmds.push({ row: toInsert[i], op: 2 });
                    _this_1.ExecuteOperations1(cmds, callback);
                });
            };
            DatabaseTable.prototype.LoadTableFromDB = function (tbl, callback) {
                var _this_1 = this;
                var x = new Encoding_2.encoding.SerializationContext(true);
                this.getAvaible('*', function (iss, s, sql, rslt) {
                    if (iss) {
                        var rs = rslt.rows;
                        var i = 0;
                        var async = function () {
                            var l = i + 100;
                            if (l > rs.length)
                                l = rs.length;
                            for (; i < l; i++) {
                                var dbRow = rs[i];
                                tbl.Add(tbl.CreateNewItem(dbRow.Id).FromJson(dbRow, x));
                            }
                            if (l < rs.length)
                                runtime_8.thread.Dispatcher.call(this, async);
                            else
                                callback && callback(iss);
                        };
                        runtime_8.thread.Dispatcher.call(_this_1, async);
                    }
                    else
                        callback && callback(iss);
                });
            };
            DatabaseTable.prototype.getCmd = function (op) {
                switch (op.op) {
                    case 0:
                        return null;
                    case 1:
                    case 4:
                        return this.builder.updateCmd.apply(op.row);
                    case 2:
                    case 5:
                        return this.builder.insertCmd.apply(op.row);
                    case 3:
                        return this.builder.deleteCmd.apply(op.row);
                    default:
                }
            };
            DatabaseTable.prototype.MakeUpdate = function (date) {
                this.database.MakeUpdate(this.builder.tableName, date);
            };
            DatabaseTable.prototype.IsExist = function (callback) {
                this.database.execute(false, "SELECT * FROM [" + this.builder.tableName + "] limit 0", function (iss, db) {
                    callback && callback(iss);
                });
            };
            DatabaseTable.prototype.CreateIfNotExist = function (callback) {
                var _this_1 = this;
                this.IsExist(function (exist) {
                    if (exist) {
                        _this_1.Created = true;
                        return callback && callback(true, _this_1);
                    }
                    _this_1.Create(function (iss, db, sql) {
                        _this_1.Created = iss;
                        return callback && callback(iss, _this_1);
                    });
                });
            };
            DatabaseTable.__count = 1;
            return DatabaseTable;
        }());
        db_1.DatabaseTable = DatabaseTable;
        var _Table__ = (function (_super) {
            __extends(_Table__, _super);
            function _Table__(table) {
                var _this_1 = _super.call(this, net_3.net.New()) || this;
                _this_1.table = table;
                if (table) {
                    _this_1.Type = context_6.context.NameOf(table.builder.type);
                    _this_1.TableName = table.builder.tableName;
                }
                return _this_1;
            }
            _Table__.prototype.getStore = function () {
                return _Table__.store;
            };
            _Table__.__fields__ = function () { return [this.DPTableName, this.DPType, this.DPLastUpdate]; };
            _Table__.prototype.onPropertyChanged = function (ev) {
            };
            _Table__.store = new collections_6.collection.Dictionary("_Table__");
            _Table__.DPTableName = Corelib_9.bind.DObject.CreateField("TableName", String);
            _Table__.DPType = Corelib_9.bind.DObject.CreateField("Type", String);
            _Table__.DPLastUpdate = Corelib_9.bind.DObject.CreateField("LastUpdate", Number);
            return _Table__;
        }(System_2.sdata.QShopRow));
        db_1._Table__ = _Table__;
        var _Tables__ = (function (_super) {
            __extends(_Tables__, _super);
            function _Tables__(database) {
                var _this_1 = _super.call(this, null, _Table__, function (id) { return new _Table__(null); }) || this;
                _this_1.database = database;
                return _this_1;
            }
            _Tables__.prototype.gettableByName = function (name, type) {
                for (var i = 0; i < this._list.length; i++) {
                    if (this._list[i].TableName == name)
                        return this._list[i];
                }
                var tbl = new _Table__(this.database.shemas);
                tbl.Id = net_3.net.New();
                tbl.Type = context_6.context.NameOf(type);
                tbl.TableName = name;
                tbl.LastUpdate = 1;
                tbl.LastModified = new Date(0);
                this.Add(tbl);
                this.database.shemas.ExecuteOperation({ op: Operation.Insert, row: tbl });
                return tbl;
            };
            return _Tables__;
        }(System_2.sdata.DataTable));
        db_1._Tables__ = _Tables__;
        var __ExeInfo__ = (function (_super) {
            __extends(__ExeInfo__, _super);
            function __ExeInfo__() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            __ExeInfo__.__fields__ = function () { return [this.DPCount]; };
            __ExeInfo__.prototype.getStore = function () {
                return null;
            };
            __ExeInfo__.prototype.Update = function () {
                throw new Error("Method not implemented.");
            };
            __ExeInfo__.prototype.Upload = function () {
                throw new Error("Method not implemented.");
            };
            __ExeInfo__.DPCount = Corelib_9.bind.DObject.CreateField("Count", Number);
            return __ExeInfo__;
        }(System_2.sdata.DataRow));
        db_1.__ExeInfo__ = __ExeInfo__;
        var __Info__ = (function (_super) {
            __extends(__Info__, _super);
            function __Info__() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            __Info__.prototype.c = function () {
            };
            return __Info__;
        }(System_2.sdata.DataTable));
        var Operation;
        (function (Operation) {
            Operation[Operation["None"] = 0] = "None";
            Operation[Operation["Update"] = 1] = "Update";
            Operation[Operation["Insert"] = 2] = "Insert";
            Operation[Operation["Delete"] = 3] = "Delete";
            Operation[Operation["UpdateOnly"] = 4] = "UpdateOnly";
            Operation[Operation["InsertOnly"] = 5] = "InsertOnly";
        })(Operation = db_1.Operation || (db_1.Operation = {}));
    })(db = exports.db || (exports.db = {}));
});
define("sys/help", ["require", "exports", "sys/Syntaxer", "sys/runtime"], function (require, exports, Syntaxer_2, runtime_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var string;
    (function (string) {
        function IsPrintable(keyCode, charCode) {
            var anyNonPrintable = (keyCode == 8) ||
                (keyCode == 9) ||
                (keyCode == 13) ||
                (keyCode == 27);
            var mozNonPrintable = (keyCode == 19) ||
                (keyCode == 20) ||
                (keyCode == 45) ||
                (keyCode == 46) ||
                (keyCode == 144) ||
                (keyCode == 145) ||
                (keyCode > 32 && keyCode < 41) ||
                (keyCode > 111 && keyCode < 124);
            return !anyNonPrintable && !(charCode == 0 && mozNonPrintable);
        }
        string.IsPrintable = IsPrintable;
    })(string = exports.string || (exports.string = {}));
    var code;
    (function (code_1) {
        var CodeCompiler = (function () {
            function CodeCompiler() {
                this.script = [];
                this.OnFnSuccess = this.OnFnSuccess.bind(this);
            }
            CodeCompiler.prototype.toRegString = function (s) {
                var rs = "";
                for (var i = 0; i < s.length; i++) {
                    var cc = s[i];
                    if (cc === '"' || cc === '\'') {
                        rs += "\\" + cc;
                    }
                    else
                        rs += cc;
                }
                return rs;
            };
            CodeCompiler.prototype.generateFn = function (stack, hasNoReturn) {
                var strs = new Array(stack.length);
                var hasCode = false;
                for (var i = 0; i < stack.length; i++) {
                    var s = stack[i];
                    if (typeof s === 'string')
                        strs[i] = '"' + this.toRegString(s) + '"';
                    else {
                        hasCode = true;
                        strs[i] = s.Code;
                    }
                }
                var fn = strs.join(" + ");
                if (!hasNoReturn)
                    fn = "return " + fn;
                var reg = internal.getExpression(fn, CodeCompiler.params, this.OnFnSuccess, this, true);
                this.script.push(reg);
                reg.IsString = !hasCode;
                return reg;
            };
            CodeCompiler.prototype._push = function (code) {
                var hasNoReturn = true;
                if (code[0] === "=")
                    hasNoReturn = false, code = code.substr(1);
                return this.generateFn(Syntaxer_2.Parser.StringTemplate.Compile(code), hasNoReturn);
            };
            CodeCompiler.prototype.push = function (code) {
                if (typeof code === "string")
                    return this._push(code);
                var ret = new Array(code.length);
                for (var i = 0; i < code.length; i++)
                    ret[i] = this._push(code[i]);
                return ret;
            };
            CodeCompiler.prototype.Compile = function () {
                var code = new Array(this.script.length);
                for (var i = 0; i < code.length; i++)
                    code[i] = this.script[i].code;
                EvalCode.Compile(code.join('\r\n'), this._onload, this._onerror, this);
            };
            CodeCompiler.prototype.reset = function () { this.script.length = 0; };
            CodeCompiler.prototype._onload = function (t) {
                t.onload && t.onload(t);
            };
            CodeCompiler.prototype._onerror = function (t) {
                t.onerror && t.onerror(t);
            };
            CodeCompiler.prototype.OnFnSuccess = function (fn, t) {
                runtime_9.helper.TryCatch(this, this.onFnLoad, void 0, [fn, t]);
            };
            CodeCompiler.prototype.remove = function (t) {
                var i = this.script.indexOf(t);
                if (i !== -1)
                    this.script.splice(i, 1);
            };
            CodeCompiler.params = ["$ovalue", "$value", "$scope", "$dom", "$job", "$fn"];
            return CodeCompiler;
        }());
        code_1.CodeCompiler = CodeCompiler;
        var EvalCode = (function () {
            function EvalCode() {
            }
            EvalCode.Compile = function (code, callback, onerror, stat) {
                var b = new Blob([code], { type: "text/javascript" });
                var scrpt = document.createElement('script');
                scrpt.src = URL.createObjectURL(b, { oneTimeOnly: true });
                scrpt.addEventListener('load', function () {
                    ('msClose' in b) && b.msClose();
                    document.head.removeChild(scrpt);
                    callback && callback(stat);
                });
                scrpt.addEventListener('error', function (e) {
                    ('msClose' in b) && b.msClose();
                    document.head.removeChild(scrpt);
                    onerror && onerror(stat);
                });
                document.head.appendChild(scrpt);
            };
            EvalCode.CompileExpression = function (expression, params, callback, stat, exludeReturn) {
                var code = internal.getExpression(expression, params, callback, stat, exludeReturn);
                var b = new Blob([code.code], { type: "text/javascript" });
                var url = URL.createObjectURL(b, { oneTimeOnly: true });
                var scrpt = document.createElement('script');
                scrpt.src = url;
                scrpt.addEventListener('load', function () {
                    ('msClose' in b) && b.msClose();
                    document.head.removeChild(scrpt);
                });
                document.head.appendChild(scrpt);
            };
            return EvalCode;
        }());
        code_1.EvalCode = EvalCode;
        var internal;
        (function (internal) {
            var reg = {};
            var i = 0;
            function register(rg) {
                if (reg[rg.name])
                    console.error("Duplicated ExprFn Occurred {}");
                reg[rg.name] = rg;
            }
            function defineExpression(name, expr) {
                var rg = reg[name];
                delete reg[name];
                rg.evalCode = expr;
                if (rg.callback)
                    rg.callback(expr, rg);
            }
            function getExpression(expression, params, callback, stat, exludeReturn) {
                var _expressionName = "$$__exprFn__" + i++;
                var _params = params.join(',');
                var code = "window.defineExpression('" + _expressionName + "', function (" + _params + ") { " + (exludeReturn ? "" : " return ") + expression + "; });";
                var rg = {
                    name: _expressionName,
                    callback: callback,
                    stat: stat,
                    code: code
                };
                register(rg);
                return rg;
            }
            internal.getExpression = getExpression;
            runtime_9.helper.$defineProperty(window, "defineExpression", { get: function () { return defineExpression; }, set: function () { }, configurable: false, enumerable: false });
        })(internal || (internal = {}));
        var FnJob = (function () {
            function FnJob(fns) {
                this.fns = fns;
                if (fns.indexOf('=') == 0)
                    fns = fns.substr(1);
            }
            Object.defineProperty(FnJob.prototype, "Name", {
                get: function () { return "FnTodo"; },
                enumerable: true,
                configurable: true
            });
            FnJob.prototype.Todo = function (job, e) {
                var v = this.fn;
                if (!(v instanceof Function))
                    return;
                var scp = job.Scop;
                var p = scp.__Controller__ && scp.__Controller__.MainControll;
                v.call(p, e._old, e._new, scp, job, e);
            };
            FnJob.register = function (fn) {
                var t = EvalCode.CompileExpression(fn, ["ovalue", "value", "scop", "job", "event"], function (fn, b) { stop(); }, this, true);
            };
            FnJob.fns = {};
            return FnJob;
        }());
        var compiler = new code.CodeCompiler();
        var interpolation = (function () {
            function interpolation() {
                this.Name = "$";
            }
            interpolation.prototype.Todo = function (job, e) {
                var regs = job.getValue('regs');
                var scp = job.Scop;
                var val = job.Scop.Value;
                var params = [val, scp, undefined, job, undefined];
                for (var i = 0; i < regs.length; i++) {
                    var reg = regs[i];
                    params[2] = reg.stat || job.dom;
                    params[4] = reg.evalCode;
                    params[2].textContent = reg.evalCode.apply(scp, params);
                }
            };
            interpolation.prototype.OnError = function (job, e) {
            };
            interpolation.prototype.OnInitialize = function (job, e) {
                var _this = this;
                var d = job.dom.firstChild;
                var arr = [];
                job.addValue("regs", arr);
                do {
                    if (d instanceof Text) {
                        var reg = compiler.push(d.textContent);
                        if (reg.IsString)
                            compiler.remove(reg);
                        else {
                            reg.stat = d;
                            arr.push(reg);
                        }
                    }
                } while ((d = d.nextSibling));
                compiler.onload = function (t) { t.reset(); _this.Todo(job, e); };
                compiler.Compile();
            };
            interpolation.prototype.OnScopDisposing = function (job, e) {
                var regs = job.getValue('regs');
                regs.length = 0;
            };
            return interpolation;
        }());
        code_1.interpolation = interpolation;
    })(code = exports.code || (exports.code = {}));
});
define("sys/Jobs", ["require", "exports", "sys/Corelib", "sys/UI", "context", "sys/utils"], function (require, exports, Corelib_10, UI_1, context_7, utils_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function hasValueProperty(dom) {
        return dom instanceof HTMLInputElement || dom instanceof HTMLTextAreaElement;
    }
    function ParseTarget(dom) {
        var href = dom.getAttribute('target');
        if (href == null)
            return;
        var cs = href.split('/');
        if (cs.length > 2)
            throw 'Error';
        if (cs.length > 1) {
            href = cs[1];
            var l = parseInt(cs[0]) + 1;
        }
        else
            l = 1;
        return { depth: l, href: href };
    }
    exports.ParseTarget = ParseTarget;
    function GetTarget(dom, depth, id) {
        var x = dom;
        for (var i = 0; i < depth; i++)
            x = x.parentElement;
        if (!id || id == '')
            return x;
        var sd = $(id, x);
        if (sd) {
            if (sd instanceof Array) {
                if (sd.length != 0)
                    x = sd[0];
            }
            else
                x = sd;
        }
        return x;
    }
    exports.GetTarget = GetTarget;
    function GetTarget1(dom) {
        var c = ParseTarget(dom);
        return c ? GetTarget(dom, c.depth, c.href) : dom;
    }
    exports.GetTarget1 = GetTarget1;
    function GetTarget2(ji) {
        var d = ji.dom;
        var target = d.getAttribute('target');
        if (!target)
            return d;
        var opt = target.split('/');
        var num = parseInt(opt[0]) || 0;
        var id = opt[1];
        var od = d;
        while (num != 0) {
            num--;
            d = d.parentElement || d;
        }
        if (id) {
            var sd = $(id, d);
            if (sd) {
                if (sd instanceof Array) {
                    if (sd.length != 0)
                        d = sd[0];
                }
                else
                    d = sd;
            }
        }
        return d || od;
    }
    exports.GetTarget2 = GetTarget2;
    var Jobs;
    (function (Jobs) {
        var tw = {
            "true": 3,
            2: 2,
            3: 3
        };
        var CheckBox = (function () {
            function CheckBox() {
                this.Name = 'checkbox';
            }
            CheckBox.prototype.Todo = function (job, e) {
                job.dom.checked = job.Scop.Value;
            };
            CheckBox.prototype.OnError = function (job, e) {
            };
            CheckBox.prototype.OnInitialize = function (job, e) {
                this.Todo(job, e);
                job.addEventListener('change', 'change', job);
                job.Handle = this.Handle;
            };
            CheckBox.prototype.OnScopDisposing = function (job, e) {
            };
            CheckBox.prototype.Handle = function (ji) {
                var v = ji.dom.checked;
                ji.Scop.Value = v == null ? null : !!v;
            };
            return CheckBox;
        }());
        Jobs.CheckBox = CheckBox;
        var FloatJob = (function () {
            function FloatJob() {
                this.Name = 'number';
                this.reg = function (str) { return !!str.match(/^[+-]?\d+(?:\.\d+)?$/); };
            }
            FloatJob.prototype.Todo = function (job, e) {
                if (job.Ischanging)
                    return;
                job.Ischanging = true;
                try {
                    var val = job.Scop.Value;
                    val = val == null ? job._store.def : val;
                    if (job.dom instanceof HTMLInputElement)
                        job.dom.value = val;
                    else
                        job.dom.textContent = val;
                }
                catch (e) {
                }
                job.Ischanging = false;
            };
            FloatJob.prototype.OnInitialize = function (ji, e) {
                var _this = this;
                var d = ji.dom;
                var check = d.getAttribute('db-check');
                ji.addValue('max', parseFloat(d.getAttribute('max') || '9999999999'));
                ji.addValue('min', parseFloat(d.getAttribute('min') || '-9999999999'));
                ji.addValue('def', parseFloat(d.getAttribute('default') || '0.00'));
                if (check === 'readonly')
                    d.contentEditable = 'false';
                else {
                    ji.Handle = this.handleEvent;
                    ji.addEventListener('ochange', hasValueProperty(d) ? 'change' : 'textContentChanged', function (e) { _this.handleEvent(ji); });
                }
                this.Todo(ji, e);
            };
            FloatJob.prototype.handleEvent = function (ji) {
                if (ji.Ischanging)
                    return;
                ji.Ischanging = true;
                try {
                    var dm = ji.dom;
                    var b = dm.value;
                    if (this.reg(b)) {
                        var v = Math.round(parseFloat(b) * 1000) / 1000;
                        var nv = Math.max(ji.getValue('min'), Math.min(v, ji.getValue('max')));
                        ji.Scop.Value = nv;
                        if (v != nv)
                            dm.value = nv.toString();
                    }
                    else
                        dm.value = String(Math.round((ji.Scop.Value || 0) * 1000) / 1000);
                }
                catch (e) {
                }
                ji.Ischanging = false;
            };
            FloatJob.prototype.OnScopDisposing = function (job, e) {
                job.removeEventListener('ochange');
            };
            return FloatJob;
        }());
        Jobs.FloatJob = FloatJob;
        function toDate(value) {
            return (value - 621355968000000000) / 10000;
        }
        var InputJob;
        (function (InputJob) {
            function Register(name, check, freeze) {
                Object.defineProperty(checks, name, { value: check, configurable: !freeze, writable: !freeze, enumerable: false });
            }
            InputJob.Register = Register;
            var checks = {};
            var Name = 'input';
            function init() {
                var telM = /(0{1}[5|7|6|9]{1}\d{8})/;
                var telF = /(0{1}[2|3]{1}\d{7})/;
                var mail = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;
                var name = /^[a-z|A-Z\s]*$/;
                var username = /^([a-zA-Z\@][a-zA-Z\d\@\._]{5,20})$/;
                var dimention = /[\w\s\.\d\/\*\ \+\-\%\=°]*/;
                checks['readonly'] = function () { return false; };
                checks['alphanumeric'] = function (str) { return !!str.match(/^[a-zA-Z0-9]*$/); };
                checks['ip'] = function (str) { return !!str.match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/); };
                checks['numeric'] = function (str) { return !!str.match(/^-?[0-9]+$/); };
                checks['int'] = function (str) { return !!str.match(/^(?:-?(?:0|[1-9][0-9]*))$/); };
                checks['decimal'] = function (str) { return !!str.match(/^(?:-?(?:0|[1-9][0-9]*))?(?:\.[0-9]*)?$/); };
                checks['text'] = function () { return true; };
                checks['password'] = function (str) { return !!str.match(/^[a-zA-Z0-9\s\.\@\!\?]+$/); };
                checks['any'] = function () { return true; };
                checks['ref'] = function (str) { return !!str.match(/^[A-Z]{2}[0-9]{1,5}$/); };
                checks['creditcard'] = function (str) {
                    str = str.replace(/[^0-9]+/g, "");
                    if (!str.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
                        return false;
                    }
                    var t = 0;
                    var r;
                    var e;
                    var i = false;
                    for (var s = str.length - 1; s >= 0; s--) {
                        r = str.substring(s, s + 1);
                        e = parseInt(r, 10);
                        if (i) {
                            e *= 2;
                            if (e >= 10) {
                                t += e % 10 + 1;
                            }
                            else {
                                t += e;
                            }
                        }
                        else {
                            t += e;
                        }
                        if (i) {
                            i = false;
                        }
                        else {
                            i = true;
                        }
                    }
                    if (t % 10 !== 0)
                        return false;
                    return true;
                };
                checks['tel'] = function (i) {
                    i = i.trim();
                    return (telF.test(i) && i.length === 9) || (telM.test(i) && i.length === 10);
                };
                checks['mail'] = function (i) {
                    var t = mail.exec(i);
                    return t !== null && t[0].length === i.length;
                };
                checks['name'] = function (i) {
                    var r = name.exec(i);
                    return r !== null && r[0].length === i.length;
                };
                checks['username'] = function (i) {
                    var r = username.exec(i);
                    return r !== null && r[0].length === i.length;
                };
                checks['dimention'] = function (i) {
                    var r = dimention.exec(i);
                    return r !== null && r[0].length === i.length;
                };
                checks['select'] = function (i) {
                    var r = username.exec(i);
                    return r !== null && r[0].length === i.length;
                };
                Object.freeze(InputJob);
                Object.freeze(telM);
                Object.freeze(telF);
            }
            InputJob.init = init;
            function Todo(job) {
                if (job.Ischanging)
                    return;
                job.Ischanging = true;
                try {
                    job.dom.value = job.Scop.Value || '';
                }
                catch (e) {
                }
                job.Ischanging = false;
            }
            function Check() {
                return true;
            }
            function OnError() {
            }
            function OnInitialize(ji, e) {
                var check = ji.dom.getAttribute('db-check');
                if (check === 'readonly')
                    ji.dom.contentEditable = 'false';
                ji.Checker = checks[check];
                ji.Handle = this.handleEvent;
                this.Todo(ji, e);
                ji.addEventListener('ochange', hasValueProperty(ji.dom) ? 'change' : 'textContentChanged', ji);
            }
            function handleEvent(t) {
                if (t.Ischanging)
                    return;
                t.Ischanging = true;
                try {
                    var b = t.dom.value;
                    if (t.Checker) {
                        if (!t.Checker(b))
                            t.dom.value = t.Scop.Value;
                        else
                            t.Scop.Value = b;
                    }
                    else
                        t.Scop.Value = b;
                }
                catch (e) {
                }
                t.Ischanging = false;
            }
            function OnDispose(job) {
                job.removeEventListener('ochange');
            }
            function Instance() {
                return { Name: Name, Todo: Todo, OnInitialize: OnInitialize, Check: Check, OnScopDisposing: OnDispose, OnError: OnError, handleEvent: handleEvent };
            }
            InputJob.Instance = Instance;
            init();
        })(InputJob || (InputJob = {}));
        Corelib_10.bind.Register(new CheckBox());
        var AccordionSelectJob = (function () {
            function AccordionSelectJob() {
                this.Name = 'select';
            }
            AccordionSelectJob.prototype.Todo = function (ji, e) {
                var val = ji.getValue('db-const');
                var style = ji.getValue('db-style');
                var dval = ji.Scop.Value;
                try {
                    var dm = ji.dom;
                    if (val === dval)
                        dm.classList.add(style);
                    else
                        dm.classList.remove(style);
                }
                catch (e) {
                }
            };
            AccordionSelectJob.prototype.OnError = function (job, e) {
            };
            AccordionSelectJob.prototype.OnInitialize = function (ji, e) {
                var dm = ji.dom;
                var t = this.callback.bind(ji);
                ji.addValue('__', t);
                ji.addValue('db-const', dm.getAttribute('db-const'));
                ji.addValue('db-style', dm.getAttribute('db-style'));
                this.Todo(ji, e);
                dm.addEventListener('click', t);
            };
            AccordionSelectJob.prototype.callback = function () {
                var t = this;
                try {
                    var val = t.getValue('db-const');
                    t.Scop.Value = val;
                }
                catch (e) {
                }
            };
            AccordionSelectJob.prototype.OnScopDisposing = function (job, e) {
            };
            return AccordionSelectJob;
        }());
        Jobs.AccordionSelectJob = AccordionSelectJob;
        Corelib_10.bind.Register({
            Name: "readonly",
            Todo: function (ji) {
                var dm = ji.getValue('target');
                var val = !ji.Scop.Value;
                var w = document.createTreeWalker(dm, NodeFilter.SHOW_ELEMENT);
                while (w.nextNode()) {
                    var node = w.currentNode;
                    typeof node.readOnly === 'boolean' && (node.readOnly = val);
                }
            },
            OnInitialize: function (ji, e) {
                ji.addValue('target', GetTarget2(ji));
                this.Todo(ji, e);
            }
        });
        Corelib_10.bind.Register({
            Name: "toggleText",
            Todo: function (ji) {
                var dm = ji.getValue('data');
                var v = ji.Scop.Value;
                ji.dom.textContent = dm[v];
            },
            OnInitialize: function (ji, e) {
                var c = ji.dom.attributes.getNamedItem('data');
                if (c)
                    try {
                        ji.addValue('data', JSON.parse(c.value));
                    }
                    catch (e) {
                        ji.addValue('data', {});
                    }
                else
                    ji.addValue('data', {});
                this.Todo(ji, e);
            }
        });
        Corelib_10.bind.Register(new Corelib_10.bind.Job("label", function (ji) {
            var dm = ji.dom;
            dm.textContent = ji.Scop.Value || '';
        }, null, null, function (ji) {
            var dm = ji.dom;
            dm.textContent = ji.Scop.Value || '';
        }, function () {
        }));
        Corelib_10.bind.Register({
            Name: "html",
            Todo: function (ji) {
                var dm = ji.dom;
                dm.innerHTML = ji.Scop.Value || '';
            },
            OnInitialize: function (ji, e) {
                this.Todo(ji, e);
            }
        });
        Corelib_10.bind.Register({
            Name: 'cdate',
            OnInitialize: function (ji, e) {
                this.Todo(ji, e);
            }, Todo: function (ji) {
                var d = ji.dom;
                var v = ji.Scop.Value;
                var dt = new Date(toDate(v));
                if (d instanceof HTMLInputElement)
                    ji.dom.valueAsDate = dt;
                else
                    ji.dom.textContent = dt.toLocaleString();
            }
        });
        Corelib_10.bind.Register({
            Name: 'date',
            OnInitialize: function (ji, e) {
                var c = ji.dom;
                var _tw = tw[c.getAttribute('db-twoway')];
                ji._store['tw'] = _tw = (_tw === undefined ? 1 : parseInt(_tw));
                if ((_tw & 2) == 2)
                    ji.addEventListener('change', hasValueProperty(c) ? 'change' : 'textContentChanged', {
                        handleEvent: function () {
                            var d = ji.dom;
                            this.self.Scop.Value = d instanceof HTMLInputElement ? d.valueAsDate : new Date(d.textContent);
                        }, self: ji
                    });
                this.Todo(ji, e);
            }, Todo: function (ji) {
                navigator.hardwareConcurrency;
                var _tw = ji._store['tw'];
                if ((_tw & 1) !== 1)
                    return;
                var d = ji.dom;
                var v = ji.Scop.Value;
                var dt = (v == null ? new Date(0) : v instanceof Date ? v : typeof v === 'number' ? new Date(v) : typeof v === 'string' ? Date.parse(v) : new Date(0));
                if (d instanceof HTMLInputElement)
                    ji.dom.valueAsDate = dt;
                else
                    ji.dom.textContent = dt.toLocaleString();
            }
        });
        Corelib_10.bind.Register(new Corelib_10.bind.Job("rinput", function (ji) {
            ji.dom.value = ji.Scop.Value;
        }, null, null, function (ji) {
            ji.dom.value = ji.Scop.Value;
        }, function () {
        }));
        Corelib_10.bind.Register(new Corelib_10.bind.Job("textbox", function (ji) {
            var dm = ji.dom;
            dm.innerText = ji.Scop.Value;
        }, null, null, function (ji) {
            var dm = ji.dom;
            dm.innerText = ji.Scop.Value;
        }, function () {
        }));
        Corelib_10.bind.Register(new Corelib_10.bind.Job("price", function (ji) {
            var dm = ji.dom;
            dm.innerText = utils_6.math.round(ji.Scop.Value || 0, 2) + ' DZD';
        }, null, null, function (ji) {
            var dm = ji.dom;
            dm.innerText = utils_6.math.round(ji.Scop.Value || 0, 2) + ' DZD';
        }, function () {
        }));
        Jobs.ratingJob = Corelib_10.bind.Register(new Corelib_10.bind.Job("rateing", function (ji) {
            var dm = ji.dom;
            var v = Math.round(ji.Scop.Value || 0);
            var length = dm.childElementCount;
            for (var i = 0; i < v; i++) {
                dm.children[i].style.visibility = "visible";
            }
            for (var i = v; i < length; i++) {
                dm.children[i].style.visibility = "hidden";
            }
        }, null, null, function (ji, e) {
            Jobs.ratingJob.Todo(ji, e);
        }));
        Corelib_10.bind.Register({
            Name: "enable",
            Todo: function (ji) {
                ji.dom.style.pointerEvents = ji.Scop.Value ? 'all' : 'none';
            },
            OnInitialize: function (ji, e) {
                this.Todo(ji, e);
            }
        });
        Corelib_10.bind.Register({
            Name: "applyStyle",
            Todo: function (ji) {
                var d = ji.getValue('target');
                var dt = ji.getValue('data') || defaultDispaly;
                var type = this.getType(ji);
                var x = ji.Scop.Value;
                if (type)
                    x = x instanceof type;
                d.classList.add.apply(d.classList, x ? dt[1] : dt[0]);
                d.classList.remove.apply(d.classList, x ? dt[0] : dt[1]);
            },
            OnInitialize: function (ji, e) {
                var d = ji.dom;
                var dt = d.getAttribute('db-data');
                if (dt) {
                    dt = dt.split(',');
                    if (dt.length == 1)
                        dt = [dt[0].split(' '), 'none'];
                    else {
                        dt[0] = dt[0].split(' ');
                        dt[1] = dt[1].split(' ');
                    }
                    ji.addValue('data', dt);
                }
                var ofType = d.getAttribute('ofType');
                if (ofType)
                    ji.addValue('ofType', ofType);
                ji.addValue('target', GetTarget2(ji));
                this.Todo(ji, e);
            },
            getType: function (ji) {
                var type = ji.getValue('ofType');
                if (typeof type === 'string') {
                    type = context_7.context.GetType(type);
                    if (type instanceof Function)
                        ji.addValue('ofType', type);
                }
                return type;
            },
            getTarget: function (ji) {
                var target = ji.dom.getAttribute('target');
                if (!target)
                    return;
                var opt = target.split('/');
                var num = parseInt(opt[0]) || 0;
                var id = opt[1];
                var d = ji.dom;
                while (num != 0) {
                    num--;
                    d = d.parentElement || d;
                }
                if (id) {
                    var sd = $(id, d);
                    if (sd) {
                        if (sd instanceof Array) {
                            if (sd.length != 0)
                                d = sd[0];
                        }
                        else
                            d = sd;
                    }
                }
                ji.addValue('target', d || ji.dom.parentElement || ji.dom);
            }
        });
        Corelib_10.bind.Register({
            Name: "show",
            Todo: function (ji) {
                var d = ji.getValue('target');
                var dt = ji.getValue('data') || defaultDispaly;
                var type = this.getType(ji);
                var x = ji.Scop.Value;
                if (type)
                    x = x instanceof type;
                d.style.display = x ? dt[1] : dt[0];
            },
            OnInitialize: function (ji, e) {
                var d = ji.dom;
                var dt = d.getAttribute('db-data');
                if (dt) {
                    dt = dt.split(',');
                    if (dt.length == 1)
                        dt = [dt[0], 'none'];
                    ji.addValue('data', dt);
                }
                var ofType = d.getAttribute('ofType');
                if (ofType)
                    ji.addValue('ofType', ofType);
                ji.addValue('target', GetTarget2(ji));
                this.Todo(ji, e);
            },
            getType: function (ji) {
                var type = ji.getValue('ofType');
                if (typeof type === 'string') {
                    type = context_7.context.GetType(type);
                    if (type instanceof Function)
                        ji.addValue('ofType', type);
                }
                return type;
            }
        });
        Corelib_10.bind.Register({
            Name: "editable",
            Todo: function (ji) {
                var c = !ji.Scop.Value;
                var ins = $('input', ji.dom);
                for (var i = 0; i < ins.length; i++) {
                    var b = ins[i];
                    b.disabled = c;
                }
            },
            OnInitialize: function (ji) {
                this.Todo(ji);
            }, OnScopDisposing: function () {
            }
        });
        var defaultDispaly = ['none', ''];
        Corelib_10.bind.Register({
            Name: "toggle",
            Todo: function () {
            },
            OnInitialize: function (ji) {
                ji.addEventListener('domclick', 'click', function () {
                    ji.Scop.Value = !!!ji.Scop.Value;
                });
            }, OnScopDisposing: function (ji) {
                ji.removeEventListener('domclick');
            }
        });
        Corelib_10.bind.Register(new Corelib_10.bind.Job("showIf", function (ji) {
            var dm = ji.dom;
            var d = dm.parentElement;
            var dsp = d.style.display;
            var val = ji.Scop.Value;
            if (val === false) {
                if (dsp == 'none')
                    return;
                ji.addValue('display', dsp);
                d.style.display = 'none';
            }
            else
                d.style.display = dsp == 'none' ? ji.getValue('display') : dsp;
        }, null, null, function (ji) {
            var dm = ji.dom;
            var d = dm.parentElement;
            var dsp = d.style.display;
            var val = ji.Scop.Value;
            { }
            if (val === false) {
                if (dsp == 'none')
                    return;
                ji.addValue('display', dsp);
                d.style.display = 'none';
            }
            else
                d.style.display = dsp == 'none' ? ji.getValue('display') : dsp;
        }, function () {
        }));
        Corelib_10.bind.Register(new Corelib_10.bind.Job("hideIf", function (ji) {
            var dm = ji.dom;
            var d = dm.parentElement;
            var dsp = d.style.display;
            var val = ji.Scop.Value;
            if (val === true) {
                if (dsp == 'none')
                    return;
                ji.addValue('display', dsp);
                d.style.display = 'none';
            }
            else
                d.style.display = dsp == 'none' ? ji.getValue('display') : dsp;
        }, null, null, function (ji) {
            var dm = ji.dom;
            var d = dm.parentElement;
            var dsp = d.style.display;
            var val = ji.Scop.Value;
            if (val === true) {
                if (dsp == 'none')
                    return;
                ji.addValue('display', dsp);
                d.style.display = 'none';
            }
            else
                d.style.display = dsp == 'none' ? ji.getValue('display') : dsp;
        }, function () {
        }));
        Corelib_10.bind.Register(InputJob.Instance());
        Corelib_10.bind.Register(new FloatJob());
        Corelib_10.bind.Register(new AccordionSelectJob());
        Corelib_10.bind.Register(new Corelib_10.bind.Job("check", function (ji) {
            var dm = ji.dom;
            dm.innerText = ji.Scop.Value;
        }, null, null, function (ji) {
            var dm = ji.dom;
            dm.innerText = ji.Scop.Value;
        }, function () {
        }));
        Corelib_10.bind.Register({
            Name: 'enumoption',
            OnInitialize: function (j, e) {
                if (!(j.dom instanceof HTMLInputElement))
                    throw "Dom must be Select";
                var dm = j.dom;
                var c = dm.getAttribute('enum');
                var et = dm.getAttribute('enum-type');
                if (et !== 'string')
                    et = 'number';
                var lst = utils_6.basic.getEnum(c);
                var ac = new UI_1.UI.ProxyAutoCompleteBox(new UI_1.UI.Input(j.dom), lst);
                ac.Box.Parent = UI_1.UI.Desktop.Current;
                ac.initialize();
                var p = { ac: ac, lst: lst, et: et };
                j.addValue('params', p);
                this.Todo(j, e);
                ac.OnValueChanged(ac, function (b, o, n) {
                    return j.Scop.Value = et === 'string' ? (n ? n.Name : lst.Get(0)) : n ? n.Value : 0;
                });
            }, Todo: function (ji) {
                var p = ji.getValue('params');
                var v = ji.Scop.Value;
                p.ac.Value = p.et === 'number' ? utils_6.basic.EnumValue.GetValue(p.lst, v || 0) : v;
            }
        });
        Corelib_10.bind.Register({
            Name: 'enum',
            OnInitialize: function (j, e) {
                if (!(j.dom instanceof HTMLSelectElement))
                    throw "Dom must be Select";
                var dm = j.dom;
                dm.contentEditable = 'true';
                var c = dm.getAttribute('enum') || dm.getAttribute('type') || dm.getAttribute('rtype');
                var lst = utils_6.basic.getEnum(c);
                for (var i = 0; i < lst.Count; i++) {
                    var o = document.createElement('option');
                    var m = lst.Get(i);
                    o.value = String(m.Value);
                    o.text = m.Name;
                    j.dom.appendChild(o);
                }
                j.addValue('list', lst);
                this.Todo(j, e);
                j.dom.addEventListener('change', function () {
                    if (j._store.inter)
                        return;
                    j._store.inter = true;
                    try {
                        var v = this.options[this.selectedIndex];
                        v = parseFloat((v && v.value));
                        j.Scop.Value = isFinite(v) ? v : null;
                    }
                    catch (_a) { }
                    j._store.inter = false;
                });
            }, Todo: function (ji) {
                if (ji._store.inter)
                    return;
                ji._store.inter = true;
                try {
                    var t = ji.getValue('list');
                    var v = utils_6.basic.EnumValue.GetValue(t, ji.Scop.Value);
                    v = v && t.IndexOf(v);
                    ji.dom.selectedIndex = v;
                }
                catch (_a) { }
                ji._store.inter = false;
            }
        });
        Corelib_10.bind.Register({
            Name: 'enumstring',
            OnInitialize: function (j, e) {
                var dm = j.dom;
                var c = dm.getAttribute('type');
                var lst = utils_6.basic.getEnum(c);
                j.addValue('params', lst);
                this.Todo(j, e);
            }, Todo: function (ji) {
                var p = ji.getValue('params');
                var v = ji.Scop.Value;
                ji.dom.textContent = typeof v === 'string' ? v : p.Get(v || 0).Name;
            }
        });
        Corelib_10.bind.Register({
            Name: 'enum2string',
            OnInitialize: function (j, e) {
                var dm = j.dom;
                var c = dm.getAttribute('type');
                var lst = utils_6.basic.getEnum(c);
                j.addValue('params', lst);
                this.Todo(j, e);
            }, Todo: function (ji) {
                var p = ji.getValue('params');
                var v = ji.Scop.Value;
                ji.dom.textContent = typeof v === 'string' ? v : p.Get(v || 0).Name;
            }
        });
        var d;
        Corelib_10.bind.Register({
            Name: 'tostring', OnInitialize: (d = function (ji) {
                var b = ji.Scop.Value || '';
                if (typeof b !== 'string')
                    b = (b && b.toString()) || '';
                if (b.length > 45)
                    b = b.substring(0, 45) + '...';
                ji.dom.textContent = b;
            }), Todo: d
        });
    })(Jobs = exports.Jobs || (exports.Jobs = {}));
});
define("sys/Thread", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    if (typeof exports === 'undefined')
        var exports = {};
    var isWorker = typeof importScripts === 'function' && !(typeof window !== 'undefined' && window instanceof Window);
    if (typeof exports === 'undefined' && typeof window !== 'undefined')
        window['exports'] = {};
    var Workers;
    (function (Workers) {
        var WebWorker;
        (function (WebWorker) {
            var _handlers = {};
            function registerHandler(name, handler) {
                if (!name)
                    return false;
                if (name.indexOf('__') === 0 && name.lastIndexOf('__') === name.length - 2)
                    return false;
                if (!handler)
                    return false;
                _handlers[name] = handler;
                return true;
            }
            WebWorker.registerHandler = registerHandler;
            function getHandler(name) {
                if (name.indexOf('__') === 0 && name.lastIndexOf('__') === name.length - 2)
                    return false;
                return _handlers[name];
            }
            WebWorker.getHandler = getHandler;
            function unregisterHandler(name) {
                if (!name)
                    return false;
                if (name.indexOf('__') === 0 && name.lastIndexOf('__') === name.length - 2)
                    return false;
                return delete _handlers[name];
            }
            WebWorker.unregisterHandler = unregisterHandler;
            var _private = false;
            var Server = (function () {
                function Server() {
                    this.onPostMessageError = function (e, data) {
                        this.postMessage({ Id: data.Id, IsError: true, Data: "UnExpectedError", keepAlive: false });
                    }.bind(this);
                    this.Start();
                }
                Server.prototype.Start = function () {
                    this._worker = self;
                    this._worker.addEventListener('error', this._onerror.bind(this), { capture: true });
                    this._worker.addEventListener('message', this._onmessage.bind(this), { capture: true });
                };
                Server.prototype._onerror = function (e) {
                };
                Server.prototype._onmessage = function (e) {
                    var data = e.data;
                    var handler = _handlers[data.Handler];
                    var event = { e: e, Msg: data, Result: undefined, Handled: false, Thread: this };
                    var rslt = tryCatch(handler, this._onHandlerError, [event], this);
                    if (event.Handled)
                        return;
                    this.postMessage({ Id: data.Id, Data: event.Result || rslt, keepAlive: event.keepAlive }, e.origin, e.ports, e.ports.slice());
                };
                Server.prototype._onHandlerError = function (e, v) {
                    v.Error = true;
                    v.Handled = true;
                    this.postMessage({ Id: v.Msg.Id, IsError: true, Data: e, keepAlive: false });
                };
                Server.prototype.postMessage = function (data, targetOrigin, transfers, ports) {
                    if (!ports || ports.length == 0) {
                        var p = isWorker ? [data, transfers] : [data, !targetOrigin ? void 0 : targetOrigin, transfers];
                        tryCatch(this._worker.postMessage, this.onPostMessageError, p, this._worker);
                    }
                    else {
                        p = [data];
                        for (var i = 0; i < ports.length; i++)
                            tryCatch(ports[i].postMessage, this.onPostMessageError, p, ports[i]);
                    }
                };
                Server.Start = function () {
                    this.Default = new Server();
                };
                return Server;
            }());
            WebWorker.Server = Server;
            var Client = (function () {
                function Client(_url) {
                    this._url = _url;
                    this._quee = {};
                    this.Start();
                }
                Client.prototype.Start = function () {
                    this._worker = new Worker(this._url);
                    this._worker.addEventListener('error', this._onerror.bind(this), { capture: true });
                    this._worker.addEventListener('message', this._onmessage.bind(this), { capture: true });
                };
                Client.prototype.Send = function (packet) {
                    var id = performance.now();
                    packet.Id = id;
                    this._quee[id] = packet;
                    this._worker.postMessage({ Id: id, Data: packet.data, Handler: packet.handler });
                };
                Client.prototype._onmessage = function (e) {
                    var data = e.data;
                    var q = this._quee[data.Id];
                    if (!q)
                        return;
                    tryCatch(q.callback, undefined, [q, data], q);
                    if (!data.keepAlive)
                        delete this._quee[data.Id];
                };
                Client.prototype._onerror = function (e) {
                };
                Client.counter = 0;
                return Client;
            }());
            WebWorker.Client = Client;
            function tryCatch(_try, _catch, params, owner) {
                try {
                    return _try && _try.apply(owner, params);
                }
                catch (e) {
                    (params = params.slice()).unshift(e);
                    return _catch && _catch.apply(owner, params);
                }
            }
            (function () {
                function registerHandler(name, handler) {
                    _handlers[name] = handler;
                }
                registerHandler('getValue', function (e) { return self[e.Msg.Data]; });
                registerHandler('__close__', function (e) { if (isWorker)
                    self.close(); return isWorker; });
                registerHandler('__loadScripts__', function (e) { importScripts(e.Msg.Data); });
                registerHandler('__hasHandler__', function (e) { return _handlers[e.Msg.Handler] instanceof Function; });
                registerHandler('__href__', function (e) { return location.href; });
                registerHandler('__getHandlers__', function (e) { return Object.keys(_handlers); });
                registerFetchHandler();
            })();
            function registerFetchHandler() {
                Workers.WebWorker.registerHandler('fetch', function (e) {
                    var dt = e.Msg.Data;
                    e.keepAlive = true;
                    e.Handled = true;
                    var pors = e.e.ports && e.e.ports.slice();
                    var org = e.e.origin;
                    fetch(new Request(dt.request.request)).then(function (e1) {
                        if (e1.status == 200 && e1.statusText === 'ok')
                            return e1.text().then(function (txt) {
                                e.Thread.postMessage({ Data: txt, Id: e.Msg.Id, IsError: false, keepAlive: false }, org, pors, pors);
                            }, function (v) {
                                e.Thread.postMessage({ Data: v, Id: e.Msg.Id, IsError: true, keepAlive: false }, org, pors, pors);
                            });
                        e.Thread.postMessage({ Data: void 0, Id: e.Msg.Id, IsError: true, keepAlive: false }, org, pors, pors);
                    });
                });
            }
        })(WebWorker = Workers.WebWorker || (Workers.WebWorker = {}));
        var ServiceWorker = (function () {
            function ServiceWorker() {
            }
            ServiceWorker.Start = function (url, scope) {
                return navigator.serviceWorker.register(url, scope ? { scope: scope } : void 0).then(function (reg) {
                    swReg = clone(swReg);
                    console.log("SW registration succeeded. Scope is " + reg.scope);
                }).catch(function (err) {
                    console.error("SW registration failed with error " + err);
                });
            };
            ServiceWorker.postMessageToSW = function (data) {
                return new Promise(function (onSucc, onErr) {
                    navigator.serviceWorker.getRegistration().then(function (reg) {
                        var msg_chan = new MessageChannel();
                        reg.active.postMessage(data, [msg_chan.port2]);
                        msg_chan.port1.onmessage = function (e) {
                            var dt = e.data;
                            (dt.IsError ? onErr : onSucc)(dt.IsError ? { IsError: true, Action: data, Result: dt } : { Action: data, Result: dt });
                        };
                    }).catch(function (e) {
                        onErr({ IsError: true, Action: data, Result: e });
                    });
                });
            };
            return ServiceWorker;
        }());
        Workers.ServiceWorker = ServiceWorker;
        var swReg;
        function clone(obj) {
            if (!obj)
                return obj;
            if (typeof obj === 'object') {
                var copy = {};
                for (var attr in obj)
                    if (obj.hasOwnProperty(attr))
                        copy[attr] = obj[attr];
                return copy;
            }
            else if (obj instanceof Array)
                return obj.splice(0);
            return obj;
        }
        ;
        if (typeof window !== 'undefined')
            window['SW'] = ServiceWorker;
    })(Workers = exports.Workers || (exports.Workers = {}));
});
define("sys/Initializer", ["require", "exports", "sys/Corelib", "sys/UI", "sys/runtime", "sys/Dom", "sys/Syntaxer", "sys/Encoding"], function (require, exports, Corelib_11, UI_2, runtime_10, Dom_2, Syntaxer_3, Encoding_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var event;
    (function (event) {
        var EventControllerResult;
        (function (EventControllerResult) {
            EventControllerResult[EventControllerResult["continue"] = 0] = "continue";
            EventControllerResult[EventControllerResult["skip"] = 1] = "skip";
            EventControllerResult[EventControllerResult["cancelAll"] = 2] = "cancelAll";
        })(EventControllerResult = event.EventControllerResult || (event.EventControllerResult = {}));
        var eventsControllers = {};
        eventsControllers['debugger'] = {
            before: function (_e, _c) {
                debugger;
                return 2;
            }
        };
        eventsControllers['stop'] = {
            before: function (e, _c) {
                e.stopPropagation();
                return 0;
            }
        };
        eventsControllers['stop-prevent'] = {
            before: function (e, _c) {
                e.stopPropagation();
                e.preventDefault();
                return 0;
            }
        };
        eventsControllers['prevent'] = {
            before: function (e, _c) {
                e.preventDefault();
                return 2;
            }
        };
        eventsControllers['stop-e'] = {
            before: function (e, _c) {
                e.stopImmediatePropagation();
                return 2;
            }
        };
        eventsControllers['self'] = {
            before: function (e, _c) {
                if (this.dom == e.srcElement)
                    return 0;
                else
                    1;
            }
        };
        var EventData = (function () {
            function EventData(events, interpolation, name, controllerHandler) {
                this.events = events;
                this.interpolation = interpolation;
                this.name = name;
                this.capture = false;
                if (!controllerHandler)
                    return;
                var c = controllerHandler.split('@');
                if (c[0])
                    this.controllerHandler = c[0];
                this.capture = c[1] === 'capture';
            }
            Object.defineProperty(EventData.prototype, "Id", {
                get: function () { return this.name + "." + this.capture; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EventData.prototype, "dom", {
                get: function () { return this.events.xx.Dom; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EventData.prototype, "controller", {
                get: function () { return this.events.xx.controller; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EventData.prototype, "parentScop", {
                get: function () { return this.events.xx.Scop; },
                enumerable: true,
                configurable: true
            });
            EventData.prototype.getScop = function () {
                if (this.scop !== undefined)
                    return this;
                var xx = this.events.xx;
                if (this.interpolation.indexOf('.') == 0)
                    var parentScop = xx.Scop, v = v.substring(1);
                else
                    var parentScop = this.scop;
                this.scop = Corelib_11.bind.Scop.Create(this.interpolation, {
                    parent: parentScop, bindingMode: 0,
                    controller: xx.controller,
                    parseResult: void 0, dom: xx.Dom
                });
                if (!this.scop)
                    this.scop = null;
                return this;
            };
            return EventData;
        }());
        event.EventData = EventData;
        var eventsCache = (function () {
            function eventsCache(xx) {
                this.xx = xx;
                this.Name = "Events";
                this.scop = xx.Scop;
            }
            eventsCache.prototype.Todo = function (_job, _e) {
            };
            eventsCache.prototype.Register = function (eventType, v) {
                if (!this.events)
                    this.events = {};
                var x = eventType.split(':');
                eventType = x[0];
                var s = new EventData(this, v, eventType, x[1]);
                var a = this.events[s.Id];
                if (!a) {
                    this.events[s.Id] = a = [s];
                    this.xx.Dom.addEventListener(eventType, {
                        owner: this, id: s.Id,
                        handleEvent: function (e) {
                            this.owner.handleEvent(e, this.id);
                        }
                    }, s.capture);
                }
                else
                    a.push(s);
            };
            eventsCache.prototype.handleEvent = function (e, id) {
                var scps = this.events[id];
                for (var i = 0; i < scps.length; i++) {
                    var eventD = scps[i].getScop();
                    var c = eventsControllers[eventD.controllerHandler];
                    var r = c && c.before && c.before.call(eventD, e, this);
                    if (r === 2)
                        return;
                    if (r === 1)
                        continue;
                    runtime_10.helper.TryCatch(this, this.exec, void 0, [eventD, this.scop, e]);
                    r = c && c.after && c.after.call(eventD, e, this);
                    if (r === 2)
                        return;
                }
            };
            eventsCache.prototype.exec = function (dt, scopValue, e) {
                var scp = dt.scop;
                var scpv = scp.Value;
                if (scp.Is(Syntaxer_3.Parser.CToken.functionCall))
                    return scp.Invoke();
                if (typeof scpv === 'function') {
                    var p = scp.ParentValue;
                    scpv.call(p, e, dt, scopValue, this);
                }
                else if (scpv instanceof Object && scpv.handleEvent) {
                    scpv.handleEvent(e, dt, scopValue, this);
                }
            };
            return eventsCache;
        }());
        event.eventsCache = eventsCache;
        var EventDef = (function () {
            function EventDef() {
                this.priority = 9007199254740991;
            }
            Object.defineProperty(EventDef, "default", {
                get: function () { return this._default || (this._default = new EventDef()); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EventDef.prototype, "name", {
                get: function () {
                    return 'on-';
                },
                set: function (_v) { },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EventDef.prototype, "attribute", {
                get: function () {
                    return 'on-';
                },
                set: function (_v) { },
                enumerable: true,
                configurable: true
            });
            EventDef.prototype.check = function (_x, _e) {
                return true;
            };
            EventDef.prototype.execute = function (xx, inst) {
                var _events = inst.value;
                var x;
                for (var i in _events) {
                    if (!x)
                        x = new eventsCache(xx);
                    x.Register(i, _events[i]);
                }
                return xx;
            };
            EventDef.prototype.valueParser = function (_value) { };
            Object.defineProperty(EventDef.prototype, "isPrimitive", {
                get: function () { return false; },
                set: function (_v) { },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EventDef.prototype, "isFinalizer", {
                get: function () { return true; },
                set: function (_v) { },
                enumerable: true,
                configurable: true
            });
            return EventDef;
        }());
        event.EventDef = EventDef;
    })(event || (event = {}));
    var Watch;
    (function (Watch) {
        var NotifyDef = (function () {
            function NotifyDef() {
            }
            Object.defineProperty(NotifyDef, "default", {
                get: function () { return this._default || (this._default = new NotifyDef()); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NotifyDef.prototype, "name", {
                get: function () {
                    return 'on:';
                },
                set: function (_v) { },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NotifyDef.prototype, "attribute", {
                get: function () {
                    return 'on:';
                },
                set: function (_v) { },
                enumerable: true,
                configurable: true
            });
            NotifyDef.prototype.check = function (_x, _e) {
                return true;
            };
            NotifyDef.prototype.execute = function (xx, m) {
                var vls = m.value;
                var x = new watchifyCache(xx);
                for (var i in vls)
                    x.Register(xx.Control, i, vls[i]);
                return xx;
            };
            NotifyDef.prototype.valueParser = function (_value) {
            };
            Object.defineProperty(NotifyDef.prototype, "priority", {
                get: function () { return 9007199254740900; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NotifyDef.prototype, "isPrimitive", {
                get: function () { return true; },
                set: function (_v) { },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NotifyDef.prototype, "isFinalizer", {
                get: function () { return false; },
                set: function (_v) { },
                enumerable: true,
                configurable: true
            });
            return NotifyDef;
        }());
        Watch.NotifyDef = NotifyDef;
        var watchifyCache = (function () {
            function watchifyCache(xx) {
                this.xx = xx;
            }
            watchifyCache.prototype.Register = function (control, name, interpolation) {
                if (!this.events)
                    this.events = {};
                var s = { interpolation: interpolation };
                control.watch(name, this.handleEvent, this);
                this.events[name] = s;
            };
            watchifyCache.prototype.generateScop = function (e) {
                if (e.scop !== undefined)
                    return e.scop;
                if (e.interpolation.indexOf('.') == 0)
                    var parentScop = (this.xx.parent && this.xx.parent.Scop) || this.xx.Scop, v = v.substring(1);
                else
                    var parentScop = this.xx.Scop;
                e.scop = Corelib_11.bind.Scop.Create(e.interpolation, { parent: parentScop, bindingMode: 0, controller: this.xx.controller, dom: this.xx.Dom, parseResult: void 0 });
                if (!e.scop)
                    e.scop = null;
                return e.scop;
            };
            watchifyCache.prototype.handleEvent = function (e) {
                var scop = this.generateScop(this.events[e.name]);
                var scopValue = scop && scop.Value;
                if (scop.Is(Syntaxer_3.Parser.CToken.functionCall))
                    return scop.Invoke();
                if (typeof scopValue === 'function') {
                    var p = scop.ParentValue;
                    scopValue.call(p, e);
                }
                else if (scopValue instanceof Object && scopValue.handleEvent) {
                    scopValue.handleEvent(e);
                }
            };
            return watchifyCache;
        }());
        Watch.watchifyCache = watchifyCache;
    })(Watch || (Watch = {}));
    var AttributeScop = (function (_super) {
        __extends(AttributeScop, _super);
        function AttributeScop(e) {
            var _this = _super.call(this, e.bindingMode) || this;
            var attribute = _this.attribute = e.parseResult.resut || void 0;
            var dom = _this.dom = e.dom;
            _this.privateValue = _this.getAttrValue();
            if ((e.bindingMode & 1) == 1) {
                _this.observer = _this.MdObserverElement(dom, {
                    attributeOldValue: false,
                    attributes: true,
                    subtree: false,
                    childList: false,
                    attributeFilter: attribute ? [attribute] : void 0
                });
            }
            return _this;
        }
        AttributeScop.prototype.getAttrValue = function () {
            var t;
            var a = this.attribute;
            if (a == null) {
                t = {};
                var atts = this.dom.attributes;
                for (var i = atts.length - 1; i >= 0; i--)
                    t[atts[i].name] = atts[i].value;
            }
            else if (typeof a == 'string') {
                t = this.dom.getAttribute(a);
            }
            else {
                t = {};
                for (var i = a.length - 1; i >= 0; i--) {
                    var v = this.dom.getAttribute(a[i]);
                    t[a[i]] = v;
                }
            }
            return t;
        };
        AttributeScop._build = function (e) {
            var scop = new AttributeScop(e).setController(e.controller);
            return scop;
        };
        AttributeScop.prototype.Is = function (toke) {
            return toke === 'attributescop';
        };
        AttributeScop.prototype._OnValueChanged = function (e) {
            if ((this._bindingMode & 2) === 2) {
                var t = e._new;
                var a = this.attribute;
                if (a == null) {
                    for (var k in t)
                        if (t.hasOwnProperty(k))
                            this.dom.setAttribute(k, t[k]);
                }
                else if (typeof a == 'string')
                    this.dom.setAttribute(a, t);
                else
                    for (var i = a.length - 1; i >= 0; i--)
                        this.dom.setAttribute(a[i], t[a[i]]);
            }
        };
        AttributeScop.prototype.MdObserverElement = function (el, config) {
            var _this = this;
            if (this.observer)
                this.observer.disconnect();
            if ('MutationObserver' in window) {
                var observer = new MutationObserver(function (a, b) { _this.onAttributeChanged(a, b); });
                observer.observe(el, config);
                return observer;
            }
        };
        AttributeScop.prototype.onAttributeChanged = function (mutations, _observer) {
            var r = mutations[mutations.length - 1];
            if (!r)
                return;
            this.privateValue = this.getAttrValue();
        };
        AttributeScop.prototype.Dispose = function () {
            var h = _super.prototype.Dispose.call(this);
            if (this.observer)
                this.observer.disconnect();
            return h;
        };
        __decorate([
            Dom_2.attributes.Parser2ScopHandler('attributescop'),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], AttributeScop, "_build", null);
        return AttributeScop;
    }(Corelib_11.bind.Scop));
    exports.AttributeScop = AttributeScop;
    var AttributeDerectives = (function () {
        function AttributeDerectives() {
        }
        Object.defineProperty(AttributeDerectives, "default", {
            get: function () { return this._default || (this._default = new AttributeDerectives()); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AttributeDerectives.prototype, "name", {
            get: function () {
                return ':';
            },
            set: function (_v) { },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AttributeDerectives.prototype, "attribute", {
            get: function () {
                return ':';
            },
            set: function (_v) { },
            enumerable: true,
            configurable: true
        });
        AttributeDerectives.prototype.check = function (_x, _e) {
            return true;
        };
        AttributeDerectives.flip = function (mode) {
            if ((mode & 3) == 3)
                return 3;
            if ((mode & 1) == 1)
                return 2;
            if ((mode & 2) == 2)
                return 1;
            return 0;
        };
        AttributeDerectives.observeAttribute = function (dom, attribute, mode) {
            var attrScop = new AttributeScop({
                dom: dom,
                parseResult: {
                    resut: attribute,
                }, bindingMode: mode
            });
            var scop = new Corelib_11.bind.ValueScop(void 0, AttributeDerectives.flip(mode));
            var binder = new Corelib_11.bind.TwoBind(mode, attrScop, scop, Corelib_11.bind.Scop.DPValue, Corelib_11.bind.Scop.DPValue);
            return {
                scop: scop, attrScop: attrScop, binder: binder
            };
        };
        AttributeDerectives.prototype.execute = function (xx, m) {
            var vls = m.value;
            for (var k in vls) {
                var v = bom.extractScopString(vls[k], 2);
                var fromP = k[0] === '@';
                if (fromP)
                    k = k.substring(1);
                var scop = Corelib_11.bind.Scop.Create(v.scop, {
                    parseResult: void 0, parent: xx.Scop,
                    bindingMode: AttributeDerectives.flip(v.mode), dom: xx.Dom, controller: xx.controller,
                }).setController(xx.controller);
                var scopValue = scop.Value;
                var attributes = scopValue == null ? null : Object.keys(scopValue);
                var attrScop = new AttributeScop({
                    dom: fromP ? xx.Control.View : xx.Dom,
                    parseResult: {
                        resut: k == '' ? attributes : k
                    }, bindingMode: v.mode
                }).setController(xx.controller);
                var c = new Corelib_11.bind.TwoBind(v.mode, attrScop, scop, Corelib_11.bind.Scop.DPValue, Corelib_11.bind.Scop.DPValue);
                xx.controller.OnDisposing = function (_n) { return c.Dispose(); };
            }
            return xx;
        };
        AttributeDerectives.prototype.valueParser = function (_value) {
        };
        Object.defineProperty(AttributeDerectives.prototype, "priority", {
            get: function () { return 9007199254740901; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AttributeDerectives.prototype, "isPrimitive", {
            get: function () { return true; },
            set: function (_v) { },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AttributeDerectives.prototype, "isFinalizer", {
            get: function () { return false; },
            set: function (_v) { },
            enumerable: true,
            configurable: true
        });
        return AttributeDerectives;
    }());
    exports.AttributeDerectives = AttributeDerectives;
    window['AttributeObserver'] = AttributeDerectives.observeAttribute;
    var PropertyDerectives = (function () {
        function PropertyDerectives() {
        }
        Object.defineProperty(PropertyDerectives, "default", {
            get: function () { return this._default || (this._default = new PropertyDerectives()); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyDerectives.prototype, "name", {
            get: function () {
                return 'p:';
            },
            set: function (_v) { },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyDerectives.prototype, "attribute", {
            get: function () {
                return 'p:';
            },
            set: function (_v) { },
            enumerable: true,
            configurable: true
        });
        PropertyDerectives.prototype.check = function (_x, _e) {
            return true;
        };
        PropertyDerectives.prototype.getName = function (v) {
            var lx = "";
            var s = "";
            for (var i = 0; i < v.length; i++) {
                var x = v[i];
                if (lx === '-') {
                    if (x == '-') {
                        lx = '';
                        s += '-';
                    }
                    else {
                        lx = x;
                        s += x.toUpperCase();
                    }
                    continue;
                }
                lx = x;
                if (x == '-')
                    continue;
                s += x;
            }
            return s;
        };
        PropertyDerectives.prototype.buildDeriScop = function (v, xx, mode) {
            var isdotted = v[0] == '.';
            if (isdotted)
                v = v.substring(0);
            return Corelib_11.bind.Scop.Create(this.getName(v), { parent: isdotted ? xx.Scop : xx.Control, bindingMode: mode, controller: xx.controller, dom: xx.Dom, parseResult: void 0 });
        };
        PropertyDerectives.observeAttribute = function (dom, attribute, mode) {
            var attrScop = new AttributeScop({
                dom: dom,
                parseResult: {
                    resut: attribute,
                }, bindingMode: mode
            });
            var scop = new Corelib_11.bind.ValueScop(void 0, AttributeDerectives.flip(mode));
            var binder = new Corelib_11.bind.TwoBind(mode, attrScop, scop, Corelib_11.bind.Scop.DPValue, Corelib_11.bind.Scop.DPValue);
            return {
                scop: scop, attrScop: attrScop, binder: binder
            };
        };
        PropertyDerectives.prototype.execute = function (xx, m) {
            var vls = m.value;
            for (var k in vls) {
                var v = bom.extractScopString(vls[k], 2);
                var propScop = this.buildDeriScop(k, xx, v.mode);
                var scop = Corelib_11.bind.Scop.Create(v.scop, { parent: v.dotted ? xx.Scop : xx.ParentScop, bindingMode: AttributeDerectives.flip(v.mode), controller: xx.controller, dom: xx.Dom, parseResult: void 0 });
                var x = new Corelib_11.bind.TwoBind(v.mode, propScop, scop, Corelib_11.bind.Scop.DPValue, Corelib_11.bind.Scop.DPValue);
                xx.controller.OnDisposing = function (n) { return x.Dispose(); };
            }
            return xx;
        };
        PropertyDerectives.prototype.valueParser = function (_value) {
        };
        Object.defineProperty(PropertyDerectives.prototype, "priority", {
            get: function () { return 9007199254740850; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyDerectives.prototype, "isPrimitive", {
            get: function () { return true; },
            set: function (_v) { },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyDerectives.prototype, "isFinalizer", {
            get: function () { return false; },
            set: function (_v) { },
            enumerable: true,
            configurable: true
        });
        return PropertyDerectives;
    }());
    exports.PropertyDerectives = PropertyDerectives;
    var bom;
    (function (bom) {
        function initTwoWay(_xx, _p) {
            return undefined;
        }
        function _resetClass(_new) {
            if (this._old.length)
                this.view.classList.remove.apply(this.view.classList, this._old);
            var j = 0;
            if (_new) {
                for (var _i = 0, _a = _new.split(' '); _i < _a.length; _i++) {
                    var s = _a[_i];
                    if (s == '')
                        continue;
                    this._old[j++] = s;
                }
                this._old.length = j;
                this.view.classList.add.apply(this.view.classList, this._old);
            }
            else
                this._old.length = 0;
        }
        function resetClass(_s, ev) { this._reset(ev._new); }
        function qClass(x, m) {
            var c = Corelib_11.bind.StringScop.GetStringScop(m.value, x.creteScopBuilderEventArgs());
            var _stor = {
                _old: new Array(0),
                view: x.e.dom,
                reset: resetClass,
                _reset: _resetClass
            };
            if (typeof c !== 'string') {
                c.OnPropertyChanged(Corelib_11.bind.Scop.DPValue, _stor.reset, _stor);
                c = c.Value;
            }
            _stor._reset(c);
            return x;
        }
        function _resetStyle(_new) {
            var s = this.view.style;
            for (var _i = 0, _a = this._old; _i < _a.length; _i++) {
                var e = _a[_i];
                var v = s[e.name];
                if (v == e.value)
                    s[e.name] = e.oldValue;
            }
            var arr = _new.split(';');
            var j = 0;
            for (var _b = 0, arr_1 = arr; _b < arr_1.length; _b++) {
                var t = arr_1[_b];
                if (!(t = t.trim()))
                    continue;
                var x = t.split(':');
                var n = x[0];
                var c = { name: n, oldValue: s[n] };
                this._old[j++] = c;
                s[n] = x[1];
                c.value = s[n];
            }
            this._old.length = j;
        }
        function resetStyle(_s, ev) { this._reset(ev._new); }
        function qStyle(x, m) {
            var c = Corelib_11.bind.StringScop.GetStringScop(m.value, x.creteScopBuilderEventArgs());
            var _stor = {
                _old: [],
                view: x.e.dom,
                reset: resetStyle,
                _reset: _resetStyle
            };
            if (typeof c !== 'string') {
                c.OnPropertyChanged(Corelib_11.bind.Scop.DPValue, _stor.reset, _stor);
                c = c.Value;
            }
            _stor._reset(c);
            return x;
        }
        function checkTwoWay(_xx, p) {
            if (p.value == 'true')
                p.value = Corelib_11.bind.BindingMode.TwoWay;
            else if (p.value == 'false')
                p.value = Corelib_11.bind.BindingMode.SourceToTarget;
            else
                p.value = isNaN(Number(p.value)) ? Corelib_11.bind.BindingMode[p.value] || Corelib_11.bind.BindingMode.SourceToTarget : Number(p.value);
            return true;
        }
        function extractScopString(v, bm) {
            if (bm === void 0) { bm = 1; }
            var s = 0;
            switch (v[0]) {
                case '-':
                    if (v[1] == '>')
                        bm = 1, s = 2;
                    else
                        bm = 0, s = 1;
                    break;
                case '<':
                    if (v[2] == '>')
                        bm = 3, s = 3;
                    else
                        bm = 2, s = 2;
                    break;
                default:
                    s = 0;
                    break;
            }
            var asp = v[s] == '.';
            s = asp ? s + 1 : s;
            return { scop: s ? v.substr(s) : v, mode: bm, dotted: asp };
        }
        bom.extractScopString = extractScopString;
        function extractCommand(v) {
            if (v[0] == '[') {
                var f = v.indexOf(']');
                var job = v.substr(1, f - 1);
                var scop = v.substr(f + 1);
            }
            else
                scop = v;
            return {
                job: job, scop: extractScopString(scop)
            };
        }
        bom.extractCommand = extractCommand;
        function processComplicatedAttribute(xx, p) {
            var dom = xx.e.dom, parent = xx.parent.Scop, _scop = xx.Scop, tsm = xx.e.Jobs, attribute = extractCommand(p.value);
            var isCmd;
            var _bind = attribute.scop;
            var job = attribute.job;
            if (!job)
                return;
            if (job[0] === '#')
                isCmd = true, job = job.substr(1);
            if (job.length === 0)
                return;
            if (_bind.dotted)
                parent = _scop || parent;
            else if (parent == null)
                parent = _scop;
            _scop = Corelib_11.bind.Scop.Create(_bind.scop, { parent: parent, bindingMode: _bind.mode, controller: xx.controller, dom: xx.Dom, parseResult: void 0 });
            if (isCmd)
                return Corelib_11.ScopicCommand.Call(job, dom, _scop);
            var ijob = job[0] == '.' ? _scop.GetJob(job.substring(1)) : Corelib_11.bind.GetJob(job);
            var ji = _scop.AddJob(ijob, dom);
            tsm.push(ji);
        }
        var bmode;
        (function (bmode) {
            bmode[bmode["<->"] = 3] = "<->";
            bmode[bmode["->"] = 1] = "->";
            bmode[bmode["<-"] = 2] = "<-";
        })(bmode || (bmode = {}));
        function bindString(x, p) {
            var scop = x.Scop, controller = x.controller;
            var s = "" + p.value;
            for (var i = 3; i > 0; i--) {
                if (s.indexOf(bmode[i]) != -1) {
                    var bindMode = i;
                    break;
                }
            }
            if (!bindMode)
                return;
            var x1 = s.split(bmode[bindMode]);
            var s1 = Corelib_11.bind.Scop.GenerateScop(x1[0], { parent: scop, bindingMode: 3, controller: controller, dom: x.Dom, parseResult: void 0 });
            var s2 = Corelib_11.bind.Scop.GenerateScop(x1[1], { parent: scop, bindingMode: 3, controller: controller, dom: x.Dom, parseResult: void 0 });
            if (!s1 || !s2)
                return;
            var tx = new Corelib_11.bind.TwoBind(bindMode, s1, s2, Corelib_11.bind.Scop.DPValue, Corelib_11.bind.Scop.DPValue);
            controller.OnDisposing = function (_s) {
                tx.Dispose();
            };
        }
        function DeclareAttribute(x, p) {
            (x.parent.Scop || x.Scop) && (x.parent.Scop || x.Scop).setAttribute(p.value, undefined);
            return undefined;
        }
        function InitTemplate(x, p) {
            var createTemplate = function (templatePath, dom) {
                if (templatePath) {
                    var template = runtime_10.mvc.MvcDescriptor.Get(templatePath);
                    dom = template.Create();
                }
                else
                    throw "template args not setted";
                return dom;
            };
            var dom = x.e.dom;
            var ndom = createTemplate(p.value, dom);
            if (dom != ndom) {
                for (var i = 0; i < dom.attributes.length; i++) {
                    var c = dom.attributes.item(i);
                    if (c.name === 'compiled' || c.name.indexOf('db-') === 0) {
                        continue;
                    }
                    ndom.setAttribute(c.name, c.value);
                }
                dom.parentNode.replaceChild(ndom, dom);
                dom = ndom;
            }
            var nx = Dom_2.Processor.Compile(x.New(dom));
            return nx || x;
        }
        function extraxtScop(x, p) {
            var tw = p.manager.getProcessorByAttribute('db-twoway');
            var v = bom.extractScopString(p.value || "");
            if (tw)
                v.mode = tw.value;
            x.e.Scop = v.scop ? Corelib_11.bind.Scop.Create(v.scop, {
                parent: x.parent.Scop,
                bindingMode: v.mode, controller: x.controller, dom: x.Dom, parseResult: void 0
            }) || x.parent.Scop : x.parent.Scop;
            if (!x.e.Scop)
                x.e.Scop = x.parent.Scop || x.controller.Scop;
            return undefined;
        }
        function strTemplate(x, _p) {
            var c = Corelib_11.bind.StringScop.GetStringScop(x.Dom.textContent, x.creteScopBuilderEventArgs());
            if (typeof c === 'string')
                return undefined;
            c.AttacheTo(x.Dom);
            x.e.Scop = c;
            if (!x.e.Scop)
                x.e.Scop = x.parent.Scop || x.controller.Scop;
            return x;
        }
        function initLocalValues(x, p) {
            for (var ic in p.value)
                x.Scop.setAttribute(ic, p.value[ic]);
            return x;
        }
        function executeFilter(x, p) {
            var tw = p.manager.getProcessorByAttribute('db-twoway');
            x.e.Scop = Corelib_11.bind.CreateFilter(p.value, x.Scop, tw && tw.value || 3);
            return x;
        }
        function execJobs(x, p) {
            var e = x.e, parentControl = x.parent.Control;
            var ts = p.value.split('|');
            for (var i = 0, l = ts.length; i < l; i++) {
                var ji = x.controller.createJobInstance(ts[i], x);
                if (ji.Control instanceof UI_2.UI.JControl)
                    ji.Control.Parent = ji.Control.Parent || x.Control || parentControl;
                if (!e.Control)
                    e.Control = ji.Control;
            }
            return x;
        }
        function getFirstChild(dom) {
            var f = dom.firstChild;
            var node;
            while (f) {
                if (f instanceof Element)
                    return f;
                if (!node && f instanceof Node)
                    node = f;
                f = f.nextSibling;
            }
            return node;
        }
        function createControl(x, p) {
            var parentScop = x.parent.Scop, parentControl = x.parent.Control, controller = x.controller, e = x.e;
            var child = getFirstChild(e.dom);
            e.dom.removeAttribute('db-control');
            var cnt = Corelib_11.ScopicControl.create({ name: p.value, dom: child, currentScop: x.Scop || parentScop, parentScop: parentScop, parentControl: parentControl, controller: controller, e: e });
            e.Control = cnt;
            cnt.Parent = parentControl;
            var parent = e.dom.parentNode || e.dom.parentElement;
            if (parent && child !== e.dom) {
                parent.replaceChild(child, e.dom);
                e.dom = child;
            }
            return undefined;
        }
        function createList(x, p) {
            var parentScop = x.parent.Scop, parentControl = x.parent.Control, controller = x.controller, e = x.e;
            var tw = p.manager.getProcessorByAttribute('db-twoway');
            var scop = x.Scop || parentScop;
            if (p.value)
                scop = Corelib_11.bind.Scop.Create(p.value, { parent: scop, bindingMode: tw && tw.value, controller: controller, dom: x.Dom, parseResult: void 0 });
            var cnt = Corelib_11.ScopicControl.create({ name: 'foreach', dom: e.dom, currentScop: scop, parentScop: parentScop, parentControl: parentControl, controller: controller, e: e });
            e.Control = cnt;
            cnt.Parent = parentControl;
            var parent = e.dom.parentNode || e.dom.parentElement;
            return undefined;
        }
        function _setName(name, cnt, e) {
            var x = cnt;
            while (x) {
                try {
                    if (x.setName) {
                        if (x.setName(name, e.dom, cnt, e) == false)
                            continue;
                        else
                            return true;
                    }
                }
                catch (w) { }
                x = x.Parent;
            }
        }
        function setName(x, p) {
            var name = p.value, parentControl = (x.parent && x.parent.Control) || x.controller.CurrentControl, e = x.e;
            if (e.Control)
                _setName(name, parentControl, e);
            else
                _setName(name, x.Control, e) || _setName(name, parentControl, e);
            return undefined;
        }
        function setProp(x, p) {
            var name = p.value, parentControl = x.controller.CurrentControl, e = x.e;
            parentControl;
            _setName(name, e.Control, e) || _setName(name, parentControl, e);
            return undefined;
        }
        function Todo(x, p) {
            var parentScop = x.parent.Scop, e = x.e, controller = x.controller;
            var s = Corelib_11.bind.Scop.Create(p.value, { parent: parentScop, bindingMode: 0, controller: controller, dom: x.Dom, parseResult: void 0 });
            s &&
                x.Scop.AddJob({
                    scopFunction: s,
                    Todo: Corelib_11.bind.Todo.prototype.Todo,
                }, e.dom);
            return undefined;
        }
        function executeCommand(x, p) {
            for (var _i = 0, _a = p.value.split('|'); _i < _a.length; _i++) {
                var xi = _a[_i];
                Corelib_11.ScopicCommand.Call(xi, x.e.dom, x.Scop);
            }
            return undefined;
        }
        Dom_2.Processor.Register({ name: 'twoway', attribute: 'db-twoway', execute: initTwoWay, check: checkTwoWay, isPrimitive: true });
        Dom_2.Processor.Register({ name: 'bind', attribute: 'db-bind', execute: extraxtScop, isPrimitive: true });
        Dom_2.Processor.Register({ name: 'filter', attribute: 'db-filter', execute: executeFilter, isPrimitive: true });
        Dom_2.Processor.Register({ name: 'init', attribute: 'db-init', execute: initLocalValues, isPrimitive: true });
        Dom_2.Processor.Register({ name: 'dec', attribute: 'db-dec', execute: DeclareAttribute, isPrimitive: true });
        Dom_2.Processor.Register({ name: 'set', attribute: 'db-set', execute: bindString, isPrimitive: true });
        Dom_2.Processor.Register({ name: 'template', attribute: 'db-template', execute: InitTemplate, isPrimitive: true });
        var x = 9007199254740000;
        Dom_2.Processor.Register({ name: 'control', attribute: 'db-control', execute: createControl, isPrimitive: true, priority: ++x });
        Dom_2.Processor.Register({ name: 'foreach', attribute: 'db-foreach', execute: createList, isPrimitive: true, priority: ++x });
        Dom_2.Processor.Register({ name: 'class', attribute: 'db-class', execute: qClass, isPrimitive: true, priority: ++x });
        Dom_2.Processor.Register({ name: 'style', attribute: 'db-style', execute: qStyle, isPrimitive: true, priority: ++x });
        Dom_2.Processor.Register({ name: 'str', attribute: 'db-str', execute: strTemplate, isPrimitive: true, priority: ++x });
        Dom_2.Processor.Register(PropertyDerectives.default);
        Dom_2.Processor.Register(Watch.NotifyDef.default);
        Dom_2.Processor.Register(AttributeDerectives.default);
        Dom_2.Processor.Register({ name: 'cmd', attribute: 'db-cmd', execute: executeCommand, isFinalizer: true });
        Dom_2.Processor.Register({ name: 'job', attribute: 'db-job', execute: execJobs, isFinalizer: true });
        Dom_2.Processor.Register({ name: 'exec', attribute: 'db-exec', execute: processComplicatedAttribute, isFinalizer: true });
        Dom_2.Processor.Register({ name: 'todo', attribute: 'db-todo', execute: Todo, isFinalizer: true });
        Dom_2.Processor.Register({ name: 'prop', attribute: 'db-prop', execute: setName, isFinalizer: true, priority: 9007199254740991 });
        Dom_2.Processor.Register({ name: 'name', attribute: 'db-name', execute: setName, isFinalizer: true, priority: Number.MAX_VALUE });
        Dom_2.Processor.Register(event.EventDef.default);
        function load() {
        }
        bom.load = load;
    })(bom = exports.bom || (exports.bom = {}));
    Encoding_3.encoding.SerializationContext.GlobalContext.Register(Number, {
        FromJson: function (a) {
            if (a == null)
                return 0;
            if (typeof a === 'number')
                return a;
            if (typeof a === 'string')
                return parseInt(a);
            throw "basic.Guid.FromNumber(parseInt(a));";
        },
        ToJson: function (a) { return a == null ? 0 : a.toString(); }
    });
    Encoding_3.encoding.SerializationContext.GlobalContext.Register(Date, {
        FromJson: function (a) {
            if (a == null)
                return null;
            if (typeof a === 'number')
                return new Date(a);
            if (typeof a === 'string')
                return new Date(a);
            else
                return undefined;
        },
        ToJson: function (a) { return a.toJSON(); }
    });
});
define("sys/Services", ["require", "exports", "sys/System", "sys/UI", "sys/QModel", "sys/runtime", "sys/net", "sys/Encoding"], function (require, exports, System_3, UI_3, QModel_1, runtime_11, net_4, Encoding_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var services;
    (function (services) {
        var requester;
        var AlertMessage = (function () {
            function AlertMessage() {
                this.Name = 'alert';
            }
            AlertMessage.prototype.OnResponse = function (proxy, webr, json) {
                runtime_11.Msg.defaultApi().ShowDialog(json.sdata.Title, json.sdata.Content, null, 'OK', null);
            };
            return AlertMessage;
        }());
        var ConfirmMessage = (function () {
            function ConfirmMessage() {
                this.Name = 'confirm';
            }
            ConfirmMessage.prototype.OnResponse = function (proxy, webr, json) {
                var _this = this;
                var c = new Encoding_4.encoding.SerializationContext(true);
                var e = c.FromJson(json.sdata, QModel_1.models.Message, null);
                c.Dispose();
                switch (e.Type) {
                    case 0:
                    case 1:
                        if (proxy.callBack)
                            proxy.callBack(proxy, json, undefined);
                        return;
                    case 2:
                    case 3:
                        e.Callback = {
                            ProxyCallback: proxy,
                            Request: webr.current,
                            QueeDownloader: webr,
                        };
                        var elm = document.createElement('div');
                        elm.innerHTML = e.Content;
                        var t = new UI_3.UI.TControl(elm, e.Data);
                        runtime_11.Msg.defaultApi().ShowDialog(e.Title, t, function (xx) { return _this.OnMessageClosed(xx, e); }, e.OKText, e.CancelText, e.AbortText);
                        return;
                }
            };
            ConfirmMessage.prototype.OnMessageClosed = function (xx, e) {
                e.Action = UI_3.UI.MessageResult[xx.Result].toLowerCase();
                requester.Post(QModel_1.models.Message, e, null, function (s, r, iss) {
                    if (iss) {
                        var t = e.Callback;
                        t.QueeDownloader.Insert(t.Request);
                        e.Dispose();
                    }
                    else
                        e.Dispose();
                });
            };
            return ConfirmMessage;
        }());
        var SpeechMessage = (function () {
            function SpeechMessage() {
                this.Name = 'speech';
            }
            SpeechMessage.prototype.OnResponse = function (proxy, webr, json) {
                var _this = this;
                var c = new Encoding_4.encoding.SerializationContext(true);
                var e = c.FromJson(json.sdata, QModel_1.models.Message, null);
                c.Dispose();
                switch (e.Type) {
                    case 0:
                    case 1:
                        if (proxy.callBack)
                            proxy.callBack(proxy, json, undefined);
                        return;
                    case 2:
                    case 3:
                        e.Callback = {
                            ProxyCallback: proxy,
                            Request: webr.current,
                            QueeDownloader: webr,
                        };
                        var elm = document.createElement('div');
                        elm.innerHTML = e.Content;
                        var t = new UI_3.UI.TControl(elm, e.Data);
                        runtime_11.Msg.defaultApi().ShowDialog(e.Title, t, function (xx) { return _this.OnMessageClosed(xx, e); }, e.OKText, e.CancelText, e.AbortText);
                        return;
                }
            };
            SpeechMessage.prototype.OnMessageClosed = function (xx, e) {
                e.Action = UI_3.UI.MessageResult[xx.Result].toLowerCase();
                e.privateDecompress = true;
                requester.Post(QModel_1.models.Message, e, null, function (s, r, iss, req) {
                    e.Callback.ProxyCallback.Callback(e.Callback.QueeDownloader, req);
                });
            };
            return SpeechMessage;
        }());
        var InfoNotification = (function () {
            function InfoNotification() {
                this.Name = 'notification';
            }
            InfoNotification.prototype.OnResponse = function (proxy, webr, json) {
                UI_3.UI.InfoArea.push(json.sdata.Content, json.sdata.IsInfo, json.sdata.Expire);
            };
            return InfoNotification;
        }());
        var notfication = (function () {
            function notfication() {
                this.Name = 'notfication';
            }
            notfication.prototype.OnResponse = function (proxy, webr, json) {
                var x = document.location.origin;
                window.location.assign(x + "/admin");
                localStorage.clear();
                document.cookie = 'id=;';
                document.close();
                json.dropRequest = true;
                UI_3.UI.InfoArea.push(json.sdata.Content, json.sdata.IsInfo, json.sdata.Expire);
            };
            return notfication;
        }());
        function LoadServices(_requester) {
            requester = _requester;
            System_3.Controller.Register(new AlertMessage());
            System_3.Controller.Register(new ConfirmMessage());
            System_3.Controller.Register(new SpeechMessage());
            System_3.Controller.Register(new InfoNotification());
            System_3.Controller.Register(new notfication());
            System_3.Controller.Register({
                Name: 'guid', OnResponse: function (proxy, webr, json) {
                    var d = json.sdata;
                    if (typeof d === 'number') {
                        net_4.setGuidRange(d, d + 2000 - 1);
                    }
                    else if (d instanceof Array) {
                        net_4.setGuidRange(d[0], d[1]);
                    }
                    else
                        throw "Invalide Exception";
                }
            });
        }
        services.LoadServices = LoadServices;
    })(services = exports.services || (exports.services = {}));
});
define("sys/Critere", ["require", "exports", "sys/Corelib", "sys/collections", "sys/UI", "sys/runtime"], function (require, exports, Corelib_12, collections_7, UI_4, runtime_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var $Bool = Boolean;
    var Critere;
    (function (Critere_1) {
        var __typesDesc = new collections_7.collection.Dictionary("test");
        var Critere = (function (_super) {
            __extends(Critere, _super);
            function Critere() {
                var _this = _super.call(this) || this;
                _this.Scop = new Corelib_12.bind.ValueScop(_this, Corelib_12.bind.BindingMode.TwoWay);
                return _this;
            }
            Critere.prototype.Check = function (s) {
                { }
                return this.isMatch(s);
            };
            Critere.prototype.convertFromString = function (x) {
                throw new Error("Method not implemented.");
            };
            Critere.prototype.Begin = function (deb, count) {
                this.deb = deb;
                this.fin = deb + count;
                return !this.IsQuerable();
            };
            Critere.prototype.IsMatch = function (i, item) {
                return i >= this.deb && i < this.fin && this.isMatch(item);
            };
            Critere.prototype.equals = function (p) {
                return p == this;
            };
            Critere.prototype.Activate = function () {
                this.Scop.setAttribute('activate', true);
                var s = this.Scop.getScop('activate');
            };
            Critere.prototype.Disactivate = function () {
                this.Scop.setAttribute('activate', false);
            };
            Critere.prototype.GetMatchs = function (p) {
                if (!this.IsQuerable())
                    return p;
                var v = [];
                for (var i = 0; i < p.length; i++) {
                    var x = p[i];
                    if (this.isMatch(x))
                        v.push(x);
                }
                return v;
            };
            Object.defineProperty(Critere.prototype, "View", {
                get: function () {
                    return this._view || (this._view = this.getView());
                },
                enumerable: true,
                configurable: true
            });
            Critere.prototype.isMatch = function (v) {
                return this._isMatch(v);
            };
            Critere.prototype.IsActivated = function () {
                var s = this.Scop.getScop('activate');
                return !!(s && s.Value);
            };
            Critere.prototype.init = function () {
                var vls = this.GetType().getFields();
                for (var i = 0; i < vls.length; i++) {
                    var p = vls[i];
                    if (runtime_12.reflection.IsInstanceOf(p.Type, Text)) {
                        this.set(p, new Text(p.Name));
                    }
                    else if (runtime_12.reflection.IsInstanceOf(p.Type, Vector)) {
                        this.set(p, new Vector(p.Name));
                    }
                    else if (runtime_12.reflection.IsInstanceOf(p.Type, Period)) {
                        this.set(p, new Period(p.Name));
                    }
                    else if (runtime_12.reflection.IsInstanceOf(p.Type, Boolean)) {
                        this.set(p, new Boolean(p.Name));
                    }
                    else
                        throw null;
                }
            };
            Critere.getTypeOf = function (type) {
                return this.Get(type).CritereType;
            };
            Critere.prototype.smartClear = function () {
                var vls = this.GetValues();
                for (var n in vls) {
                    var v = vls[n];
                    if (v instanceof Critere)
                        v.clear();
                }
            };
            Critere.ctor = function () {
                this.Register(String, Text, {}, function (o, dp, mvc, prm) { return new Text((prm && prm.label) || dp.Name); });
                this.Register($Bool, Boolean, {}, function (o, dp, mvc, prm) { return new Boolean((prm && prm.label) || dp.Name); });
                this.Register(Number, Vector, {}, function (o, dp, mvc, prm) { return new Vector((prm && prm.label) || dp.Name); });
                this.Register(Date, Period, {}, function (o, dp, mvc, prm) { return new Period((prm && prm.label) || dp.Name); });
            };
            Critere.Register = function (PropertyType, CritereType, Properties, CreateView) {
                __typesDesc.Set(PropertyType, { CritereType: CritereType, PropertyType: PropertyType, CreateView: CreateView, Properties: Properties });
            };
            Critere.Get = function (type, strict) {
                if (type instanceof runtime_12.reflection.GenericType)
                    type = type.Constructor;
                else if (type instanceof runtime_12.reflection.DelayedType)
                    type = type.Type;
                return __typesDesc.Get(type) || (strict ? null : __typesDesc.Get(String));
            };
            Critere.prototype.Open = function (callback) {
                var _this = this;
                if (!this.modal)
                    this.modal = runtime_12.Msg.defaultApi().New();
                var m = this.modal;
                if (!m.IsInit)
                    m.OnInitialized = function (m) { m.Add(_this.View); m.OkTitle('Search'); m.Canceltitle('Cancel'); m.Title('QSearch'); };
                m.OnClosed.Add(function (m) {
                    if (m.Result == UI_4.UI.MessageResult.ok)
                        callback(_this);
                    m.Modal.OnClosed.Remove('');
                }, '');
                m.Open();
            };
            return Critere;
        }(collections_7.utils.Filter));
        Critere_1.Critere = Critere;
        var Unaire = (function (_super) {
            __extends(Unaire, _super);
            function Unaire() {
                return _super.call(this) || this;
            }
            Unaire.prototype.clear = function () {
                this.Value = null;
            };
            Unaire.__fields__ = function () { return [this.DPValue]; };
            Unaire.CheckType = function (e) {
                e.__this.CheckType(e);
            };
            Unaire.DPValue = Corelib_12.bind.DObject.CreateField('Value', Object, null, null, Unaire.CheckType);
            return Unaire;
        }(Critere));
        Critere_1.Unaire = Unaire;
        var Couple = (function (_super) {
            __extends(Couple, _super);
            function Couple() {
                return _super.call(this) || this;
            }
            Couple.__fields__ = function () { return [this.DPX, this.DPY]; };
            Couple.CheckType = function (e) {
                e.__this.CheckType(e);
            };
            Couple.DPX = Corelib_12.bind.DObject.CreateField('X', Object, null, null, Couple.CheckType);
            Couple.DPY = Corelib_12.bind.DObject.CreateField('Y', Object, null, null, Couple.CheckType);
            return Couple;
        }(Critere));
        Critere_1.Couple = Couple;
        var Text = (function (_super) {
            __extends(Text, _super);
            function Text(label) {
                var _this = _super.call(this) || this;
                _this.Label = label || "Label";
                return _this;
            }
            Text.prototype.clear = function () {
                this.Value = null;
            };
            Text.prototype.getView = function () {
                return new UI_4.UI.TControl('templates.crtText', this.Scop);
            };
            Object.defineProperty(Text.prototype, "Label", {
                set: function (v) {
                    this.Scop.setAttribute('label', v);
                },
                enumerable: true,
                configurable: true
            });
            Text.prototype.CheckType = function (e) {
                e._new = e._new == null ? null : String(e._new).toLowerCase();
            };
            Text.prototype._isMatch = function (v) {
                var sv = this.Value;
                if (sv == null || sv == "")
                    return true;
                if (v == null)
                    return false;
                if (v == sv)
                    return true;
                return String(v).toLowerCase().indexOf(sv) != -1;
            };
            Object.defineProperty(Text.prototype, "Value", {
                get: function () {
                    return this.get(Unaire.DPValue);
                },
                set: function (v) {
                    this.set(Unaire.DPValue, v);
                },
                enumerable: true,
                configurable: true
            });
            Text.prototype.IsQuerable = function () {
                return (this.Value != null && String(this.Value).trim() !== "");
            };
            return Text;
        }(Unaire));
        Critere_1.Text = Text;
        var Boolean = (function (_super) {
            __extends(Boolean, _super);
            function Boolean(label) {
                var _this = _super.call(this) || this;
                _this.Label = label || "Label";
                return _this;
            }
            Boolean.prototype.clear = function () {
                this.Value = undefined;
            };
            Boolean.prototype.getView = function () {
                return new UI_4.UI.TControl('templates.crtBool', this.Scop);
            };
            Object.defineProperty(Boolean.prototype, "Label", {
                set: function (v) {
                    this.Scop.setAttribute('label', v);
                },
                enumerable: true,
                configurable: true
            });
            Boolean.prototype.CheckType = function (e) {
                e._new = e._new == null ? null : e._new === undefined ? undefined : !!e._new;
            };
            Boolean.prototype._isMatch = function (v) {
                var sv = this.Value;
                if (sv === undefined)
                    return true;
                return sv === v;
            };
            Boolean.prototype.IsQuerable = function () {
                return this.Value != null;
            };
            return Boolean;
        }(Unaire));
        Critere_1.Boolean = Boolean;
        var Vector = (function (_super) {
            __extends(Vector, _super);
            function Vector(title) {
                var _this = _super.call(this) || this;
                _this.Title = title || "Vector Title";
                _this.clear();
                return _this;
            }
            Vector.prototype.getView = function () {
                return new UI_4.UI.TControl('templates.crtVector', this.Scop);
            };
            Vector.prototype.CheckType = function (e) {
                if (typeof e._new === 'number')
                    return;
                if (typeof e._new === 'string')
                    e._new = parseFloat(e._new);
                else if (e._new == null)
                    return;
                else
                    e._new = e._old;
            };
            Vector.prototype._isMatch = function (v) {
                if (isNaN(v))
                    return true;
                var a = isNaN(this.X) ? -Number.MAX_VALUE : this.X || 0;
                var b = isNaN(this.Y) ? Number.MAX_VALUE : this.Y || 0;
                return v >= a && v <= b;
            };
            Object.defineProperty(Vector.prototype, "Title", {
                get: function () {
                    var x = this.Scop.getScop('title', false);
                    if (x)
                        return x.Value;
                    return null;
                },
                set: function (v) {
                    this.Scop.setAttribute('title', v);
                },
                enumerable: true,
                configurable: true
            });
            Vector.prototype.clear = function () { this.X = 0; this.Y = 0; };
            Vector.prototype.IsQuerable = function () {
                return this.X != null || this.Y != null;
            };
            return Vector;
        }(Couple));
        Critere_1.Vector = Vector;
        var minDate = new Date("1/1/1000");
        var maxDate = new Date("12/12/9999");
        var Period = (function (_super) {
            __extends(Period, _super);
            function Period(title) {
                var _this = _super.call(this) || this;
                _this.Title = title || "Period Title";
                return _this;
            }
            Period.prototype.getView = function () {
                return new UI_4.UI.TControl('templates.crtPeriod', this.Scop);
            };
            Period.prototype.CheckType = function (e) {
                if (typeof e._new === 'number' || typeof e._new === 'string')
                    e._new = new Date(e._new);
                else if (e._new instanceof Date)
                    return;
                else if (e._new == null)
                    return e._new = new Date();
                else
                    e._new = e._old;
            };
            Period.prototype.IsQuerable = function () {
                return (this.X != null || this.Y != null);
            };
            Period.prototype._isMatch = function (v) {
                if (v == null)
                    return true;
                var iv = v && v.getTime();
                return iv >= this.X.getTime() && iv <= this.Y.getTime();
            };
            Object.defineProperty(Period.prototype, "Title", {
                get: function () {
                    var x = this.Scop.getScop('title', false);
                    if (x)
                        return x.Value;
                    return null;
                },
                set: function (v) {
                    this.Scop.setAttribute('title', v);
                },
                enumerable: true,
                configurable: true
            });
            Period.prototype.clear = function () { this.Y = new Date(Date.now()); this.Y = new Date(0); };
            return Period;
        }(Couple));
        Critere_1.Period = Period;
        var ComplexCritere = (function (_super) {
            __extends(ComplexCritere, _super);
            function ComplexCritere() {
                var _this = _super.call(this) || this;
                _this.init();
                return _this;
            }
            Object.defineProperty(ComplexCritere.prototype, "Shema", {
                get: function () { return this.constructor.__shema; },
                enumerable: true,
                configurable: true
            });
            ComplexCritere.generateFieldsFrom = function (type, fields) {
                fields = fields || Corelib_12.bind.DObject.getFields(type);
                var _flds = [];
                var _propertiesSheam = [];
                for (var i = 0; i < fields.length; i++) {
                    var fld = fields[i];
                    if (!runtime_12.reflection.IsInstanceOf(fld.Type, collections_7.collection.List)) {
                        var crDP = Corelib_12.bind.DObject.CreateField(fld.Name, this.getTypeOf(fld.Type));
                        _flds.push(crDP);
                        _propertiesSheam.push({ critereDP: crDP, propertyDP: fld });
                    }
                }
                this.__shema = {
                    critereType: this,
                    proxyType: type,
                    critereProperties: _flds,
                    propertiesSheam: _propertiesSheam
                };
                return this.__shema.critereProperties;
            };
            ComplexCritere.prototype.InitProperties = function (prams) {
                prams = prams || {};
                var flds = this.Shema.propertiesSheam;
                for (var i = 0; i < flds.length; i++) {
                    var p = flds[i];
                    var mvc = Critere.Get(p.propertyDP.Type);
                    this.set(p.critereDP, mvc.CreateView(this, p.propertyDP, mvc, prams[p.propertyDP.Name]));
                }
            };
            ComplexCritere.prototype.init = function () {
                this.InitProperties();
            };
            ComplexCritere.prototype.getView = function (container) {
                var c = container || new UI_4.UI.DivControl('section');
                var flds = this.Shema.propertiesSheam;
                flds = flds.sort(function (a, b) { return __typesDesc.IndexOf(a.propertyDP.Type); });
                for (var i = 0; i < flds.length; i++) {
                    var p = flds[i].critereDP;
                    var v = this.get(p);
                    if (v instanceof Critere)
                        c.Add(v.View);
                }
                return c;
            };
            ComplexCritere.prototype.clear = function () {
                var flds = Corelib_12.bind.DObject.getFields(this.GetType());
                for (var i = 0; i < flds.length; i++) {
                    var p = flds[i];
                    var v = this.get(p);
                    if (v instanceof Critere)
                        v.clear();
                }
            };
            ComplexCritere.prototype.IsQuerable = function () {
                this.indexes = [];
                var crPrps = this.Shema.propertiesSheam;
                for (var i = 0; i < crPrps.length; i++) {
                    var prSch = crPrps[i];
                    var v = this.get(prSch.critereDP);
                    if (v.IsActivated() && v.IsQuerable())
                        this.indexes.push({ critereValue: v, propertyDP: prSch.propertyDP });
                }
                return this.indexes.length != 0;
            };
            ComplexCritere.prototype.isMatch = function (p) {
                for (var i = 0; i < this.indexes.length; i++) {
                    var v = this.indexes[i];
                    if (!v.critereValue.isMatch(p.GetValue(v.propertyDP)))
                        return false;
                }
                return true;
            };
            ComplexCritere.prototype._isMatch = function (v) {
                throw new Error("Method not implemented.");
            };
            return ComplexCritere;
        }(Critere));
        Critere_1.ComplexCritere = ComplexCritere;
    })(Critere = exports.Critere || (exports.Critere = {}));
});
define("sys/AI", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AI;
    (function (AI) {
        var $math = Math;
        var tools;
        (function (tools) {
            var INFINITY = 1 / 0;
            var argsTag = '[object Arguments]';
            function isFlattenable(value) {
                return value instanceof Array || String(value) === argsTag;
            }
            tools.isFlattenable = isFlattenable;
            function baseFlatten(array, depth, predicate, isStrict, result) {
                var index = -1, length = array.length;
                predicate || (predicate = isFlattenable);
                result || (result = []);
                while (++index < length) {
                    var value = array[index];
                    if (depth > 0 && predicate(value)) {
                        if (depth > 1) {
                            baseFlatten(value, depth - 1, predicate, isStrict, result);
                        }
                        else {
                            result.push(value);
                        }
                    }
                    else if (!isStrict) {
                        result[result.length] = value;
                    }
                }
                return result;
            }
            tools.baseFlatten = baseFlatten;
            function flattenDeep(array) {
                var length = array == null ? 0 : array.length;
                return length ? baseFlatten(array, INFINITY) : [];
            }
            tools.flattenDeep = flattenDeep;
            var SegmentRunner = (function () {
                function SegmentRunner(start, end) {
                    this.Disposed = [];
                    this.Last = this.Writer = new Segment(null, start, end);
                }
                SegmentRunner.prototype.Next = function () {
                    var s = this.Reader;
                    while (s)
                        if (this.Cursor <= s.End) {
                            return this.Cursor++;
                        }
                        else {
                            this.Disposed.push(s);
                            this.Reader = s = this.Reader.NextSegment;
                        }
                    return undefined;
                };
                return SegmentRunner;
            }());
            tools.SegmentRunner = SegmentRunner;
            var Iterator = (function () {
                function Iterator() {
                    this.runner = new SegmentRunner(0, 1999);
                }
                Iterator.prototype.Read = function () {
                    return this.runner.Next();
                };
                Iterator.prototype.Write = function () {
                };
                return Iterator;
            }());
            tools.Iterator = Iterator;
            var Segment = (function () {
                function Segment(parent, Start, End) {
                    if (Start === void 0) { Start = 0; }
                    if (End === void 0) { End = 0; }
                    this.Start = Start;
                    this.End = End;
                    if (parent)
                        parent.NextSegment = this;
                }
                return Segment;
            }());
            tools.Segment = Segment;
        })(tools = AI.tools || (AI.tools = {}));
        var StringSimiarity;
        (function (StringSimiarity) {
            function compareTwoStrings(str1, str2) {
                var result = null;
                result = calculateResultIfIdentical(str1, str2);
                if (result != null) {
                    return result;
                }
                result = calculateResultIfEitherIsEmpty(str1, str2);
                if (result != null) {
                    return result;
                }
                result = calculateResultIfBothAreSingleCharacter(str1, str2);
                if (result != null) {
                    return result;
                }
                var pairs1 = wordLetterPairs(str1.toUpperCase());
                var pairs2 = wordLetterPairs(str2.toUpperCase());
                var intersection = 0;
                var union = pairs1.length + pairs2.length;
                pairs1.forEach(function (pair1) {
                    for (var i = 0; i < pairs2.length; i++) {
                        var pair2 = pairs2[i];
                        if (pair1 === pair2) {
                            intersection++;
                            pairs2.splice(i, 1);
                            break;
                        }
                    }
                });
                return (2.0 * intersection) / union;
            }
            StringSimiarity.compareTwoStrings = compareTwoStrings;
            function findBestMatch(mainString, targetStrings) {
                var ratings = targetStrings.map(function (targetString) {
                    return {
                        target: targetString,
                        rating: compareTwoStrings(mainString, targetString)
                    };
                });
                return {
                    ratings: ratings,
                    bestMatch: bestMatch(ratings)
                };
            }
            StringSimiarity.findBestMatch = findBestMatch;
            function bestMatch(ratings) {
                var t = undefined;
                var cm = Number.NEGATIVE_INFINITY;
                for (var i = 0; i < ratings.length; i++) {
                    var c = ratings[i];
                    if (cm < c.rating) {
                        cm = c.rating;
                        t = c;
                    }
                }
                return t;
            }
            StringSimiarity.bestMatch = bestMatch;
            function letterPairs(str) {
                var numPairs = str.length - 1;
                var pairs = [];
                for (var i = 0; i < numPairs; i++) {
                    pairs[i] = str.substring(i, i + 2);
                }
                return pairs;
            }
            function wordLetterPairs(str) {
                return tools.flattenDeep(str.split(' ').map(letterPairs));
            }
            function calculateResultIfIdentical(str1, str2) {
                if (str1.toUpperCase() == str2.toUpperCase()) {
                    return 1;
                }
                return null;
            }
            function calculateResultIfBothAreSingleCharacter(str1, str2) {
                if (str1.length == 1 && str2.length == 1) {
                    return 0;
                }
            }
            function calculateResultIfEitherIsEmpty(str1, str2) {
                if (str1.length == 0 && str2.length == 0) {
                    return 1;
                }
                if ((str1.length + str2.length) > 0 && (str1.length * str2.length) == 0) {
                    return 0;
                }
                return null;
            }
            function Sort(rattings) {
                return rattings.ratings.sort(com);
            }
            StringSimiarity.Sort = Sort;
            function com(a, b) {
                return b.rating - a.rating;
            }
        })(StringSimiarity = AI.StringSimiarity || (AI.StringSimiarity = {}));
        var Math;
        (function (Math) {
            var GCDExtended = (function () {
                function GCDExtended(gcd, factorA, factorB) {
                    this.SetValues(gcd, factorA, factorB);
                }
                GCDExtended.prototype.SetValues = function (gcd, factorA, factorB) {
                    this.GCD = gcd;
                    this.FactorA = factorA;
                    this.FactorB = factorB;
                    return this;
                };
                return GCDExtended;
            }());
            Math.GCDExtended = GCDExtended;
            function mul_mod(a, b, m) {
                if (a >= m)
                    a %= m;
                if (b >= m)
                    b %= m;
                return (a + b) % m;
            }
            Math.mul_mod = mul_mod;
            function PowMod(base, exp, modulus) {
                base %= modulus;
                var result = 1;
                while (exp > 0) {
                    if (exp & 1)
                        result = (result * base) % modulus;
                    base = (base * base) % modulus;
                    exp >>= 1;
                }
                return result;
            }
            Math.PowMod = PowMod;
            var primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997, 1009, 1013, 1019, 1021, 1031, 1033, 1039, 1049, 1051, 1061, 1063, 1069, 1087, 1091, 1093, 1097, 1103, 1109, 1117, 1123, 1129, 1151, 1153, 1163, 1171, 1181, 1187, 1193, 1201, 1213, 1217, 1223, 1229, 1231, 1237, 1249, 1259, 1277, 1279, 1283, 1289, 1291, 1297, 1301, 1303, 1307, 1319, 1321, 1327, 1361, 1367, 1373, 1381, 1399, 1409, 1423, 1427, 1429, 1433, 1439, 1447, 1451, 1453, 1459, 1471, 1481, 1483, 1487, 1489, 1493, 1499, 1511, 1523, 1531, 1543, 1549, 1553, 1559, 1567, 1571, 1579, 1583, 1597, 1601, 1607, 1609, 1613, 1619, 1621, 1627, 1637, 1657, 1663, 1667, 1669, 1693, 1697, 1699, 1709, 1721, 1723, 1733, 1741, 1747, 1753, 1759, 1777, 1783, 1787, 1789, 1801, 1811, 1823, 1831, 1847, 1861, 1867, 1871, 1873, 1877, 1879, 1889, 1901, 1907, 1913, 1931, 1933, 1949, 1951, 1973, 1979, 1987, 1993, 1997, 1999, 2003, 2011, 2017, 2027, 2029, 2039, 2053, 2063, 2069, 2081, 2083, 2087, 2089, 2099, 2111, 2113, 2129, 2131, 2137, 2141, 2143, 2153, 2161, 2179, 2203, 2207, 2213, 2221, 2237, 2239, 2243, 2251, 2267, 2269, 2273, 2281, 2287, 2293, 2297, 2309, 2311, 2333, 2339, 2341, 2347, 2351, 2357, 2371, 2377, 2381, 2383, 2389, 2393, 2399, 2411, 2417, 2423, 2437, 2441, 2447, 2459, 2467, 2473, 2477, 2503, 2521, 2531, 2539, 2543, 2549, 2551, 2557, 2579, 2591, 2593, 2609, 2617, 2621, 2633, 2647, 2657, 2659, 2663, 2671, 2677, 2683, 2687, 2689, 2693, 2699, 2707, 2711, 2713, 2719, 2729, 2731, 2741, 2749, 2753, 2767, 2777, 2789, 2791, 2797, 2801, 2803, 2819, 2833, 2837, 2843, 2851, 2857, 2861, 2879, 2887, 2897, 2903, 2909, 2917, 2927, 2939, 2953, 2957, 2963, 2969, 2971, 2999, 3001, 3011, 3019, 3023, 3037, 3041, 3049, 3061, 3067, 3079, 3083, 3089, 3109, 3119, 3121, 3137, 3163, 3167, 3169, 3181, 3187, 3191, 3203, 3209, 3217, 3221, 3229, 3251, 3253, 3257, 3259, 3271, 3299, 3301, 3307, 3313, 3319, 3323, 3329, 3331, 3343, 3347, 3359, 3361, 3371, 3373, 3389, 3391, 3407, 3413, 3433, 3449, 3457, 3461, 3463, 3467, 3469, 3491, 3499, 3511, 3517, 3527, 3529, 3533, 3539, 3541, 3547, 3557, 3559, 3571, 3581, 3583, 3593, 3607, 3613, 3617, 3623, 3631, 3637, 3643, 3659, 3671, 3673, 3677, 3691, 3697, 3701, 3709, 3719, 3727, 3733, 3739, 3761, 3767, 3769, 3779, 3793, 3797, 3803, 3821, 3823, 3833, 3847, 3851, 3853, 3863, 3877, 3881, 3889, 3907, 3911, 3917, 3919, 3923, 3929, 3931, 3943, 3947, 3967, 3989, 4001];
            function getRandomPrime(cond, maxIndex) {
                var time = performance.now();
                maxIndex || (maxIndex = primes.length - 1);
                do {
                    if (performance.now() - time > 5000)
                        throw null;
                    var p = primes[$math.floor($math.random() * maxIndex)];
                } while (!cond(p));
                return p;
            }
            Math.getRandomPrime = getRandomPrime;
            function get_common_denom(e, PHI) {
                var great, temp, a;
                if (e > PHI) {
                    while (e % PHI != 0) {
                        temp = e % PHI;
                        e = PHI;
                        PHI = temp;
                    }
                    great = PHI;
                }
                else {
                    while (PHI % e != 0) {
                        a = PHI % e;
                        PHI = e;
                        e = a;
                    }
                    great = e;
                }
                return great;
            }
            Math.get_common_denom = get_common_denom;
            function GCD(a1, b1) {
                var a = a1, b = b1;
                while (b) {
                    var c = a;
                    a = b;
                    b = c % b;
                }
                ;
                return a;
            }
            Math.GCD = GCD;
            ;
            function ExGCD(a1, b1, rem) {
                if (rem === void 0) { rem = 0; }
                var a = a1, b = b1;
                while (b != rem && b) {
                    var a1 = a;
                    var b1 = b;
                    a = b;
                    b = a1 % b1;
                }
                ;
                return { result: a1, factor: b1, rem: b, x: (a1 - rem) / b1 };
            }
            Math.ExGCD = ExGCD;
            function gcd_extended(p, q) {
                if (q == 0)
                    return new GCDExtended(p, 1, 0);
                var vals = gcd_extended(q, p.mod(q));
                var b = vals.FactorA - vals.FactorB * $math.floor(p / q);
                return vals.SetValues(vals.GCD, vals.FactorB, b);
            }
            Math.gcd_extended = gcd_extended;
            function divides(numerator, denominator) {
                if (numerator.mod(denominator) > 0)
                    return false;
                return true;
            }
            function SolveCongurentEqu(factor, rem, modulus) {
                var m = $math.abs(modulus);
                var a = factor.mod(m);
                var b = rem.mod(m);
                var result_extended = gcd_extended(a, m);
                var solutions = new Array();
                if (!divides(b, result_extended.GCD))
                    return solutions;
                var firstSolution = (result_extended.FactorA * (b / result_extended.GCD)).mod(m);
                for (var i = 0; i < result_extended.GCD; i++) {
                    var otherSolution = (firstSolution + i * (m / result_extended.GCD)).mod(m);
                    solutions.push(otherSolution);
                }
                return solutions.sort(function (a, b) { return b - a; });
            }
            Math.SolveCongurentEqu = SolveCongurentEqu;
            Number.prototype.mod = function (n) {
                return ((this % n) + n) % n;
            };
        })(Math = AI.Math || (AI.Math = {}));
        var Encryption;
        (function (Encryption) {
            var RSA = (function () {
                function RSA(key) {
                    this.key = key;
                }
                RSA.prototype.transform = function (byte) {
                    return Math.PowMod(byte, this.key.e, this.key.n);
                };
                RSA.prototype.isValideByte = function (byte) { return byte >= 0 && byte < this.key.n; };
                return RSA;
            }());
            Encryption.RSA = RSA;
            var FastRSA = (function () {
                function FastRSA(key) {
                    this.key = key;
                    this.array = [];
                }
                FastRSA.prototype.transform = function (byte) {
                    return this.array[byte] || (this.array[byte] = Math.PowMod(byte, this.key.e, this.key.n));
                };
                FastRSA.prototype.isValideByte = function (byte) { return byte >= 0 && byte < this.key.n; };
                return FastRSA;
            }());
            Encryption.FastRSA = FastRSA;
            function GenerateRSAKey(sourceMaxByte, transformedMaxByte) {
                var p = Math.getRandomPrime(function (p) { return p > 100; }, 100);
                var q = Math.getRandomPrime(function (t) {
                    if (t == p)
                        return false;
                    var n1 = t * p;
                    if (n1 < sourceMaxByte)
                        return false;
                    if (n1 > transformedMaxByte)
                        return false;
                    return true;
                }, 100);
                var n = p * q;
                var h = (p - 1) * (q - 1);
                var d;
                var time = performance.now();
                do {
                    if (performance.now() - time > 5000)
                        throw null;
                    var e = Math.getRandomPrime(function (p) { return p < h && p > 3; });
                    var sols = Math.SolveCongurentEqu(e, 1, h);
                    if (sols.length == 0)
                        continue;
                    d = sols[0];
                    break;
                } while (true);
                return {
                    Decripter: new RSA({ n: n, e: d }),
                    Encrypter: new RSA({ n: n, e: e })
                };
            }
            Encryption.GenerateRSAKey = GenerateRSAKey;
            function test(f, iter, args) {
                if (iter === void 0) { iter = 1e4; }
                var deb = performance.now();
                var i = iter;
                while (--i)
                    f.apply(null, args);
                return performance.now() - deb;
            }
            Encryption.test = test;
        })(Encryption = AI.Encryption || (AI.Encryption = {}));
    })(AI = exports.AI || (exports.AI = {}));
});
define("sys/resources", ["require", "exports", "context"], function (require, exports, context_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Resources;
    (function (Resources) {
        var stat = void 0;
        var stack = [];
        Resources.result = {};
        var resources = {
            uiTemplate: 'template|../assets/templates/UITemplates.html',
            components: "template|../assets/templates/Components.html",
            heavyTable: "template|../assets/Components/HeavyTable/dom.htm",
            strechyButton: 'template|../../assets/Components/StrechyButton/dom.html'
        };
        function OnInitalized(callback) {
            if (stat === void 0)
                return stack.push(callback);
            return callback(stat);
        }
        Resources.OnInitalized = OnInitalized;
        function Initialize() {
            var _res = clone(resources);
            for (var res in _res)
                iter(_res[res]);
        }
        Resources.Initialize = Initialize;
        function iter(res) {
            function p(r) {
                check(res, r);
            }
            require(res, p, p);
        }
        function isEmpty(obj) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key))
                    return false;
            }
            return true;
        }
        function keyOf(value) {
            for (var x in resources)
                if (resources[x] === value)
                    return x;
            return void 0;
        }
        function check(res, r) {
            var key = keyOf(res);
            if (key !== void 0) {
                Resources.result[key] = r;
                delete resources[key];
            }
            if (isEmpty(resources)) {
                for (var _i = 0, stack_1 = stack; _i < stack_1.length; _i++) {
                    var cll = stack_1[_i];
                    try {
                        cll(true);
                    }
                    catch (e) {
                    }
                }
                stat = true;
                stack = void 0;
                resources = void 0;
                context_8.context.ExecuteModule(true);
            }
        }
        context_8.context.HandleExecution();
        Initialize();
    })(Resources = exports.Resources || (exports.Resources = {}));
    var Ids;
    (function (Ids) {
        var t1 = (function () {
            function t1() {
            }
            return t1;
        }());
        Ids.t1 = t1;
        var t2 = (function () {
            function t2() {
            }
            return t2;
        }());
        Ids.t2 = t2;
        var t3 = (function () {
            function t3() {
            }
            return t3;
        }());
        Ids.t3 = t3;
    })(Ids = exports.Ids || (exports.Ids = {}));
    var TemplateTypes;
    (function (TemplateTypes) {
        var RichMenu = (function () {
            function RichMenu() {
            }
            return RichMenu;
        }());
        TemplateTypes.RichMenu = RichMenu;
    })(TemplateTypes = exports.TemplateTypes || (exports.TemplateTypes = {}));
});
define("Core", ["require", "exports", "context", "sys/Syntaxer", "sys/System", "sys/Filters", "sys/QModel", "sys/Corelib", "sys/db", "sys/runtime", "sys/Encoding", "sys/Jobs", "sys/Thread", "sys/Initializer", "sys/Services", "sys/Critere", "sys/AI", "sys/UI", "sys/resources"], function (require, exports, context_9, Syntaxer_4, System_4, Filters_2, QModel_2, Corelib_13, db_2, runtime_13, Encoding_5, Jobs_1, Thread_1, Initializer_1, Services_1, Critere_2, AI_1, UI_5, resources_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(context_9);
    __export(Syntaxer_4);
    __export(System_4);
    __export(Filters_2);
    __export(QModel_2);
    __export(Corelib_13);
    __export(db_2);
    __export(runtime_13);
    __export(Encoding_5);
    __export(Jobs_1);
    __export(Thread_1);
    __export(Initializer_1);
    __export(Services_1);
    __export(Critere_2);
    __export(AI_1);
    __export(UI_5);
    ValidateImport(resources_1.Resources);
});
define("sys/Components", ["require", "exports", "sys/UI", "sys/Corelib", "sys/collections", "context", "sys/runtime", "sys/Dom", "sys/utils"], function (require, exports, UI_6, Corelib_14, collections_8, context_10, runtime_14, Dom_3, utils_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Components;
    (function (Components) {
        var MdTextbox = (function (_super) {
            __extends(MdTextbox, _super);
            function MdTextbox(_view) {
                var _this = _super.call(this, _view || document.createElement('md-textbox')) || this;
                _this.applyStyle('md-textbox');
                _this._input = _this.createElemnt('input');
                _this._input.setAttribute('required', "");
                _this._input.type = 'text';
                _this.createElemnt('span', "highlight");
                _this.createElemnt('span', "bar");
                _this._label = _this.createElemnt('label');
                _this._label.classList.add('mdlabel');
                _this.InputBox = new UI_6.UI.Input(_this._input);
                return _this;
            }
            MdTextbox_1 = MdTextbox;
            MdTextbox.prototype._hasValue_ = function () { return true; };
            MdTextbox.prototype._OnValueChanged = function (e) {
                if (this._isChanging)
                    return;
                this._isChanging = true;
                switch (this._input.type) {
                    case 'date':
                        this._input.valueAsDate = e._new;
                        break;
                    case 'number':
                        this._input.valueAsNumber = e._new;
                        break;
                    default:
                        this._input.value = e._new || '';
                }
                this._auto && (this._auto.Value = e._new);
                this._isChanging = false;
            };
            MdTextbox.prototype.OnLabelChanged = function (e) {
                this._label.textContent = e._new;
            };
            MdTextbox.prototype.createElemnt = function (tag, _class) {
                var f = document.createElement(tag);
                if (_class)
                    f.classList.add(_class);
                this.View.appendChild(f);
                return f;
            };
            MdTextbox.prototype.initialize = function () {
                if (!this._auto)
                    this._input.addEventListener('change', this);
            };
            MdTextbox.prototype.handleEvent = function (e) {
                if (e.type == "change")
                    return this.onInputChanged(e);
            };
            MdTextbox.prototype.onInputChanged = function (e) {
                if (this._isChanging)
                    return;
                this._isChanging = true;
                switch (this._input.type) {
                    case 'date':
                        this.privateValue = this._input.valueAsDate;
                        break;
                    case 'number':
                        this.privateValue = this._input.valueAsNumber;
                        break;
                    default:
                        this.privateValue = this._input.value;
                }
                this._isChanging = false;
            };
            Object.defineProperty(MdTextbox.prototype, "Type", {
                get: function () {
                    return this._input.type;
                },
                set: function (v) {
                    this._input.type = v;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MdTextbox.prototype, "AutoCompleteBox", {
                get: function () {
                    return this._auto;
                },
                enumerable: true,
                configurable: true
            });
            MdTextbox.prototype.OnSuggesionsChanged = function (e) {
                var _this = this;
                if (!this._auto) {
                    this._input.removeEventListener('change', this);
                    this._auto = new UI_6.UI.ProxyAutoCompleteBox(this.InputBox, e._new);
                    this._auto.initialize();
                    this._auto.OnValueChanged(this, function (box, oldVal, newVal) { _this.privateValue = newVal; });
                }
                else
                    this._auto.DataSource = e._new;
            };
            MdTextbox.componenet = function (e) {
                var x = e.node, p = e.instance;
                var dom = x.Dom;
                var c = new MdTextbox_1(dom);
                var tw = p.manager.getProcessorByAttribute('db-twoway');
                var ds = dom.getAttribute('data-source');
                if (ds) {
                    var datasource = Corelib_14.bind.Scop.Create(ds, { parent: x.parent.Scop, bindingMode: Corelib_14.bind.BindingMode.SourceToTarget, controller: x.controller, dom: x.Dom, parseResult: void 0 });
                    if (datasource) {
                        datasource.OnPropertyChanged(Corelib_14.bind.Scop.DPValue, function (s, e) { c.Suggestions = e._new; });
                        c.Suggestions = datasource.Value;
                    }
                }
                x.e.Control = c;
                c.Parent = x.controller.CurrentControl;
                c.Label = c.View.getAttribute('label');
                c.Type = c.View.getAttribute('type');
                if (dom.hasAttribute('bind-to-scop') && x.Scop) {
                    var xs = new Corelib_14.bind.TwoBind(tw && tw.value, x.Scop, c, Corelib_14.bind.Scop.DPValue, Corelib_14.bind.Scop.DPValue);
                    c.OnDisposing = function (c) { xs.Dispose(); };
                    c.privateValue = x.Scop.Value;
                }
                return undefined;
            };
            MdTextbox.ctor = function () {
                require('style|../assets/style/Components.css', void 0, void 0, context_10.context);
            };
            var MdTextbox_1;
            __decorate([
                Corelib_14.bind.property(String, "Label", void 0, MdTextbox_1.prototype.OnLabelChanged),
                __metadata("design:type", String)
            ], MdTextbox.prototype, "Label", void 0);
            __decorate([
                Corelib_14.bind.property(collections_8.collection.List, void 0, void 0, MdTextbox_1.prototype.OnSuggesionsChanged),
                __metadata("design:type", collections_8.collection.List)
            ], MdTextbox.prototype, "Suggestions", void 0);
            MdTextbox = MdTextbox_1 = __decorate([
                Dom_3.attributes.Component({ handler: MdTextbox_1.componenet, name: 'md-textbox', Serices: [] }),
                __metadata("design:paramtypes", [HTMLElement])
            ], MdTextbox);
            return MdTextbox;
        }(UI_6.UI.JControl));
        Components.MdTextbox = MdTextbox;
        var MdIconGroup = (function (_super) {
            __extends(MdIconGroup, _super);
            function MdIconGroup() {
                return _super.call(this, document.createElement('div'), 'IconGroup.Item') || this;
            }
            MdIconGroup.prototype.setDataContext = function (data) {
                var s = this.Source;
                if (s) {
                    s.Clear();
                    s.AddRange(data.value);
                }
                else {
                    this.Source = new collections_8.collection.List(Object, data.value);
                }
                this._data = data;
            };
            MdIconGroup.prototype.getDataContext = function () {
                return this._data;
            };
            MdIconGroup.prototype.initialize = function () {
                this.applyStyle('icon-group');
            };
            return MdIconGroup;
        }(UI_6.UI.ListAdapter));
        Components.MdIconGroup = MdIconGroup;
        var ContextMenuTemplate = (function (_super) {
            __extends(ContextMenuTemplate, _super);
            function ContextMenuTemplate() {
                var _this = _super.call(this) || this;
                _this.garbage = {};
                if (!ContextMenuTemplate.store)
                    ContextMenuTemplate.ctor();
                return _this;
            }
            ContextMenuTemplate.ctor = function () {
                this.store = {};
                this._labelTemplate = UI_6.UI.Template.ToTemplate("MdContextMenu.label", true);
                this._menuItemTemplate = UI_6.UI.Template.ToTemplate("MdContextMenu.menuitem", true);
                this.store['label'] = {
                    template: this._labelTemplate,
                    create: function (data, cnt) {
                        return this.template.CreateShadow(data);
                    }
                };
                this.store['menu-item'] = {
                    template: this._menuItemTemplate,
                    create: function (data, cnt) {
                        return this.template.CreateShadow(data);
                    }
                };
                var sep = document.createElement('div');
                sep.classList.add('separator');
                this.store['separator'] = {
                    template: new UI_6.UI.HtmlTemplate(sep, true),
                    create: function (data, cnt) {
                        return this.template.CreateShadow(data, cnt);
                    }
                };
                this.store['icongroup'] = {
                    create: function (data, cnt) {
                        var cv = new MdIconGroup();
                        cv.setDataContext(data);
                        return cv;
                    }, template: void 0
                };
            };
            ContextMenuTemplate.prototype.CreateShadow = function (data, cnt) {
                var item = data instanceof Corelib_14.bind.Scop ? data.Value : data;
                var x = (this.garbage[item.type] || ContextMenuTemplate.EmptyArray).pop();
                if (x)
                    x.setDataContext(data);
                else
                    x = ContextMenuTemplate.store[item.type].create(item, cnt);
                return x;
            };
            ContextMenuTemplate.prototype.CacheTemplateShadow = function (item, child) {
                var g = this.garbage[item.type];
                g.push(child);
            };
            ContextMenuTemplate.EmptyArray = [];
            return ContextMenuTemplate;
        }(UI_6.UI.Template));
        Components.ContextMenuTemplate = ContextMenuTemplate;
        var MdContextMenu = (function (_super) {
            __extends(MdContextMenu, _super);
            function MdContextMenu(items) {
                var _this = _super.call(this, document.createElement('md-contextmenu'), new ContextMenuTemplate()) || this;
                _this.Source = new collections_8.collection.List(Object);
                if (items && items.length)
                    _this.OnInitialized = function (n) { return n.Source.AddRange(items); };
                _this.OnIconGroupItemCliced = _this.OnIconGroupItemCliced.bind(_this);
                return _this;
            }
            MdContextMenu.prototype.OnClosed = function (result, e) {
                e.selectedItem = result || this.SelectedItem;
                runtime_14.helper.TryCatch(e, e.callback, void 0, [e]);
                return e.cancel;
            };
            MdContextMenu.prototype.getView = function () {
                return this;
            };
            MdContextMenu.ctor = function () {
                var csses = ['../assets/fonts/robotoFamily.css', '../assets/icons/roboto-icons.css', '../assets/style/Components.css'];
                for (var _i = 0, csses_1 = csses; _i < csses_1.length; _i++) {
                    var i = csses_1[_i];
                    require('style|' + i, void 0, void 0, context_10.context);
                }
            };
            MdContextMenu.prototype.getItemShadow = function (item, i) {
                var x = this.Template.CreateShadow(item, void 0);
                if (item.type === 'icongroup')
                    x.OnChildClicked.Remove('icon-group-clicked'), x.OnChildClicked.Add(this.OnIconGroupItemCliced, 'icon-group-clicked');
                return x;
            };
            MdContextMenu.prototype.OnIconGroupItemCliced = function (e) {
                UI_6.UI.Desktop.Current.CurrentApp.CloseContextMenu(e.template.getDataContext());
                e.Cancel = true;
            };
            MdContextMenu.prototype.disposeItemShadow = function (item, child, i) {
                var t = this.Template;
                t.CacheTemplateShadow(item, child);
                return child;
            };
            MdContextMenu.prototype.disposeItemsShadow = function (items, childs) {
                if (!items && !childs)
                    return;
                var t = this.Template;
                if (!items) {
                    for (var i = 0; i < childs.length; i++) {
                        var child = childs[i];
                        var c = child.getDataContext();
                        if (c == void 0)
                            runtime_14.helper.TryCatch(child, child.Dispose);
                        else
                            t.CacheTemplateShadow(c, child);
                    }
                }
                else if (!childs) {
                    return;
                }
                else if (items.length == childs.length) {
                    for (var i = 0; i < childs.length; i++) {
                        var child = childs[i];
                        var item = items[i];
                        var c = child.getDataContext();
                        if (c == item || c == void 0)
                            t.CacheTemplateShadow(item, child);
                        else
                            t.CacheTemplateShadow(c || item, child);
                    }
                }
                else
                    for (var i = 0; i < childs.length; i++) {
                        var c = childs[i].getDataContext();
                        t.CacheTemplateShadow(c, childs[i]);
                    }
            };
            MdContextMenu.prototype.initialize = function () {
                this.applyStyle('rc-context-menu');
                this._view.style.top = "100px";
                this._view.style.left = "300px";
            };
            MdContextMenu.prototype.getTarget = function () {
                throw new Error("Method not implemented.");
            };
            MdContextMenu.prototype._revalidate = function (e) {
                if (e.x || e.y)
                    return;
                e.x = e.e.x;
                e.y = e.e.y;
            };
            MdContextMenu.prototype.OnAttached = function (e) {
                this._revalidate(e);
                this.disapplyStyle('hidden');
                this._view.style.left = e.x + "px";
                this._view.style.top = e.y + "px";
            };
            MdContextMenu.prototype.OnItemClicked = function (s, e, t) {
                _super.prototype.OnItemClicked.call(this, s, e, t);
                var i = t.SelectedItem;
                if (i && i.type !== 'icongroup' && !i.nonSelectable)
                    UI_6.UI.Desktop.Current.CurrentApp.CloseContextMenu(i);
            };
            __decorate([
                Corelib_14.bind.property(collections_8.collection.List),
                __metadata("design:type", collections_8.collection.List)
            ], MdContextMenu.prototype, "ItemsSource", void 0);
            return MdContextMenu;
        }(UI_6.UI.ListAdapter));
        Components.MdContextMenu = MdContextMenu;
    })(Components = exports.Components || (exports.Components = {}));
    (function (Components) {
        function getTemplates() {
            return r.Resources.result;
        }
        Components.getTemplates = getTemplates;
        var r;
        require("./sys/resources", function (e) {
            r = e;
        });
        var HeavyTable = (function (_super) {
            __extends(HeavyTable, _super);
            function HeavyTable(cols) {
                var _this = _super.call(this, getTemplates().heavyTable.template.get("heavyTable"), UI_6.UI.help.createTemplate(cols)) || this;
                _this.cols = cols;
                _this.orderMap = {};
                _this._x = 0;
                _this._y = 0;
                _this.stat = [];
                _this.editCell = document.createElement('input');
                _this.Controller = Dom_3.Controller.Attach(_this, _this);
                _this.activateClass = 'selected';
                _this.Controller.OnCompiled = {
                    Invoke: _this.OnCompileEnd, Owner: _this
                };
                _this.OnPropertyChanged(UI_6.UI.ListAdapter.DPSelectedIndex, function (e, b) { this.setXY(undefined, b._new); }, _this);
                return _this;
            }
            HeavyTable.prototype.initialize = function () {
                var _this = this;
                _super.prototype.initialize.call(this);
                this.editCell.addEventListener('blur', function (e) {
                    if (_this.isfocussed)
                        _this.endEdit(true);
                });
            };
            HeavyTable.prototype.OnCompileEnd = function (cnt) {
            };
            HeavyTable.prototype.setName = function (name, dom, cnt, e) {
                if (name == '_tbl_head') {
                    UI_6.UI.help.createHeader(dom, this.cols, { Owner: this, Invoke: this.OnOrderBy });
                }
            };
            HeavyTable.prototype.OnOrderBy = function (sender, orderBy, col, view) {
                if (this._orderHandler && this._orderHandler.Invoke) {
                    var c = this.orderMap[orderBy];
                    if (!c)
                        this.orderMap[orderBy] = c = { factor: 1, lastStat: void 0 };
                    else if (!c.factorHandled)
                        c.factor *= -1;
                    var e = { col: col, state: c, orderBy: orderBy, sender: this, view: view, previous: this.currentOrderMap };
                    runtime_14.helper.TryCatch(this._orderHandler.Owner, this._orderHandler.Invoke, void 0, [e]);
                    if (!c.factorHandled)
                        c.factor = c.factor < 0 ? -1 : 1;
                    this.currentOrderMap = e;
                    e.previous = void 0;
                }
            };
            HeavyTable.prototype.setOrderHandler = function (handler) {
                this._orderHandler = handler;
            };
            HeavyTable.prototype.endEdit = function (save) {
                if (!this.isfocussed)
                    return false;
                this.isfocussed = false;
                try {
                    this.editCell.remove();
                }
                catch (_a) { }
                if (save)
                    this._selectedCell.textContent = this.editCell.value;
                else
                    this._selectedCell.textContent = this.oldInnerText;
                return true;
            };
            HeavyTable.prototype.beginEdit = function () {
                return this.edit(this.selectCell());
            };
            HeavyTable.prototype.edit = function (currentElement) {
                if (!this.cols[this._x].editable)
                    return false;
                var input = this.editCell;
                this.oldInnerText = currentElement.textContent;
                input.value = this.oldInnerText;
                currentElement.innerText = "";
                currentElement.appendChild(input);
                input.focus();
                this.isfocussed = true;
                return true;
            };
            Object.defineProperty(HeavyTable.prototype, "EOF", {
                get: function () {
                    return this._x === this.ColCount() - 1 && this._y === this.Source.Count - 1;
                },
                enumerable: true,
                configurable: true
            });
            HeavyTable.prototype.OnKeyDown = function (e) {
                if (this.isfocussed && e.keyCode === 27) {
                    if (this.isfocussed)
                        this.endEdit(false);
                    else
                        return false;
                }
                else if (e.keyCode == 13) {
                    if (this.isfocussed) {
                        if (this.endEdit(true))
                            return true;
                    }
                    else if (this.beginEdit())
                        return true;
                }
                else if (e.keyCode == 9) {
                    if (this.isfocussed)
                        this.endEdit(true);
                    if (this.EOF)
                        return;
                    this.setXY(this.x + (e.shiftKey ? -1 : 1), undefined);
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    e.preventDefault();
                    return true;
                }
                else if (!this.isfocussed && e.keyCode >= 37 && e.keyCode <= 40) {
                    var r;
                    switch (e.keyCode) {
                        case 37:
                            r = this.setXY(this.x - 1, undefined);
                            break;
                        case 38:
                            r = this.setXY(undefined, this._y - 1);
                            break;
                        case 39:
                            r = this.setXY(this.x + 1, undefined);
                            break;
                        case 40:
                            r = this.setXY(undefined, this._y + 1);
                            break;
                        default: return false;
                    }
                    if (r)
                        return true;
                }
                else
                    return false;
                return _super.prototype.OnKeyDown.call(this, e);
            };
            Object.defineProperty(HeavyTable.prototype, "x", {
                get: function () { return this._x; },
                set: function (v) {
                    if (this.cols.length == 0)
                        return;
                    var vc = this.ColCount();
                    var i = v < 0 ? -1 : v < vc ? 0 : 1;
                    if (i === -1)
                        this._x = this.Rebound ? vc - 1 : 0;
                    else if (i === +1)
                        this._x = this.Rebound ? 0 : vc - 1;
                    else
                        this._x = v;
                    if (i && this.Rebound)
                        this.y += i;
                },
                enumerable: true,
                configurable: true
            });
            HeavyTable.prototype.ColCount = function () { return this.visibleCols ? this.visibleCols.length : this.cols.length; };
            Object.defineProperty(HeavyTable.prototype, "y", {
                get: function () { return this._y; },
                set: function (v) {
                    var vr = this.Source.Count;
                    if (vr == 0)
                        return;
                    var i = v < 0 ? -1 : v < vr ? 0 : 1;
                    if (i === -1)
                        this._y = this.Rebound ? vr - 1 : 0;
                    else if (i === +1)
                        this._y = this.Rebound ? 0 : vr - 1;
                    else
                        this._y = v;
                    if (i && this.Rebound)
                        this.x += i;
                },
                enumerable: true,
                configurable: true
            });
            HeavyTable.prototype.setXY = function (x, y) {
                if (!this.Rebound) {
                    if (x < 0)
                        return false;
                    if (x >= this.ColCount())
                        return false;
                    if (y >= this.Source.Count)
                        return false;
                }
                this.deselectCell();
                if (x != undefined)
                    this.x = x;
                if (y != undefined)
                    this.y = y;
                this._selectedCell = this.getCurrentCell();
                this.selectCell();
                this.SelectedIndex = this._y;
                return true;
            };
            HeavyTable.prototype.getStat = function () {
                return { x: this._x, y: this._y };
            };
            HeavyTable.prototype.getCurrentCell = function () {
                var t = this.Content.getChild(this._y);
                if (!t)
                    return;
                return t.View.children.item(this.visibleCols == null ? this.x : this.visibleCols[this.x]);
            };
            HeavyTable.prototype.selectCell = function () {
                this._selectedCell && this._selectedCell.classList.add('selected');
                return this._selectedCell;
            };
            HeavyTable.prototype.deselectCell = function () {
                this._selectedCell && this._selectedCell.classList.remove('selected');
            };
            HeavyTable.ctor = function () {
                require('style|../assets/Components/HeavyTable/style.css');
            };
            return HeavyTable;
        }(UI_6.UI.ListAdapter));
        Components.HeavyTable = HeavyTable;
        Corelib_14.ScopicControl.register('heavytable', function (e) {
            var tableDef = e.dom.getAttribute('tableDef');
            var tableDEF = e.currentScop.getScop(tableDef, false);
            var x = new HeavyTable(tableDEF.Value);
            tableDEF.Dispose();
            if (e.dom.hasAttribute('bind-to-scop')) {
                if (e.currentScop)
                    e.currentScop.OnPropertyChanged(Corelib_14.bind.Scop.DPValue, function (s, e) {
                        x.Source = e._new;
                    }, x);
                x.OnInitialized = function (x) { return x.Source = e.currentScop.Value; };
            }
            return x;
        });
    })(Components = exports.Components || (exports.Components = {}));
    (function (Components) {
        var ActionButton = (function (_super) {
            __extends(ActionButton, _super);
            function ActionButton() {
                var _this = _super.call(this, document.createElement('div')) || this;
                _this.applyStyle('pull-right', 'flat');
                "\n            <div id=\"68\" class=\"pull-right flat\">\n                <label class=\"btn btn-default glyphicon glyphicon-filter\">  </label>\n                <input id=\"70\" autocomplete=\"off\" placeholder=\"Select a Client\" class=\"input form-control\" style=\"min-width: 300px; margin-top: 1px; float: left; width: auto;\">\n            </div>\n            ";
                return _this;
            }
            ActionButton.__fields__ = function () { return [this.DPSource, this.DPValue]; };
            Object.defineProperty(ActionButton.prototype, "Value", {
                get: function () { return this.get(ActionButton.DPValue); },
                set: function (v) { this.set(ActionButton.DPValue, v); },
                enumerable: true,
                configurable: true
            });
            ActionButton.prototype.initialize = function () {
                this.Caption = new UI_6.UI.Label("").applyStyle('btn', 'btn-default', 'glyphicon', 'glyphicon-filter');
                this.Box = new UI_6.UI.Input().applyStyle('input', 'form-control');
                this.Box.setAttribute('style', 'min-width: 300px; margin-top: 1px; float: left; width: auto;').setAttribute('autocomplete', 'off').setAttribute('placeholder', 'Search ...');
                this.AutocompleteBox = new UI_6.UI.ProxyAutoCompleteBox(this.Box, this.Source);
                this.AutocompleteBox.OnValueChanged(this, this.OnValueChanged);
                this.Add(this.Caption).Add(this.Box);
                this.AutocompleteBox.initialize();
            };
            ActionButton.prototype.OnSourceChanged = function (e) {
                this.AutocompleteBox.DataSource = e._new;
            };
            ActionButton.prototype.OnValueChanged = function (box, oldValue, newValue) {
                this.privateValue = newValue;
            };
            ActionButton.DPSource = Corelib_14.bind.DObject.CreateField("Source", collections_8.collection.List, undefined, ActionButton.prototype.OnSourceChanged);
            ActionButton.DPValue = Corelib_14.bind.DObject.CreateField("Value", Object);
            return ActionButton;
        }(UI_6.UI.JControl));
        Components.ActionButton = ActionButton;
    })(Components = exports.Components || (exports.Components = {}));
    (function (Components) {
        var StrechyButton = (function (_super) {
            __extends(StrechyButton, _super);
            function StrechyButton() {
                return _super.call(this, Components.getTemplates().strechyButton.template.get('strechy-button'), UI_6.UI.TControl.Me) || this;
            }
            StrechyButton.prototype.setName = function (name, dom, cnt, e) {
                this['_'.concat(name)] = dom;
            };
            StrechyButton.prototype.initialize = function () {
                UI_6.UI.JControl.LoadCss(context_10.context.GetPath('style.css'));
            };
            StrechyButton.prototype.OnCompileEnd = function () {
                this._Trigger.addEventListener('click', this);
            };
            StrechyButton.prototype.handleEvent = function (event) {
                utils_7.$$(this.View).toggleClass('nav-is-visible');
            };
            StrechyButton.ctor = function () {
                require('style|../assets/Components/StrechyButton/style.css');
            };
            return StrechyButton;
        }(UI_6.UI.TControl));
        Components.StrechyButton = StrechyButton;
    })(Components = exports.Components || (exports.Components = {}));
});
define("sys/scops", ["require", "exports", "sys/Syntaxer", "sys/Corelib", "sys/collections", "sys/Dom", "sys/runtime", "context"], function (require, exports, Syntaxer_5, Corelib_15, collections_9, Dom_4, runtime_15, context_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Scops;
    (function (Scops) {
        function isConstant(t) {
            return t.tokon <= Syntaxer_5.Parser.CToken.string;
        }
        var Bind = (function (_super) {
            __extends(Bind, _super);
            function Bind(path, parent, bindMode) {
                var _this = _super.call(this, bindMode) || this;
                _this.pb = null;
                _this.observer = new Corelib_15.bind.Observer(null, []);
                _this.int = false;
                if (typeof path === 'string')
                    path = path.split('.');
                _this.Path = path;
                _this.int = true;
                _this.Parent = parent;
                _this.privateValue = _this.observer.Value;
                if ((bindMode & 1) == 1)
                    _this.observerBinding = _this.observer.OnPropertyChanged(Corelib_15.bind.Observer.DPValue, _this.__OnValueChanged, _this);
                _this.int = false;
                return _this;
            }
            Bind._build = function (e, optmz) {
                return new Bind(e.parseResult.resut, e.parent, e.bindingMode).setController(e.controller);
            };
            Bind.prototype.Is = function (toke) {
                return toke == 'bindscope';
            };
            Bind.__fields__ = function () {
                return [Bind.DPParent, Bind.DPPath];
            };
            Bind.prototype.PathChanged = function (e) {
                this.int = true;
                this.observer.Path = e._new == null ? [] : e._new;
                this.int = false;
            };
            Bind.ParentChanged = function (e) {
                var t = e.__this;
                var n = e._new;
                var o = e._old;
                if (o != null && t.pb != null) {
                    o.removeEvent(Corelib_15.bind.Scop.DPValue, t.pb);
                }
                if (n != null) {
                    t.pb = n.OnPropertyChanged(Corelib_15.bind.Scop.DPValue, t.ParentValueChanged, t);
                    t.observer.Me = n.Value;
                }
                else
                    t.observer.Me = null;
            };
            Bind.prototype.Dispose = function () {
                var h = this.OnDispose();
                if (h === null)
                    return;
                this.removeEvent(Corelib_15.bind.Scop.DPValue, this.pb);
                this.observer.removeEvent(Corelib_15.bind.Observer.DPValue, this.observerBinding);
                this.observer.Dispose();
                this.pb = null;
                this.observerBinding = null;
                this.observer = null;
                _super.prototype.Dispose.call(this);
                if (!h)
                    this.DisposingStat = 2;
            };
            Bind.prototype.ParentValueChanged = function (sender, e) {
                this.int = true;
                this.observer.Me = e._new;
                this.int = false;
            };
            Object.defineProperty(Bind.prototype, "Path", {
                get: function () { return this.get(Bind.DPPath); },
                set: function (value) { this.set(Bind.DPPath, value); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Bind.prototype, "Parent", {
                get: function () { return this.get(Bind.DPParent); },
                set: function (value) { this.set(Bind.DPParent, value); },
                enumerable: true,
                configurable: true
            });
            Bind.prototype.__OnValueChanged = function (sender, e) {
                this.isChanging = true;
                this.privateValue = e._new;
                this.isChanging = false;
            };
            Bind.prototype.AttributeChanged = function (e) {
            };
            Bind.prototype._OnValueChanged = function (e) {
                if (this.isChanging)
                    return;
                if (((this.BindingMode & 2) === 2) && !this.int) {
                    var o = this.observer;
                    var p = o.xpath;
                    var l = p.length;
                    if (l === 0)
                        return;
                    var parent;
                    var lp = p[l - 1];
                    if (l === 1)
                        parent = o.Me;
                    else
                        parent = p[l - 2].Value;
                    if (parent)
                        if (lp.Property != null)
                            parent.set(lp.Property, e._new);
                        else
                            parent[lp.Name] = e._new;
                }
            };
            Bind.prototype.getParent = function () { return this.get(Bind.DPParent); };
            Bind.prototype.setParent = function (v) { if (this.canBeParent(v))
                this.set(Bind.DPParent, v);
            else
                return false; return true; };
            Bind.prototype.getChildren = function () { return []; };
            Object.defineProperty(Bind.prototype, "Values", {
                get: function () { return this.observer.xpath; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Bind.prototype, "Segments", {
                get: function () { return this.observer.xpath; },
                enumerable: true,
                configurable: true
            });
            Bind.prototype.forEach = function (callback, param) {
                var t = this.observer.xpath;
                for (var i = t.length - 1; i >= 0; i--) {
                    if (callback(t[i].Value, param))
                        return { value: t[i].Value };
                }
            };
            Object.defineProperty(Bind.prototype, "ParentValue", {
                get: function () {
                    var pth = this.observer.xpath;
                    if (pth.length == 1) {
                        var p = this.getParent();
                        return p && p.Value;
                    }
                    return pth[pth.length - 2].Value;
                },
                enumerable: true,
                configurable: true
            });
            Bind.DPPath = Corelib_15.bind.DObject.CreateField("Path", Array, null, Bind.prototype.PathChanged);
            Bind.DPParent = Corelib_15.bind.DObject.CreateField("Parent", Corelib_15.bind.Scop, null, Bind.ParentChanged);
            __decorate([
                Dom_4.attributes.Parser2ScopHandler('bindscope'),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", [Object, Boolean]),
                __metadata("design:returntype", void 0)
            ], Bind, "_build", null);
            return Bind;
        }(Corelib_15.bind.Scop));
        Scops.Bind = Bind;
        var FunctionCallScop = (function (_super) {
            __extends(FunctionCallScop, _super);
            function FunctionCallScop(e) {
                var _this = _super.call(this, 1) || this;
                var rslt = e.parseResult.resut;
                _this.caller = {
                    scop: Corelib_15.bind.Scop.BuildScop(Corelib_15.bind.mixIn(e, { bindingMode: 1, parseResult: rslt.caller }))
                };
                if (_this._bindingMode)
                    _this.caller.pb = _this.caller.scop.OnPropertyChanged(Corelib_15.bind.Scop.DPValue, _this.Invoke, _this);
                _this.args = new Array(rslt.args.length);
                for (var i = 0; i < rslt.args.length; i++) {
                    var arg = rslt.args[i];
                    _this.args[i] = {
                        isConstant: isConstant(arg),
                        value: isConstant(arg) ? arg.resut : void 0,
                        scop: isConstant(arg) ? void 0 : Corelib_15.bind.Scop.BuildScop(Corelib_15.bind.mixIn(e, { bindingMode: 1, parseResult: arg }))
                    };
                    if (!_this.args[i].isConstant && _this._bindingMode)
                        _this.args[i].pb = _this.args[i].scop.OnPropertyChanged(Corelib_15.bind.Scop.DPValue, _this.Invoke, _this);
                }
                e.parent.OnPropertyChanged(Corelib_15.bind.Scop.DPValue, function (s, e) {
                    this.Invoke();
                }, _this);
                if (_this._bindingMode)
                    _this.Invoke();
                return _this;
            }
            FunctionCallScop.prototype.Is = function (toke) {
                return toke == Syntaxer_5.Parser.CToken.functionCall;
            };
            FunctionCallScop._build = function (e) {
                var scop = new FunctionCallScop(e).setController(e.controller);
                return scop;
            };
            FunctionCallScop.prototype._OnValueChanged = function (e) { };
            FunctionCallScop.prototype.Invoke = function (s, e) {
                var caller = this.caller.scop.Value;
                if (typeof caller !== 'function') {
                    this.privateValue = caller;
                    return;
                }
                var args = new Array(this.args.length);
                for (var i = 0; i < this.args.length; i++) {
                    var arg = this.args[i];
                    args[i] = arg.isConstant ? arg.value : arg.value = this.args[i].scop.Value;
                }
                this.privateValue = runtime_15.helper.TryCatch(this.caller.scop.ParentValue, caller, void 0, args);
            };
            __decorate([
                Dom_4.attributes.Parser2ScopHandler(Syntaxer_5.Parser.CToken.functionCall),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", [Object]),
                __metadata("design:returntype", void 0)
            ], FunctionCallScop, "_build", null);
            return FunctionCallScop;
        }(Corelib_15.bind.Scop));
        Scops.FunctionCallScop = FunctionCallScop;
        var ArrayCallScop = (function (_super) {
            __extends(ArrayCallScop, _super);
            function ArrayCallScop(e) {
                var _this = _super.call(this, e.bindingMode || 3) || this;
                var rslt = e.parseResult.resut;
                _this.caller = {
                    scop: Corelib_15.bind.Scop.BuildScop(Corelib_15.bind.mixIn(e, { bindingMode: 1, parseResult: rslt.caller }))
                };
                _this.caller.pb = _this.caller.scop.OnPropertyChanged(Corelib_15.bind.Scop.DPValue, _this.Reset, _this);
                var arg = rslt.index;
                _this.index = {
                    isConstant: isConstant(arg),
                    value: isConstant(arg) ? arg.resut : void 0,
                    scop: isConstant(arg) ? void 0 : Corelib_15.bind.Scop.BuildScop(Corelib_15.bind.mixIn(e, { bindingMode: 1, parseResult: arg }))
                };
                if (!_this.index.isConstant)
                    _this.index.pb = _this.index.scop.OnPropertyChanged(Corelib_15.bind.Scop.DPValue, _this.Reset, _this);
                _this.Reset();
                return _this;
            }
            ArrayCallScop.prototype.Is = function (toke) {
                return toke == Syntaxer_5.Parser.CToken.arrayCall;
            };
            ArrayCallScop._build = function (e, optmz) {
                var scop = new ArrayCallScop(e).setController(e.controller);
                return scop;
            };
            ArrayCallScop.prototype._OnValueChanged = function (e) {
                if ((this._bindingMode & 2) != 2)
                    return;
                var caller = this.caller.scop.Value;
                var index = this.index.isConstant ? this.index.value : this.index.scop.Value;
                if (caller == void 0)
                    return;
                else if (caller instanceof collections_9.collection.List)
                    if (typeof index === 'number')
                        this.privateValue = caller.Set(index, e._new);
                    else
                        return;
                else
                    caller[index] = e._new;
            };
            ArrayCallScop.prototype.Reset = function (s, e) {
                var caller = this.caller.scop.Value;
                var index = this.index.isConstant ? this.index.value : this.index.scop.Value;
                if (caller == void 0)
                    this.privateValue = void 0;
                else if (caller instanceof collections_9.collection.List)
                    this.privateValue = caller.Get(index);
                else
                    this.privateValue = caller[index];
            };
            __decorate([
                Dom_4.attributes.Parser2ScopHandler(Syntaxer_5.Parser.CToken.arrayCall),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", [Object, Boolean]),
                __metadata("design:returntype", void 0)
            ], ArrayCallScop, "_build", null);
            return ArrayCallScop;
        }(Corelib_15.bind.Scop));
        Scops.ArrayCallScop = ArrayCallScop;
        var CondtionScop = (function (_super) {
            __extends(CondtionScop, _super);
            function CondtionScop(e) {
                var _this = _super.call(this, 1) || this;
                var rslt = e.parseResult;
                _this.Condition = new Corelib_15.bind.IScopConst(Corelib_15.bind.mixIn(e, { parseResult: rslt.condition })).CaptureEvent(_this._onConditionChanged, _this);
                _this.Success = new Corelib_15.bind.IScopConst(Corelib_15.bind.mixIn(e, { parseResult: rslt.success })).CaptureEvent(_this._onSuccessChanged, _this);
                _this.Fail = new Corelib_15.bind.IScopConst(Corelib_15.bind.mixIn(e, { parseResult: rslt.fail })).CaptureEvent(_this._onFailChanged, _this);
                _this.privateValue = _this.Condition.Value ? _this.Success.Value : _this.Fail.Value;
                return _this;
            }
            CondtionScop.prototype.Is = function (toke) {
                return toke == Syntaxer_5.Parser.CToken.condition;
            };
            CondtionScop._build = function (e, optmz) {
                var scop = new CondtionScop(e).setController(e.controller);
                return scop;
            };
            CondtionScop.prototype._onConditionChanged = function (s, ev) {
                this.privateValue = ev._new ? this.Success.Value : this.Fail.Value;
            };
            CondtionScop.prototype._onSuccessChanged = function (s, ev) {
                this.privateValue = this.Condition.Value ? ev._new : this.Fail.Value;
            };
            CondtionScop.prototype._onFailChanged = function (s, ev) {
                this.privateValue = this.Condition.Value ? this.Success.Value : ev._new;
            };
            CondtionScop.prototype._OnValueChanged = function (e) {
                if ((this._bindingMode & 2) == 2)
                    if (this.Condition.Value)
                        this.Success.Value = e._new;
                    else
                        this.Fail.Value = e._new;
            };
            CondtionScop.prototype.Dispose = function () {
                var h = this.OnDispose();
                if (h === null)
                    return;
                this.Condition.Dispose();
                this.Fail.Dispose();
                this.Success.Dispose();
                _super.prototype.Dispose.call(this);
                if (!h)
                    this.DisposingStat = 2;
            };
            __decorate([
                Dom_4.attributes.Parser2ScopHandler(Syntaxer_5.Parser.CToken.condition),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", [Object, Boolean]),
                __metadata("design:returntype", void 0)
            ], CondtionScop, "_build", null);
            return CondtionScop;
        }(Corelib_15.bind.Scop));
        Scops.CondtionScop = CondtionScop;
        var BiComputeScop = (function (_super) {
            __extends(BiComputeScop, _super);
            function BiComputeScop(e) {
                var _this = _super.call(this, 1) || this;
                var rslt = e.parseResult.resut;
                _this.A = new Corelib_15.bind.IScopConst(Corelib_15.bind.mixIn(e, { parseResult: rslt.a })).CaptureEvent(_this.Reset, _this);
                _this.Oper = rslt.o;
                _this.B = new Corelib_15.bind.IScopConst(Corelib_15.bind.mixIn(e, { parseResult: rslt.b })).CaptureEvent(_this.Reset, _this);
                _this.Reset();
                return _this;
            }
            BiComputeScop.prototype.Is = function (toke) {
                return toke == Syntaxer_5.Parser.CToken.biCompute;
            };
            BiComputeScop._build = function (e, optmz) {
                var scop = new BiComputeScop(e).setController(e.controller);
                return scop;
            };
            BiComputeScop.prototype.Reset = function (_s, _ev) {
                if (!this.Oper.fn.isComplex)
                    this.privateValue = this.Oper.fn(this.A.Value, this.B.Value);
                else
                    this.privateValue = this.Oper.fn(this.A, this.B);
            };
            BiComputeScop.prototype._OnValueChanged = function (_e) { };
            BiComputeScop.prototype.Dispose = function () {
                var h = this.OnDispose();
                if (h === null)
                    return;
                this.A.Dispose();
                this.B.Dispose();
                _super.prototype.Dispose.call(this);
                if (!h)
                    this.DisposingStat = 2;
            };
            __decorate([
                Dom_4.attributes.Parser2ScopHandler(Syntaxer_5.Parser.CToken.biCompute),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", [Object, Boolean]),
                __metadata("design:returntype", void 0)
            ], BiComputeScop, "_build", null);
            return BiComputeScop;
        }(Corelib_15.bind.Scop));
        Scops.BiComputeScop = BiComputeScop;
        var UniComputeScop = (function (_super) {
            __extends(UniComputeScop, _super);
            function UniComputeScop(e) {
                var _this = _super.call(this, 1) || this;
                var rslt = e.parseResult.resut;
                _this.A = new Corelib_15.bind.IScopConst(Corelib_15.bind.mixIn(e, { parseResult: rslt.a })).CaptureEvent(_this._onOperandChanged, _this);
                _this.Oper = rslt.o;
                _this._onOperandChanged();
                return _this;
            }
            UniComputeScop.prototype.Is = function (toke) {
                return toke == Syntaxer_5.Parser.CToken.uniCompute;
            };
            UniComputeScop._build = function (e) {
                var scop = new UniComputeScop(e).setController(e.controller);
                return scop;
            };
            UniComputeScop.prototype._onOperandChanged = function (_s, _ev) {
                if (!this.Oper.fn.isComplex)
                    this.privateValue = this.Oper.fn(this.A.Value);
                else
                    this.privateValue = this.Oper.fn(this.A);
            };
            UniComputeScop.prototype._OnValueChanged = function (_e) { };
            UniComputeScop.prototype.Dispose = function () {
                var h = this.OnDispose();
                if (h === null)
                    return;
                this.A.Dispose();
                _super.prototype.Dispose.call(this);
                if (!h)
                    this.DisposingStat = 2;
            };
            __decorate([
                Dom_4.attributes.Parser2ScopHandler(Syntaxer_5.Parser.CToken.uniCompute),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", [Object]),
                __metadata("design:returntype", void 0)
            ], UniComputeScop, "_build", null);
            return UniComputeScop;
        }(Corelib_15.bind.Scop));
        Scops.UniComputeScop = UniComputeScop;
        var TypedScop = (function (_super) {
            __extends(TypedScop, _super);
            function TypedScop(parent, type, bindingMode) {
                var _this = _super.call(this, bindingMode) || this;
                _this.eq = type.type == '=';
                _this.itself = type.type == ':';
                _this.type = context_11.context.GetType(type.path) || type.type;
                _this.setParent(parent);
                return _this;
            }
            TypedScop.prototype.Is = function (toke) {
                return toke == 'typedscope';
            };
            TypedScop._build = function (e) {
                var scop = new TypedScop(e.parent, e.parseResult.resut, e.bindingMode).setController(e.controller);
                scop.setParent(e.parent);
                return scop;
            };
            TypedScop.prototype.getParent = function () {
                return this.parent;
            };
            TypedScop.prototype.setParent = function (v) {
                if (v == this.parent)
                    return;
                if (this.parent && this.pB)
                    this.parent.removeEvent(Corelib_15.bind.Scop.DPValue, this.pB);
                this.pB = v.OnPropertyChanged(Corelib_15.bind.Scop.DPValue, this.OnParentValueChanged, this);
                this.parent = v;
                this.reProcess();
                return true;
            };
            TypedScop.prototype._OnValueChanged = function (e) {
            };
            TypedScop.prototype.OnParentValueChanged = function (pB, e) {
                this.reProcess();
            };
            TypedScop.prototype.reProcess = function () {
                var pS = this.parent;
                var tiss = typeof this.type === 'string';
                while (pS) {
                    if (pS.__hasSegments__ && pS.forEach(function (s, p) { return p.checkType(s, tiss, true); }, this) !== undefined)
                        return;
                    else if (this.checkType(pS, tiss, this.itself))
                        return;
                    pS = pS.getParent();
                }
            };
            TypedScop.prototype.checkType = function (pS, tiss, itself) {
                var pv = itself ? pS : pS.Value;
                if (pv != null)
                    if (tiss) {
                        if (pv.constructor.name == this.type) {
                            this.privateValue = pv;
                            return true;
                        }
                    }
                    else if (this.eq ? pv.constructor === this.type : pv instanceof this.type) {
                        this.privateValue = pv;
                        return true;
                    }
            };
            __decorate([
                Dom_4.attributes.Parser2ScopHandler('typedscope'),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", [Object]),
                __metadata("design:returntype", void 0)
            ], TypedScop, "_build", null);
            return TypedScop;
        }(Corelib_15.bind.Scop));
        Scops.TypedScop = TypedScop;
        (function () {
            function call(a) {
                return new Corelib_15.bind.ValueScop(a.parseResult.resut, a.bindingMode);
            }
            for (var i = 0; i <= Syntaxer_5.Parser.CToken.string; i++)
                Corelib_15.bind.Scop.RegisterScop(i, call);
        })();
        Corelib_15.bind.Scop.RegisterScop('keyword', function (e) {
            switch (e.parseResult.resut) {
                case 'this':
                    return e.controller.CurrentControl;
                case 'super':
                    return e.controller.MainControll;
                case 'data':
                    return e.parent;
                case 'scop':
                    return e.controller.Scop;
                case 'window': return Scops.windowScop;
                case 'global':
                    break;
                default:
                    break;
            }
        });
        Scops.windowScop = new Corelib_15.bind.ValueScop(window, 0);
    })(Scops || (Scops = {}));
});
