A task managaer

This is a task management system application.

Use npm init to initialize the node(CMS) application

make it a git repository by using the command "git init"

install neccessary packages like express;

Recommend: use the command "npm install" to pull all the required dependencies

create an entry point called "index.js"

create gitignore so as not to push the node_modules and env file

spin up the server using nodejs frame work (express)


// How to use API endpoint

 app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message:"welcome to my server"
    })
 })