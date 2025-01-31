import CryptoJS  from 'crypto-js';

export const encrypt=({data,key})=>{
    return CryptoJS.AES.encrypt(data, key).toString();
}

export const decrypt=({encryptedData,key})=>{
    return CryptoJS.AES.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8);
}