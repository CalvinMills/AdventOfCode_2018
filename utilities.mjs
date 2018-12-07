String.prototype.nthIndexOf = function(pattern, n) {
  var i = -1;

  while (n-- && i++ < this.length) {
    i = this.indexOf(pattern, i);
    if (i < 0) break;
  }

  return i;
};
