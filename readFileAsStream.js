const fs = require('fs');
const LineByLineReader = require('line-by-line');
const readline = require('line-by-line');

let lineNumber = 0;
const length = 2;
var array = new Uint8Array(length);
module.exports = (filePath, callback) => {
  const reader = fs.createReadStream(filePath);

  const r = new LineByLineReader(filePath);
  // const r = readline.createInterface({
  //   input: reader,
  //   retainBuffer: true,
  // });

  // equivelent to (chunk) => callback(chunk)
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
      }, 100);
    }
  });
};
