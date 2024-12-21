const mongoose = require('mongoose');

const taskProgressSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Task', 
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', 
    },
    progress: {
      type: Number,
      required: true,
      default: 0, 
      min: 0,
      max: 100,  
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true, 
  }
);

 
taskProgressSchema.index({ taskId: 1, userId: 1 }, { unique: true });

const TaskProgress = mongoose.model('TaskProgress', taskProgressSchema);

module.exports = TaskProgress;
