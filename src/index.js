/* eslint-disable no-console */
import express from 'express';

import './config/db';
import routes from './routes';

const app = express();

app.use(routes);

// middlewares(app);

const server = app.listen(process.env.PORT || 3001, function() {
  console.log('Listening on port ' + server.address().port);
});
