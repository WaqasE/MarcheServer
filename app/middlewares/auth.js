module.exports = (req, res, next) => {
    var bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        var token;
        var bearer = bearerHeader.split(" ");
        token = bearer[1];
        jwt.verify(token, process.env.JWTPRIVATEKEY, async function (err, decoded) {
            if (err) {
                req.authenticated = false;
                req.decoded = null;
                return res.status(401).json({ error: "Token Expired", msg: err })
            } else {
                req.decoded = decoded;
                req.authenticated = true;
                req.token = token
                next();
            }
        });
    }
    else {
        return res.status(401).json({ error: "Unauthorized" }).end()
    }
}