import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const algorithm='aes-256-cbc';
const key=Buffer.from(process.env.ENCRYPTION_KEY,'hex');
const iv=Buffer.from(process.env.ENCRYPTION_IV,'hex');

export function encrypt(text){
    const cipher=crypto.createCipheriv(algorithm,key,iv);
    let encrypted=cipher.update(text,'utf-8','hex');
    encrypted+=cipher.final('hex');
    return encrypted;
}

export function decrypt(encrypted){
    const decipher=crypto.createDecipheriv(algorithm,key,iv);
    let decrypted=decipher.update(encrypted,'hex','utf-8');
    decrypted+=decipher.final('utf-8');
    return decrypted; 
}

