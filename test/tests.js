var assert = require('assert'),
	cb = require('../');

function invokeAsync(callback) {
	setTimeout(function() {
		callback(null, 'foo');
	}, 100);
}

function invokeAsyncError(callback) {
	setTimeout(function() {
		callback(new Error());
	}, 100);
}

function invokeAsyncTwice(callback) {
	setTimeout(function() {
		callback(null, 'foo');
		callback(null, 'foo');
	}, 100);
}

describe('cb(callback)', function() {

	it('should invoke the provided callback', function(done) {
		invokeAsync(cb(function(err, res) {
			assert.strictEqual(res, 'foo');
			done();
		}));
	});

	it('shouldn\'t mess with errors', function(done) {
		invokeAsyncError(cb(function(err, res) {
			assert(err);
			done();
		}));
	});

	it('should allow multiple executions', function(done) {
		var count = 0;
		invokeAsyncTwice(cb(function(err, res) {
			count++;
			if (count === 2) done();
		}));
	});

});

describe('cb(callback).timeout(ms)', function() {
	
	it('should complete successfully within timeout period', function(done) {
		invokeAsync(cb(function(err, res) {
			assert.strictEqual(res, 'foo');
			done();
		}).timeout(200));
	});

	it('should complete with an error after timeout period', function(done) {
		invokeAsync(cb(function(err, res) {
			assert(err);
			done();
		}).timeout(50));
	});

	it('error resulting from a timeout should be instanceof cb.TimeoutError', function(done) {
		invokeAsync(cb(function(err, res) {
			assert(err instanceof cb.TimeoutError);
			done();
		}).timeout(50));
	});

});

describe('cb(callback).error(errback)', function() {

	it('should skip the err argument when invoking callback', function(done) {
		invokeAsync(cb(function(res) {
			assert.strictEqual(res, 'foo');
			done();
		}).error(assert.ifError));
	});

	it('should pass errors to provided errback', function(done) {
		invokeAsyncError(cb(function(res) {
			throw new Error('should not be invoked');
		}).error(function(err) {
			assert(err);
			done();
		}));
	});

});

describe('cb(callback).error(errback).timeout(ms)', function() {

	it('should skip the err argument when invoking callback', function(done) {
		invokeAsync(cb(function(res) {
			assert.strictEqual(res, 'foo');
			done();
		}).error(assert.ifError).timeout(200));
	});

	it('should pass timeout error to provided errback', function(done) {
		invokeAsyncError(cb(function(res) {
			throw new Error('should not be invoked');
		}).error(function(err) {
			assert(err);
			done();
		}).timeout(50));
	});

});

describe('cb(callback).once()', function() {

	it('should allow multiple executions', function(done) {
		var count = 0;
		invokeAsyncTwice(cb(function(err, res) {
			count++;
			assert.notEqual(count, 2);
			setTimeout(done, 100);
		}).once());
	});

});
