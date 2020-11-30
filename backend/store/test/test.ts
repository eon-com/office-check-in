/// <reference path='../node_modules/mocha-typescript/globals.d.ts' />
import * as firebase from "@firebase/testing";
import * as fs from "fs";

//Setup
const projectId = "firestore-office-check-in";
const coverageUrl = `http://localhost:8080/emulator/v1/projects/${projectId}:ruleCoverage.html`;

const rules = fs.readFileSync("firestore.rules", "utf8");

/**
 * Creates a new app with authentication data matching the input.
 *
 * @param {object} auth the object to use for authentication (typically {uid: some-uid})
 * @return {object} the app.
 */
function authedApp(auth) {
  return firebase
    .initializeTestApp({ projectId, auth })
    .firestore();
}

/*
 * ============
 *  Test Cases
 * ============
 */
before(async () => {
  await firebase.loadFirestoreRules({ projectId, rules });
});

beforeEach(async () => {
  // Clear the database between tests
  await firebase.clearFirestoreData({ projectId });
});

after(async () => {
  await Promise.all(firebase.apps().map(app => app.delete()));
  console.log(`View rule coverage information at ${coverageUrl}\n`);
});

@suite
class OfficeCheckInRulesTest {
  @test
  async "require users to log in before creating a profile"() {
    const db = authedApp(null);
    const profile = db.collection("users").doc("Han Solo");
    await firebase.assertFails(profile.set({ first_name: "Han" }));
  }

  @test
  async "users can only book rooms they are allowed"() {
    const db = authedApp({ uid: "alice" });
    const userBooking = db.doc("users/alice/bookings/2020-05-11"); // db.collection("users").doc("alice").collection("bookings").doc("2020-05-11");

    const area = db.doc("areas/raum1");
    area.set({
      capacity: 5,
      users: ["Herbert", "Dieter"]
    });

    const booking = db.collection("areas").doc("raum1").collection("booking").doc("2020-05-11");
    booking.set({capacity: 5, count: 1});

    await firebase.assertFails(userBooking.set({ areaId: "raum1" }));
    await firebase.assertFails(
      db.runTransaction( async (transaction) =>  {
        transaction.set(userBooking, { areaId: "raum1" });
        transaction.set(booking, { count: 2 });
      })
    );
  }

  @test
  async "only admins can write a team area"() {
    const db = authedApp({ uid: "alice" });
    const userAdminRole = db.doc("users/alice/roles/admin"); // db.collection("users").doc("alice").collection("bookings").doc("2020-05-11");

    userAdminRole.set({
      admin: true,
    });

    const area = db.collection("areas").doc("raum1");

    await firebase.assertSucceeds(area.set({ capacity: "12", locationName: "raum1" }));

  }

  @test
  async "should enforce that count on room increases"() {
    const db = authedApp({ uid: "alice" });
    const userBooking = db.doc("users/alice/bookings/2020-05-11"); // db.collection("users").doc("alice").collection("bookings").doc("2020-05-11");
    
    const area = db.doc("areas/raum1");
    area.set({
      locationName: 'raum1',
      capacity: 5,
      users: ["Herbert", "alice"]
    });
    
    const booking = db.collection("areas").doc("raum1").collection("booking").doc("2020-05-11");
    booking.set({capacity: 5, count: 1});
    
    await firebase.assertFails(userBooking.set({ areaId: "raum1" }));
    await firebase.assertSucceeds(
      db.runTransaction( async (transaction) =>  {
        var doc = db.doc("users/alice/bookings/2020-05-11");
        transaction.set(doc, { 'areaId': "raum1" });
        transaction.set(booking, { count: 2 });
      })
    );
  }

  @test
  async "should check if location name exists"() {
    const db = authedApp({uid: "alice"});
    const userAdminRole = db.doc("users/alice/roles/admin"); // db.collection("users").doc("alice").collection("bookings").doc("2020-05-11");
    await userAdminRole.set({
      admin: true,
    });

    const area1 = db.collection("areas").doc("01");
    await area1.set({
      locationName: 'Room-1'
    });
    const areas_names = db.collection("areas_names").doc("Room-1")
    await  areas_names.set({areaRef: 'areas/01'})

    const area = db.collection("areas").doc("02");
    await firebase.assertFails( area.set({locationName: 'Room-1'}));
    const area2 = db.collection("areas").doc("03");
    await firebase.assertSucceeds( area2.set({locationName: 'Room-2'}));

    await firebase.assertFails( area2.set({locationName: 'Room-2b'}));
  }

}
