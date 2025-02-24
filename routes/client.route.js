const express = require('express');
const resultMiddleware = require('../middlewares/resultMiddleware');
const router = express.Router();

router.get('/client', async (req, res) => {
    try {
        const result = await req.db.execute('SELECT * FROM PROIECT_BD.CLIENT');
        const clientList = resultMiddleware(result);
        res.render('client', { clientList });
    } catch (error) {
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

router.get('/client/add', (req, res) => {
    res.render('add-client');
});

router.get('/client/edit/:id', async (req, res) => {
    try {
        const result = await req.db.execute(
            'SELECT * FROM PROIECT_BD.CLIENT WHERE CLIENT_ID = :id',
            [req.params.id]
        );
        const client = resultMiddleware(result);
        res.status(200).render('edit-client', { client });
    } catch (error) {
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

router.post('/client', async (req, res) => {
    try {
        const result = await req.db.execute(
            `INSERT INTO PROIECT_BD.CLIENT (NUME, DESCRIERE, TIP_CLIENT, NR_TELEFON, EMAIL, JUDET, ORAS)
            VALUES (:NUME, :DESCRIERE, :TIP_CLIENT, :NR_TELEFON, :EMAIL, :JUDET, :ORAS)`,
            [
                req.body.NUME,
                req.body.DESCRIERE,
                req.body.TIP_CLIENT,
                req.body.NR_TELEFON,
                req.body.EMAIL,
                req.body.JUDET,
                req.body.ORAS,
            ]
        );
        await req.db.execute('COMMIT');
        res.status(201).redirect('/client');
    } catch (error) {
        await req.db.execute('ROLLBACK');
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

router.put('/client/:id', async (req, res) => {
    try {
        const result = await req.db.execute(
            `UPDATE PROIECT_BD.CLIENT SET NUME = :NUME, DESCRIERE = :DESCRIERE, TIP_CLIENT = :TIP_CLIENT, 
            NR_TELEFON = :NR_TELEFON, EMAIL = :EMAIL, JUDET = :JUDET, ORAS = :ORAS WHERE CLIENT_ID = :id`,
            [
                req.body.NUME,
                req.body.DESCRIERE,
                req.body.TIP_CLIENT,
                req.body.NR_TELEFON,
                req.body.EMAIL,
                req.body.JUDET,
                req.body.ORAS,
                req.params.id,
            ]
        );
        await req.db.execute('COMMIT');
        res.status(200).redirect('/client');
    } catch (error) {
        await req.db.execute('ROLLBACK');
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

router.delete('/client/:id', async (req, res) => {
    try {
        const result = await req.db.execute(
            'DELETE FROM PROIECT_BD.CLIENT WHERE CLIENT_ID = :id',
            [req.params.id]
        );
        await req.db.execute('COMMIT');
        res.status(200).redirect('/client');
    } catch (error) {
        await req.db.execute('ROLLBACK');
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

module.exports = router;
