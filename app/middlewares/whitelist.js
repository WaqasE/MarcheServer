const whitelist = [
    'http://localhost:8092',
    'http://localhost:5000'

];
module.exports = ((req, res, next) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    console.log(req.headers.origin)
    if (whitelist.some(wl => wl.localeCompare(req.headers.origin) === -1))
        next();
    else
        next({
            status: 401,
            msg: 'ip unauthorized!'
        })
})