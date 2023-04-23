import mongoose from 'mongoose'

const Schema = mongoose.Schema

const toolSchema = new Schema({
  name: String,
  instructions: String,
  imgSrc: String,
  imgAttribution: String,
  difficulty: { type: Number, min: 1, max: 10 },
  author: { type: Schema.Types.ObjectId, ref: 'Profile' },
  type: { type: Schema.Types.ObjectId, ref: 'ToolType' },
}, {
  timestamps: true
})

const Tool = mongoose.model('Tool', toolSchema)

export {
  Tool
}