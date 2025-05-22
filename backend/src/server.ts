import './utils/loadEnv'

import express,{Application} from "express"
import cookieParser from 'cookie-parser';
import connectDB from "./config/db";
import cors from 'cors'
import userRoutes from "./routes/user-routes";
import authRoutes from './routes/auth-routes';
import { PORT, FRONTEND_URL, NODE_ENV, MONGO_URI } from "./utils/env";


let app:Application=express()

const corsOptions = {
    credentials: true,
    origin: FRONTEND_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cookieParser());
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
    console.log(`LOGGING 📝 : ${req.method} request to: ${req.originalUrl}`);
    next(); 
});

app.use('/user',userRoutes);
app.use('/auth', authRoutes);

app.get("/test", (req, res) => {
  res.json({
    env: NODE_ENV,
    mongoUri: MONGO_URI,
    frontend: FRONTEND_URL,
  });
});


const start = async() => {
    await connectDB()
    app.listen(PORT, () => {
        console.log(`SUCCESS: The ${NODE_ENV} server is listening on http://localhost:${PORT}`);
    });
};
start()