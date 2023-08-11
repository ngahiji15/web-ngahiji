const express       = require('express');
const path          = require('path');
const app           = express();
const bodyParser    = require('body-parser');

const appRouting    = require('./routers/app-route');
const { logger } = require('./utils/logger');

app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.use( express.static( "public" ) );

app.use('/assets',express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.json());
app.use('/', appRouting);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => 
console.log(`app listening on port http://localhost:${PORT}`),
logger.info(`Server listening at http://localhost:${PORT}`)
);

module.exports = app;