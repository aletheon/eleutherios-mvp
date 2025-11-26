// Script to clear old notifications from Firestore
const admin = require('firebase-admin');
const serviceAccount = require('../service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function clearOldNotifications() {
  try {
    console.log('Fetching all notifications...');
    const notificationsRef = db.collection('notifications');
    const snapshot = await notificationsRef.get();

    console.log(`Found ${snapshot.size} notifications`);

    if (snapshot.empty) {
      console.log('No notifications to delete');
      return;
    }

    // Delete all notifications
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      console.log(`Deleting notification: ${doc.id} - ${doc.data().title}`);
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Successfully deleted ${snapshot.size} old notifications`);
  } catch (error) {
    console.error('Error clearing notifications:', error);
  } finally {
    process.exit();
  }
}

clearOldNotifications();
