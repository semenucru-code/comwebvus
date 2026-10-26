const express = require('express');
const https = require('https');
const app = express();

// ⚠️ Замените на ваш реальный логин в MOODLE
const MY_MOODLE_LOGIN = 'k4211c_semenyuk_andrey';

// Маршрут 1: /login
app.get('/login', (req, res) => {
  res.send(MY_MOODLE_LOGIN);
});

// Маршрут 2: /id/:N
app.get('/id/:N', (req, res) => {
  const n = req.params.N;
  const targetUrl = `https://nd.kodaktor.ru/users/${n}`;

  // Используем https.get, по умолчанию не отправляет Content-Type
  https.get(targetUrl, (apiRes) => {
    let rawData = '';
    apiRes.on('data', (chunk) => { rawData += chunk; });
    apiRes.on('end', () => {
      try {
        const json = JSON.parse(rawData);
        // Предполагаем, что структура ответа содержит поле login
        if (json.login !== undefined) {
          res.send(String(json.login));
        } else {
          res.status(502).send('No login field in response');
        }
      } catch (e) {
        res.status(502).send('Invalid JSON from upstream');
      }
    });
  }).on('error', (err) => {
    res.status(502).send('Upstream request failed');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});