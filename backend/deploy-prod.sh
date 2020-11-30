#!/bin/bash

cd functions || exit
npm run build
cd ..
firebase use prod
firebase deploy --only firestore:rules
firebase deploy --only functions
