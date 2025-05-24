import { adminAuth, adminDb } from '../../config/firebase';

export const setupTestData = async () => {
  // Maak een admin, editor en user aan
  const adminUser = await adminAuth.createUser({
    email: 'admin@example.com',
    password: 'password123',
    displayName: 'Admin User',
    emailVerified: true,
  });
  const editorUser = await adminAuth.createUser({
    email: 'editor@example.com',
    password: 'password123',
    displayName: 'Editor User',
    emailVerified: true,
  });
  const regularUser = await adminAuth.createUser({
    email: 'user@example.com',
    password: 'password123',
    displayName: 'Regular User',
    emailVerified: true,
  });

  // Zet custom claims voor rollen
  await adminAuth.setCustomUserClaims(adminUser.uid, { role: 'admin' });
  await adminAuth.setCustomUserClaims(editorUser.uid, { role: 'editor' });
  await adminAuth.setCustomUserClaims(regularUser.uid, { role: 'user' });

  // Voeg gebruikers toe aan Firestore
  await adminDb.collection('users').doc(adminUser.uid).set({
    uid: adminUser.uid,
    email: adminUser.email,
    username: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  await adminDb.collection('users').doc(editorUser.uid).set({
    uid: editorUser.uid,
    email: editorUser.email,
    username: 'editor',
    firstName: 'Editor',
    lastName: 'User',
    role: 'editor',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  await adminDb.collection('users').doc(regularUser.uid).set({
    uid: regularUser.uid,
    email: regularUser.email,
    username: 'user',
    firstName: 'Regular',
    lastName: 'User',
    role: 'user',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Voeg default settings toe
  await adminDb
    .collection('settings')
    .doc('site')
    .set({
      siteName: 'Test Site',
      siteDescription: 'Test site description',
      theme: { primaryColor: '#000', secondaryColor: '#fff', fontFamily: 'Arial' },
      seo: { title: 'Test', description: 'Test', keywords: ['test'], robots: 'index, follow' },
      social: {},
      contact: { email: 'test@example.com' },
      features: {
        enableBlog: true,
        enableShop: false,
        enableComments: true,
        enableNewsletter: true,
      },
      updatedAt: new Date(),
      updatedBy: adminUser.uid,
    });

  return { adminUser, editorUser, regularUser };
};

export const teardownTestData = async () => {
  // Verwijder alle test users
  const users = await adminAuth.listUsers();
  for (const user of users.users) {
    await adminAuth.deleteUser(user.uid);
  }
  // Verwijder testdata uit Firestore
  const collections = ['users', 'content', 'media', 'settings', 'menus', 'invoices'];
  for (const collection of collections) {
    const snapshot = await adminDb.collection(collection).get();
    const batch = adminDb.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }
};

// Utility: maak test content aan
export async function createTestContent({
  title = 'Test',
  slug = 'test',
  type = 'page',
  authorUid,
}: {
  title?: string;
  slug?: string;
  type?: string;
  authorUid: string;
}) {
  const ref = adminDb.collection('content').doc();
  const now = new Date();
  const data = {
    id: ref.id,
    title,
    slug,
    type,
    status: 'draft',
    content: 'Test content',
    author: authorUid,
    tags: [],
    createdAt: now,
    updatedAt: now,
  };
  await ref.set(data);
  return data;
}

// Utility: verkrijg een session token voor een test user
export async function getSessionToken(email: string) {
  const user = await adminAuth.getUserByEmail(email);
  // Maak een custom token en wissel deze om voor een ID token via de client (hier gesimuleerd)
  // In echte tests kun je een endpoint aanroepen die een session cookie aanmaakt
  const customToken = await adminAuth.createCustomToken(user.uid);
  // Hier zou je normaal gesproken de client SDK gebruiken om het customToken om te wisselen voor een idToken
  // Voor nu retourneer je het customToken zodat je deze in je test kunt gebruiken
  return customToken;
}
