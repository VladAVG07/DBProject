const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const dbMiddleware = require('./middlewares/dbMiddleware');
const resultMiddleware = require('./middlewares/resultMiddleware');
const vehicul = require('./routes/vehicul.route');
const accident = require('./routes/accident.route');
const mentenanta = require('./routes/mentenanta.route');
const alimentare = require('./routes/alimentare.route');
const cursa = require('./routes/cursa.route');
const client = require('./routes/client.route');
const cursa_client = require('./routes/cursa_client.route');
const sofer_vehicul = require('./routes/sofer_vehicul.route');
const sofer = require('./routes/sofer.route');

const app = express();

app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('main-view');
});

app.use(dbMiddleware);

app.use(vehicul);
app.use(accident);
app.use(mentenanta);
app.use(alimentare);
app.use(cursa);
app.use(client);
app.use(cursa_client);
app.use(sofer_vehicul);
app.use(sofer);

// app.use(resultMiddleware);

app.listen(3000);
