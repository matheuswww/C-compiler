.PHONY: run clean

all: main.js lexer.js rex.js

lexer.js: lexer.ts
	npx tsc $<

rex.js: rex.ts
	npx tsc $<

main.js: main.ts
	npx tsc $<
run:
	npm start
clean:
	rm -f *.js