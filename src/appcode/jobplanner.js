import { firebase } from '../constants/firebase';

Number.prototype.pad = function (size, c) {
    var s = String(this);
    while (s.length < (size || 2)) { s = c + s; }
    return s;
}

export const getPrjContPlan = (pName, cName) => {
    // This function returns the maintenance plan of Contract Under a
    // Given Project document.
    //
    // A document exists if it has fields. Collections within the document
    // do not mean it exist if it has no fields.
    //
    // The function accepts no params:
    // 1. Contract's Name
    // 2. Project's Name
    
    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";

    var db = firebase.firestore();
    var prjDb = db.collection('Projects').doc(pName).collection('Contracts').doc(cName);
    
    // check if a document exists for the mentioned project/Contract...
    return prjDb.collection('Plans').doc(pName+'.'+cName+'.Plan').get()
      .then((snapshot) => {
        // if snapshot exists, return the plan...
        if(snapshot.exists)
        {
          // Couldn't find document for the mentioned contract...
          // Return FailReason...
          funcSuccess = 'Ok';
          funcResult = snapshot.data().Plans;

          var funcReturn = {
            Success: funcSuccess,
            Result: funcResult,
            FailReason: "",
            Error: funcError,
            Warning: funcWarning };

          return funcReturn;
        }
        else {

          // Couldn't find document for the mentioned contract...
          // Return FailReason...
          funcSuccess = 'No';
          funcResult = {};

          var funcReturn = {
            Success: funcSuccess,
            Result: funcResult,
            FailReason: "No Maintenance Plans were found. Returning empty list.",
            Error: funcError,
            Warning: funcWarning };

          return funcReturn;
        }
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

export const getProjectsList = () => {
  // This function gets an existing asset documen under Contract
  // under project of a Client.
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
  var servicesDb = db.collection('Projects');
  
  return servicesDb.get()
      .then((snapshot) => {
      let projects = [];
  
      if(snapshot.docs.length > 0) {
          
          snapshot.forEach(docService => {
          projects.push(docService.data().prjName);
          });
  
          funcSuccess = 'Ok';
          funcResult = projects;
      }
      else {
          funcSuccess = 'No';
          funcResult = projects;
          funcFailReason = 'No Projects found. Returning empty list.';
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
      funcResult = [];
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

export const getProjectsContractsList = (prjName, contName) => {
  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";
  
  var db = firebase.firestore();
  var servicesDb = db.collection('Projects').doc(prjName).collection('Contracts');
  
  return servicesDb.get()
      .then((snapshot) => {
      let contracts = [];
  
      if(snapshot.docs.length > 0) {
          
          snapshot.forEach(docService => {
          contracts.push(docService.data().contName);
          });
  
          funcSuccess = 'Ok';
          funcResult = contracts;
      }
      else {
          funcSuccess = 'No';
          funcResult = contracts;
          funcFailReason = 'No Contracts found. Returning empty list.';
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
      funcResult = [];
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

export const updatePrjContPlans = (pName, cName, plans) => {
  // This function adds or updates a maintenance plan of Contract Under a
  // Given Project document.
  //
  // A document exists if it has fields. Collections within the document
  // do not mean it exist if it has no fields.
  //
  // The function accepts no params:
  // 1. Contract's Name
  // 2. Project's Name
  // 3. Mainetance Plan JSON stringified object
  //
  
  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";

  var db = firebase.firestore();
  var prjDb = db.collection('Projects').doc(pName).collection('Contracts').doc(cName);

  // check if a document exists for the mentioned project/Contract...
  return prjDb.get()
    .then((snapshot) => {
      // if snapshot exists, add/update the plan...
      if(snapshot.exists)
      {
        var dataPlan = {
          Plans: plans
        }
        return prjDb.collection('Plans').doc(pName+'.'+cName+'.'+'Plan').set(dataPlan);
      }
      else {

        // Couldn't find document for the mentioned contract...
        // Return FailReason...
        funcSuccess = 'No';
        funcResult = {};

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: "Contract was not found. Adding Maintenance Plans Aborted.",
          Error: funcError,
          Warning: funcWarning };

        return funcReturn;
      }
    })
    .then((result) => {
      funcSuccess = 'Ok';
      funcResult = result;

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