const express=require("express");
const app=express();
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://19csr044:Gokul2002@cluster0-shard-00-00.dowfo.mongodb.net:27017,cluster0-shard-00-01.dowfo.mongodb.net:27017,cluster0-shard-00-02.dowfo.mongodb.net:27017/the_fashioner?ssl=true&replicaSet=atlas-108jkb-shard-0&authSource=admin&retryWrites=true&w=majority");

const usersignupschema={
    name:String,
    mail:String,
    mobilenumber:Number,
    password:String
};
const usersignup=mongoose.model("usersignup",usersignupschema);

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
    console.log(email+" "+password);
    usersignup.find({mail:email},function(err,found)
    {
        if(err)
        {
            console.log("error");
        }
        else{
            console.log(found[0].password);
        }
       if(found[0].password===password)
       {
           console.log("login success");
           res.render("home",{});
       } 
       else{
           res.redirect("/");
           console.log("failed");
       }


    });


});
app.listen(process.env.PORT || 3000,function()
{
    console.log("server started");

});