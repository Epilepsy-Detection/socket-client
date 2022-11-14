const fs = require("fs");


module.exports = (filePath, callback) => {
    const reader = fs.createReadStream(filePath);

    // equivelent to (chunk) => callback(chunk)
    reader.on("data", callback);
}