const express = require('express');
const resultMiddleware = require('../middlewares/resultMiddleware');
const formatDateForOracle = require('../db/dateUtils');
const router = express.Router();

router.get('/mentenanta', async (req, res) => {
    try {
        const result = await req.db.execute(
            'SELECT * FROM PROIECT_BD.MENTENANTA'
        );
        const mentenantaList = resultMiddleware(result);

        res.status(200).render('mentenanta', { mentenantaList });
    } catch (error) {
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

router.get('/mentenanta/add', async (req, res) => {
    const result = await req.db.execute('SELECT * FROM PROIECT_BD.VEHICUL');
    const vehiculeList = resultMiddleware(result);

    res.status(200).render('add-mentenanta', { vehiculeList });
});

router.get('/mentenanta/edit/:id', async (req, res) => {
    try {
        const result = await req.db.execute(
            'SELECT * FROM PROIECT_BD.MENTENANTA WHERE MENTENANTA_ID = :id',
            [req.params.id]
        );

        const result2 = await req.db.execute(
            'SELECT * FROM PROIECT_BD.VEHICUL'
        );
        const vehiculeList = resultMiddleware(result2);

        const mentenanta = resultMiddleware(result);
        res.status(200).render('edit-mentenanta', {
            mentenanta: mentenanta,
            vehiculeList: vehiculeList,
        });
    } catch (error) {
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

router.post('/mentenanta', async (req, res) => {
    try {
        const dataOraStart = formatDateForOracle(req.body.DATA_ORA_START);
        const dataOraEnd = formatDateForOracle(req.body.DATA_ORA_END);
        const result = await req.db.execute(
            `INSERT INTO PROIECT_BD.MENTENANTA (VEHICUL_ID, TIP_MENTENANTA, DESCRIERE, COST, DATA_ORA_START, DATA_ORA_END)
            VALUES (:VEHICUL_ID, :TIP_MENTENANTA, :DESCRIERE, :COST, TO_DATE(:DATA_ORA_START, 'YYYY-MM-DD HH24:MI:SS'), TO_DATE(:DATA_ORA_END, 'YYYY-MM-DD HH24:MI:SS'))`,
            [
                req.body.VEHICUL_ID,
                req.body.TIP_MENTENANTA,
                req.body.DESCRIERE,
                req.body.COST,
                dataOraStart, // Format corect pentru Oracle
                dataOraEnd, // Format corect pentru Oracle
            ]
        );
        await req.db.execute('COMMIT');
        res.status(201).redirect('/mentenanta');
    } catch (error) {
        await req.db.execute('ROLLBACK');
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

router.put('/mentenanta/:id', async (req, res) => {
    try {
        const dataOraStart = formatDateForOracle(req.body.DATA_ORA_START).slice(
            0,
            -3
        );
        const dataOraEnd = formatDateForOracle(req.body.DATA_ORA_END).slice(
            0,
            -3
        );
        console.log(dataOraEnd);
        console.log(dataOraStart);
        const result = await req.db.execute(
            `UPDATE PROIECT_BD.MENTENANTA SET VEHICUL_ID = :VEHICUL_ID, TIP_MENTENANTA = :TIP_MENTENANTA, 
            DESCRIERE = :DESCRIERE, COST = :COST, DATA_ORA_START = TO_DATE(:DATA_ORA_START, 'YYYY-MM-DD HH24:MI:SS'), 
            DATA_ORA_END = TO_DATE(:DATA_ORA_END, 'YYYY-MM-DD HH24:MI:SS') 
            WHERE MENTENANTA_ID = :id`,
            [
                req.body.VEHICUL_ID,
                req.body.TIP_MENTENANTA,
                req.body.DESCRIERE,
                req.body.COST,
                dataOraStart,
                dataOraEnd,
                req.params.id,
            ]
        );
        await req.db.execute('COMMIT');
        res.status(200).redirect('/mentenanta');
    } catch (error) {
        await req.db.execute('ROLLBACK');
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

router.delete('/mentenanta/:id', async (req, res) => {
    try {
        const result = await req.db.execute(
            'DELETE FROM PROIECT_BD.MENTENANTA WHERE MENTENANTA_ID = :id',
            [req.params.id]
        );
        await req.db.execute('COMMIT');
        res.status(200).redirect('/mentenanta');
    } catch (error) {
        await req.db.execute('ROLLBACK');
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

module.exports = router;
