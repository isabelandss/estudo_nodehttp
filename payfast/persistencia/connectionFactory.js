var mysql = require("mysql");

function createDBConnection() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'teste',
        database: 'isabela'
    });
};

module.exports = function() {
    return createDBConnection;
}
