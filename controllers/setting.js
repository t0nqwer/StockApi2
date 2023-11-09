import Setting from "../models/setting.js";

export const getSetting = async (req, res) => {
  try {
    const setting = await Setting.findOne();
    res.status(200).json(setting);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const setBarcode = async (req, res) => {
  try {
    const setting = await Setting.findOneAndUpdate(
      {},
      { $set: { barcodeLocation: req.body.path } },
      { new: true, upsert: true }
    );
    res.status(200).json(setting);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
