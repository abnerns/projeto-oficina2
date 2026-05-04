const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// USAR AUTHORIZANTION COMO PARAMETRO NA ROTA
async function auth(req, res, next) {

    const authorization = req.headers.authorization;

    if(!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({ error: "O token de autorização fornecido não está correto" });
    }
    
    try {
        const idToken = authorization.split("Bearer ")[1];
        const tokenDecoded = await admin.auth().verifyIdToken(idToken);
        req.user = tokenDecoded;
        next();
    } catch(error) {
        return res.status(401).json({ error: "O token de autorização fornecido não está correto" });
    }
    
}

module.exports = { auth } ;
