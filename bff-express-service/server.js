const express = require('express');
const axios = require('axios').default;
const NodeCache = require('node-cache');
require('dotenv').config();

const app = express();
const cache = new NodeCache({ checkperiod: 60 });
const PORT = process.env.PORT || 8081;
const CACHE_TTL = 120;

app.use(express.json());

app.all('/*', (req, res) => {
  console.log(`originalURL - ${req.originalUrl}`);
  console.log(`method - ${req.method}`);
  console.log(`body - ${JSON.stringify(req.body)}`);

  const recipient = req.originalUrl.split('/')[1];
  console.log(`recipient - ${recipient}`);

  const recipientURL = process.env[recipient];
  console.log(`recipientURL - ${recipientURL}`);

  if (recipientURL) {
    const axiosConfig = {
      method: req.method,
      url: `${recipientURL}${req.originalUrl}`,
      ...(Object.keys(req.body || {}).length > 0 && { data: req.body })
    };
    console.log(`axiosConfig - ${JSON.stringify(axiosConfig)}`);

    const cacheKey = 'PRODUCTS_CACHE_KEY';
    const cacheValue = cache.get(cacheKey);

    if (cacheValue) {
      res.json(cacheValue);
      return;
    }

    axios(axiosConfig)
      .then((response) => {
        if (axiosConfig.url === `${process.env['products']}/products` && axiosConfig.method === 'GET') {
          cache.set(cacheKey, response.data, CACHE_TTL);
        }

        res.json(response.data);
      })
      .catch((error) => {
        log(`recipientError - ${JSON.stringify(error)}`);

        if (error.response) {
          const { status, data } = error.response;

          res.status(status).json(data);
        } else {
          res.status(500).json({ error: error.message });
        }
      });
  } else {
    res.status(502).json({ error: 'Cannot process request' });
  }
});

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});