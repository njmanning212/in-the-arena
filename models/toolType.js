import mongoose from 'mongoose'

const Schema = mongoose.Schema

const toolTypeSchema = new Schema({
  name: String,
  description: String,
}, {
  timestamps: true
})

const ToolType = mongoose.model('ToolType', toolTypeSchema)

export {
  ToolType
}