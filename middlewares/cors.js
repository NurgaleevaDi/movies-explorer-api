const allowedCors = [
  'localhost:3001',
  'http://localhost:3001',
  'localhost:3000',
  'http://localhost:3000',
  'http://movies.nurgaleeva.nomoredomains.xyz',
  'https://movies.nurgaleeva.nomoredomains.xyz',
];

// eslint-disable-next-line consistent-return
const cors = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    // res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.status(200).end();
  }
  next();
};
module.exports = { cors };
