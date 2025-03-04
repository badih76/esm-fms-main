import { firebase } from '../constants/firebase';

Number.prototype.pad = function (size, c) {
    var s = String(this);
    while (s.length < (size || 2)) { s = c + s; }
    return s;
}

export const getServicesList = () => {
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
    var servicesDb = db.collection('Accounts')
                       .doc('Project Services')
                       .collection('Services');
  
    return servicesDb.get()
      .then((snapshot) => {
        let services = [];
  
        if(snapshot.docs.length > 0) {
         
          snapshot.forEach(docService => {
            services.push(docService.data().Description);
          });
  
          funcSuccess = 'Ok';
          funcResult = services;
        }
        else {
          funcSuccess = 'No';
          funcResult = services;
          funcFailReason = 'No services found. Returning empty list.';
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

export const getClientsList = () => {
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
      let clients = [];
  
      if(snapshot.docs.length > 0) {
          
          snapshot.forEach(docService => {
            if(!clients.find(c => c == docService.data().clientName)) {
              clients.push(docService.data().clientName);
            }
          });
          console.log(clients);
  
          funcSuccess = 'Ok';
          funcResult = clients;
      }
      else {
          funcSuccess = 'No';
          funcResult = clients;
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

export const getProjectsContractDoc = (prjName, contName) => {
  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";
  
  var db = firebase.firestore();
  var servicesDb = db.collection('Projects').doc(prjName).collection('Contracts').doc(contName);
  
  return servicesDb.get()
      .then((snapshot) => {
      let contract = {};

      if(snapshot.exists) {
          contract = snapshot.data();
          
          funcSuccess = 'Ok';
          funcResult = contract;
      }
      else {
          funcSuccess = 'No';
          funcResult = contract;
          funcFailReason = 'Contract was not found.';
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

export const addContract = (prjName, contract) => {
  // This function Creates a new Contract Under Given Project document.
  //
  // A document exists if it has fields. Collections within the document
  // do not mean it exist if it has no fields.
  //
  // Parameter contract is an object containing the contract detals and services...
  //

  var contDef = contract;  // decodeURIComponent(
  
  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";

  // var arNumber = parseInt(getARCounter());
  // console.log(arNumber);
  // var arNumPadded = arNumber.pad(6,0);

  var db = firebase.firestore();
  var prjDb = db.collection('Projects');

  // Need to extract the services total values and sum them up...
  var totalContVal = 0;
  contDef.Services.forEach((serv) => {
    totalContVal += serv.quotedValue;
  });

  // check if a document exists for the mentioned project name...
  return prjDb.doc(prjName).collection('Contracts').doc(contDef.contName).get()
    .then((snapshot) => {
      // if snapshot exists, check if overwrite...
      if(snapshot.exists)
      {
        // if(ow == "Y")
        // {
        //   // Create a batch...
        //   var batch = db.batch();

        //   // Create Contract Document transaction...
        //   var prjContDoc = prjDb.doc(prjName).collection('Contracts').doc(jsonContDef.contName);
        //   batch.set(prjContDoc, jsonContDef);

        //   // Create Contract AR Account Transaction...
        //   var arContDoc = db.collection('Accounts').doc('Contracts').collection('AR').doc('ar'+arNumPadded);
        //   var arDoc = {
        //     arCode: 'ar'+jsonContDef.contName,
        //     value: totalContVal,
        //     prjName: jsonContDef.ProjectName,
        //     contCode: jsonContDef.contCode
        //   }
        //   batch.set(arContDoc, arDoc);

        //   // Make sure of the the AR Doc field...
        //   var arDocFields = db.collection('Accounts').doc('Contracts').collection('AR');
        //   var arDocF = {
        //     AR: 'Accounts Receivable'
        //   }
        //   batch.set(arDocFields, arDocF);

        //   // Add Accounts Transaction of initial value...
        //   var td = new Date();
        //   var transNum = 'ar' +td.getDay().toString() + td.getMonth().toString() + td.getYear().toString()
        //                 +td.getHours().toString() + td.getMinutes().toString() + td.getSeconds().toString()
        //                 +td.getMilliseconds();

        //   var accTrans = db.collection('Accounts').doc('Transactions').collection('Transaction').doc(transNum);
        //   var accTransDoc = {
        //     accCode: 'ar'+jsonContDef.contName,
        //     value: totalContVal,
        //     dateTime: td.toISOString(),
        //     Details: 'Initial Opening Figure'

        //   }
        //   batch.set(accTrans, accTransDoc);

        //   return batch.commit();

        //   // return prjDb.doc(prjName).collection('Contracts').doc(jsonContDef.contName).set(jsonContDef);
        // }
        // else {
        //   // Do not overwrite and return failreason...
        //   funcSuccess = 'No';
        //   funcResult = "{}";

        //   var funcReturn = {
        //     Success: funcSuccess,
        //     Result: funcResult,
        //     FailReason: "Contract Exists and cannot overwrite. Adding aborted.",
        //     Error: funcError,
        //     Warning: funcWarning };

        //     console.log(funcReturn);

        //   res.send(JSON.stringify(funcReturn));

        // }
      }
      else {
          // Create Contract Document transaction...
          return prjDb.doc(prjName).collection('Contracts').doc(contDef.contName).set(contDef);
      }
    })
    .then((result) => {
      
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

export const updateContract = (prjName, contract) => {
  var contDef = contract;  // decodeURIComponent(
  
  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";

  
  var db = firebase.firestore();
  var prjDb = db.collection('Projects');

  // Need to extract the services total values and sum them up...
  var totalContVal = 0;
  contDef.Services.forEach((serv) => {
    totalContVal += serv.quotedValue;
  });

  // check if a document exists for the mentioned project name...
  return prjDb.doc(prjName).collection('Contracts').doc(contDef.contName).get()
    .then((snapshot) => {
      // if snapshot exists, check if overwrite...
      if(snapshot.exists)
      {
        return prjDb.doc(prjName).collection('Contracts').doc(contDef.contName).update(contDef);
      }
      else {
        funcSuccess = 'No';
        funcResult = 'Contract was not found! Update aborted.';
  
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
}
