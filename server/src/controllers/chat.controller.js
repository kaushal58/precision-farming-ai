import * as chatService from '../services/chatService.js';

export const sendMessage = async (req, res, next) => {
  try {
    const { message, language } = req.body;
    if (!message?.trim()) return res.status(400).json({ success: false, message: 'Message required' });

    const reply = await chatService.getChatResponse(req.user._id, message, language || req.user.language);
    res.json({ success: true, reply });
  } catch (err) {
    next(err);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const history = await chatService.getChatHistory(req.user._id);
    res.json({ success: true, history: history.reverse() });
  } catch (err) {
    next(err);
  }
};
