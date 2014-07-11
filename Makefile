lint:
	./node_modules/.bin/jshint ./querystring.js

test:
	@$(MAKE) lint
	@NODE_ENV=test ./node_modules/.bin/mocha -u tdd \
		--require blanket \
		--reporter spec

test-cov:
	@$(MAKE) lint
	@NODE_ENV=test ./node_modules/.bin/mocha -u tdd \
		--require blanket \
		--reporter travis-cov

test-codeclimate:
	@NODE_ENV=test ./node_modules/.bin/mocha -u tdd \
		--require blanket \
		--reporter mocha-lcov-reporter \
	| CODECLIMATE_REPO_TOKEN=b348688e612a06be370f66c95c24c55da0fe7852b850b2d3a98e8f065a95f05d ./node_modules/.bin/codeclimate

test-coveralls:
	@NODE_ENV=test YOURPACKAGE_COVERAGE=1 ./node_modules/.bin/mocha -u tdd \
		--require blanket \
		--reporter mocha-lcov-reporter \
	| ./node_modules/coveralls/bin/coveralls.js

test-all: test test-cov test-coveralls

.PHONY: test
