import bcrypt from "bcrypt";

export const hash=(data)=>{
    return bcrypt.hashSync(data,Number(process.env.SALT));
}
export const compareHash=(data,hash)=>{
    return bcrypt.compareSync(data,hash);
}