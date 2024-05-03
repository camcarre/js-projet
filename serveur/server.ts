import express from 'express';
import path from 'path';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/index.html'));
});

app.use('/css', express.static(path.join(__dirname, '../css')));

app.get('/jeux.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/jeux.html'));
});

app.get('/clearplayer.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/clearplayer.html'));
});

app.use('/js', express.static(path.join(__dirname, '../js')));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});