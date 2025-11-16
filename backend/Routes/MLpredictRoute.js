const router = require("express").Router();
const ML_API_URL = `${process.env.ML_SERVICE_URL}/predict`;

router.post("/predict", async(req,res)=>{
    const {symbol, force_retrain=false} = req.body;
    try{
        const response = await fetch(ML_API_URL,{
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({symbol, force_retrain}),
        });
        const data = await response.json();
        // console.log(data);
        res.json(data);
    }catch(err){
        console.log("Prediction error:", err);
        res.status(500).json({error: "Prediction service unavailable"});
    }
});

module.exports = router;