module.exports = (req, res, next) => {
    if (!req.originalUrl.includes('/api/v1'))
        next({
            status: 404,
            msg: 'requested route not available!'
        })
    else
        next();
}