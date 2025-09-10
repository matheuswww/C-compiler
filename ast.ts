enum Etype {
  Int
};

type Numberconstant = number & {tag:string};
type Expr = 
  Numberconstant;
type Decl = any;
type Assigment = any;
type Identifier = string & {tag:string};
type Datatype = Etype & {tag:string};
type AST = 
  | Program
  | Numberconstant
  | Decl
  | Assigment
  | Identifier
  | Datatype
  | ASTfunction
  | Codeblock
  | Stm
  | Returnstm;

type Tstm = 
(
  | (Decl & {tag:string}) 
  | (Assigment & {tag:string})
  | Returnstm
);

interface Iase {
  constructor: Function;
  tag: string;
}

interface Ireturnstm extends Iase {
  constructor: Function;
  expr: Expr;
}

interface Istm {
  constructor:Function;
  decl?: Decl;
  assignment?: Assigment;
  returnstm?: Returnstm;
}

interface IsyntaxE extends Error {
  constructor: Function;
}
interface Icodeblock extends Iase {
  stms: Stm[];
}
interface Ifunction extends Iase {
  type: Datatype;
  name: Identifier;
  body: Codeblock;
}

interface Iprogram extends Iase {
  fns:ASTfunction[];
}

let test:()=>void;
let log:(...data:any[])=>void;
let expr:(input:Numberconstant)=>Expr;
let numberconstant:(input:number)=>Numberconstant;
let identifier:(input:string)=>Identifier;
let datatype:(input:Etype)=>Datatype;

log = console.log; 

numberconstant = (input:number): Numberconstant => {
  let ret:Numberconstant;

  ret = new Number(input) as Numberconstant;
  ret.tag = 'Numberconstant'

  return ret;
}

expr = (input:Numberconstant): Expr => {
  let ret: Expr;

  ret = new Number(input as number) as Expr;
  ret.tag = 'Expr';

  return ret;
}

identifier = (input:string): Identifier => {
  let ret: Identifier;

  ret = new String(input) as Identifier;
  ret.tag = 'Identifier';

  return ret;
}

datatype = (input:Etype): Datatype => {
  let ret: Datatype;

  ret =  new Number(input as number) as Datatype;
  ret.tag = 'Datatype';

  return ret;
}

class SyntaxException extends Error implements IsyntaxE  {
  constructor(msg: string) {
    super(msg);
  }
}

abstract class ASE implements Iase {
  abstract tag: string;

  constructor() {
    void 0;
  }

}

class ASTfunction extends ASE implements Ifunction {
  tag: string;
  type: Datatype;
  name: Identifier;
  body: Codeblock;

  constructor(type:Datatype,name:Identifier,body:Codeblock) {
    super();
    this.tag = 'Function';
    this.type = type;
    this.name = name;
    this.body = body;
  }
}

class Codeblock extends ASE implements Icodeblock {
  tag: string;
  stms: Stm[];

  constructor(input:Stm[]) {
    super();
    this.tag = 'Codeblock';
    this.stms = input;
  }
}

class Returnstm extends ASE implements Ireturnstm {
  tag: string;
  expr: Expr;
  
  constructor(input:Expr) {
    super();
    this.tag = "Returnstm"
    this.expr = input;
  }
}

class Stm implements Istm {
  tag: string;
  decl?: Decl;
  assignment?: Assigment;
  retrunstm?: Returnstm;

  constructor(input:Decl);
  constructor(input:Assigment);
  constructor(input:Returnstm);
  constructor(input:Tstm) {
    let ok:boolean;

    this.tag = 'Stm';
    ok = false;
    log(input.tag)
    switch (input.tag) {
      case "Decl":
        this.decl = input;
        ok = true;
        break;
    
      case 'Assignment':
          this.assignment = input;
          ok = true;
          break;
        
      case 'Returnstm':
          this.retrunstm = input;
          ok = true;
          break;

      default:
        ok = false;
        break;
    }

    if (!ok)
        throw new SyntaxException('Syntax erorr in statement')
  };
}

class Program extends ASE implements Iprogram {
  tag: string;
  fns:ASTfunction[];

  constructor(input: ASTfunction[]) {
    super();
    this.tag = 'Program';
    this.fns = input;
  }
}

test = (): void => {
  let r:Returnstm;
  let e:Expr;
  let s:Stm;
  let n:Numberconstant;
  let c:Codeblock;
  let i:Identifier;
  let d:Datatype;
  let f:ASTfunction;
  let p:Program;
  let ast:AST;

  n = numberconstant(5);
  e = expr(n);
  r = new Returnstm(e);
  s = new Stm(r);
  c = new Codeblock([s]);
  i = identifier('main');
  d = datatype(Etype.Int);
  f = new ASTfunction(d, i, c);
  p = new Program([f]);
  ast = p;

  log(JSON.stringify(ast,null,3));

  return void 0;
}

export { test };
export type { AST };

export type { Numberconstant, Expr, Decl, Assigment, Identifier, Datatype };
export { numberconstant, expr, identifier, datatype };
export { ASTfunction, Codeblock, Returnstm, Stm, Program, SyntaxException };