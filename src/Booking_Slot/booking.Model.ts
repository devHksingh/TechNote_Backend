import mongoose, { Schema } from "mongoose";


const bookingSchema = new Schema({
  date:{
    type:String,
    required:true
  },
  timeSlot: {
    type: String,
    required: true
  },
  isAvailable: { type: Boolean, default: true },

  applicantName:{
    type:String,
    // required:true
  },

  applicantEmail:{
    type:String,
    // required:true
  },
  // additionalInfo:{
  //   type:String
  // }
},{timestamps:true})

export const Booking = mongoose.model('Booking', bookingSchema);