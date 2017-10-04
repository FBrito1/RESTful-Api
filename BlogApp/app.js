// Setup Inicial
var express          = require("express"),
    app              = express(),
    expressSanitizer = require("express-sanitizer"),
    methodOverride   = require("method-override"),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose");
    
mongoose.connect("mongodb://localhost/restful_blog_app", {useMongoClient: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// Setup DB
var blogSchema = new mongoose.Schema ({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);


//RestFull Routes
// Index - GET
app.get("/", function(req, res) {
    res.redirect("/blogs");
})

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!");
        } else {
            res.render("index", {blogs: blogs});
        }
    });
   
});

//New ROute
app.get("/blogs/new", function(req, res) {
   res.render("new"); 
});

// Create Route
app.post("/blogs", function(req, res){
    //create blog
    req.body.blog.body = req.sanitizer(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
             // then redirect to the index
            res.redirect("/blogs");
        }
    });
   
    
});

//Show Route
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
       } else {
           res.render("show", {blog: foundBlog});
       }
    });
});

// EDit ROute
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs")
       } else {
           res.render("edit", {blog: foundBlog}); 
       }
    });
   
});

// UPdate ROute
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitizer(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, uptadedBlog){
       if(err){
         res.redirect("/blogs");  
       } else {
           res.redirect("/blogs/" + req.params.id);
       }
   });
});
// Delete ROute
app.delete("/blogs/:id", function(req, res){
    // Destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
    // redirect somewere
});

// Server

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server has starded"); 
});