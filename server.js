import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req , res)=>{
    try{
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${process.env.API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages:req.body.messages
  }),
});

    const data = await response.json();
    res.json(data);
        
    }catch(error){
        res.status(500).json({error: error.toString()});
    }
})

const port = 3000;
app.listen(port, ()=> console.log(` server is listening on http://localhost:${port}`));