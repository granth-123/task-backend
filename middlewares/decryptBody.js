import { decrypt } from "../utils/crypto.js";

export function decryptBody(req,res,next){
    try{
        if(req.body.encrypted){
            const decryptedText=decrypt(req.body.encrypted);
            req.body=JSON.parse(decryptedText);
            console.log("Decrypted : ",req.body);
        }
        next();
    }catch(err){
        console.error('Decryption failed:', err.message);
        return res.status(400).json({ error: 'Invalid encrypted payload' });
    }
}
