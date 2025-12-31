function makeResAdapter(res) {
  return {
    status(code) {
      res.statusCode = code;
      return this;
    },
    json(obj) {
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(obj));
    },
    headers(headers) {
      Object.entries(headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });
      return this;
    }
  };
}

function parseJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

module.exports = {
  makeResAdapter,
  parseJson,
}
