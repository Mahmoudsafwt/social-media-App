

import mongoose,{Schema,model,Types} from "mongoose";


export const genderType={male:"male",female:"female"};
export const roleType={User:"User",Admin:"Admin"};
const userSchema=new Schema({
    userName:{
        type:String,
        required:[true,"User name is required"],
        minLength:[3,"User name must be at least 3 characters long"],
        maxLength:[20,"User name must be at most 20 characters long"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        lowercase:true,
        match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,"Invalid email format"]
    },
    password:{
        type:String,
        
        
    },
    phone:String,
    address:String,
    DOB:Date,
    image:String,
    coverImage:[String],
    gender:{
        type:String,
        enum:Object.values(genderType),
        default:genderType.male
    },
    role:{
        type:String,
        enum:Object.values(roleType),
        default:roleType.User
    },
    confirmEmail:{
        type:Boolean,
        default:false
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    changeCredentials:Date,
    OTPs:[{verificationOTP:{type:String, required: false},
         resetPasswordOTP: { type: String, required: false },
         updateEmailOTP: { type: String, required: false },
         createdAt: { type: Date,  }}],
    veiwers:[{
        user_id:{
            type:Types.ObjectId,
            ref:"User"
        },
        
        time:Date,
        count:Number
    }]     
},{timestamps:true})
const UserModel=model("User",userSchema);
export default UserModel