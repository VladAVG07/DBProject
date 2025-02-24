const express = require('express');
const resultMiddleware = require('../middlewares/resultMiddleware');

const router = express.Router();

router.get('/vehicul', async (req, res) => {
    try {
        const resultAutocar = await req.db.execute(
            'SELECT * FROM PROIECT_BD.VEHICUL V JOIN PROIECT_BD.AUTOCAR A ON V.VEHICUL_ID = A.VEHICUL_ID'
        );
        const resultTir = await req.db.execute(
            'SELECT * FROM PROIECT_BD.VEHICUL V JOIN PROIECT_BD.TIR T ON V.VEHICUL_ID = T.VEHICUL_ID'
        );
        const vehiculList1 = resultMiddleware(resultAutocar);
        const vehiculList2 = resultMiddleware(resultTir);

        res.status(200).render('vehicul', { vehiculList1, vehiculList2 });
    } catch (error) {
        res.status(500).send('Server error: ' + error);
    }
});

router.get('/vehicul/add', (req, res) => {
    res.status(200).render('add-vehicul');
});

router.get('/vehicul/infoMentenanta', async (req, res, next) => {
    try {
        const result = await req.db.execute(
            `SELECT M.TIP_MENTENANTA,
       M.DESCRIERE,
       M.COST,
       V.MODEL,
       V.MARCA,
       V.NR_KILOMETRI,
       CASE
           WHEN A2.VEHICUL_ID IS NOT NULL THEN 'Autocar'
           WHEN T.VEHICUL_ID IS NOT NULL THEN 'TIR'
           END AS TIP_VEHICUL
FROM PROIECT_BD.MENTENANTA M
         JOIN PROIECT_BD.VEHICUL V
              on M.VEHICUL_ID = V.VEHICUL_ID
         LEFT JOIN PROIECT_BD.AUTOCAR A2 on V.VEHICUL_ID = A2.VEHICUL_ID
         LEFT JOIN PROIECT_BD.TIR T on V.VEHICUL_ID = T.VEHICUL_ID
WHERE UPPER(V.MARCA) = 'MERCEDES' AND M.COST >= 200`
        );
        const inregistrareList = resultMiddleware(result);
        res.status(200).render('subpunctulc', { inregistrareList });
    } catch (error) {
        res.status(500).send('Eroare interna de server' + error);
    }
});

router.post('/vehicul', async (req, res) => {
    try {
        const result = await req.db.execute(
            `INSERT INTO PROIECT_BD.VEHICUL (MARCA, MODEL, NR_KILOMETRI, AN_FABRICATIE, CAPACITATE_REZERVOR) 
            VALUES (:marca, :model, :nr_kilometri, :an_fabricatie, :capacitate_rezervor)`,
            [
                req.body.MARCA,
                req.body.MODEL,
                req.body.NR_KILOMETRI,
                req.body.AN_FABRICATIE,
                req.body.CAPACITATE_REZERVOR,
            ]
        );

        const vehiculIdResult = await req.db.execute(
            `SELECT VEHICUL_ID FROM PROIECT_BD.VEHICUL WHERE ROWID = :id`,
            [result.lastRowid]
        );
        const vehiculId = vehiculIdResult.rows[0][0];

        if (req.body.type === 'autocar') {
            await req.db.execute(
                `INSERT INTO PROIECT_BD.AUTOCAR (VEHICUL_ID, NR_LOCURI, SPARTIU_BAGAJE, DOTARI) 
                VALUES (:vehicul_id, :nr_locuri, :spatiu_bagaje, :dotari)`,
                [
                    vehiculId,
                    req.body.NR_LOCURI,
                    req.body.SPATIU_BAGAJE,
                    req.body.DOTARI,
                ]
            );
        } else if (req.body.type === 'tir') {
            await req.db.execute(
                `INSERT INTO PROIECT_BD.TIR (VEHICUL_ID, CAPACITATE_CILINDRICA, GREUTATE_MAXIMA, TIP_TRACTIUNE, NR_AXE) 
                VALUES (:vehicul_id, :capacitate_cilindrica, :greutate_maxima, :tip_tractiune, :nr_axe)`,
                [
                    vehiculId,
                    req.body.CAPACITATE_CILINDRICA,
                    req.body.GREUTATE_MAXIMA,
                    req.body.TIP_TRACTIUNE,
                    req.body.NR_AXE,
                ]
            );
        }

        await req.db.execute('COMMIT');
        res.status(201).redirect('/vehicul');
    } catch (error) {
        await req.db.execute('ROLLBACK');
        res.status(500).send('Server error: ' + error);
    }
});

router.put('/vehicul/:id', async (req, res) => {
    try {
        // Update base VEHICUL data
        await req.db.execute(
            `UPDATE PROIECT_BD.VEHICUL 
            SET MARCA = :marca, MODEL = :model, NR_KILOMETRI = :nr_kilometri, AN_FABRICATIE = :an_fabricatie, CAPACITATE_REZERVOR = :capacitate_rezervor 
            WHERE VEHICUL_ID = :id`,
            [
                req.body.marca,
                req.body.model,
                req.body.nr_kilometri,
                req.body.an_fabricatie,
                req.body.capacitate_rezervor,
                req.params.id,
            ]
        );

        // Update AUTOCAR or TIR based on request type
        if (req.body.type === 'autocar') {
            await req.db.execute(
                `UPDATE PROIECT_BD.AUTOCAR 
                SET NR_LOCURI = :nr_locuri, SPARTIU_BAGAJE = :spatiu_bagaje, DOTARI = :dotari 
                WHERE VEHICUL_ID = :id`,
                [
                    req.body.nr_locuri,
                    req.body.spatio_bagaje,
                    req.body.dotari,
                    req.params.id,
                ]
            );
        } else if (req.body.type === 'tir') {
            await req.db.execute(
                `UPDATE PROIECT_BD.TIR 
                SET CAPACITATE_CILINDRICA = :capacitate_cilindrica, GREUTATE_MAXIMA = :greutate_maxima, TIP_TRACTIUNE = :tip_tractiune, NR_AXE = :nr_axe 
                WHERE VEHICUL_ID = :id`,
                [
                    req.body.capacitate_cilindrica,
                    req.body.greutate_maxima,
                    req.body.tip_tractiune,
                    req.body.nr_axe,
                    req.params.id,
                ]
            );
        }

        await req.db.execute('COMMIT');
        res.status(200).send('Vehicul updated successfully');
    } catch (error) {
        await req.db.execute('ROLLBACK');
        res.status(500).send('Server error: ' + error);
    }
});

router.delete('/vehicul/:id', async (req, res) => {
    try {
        await req.db.execute(
            `DELETE FROM PROIECT_BD.VEHICUL WHERE VEHICUL_ID = :id`,
            [req.params.id]
        );
        await req.db.execute('COMMIT');
        res.status(200).redirect('/vehicul');
    } catch (error) {
        await req.db.execute('ROLLBACK');
        res.status(500).send('Server error: ' + error);
    }
});

module.exports = router;
