.PHONY: run clean

all: parser.js codegen.js main.js lexer.js rex.js ast.js

ast.js: ast.ts
	npx tsc $<

parser.js: parser.ts
	npx tsc $<

parser.ts: parser.tsplus
	chmod 755 ./tsplus.sh
	./tsplus.sh $<

codegen.ts: codegen.tsplus
	chmod 755 ./tsplus.sh
	./tsplus.sh $<

codegen.js: codegen.ts
	npx tsc $<

lexer.js: lexer.ts
	npx tsc $<

rex.js: rex.ts
	npx tsc $<

main.js: main.ts
	npx tsc $<

run:
	node main.js main.c -o main

clean:
	rm -f *.js *.asm *.o  parser.ts codegen.ts