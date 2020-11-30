import * as admin from "firebase-admin";

export async function createUser(user: admin.auth.UserRecord, teamname?: string, teamrole?: string) {
    let docData = {
        email: user.email,
    };
    if (teamname && teamrole) {
        docData = Object.assign({}, docData, {
            teamname,
            teamrole,
        });
    }
    try {
        await admin.firestore().doc(`users/${user.uid}`).set(docData);
    } catch (e) {
        console.error('creating user doc failed', e);
    }

    // Set user role
    if (teamname && teamrole) {
        await admin.firestore().doc(`users/${user.uid}/roles/admin`).set({});
    }
}
