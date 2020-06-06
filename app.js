var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/blogify", { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// schema setup
var blogSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});
var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req, res) {
	res.render("landing");
});

app.get("/blogs", function(req, res) {
	Blog.find({}, function(err, allBlogs) {
		if(err) {
			console.log(err);
		} else {
			res.render("index", {blogs: allBlogs});		
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
	res.render("new");
});

app.get("/blogs/:id", function(req, res) {
	Blog.findById(req.params.id, function(err, foundBlog) {
		if(err) {
			console.log(err);
		} else {
			res.render("show", {blogs: foundBlog});
		}
	});
});

app.listen(3000, function() {
	console.log("Blogify server started!");
});