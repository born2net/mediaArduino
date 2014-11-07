
module.exports = wait;

/**
 * Wait for `ms` milliseconds.
 *
 * @param {Number} ms
 * @return {Function}
 */

function wait(ms) {
  return function(done) {
    setTimeout(done, ms);
  }
}
