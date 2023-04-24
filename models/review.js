import mongoose from 'mongoose'

const Schema = mongoose.Schema

const reviewSchema = new Schema({
  content: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  author: { type: Schema.Types.ObjectId, ref: 'Profile' },
  tool: { type: Schema.Types.ObjectId, ref: 'Tool' }
}, {
  timestamps: true
})

const Review = mongoose.model('Review', reviewSchema)

export {
  Review
}