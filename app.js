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
                res.render("adminhome",{});
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
app.listen(process.env.PORT || 3000,function()
{
    console.log("server started");

});