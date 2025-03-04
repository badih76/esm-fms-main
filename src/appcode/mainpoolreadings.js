import { firebase } from '../constants/firebase';

Number.prototype.pad = function (size, c) {
    var s = String(this);
    while (s.length < (size || 2)) { s = c + s; }
    return s;
}


export const addPoolReading = (prjName, contName, poolName, reading) => {
    // This function logs a pool reading for a pool in a contract in a project.
    //
    // A document exists if it has fields. Collections within the document
    // do not mean it exist if it has no fields.
    //
    // The parameter reading is an object containing the reading's details... 
    // 
  
    var pn = prjName;
    var cn = contName;
    
    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";
  
    console.log("Code: ", {pn, cn, poolName, reading});
    
    var db = firebase.firestore();
    var poolsDb = db.collection('Projects').doc(pn)
                      .collection('Contracts').doc(cn)
                      .collection('Assets').doc(poolName);
  
    var newReading = {...reading};
  
    // check if a document exists for the mentioned client name...
    return poolsDb.get()
      .then((snapshot) => {
        if(snapshot.exists) {
          // The Pool document exists...
          // You can add the reading...
          let docName = reading.transDate + ' ' + reading.transTime;

          return poolsDb.collection('Readings').doc(docName).set(reading);  
        }
        else {
          // No document exists for this pool... Cannot create a new reading...
          funcSuccess = 'No';
          funcResult = {};
          funcFailReason = 'Pool Do Not exists. Cannot log a reading.';
  
          var funcReturn = {
            Success: funcSuccess,
            Result: funcResult,
            FailReason: funcFailReason,
            Error: funcError,
            Warning: funcWarning };

            return funcReturn;
        }
      })
      .then((result) => {
        // On successful writing of client document to database...
        funcSuccess = 'Ok';
        funcResult = {};
  
        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };
  
        return funcReturn;
  
      })
      .catch((err) => {
        funcSuccess = 'No';
        funcResult = {};
        funcFailReason = 'Error';
        funcError = err.message;
  
        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };
  
        return funcReturn;
      });
  };

export const updatePoolReading = (prjName, contName, poolName, reading) => {
    // This function logs a pool reading for a pool in a contract in a project.
    //
    // A document exists if it has fields. Collections within the document
    // do not mean it exist if it has no fields.
    //
    // The parameter reading is an object containing the reading's details... 
    // 
  
    var pn = prjName;
    var cn = contName;
    
    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";
  
    console.log("Code: ", {pn, cn, poolName, reading});
    
    var db = firebase.firestore();
    var poolsDb = db.collection('Projects').doc(pn)
                      .collection('Contracts').doc(cn)
                      .collection('Assets').doc(poolName);
  
    var newReading = {...reading};
  
    // check if a document exists for the mentioned client name...
    return poolsDb.collection('Readings').doc(reading.transDate).get()
    .then((snapshot) => {
        if(snapshot.exists) {
          // The Pool document exists...
          // You can add the reading...
          
          return poolsDb.collection('Readings').doc(reading.transDate).update(reading);  
        }
        else {
          // No document exists for this pool... Cannot create a new reading...
          funcSuccess = 'No';
          funcResult = {};
          funcFailReason = 'Reading Do Not exists. Cannot update the log a reading.';
  
          var funcReturn = {
            Success: funcSuccess,
            Result: funcResult,
            FailReason: funcFailReason,
            Error: funcError,
            Warning: funcWarning };

            return funcReturn;
        }
    })
    .then((result) => {
        // On successful writing of client document to database...
        funcSuccess = 'Ok';
        funcResult = {};
  
        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };
  
        return funcReturn;
  
    })
    .catch((err) => {
        funcSuccess = 'No';
        funcResult = {};
        funcFailReason = 'Error';
        funcError = err.message;
  
        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };
  
        return funcReturn;
    });
};

  
export const getReadingsList = (prjName, contName, poolName) => {
    // This function gets all existing readings of a pool under Contract
    // under project of a Client.
    //
    // A document exists if it has fields. Collections within the document
    // do not mean it exist if it has no fields.
    //
  
    var pn = prjName;
    var cn = contName;
  
    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";
  
    var db = firebase.firestore();
    var poolsDb = db.collection('Projects').doc(pn)
                      .collection('Contracts').doc(cn)
                      .collection('Assets').doc(poolName);
  
    // check if a document exists for the mentioned client name...
    return poolsDb.collection('Readings').get()
    .then((snapshot) => {
        let readings = [];
  
        if(snapshot.docs.length > 0) {
         
          snapshot.forEach(docReading => {
            readings.push(docReading.data());
          });
  
          funcSuccess = 'Ok';
          funcResult = readings;
        }
        else {
          // The client document exists...
          // Do not overwrite... Return the results...
          funcSuccess = 'No';
          funcResult = readings;
          funcFailReason = 'No readings found. Returning empty list.';
        }
  
        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };
  
        return funcReturn;
    })
    .catch((err) => {
        funcSuccess = 'No';
        funcResult = {};
        funcFailReason = 'Error';
        funcError = err.message;
  
        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };
  
        return funcReturn;
    });
};
  
