const ojp = require("ojparty")
const app = ojp.ojparty.app();
const con = {
    user:"root",
    password:"",
    host:"localhost",
    database:"chat"
}
app.settings({
    serveStatic:true,
    hideFiles:['server.js']
})
app.get("/",(req,res)=>{
    if(req.session['user_id'] == undefined){
      res.setHeader('location','/signin');
      res.statusCode = 301;
      res.end()
    }
    res.ojp('src/chat.html')
    res.end()
});

app.get("/signin",(req,res)=>{
   res.ojp('src/signin.html')
    res.end()
});

app.get("/signup",(req,res)=>{
    res.ojp('src/signup.html')
    res.end()
});

app.post("/signup",async (req,res)=>{
    var out = {
        status:"",
        errors:[],
        redirect:""
    };
    const {username,email,password,ref} = req.body;
     try{
       var query = 'SELECT email FROM  `users` WHERE email=?';
       var result = await req.sql(con,query,[email])
     if(result.length > 0){
        out.status = "error"
        out.errors.push("Email already existing!");
     }
    }catch(e){
        out.status = "error";
        out.errors.push(e.toString())
        res.end(e.toString())
    }
   
if(out.errors.length < 1){
    try{
        var query = 'INSERT INTO `users`( `name`, `email`, `password`, `api_key`, `date`) VALUES (?,?,?,?,?)';
        const api_key = ojp.ojparty.utill.random("mix",28);
      
      await req.sql(con,query,[username,email,password,api_key,new Date().getTime()])
      req.setSession('user_id',api_key)
      out.status = "success"
      out.redirect = "./"
      res.send(JSON.stringify(out))
       
    }catch(e){
        out.status = "error";
        out.errors.push(e.toString())
        res.end(e.toString())
    }
}else{
    res.send(JSON.stringify(out))
}


     
 });



app.listen(2090)