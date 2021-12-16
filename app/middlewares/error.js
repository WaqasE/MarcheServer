module.exports=((err,req,res,next)=>{
    return res.send(err.msg).status(err.status);
})