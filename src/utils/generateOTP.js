import { customAlphabet } from 'nanoid'

 const generateOTP=()=>customAlphabet("0123456789",process.env.OTP_DIGITS)();
 export default generateOTP;