module.exports = sleep;
function sleep(ms) {
  return function (cb) {
    setTimeout(cb, ms);
  };
}

