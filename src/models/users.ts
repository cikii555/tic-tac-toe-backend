
import mongoose  from "mongoose"
const User = mongoose.model('User', new  mongoose.Schema({
    name:String
}))

export = {User}
