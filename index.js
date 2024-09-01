const express = require('express')
const bodyParser = require('body-parser')
var jwt = require('jsonwebtoken');
const multer  = require('multer')
const cors = require('cors')
const { Server } = require("socket.io");
const http = require('http');
const app = express()
const httpserver = http.createServer(app);
const io = new Server(httpserver,{
  cors:{
    origin:'*'
  }
})
const path = require('path');
const isEmail = require('validator/lib/isEmail'); // Validator library for email validation
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
app.use(cors());
// app.use('/uploads',express.static(path.join(__dirname,'uploads')));
app.use('/uploads', express.static('uploads'));
const port = 4000
const mongoose = require('mongoose');
const { Socket } = require('dgram');

mongoose.connect('mongodb+srv://chirag2306garg:Et1kF7lFs2E7hExo@cluster0.vf0aepw.mongodb.net/?retryWrites=true&w=majority');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

const Users = mongoose.model('Users',
{ 
  username: {
  type: String,
  required: [true, 'Username is required'],
  match: [/^[a-zA-Z]+$/, 'Username must contain only alphabets'],  
},
password: {
  type: String,
  required: [true, 'Password is required'],
  minlength: [4, 'Password must be at least 4 characters long'] // Example for password strength
},
email: {
  type: String,
  required: [true, 'Email is required'],
  validate: [isEmail, 'Invalid email format'],
  unique: true // Ensure email is unique
},
  contact: {
    type: String,
    required: [true, 'Contact number is required'],
    match: [/^\d{10}$/, 'Contact number must be 10 digits']
  },
  likedProducts:[{type:mongoose.Schema.Types.ObjectId,ref:'Products'}]
});

app.post('/liked-product', (req, res) => {
  const userId = req.body.userId;
  const productId = req.body.productId;

  if (productId) {
    // Update likedProducts in Users model
    Users.updateOne({ _id: userId }, { $addToSet: { likedProducts: productId } })
      .then(() => {
        res.send({ message: 'Product liked' });
      })
      .catch(() => {
        res.status(500).send({ message: 'SERVER ERROR' });
      });
  } else {
    // Fetch likedProducts and populate in response
    Users.findOne({ _id: userId })
      .populate('likedProducts')
      .then((result) => {
        res.send({ message: 'Fetching Liked Products', products: result.likedProducts });
      })
      .catch(() => {
        res.status(500).send({ message: 'SERVER ERROR' });
      });
  }
});

app.post('/disliked-product',(req,res)=>{
    const userId = req.body.userId;
    const productId = req.body.productId;

    Users.updateOne({ _id: userId }, { $pull: { likedProducts: productId } })
    .then(() => {
      res.send({ message: 'Product Unliked' });
    })
    .catch(() => {
      res.status(500).send({ message: 'SERVER ERROR' });
    });

})

app.get('/', (req, res) => {
  res.send('Hello World! Chirag is here')
})

app.post('/signup',(req,res)=>{
  console.log(req.body)
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const contact = req.body.contact;
  const user = new Users({ username: username,password:password,email:email,contact:contact });
  user.save()
  .then(()=>{
    res.send({message:'THANKS FOR SIGNING UP'})
  })
  .catch((error) => {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      res.status(400).send({ message: 'Validation failed', errors: messages });
    } else {
      res.status(500).send({ message: 'Server error' });
    }
  });
  
})

app.post('/login',(req,res)=>{
  console.log(req.body)
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  Users.findOne({username:username})
  .then((result)=>{
    // console.log(result,"user data")
    if(result)
    {
      if(result.password ===password && result.email===email)
      {
        const token = jwt.sign({
          data: result
        }, 'MYKEY', { expiresIn: '1hr' });
      res.send({message:'User found :) success',token:token,userId:result._id,username:result.username})
      }
      else
      {
        res.send({message:'Incorrect password or email'})
      }
    }
  else{
    res.send({message :'User not found:( SIGNUP'})
  }
  })
  .catch(()=>{
    res.send({message :'SERVER ERROR'})
  })
  
})
app.post('/delete-product',(req,res)=>{
  const id=req.body.item;
  // console.log(req);
  console.log(id);
  Products.deleteOne({_id:id}).then((result)=>{
    console.log(result)
    if(result)
    {
      
      res.send({message:'deleted'})
      }
      else
      {
        res.send({message:'error'})
      }
    }
  )
})
const Products = mongoose.model('Products',{
   pname: {
    type:String,
    required:[true] },
   pdesc: {
    type:String,
    required:[true]},
   pprice: {
    type:String,
    required:[true]},
   pcat:{
    type:String,
    required:[true]},
   pimg1:{
    type:String,
    required:[true]},
   pimg2:String,
   addedBy:mongoose.Schema.Types.ObjectId
  });

  app.post('/add-product', upload.fields([{ name: 'pimg1' }, { name: 'pimg2' }]), (req, res) => {
    console.log(req.body);
    console.log(req.files);
    const pname = req.body.pname;
    const pdesc = req.body.pdesc;
    const pprice = req.body.pprice;
    const pcat = req.body.pcat;
    const pimg1 = req.files['pimg1'] ? req.files['pimg1'][0].path : null;
    const pimg2 = req.files['pimg2'] ? req.files['pimg2'][0].path : null;

    const addedBy = req.body.userId;

    const Product = new Products({ pname, pdesc, pprice, pcat, pimg1, pimg2, addedBy });
    console.log(Product);

    Product.save()
        .then(() => {
            res.send({ message: 'Product Added' })
        })
        .catch(() => {
            res.send({ message: 'SERVER ERROR' })
        })
})



app.post('/update-product', upload.fields([{ name: 'pimg1' }, { name: 'pimg2' }]), (req, res) => {
  console.log(req.body);
  console.log(req.files);
  const pname = req.body.pname;
  const pdesc = req.body.pdesc;
  const pprice = req.body.pprice;
  const pcat = req.body.pcat;
  const pimg1 = req.files['pimg1'] ? req.files['pimg1'][0].path : null;
  const pimg2 = req.files['pimg2'] ? req.files['pimg2'][0].path : null;

  const addedBy = req.body.userId;
  const pid=req.body.pid;
  // const Product = new Products({ pname, pdesc, pprice, pcat, pimg1, pimg2, addedBy });
  // console.log(Product);
  let editobj={};
  if(pname)
  {
    editobj.pname=pname;
  }
  if(pdesc)
  {
    editobj.pdesc=pdesc;
  }
  if(pprice)
  {
    editobj.pprice=pprice;
  }
  if(pcat)
  {
    editobj.pcat=pcat;
  }
  if(pimg1)
  {
    editobj.pimg1=pimg1;
  }
  if(pimg2)
  {
    editobj.pimg2=pimg2;
  }
  Products.updateOne({_id:pid},{ $set: editobj },{new:true})
      .then(() => {
          res.send({ message: 'Product Updated' })
      })
      .catch(() => {
          res.send({ message: 'SERVER ERROR' })
      })
})

app.get('/my-profile/:userId',(req,res)=>{
  const _userId=req.params.userId;
  Users.findOne({_id : _userId}).then((result)=>{
    res.send({message:'success' , user:{
      email:result.email,
      username:result.username,
      Contact_Number:result.contact
    }})
  })
  .catch(()=>{
    res.send({message:'SERVER ERROR'})
  })
  
})

app.put('/update-profile/:userId', (req, res) => {
  const _userId = req.params.userId;
  const { username, email, Contact_Number } = req.body;

  Users.findOneAndUpdate(
      { _id: _userId },
      { 
          username: username,
          email: email,
          contact: Contact_Number
      },
      { new: true, runValidators: true } 
  )
  .then((updatedUser) => {
      if(updatedUser) {
          res.send({
              message: 'Profile updated successfully',
              user: {
                  email: updatedUser.email,
                  username: updatedUser.username,
                  Contact_Number: updatedUser.contact
              }
          });
      } else {
          res.status(404).send({message: 'User not found'});
      }
  })
  .catch((err) => {
      res.status(500).send({message: 'Error updating profile', error: err.message});
  });
});


app.get('/get-product',(req,res)=>{
  const catName = req.query.catName;
  // console.log(catName);
  let _f={}
  if(catName)
  {
    _f={catName}
  }
  if(!catName){
   Products.find(_f)
  .then((result)=>{
    res.send({message:'Fetching Products' , products:result})
  })
  .catch(()=>{
     res.send({message:'SERVER ERROR'})
  })
  
  }
  // console.log(catName);
  else{
  Products.find({ pcat: catName })
  .then((result)=>{
    res.send({message:'Fetching Products' , products:result})
  })
  .catch(()=>{
    res.send({message:'SERVER ERROR'})
  })
}
})
app.get('/product/:id',(req,res)=>{
  // console.log(req.params);
  Products.findOne({_id:req.params.id})
  .then((result)=>{
    res.send({message:'Products' , product:result})
  })
  .catch(()=>{
    res.send({message:'SERVER ERROR'})
  })
})

app.get('/get-user/:uId',(req,res)=>{
  const _userId=req.params.uId
  Users.findOne({_id : _userId}).then((result)=>{
    res.send({message:'success' , user:{
      email:result.email,
      username:result.username,
      Contact_Number:result.contact
    }})
  })
  .catch(()=>{
    res.send({message:'SERVER ERROR'})
  })
})

app.post('/my-products',(req,res)=>{
  const userId=req.body.userId
  Products.find({addedBy:userId})
  .then((result)=>{
    res.send({message:'Fetching Added Products' , products:result})
    // console.log(`problem`);
    // console.log(result.likedProducts);
  })
  .catch(()=>{
    res.send({message:'SERVER ERROR'})
  })
})

app.get('/search',(req,res)=>{

  let search=req.query.search;
  console.log(search);
  

  Products.find({
    $or: [
      { pname: { $regex: new RegExp(search, 'i') } },
      { pdesc: { $regex: new RegExp(search, 'i') } },
      { pprice: { $regex: new RegExp(search, 'i') } }
    ]
  })
  .then((results)=>{
    //console.log(results);
    res.send({message:'Fetching Products' , products:results})
  })
  .catch(()=>{
    res.send({message:'SERVER ERROR'})
  })
})


// const httpServer = http.createServer(app);
// const { Server } = require('socket.io');
// const io = new Server(httpServer, {
//   cors: {
//     origin: 'http://localhost:3000' 
//   }
// });

let messages = [];
console.log(messages)
io.on('connection',(socket)=>{
  // console.log('checksoc');
    console.log('socket connected',socket.id);
    socket.on('sendmsg', (data) => {
      console.log('Received message:', data);
      messages.push(data);
      io.emit('getmsg', messages);
    });
    io.emit('getmsg', messages); // Emit the updated messages array to all connected clients
    
})


httpserver.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})