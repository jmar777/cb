.PHONY: test

MOCHA = ./node_modules/mocha/bin/mocha

test:
	$(MOCHA) -R list