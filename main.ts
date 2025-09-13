let Version:string;
Version = '1.0.0';

import { execFileSync } from "child_process";
import { AST } from "./ast";
import { architecture, CodeGen, State, state } from "./codegen";
import { FileLexer, Token } from "./lexer";
import { Parser } from "./parser";
import { FileHandle, open, readFile, writeFile } from "fs/promises";

interface Config {
	env: string;
	asm: string;
	linker: string;
	arch: architecture;    
	stopat: Stage;
}

enum Stage {
	Linker,
	Assembler,
	CodeGenerator
}

let config:(arch:architecture)=>Config;

config = (arch:architecture): Config => ({
	env: '/usr/bin/env',
	asm: 'nasm',
	linker:'ld',
	arch,
	stopat: Stage.Linker
});

interface Icompiler {
	constructor:Function;
	lex:()=>FileLexer;
	parse:()=>AST;
	codegen:()=>string;
	link:(asmfile:string)=>void;
	compile:()=>Promise<boolean>;
	replaceext:(file:string,ext:string)=>string;

	inputfile:string;
	outputfile:string;
	ast?:AST;
	tokens?:Token[];
	parser?:Parser;
	state:State;
	lexer?:FileLexer;
	sourcefile?:string;
	code?:CodeGen;
	asm?:string;
	config:Config;
}

class Compiler implements Icompiler {
	public inputfile:string;
	public outputfile:string;
	public tokens?:Token[];
	public ast?:AST;
	public parser?:Parser;
	public state:State;
	public lexer?:FileLexer;
	public sourcefile?:string;
	public code?:CodeGen;
	public asm?:string;
	public config:Config;

	public constructor(inputfile:string, cfg:Config, outputfile?:string) {
		this.state = state();
		this.inputfile = inputfile;
		this.outputfile = outputfile
			?? this.replaceext(this.inputfile, '');
		this.config = cfg;
	}

	public replaceext(file:string, ext:string): string {
		let regexp:RegExp;
		let ret:string;

		regexp = /\..+$/;
		ret = file.replace(regexp, ext);
		
		return ret;
	}

	public async compile(): Promise<boolean> {
		let fd:FileHandle;
		let asmfile:string;
		let ret:undefined|void;

		fd = await open(this.inputfile, 'r');
		if (!fd) {
			throw new Error('Unable to open file: ' + this.inputfile);
		}

		this.sourcefile = await readFile(fd, {encoding:'utf8',flag:'r'});
		fd.close();
		if (!this.sourcefile) {
			throw new Error('Unable to read input file');
			return false as never;
		}

		this.lexer = this.lex();
		this.tokens = this.lexer.tokens;
		this.ast = this.parse();
		this.asm = this.codegen();

		asmfile = this.replaceext(this.inputfile, '.asm');
		fd = await open(asmfile, 'w');
		if (!fd) {
			throw new Error('Unable to open file: ' + asmfile);
		}
		ret = await writeFile(fd, this.asm, {encoding:'utf8',mode:0o644,flag:'w'});
		if (ret !== undefined) {
			throw new Error('Unable to write to file: ' + asmfile);
		}
		fd.close();

		if (this.config.stopat == Stage.CodeGenerator)
			return true;
		else
			await this.link(asmfile);

		return true;
	}

	public lex(): FileLexer {
		return new FileLexer(this.sourcefile??'');
	}

	public parse(): AST {
		this.parser = new Parser(this.tokens??[]);
		return this.parser.parse();
	}

	public codegen(): string {
		this.code = new CodeGen(this.state, this.ast, this.config.arch);
		return this.code.emit;
	}

	public link(asmfile:string): void {
		let objectfile:string;

		try {
			execFileSync(this.config.env,
				[this.config.asm, '-f', 'elf32', asmfile]
			);
		} catch(err:unknown) {
			if (err && err instanceof Error) {
				throw err;
			}
		}

		if (this.config.stopat == Stage.Assembler)
			return void 0;

		objectfile = this.replaceext(this.inputfile, '.o');
		try {
			execFileSync(this.config.env,
				[this.config.linker,  '-m' ,'elf_i386', objectfile, '-o', this.outputfile]
			);
		} catch (err:unknown) {
			if (err && err instanceof Error) {
				throw err;
			}
		}

	}
}

let configuration:Config;
let comp:Compiler;
let retval:boolean;
let basename:(file:string)=>string;
let args:string[];
let argc:number;
let dashs:boolean; 
let dashc:boolean;
let dasho:string;
let input:string;
let usage:()=>never;
let shver:()=>never;

shver = (): never => {
	console.log(`jcc version ${Version} (the javascript c compiler)`);
	process.exit(0);
}

usage = (): never => {
	console.warn('Usage: jcc [-v] inputfile.c -o outputfile [ -s | -c ]');
	process.exit(1);
}

basename = (file:string): string => {
	let x:string;
	let regexp:RegExp;

	regexp = /[^/]+$/;
	x = file.replace(regexp, '');

	return file.replace(x, '');
}

args = process.argv;
if (basename(args[0]) == 'node')
	args.shift();

if (!args.length)
	usage();
else
	args.shift();

argc = args.length;
if ((argc) && (args[0] == '-v'))
	shver();

if ((argc < 3) || (argc > 4))
	usage();

if (argc == 4) {
	dashs = (args[3] == '-s') ? true : false;
	dashc = (args[3] == '-c') ? true : false;
} else
	dashs = dashc = false;

if (args[1] != '-o')
	usage();

input = args[0];
dasho = args[2];

configuration = config(architecture.ia32);

if (dashs)
	configuration.stopat = Stage.CodeGenerator;
else if (dashc)
	configuration.stopat = Stage.Assembler;

retval=false;
try {
	(async ()=> {
    comp = new Compiler(input, configuration, dasho);
	  retval = await comp.compile();
  })()
} catch(err:unknown) {
	if (err && (typeof err === 'object') && (err instanceof Error))
		console.error(err);
	else
		console.error('Compilation failed');
}
