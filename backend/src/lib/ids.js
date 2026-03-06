const crypto = require("crypto");

function createId(size = 12) {
  return crypto.randomBytes(size).toString("hex").slice(0, size);
}

module.exports = { createId };
