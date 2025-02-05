import mongoose from "mongoose";

export const getUserIdFromFolderPath=(path="")=>{
    const [...rest]=path.split("\\");
    if(rest){
        for(let i=0;i<rest.length;i++){
            if(rest[i].length===24&& mongoose.Types.ObjectId.isValid(rest[i])){
                return rest[i];
            }
        }
    }
    return null;
}