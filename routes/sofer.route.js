const express = require('express');
const resultMiddleware = require('../middlewares/resultMiddleware');
const router = express.Router();

router.get('/sofer', async (req, res) => {
    try {
        const result = await req.db.execute('SELECT * FROM PROIECT_BD.SOFER');
        const soferList = resultMiddleware(result);
        res.render('sofer', { soferList });
    } catch (error) {
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

router.get('/sofer/add', (req, res) => {
    res.render('add-sofer');
});

router.get('/sofer/edit/:id', async (req, res) => {
    try {
        const result = await req.db.execute(
            'SELECT * FROM PROIECT_BD.SOFER WHERE SOFER_ID = :id',
            [req.params.id]
        );
        const sofer = resultMiddleware(result);
        res.status(200).render('edit-sofer', { sofer });
    } catch (error) {
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

router.post('/sofer', async (req, res) => {
    try {
        const result = await req.db.execute(
            `INSERT INTO PROIECT_BD.SOFER (NUME, PRENUME, DATA_NASTERE, DATA_ANGAJARE, SALARIU)
            VALUES (:NUME, :PRENUME, TO_DATE(:DATA_NASTERE, 'YYYY-MM-DD'), TO_DATE(:DATA_ANGAJARE, 'YYYY-MM-DD'), :SALARIU)`,
            [
                req.body.NUME,
                req.body.PRENUME,
                req.body.DATA_NASTERE,
                req.body.DATA_ANGAJARE,
                req.body.SALARIU,
            ]
        );
        await req.db.execute('COMMIT');
        res.status(201).redirect('/sofer');
    } catch (error) {
        await req.db.execute('ROLLBACK');
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

router.put('/sofer/:id', async (req, res) => {
    try {
        const result = await req.db.execute(
            `UPDATE PROIECT_BD.SOFER SET NUME = :NUME, PRENUME = :PRENUME, DATA_NASTERE = TO_DATE(:DATA_NASTERE, 'YYYY-MM-DD'), 
            DATA_ANGAJARE = TO_DATE(:DATA_ANGAJARE, 'YYYY-MM-DD'), SALARIU = :SALARIU WHERE SOFER_ID = :id`,
            [
                req.body.NUME,
                req.body.PRENUME,
                req.body.DATA_NASTERE,
                req.body.DATA_ANGAJARE,
                req.body.SALARIU,
                req.params.id,
            ]
        );
        await req.db.execute('COMMIT');
        res.status(200).redirect('/sofer');
    } catch (error) {
        await req.db.execute('ROLLBACK');
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

router.delete('/sofer/:id', async (req, res) => {
    try {
        const result = await req.db.execute(
            'DELETE FROM PROIECT_BD.SOFER WHERE SOFER_ID = :id',
            [req.params.id]
        );
        await req.db.execute('COMMIT');
        res.status(200).redirect('/sofer');
    } catch (error) {
        await req.db.execute('ROLLBACK');
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

module.exports = router;
