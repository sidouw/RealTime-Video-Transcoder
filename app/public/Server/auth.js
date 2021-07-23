const express = require('express');
const authrouter = express.Router();

let password = ''
let passwordEnabled = false

const setPassword = (pswEnabled,psw)=>{
    passwordEnabled = pswEnabled
    password=psw
}
authrouter.post('/',(req,res)=>{

    if (!passwordEnabled)
    return res.send(true)

    if(req.body.passworrd === password ){
       return  res.send(true)
    }else{
        return res.send(false)
    }
})


module.exports = {authrouter,setPassword}