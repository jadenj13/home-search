import * as express from 'express';
import controller from './controller';

export default express
  .Router()
  .post('/login', controller.login)
  .post('/register', controller.register)
  .get('/current-user', controller.getCurrentUser)
  .get('/logout', controller.logout)
  .post('/listing', controller.addListing)
  .get('/user/listings', controller.getCurrentUsersListings)
  .put('/listing/:id', controller.updateListing)
  .delete('/listing/:id', controller.deleteListing)
  .get('/listings', controller.getListings);
