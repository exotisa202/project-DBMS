module.exports = handler => (req, res, next) => Promise.resolve().then(() => handler(req, res)).catch(next);
