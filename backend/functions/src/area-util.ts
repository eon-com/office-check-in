import * as admin from "firebase-admin";
import FieldValue = admin.firestore.FieldValue;

export async function updateArea(areaReference: FirebaseFirestore.DocumentReference, data: { locationName: string, capacity: number, locationAddress: string }) {
    const newAreaNamesRef = await admin.firestore().doc(`areas_names/${data.locationName}`).get();
    if(newAreaNamesRef.exists && newAreaNamesRef.ref !== areaReference) return false;

    const batch = admin.firestore().batch();
    const areaUID = areaReference.id;

    // update area in joined areas
    const usersRef = await admin.firestore().collection('users').orderBy(`areas.${areaUID}`).get()
    for (const user of usersRef.docs) {
        batch.update(user.ref, {[`areas.${areaUID}`]: data.locationName});
    }

    // update in areas_names (delete old and create new)
    const areaNames = await admin.firestore().collection('areas_names').where('areaRef', '==', areaReference).get()
    areaNames.forEach(name => {
        batch.delete(name.ref)
    })

    // create new areas_name
    batch.set(admin.firestore().doc(`areas_names/${data.locationName}`), {
        areaRef: areaReference
    });


    // update area itself
    batch.update(areaReference, data);

    await batch.commit();
    return true;
}

export async function deleteArea(areaReference: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>) {
    const batch = admin.firestore().batch();
    const areaUID = areaReference.id;

    // delete area from joined areas
    const usersRef = await admin.firestore().collection('users').orderBy(`areas.${areaUID}`).get()
    for (const user of usersRef.docs) {
        batch.update(user.ref, {[`areas.${areaUID}`]: FieldValue.delete()});
        // delete bookings on area and user
        const bookings = await user.ref.collection('bookings').where('areaId', '==', areaUID).get()
        bookings.forEach(booking => {
            // delete bookings on user
            batch.update(user.ref, {[`bookings.${booking.id}`]: FieldValue.delete()},)
            batch.delete(booking.ref);
        });
    }


    // delete from areas_names
    const areaNames = await admin.firestore().collection('areas_names').where('areaRef', '==', areaReference).get()
    areaNames.forEach(name => {
        batch.delete(name.ref)
    })

    // delete area itself
    await deleteSubCollection('booking', areaReference, batch);
    await deleteSubCollection('users', areaReference, batch);

    batch.delete(areaReference);

    await batch.commit();
    return true;
}

async function deleteSubCollection(path: string, reference: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>, batch: FirebaseFirestore.WriteBatch) {
    const collection = await reference.collection(path).get();

    for (const booking of collection.docs) {
        batch.delete(booking.ref);
    }
}
