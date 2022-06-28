const express = require('express')
const router = express.Router()

router.post('/login', async (req, res, next) => {
    try{
    
    }
    catch(err){
        next(err)
    }
})

router.post('/register', async (req, res, next) => {
    try{
        console.log(5)
    }
    catch(err){
        next(err)
    }
})

module.exports = router