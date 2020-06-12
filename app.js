var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var Blog = require("./models/blog");
var Comment = require("./models/comment");
var User = require("./models/user");

mongoose.connect("mongodb://localhost/blogify", { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// passport configuration
app.use(require("express-session")({
	secret: "dating is bs",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

app.get("/", function(req, res) {
	res.render("landing");
});

// blogs
app.get("/blogs", function(req, res) {
	Blog.find({}, function(err, allBlogs) {
		if(err) {
			console.log(err);
		} else {
			res.render("blogs/index", {blogs: allBlogs});		
		}
	});
});

app.post("/blogs", isLoggedIn, function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newBlog = {name: name, image: image, description: description};
	Blog.create(newBlog, function(err, newBlog) {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/blogs");		
		}
	});
});

app.get("/blogs/new", isLoggedIn, function(req, res) {
	res.render("blogs/new");
});

app.get("/blogs/:id", function(req, res) {
	Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog) {
		if(err) {
			console.log(err);
		} else {
			Blog.find({}, function(err, allBlogs) {
				if(err) {
					console.log(err);
				} else {
					res.render("blogs/show", {blog: foundBlog, blogs: allBlogs});		
				}
			});
		}
	});
});

// comments
app.get("/blogs/:id/comments/new", isLoggedIn, function(req, res) {
	Blog.findById(req.params.id, function(err, foundBlog) {
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {blog: foundBlog});
		}
	});
});

app.post("/blogs/:id/comments", isLoggedIn, function(req, res) {
	Blog.findById(req.params.id, function(err, foundBlog) {
		if(err) {
			console.log(err);
			res.redirect("/blogs");
		} else {
			Comment.create(req.body.comment, function(err, newComment) {
				if(err) {
					console.log(err);
				} else {
					foundBlog.comments.push(newComment);
					foundBlog.save();
					res.redirect("/blogs/" + foundBlog._id);
				}
			});
		}
	});
});

// auth routes
app.get("/register", function(req, res) {
	res.render("register");
});
app.post("/register", function(req, res) {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user) {
		if(err) {
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function() {
			res.redirect("/blogs");
		});
	});
});

app.get("/login", function(req, res) {
	res.render("login");
});
app.post("/login", passport.authenticate("local", {
	successRedirect: "/blogs",
	failureRedirect: "/login"
}), function(req, res) {});

app.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/blogs");
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

app.listen(3000, function() {
	console.log("Blogify server started!");
});