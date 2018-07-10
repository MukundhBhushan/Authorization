//packages
    express //routing
    bodyparser //parsing through urls

//todo(index.js):set up a basic express app 

//create a folder for auths
    //create a auth-router.js file ->auth routing handler

//in auth-router.js
    const router = require('express').Router()
    router.get('/<url of login strategy>',passport.authenticate('<stragy name (ie google,facebook)>', {
        //code to grab user info. more info line 82
    })
    //create seperate routes for each oAuth ie one for fb another of g+ etc

    //also create a rout for log out in this file

    module.exports=router;

//import auth-router.js in index.js
const authRoutes  = require('<filepath>')
app.use('/<url to use the mid-ware>',authRoutes )
//url->/auth/login 
//<url to use the mid-ware> -> '/auth'

//setting up passport

    //installing packages
        npm install passport --save
        npm install passport <strategy name> --save eg:- npm install passport passport-google-oauth20 --save

//create a new folder this folder contains all the passport config files

<-----to securely store the client id and secret---->

    //create a new file in the config folder keys.js
    //add this file to gitignore

        //in keys.js
            module.exports={
                <strategy name>:{
                    clientID:  "add your client ID here" ,
                    clientSecret: "add your client secret here",
                    callbackURL:"redirect url" //eg:- /auth/linkedin/redirect //this url to be given in the dev console too
                }
            }



<---------passport middleware---->
    //needs to be required in express app

    //create a new file in config folder (eg:- passport-setup.js)
    //in passport-setup.js

        const passport = require('passport');
        const <strategy name> = require('passport-<strategy name>').Strategy;
        const <psudo name> = require('keys file path')


        passport.use(

            new <strategy name>({

                clientID: <psudo name>.<strategy name>.clientID ,
                clientSecret: <psudo name>.<strategy name>.clientSecret
                callbackURL: <psudo name>.<strategy name>.callbackURL

            },
            <db name>:{
                dbURL:'<db connection string>'
            }
            
            (//args) => {   //more in the after login is completed section 

                // passport callback function 
                //function used after the login done

            })

        );

//after the above step 

//in the auth-router.js
    passport= require('passport')

    router.get('/<url for login strategy>', passport.authenticate('<stragy name (ie google,facebook)>', {

    scope: ['profile','email',....] //all the req field to be retrived after login in

    }));


    router.get('/<redirect url of login strategy>',passport.authenticate('<stragy name (ie google,facebook)>'),(req,res)=>{

        //user info and other info present in req
        req.<property name>
        
        res.redirect('/<url>')
    })
    //passport.authenticate middleware here fires the callback function before executing the response part


//passport middleware needs to be required in express app js file
    //in the express app    
        const passportSetup = require('file path of passport-setup.js')
        //the rest is handled by the authRoutes imported before


<-----------------after login is completed------------------------------------------->
//the callback function in the passport middleware is used now
//the code which is generated in the redirect url helps in obtainig user info

passport.use(

    new <strategy name>({

        clientID: <psudo name>.<strategy name>.clientID ,
        clientSecret: <psudo name>.<strategy name>.clientSecret
        callbackURL: <psudo name>.<strategy name>.callbackURL

    }, 
    (accessToken, refreshToken, profile, done) => {

        //profile contains all the details of the user singed in 
        //HERE CRUD operation are written

    })

);


<-----db for users------>
    //create a folder called models
    //create a file which has the user model
    
    <----mongo db----->
        <----in app.js----->
            require keys.js if not required
            const mongoose = require(keys.<dbname>.dbURL)
        <----in userModel.js------->
            const mongoose = require('mongoose');
            const Schema = mongoose.Schema

            const userSchema = new Schema({
                <para 1>:<data type>,
                <para 1>:<data type>,
                <para 1>:<data type> 
            })

            const User=mongoose.model('user',userSchema)
        
        <-------in passport-setup.js in the callback function------>
        <-----------stopping rep--------->
            const userModel = require('<file path of user model>')
            
            (accessToken, refreshToken, profile, done) => {

                User.findOne({<property name in db>:profile.<property in profile>}).then((currentUser)=>{
                    if(currentUser){
                        //code for done method is here check cookie section
                    }
                    else{
                        new User({
                            <para 1>:profile.<property>,
                            <para 1>:profile.<property>,
                            <para 1>:profile.<property>
                        }).save().then((newuser)=>{
                            console.log(newuser)
                            //code for done method is here check cookie section
                        })   
                    } 
                })
                    
                
    



            })
            

<------------------cookie-------------------->
    //use id generated by db 
    //first: serialize cookie, present as a passport function
    //second: deserializecookie, present as a passport function

    <----serialize----->
        //in the passport-setup.js
            passport.serializeUser((user,done)=>{
                done(null,user.<db generated ID>) //other paramaeters be passed make into object and pass as parameter
            })

        //code in line 159 and line 168 in passport-setup.js
            done(null,<current/new>User)
    
    <-------deserialize------>
        //in the passport-setup.js
            passport.deserializeUser((id,done)=>{
                User.findById(id).then((user)=>{  //User -> mongodb schema
                    done(null,user) 
                })
                
            })

<--------redirecting user based on auth-------->
//create new file in the routes for profile (profile-routes.js)
//set up an express router and use it in the express app file

//to create a router file (profile-routes.js)
    const router = require('express').Router()
    const authCheck = (req,res,next)=>{
        if(!req.user){
            res.rediret('/<login url>')
        }
        else{
            next()
        }
    }
    router.get('/<url>',authCheck,(req,res)=>{
        //send, render etc here
    })
    module.exports=router;

//in express app (index.js)
    const loginRoutes = require('<file path>')
    app.use('/login',loginRoutes)


<-------------LOG OUT------------>
//in the auth-router.js
    router.get('/logout',(req,res)=>{
        req.logout();  //logout is the function to be called not a custom function
        res.redirect('/<url to redirect to>')
    })
