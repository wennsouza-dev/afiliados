
const ids = ['MLB5768690226', 'MLBU2901657290', 'MLB2901657290'];

async function checkId(id) {
    try {
        const res = await fetch(`https://api.mercadolibre.com/items/${id}`);
        if (res.ok) {
            const data = await res.json();
            console.log(`[SUCCESS] ${id}: ${data.title} (Price: ${data.price})`);
        } else {
            console.log(`[ERROR] ${id}: ${res.status} ${res.statusText}`);
        }
    } catch (e) {
        console.log(`[EXCEPTION] ${id}: ${e.message}`);
    }
}

async function run() {
    for (const id of ids) {
        await checkId(id);
    }
}

run();
