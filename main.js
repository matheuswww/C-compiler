"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
var lexer_1 = require("./lexer");
exports.log = console.log;
var lxr;
var inp;
inp = 'int main() {\nreturn 5;\n}';
do {
    lxr = new lexer_1.Lexer(inp);
    if (!lxr)
        (0, exports.log)('error');
    else {
        (0, exports.log)('token: ' + ((_a = lxr.token) === null || _a === void 0 ? void 0 : _a.tag) + ' ' + ((_b = lxr.token) === null || _b === void 0 ? void 0 : _b.contents));
        inp = lxr.input;
    }
} while (((_c = lxr.token) === null || _c === void 0 ? void 0 : _c.tag) != '<eof>');
