import { Router } from 'express';
import mongoose from 'mongoose';
import { resourceModels } from '../models/index.js';

const router = Router();

function safePayload(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const copy = { ...body };
  delete copy._id;
  delete copy.id;
  delete copy.__v;
  delete copy.createdAt;
  delete copy.updatedAt;
  return copy;
}

router.param('resource', (req, res, next, resource) => {
  const Resource = resourceModels[resource];
  if (!Resource) return res.status(404).json({ message: 'Unknown resource.' });
  req.Resource = Resource;
  next();
});

router.get('/:resource', async (req, res, next) => {
  try {
    const records = await req.Resource.find().sort({ createdAt: -1 }).limit(1000).lean();
    res.json(records.map(record => ({ ...record, id: String(record._id), _id: undefined })));
  } catch (error) { next(error); }
});

router.get('/:resource/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid record ID.' });
    const record = await req.Resource.findById(req.params.id).lean();
    if (!record) return res.status(404).json({ message: 'Record not found.' });
    res.json({ ...record, id: String(record._id), _id: undefined });
  } catch (error) { next(error); }
});

router.post('/:resource', async (req, res, next) => {
  try {
    const payload = safePayload(req.body);
    if (!payload) return res.status(400).json({ message: 'A JSON object is required.' });
    const record = await req.Resource.create(payload);
    res.status(201).json({ ...record.toObject(), id: String(record._id), _id: undefined });
  } catch (error) { next(error); }
});

router.put('/:resource/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid record ID.' });
    const payload = safePayload(req.body);
    if (!payload) return res.status(400).json({ message: 'A JSON object is required.' });
    const record = await req.Resource.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true, strict: 'throw' });
    if (!record) return res.status(404).json({ message: 'Record not found.' });
    res.json({ ...record.toObject(), id: String(record._id), _id: undefined });
  } catch (error) { next(error); }
});

router.delete('/:resource/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid record ID.' });
    const record = await req.Resource.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found.' });
    res.json({ message: 'Record deleted.' });
  } catch (error) { next(error); }
});

export default router;
