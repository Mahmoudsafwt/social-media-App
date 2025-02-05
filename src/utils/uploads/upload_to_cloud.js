import multer,{diskStorage} from "multer";


export const uploadToCloud=()=>{
     const storage=diskStorage({})

     return multer({storage});
}