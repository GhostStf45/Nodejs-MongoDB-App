const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/User');

//use passport library to verify user principal fields (email and passport)
passport.use(new LocalStrategy ({
    usernameField: 'email'

},  async (email, password, done)=>{
    const user = await User.findOne({email: email});
    
    //validate user if or not exist
    if(!user){
        return done(null, false, {message: 'Not User Found.'});
    }else{
        const match = await user.matchPassword(password);

        if(match){
            return done(null, user);
        }else{
            return done(null, false, {message: 'Incorrect password'});
        }
    }
}));
//Store in  user session
passport.serializeUser((user, done)=>{
    
    done(null, user.id);
});
//Verify user id
passport.deserializeUser((id, done)=>{
    User.findById(id, (err, user) =>{
        done(err, user);
    });
});


