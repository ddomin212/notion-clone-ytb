import { App, getApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

var admin = require('firebase-admin');

var serviceAccount = require('./key.json');

let app: App;

if (getApps().length > 0) {
	app = getApp();
} else {
	app = admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});
}

const adminDb = getFirestore(app);

export { app as adminApp, adminDb };
