'user strict';

var mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'senslope',
    database: 'consult_app_secure'
});

let consult_db = {};

consult_db.all = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM user_accounts`, (err, res) => {
            if (err) {
                return reject(err)
            }
            return resolve(res);
        })
    })
}

consult_db.oneByUsername = (username) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM user_accounts WHERE username = ?', [username], (err, res) => {
            if (err) {
                return reject(err)
            }
            return resolve(res[0]);
        })
    })
}

consult_db.createUser = ({ username, name, password }) => {
    return new Promise((resolve, reject) => {
        const set = {
            query: 'INSERT INTO user_accounts (username, name) VALUES (?, ?)',
            values: [username, name]
        }
        const set2 = {
            query: 'INSERT INTO user_accounts (username, name, password) VALUES (?, ?, ?)',
            values: [username, name, password]
        }
        const dataSet = password === "" ? set : set2
        console.log("dataSet", dataSet);
        pool.query(dataSet.query, dataSet.values, (err, res) => {
            if (err) {
                return reject(err)
            }
            return resolve(res)
        })
    })
}

module.exports = consult_db;