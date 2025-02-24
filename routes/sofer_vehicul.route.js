const express = require('express');
const resultMiddleware = require('../middlewares/resultMiddleware');
const router = express.Router();

router.get('/sofer_vehicul', async (req, res) => {
    try {
        const result = await req.db.execute(
            'SELECT * FROM PROIECT_BD.SOFER_VEHICUL'
        );
        const soferVehiculList = resultMiddleware(result);
        res.status(200).render('sofer-vehicul', { soferVehiculList });
    } catch (error) {
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

router.get('/sofer_vehicul/:id', async (req, res) => {
    try {
        const result = await req.db.execute(
            'SELECT * FROM PROIECT_BD.SOFER_VEHICUL WHERE SOFER_VEHICUL_ID = :id',
            [req.params.id]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

router.post('/sofer_vehicul', async (req, res) => {
    try {
        const result = await req.db.execute(
            `INSERT INTO PROIECT_BD.SOFER_VEHICUL (VEHICUL_ID, SOFER_ID, DATA_ORA_START, DATA_ORA_END)
            VALUES (:VEHICUL_ID, :SOFER_ID, :DATA_ORA_START, :DATA_ORA_END)`,
            [
                req.body.VEHICUL_ID,
                req.body.SOFER_ID,
                req.body.DATA_ORA_START,
                req.body.DATA_ORA_END,
            ]
        );
        await req.db.execute('COMMIT');
        res.status(201).send('Inserare reușită.');
    } catch (error) {
        await req.db.execute('ROLLBACK');
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

router.put('/sofer_vehicul/:id', async (req, res) => {
    try {
        const result = await req.db.execute(
            `UPDATE PROIECT_BD.SOFER_VEHICUL SET VEHICUL_ID = :VEHICUL_ID, SOFER_ID = :SOFER_ID, 
            DATA_ORA_START = :DATA_ORA_START, DATA_ORA_END = :DATA_ORA_END WHERE SOFER_VEHICUL_ID = :id`,
            [
                req.body.VEHICUL_ID,
                req.body.SOFER_ID,
                req.body.DATA_ORA_START,
                req.body.DATA_ORA_END,
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

router.delete('/sofer_vehicul/:id', async (req, res) => {
    try {
        const result = await req.db.execute(
            'DELETE FROM PROIECT_BD.SOFER_VEHICUL WHERE SOFER_VEHICUL_ID = :id',
            [req.params.id]
        );
        await req.db.execute('COMMIT');
        res.status(200).render('sofer-vehicul');
    } catch (error) {
        await req.db.execute('ROLLBACK');
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

module.exports = router;
