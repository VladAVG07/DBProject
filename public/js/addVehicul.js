document.addEventListener('DOMContentLoaded', function () {
    const autocarFields = document.getElementById('autocar-fields');
    const tirFields = document.getElementById('tir-fields');
    const autocarRadio = document.getElementById('autocar');
    const tirRadio = document.getElementById('tir');

    function toggleFields() {
        if (autocarRadio.checked) {
            autocarFields.style.display = 'block';
            tirFields.style.display = 'none';
        } else if (tirRadio.checked) {
            tirFields.style.display = 'block';
            autocarFields.style.display = 'none';
        }
    }

    // Initial check
    toggleFields();

    // Add event listeners to the radio buttons
    autocarRadio.addEventListener('change', toggleFields);
    tirRadio.addEventListener('change', toggleFields);
});
