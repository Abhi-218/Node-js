import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";



const VideoSchema = mongoose.Schema({
    videofile : {
        type : String ,
        required : true,
        unique : true ,
    },
    thumbnail : {
        type : String ,
        required : true,
    },
    title : {
        type : String ,
        required : true, 
        trim : true,
    },
    discription : {
        type : String ,
        required : true,
    },
    duration : {
        type : Number,
        required : true,
    },
   views : {
    type : Number,
    default : 0,
   },
    isPublished : {
        type : Boolean,
        defalut : true,
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }

    

},{
    timestamps : true,
})

VideoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video",VideoSchema)