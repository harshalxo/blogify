var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Blog = require("./models/blog");
var Comment = require("./models/comment");

mongoose.connect("mongodb://localhost/blogify", { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

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

app.post("/blogs", function(req, res) {
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

app.get("/blogs/new", function(req, res) {
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
app.get("/blogs/:id/comments/new", function(req, res) {
	Blog.findById(req.params.id, function(err, foundBlog) {
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {blog: foundBlog});
		}
	});
});

app.post("/blogs/:id/comments", function(req, res) {
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

app.listen(3000, function() {
	console.log("Blogify server started!");
});