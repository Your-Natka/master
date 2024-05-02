import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { addSchema, updeteSchema, updFavoriteSchema } from '../models/contactModals.js';
import { listContacts, getById, removeContact, addContact, updateContact, updateFavorite } from '../controllers/contactsController.js';
import isValidId from '../middlewares/isValidId.js';

const contactsRouter = express.Router();

contactsRouter.get('/', authenticate, listContacts);

contactsRouter.get('/:id', authenticate, isValidId, getById);

contactsRouter.delete('/:id', authenticate, isValidId, removeContact);

contactsRouter.post('/', authenticate, validateBody(addSchema), addContact);

contactsRouter.put('/:id', authenticate, isValidId, validateBody(updeteSchema), updateContact);

contactsRouter.patch('/:id/favorite', authenticate, isValidId, validateBody(updFavoriteSchema), updateFavorite);

export default contactsRouter;
