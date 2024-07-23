import express from 'express'
import {config} from 'dotenv'
import path from 'path'
const __dirname = path.resolve()
import uploaderRouter from './routes/upload.js'
import userRoute from './routes/user.js'
import { connectDB } from './config/database.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'



config({
    path: path.resolve(__dirname,'./config/.env')
});

connectDB()
const app = express();
app.use(cors({
    origin: [process.env.FRONTEND_URL,'http://localhost:3000'],
    methods: ['GET','POST','PUT','DELETE'],
    credentials: true
}))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())
const prefix = '/api/v1'
app.use(prefix,uploaderRouter)
app.use(prefix,userRoute)

app.get('*',(req,res) => {
    res.send('server running well.')
})


export default app