// Minimal required-string validation. Domain validation remains future work.
module.exports = function fields(body, names) {
  return names.map(name => {
    const value = body[name];
    if (typeof value !== 'string' || !value.trim() || value.length > 255) {
      const error = new Error(`Invalid or missing field: ${name}`);
      error.status = 400;
      throw error;
    }
    return value.trim();
  });
};
