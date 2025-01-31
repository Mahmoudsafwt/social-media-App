import jwt from "jsonwebtoken";

export const generateToken=({payload,segneture,options={}})=>{
    return jwt.sign(payload,segneture,options)
}
export const verifyToken=(token,segneture)=>{
    return jwt.verify(token,segneture);
}