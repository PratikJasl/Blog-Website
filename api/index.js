require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userModel = require('./model/userModel');
const postModel = require('./model/postModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer  = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const { error } = require('console');
const port = process.env.PORT;
const app = express();
const jwtpassword = process.env.JWT_SECREAT;
const salt = bcrypt.genSaltSync(10);
const ADMIN_ID = '6590f6efa6d16c1dc4032485';
const uploadMiddleware = multer({dest: 'uploads/'});

//@dev middle-wares.
app.use(cors({credentials:true,origin:'https://myblog-v1-client.vercel.app/'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

//@dev connect to Mongoose DB.
try{
    mongoose.connect(`mongodb+srv://${process.env.MONGO_URL}`);
    console.log('MongoDB Connected Successfully');
}catch(error){
    console.log('Error Connecting with MongoDB:',error);
}

//------------------Root End Point -----------------------------------
app.get('/', (req,res)=>{
    res.send('Hello, Server is Listening');
});

//------------------Register End Point --------------------------------
app.post('/register',async(req,res)=>{
    const {username, password} = req.body;
    try{
        const userData = await userModel.create({
            username,
            password: bcrypt.hashSync(password,salt)
        })
        res.json(userData);
        console.log("All Ok");
    }catch(error){
        if(error.code === 11000){
            res.status(401).json({msg:'Username already exists',error});   
        }else{
            console.log('Error Saving user data to DB',error);
            res.status(400).json({msg:'Error Saving user data to DB',error});
        }
    }
});

//-------------------End Point For Login---------------------
app.post('/login', async(req,res)=>{
    const {username, password} = req.body;
    try{
        const userData = await userModel.findOne({username});
        const passOk = bcrypt.compareSync(password,userData.password);
        if(passOk){
            //@dev once the user is verified we create a JWT token and send it the browser in cookies.
            jwt.sign({username,id:userData._id},jwtpassword,{},(error,token) => {
                if (error) throw error;
                res.cookie('token',token).json({
                    id: userData._id,
                    username
                });
            });
        }else{
            console.log('Login Failed, Wrong credentials');
            res.status(400).json({msg:'Login Failed, Wrong credentials'});
        }
    }catch(error){
        res.status(400).json({msg:'Login Failed, Wrong credentials'});
    }
})

//--------------------- End Point to verify the Jwt Token -------------------------
app.get('/profile', (req,res)=>{
    try{
        const {token} = req.cookies;
        console.log('Received token:',token);

        if (!token) {
            return res.status(401).json({ msg: 'Token not provided' });
        }

        const verify = jwt.verify(token, jwtpassword, {});
        res.json(verify);
    }
    catch(error){
        console.log('Error verifying token:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});

//-------------------------- LOG OUT Endpoint ------------------------------------
app.post('/logout', (req,res)=>{
    res.cookie('token','').json('ok');
});

//------------------------ Create Post Endpoint -----------------------------------
app.post('/post', uploadMiddleware.single('file'), async(req, res)=>{
    try{
        let newPath
        if (req.file) {
            const {originalname, path} = req.file;
            const parts = originalname.split('.');
            const ext = parts[parts.length-1];
            newPath = path+'.'+ext;
            fs.renameSync(path, newPath);
        }
        const {token} = req.cookies;
        jwt.verify(token, jwtpassword, {}, async (error,info) => {
            if (error){
                console.log('Error verifying token:', error);
                res.status(500).json({ msg: 'Internal Server Error' });
            }else{
                const {title,summary,content,author, author_id} = req.body;
                const postData = await postModel.create({
                    title,
                    summary,
                    content,
                    cover:newPath,
                    author: author,
                    author_id: author_id
                });
                res.json(postData);
            }
        });
    }catch(error){
       console.log("Error Creating Post:",error);
       res.status(400).json({msg:'Error Creating Post'});
    }
});

//----------------------------- End Point To Get Post Data -----------------------------
app.get('/post',async (req,res)=>{
    try{
        const postData = await postModel.find().sort({createdAt: -1}).limit(20);
        const jsonString = JSON.stringify(postData, (key, value) => {
            if (typeof value === 'string') {
                return value.replace(/\\/g, '/');
            }
            return value;
        });
        res.json(JSON.parse(jsonString));
    }catch(error){
        console.log('Error Getting Post Data:',error);
    } 
});

//------------------------- End Point To Get Post Data by ID ---------------------------
app.get('/post/:id', async(req,res)=>{
    try{
        const {id} = req.params;
        const postData = await postModel.findById(id);
        res.json(postData);
    }catch(error){
        console.log('Error Getting Post Data:',error)
    }
})

//------------------------ End Point To Update Posts -----------------------------------
app.put('/post',uploadMiddleware.single('file') ,async(req,res)=>{
    try{
        let newPath = null;
        if (req.file) {
            const {originalname,path} = req.file;
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            newPath = path+'.'+ext;
            fs.renameSync(path, newPath);
        }
        const {token} = req.cookies;
        jwt.verify(token, jwtpassword, {}, async (error,info) => {
            
            if (error){
                console.log('Error verifying token:', error);
                res.status(500).json({ msg: 'Internal Server Error' });
            }else{
                const {title,summary,content,author,author_id, _id} = req.body;
                const postData = await postModel.findOne({_id});
                const isAuthor = JSON.stringify(postData.author_id) === JSON.stringify(info.id);
                const isAdmin = ADMIN_ID === info.id;
                if(!(isAuthor || isAdmin)){
                    return res.status(400).json({msg:'Only the Author/Admin Can Update Post'});
                }
                if(isAdmin){
                    await postModel.updateOne({ _id},{
                        title,
                        summary,
                        content,
                        cover: newPath ? newPath : postData.cover,
                    });
                    res.json(postData);
                }
                else{
                    await postModel.updateOne({ _id},{
                        title,
                        summary,
                        content,
                        cover: newPath ? newPath : postData.cover,
                        author: author,
                        author_id: author_id
                    });
                    res.json(postData);
                } 
            }
        });
    }catch(error){
        console.log("Error Updating Post:",error);
        res.status(400).json({msg:'Error Updating Post'});
    }   
}); 

// ------------------------ End Point To Delete Post ----------------------------------
app.post('/delete',bodyParser.json(), (req,res)=>{
    try{
        const {token} = req.cookies;
        const {PostId} = req.body;
        console.log(PostId);
        if(token){
            jwt.verify(token, jwtpassword, {}, async (error,info) => {
                if (error){
                    console.log('Error verifying token:', error);
                    res.status(500).json({ msg: 'Internal Server Error' });
                }else{
                    const postData = await postModel.findOne({_id: PostId});
                    const isAuthor = JSON.stringify(postData.author_id) === JSON.stringify(info.id);
                    const isAdmin = ADMIN_ID === info.id;
                    if(!(isAuthor || isAdmin)){
                        return res.status(400).json({msg:'Only the Author/Admin Can Update Post'});
                    }
                    await postModel.deleteOne({_id: PostId});
                    const jsonString = JSON.stringify(postData, (key, value) => {
                        if (typeof value === 'string') {
                            return value.replace(/\\/g, '/');
                        }
                        return value;
                    });
                    const Data = JSON.parse(jsonString);
                    const {cover} = Data;
                    fs.unlink(cover, (err) => {
                        if (err) {
                          console.error(`Error deleting file: ${err.message}`);
                        } else {
                          console.log('File deleted successfully');
                        }
                      });
                    res.status(200).json({msg: 'Post Deleted'}); 
                }
            });
        }
        else{
            res.status(404).json({msg: 'Authorization not provided'});
        }   
        
    }
    catch(error){
        console.log('error deleting post:',error);
        res.status(400).json({msg:'Error Deleting Post'});
    }     
});
        
app.use((error,req,res,next)=>{
    console.log('Internal Server Error:',error);
    res.status(500).json({msg:'Internal server eror'});
    next();
})

app.listen(port || 3000, ()=>{
    console.log(`Server Listening on port ${port || 3000}`);
})