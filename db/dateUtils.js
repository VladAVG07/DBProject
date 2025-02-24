const formatDateForOracle = (dateString) => {
    const formattedDate = dateString.replace('T', ' ') + ':00';
    return formattedDate; // Ex: '2024-12-01 20:36:00'
};

module.exports = formatDateForOracle;
