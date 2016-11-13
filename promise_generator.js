var fs = require('fs');

//define the promise function
function readFile(fileName) {
  return new Promise(function(resolve, reject) {
    fs.readFile(fileName, function(err, data) {
      if (err) {
        reject(data);
      } else {
        resolve(data);
      }
    });
  });
}

//test this function with generator
var gen = function*() {
  var r1 = yield readFile('./file1');
  var r2 = yield readFile('./file2');
  console.log('********demo for generator with promise********\n');
  console.log(r1.toString());
  console.log(r2.toString());
}
var g = gen();
g.next().value.then(function(data) {
  g.next(data).value.then(function(data) {
    g.next(data);
  })
});

//test auto-execute function with generator
var gen2 = function*() {
  var r1 = yield readFile('./file1');
  var r2 = yield readFile('./file2');
  console.log('********demo for auto-execute generator with promise********\n');
  console.log(r1.toString());
  console.log(r2.toString());
}
function run(gen) {
  var g = gen();
  function next(data) {
    var y = g.next(data);
    if (y.done) {
      return y.value;
    } else {
      y.value.then(next);
    }
  }
  next();
}
run(gen2);
