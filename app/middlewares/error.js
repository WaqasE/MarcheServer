module.exports=((err,req,res,next)=>{
    return res.status(err.status).send(err.msg);
})