const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Aqui estão os seus dados' });
});

app.post('/', (req, res) => {
  res.json({ message: 'Criado com sucesso' });
});

const PORT = 3000;

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
