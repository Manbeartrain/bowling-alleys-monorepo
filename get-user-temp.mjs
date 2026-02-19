import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = initializeApp({
  projectId: 'bowlingalleys-io',
});

const db = getFirestore(app);

async function getUser(userId) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
      console.log('User found:');
      console.log(JSON.stringify(userDoc.data(), null, 2));
    } else {
      console.log('User document does not exist in Firestore users collection');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

getUser('XOWjtzUo0nfdq9UAtQPZpCHc9of2');
