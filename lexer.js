"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = void 0;
var regexplist;
regexplist = [
    { regexp: /^\s+/, tokenname: 'whitespace' },
    { regexp: /^\(/, tokenname: 'openaround' },
    { regexp: /^\)/, tokenname: 'closearound' },
    { regexp: /^\{/, tokenname: 'opencurly' },
    { regexp: /^\}/, tokenname: 'closecurly' },
    { regexp: /^;/, tokenname: 'semicolon' },
    { regexp: /^(int)|(return)/, tokenname: 'keyword' },
    { regexp: /^[a-zA-Z_'$][a-zA-Z_0-9'$]+/, tokenname: 'identifier' },
    { regexp: /^[0-9]+/, tokenname: 'numberconst' }
];
var keyword;
var whitespace;
var identifier;
var openaround;
var closearound;
var opencurly;
var closecurly;
var semicolon;
var numberconst;
var eof;
keyword = function (arg) { return ({
    tag: 'keyword',
    contents: arg
}); };
identifier = function (kw) { return ({
    tag: 'identifier',
    contents: kw
}); };
whitespace = function () { return ({
    tag: 'whitespace',
    contents: undefined
}); };
numberconst = function (arg) { return ({
    tag: 'semicolon',
    contents: arg
}); };
openaround = function () { return ({
    tag: 'openaround',
    contents: undefined
}); };
closearound = function () { return ({
    tag: 'closearound',
    contents: undefined
}); };
opencurly = function () { return ({
    tag: 'opencurly',
    contents: undefined
}); };
closecurly = function () { return ({
    tag: 'closecurly',
    contents: undefined
}); };
semicolon = function () { return ({
    tag: 'semicolon',
    contents: undefined
}); };
eof = function () { return ({
    tag: '<eof>',
    contents: undefined
}); };
var Lexer = /** @class */ (function () {
    function Lexer(str) {
        this.input = str;
        this.lex();
        return this;
    }
    Lexer.prototype.lex = function () {
        var regexp;
        var tokenname;
        var entry;
        var input;
        var inputarr;
        var n;
        var maxtcharr;
        var token;
        var tmp;
        var numconst;
        input = this.input;
        if (!input.length) {
            this.token = eof();
            return void 0;
        }
        entry = regexplist.find(function (x) { return input.match(x.regexp) ? true : false; });
        if (!entry)
            throw "Parse error (lexer)";
        regexp = entry.regexp;
        tokenname = entry.tokenname;
        maxtcharr = input.match(regexp);
        n = maxtcharr[0].length;
        inputarr = input.split('');
        while (n--)
            inputarr.shift();
        input = inputarr.join('');
        token = null;
        switch (tokenname) {
            case 'eof':
                token = eof();
                break;
            case 'whitespace':
                token = whitespace();
                break;
            case 'openaround':
                token = openaround();
                break;
            case 'closearound':
                token = closearound();
                break;
            case 'opencurly':
                token = opencurly();
                break;
            case 'closecurly':
                token = closecurly();
                break;
            case 'semicolon':
                token = semicolon();
                break;
            case 'identifier':
                tmp = maxtcharr[0];
                token = identifier(tmp);
                break;
            case 'keyword':
                tmp = maxtcharr[0];
                token = keyword(tmp);
                break;
            case 'numberconst':
                tmp = maxtcharr[0];
                numconst = parseInt(tmp);
                token = numberconst(numconst);
                break;
            default:
                throw 'Parse error (lexer)';
        }
        if (!token)
            throw 'Parse error (lexer)';
        this.input = input;
        this.token = token;
        return void 0;
    };
    return Lexer;
}());
exports.Lexer = Lexer;
