import { adminDb } from '../src/config/firebase';

async function seed() {
  // Users
  await adminDb.collection('users').doc('admin').set({
    uid: 'admin',
    email: 'admin@example.com',
    username: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  await adminDb.collection('users').doc('editor').set({
    uid: 'editor',
    email: 'editor@example.com',
    username: 'editor',
    firstName: 'Editor',
    lastName: 'User',
    role: 'editor',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  await adminDb.collection('users').doc('user').set({
    uid: 'user',
    email: 'user@example.com',
    username: 'user',
    firstName: 'Regular',
    lastName: 'User',
    role: 'user',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  // Content
  await adminDb.collection('content').add({
    title: 'Welkom',
    slug: 'welkom',
    type: 'page',
    status: 'published',
    content: 'Welkom bij Van Soest CMS!',
    author: 'admin',
    tags: ['intro'],
    createdAt: new Date(),
    updatedAt: new Date()
  });
  // Settings
  await adminDb.collection('settings').doc('site').set({
    siteName: 'Van Soest CMS',
    siteDescription: 'Demo omgeving',
    theme: { primaryColor: '#000', secondaryColor: '#fff', fontFamily: 'Arial' },
    seo: { title: 'Van Soest', description: 'Demo', keywords: ['cms'], robots: 'index, follow' },
    social: {},
    contact: { email: 'info@vansoest.nl' },
    features: { enableBlog: true, enableShop: false, enableComments: true, enableNewsletter: true },
    updatedAt: new Date(),
    updatedBy: 'admin'
  });
  // Menu
  await adminDb.collection('menus').add({
    name: 'Hoofdmenu',
    location: 'header',
    items: [
      { id: 'home', title: 'Home', url: '/', order: 1 },
      { id: 'contact', title: 'Contact', url: '/contact', order: 2 }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'admin',
    updatedBy: 'admin'
  });
  // Invoice
  await adminDb.collection('invoices').add({
    number: 'INV-001',
    userId: 'user',
    status: 'draft',
    items: [
      { id: 'item1', description: 'Advies', quantity: 1, unitPrice: 100, total: 100 }
    ],
    subtotal: 100,
    tax: 21,
    total: 121,
    currency: 'EUR',
    dueDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  });
  console.log('Seed data toegevoegd!');
}

seed().then(() => process.exit(0)); 