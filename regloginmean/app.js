const express=require('express');
const mongoose=require('mongoose');
const passport=require('passport');
const bodyParser=require('body-parser');
const LocalStrategy=require('passport-local');
const passportLocalMongoose=require('passport-local-mongoose');
const User=require("./model/User");

const app=express();
mongoose.connect('mongodb://localhost/27017');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require("express-session")({
    secret:'myanup',
  resave:false,
  saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//route
//home page

app.get("/",function(req,res){
    res.render("home");
});

//secret
app.get("/secret",isLogin, function(req,res){
    res.render("secret");
});

//register
app.get("/register", function(req,res){
    res.render("register");
});

//register-post
app.post("/register", async(req,res)=>{
    const user=await User.create({
        email:req.body.email,
        password:req.body.password
    });
    return res.status(200).json(user);

});

//login
app.get("/login", function(req,res){
    res.render("login");
});

app.post("/login", async function(req,res){
    try{
        const user=await User.findOne({
            email:req.body.email
        });
        if(user){
            const result=req.body.password==user.password;
            if(result){
                res.render("secret");
            }else{
                res.status(400).json({error:"Password doesnot match"});
            }

        }
        else{
            res.status(400).json({error:"Email  does not exist"});
        }
    }
    catch(error){
        res.status(400).json({error});
    }
});

//logout routing
app.get("/logout", function(req,res){
    req.logout(function(err){
        if(err) {
            return next(err);
        }
        res.redirect("/");
    });
});

//login validation
function isLogin(req,res,next){
    if(req.isAuthenticated()) return next(); 
    res.redirect("/login");
}

let port=process.env.port || 3000;
app.listen(port, function(){
    console.log("Server running at 3000");
});



