import { Lexer } from "./lexer";

export let log:(x:string)=>void;
log = console.log;

let lxr:Lexer;
let inp:string;

inp = 'int main() {\nreturn 5;\n}';

do {
  lxr = new Lexer(inp);

  if (!lxr)
    log('error');
  else {
    log('token: ' + lxr.token?.tag + ' ' + lxr.token?.contents);

    inp = lxr.input;
  }
} while(lxr.token?.tag != '<eof>');