import express from 'express'
import {config} from 'dotenv'
import path from 'path'
const __dirname = path.resolve()
import uploaderRouter from './routes/upload.js'
import { connectDB } from './config/database.js'
import cors from 'cors'



config({
    path: path.resolve(__dirname,'./config/.env')
});

connectDB()
const app = express();
app.use(cors({
    origin: '*'
}))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
const prefix = '/api/v1'
app.use(prefix,uploaderRouter)

app.get('*',(req,res) => {
    res.send('server running well.')
})


export default app