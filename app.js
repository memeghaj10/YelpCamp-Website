var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var flash=require("connect-flash");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var methodOverride=require("method-override");
var Campground=require("./models/campground");
var Comment=require("./models/comment");
var User=require("./models/user");
var seedDB=require("./seeds");


var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")


//mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true});
mongoose.connect("mongodb+srv://yelpcamp:yelpcamp@yelpcamp-oueaa.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
seedDB();

app.use(require("express-session")({
	secret:"Dyabala with Messi is the best!",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   res.locals.currentUser = req.user;
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT||3000, function() {
	console.log("YelpCamp has started");
});