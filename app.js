const express =require('express');
// express app
const app = express();
const bodyParser = require("body-parser"); 
app.use(bodyParser.json());
//morgan middleware
const morgan= require('morgan')
// register view engine
app.set('view engine', 'ejs');
//static files
app.use(express.static('public'));
// importing scgema and model module
const blog= require('./modules/blog');
// moongose
const mongoose=require('mongoose');
const Blog = require('./modules/blog.js');
//connect to mongo db
const dbUrl='mongodb+srv://Kamaa:Kamaa254@cluster0.5lsu4zs.mongodb.net/node?retryWrites=true&w=majority'
mongoose.connect(dbUrl)
.then((result) =>app.listen(3000))
// .then(console.log('The db connection was successful'))
.catch((err) =>console.log(err))
// listning for requests

// mildware
app.use(express.urlencoded({extended:true}))
// app.use((req,res, next) =>{
//     console.log('new request has been made');
//     console.log('host', req.hostname);
//     console.log('path',req.path);
//     console.log('method:', req.method);  
//     next();
// })

app.use(morgan('dev'))
// save a blog/data
app.get('/add-blog',(req,res)=>{
    const blog= new Blog({
        title:"A new blog 3",
        snipet:"about the new blog",
        body:'more about the new blog'
    })

    blog.save()
    .then((result)=>{
        res.send(result)
    })
    .catch((err)=> console.log(err))

})
// retrive data
app.get('/all-blog',(req,res)=>{
    Blog.find()
    .then((result)=>{
        res.send(result);
    })
    .catch((err) => {console.log(err)});
})
// retrive a single record
app.get('/single-record', (req,res)=>{
    Blog.findById('6419a356509bf35b728ac6d0')
    .then((result)=>{
        res.send(result);
    })
    .catch((err) => {console.log(err)});
})
// respond
app.get('/',(req,res) =>{

    
// res.send('<p>This is the first paragraph in an express app</p>');
// res.sendFile('.views//index.html',{root:__dirname});
// const blogs= [
//     {Tittle:'Azimio Maandamano', Snippet:'Azzimio are planning a Maadamano on Monday 20th 2023 protesting aganist several issues'},
//     {Tittle:'Maadamano', Snippet:'Azzimio are planning a Maadamano on Monday 20th 2023 protesting aganist several issues'},
//     {Tittle:'Murder', Snippet:'Azzimio are planning a Maadamano on Monday 20th 2023 protesting aganist several issues'},
//     {Tittle:'MUST strikes again', Snippet:'Azzimio are planning a Maadamano on Monday 20th 2023 protesting aganist several issues'},
//     {Tittle:'Court rukes on', Snippet:'Azzimio are planning a Maadamano on Monday 20th 2023 protesting aganist several issues'},
//     {Tittle:'Azimio Maandamano', Snippet:'Azzimio are planning a Maadamano on Monday 20th 2023 protesting aganist several issues'},
//     {Tittle:'Azimio Maandamano', Snippet:'Azzimio are planning a Maadamano on Monday 20th 2023 protesting aganist several issues'},
//     {Tittle:'Azimio Maandamano', Snippet:'Azzimio are planning a Maadamano on Monday 20th 2023 protesting aganist several issues'},
//      ];
    //  if(blogs.length>0){
    //     blogs.forEach(blog=>{
    //        console.log( blog.Tittle)
    //        console.log( blog.Snippet)
    //     })
    //  }
    //  console.log(blogs)
    //  console.log(blogs.length)
// res.render('index',{title:'Home',blogs})
res.redirect('/blogs');
})
app.get('/blogs',(req,res)=>{
    Blog.find().sort({createdAt: -1})
    .then((result)=>{
         res.render('index',{title:'Home', result:result})
       
    })
    .catch((err) => {console.log(err)});
})
app.get('/about',(req,res) =>{
    // res.send('<p>This is the Second page in an express app</p>');
    // res.sendFile('.views//about.html',{root:__dirname});
  
    res.render('about',{About:'About'})
    })
    app.get('/create' ,(req,res)=>{
        res.render('create',{create:'Create a Blog'})
    })
// redirect
// app.get('./views/about-us', (req,res)=>{
//     res.redirect('/about');
// })
// POST
app.post('/blogs',(req,res)=>{
    // console.log(req.body)
    const blog = new Blog(req.body);
    blog.save()
    .then((result)=>{
        res.redirect('/blogs')
    })
    .catch((err)=> console.log(err));
})


app.get('/blogs/:id',(req,res)=>{
    const id= req.params.id;
    Blog.findById(id)
    .then((result)=>{
        res.render('details',{title:'Blog details', results:result})
    })
    .catch(err =>{
        console.log(err)
    })

})

app.delete('/blogs/:id',(req,res)=>{
    const id= req.params.id;
    Blog.findByIdAndDelete(id)
    .then((result)=>{
        res.json({redirect:'/blogs'})
    })
    .catch(err =>{
        console.log(err)
    })

})

// 404 error
app.use((req,res)=>{
    // res.sendFile('./views/404.html',{root:__dirname})
    res.status(404).render('404')
})

