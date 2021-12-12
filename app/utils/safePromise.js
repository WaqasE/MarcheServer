module.exports = async (promise) => {
    try {
        return await promise
    }
    catch (err) {
        next({
            status:500,
            msg:'Internal server error'
        })
    }
}