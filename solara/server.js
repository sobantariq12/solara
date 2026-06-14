const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'SOLARA — Premium Solar Energy Solutions Pakistan',
    description: 'Pakistan\'s most advanced solar installation company. Residential, commercial, and industrial solar solutions with guaranteed performance.'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SOLARA website running at http://localhost:${PORT}`);
});
