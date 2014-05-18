# usage:
# `make` or `make test` runs all the tests
# `make <test filename>` runs just that test
.PHONY: test

TESTS=$(shell cd test && ls *.coffee | sed s/\.coffee$$//)

all: test

test: $(TESTS)

$(TESTS):
	DEBUG=* NODE_ENV=test ./node_modules/.bin/mocha -r coffee-errors --compilers coffee:coffee-script/register test/$@.coffee

build: compile_coffee compile_css

compile_css:
	compass compile

compile_coffee:
	coffee --bare --compile --output sender/js src/sender/*.coffee
	# coffee --bare --compile --output receiver/js src/receiver/*.coffee

