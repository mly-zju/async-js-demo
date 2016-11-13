var co = function(gen) {
  if (typeof gen.next === 'function') {
    var g = gen;
  } else {
    g = gen();
  }
  function next(data) {
    tmp = g.next(data);
    if (tmp.done) {
      return;
    } else if (typeof tmp.value.next === 'function') {
      co(tmp.value);
      next();
    } else {
      tmp.value.then(next);
    }
  }
  next();
}
module.exports = co;
