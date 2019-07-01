var express = require('express');
var app = express();
var port = 3000;

bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var jwt = require('jsonwebtoken');
var expressjwt = require('express-jwt');

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'chatapp'
});

connection.connect();

app.post('/login',function(req,res){
    var email = req.body.email;
    var password = req.body.password;     
    connection.query(`SELECT * FROM user WHERE email = '${email}' AND password = '${password}'`,async function(err,results){
        if(!results.length){
            res.send({'message':'email atau password anda salah'})
        } else {
            jwt.sign({results}, 'aku',  function(err, token) {
                res.send({token: token})
            });
        }

    })
     
})

app.get('/chats',function(req,res){
    connection.query('SELECT * FROM chat', function (error, results) {
        if (results) {
            res.send(results)
        } else {
            res.send(error)
        }
    });
     
})

app.post('/chats', expressjwt({secret: 'aku'}),function(req,res){

    var id_user = req.body.id_user;
    var messageText = req.body.messageText;
    var date = req.body.date;

    connection.query(`INSERT INTO chat (id_user, textMessage, date) VALUES ('${id_user}','${messageText}','${date}')`,
    function(error,results,fields){
        if(error){
            console.log(error)
        } else{
            res.send("berhasil menambahkan chat baru!")
        }
    })
     
})

app.delete('/chats/:idChat',expressjwt({secret: 'aku'}),function(req,res){
    var idChat = req.params.idChat;

    connection.query(`DELETE FROM chat WHERE id_chat = ${idChat}`,
    function(error,results,fields){
        if(error){
            console.log(error)
        } else {
            res.send("Chat berhasil dihapus")
        }
    }
    )
     
})

app.get('/users',expressjwt({secret: 'aku'}),function(req,res){
    connection.query('SELECT * FROM user', function (error, results) {
        res.send(results)
    });
    
     
})

app.get('/users/:id',expressjwt({secret: 'aku'}),function(req,res){
    var id = req.params.id
    connection.query(`SELECT * FROM user WHERE id_user = ${id}`, function (error, results, fields) {
        res.send(results)
    });
     
})

app.post('/users', expressjwt({secret: 'aku'}),function(req,res){

    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    connection.query(`INSERT INTO user (username, email, password) VALUES ('${username}','${email}','${password}')`,
    function(error,results,fields){
        if(error){
            console.log(error)
        } else{
            res.send("berhasil menambahkan user")
        }
    })
     
})

app.delete('/users/:id',expressjwt({secret: 'aku'}),function(req,res){
    var id = req.params.id;

    connection.query(`DELETE FROM user WHERE id_user = ${id}`,
    function(error,results,fields){
        if(error){
            console.log(error)
        } else {
            res.send("user berhasil dihapus")
        }
    })
     
})

// app.put('/users',function(req,res){
    
//     var username = req.body.username;
//     var email = req.body.email;
//     var password =req.body.password;
//     var id_user = req.body.id_user;
    
//     connection.query(`UPDATE user SET username = '${username}', email = '${email}',password = '${password}' WHERE id_user = '${id_user}'`, 
//     function (error, rows, fields){
//         if(error){
//             console.log(error)
//         } else{
//             response.ok("Berhasil merubah user!")
//         }
//     });

// })


app.listen(port,function(){
    console.log(`server running ${port}`)
})

