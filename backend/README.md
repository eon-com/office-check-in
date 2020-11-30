# Office Check-In Firebase Functions

## Preparations

Make sure you have the most recent version of firebase tools installed. 

Run
```
npm i -g firebase-tools
```

## Getting started

Read this first:
- https://firebase.google.com/docs/emulator-suite
- https://firebase.google.com/docs/functions

## Run emulators

For testing cloud functions, enter the following commands in a terminal:

```
cd functions
npm run build
firebase emulators:start
```

This starts all emualtors. You can choose npm run serve for only running the functions emulator.

## Emulator UI

Open ``localhost:4000`` in your browser.

## Firebase emulator

The following emulators are configured for this project under these ports:

```
functions emulator: 5001
firestore emulator: 8080
hosting emulator: 5000
pubsub emulator: 8085
```

