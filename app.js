var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var blogs = [
	{
		name: "Life Tips", image: "https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus lacus dui, lacinia at nunc in, malesuada pharetra risus. Donec ante mauris, vehicula quis leo vulputate, porta auctor mauris. Fusce at condimentum ante, eu fringilla lorem. Nullam luctus purus hendrerit enim finibus semper sit amet id nunc. Phasellus ligula ipsum, cursus at ultricies quis, posuere non purus. Aliquam erat volutpat. Praesent dapibus sagittis sapien nec accumsan. Nullam eros tortor, fermentum sit amet purus eget, dapibus aliquet nulla. Nam ut ullamcorper turpis, quis facilisis ipsum."
	},
	{
		name: "The Typewriter", image: "https://images.unsplash.com/reserve/LJIZlzHgQ7WPSh5KVTCB_Typewriter.jpg?ixlib=rb-1.2.1&auto=format&fit=crop&w=641&q=80", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus lacus dui, lacinia at nunc in, malesuada pharetra risus. Donec ante mauris, vehicula quis leo vulputate, porta auctor mauris. Fusce at condimentum ante, eu fringilla lorem. Nullam luctus purus hendrerit enim finibus semper sit amet id nunc. Phasellus ligula ipsum, cursus at ultricies quis, posuere non purus. Aliquam erat volutpat. Praesent dapibus sagittis sapien nec accumsan. Nullam eros tortor, fermentum sit amet purus eget, dapibus aliquet nulla. Nam ut ullamcorper turpis, quis facilisis ipsum."
	},
	{
		name: "Gratefulness", image: "https://images.unsplash.com/photo-1501747315-124a0eaca060?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus lacus dui, lacinia at nunc in, malesuada pharetra risus. Donec ante mauris, vehicula quis leo vulputate, porta auctor mauris. Fusce at condimentum ante, eu fringilla lorem. Nullam luctus purus hendrerit enim finibus semper sit amet id nunc. Phasellus ligula ipsum, cursus at ultricies quis, posuere non purus. Aliquam erat volutpat. Praesent dapibus sagittis sapien nec accumsan. Nullam eros tortor, fermentum sit amet purus eget, dapibus aliquet nulla. Nam ut ullamcorper turpis, quis facilisis ipsum."
	}];

app.get("/", function(req, res) {
	res.render("landing");
});

app.get("/blogs", function(req, res) {
	res.render("blogs", {blogs: blogs});
});

app.post("/blogs", function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newBlog = {name: name, image: image, description: description};
	blogs.push(newBlog);
	res.redirect("/blogs");
});

app.get("/blogs/new", function(req, res) {
	res.render("new");
});

app.listen(3000, function() {
	console.log("Blogify server started!");
});