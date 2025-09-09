/*
type Char = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z';
*/

import { Token } from "./lexer";

type QM = Symbol;
type Star = Symbol;
type $ = Symbol;
type $$ = Symbol;
type Ex = QM | Star | $ | $$;
type ValidTypes = Ex | Token;
type Equality = (x:ValidTypes,y:ValidTypes)=>boolean;
let QM:Ex;
let Star:Ex;
let $:Ex;
let $$:Ex;

QM = Symbol();
Star = Symbol();
$ = Symbol();
$$ = Symbol(); 

export { QM, Star, $, $$ };
export type { ValidTypes };

let wildcard: (x: ValidTypes)=>boolean

wildcard = (x: ValidTypes)=> (
  (x == QM || x == Star || x == $ || x == $$)
);

interface Irex<a> {
  constructor:Function;
  match:(xs:a[])=>boolean;
  match_:(xs:a[],cap_:a[])=>boolean;
  es: a[];
  caps:a[][];
  capidx:number|null;
  capturing:boolean;
  equality:Equality;
}

export class REX<a extends ValidTypes> implements Irex<a> {
  es:a[];
  caps: a[][];
  capidx:number|null;
  capturing:boolean;
  equality:Equality;

  constructor(input: ValidTypes[], eq:Equality) {
    this.es = input as a[];
    this.caps = [];
    this.capidx = null;
    this.capturing = false;
    this.equality = eq; 
  }

  match(xs:a[]): boolean {
    return this.match_(xs, []);
  }

  match_(xs: a[],cap_:a[]): boolean {
    let x:a|null;
    let e:a|null;
    let cap:a[];

    cap = cap_;
    
    x = xs.shift() || null;
    e = this.es.shift() || null;

    if (!x)
      if (!this.es.length)
        return true;
      else
        return false;
    else if (!e)
      return false

    if ((this.capidx != null) && (this.capturing))
      cap = cap.concat([x]);

    if (!wildcard(e)) {
      if (this.equality(e,x))
          return this.match_(xs, cap);
      if (e == x)
        return this.match_(xs, cap);
      else
        return false;
    }
    else {
      switch (e) {
        case QM:
          return this.match_(xs, cap)
      
        case Star:
          if ((this.es[0] == x))
            void 0;
          else if ((wildcard(this.es[0] as ValidTypes) && (this.equality(this.es[1] as ValidTypes, x)))) {
            if (this.es[0] == $$) {
              cap.pop()
              if (this.capidx === null)
                  throw "Syntax error"
              this.caps[this.capidx] = cap;
              this.capturing = false;
              this.es.shift();

              return this.match_(xs, [])
            }
          }
          else
            this.es = [e].concat(this.es);
          return this.match_(xs, cap);

        case $:
          if (this.capidx === null)
            this.capidx = 0;
          else  
            this.capidx++;
          this.capturing = true;
          return this.match_(
            [x].concat(xs), []
          );

        case $$:
          if (this.capidx === null)
            throw "Syntax error";
          cap.pop();
          this.caps[this.capidx] = cap;
          this.capturing = false;
          return this.match_([x].concat(xs), []);

        default:
          break;
      }
    }
    
    return false;
  }
}