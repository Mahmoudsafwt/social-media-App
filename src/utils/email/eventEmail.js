import { EventEmitter } from "events";
import sendEmail from "./sendEmail.js";

export const sendEmailTypes={
    "verifyAccount":"verifyAccount",
    "resetPassword":"resetPassword",
    "updateEmail":"updateEmail"
}
export const verifyAccountEvent=new EventEmitter();
verifyAccountEvent.on(sendEmailTypes.verifyAccount,(to,subject,html)=>{
    sendEmail(to,subject,html);
})
export const resetPasswordEvent=new EventEmitter();

resetPasswordEvent.on(sendEmailTypes.resetPassword,(to,subject,html)=>{
    sendEmail(to,subject,html);
})
export const updateEmailEvent=new EventEmitter();
updateEmailEvent.on(sendEmailTypes.updateEmail,(to,subject,html)=>{
    sendEmail(to,subject,html);
})
