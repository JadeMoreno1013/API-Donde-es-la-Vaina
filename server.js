const express = require('express');
const serverConfig = require('./env/serverConfig');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');
const sessionRoutes = require('./routes/session.routes');
const userRoutes = require('./routes/user.routes');
const venueRoutes = require('./routes/venue.routes');
const eventRoutes = require('./routes/event.routes');
const purchaseRoutes = require('./routes/purchase.routes');
const reviewRoutes = require('./routes/review.routes');
const docsRoutes = require('./routes/docs.routes');

const api = express();

api.use(express.json());

api.use('/docs', docsRoutes);
api.use('/sessions', sessionRoutes);
api.use('/users', userRoutes);
api.use('/venues', venueRoutes);
api.use('/events', eventRoutes);
api.use('/purchases', purchaseRoutes);
api.use('/reviews', reviewRoutes);

api.use(notFoundHandler);
api.use(errorHandler);

api.listen(serverConfig.port, () => {
    console.log(`Server running in http://localhost:${serverConfig.port}`);
});
