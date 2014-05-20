# usage:
# `make` or `make test` runs all the tests
# `make <test filename>` runs just that test
.PHONY: test

all: build

build: compile_css

compile_css:
	compass compile
