import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { categories, products, admins } from './src/db/mockData';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function migrate() {
  console.log('Migrating Categories...');
  for (const cat of categories) {
    await setDoc(doc(db, 'categories', cat.id), cat);
  }
  
  console.log('Migrating Products...');
  for (const prod of products) {
    await setDoc(doc(db, 'products', prod.id), prod);
  }

  // To set admins, we need real UIDs, but since we are using Firebase Auth, we must create those users.
  // We can't easily create users using Firebase client SDK without logging them in.
  // But wait, the admin authentication can use real Google Auth login now. 
  // Let's hold off on creating the admin document, and tell the user to use their Google Account!
  
  console.log('Done!');
  process.exit(0);
}

migrate().catch(console.error);
