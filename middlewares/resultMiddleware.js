const resultMiddleware = (body) => {
    let newBody = body.rows.map((row) => {
        const obj = {};
        for (let i = 0; i < row.length; i++) {
            const property = body.metaData[i].name;
            obj[property] = row[i];
        }
        return obj;
    });
    return newBody;
};

module.exports = resultMiddleware;
