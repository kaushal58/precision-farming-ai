import Crop from '../models/Crop.js';

export const getCrops = async (req, res, next) => {
  try {
    const crops = await Crop.find({ userId: req.user._id });
    res.json({ success: true, crops });
  } catch (err) {
    next(err);
  }
};

export const createCrop = async (req, res, next) => {
  try {
    const crop = await Crop.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, crop });
  } catch (err) {
    next(err);
  }
};

export const updateCrop = async (req, res, next) => {
  try {
    const crop = await Crop.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
    res.json({ success: true, crop });
  } catch (err) {
    next(err);
  }
};

export const deleteCrop = async (req, res, next) => {
  try {
    await Crop.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
