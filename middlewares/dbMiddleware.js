const oracledb = require('oracledb');

const config = {
    user: 'SYS',
    password: 'nustiu3396',
    connectString: 'localhost:1521/FREEPDB1',
    privilege: oracledb.SYSDBA,
};

async function dbMiddleware(req, res, next) {
    let connection;

    try {
        connection = await oracledb.getConnection(config);
        req.db = connection;
        next();
    } catch (err) {
        console.error('Eroare la obținerea conexiunii:', err);
        res.status(500).send('Eroare la conectarea la baza de date.');
    } finally {
        res.on('finish', async () => {
            if (connection) {
                try {
                    await connection.close();
                    console.log('conexiune inchisa');
                } catch (err) {
                    console.error('Eroare la închiderea conexiunii:', err);
                }
            }
        });
    }
}

module.exports = dbMiddleware;
