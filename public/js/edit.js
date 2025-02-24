document.addEventListener('DOMContentLoaded', () => {
    const marfaFields = document.getElementById('marfa-fields');
    const persoaneFields = document.getElementById('persoane-fields');

    document.querySelectorAll('input[name="subtable"]').forEach((radio) => {
        radio.addEventListener('change', () => {
            if (radio.value === 'marfa') {
                marfaFields.style.display = 'block';
                persoaneFields.style.display = 'none';
            } else {
                marfaFields.style.display = 'none';
                persoaneFields.style.display = 'block';
            }
        });
    });
});
