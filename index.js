require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const cookieParser=require("cookie-parser");
const cors=require("cors");
const app=express();
const SocketServer=require('./socketServer');
const { ExpressPeerServer } =require('peer');
const path=require('path');

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Socket
const http=require('http').createServer(app);
const io=require('socket.io')(http);

//Whenever someone connects this gets executed
io.on('connection',socket=>{
    SocketServer(socket)
})

ExpressPeerServer(http,{path:'/'})

app.use("/api",require("./routes/authRouter"));
app.use("/api",require("./routes/userRouter"));
app.use("/api",require("./routes/postRouter"));
app.use("/api",require("./routes/commentRouter"));
app.use("/api",require("./routes/notifyRouter"));
app.use("/api",require("./routes/messageRouter"));

const DB=process.env.DB;
mongoose.connect(DB,{ 
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
    useCreateIndex:true,
}).then((res)=>{
    console.log("Successfully connected");
}).catch((err)=>{
    console.log("Not connected");
})

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname,'client','build','index.html'))
    })

}

const PORT=process.env.PORT|| 5000;
http.listen(PORT,()=>{
    console.log(`Listening to the ${PORT}`);
})