module.exports = function(callback) {

	var cb = function() {
		if (timedout || (once && count)) return;
		count += 1;
		tid && clearTimeout(tid);

		var args = Array.prototype.slice.call(arguments);
		process.nextTick(function() {
			if (!errback) {
                            callback.apply(this, args);
                        } else {
			    args[0] ? errback(args[0]) : callback.apply(this, args.slice(1));
                        }
                        
                        if (interval) {                          
                            cb.timeout(interval);
                        }
		});

	}, count = 0, once = false, timedout = false, interval = false, errback, tid;

	cb.timeout = function(ms) {
		tid && clearTimeout(tid);
		tid = setTimeout(function() {
			cb(new TimeoutError(ms));
			timedout = true;
		}, ms);
		return cb;
	};
        
        cb.interval = function(iv) {
            interval = iv;
            
            if (iv) {
                cb.timeout(iv);
            }
            
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