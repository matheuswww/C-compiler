interface Iregexp {
  regexp:RegExp;
  tokenname:string;
}

let regexplist:Iregexp[];

regexplist = [
  { regexp: /^\s+/, tokenname: 'whitespace' },
  { regexp: /^\(/, tokenname: 'openaround' },
  { regexp: /^\)/, tokenname: 'closearound' },
  { regexp: /^{/, tokenname: 'opencurly' },
  { regexp: /^}/, tokenname: 'closecurly' },
  { regexp: /^;/, tokenname: 'semicolon' },
  { regexp: /^int/, tokenname: 'keyword' },
  { regexp: /^return/, tokenname: 'keyword' },
  { regexp: /^[a-zA-Z_'][a-zA-Z_0-9']+/, tokenname: 'identifier' }, 
  { regexp: /^[0-9]+/, tokenname: 'numberconst' }
];

type Identifier = string;
type EOF = '<eof>';
type Whitespace = ' ';
type Openaround = '(';
type Closearound = ')';
type Opencurly = '{';
type Closecurly = '}';
type Semicolon = ';';
type Numberconst = number;
type Keyword = 
  'int' | 
  'return';

type Token = 
  Tkeyword
  | Tidentifier
  | Twhitespace
  | Topenaround
  | Tclosearound
  | Topencurly
  | Tclosecurly
  | Tsemicolon
  | Tnumberconst
  | TEOF;

interface Tidentifier {
  tag: string;
  contents?: Identifier;
}
interface Twhitespace {
  tag: string;
  contents?: Whitespace;
}
interface Tkeyword {
  tag: string;
  contents?: Keyword;
}
interface Topenaround {
  tag: string;
  contents?: Openaround;
}
interface Tclosearound {
  tag: string;
  contents?: Closearound;
}
interface Topencurly {
  tag: string;
  contents?: Opencurly;
}
interface Tclosecurly {
  tag: string;
  contents?: Closecurly;
}
interface Tsemicolon {
  tag: string;
  contents?: Semicolon;
}
interface Tnumberconst {
  tag: string;
  contents?: Numberconst;
}
interface TEOF {
  tag: string;
  contents?: EOF;
}

let keyword:(kw?: string)=>Tkeyword;
let whitespace:()=>Twhitespace;
let identifier:(arg?: string)=>Tidentifier;
let openaround:()=>Topenaround;
let closearound:()=>Tclosearound;
let opencurly:()=>Topencurly;
let closecurly:()=>Tclosecurly;
let semicolon:()=>Tsemicolon;
let numberconst:(arg: number)=> Tnumberconst;
let eof:()=>TEOF;

let eq:(t1:Token, t2:Token)=>boolean;

keyword = (arg?: string): Tkeyword => ({
  tag: 'keyword',
  contents: arg as Keyword
});
identifier = (arg:string=''): Tidentifier => ({
  tag: 'identifier',
  contents: arg as Identifier
});
whitespace = (): Twhitespace => ({
  tag: 'whitespace',
  contents: undefined as unknown as Whitespace
});
numberconst = (arg:number=0): Tnumberconst  => ({
  tag: 'numberconst',
  contents: arg as Numberconst
});
openaround = (): Topenaround => ({
  tag: 'openaround',
  contents: undefined as unknown as Openaround
});
closearound = (): Tclosearound => ({
  tag: 'closearound',
  contents: undefined as unknown as Closearound
});
opencurly = (): Topencurly => ({
  tag: 'opencurly',
  contents: undefined as unknown as Opencurly
});
closecurly = (): Tclosecurly => ({
  tag: 'closecurly',
  contents: undefined as unknown as Closecurly
});
semicolon = (): Tsemicolon => ({
  tag: 'semicolon',
  contents: undefined as unknown as Semicolon
});
eof = (): TEOF => ({
  tag: '<eof>',
  contents: undefined as unknown as EOF
});

eq = (t1:Token, t2:Token): boolean => (t1 && t2 && (t1.tag == t2.tag) ? true : false);

interface Ilexer {
  constructor:Function;
  lex: ()=>void;
  input: string;
  token?: Token;
}

interface Ifilelexer {
  constructor:Function;
  lexfile_:(ts:Token[], str:string)=>boolean;
  lexfile:()=>boolean;
  input:string;
  tokens: Token[];
}

class Lexer implements Ilexer {
  public input:string; 
  public token?:Token;
  
  constructor(str: string) {
    this.input = str;
    this.lex();

    return this;
  }

  public lex() {
    let regexp:RegExp;
    let tokenname:string;
    let entry:Iregexp|undefined;
    let input:string;
    let inputarr:string[];
    let n:number;
    let maxtcharr:RegExpMatchArray;
    let token:Token|null;
    let tmp:string;

    let numconst:number;

    input = this.input;
    if(!input.length) {
      this.token = eof();
      return void 0;
    }
    entry = regexplist.find((x: Iregexp): boolean => input.match(x.regexp) ? true : false)

    if(!entry)
      throw  "Parse error (lexer)";
    
    regexp = entry.regexp;
    tokenname = entry.tokenname;
    maxtcharr = input.match(regexp) as RegExpMatchArray;
    n = maxtcharr[0].length;
    inputarr = input.split('');
    while (n--)
      inputarr.shift();
    input = inputarr.join('');

    token = null;
    switch (tokenname) {
      case 'eof': token = eof(); break;
      case 'whitespace': token = whitespace(); break;
      case 'openaround': token = openaround(); break;
      case 'closearound': token = closearound(); break;
      case 'opencurly': token = opencurly(); break;
      case 'closecurly': token = closecurly(); break;
      case 'semicolon': token = semicolon(); break;
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
  }
}

class FileLexer implements Ifilelexer {
  public input:string;
  public tokens:Token[];

  constructor(str: string) {
    let ret:boolean;
    if (!str)
        throw 'Empty input string;';
    this.input = str;
    this.tokens = [];
    ret = this.lexfile();
    if (!ret)
      throw 'Parse error (lexing)';
  }

  public lexfile():boolean {
    let ret:boolean;

    ret = this.lexfile_([], this.input);
    this.tokens = this.tokens.filter((x:Token): boolean => (!eq(x,whitespace())));
    return ret;
  }

  public lexfile_(ts:Token[], str:string):boolean {
    let tok:Token;
    let toks:Token[];
    let str_:string;
    let lxr:Lexer|null;
    let ret:boolean;
    
    ret = true;
    try {
      lxr = new Lexer(str);
      if (lxr.token) {
        tok = lxr.token;
        str_ = lxr.input;
      } else {
        throw "Parse error (lexer)"
      }

      toks = ts;
      toks.push(tok);

      if (eq(tok, eof())) {
        this.tokens = toks;
        this.input = '';
        return true;
      } else {
        return this.lexfile_(toks, str_);
      }
    } catch (err: unknown) {
      if (err instanceof String)
        console.error(err as string);
      return false; 
    }
  }
}

export { Lexer, FileLexer, eq };
export { keyword, whitespace, identifier, openaround, closearound, opencurly, closecurly, semicolon, numberconst, eof };
export type { Token, Identifier, EOF, Whitespace, Openaround, Closearound, Opencurly, Closecurly, Semicolon, Numberconst, Keyword }