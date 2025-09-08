.PHONY: run clean

all: main.js lexer.js

lexer.js: lexer.ts
	npx tsc $<

main.js: main.ts
	npx tsc $<
run:
	npm start
clean:
	rm -f *.js