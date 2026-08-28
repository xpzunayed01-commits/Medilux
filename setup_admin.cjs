const admin = require('firebase-admin');
try {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) : null;
  if (serviceAccount) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  } else {
    admin.initializeApp({projectId: 'gen-lang-client-0355674633'});
  }
} catch(e) {}

async function makeAdmin() {
  try {
    const auth = admin.auth();
    const user = await auth.getUserByEmail('xpzunayed01@gmail.com');
    const db = admin.firestore();
    await db.collection('admins').doc(user.uid).set({
      email: user.email,
      role: 'superadmin',
      createdAt: new Date().toISOString()
    });
    console.log("Admin setup successful for:", user.uid);
  } catch (e) {
    console.error("Error setting admin:", e);
  }
}
makeAdmin();
