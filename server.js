const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto1 = require('crypto');
const path = require('path');
const app = express();
const port = process.env.PORT || 8081;





app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/static', express.static(path.join(__dirname, 'static')));

const hash=crypto1.getHashes();

const db = mysql.createConnection({
    host: 'student.veleri.hr',
    user: 'lcelcner',
    password: '11',
    database: 'lcelcner',
});

db.connect((err) => {
    try {
        if (err) throw err;
        console.log('Povezano s bazom');
    } catch (error) {
        console.error(error);
    }
});

app.post('/', async (req,res) => {
    try {
        const data = req.body;
        const sol=crypto1.randomBytes(16).toString('hex');
        const hashpsw=crypto1.createHash('sha1').update(data.passw+sol).digest('hex');
        const sql = 'INSERT INTO podaci(ime, prezime, sol, lozinka, email) VALUES (?, ?, ?, ?, ?)';
        
        const values = [data.FirstName, data.LastName, sol ,hashpsw, data.email, data.IdentificationNumber];  

        db.query(sql,values, (err,result) =>{
            if(err) throw err;
            
        });

       
    } catch (error) {
        console.error('Error inserting data into MySQL:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});


app.post('/check-email', (req, res) => {
    const email = req.body.email;
    const sql = 'SELECT * FROM podaci WHERE email = ?';

    db.query(sql, [email], (err, result) => {
        if (err) {
            console.error('Error checking email in MySQL:', err);
            return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }

        if (result.length > 0) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    });
});




app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index1.html'));
});    



app.listen(port, () =>{
    console.log(`port je pokrenut na ${port}`);
})

//http://127.0.0.1:8081/index1.html