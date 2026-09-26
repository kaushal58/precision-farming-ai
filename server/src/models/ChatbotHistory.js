import mongoose from 'mongoose';

const chatbotHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    language: { type: String, default: 'en' },
  },
  { timestamps: true }
);

export default mongoose.model('ChatbotHistory', chatbotHistorySchema);
