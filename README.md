# cb()

A minimal node.js utility for handling common (but often overlooked) callback scenarios.

## Seriously, another control flow library?

Not exactly. There are literally hundreds of libraries available for easing some of the pains associated with the continuation
passing style, and most of them do a pretty good job at this. These libraries typically focus on clean, terse APIs around
defining complex sequences of async operations, and thus tend to compete with each other through their varying approaches.
Rather than compete with these libraries, `cb()` focuses on a much narrower range of problems, and is intended to be complementary
to your control flow library (or lack thereof) of choice.

Instead of focusing on making complex, intertwined async interactions easier to read and write, `cb()`'s goal is simply to make
your code safer and more resilient to often overlooked error scenarios (such as callbacks that are accidentally invoked
synchronously, multiple times, or even never at all).  And because the desired callback execution semantics vary from use case to use
case, `cb()` allows you to pick and choose the rules that you want for a given callback, and then gets out of the way.

##Features

  * `.timeout()`: Simple callback timeouts
  * `.error()`: Explicit error handling
  * `.once()`: Once-and-only-once callback semantics
  *  Guaranteed asynchronous callback execution (protects against code that breaks this assumption)

## Installation

    $ npm install cb

## Usage

### Basic Usage

The most basic usage of `cb` consists of passing in your own function reference. In this example, `cb` will do nothing other
than insure the asynchronous invocation of the callback.

    doAsync(cb(function(err, res) {
        console.log(res);
    }));

### Timeout Handling

Timeouts are specified through the `.timeout()` method, and are specified in milliseconds.  If a timeout does occur, the error
passed to the callback will be an instance of `cb.TimeoutError`.

    doReallySlowAsync(cb(function(err, res) {
        assert(err instanceof cb.TimeoutError);
    }).timeout(50));

*Note: once a timeout has occured, any tardy attempts to invoke the callback will be ignored.*

### Explicit Error Handling

In situations where it is convenient to separate the code that runs on success or failure, this can easily be accomplished
with `.error()`.  If an 'errback' handler has been provided to `.error()`, then it is assumed that the error-first parameter
to the success handler is no longer required.  To illustrate,

    doAsync(cb(function(err, res) {
        if (err) {
            console.error(err);
        } else {
            console.log(res);
        }
    }));

Can be rewritten as:

    doAsync(cb(console.log).error(console.error));

### Force Once-and-only-once Callback Execution

Sometimes it's necessary to ensure that a callback is invoked once, and no more. Once-and-only-once execution semantics can be
enforced by using `.once()`.

    function runTwice(callback) {
        process.nextTick(function() {
           callback();
           callback(); 
        }); 
    }

    runTwice(cb(function() {
        console.log('I will only run once');
    }).once());

*Note: technically, `.once()` simply enforces at-most-once semantics. However, when combined with `.timeout()`, once-and-only-once
is achieved.*

### Combining Features

The `cb` API is fully chainable, and any arrangement of the features is valid.  For example:

    doAsync(cb(console.log).error(console.error).timeout(50).once());

## Running the Tests

    $ npm test

## License 

The MIT License (MIT)

Copyright (c) 2013 Jeremy Martin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
