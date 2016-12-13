module.exports = function(callback, context) {

	var cb = function() {
		if (timedout || (once && count)) return;
		count += 1;
		tid && clearTimeout(tid);
		
		context || (context = this);
		
		var args = Array.prototype.slice.call(arguments);
		process.nextTick(function() {
			if (!errback) return callback.apply(context, args);
			args[0] ? errback.call(context, args[0]) : callback.apply(context, args.slice(1));
		});

	}, count = 0, once = false, timedout = false, errback, tid;

	cb.timeout = function(ms) {
		tid && clearTimeout(tid);
		tid = setTimeout(function() {
			cb(new TimeoutError(ms));
			timedout = true;
		}, ms);
		return cb;
	};

	cb.error = function(func) { errback = func; return cb; };

	cb.once = function() { once = true; return cb; };

	return cb;

};

var TimeoutError = module.exports.TimeoutError = function TimeoutError(ms) {
	this.message = 'Specified timeout of ' + ms + 'ms was reached';
	Error.captureStackTrace(this, this.constructor);
};
TimeoutError.prototype = new Error;
TimeoutError.prototype.constructor = TimeoutError;
TimeoutError.prototype.name = 'TimeoutError';