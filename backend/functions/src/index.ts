import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {diff} from 'deep-object-diff';
import {createUser} from "./create-user";
import {deleteArea, updateArea} from "./area-util";
import FieldValue = admin.firestore.FieldValue;
import QueryDocumentSnapshot = admin.firestore.QueryDocumentSnapshot;

admin.initializeApp();

// const db = admin.firestore();

async function createdTimestamp(snapshot: QueryDocumentSnapshot) {
    if (!snapshot.exists) {
        console.log('document does not exist anymore');
        return;
    }
    return snapshot.ref.set({
        created: FieldValue.serverTimestamp(),
    }, {
        merge: true,
    });
}

async function updatedTimestamp(change: functions.Change<QueryDocumentSnapshot<FirebaseFirestore.DocumentData>>) {
    if (!change.after.exists) {
        console.log('document does not exist anymore');
        return;
    }
    const a = change.before.data() || {};
    const b = change.after.data() || {};
    const objDiff = diff(a, b);
    const changedKeys = Object.keys(objDiff).filter(x => x !== 'modified');
    if (changedKeys.length === 0) {
        console.log('no change detected');
        return;
    }

    return change.after.ref.set({
        modified: FieldValue.serverTimestamp(),
    }, {
        merge: true,
    });
}


export const userCreatedListener = functions.firestore
    .document('users/{userId}')
    .onCreate(async (snapshot, context) => {
        await createdTimestamp(snapshot);
    });

export const userUpdatedListener = functions.firestore
    .document('users/{userId}')
    .onUpdate(async (change, context) => {
        await updatedTimestamp(change);
    });

export const userBookingCreatedListener = functions.firestore
    .document('users/{userId}/bookings/{bookingId}')
    .onCreate(async (snapshot, context) => {
        await createdTimestamp(snapshot);
    });

export const userBookingUpdatedListener = functions.firestore
    .document('users/{userId}/bookings/{bookingId}')
    .onUpdate(async (change, context) => {
        await updatedTimestamp(change);
    });

export const userRoleCreatedListener = functions.firestore
    .document('users/{userId}/roles/{roleId}')
    .onCreate(async (snapshot, context) => {
        await createdTimestamp(snapshot);
    });

export const userRoleUpdatedListener = functions.firestore
    .document('users/{userId}/roles/{roleId}')
    .onUpdate(async (change, context) => {
        await updatedTimestamp(change);
    });

export const areaCreatedListener = functions.firestore
    .document('areas/{areaId}')
    .onCreate(async (snapshot, context) => {
        await createdTimestamp(snapshot);
    });

export const areaUpdatedListener = functions.firestore
    .document('areas/{areaId}')
    .onUpdate(async (change, context) => {
        await updatedTimestamp(change);
    });

export const areaBookingCreatedListener = functions.firestore
    .document('areas/{areaId}/booking/{bookingId}')
    .onCreate(async (snapshot, context) => {
        const t = await createdTimestamp(snapshot);
        console.log(t);
    });

export const areaBookingUpdatedListener = functions.firestore
    .document('areas/{areaId}/booking/{bookingId}')
    .onUpdate(async (change, context) => {
        await updatedTimestamp(change);
    });

export const areaUsersCreatedListener = functions.firestore
    .document('areas/{areaId}/users/{userId}')
    .onCreate(async (snapshot, context) => {
        const t = await createdTimestamp(snapshot);
        console.log(t);
    });

export const areaUsersUpdatedListener = functions.firestore
    .document('areas/{areaId}/users/{userId}')
    .onUpdate(async (change, context) => {
        await updatedTimestamp(change);
    });

export const areaNameCreatedListener = functions.firestore
    .document('areas_names/{areaNameId}')
    .onCreate(async (snapshot, context) => {
        const t = await createdTimestamp(snapshot);
        console.log(t);
    });

export const areaNameUpdatedListener = functions.firestore
    .document('areas_names/{areaNameId}')
    .onUpdate(async (change, context) => {
        await updatedTimestamp(change);
    });

/**
 * Will create a firestore user object. Will not send a mail. Requires an existing authentication
 *
 * data: {teamname?: string, teamrole?: string}
 */
export const register = functions.https.onCall(async (data, context) => {
    try {
        const uid = context.auth?.uid;
        if (!uid) return {success: false};
        const user = await admin.auth().getUser(uid)

        await createUser(user, data.teamname, data.teamrole);
        return {success: true};
    } catch (error) {
        console.error(error);
        return {success: false};
    }
});

export const updateTeamArea = functions.https.onCall(async (data, context) => {
    const areaData = {
        locationName: data.data.locationName,
        capacity: data.data.capacity,
        locationAddress: data.data.locationAddress
    };
    return areaFunction(data, context, async areaReference => await updateArea(areaReference, areaData));
});

export const deleteTeamArea = functions.https.onCall(async (data, context) => {
    return areaFunction(data, context, async areaReference => await deleteArea(areaReference));
});

async function areaFunction(data: { areaUID: any; }, context: functions.https.CallableContext, task: (areaReference: any) => Promise<boolean>) {
    try {
        const areaUID = data.areaUID;

        const uid = context.auth?.uid;
        if (!uid) return {success: false, message: 'unauthenticated'};

        const areaReference = admin.firestore().doc(`areas/${areaUID}`);
        const area = await areaReference.get();

        const authenticatedUser = await admin.firestore().doc(`users/${uid}`).get();
        if (authenticatedUser.data() === null || area.data() === null || area.data()?.creator.id !== authenticatedUser.id) {
            return {success: false, message: 'unauthorized'};
        }

        const success = await task(areaReference);

        return {success};
    } catch (error) {
        console.error(error);
        return {success: false, message: 'unknown'};
    }
}
