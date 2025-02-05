import multer,{diskStorage} from "multer";
import path from "path";
import fs from "fs";
import { nanoid } from "nanoid";
export const fileValidation={
    images:["image/png","image/jpeg","image/jpg"],
}
//upload\user\profile_images\67a01e9393c25b363cf630b2\o1r4C__profile picture of mahmoud.jpg
export const upload=(fileType,folder)=>{
 const storage=diskStorage({destination:(req,file,cb)=>{
    const folderPath=path.join("./",`${folder}/${req.user._id}`);
    if(fs.existsSync(folderPath))return cb(null,folderPath);
    fs.mkdirSync(folderPath,{recursive:true});
    return cb(null,folderPath);
 },filename:(req,file,cb)=>{
    const extention=path.extname(file.originalname);
    cb(null,nanoid(5)+"__"+` picture  ${req.user.userName}`+extention);
 }})
 const fileFilter=(req,file,cb)=>{
    if(fileType.includes(file.mimetype))return cb(null,true);
    return cb(new Error("Invalid file type"),false);
 }
 return multer({storage,fileFilter});
}