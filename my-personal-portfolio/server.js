const express = require('express');
const app = express();

app.use(express.static('public'));
app.get('/api/message', (req, res) => {
    res.json({ message: 'Hi, from server'});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


