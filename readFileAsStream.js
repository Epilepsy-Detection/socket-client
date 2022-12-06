const fs = require('fs');

module.exports = (filePath, callback) => {
  const reader = fs.createReadStream(filePath, { highWaterMark: 2 });

  // equivelent to (chunk) => callback(chunk)
  reader.on('data', (chunk) => {
    callback(chunk);
    reader.pause();
    setTimeout(() => {
      reader.resume();
    }, 100);
  });
};
