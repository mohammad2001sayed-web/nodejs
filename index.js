const http = require('node:http');

const fs = require('node:fs');
const { json } = require('node:stream/consumers');

const server  = http.createServer((req, res) => {
try {
    console.log(req.url,  req.method);

  const {method, url} = req;

  if (url == "/users" && method == "GET") {
    const users = JSON.parse(fs.readFileSync("data.json")); 
    console.log(users);
    
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(users));
    res.end();
    
  }else if (  url == "/users" && method == "POST") {
    let data;
req.on('data', (chunk)=>{
  data = JSON.parse(chunk);

})
req.on('end', ()=>{
 const {name, age,email} = data;
 const users = JSON.parse(fs.readFileSync("data.json"));
 const isUser = users.find(user => user.email == email);
 if (isUser) {
    res.statusCode = 403;
   return res.end(`email ${email}  already exists`);
 }
 //add user
 const newUser = {
    id: users.length + 1,
    name,
    age,
    email,
    isStudent: true
 }
 users.push(newUser);
 fs.writeFileSync("data.json", JSON.stringify(users));
//response
 res.statusCode = 201;
 res.write(`user created successfully`);
 res.end();
})
  }

  else if (url == "/users" && method == "PUT") {
    let data;
req.on('data', (chunk)=>{
  data = JSON.parse(chunk);

})
req.on('end',()=>{
  const {name, age,email, id,isStudent} = data;
  if (!id) {
    res.statusCode = 403;
    return res.end("id is required");
    
  }
  const users = JSON.parse(fs.readFileSync('data.json'));
  const userIndex = users.findIndex(user => user.id == id);
  if (userIndex < 0) {
  res.statusCode = 404;
  return res.end('user not found');
}

  if(name) users[userIndex].name = name
  if(age) users[userIndex].age = age
  if (isStudent !== undefined) users[userIndex].isStudent = isStudent;
  if(email) {
    const isUser = users.find(user => user.email == email);
    if (isUser) {
       res.statusCode = 403;
      return res.end(`email ${email}  already exists`);
    }
    users[userIndex].email = email;

  }
  fs.writeFileSync("data.json", JSON.stringify(users));
  res.statusCode = 200;
  res.write(`user updated successfully`);
  res.end();
  
})
    
  }













  else {
    res.statusCode = 404;
    res.write("not found 404");
    res.write("not found 404");
    res.end();
  }

} catch (error) {
    console.log(error,"eeeeeeeeeeeeee");
    res.statusCode = 500;
    res.write("not found 500");
    res.write("not found 500");
    res.end();
  
}  
    
});
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});