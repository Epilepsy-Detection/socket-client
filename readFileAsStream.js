const LineByLineReader = require('line-by-line');

let lineNumber = 0;
const length = 512;
var array = new Uint8Array(length);
module.exports = (filePath, callback) => {
  const r = new LineByLineReader(filePath);

  r.on('line', (line) => {
    array[lineNumber] = parseInt(line);
    lineNumber++;
    if (lineNumber === length) {
      callback(array);

      array = new Uint8Array(length);
      lineNumber = 0;

      r.pause();
      setTimeout(() => {
        r.resume();
      }, 3000);
    }
  });
};
