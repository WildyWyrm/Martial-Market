const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json'); // ajusta si tu archivo se llama distinto

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function agregarSlugs() {
    const productosRef = db.collection('productos');
    const snapshot = await productosRef.get();

    snapshot.forEach(async (doc) => {
        const data = doc.data();
        if (!data.slug) { // solo agrega slug si no existe
            const slug = data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-') // reemplaza espacios y caracteres especiales por guiones
                .replace(/^-|-$/g, '');       // quita guiones al inicio y final
            await doc.ref.update({ slug });
            console.log(`Producto "${data.name}" actualizado con slug: ${slug}`);
        }
    });

    console.log('Todos los productos procesados.');
}

agregarSlugs();
