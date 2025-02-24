const express = require('express');
const resultMiddleware = require('../middlewares/resultMiddleware');
const formatDateForOracle = require('../db/dateUtils');

const router = express.Router();

router.get('/cursa', async (req, res) => {
    const result1 = await req.db.execute(
        'SELECT * FROM PROIECT_BD.CURSA C JOIN PROIECT_BD.TRANSPORT_MARFA T ON C.CURSA_ID = T.CURSA_ID'
    );
    const cursaList1 = resultMiddleware(result1);
    const result2 = await req.db.execute(
        'SELECT * FROM PROIECT_BD.CURSA C JOIN PROIECT_BD.TRANSPORT_PERSOANE T ON C.CURSA_ID = T.CURSA_ID'
    );
    const cursaList2 = resultMiddleware(result2);
    res.status(200).render('cursa', { cursaList1, cursaList2 });
});

router.get('/cursa/add', async (req, res) => {
    const result = await req.db.execute('select * from PROIECT_BD.vehicul');
    const vehiculeList = resultMiddleware(result);
    res.render('add-cursa', { vehiculeList });
});

router.get('/cursa/edit/:id', async (req, res) => {
    try {
        const result = await req.db.execute(
            'SELECT * FROM PROIECT_BD.CURSA WHERE CURSA_ID = :id',
            [req.params.id]
        );
        const result2 = await req.db.execute(
            'select * from PROIECT_BD.vehicul'
        );
        const vehiculeList = resultMiddleware(result2);
        const cursa = resultMiddleware(result);
        console.log(cursa);
        res.status(200).render('edit-cursa', { cursa, vehiculeList });
    } catch (error) {
        res.status(500).send('Eroare interna de server: ' + error);
    }
});

router.get('/cursa/infoLocatii', async (req, res, next) => {
    try {
        const result = await req.db.execute(
            `
SELECT C.LOC_PLECARE,
       SUM(C.COST_TOTAL)   AS "COST_TOTAL_PER_LOCATIE",
       SUM(TP.NR_PASAGERI) AS "NR_TOTAL_PASAGERI_PER_LOCATIE"
FROM PROIECT_BD.CURSA C
         JOIN PROIECT_BD.TRANSPORT_PERSOANE TP on C.CURSA_ID = TP.CURSA_ID
HAVING SUM(TP.NR_PASAGERI) > 20
group by C.LOC_PLECARE`
        );
        const inregistrareList = resultMiddleware(result);
        // res.status(200).json(inregistrareList);
        res.status(200).render('subpunctuld', { inregistrareList });
    } catch (error) {
        res.status(500).send('Eroare interna de server' + error);
    }
});

router.post('/cursa', async (req, res) => {
    try {
        const dataOraPlecare = formatDateForOracle(req.body.DATA_ORA_PLECARE);
        const dataOraSosire = formatDateForOracle(req.body.DATA_ORA_SOSIRE);
        let result = await req.db.execute(
            `INSERT INTO PROIECT_BD.CURSA (VEHICUL_ID, LOC_PLECARE, LOC_SOSIRE, DATA_ORA_PLECARE, DATA_ORA_SOSIRE, COST_TOTAL) 
            VALUES (:vehicul_id, :loc_plecare, :loc_sosire, TO_DATE(:DATA_ORA_PLECARE, 'YYYY-MM-DD HH24:MI:SS'), 
            TO_DATE(:DATA_ORA_SOSIRE, 'YYYY-MM-DD HH24:MI:SS'), :cost_total)`,
            [
                req.body.VEHICUL_ID,
                req.body.LOC_PLECARE,
                req.body.LOC_SOSIRE,
                dataOraPlecare,
                dataOraSosire,
                req.body.COST_TOTAL,
            ]
        );

        const cursa = await req.db.execute(
            'SELECT * FROM PROIECT_BD.CURSA WHERE ROWID = :id',
            [result.lastRowid]
        );

        if (req.body.subtable == 'marfa') {
            await req.db.execute(
                'INSERT INTO PROIECT_BD.TRANSPORT_MARFA (CURSA_ID, TIP_MARFA, GREUTATE_MARFA, VOLUM_MARFA, CONDITII_SPECIALE, ASIGURARE_MARFA) VALUES (:cursa_id, :tip_marfa, :greutate_marfa, :volum_marfa, :conditii_speciale, :asigurare_marfa)',
                [
                    cursa.rows[0][0],
                    req.body.TIP_MARFA,
                    req.body.GREUTATE_MARFA,
                    req.body.VOLUM_MARFA,
                    req.body.CONDITII_SPECIALE,
                    req.body.ASIGURARE_MARFA,
                ]
            );
        } else if (req.body.subtable == 'persoane') {
            await req.db.execute(
                'INSERT INTO PROIECT_BD.TRANSPORT_PERSOANE (CURSA_ID, NR_PASAGERI, GHID_TURISTIC) VALUES (:cursa_id, :nr_pasageri, :ghid_turistic)',
                [
                    cursa.rows[0][0],
                    req.body.NR_PASAGERI,
                    req.body.GHID_TURISTIC == null ? false : true,
                ]
            );
        }

        await req.db.execute('COMMIT');
        res.status(200).redirect('/cursa');
    } catch (error) {
        await req.db.execute('ROLLBACK');
        res.status(500).send('Server internal error: ' + error);
    }
});

router.put('/cursa/:id', async (req, res) => {
    try {
        const dataOraPlecare = formatDateForOracle(
            req.body.DATA_ORA_PLECARE
        ).slice(0, -3);
        const dataOraSosire = formatDateForOracle(
            req.body.DATA_ORA_SOSIRE
        ).slice(0, -3);
        console.log(dataOraPlecare, dataOraSosire);
        const updateResult = await req.db.execute(
            `UPDATE PROIECT_BD.CURSA SET VEHICUL_ID = :vehicul_id, LOC_PLECARE = :loc_plecare, LOC_SOSIRE = :loc_sosire, 
            DATA_ORA_PLECARE = TO_DATE(:DATA_ORA_PLECARE, 'YYYY-MM-DD HH24:MI:SS'), 
            DATA_ORA_SOSIRE = TO_DATE(:DATA_ORA_SOSIRE, 'YYYY-MM-DD HH24:MI:SS'), COST_TOTAL = :cost_total WHERE CURSA_ID = :id`,
            [
                req.body.VEHICUL_ID,
                req.body.LOC_PLECARE,
                req.body.LOC_SOSIRE,
                dataOraPlecare,
                dataOraSosire,
                req.body.COST_TOTAL,
                req.params.id,
            ]
        );

        if (req.body.subtable == 'marfa') {
            await req.db.execute(
                'UPDATE PROIECT_BD.TRANSPORT_MARFA SET TIP_MARFA = :tip_marfa, GREUTATE_MARFA = :greutate_marfa, VOLUM_MARFA = :volum_marfa, CONDITII_SPECIALE = :conditii_speciale, ASIGURARE_MARFA = :asigurare_marfa WHERE CURSA_ID = :id',
                [
                    req.body.TIP_MARFA,
                    req.body.GREUTATE_MARFA,
                    req.body.VOLUM_MARFA,
                    req.body.CONDITII_SPECIALE,
                    req.body.ASIGURARE_MARFA,
                    req.params.id,
                ]
            );
        } else if (req.body.subtable == 'persoane') {
            await req.db.execute(
                'UPDATE PROIECT_BD.TRANSPORT_PERSOANE SET NR_PASAGERI = :nr_pasageri, GHID_TURISTIC = :ghid_turistic WHERE CURSA_ID = :id',
                [req.body.NR_PASAGERI, req.body.GHID_TURISTIC, req.params.id]
            );
        }
        await req.db.execute('COMMIT');
        res.status(200).redirect('/cursa');
    } catch (err) {
        await req.db.execute('ROLLBACK');
        res.status(500).send('Server internal error: ' + err);
    }
});

router.delete('/cursa/:id', async (req, res) => {
    try {
        await req.db.execute(
            'DELETE FROM PROIECT_BD.CURSA WHERE CURSA_ID = :id',
            [req.params.id]
        );
        await req.db.execute('COMMIT');
        res.status(200).redirect('/cursa');
    } catch (error) {
        await req.db.execute('ROLLBACK');
        res.status(500).send('Server internal error: ' + error);
    }
});

module.exports = router;
