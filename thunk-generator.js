var fs = require('fs');

//define the thunk function
var Thunk = function(fn) {
  return function() {
    var args = Array.prototype.slice.call(arguments);
    var called = false; //used to avoid callback being executed more than once.
    return function(callback) {
      if (!called) {
        called = true;
        args.push(callback);
      } else {
        return;
      }
      fn.apply(this, args);
    }
  }
}

//demo for Thunk
var readFile = Thunk(fs.readFile);
var callback = readFile('./file1');
callback(function(err, data) {
  console.log('********demo for thunk********\n');
  console.log(data.toString());
});

//demo for generator with thunk
var gen = function*() {
  var r1 = yield readFile('./file1');
  var r2 = yield readFile('./file2');
  console.log('********demo for generator with thunk********\n');
  console.log(r1.toString());
  console.log(r2.toString());
}
var g = gen();
var y1 = g.next();
y1.value(function(err, data) {
  var y2 = g.next(data);
  y2.value(function(err, data) {
    var y3 = g.next(data);
  });
});

//demo for auto-execute generator with thunk
var gen2 = function*() {
  var r1 = yield readFile('./file1');
  var r2 = yield readFile('./file2');
  console.log('********demo for auto-execute generator with thunk********\n');
  console.log(r1.toString());
  console.log(r2.toString());
}
function run(gen) {
  var g = gen();
  function next(err, data) {
    var y = g.next(data);
    if (y.done) {
      return y.value;
    } else {
      y.value(next);
    }
  }
  next();
}
run(gen2);
