const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const { log } = require('console');
const app = express();
const mysql = require('mysql2');


app.locals.data = {
    'nbrplace': ''
};



    const connection=mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        database:'flight_management'
    });
     
    connection.connect(function(error){
        if(!!error) console.log(error);
        else console.log('Database Connected!');
    }); 

    app.set('views',path.join(__dirname,'views'));
    app.use(express.static(__dirname + '/public'));
    
    app.set('view engine', 'ejs');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    
    app.use(express.urlencoded({
        extended: false
    }));
    app.get('/', (req, res) => {
         
        

        let sql = "SELECT * FROM vol ";
        let query = connection.query(sql, (err, rows) => {
            if(err) throw err;
            res.render('index',{rows});
        });
        
    });

    /* app.post('/volsValable', (req,res)=> {

        let sql = "SELECT * FROM vol , escale ";
        let query = connection.query(sql, (err, rows) => {
            if(err) throw err;
            res.render('inde', {rows});
        });
    }); */

    app.post('/volsf', (req,res)=> {

         req.app.locals.data.nbrplace = req.body.nbrp;

        
         let sql = "SELECT * , escale.descrption FROM vol , escale WHERE villeDepart = '"+req.body.depart+"' and villeArrivee = '"+req.body.destination+"'   and heurDepart = '"+req.body.heurdepart+"' and  vol.idescale = escale.id_esc ";
        // let sql = `SELECT * , escale.descrption FROM vol , escale WHERE villeDepart= '${req.body.depart}' and vol.idescale = escale.id` ;

        let query = connection.query(sql, (err, rows) => {
            if(err) {throw err;}else{
                console.log(rows)
                res.render('flights', {rows:rows});

            }
        });
    });



    app.post('/save', (req, res) => {
        let data = {nom: req.body.nom, prenom: req.body.prenom, phone: req.body.phone, email: req.body.email,};
        const nbr_place = req.app.locals.data.nbrplace ;
        let sql = "INSERT INTO user SET ?";
        let query = connection.query(sql, data, (err, results) => {
            if(err) {
                throw err;
            } else{
                console.log('user good')
                let sqll = 'SELECT * FROM user ORDER BY id DESC LIMIT 1';
                 connection.query(sqll, data, (err, results) => {
                    if(err) {
                        throw err;
                    } else{
                        const id_user=results[0].id;                 
                        console.log(id_user);
                        
                        let data = {idUser: id_user, idVol: req.body.idvol, idExtra: 1, nbrPlace: nbr_place};
                        let sqlll = "INSERT INTO reservation SET ?";
                         connection.query(sqlll, data, (err, results) =>{

                            if(err) {
                                throw err;
                            } else{
                                console.log('helloooreserv');
                                res.render('reserv');

                            }


                        })

                    }
        
                });
            }

        });
    });






    /* app.post('/book/:idvol', (req,res)=> {



        
        let sql = "SELECT * , escale.descrption FROM vol , escale WHERE villeDepart = '"+req.body.depart+"' and villeArrivee = '"+req.body.destination+"'   and heurDepart = '"+req.body.heurdepart+"' and  vol.idescale = escale.id ";
       // let sql = `SELECT * , escale.descrption FROM vol , escale WHERE villeDepart= ${req.body.depart} and vol.idescale = escale.id` ;

       let query = connection.query(sql, (err, rows) => {
           if(err) throw err;
           res.render('flights', {rows});
       });
   }); */





    


// app.get('/', (req,res)=> {
//     let sql = "SELECT * FROM vol";
//     let query = connection.query(sql, (err, rows) => {
//         if(err) throw err;
//         res.render('index', {
//             title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
//             users : rows
//         });
//     });
// }); 

app.listen(3000, () => {
    console.log('hello');
});