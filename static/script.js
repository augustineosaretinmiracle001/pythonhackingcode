async function testAPI() {
    const nameInput = document.getElementById('nameInput');
    const result = document.getElementById('result');
    const name = nameInput.value.trim();

    try {
        const response = await fetch('/api/hello', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name || 'World' })
        });

        const data = await response.json();
        result.textContent = data.message;
        result.style.display = 'block';
    } catch (error) {
        result.textContent = 'Error: ' + error.message;
        result.style.display = 'block';
        result.style.background = '#ffe8e8';
    }
}