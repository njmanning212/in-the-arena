import mongoose from 'mongoose'

const Schema = mongoose.Schema

const profileSchema = new Schema({
  name: String,
  avatar: String,
  createdToolTypes: [{ type: Schema.Types.ObjectId, ref: 'ToolType' }],
  createdTools: [{ type: Schema.Types.ObjectId, ref: 'Tool' }],
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  favoriteTools: [{ type: Schema.Types.ObjectId, ref: 'Tool' }],
}, {
  timestamps: true
})

const Profile = mongoose.model('Profile', profileSchema)

export {
  Profile
}
