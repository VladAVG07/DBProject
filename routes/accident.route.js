const express = require('express');
const resultMiddleware = require('../middlewares/resultMiddleware');

const router = express.Router();

router.get('/accident', async (req, res) => {
    try {
        const result = await req.db.execute(
            'select * from PROIECT_BD.accident'
        );
        const accidentList = resultMiddleware(result);
        res.status(200).render('accident', { accidentList });
    } catch (error) {
        res.status(500).send('Eroare interna de server' + error);
    }
});

router.get('/accident/:id', async (req, res) => {
    try {
        const result = await req.db.execute(
            'select * from PROIECT_BD.accident where accident_id = :id',
            [req.params.id]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).send('Eroare interna de server' + error);
    }
});

router.post('/accident', async (req, res) => {
    try {
        const result = await req.db.execute(
            `insert into PROIECT_BD.accident (vehicul_id , desciere, cost_daune, data_ora, loc, gravitate, amiabil) 
                values (:vehicul_id, :desciere, :cost_daune, :data_ora, :loc, :gravitate, :amiabil))`,
            [
                req.body.vehicul_id,
                req.body.descriere,
                req.body.cost_daune,
                req.body.data_ora,
                req.body.loc,
                req.body.gravitate,
                req.body.amiabil,
            ]
        );
        await req.db.execute('commit');
        res.status(200).send('succes, a mers');
    } catch (error) {
        await req.db.execute('rollback');
        res.status(500).send('Eroare interna de server' + error);
    }
});

router.put('/accident:id', async (req, res) => {
    try {
        const result = await req.db.execute(
            `update PROIECT_BD.accident set vehicul_id = :vid, descriere = :desc, cost_daune = :cd, data_ora = :dto
            loc = :lc, gravitate = :grav, amiabil = :amb`,
            [
                req.body.vid,
                req.body.desc,
                req.body.cd,
                req.body.dto,
                req.body.lc,
                req.body.grav,
                req.body.amb,
            ]
        );
        await req.db.execute('commit');
        res.status(200).send('succes a mers');
    } catch (error) {
        await req.db.execute('rollback');
        res.status(500).send('Eroare interna de server' + error);
    }
});

router.delete('/accident:id', async (req, res) => {
    try {
        const result = await req.db.execute(
            `delete from PROIECT_BD.accident where vehicul_id = :id`,
            [req.params.id]
        );
        await req.db.execute('commit');
        res.status(200).render('accident');
    } catch (error) {
        await req.db.execute('rollback');
        res.status(500).send('Eroare interna de server' + error);
    }
});

module.exports = router;
