import Marketing from '../models/marketingModel.js';

// @desc    Get active marketing message
// @route   GET /api/marketing
// @access  Public
export const getActiveMarketing = async (req, res) => {
  try {
    const marketing = await Marketing.findOne({ isActive: true }).sort({ createdAt: -1 });
    res.json(marketing || { message: '', isActive: false });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update or create marketing message
// @route   POST /api/marketing
// @access  Private/Admin
export const updateMarketing = async (req, res) => {
  const { message, isActive, type, endDate } = req.body;

  try {
    // We only keep one active message for simplicity
    let marketing = await Marketing.findOne({});
    
    if (marketing) {
      marketing.message = message || marketing.message;
      marketing.isActive = isActive !== undefined ? isActive : marketing.isActive;
      marketing.type = type || marketing.type;
      marketing.endDate = endDate || marketing.endDate;
      await marketing.save();
    } else {
      marketing = await Marketing.create({ message, isActive, type, endDate });
    }
    
    res.json(marketing);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
