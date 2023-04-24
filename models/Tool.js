import mongoose from 'mongoose'

const Schema = mongoose.Schema

const toolSchema = new Schema({
  name: String,
  instructions: String,
  imgSrc: String,
  imgOwner: String,
  imgOwnerLink: String,
  difficulty: { type: Number, min: 1, max: 5},
  author: { type: Schema.Types.ObjectId, ref: 'Profile' },
  type: { type: Schema.Types.ObjectId, ref: 'ToolType' },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  averageRating: Number,
}, {
  timestamps: true
})

const Tool = mongoose.model('Tool', toolSchema)

export {
  Tool
}