import { Contact } from "../models/contactModals.js";
import HttpError from "../helpers/HttpError.js";
import catchAsync from "../helpers/catchAsync.js";

export const addContact = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const result = await Contact.create({ ...req.body, owner: _id });

  res.status(201).json(result);
});

export const getById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findOne({ _id: id, owner: req.user._id });
  if (!result) throw HttpError(404, "Not found");

  res.json(result);
});

export const listContacts = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const result = await Contact.find({ owner: _id });
  res.json(result);
});

export const removeContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findOneAndDelete({
    _id: id,
    owner: req.user._id,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
});

export const createContact = catchAsync(async (req, res) => {
  const { _id: owner } = req.user;
  const newContact = await Contact.findOneAndUpdate({ ...req.body, owner });
  console.log(newContact);
  if (!result) throw HttpError(404, "Not found");

  res.status(201).json(result);
});

export const updateContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: id, owner: req.user._id },
    { $set: req.body },
    { new: true }
  );
  if (!updatedContact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(updatedContact);
});

export const updateFavorite = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!req.body) throw HttpError(400, "missing field favorite");
  const result = await Contact.findOneAndUpdate(
    { _id: id, owner: req.user._id },
    { $set: req.body },
    {
      new: true,
    }
  );
  if (!result) throw HttpError(404, "Not found");

  res.status(200).json(result);
});
