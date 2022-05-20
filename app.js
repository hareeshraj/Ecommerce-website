const express=require("express");
const app=express();
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
const multer=require("multer");
const fs=require("fs");
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://19csr044:Gokul2002@cluster0-shard-00-00.dowfo.mongodb.net:27017,cluster0-shard-00-01.dowfo.mongodb.net:27017,cluster0-shard-00-02.dowfo.mongodb.net:27017/the_fashioner?ssl=true&replicaSet=atlas-108jkb-shard-0&authSource=admin&retryWrites=true&w=majority");
const storage=multer.diskStorage({
    
    destination:function(req,file,callback){
        callback(null,'./public/upload/images');
    },
    
    filename:function(req,file,callback)
    {
        callback(null,Date.now()+'-'+file.originalname);
    }
});


const upload=multer({
    storage:storage,
    limits:{
        fieldSize:1024*1024*10
    }
});

const usersignupschema={
    name:String,
    mail:String,
    mobilenumber:Number,
    password:String
};
const usersignup=mongoose.model("usersignup",usersignupschema);
const adminsignupschema={
    name:String,
    mail:String,
    mobilenumber:Number,
    password:String
};
const adminsignup=mongoose.model("adminsignup",adminsignupschema);
const adminsignup1=new adminsignup({
    name:"gokul",
    mail:"gokul03062002@gmail.com",
    mobilenumber:9043322155,
    password:"gokul2002",

});
//adminsignup1.save();
const productschema={
    pname:String,
    desc:String,
    pgroup:String,
    size:String,
    price:Number,
    file:String,
    fileExt: String,
    base64Code: String
};

const product=mongoose.model("product",productschema);
app.get("/",function(req,res)
{
    res.render("login",{});

});
app.post("/usersignup",function(req,res)
{
 const name=req.body.name;
 const email=req.body.email;
 const mobilenumber=req.body.mobilenumber;
 const password=req.body.password;
 //console.log(name+" "+email+" "+mobilenumber+" "+password);
 usersignup.find({mail:email},function(err,found)
 {
     console.log(found);
     if(found.length===0)
     {
         console.log("not exist");
         const usersignup1=new usersignup({
            name:name,
            mail:email,
            mobilenumber:mobilenumber,
            password:password,
        
        });
        usersignup1.save();
        res.redirect("/");
     }else{
         console.log("already exist");
         res.redirect("/");
     }

 });


});

app.post("/usersignin",function(req,res)
{
    const email=req.body.email;
    const password=req.body.password;
    const checkBox=req.body.admin;
    console.log(email+" "+password);
    if(checkBox==="admin")
    {
        console.log("admin");
        adminsignup.find({mail:email},function(err,found)
        {
            if(err)
        {
            console.log("error");
        }
        else if(found.length>0){
            if(found[0].password===password)
            {
                console.log("admin login success");
                res.redirect("/adminhome");
            } 
            else{
                res.redirect("/");
                console.log("failed");
            }
            // console.log(found[0].password);
        }
        else{
            res.redirect("/");
        }
     

        });
    }
    else{
        console.log("user");
        usersignup.find({mail:email},function(err,found)
        {
            console.log(found.length);
            if(err)
            {
                console.log("error");
            }
            else if(found.length>0){
                if(found[0].password===password)
                {
                    console.log("login success");
                    res.render("home",{});
                } 
                else{
                    res.redirect("/");
                    console.log("failed");
                }
                
               //console.log(found[0].password);
            }
            else
            {
                res.redirect("/");
            }
         
    
    
        });
    
    
    }

   
});
app.get("/adminhome",function(req,res)
{
    product.find({},function(err,found)
    {
        if(!err)
        {
            res.render("adminhome",{detail:found});
        }

    });
    

});
app.post("/addproduct",upload.single('file'),function (req,res)
{
    const file=req.file;
    let temp = fs.readFileSync(file.path);
    console.log(file.filename);
    const pname=req.body.productname;
    const desc =req.body.description;
    const group=req.body.productgroup;
    const price=req.body.price;
    const size=req.body.size;
  
    // console.log(pname+" "+desc+" "+group+" "+price+" "+size+" "+file);
    const productdata=new product({
        pname:pname,
        desc:desc,
        pgroup:group,
        size:size,
        price:price,
        file:file.originalname,
        fileExt: file.mimetype,
        base64Code: temp.toString('base64')
    });
   
    productdata.save();
   res.redirect("/adminhome");
});
app.post("/deleteproduct",function(req,res)
{
    const product_id=req.body.product_id;
    console.log(product_id);
    product.deleteOne({_id:product_id},function(err)
    {
        if(!err)
        {
            res.redirect("/adminhome");
        }

    });

});
app.post("/updateproduct",upload.single('file'),function(req,res)
{
    const product_id=req.body.product_id;
    console.log(product_id);
    const file=req.file;
    let temp = fs.readFileSync(file.path);
    // console.log(file.filename);
    const pname=req.body.productname;
    const desc =req.body.description;
    const group=req.body.productgroup;
    const price=req.body.price;
    const size=req.body.size;
  
    // console.log(pname+" "+desc+" "+group+" "+price+" "+size+" "+file);
 
   product.updateOne({_id:product_id},{pname:pname,desc:desc,pgroup:group,price:price,size:size, file:file.originalname,fileExt: file.mimetype, base64Code: temp.toString('base64')},function(err)
   {
       if(!err)
       {
        res.redirect("/adminhome");
       }

   });
});
app.get("/home",function(req,res)
{
    res.render("home",{});

});
app.get("/mens",function(req,res)
{
    product.find({pgroup:"Mens"},function(err,found)
    {
        if(!err)
        {
            res.render("mens",{detail:found});
        }
    });
   

});
app.post("/search",function(req,res)
{
    var size=req.body.size;
    var price1=req.body.price1;
    var price2=req.body.price2;

    console.log(size+""+price1+""+price2);
    product.find({price:{$gte:price1,$lte:price2},pgroup:"Mens",size:size},function(err,found)
    {
        if(!err)
        {
            res.render("mens",{detail:found});
        }
    });

});

app.get("/womens",function(req,res)
{
    product.find({pgroup:"Womens"},function(err,found)
    {
        if(!err)
        {
            res.render("womens",{detail:found});
        }
    });

});
app.post("/womensearch",function(req,res)
{
    var size=req.body.size;
    var price1=req.body.price1;
    var price2=req.body.price2;

    console.log(size+""+price1+""+price2);
    product.find({price:{$gte:price1,$lte:price2},pgroup:"Womens",size:size},function(err,found)
    {
        if(!err)
        {
            res.render("womens",{detail:found});
        }
    });

});
app.get("/kids",function(req,res)
{

    product.find({pgroup:"Kids"},function(err,found)
    {
        if(!err)
        {
            res.render("kids",{detail:found});
        }
    });

});
app.post("/kidssearch",function(req,res)
{
    var size=req.body.size;
    var price1=req.body.price1;
    var price2=req.body.price2;

    console.log(size+""+price1+""+price2);
    product.find({price:{$gte:price1,$lte:price2},pgroup:"Kids",size:size},function(err,found)
    {
        if(!err)
        {
            res.render("kids",{detail:found});
        }
    });

});
app.listen(process.env.PORT || 3000,function()
{
    console.log("server started");

});

//delete files

const path = require('path');

const directory = './public/upload/images';

module.exports = fs.readdir(directory, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    fs.unlink(path.join(directory, file), err => {
      if (err) throw err;
    });
  }
});