import { firebase } from '../constants/firebase';

Number.prototype.pad = function (size, c) {
    var s = String(this);
    while (s.length < (size || 2)) { s = c + s; }
    return s;
}

export const getPrjServices = async () => {
    // This function gets the list of all existing Project Services.
    //
    // A document exists if it has fields. Collections within the document
    // do not mean it exist if it has no fields.
    //
    // The function accepts no params.
    //
    
    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";

    var db = firebase.firestore();
    
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    var prjServicesDb = db.collection('Accounts').doc('Project Services').collection('Services');

    var services = [];

    return prjServicesDb.get()
    .then((snapshot) => {

        if (snapshot.docs.length > 0)
        {
            snapshot.forEach((docPrjServ) => {
                let service = {
                    Description: docPrjServ.id,
                    
                }

                services.push(service);

            });

            funcSuccess = 'Ok';
            funcResult = services;
            
        }
        else
        {
            funcSuccess = 'No';
            funcResult = [];
            funcFailReason = 'No Services were found. Returning empty list.';
        }

        var funcReturn = {
            Success: funcSuccess,
            Result: funcResult,
            FailReason: funcFailReason,
            Error: funcError,
            Warning: funcWarning
        };

        return funcReturn;
    })
    .catch((err) => {
        funcSuccess = 'No';
        funcResult = [];
        funcFailReason = 'Error';
        funcError = err.message;

        var funcReturn = {
            Success: funcSuccess,
            Result: funcResult,
            FailReason: funcFailReason,
            Error: funcError,
            Warning: funcWarning
        };

        return funcReturn;
    });
};

export const addPrjService = (service) => {
    // This function creates a new Major Project Service document
    // under Accounts/Project Services and set it to blank manning
    // and blank value and description with no sub-services.
    //
    // A document exists if it has fields. Collections within the document
    // do not mean it exist if it has no fields.
    //
    // The function accepts the following params:
    // 1. Major Service Name.
    //

    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";

    var db = firebase.firestore();
    var prjServicesDb = db.collection('Accounts').doc('Project Services').collection('Services');

    var newmajorservice = {...service};

    // check if a document exists for the mentioned client name...
    return prjServicesDb.doc(service.Description).set(newmajorservice)
      .then((result) => {
        // On successful writing of client document to database...
        funcSuccess = 'Ok';
        funcResult = newmajorservice;

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

export const updatePrjService = (service) => {
    // This function updates an existsing Project Major Service document
    // descriptive fields, only. It will not reset Values.
    //
    // A document exists if it has fields. Collections within the document
    // do not mean it exist if it has no fields.
    //

    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";

    var db = firebase.firestore();
    var prjServicesDb = db.collection('Accounts').doc('Project Services').collection('Services');

    var updatemajorservice = {...service};

    // check if a document exists for the mentioned client name...
 
    return prjServicesDb.doc(service.Description).get()
      .then((snapshot) => {
        if(snapshot.exists) {
          // The document exists. Update the document...
          return prjServicesDb.doc(service.Description).update(updatemajorservice);
        }
        else {
          // No document exists for this client... Return result...
          funcSuccess = 'No';
          funcResult = {};
          funcFailReason = 'Project Service do not exist.'

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
        funcResult = updatemajorservice;

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };

        return funcReturn;

      })
      .catch((err) => {
        console.log("ERROR: ", err);
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
}

export const getPrjServicesDoc = async (desc) => {
    // This function gets the list of all existing Project Services.
    //
    // A document exists if it has fields. Collections within the document
    // do not mean it exist if it has no fields.
    //
    // The function accepts no params.
    //
    
    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";

    var db = firebase.firestore();
    
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    var prjServicesDb = db.collection('Accounts').doc('Project Services').collection('Services').doc(desc);

    let services = [];
    
    return prjServicesDb.get()
    .then((snapshot) => {

        if (snapshot.exists)
        {
        

            funcSuccess = 'Ok';
            funcResult = snapshot.data();
            
        }
        else
        {
            funcSuccess = 'No';
            funcResult = {};
            funcFailReason = 'No Services were found. Returning empty list.';
        }

        var funcReturn = {
            Success: funcSuccess,
            Result: funcResult,
            FailReason: funcFailReason,
            Error: funcError,
            Warning: funcWarning
        };

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
            Warning: funcWarning
        };

        return funcReturn;
    });
};


