const router = express.Router();
const axios = require('axios');

router.get('/most-active', async(req,res)=>{
    try{
        const response = await axios.get('https://stock.indianapi.in/NSE_most_active',{
            headers:{'X-Api-Key':process.env.INDIAN_API_KEY}
        });
        res.json(response.data);
    }catch(err){
        res.status(500).json({error: 'Failed to fetch stocks'});
    }
});

module.exports = router;