const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.get('/api/message', (req, res) => {
    res.json({ message: 'Hi, from server'});
});

app.listen(PORT, () => {
    console.log(`Server http://localhost: ${PORT} adresinde çalışıyor.`);
});
