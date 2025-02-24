const express = require('express');
const resultMiddleware = require('../middlewares/resultMiddleware');
const router = express.Router();

router.get('/cursa_client', async (req, res) => {
    try {
        const result = await req.db.execute(
            'SELECT * FROM PROIECT_BD.CLIENT_CURSA'
        );
        const clientCursaList = resultMiddleware(result);
        res.status(200).render('cursa-client', { clientCursaList });
    } catch (error) {
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

router.get('/cursa_client/:id', async (req, res) => {
    try {
        const result = await req.db.execute(
            'SELECT * FROM PROIECT_BD.CLIENT_CURSA WHERE CLIENT_ID = :id',
            [req.params.id]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

router.post('/cursa_client', async (req, res) => {
    try {
        const result = await req.db.execute(
            `INSERT INTO PROIECT_BD.CLIENT_CURSA (CLIENT_ID, CURSA_ID) VALUES (:CLIENT_ID, :CURSA_ID)`,
            [req.body.CLIENT_ID, req.body.CURSA_ID]
        );
        await req.db.execute('COMMIT');
        res.status(201).send('Inserare reușită.');
    } catch (error) {
        await req.db.execute('ROLLBACK');
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

router.delete('/cursa_client/:id', async (req, res) => {
    try {
        const result = await req.db.execute(
            'DELETE FROM PROIECT_BD.CLIENT_CURSA WHERE CLIENT_ID = :id',
            [req.params.id]
        );
        await req.db.execute('COMMIT');
        res.status(200).send('Ștergere reușită.');
    } catch (error) {
        await req.db.execute('ROLLBACK');
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

module.exports = router;
