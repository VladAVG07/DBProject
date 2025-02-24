const express = require('express');
const resultMiddleware = require('../middlewares/resultMiddleware');
const router = express.Router();

router.get('/alimentare', async (req, res) => {
    try {
        const result = await req.db.execute(
            'SELECT * FROM PROIECT_BD.ALIMENTARE'
        );
        const alimentareList = resultMiddleware(result);
        console.log(alimentareList);
        res.status(200).render('alimentare', { alimentareList });
    } catch (error) {
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

router.get('/alimentare/:id', async (req, res) => {
    try {
        const result = await req.db.execute(
            'SELECT * FROM PROIECT_BD.ALIMENTARE WHERE ALIMENTARE_ID = :id',
            [req.params.id]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

router.post('/alimentare', async (req, res) => {
    try {
        const result = await req.db.execute(
            `INSERT INTO PROIECT_BD.ALIMENTARE (VEHICUL_ID, LOC_ALIMENTARE, TIP_COMBUSTIBIL, CANTIATE_COMBUSTIBIL, 
            DATA_ORA_ALIMENTARE, COST_DAUNE, BENZINARIE)
            VALUES (:VEHICUL_ID, :LOC_ALIMENTARE, :TIP_COMBUSTIBIL, :CANTIATE_COMBUSTIBIL, :DATA_ORA_ALIMENTARE, 
            :COST_DAUNE, :BENZINARIE)`,
            [
                req.body.VEHICUL_ID,
                req.body.LOC_ALIMENTARE,
                req.body.TIP_COMBUSTIBIL,
                req.body.CANTIATE_COMBUSTIBIL,
                req.body.DATA_ORA_ALIMENTARE,
                req.body.COST_DAUNE,
                req.body.BENZINARIE,
            ]
        );
        await req.db.execute('COMMIT');
        res.status(201).send('Inserare reușită.');
    } catch (error) {
        await req.db.execute('ROLLBACK');
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

router.put('/alimentare/:id', async (req, res) => {
    try {
        const result = await req.db.execute(
            `UPDATE PROIECT_BD.ALIMENTARE SET VEHICUL_ID = :VEHICUL_ID, LOC_ALIMENTARE = :LOC_ALIMENTARE, 
            TIP_COMBUSTIBIL = :TIP_COMBUSTIBIL, CANTIATE_COMBUSTIBIL = :CANTIATE_COMBUSTIBIL, 
            DATA_ORA_ALIMENTARE = :DATA_ORA_ALIMENTARE, COST_DAUNE = :COST_DAUNE, BENZINARIE = :BENZINARIE 
            WHERE ALIMENTARE_ID = :id`,
            [
                req.body.VEHICUL_ID,
                req.body.LOC_ALIMENTARE,
                req.body.TIP_COMBUSTIBIL,
                req.body.CANTIATE_COMBUSTIBIL,
                req.body.DATA_ORA_ALIMENTARE,
                req.body.COST_DAUNE,
                req.body.BENZINARIE,
                req.params.id,
            ]
        );
        await req.db.execute('COMMIT');
        res.status(200).send('Actualizare reușită.');
    } catch (error) {
        await req.db.execute('ROLLBACK');
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

router.delete('/alimentare/:id', async (req, res) => {
    try {
        const result = await req.db.execute(
            'DELETE FROM PROIECT_BD.ALIMENTARE WHERE ALIMENTARE_ID = :id',
            [req.params.id]
        );
        await req.db.execute('COMMIT');
        res.status(200).render('alimentare');
    } catch (error) {
        await req.db.execute('ROLLBACK');
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

module.exports = router;
