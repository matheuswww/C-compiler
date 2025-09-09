import { $, $$, QM, REX, Star, ValidTypes } from "./rex";

/*
import { FileLexer, Lexer } from "./lexer";

export let log:(x:string)=>void;
log = console.log;

let lxr:FileLexer;
let inp:string;

inp = 'int main() {\n  return 5;\n}';

console.log(inp)

lxr = new FileLexer(inp);
log(lxr.tokens as unknown as string);
*/

/*
do {
  lxr = new Lexer(inp);

  if (!lxr)
    log('error');
  else {
    log('token: ' + lxr.token?.tag + ' ' + lxr.token?.contents);

    inp = lxr.input;
  }
} while(lxr.token?.tag != '<eof>');
*/