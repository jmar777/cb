var uid = 0;

module.exports = function(callback) {

	var cb = function() {
		if (timedout || (once && count)) return;
		count += 1;
		tid && clearTimeout(tid);

		var args = Array.prototype.slice.call(arguments);
		process.nextTick(function() {
			if (!errback) return callback.apply(this, args);
			args[0] ? errback(args[0]) : callback.apply(this, args.slice(1));
		});

	}, count = 0, once = false, timedout = false, emitters = [], errback, tid;
        
        cb.uid = ++uid;
        
        cb.emitter = function(eventEmitter) {
            var EventEmitter = require('events').EventEmitter;

            if (eventEmitter instanceof EventEmitter) {
                emitters.push(eventEmitter);
            }
            
            return cb;
        }
        
        cb.free = function() {                        
            if (emitters.length) {
                emitters.forEach(function(ee) {
                    var events = Object.keys(ee._events);
                    
                    events.forEach(function(e) {
                        var listeners = ee.listeners(e);
                        
                        for (var i=0; i < listeners.length; i++) {
                            if (listeners[i].uid && listeners[i].uid == cb.uid) {
                                delete listeners[i];
                                break;
                            }
                        }
                                                                        
                        ee._events[e] = listeners.filter(function(l) {
                            return l;
                        });
                    })  
                })
            }
            
            emitters = [];
            
            return cb;                        
        }

	cb.timeout = function(ms) {
		tid && clearTimeout(tid);
		tid = setTimeout(function() {
                        cb.free();
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