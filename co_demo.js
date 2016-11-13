var fs = require('fs');
var co = require('./my-co.js');

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

var middle1 = function*(next) {
  console.log('begin 1');
  yield next;
  console.log('done 1');
  var r1 = yield readFile('./file1');
  console.log(r1.toString());
}

var middle2 = function*(next) {
  console.log('begin 2');
  yield next;
  console.log('done 2');
}

var middle3 = function*(next) {
  console.log('begin 3');
  yield next;
  console.log('done 3');
}

function compose(middlewares) {
  return function(next) {
    var i = middlewares.length;
    var next = function*() {}();
    while (i--) {
      next = middlewares[i].call(this, next);
    }
    return next;
  }
}

var g = compose([middle1, middle2, middle3]);

co(g);
