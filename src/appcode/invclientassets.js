import { firebase } from '../constants/firebase';

Number.prototype.pad = function (size, c) {
    var s = String(this);
    while (s.length < (size || 2)) { s = c + s; }
    return s;
}

export const getClientDocument = async (clientName) => {
    // This function gets the existing document of the given Client Name.
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
    
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    var clientsDb = db.collection('Inventory').doc('Assets').collection('Clients');

    // get the document containing the complain categories as fields name
    // from the Dependencies/HDeskComplCat document...
    return clientsDb.where('clName', '==', clientName).get()
    .then((snapshot) => {

        if (snapshot.docs.length > 0)
        {
            let clients = [];

            snapshot.forEach((docClient) => {
                clients.push(docClient.data());

            });

            funcSuccess = 'Ok';
            funcResult = clients;
        }
        else
        {
            funcSuccess = 'No';
            funcResult = '{}';
            funcFailReason = 'No Clients were found. Returning empty list.';
        }

        var funcReturn = {
            Success: funcSuccess,
            Result: funcResult,
            FailReason: funcFailReason,
            Error: funcError,
            Warning: funcWarning
        };

        // res.send(JSON.stringify(funcReturn));
        return funcReturn;
    })
    .catch((err) => {
        funcSuccess = 'No';
        funcResult = '{}';
        funcFailReason = 'Error';
        funcError = err.message;

        var funcReturn = {
            Success: funcSuccess,
            Result: funcResult,
            FailReason: funcFailReason,
            Error: funcError,
            Warning: funcWarning
        };

        // res.send(JSON.stringify(funcReturn));
        return funcReturn;
    });
};

export const addClient = async (client) => {
    // This function creates a new Client Profile document,
    // or reset the existing one.
    //
    // A document exists if it has fields. Collections within the document
    // do not mean it exist if it has no fields.
    //

    var cn = client.clName;
    var ce = client.clEmail;
    var cpnam = client.clContactName;
    var cpnum = client.clContactNumber;
    var cadd = client.clAddress;
    
    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";

    var db = firebase.firestore();
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);  
    var clientsDb = db.collection('Inventory').doc('Assets').collection('Clients');

    var newclient = {
      clName: cn,
      clEmail: ce,
      clContactName: cpnam,
      clContactNumber: cpnum,
      clAddress: cadd,
      SitesCount: 0
    };

    // check if a document exists for the mentioned client name...
    return clientsDb.doc(cn).get()
      .then((snapshot) => {
        if(snapshot.exists) {
            // The client document exists...
            return clientsDb.doc(cn).set(newclient);
        }
        else {
          // No document exists for this client... Create a new document...
          return clientsDb.doc(cn).set(newclient).then((result) => {
            // Update Assets Profile and increment the number of clients by 1...
            var assetsProfileDb = db.collection('Inventory').doc('Assets').get().then((snapshot) =>{
              var cc = 0;
              if(snapshot.exists) {
                // There are fields in the Assets Profile... Get the ClientsCount value;
                cc = snapshot.data().ClientsCount;

              }
              ++cc;
              return db.collection('Inventory').doc('Assets').update({ClientsCount: cc});
            });
          });
        }
      })
      .then((result) => {
        // On successful writing of client document to database...
        funcSuccess = 'Ok';
        funcResult = '{}';

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
        funcResult = '{}';
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

export const updateClientByName = (client) => {
    // This function updates an existsing Client Profile document.
    //
    // A document exists if it has fields. Collections within the document
    // do not mean it exist if it has no fields.
    //

    var cn = client.clName;
    var ce = client.clEmail;
    var cpnam = client.clContactName;
    var cpnum = client.clContactNumber;
    var cadd = client.clAddress;

    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";

    var db = firebase.firestore();
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);  
    var clientsDb = db.collection('Inventory').doc('Assets').collection('Clients');

    var updateclient = {
      clName: cn,
      clEmail: ce,
      clContactName: cpnam,
      clContactNumber: cpnum,
      clAddress: cadd
    };

    // check if a document exists for the mentioned client name...
    return clientsDb.doc(cn).get()
      .then((snapshot) => {
        if(snapshot.exists) {
          // The client document exists. Update client profile document...
          return clientsDb.doc(cn).set(updateclient);
        }
        else {
          // No document exists for this client... Return result...
          funcSuccess = 'No';
          funcResult = '{}';
          funcFailReason = 'Client Profile do not exist.'

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
        funcResult = '{}';

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
        funcResult = '{}';
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

// --------------------------------------------------------------

export const getProjectDocument = async (prjName) => {
  // This function gets the existing document of the given Client Name.
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
  
  const settings = { timestampsInSnapshots: true };
  db.settings(settings);

  var projectsDb = db.collection('Projects');

  // get the document containing the complain categories as fields name
  // from the Dependencies/HDeskComplCat document...
  return projectsDb.where('prjName', '==', prjName).get()
  .then((snapshot) => {

      if (snapshot.docs.length > 0)
      {
          let projects = [];

          snapshot.forEach((docPrj) => {
              projects.push(docPrj.data());

          });

          funcSuccess = 'Ok';
          funcResult = projects;
      }
      else
      {
          funcSuccess = 'No';
          funcResult = [];
          funcFailReason = 'No Clients were found. Returning empty list.';
      }

      var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning
      };

      // res.send(JSON.stringify(funcReturn));
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

      // res.send(JSON.stringify(funcReturn));
      return funcReturn;
  });
};

export const addProject = (project) => {
  // This function Creates a new Project document.
  //
  // A document exists if it has fields. Collections within the document
  // do not mean it exist if it has no fields.
  //

  // var projDef = project;
  // var jsonProjDef = JSON.parse(projDef);
  var jsonProjDef = project;

  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";

  var db = firebase.firestore();
  const settings = { timestampsInSnapshots: true };
  db.settings(settings);
  var prjDb = db.collection('Projects');


  // check if a document exists for the mentioned project name...
  return prjDb.doc(jsonProjDef.prjName).get()
    .then((snapshot) => {
      // if snapshot exists, check if overwrite...
      if(snapshot.exists)
      {
        // Do not overwrite and return failreason...
        funcSuccess = 'No';
        funcResult = "{}";

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: "Project Exists and cannot overwrite. Adding aborted.",
          Error: funcError,
          Warning: funcWarning };

        return funcReturn;
      }
      else {

            // Project do not exist... Add it to Projects Database...
            return prjDb.doc(jsonProjDef.prjName).set(jsonProjDef);
      }
    })
    .then((docRef) => {

      // go through the snapshot docs and get the Client names and push
      // them into a JSON string...

      funcSuccess = 'Ok';
      funcResult = docRef.id;

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
      funcResult = '{}';
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

export const updateProjectByName = (project) => {
  // This function update an Existing Project document.
  //
  // A document exists if it has fields. Collections within the document
  // do not mean it exist if it has no fields.
  //

  // var projDef = req.body.jsonproject;
  // var jsonProjDef = JSON.parse(projDef);
  var jsonProjDef = project;

  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";

  var db = firebase.firestore();
  const settings = { timestampsInSnapshots: true };
  db.settings(settings);
  var prjDb = db.collection('Projects');


  // check if a document exists for the mentioned project name...
  return  prjDb.doc(jsonProjDef.prjName).get()
    .then((snapshot) => {
      // if snapshot exists, update document...
      return prjDb.doc(jsonProjDef.prjName).update(jsonProjDef);

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

// --------------------------------------------------------------

export const getAssetDoc = (prjName, contName, asstTitle) => {
  // This function gets an existing asset documen under Contract
  // under project of a Client.
  //
  // A document exists if it has fields. Collections within the document
  // do not mean it exist if it has no fields.
  //

  var pn = prjName;
  var cn = contName;
  var ttl = asstTitle;


  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";

  var db = firebase.firestore();
  var assetsDb = db.collection('Projects').doc(pn)
                    .collection('Contracts').doc(cn)
                    .collection('Assets');

  // check if a document exists for the mentioned client name...
  return assetsDb.doc(ttl).get()
    .then((snapshot) => {
      if(snapshot.exists) {
        // On successful writing of asset document to database...
        funcSuccess = 'Ok';
        funcResult = snapshot.data();

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };

        return funcReturn;

      }
      else {
        // The client document exists...
        // Do not overwrite... Return the results...
        funcSuccess = 'No';
        funcResult = {};
        funcFailReason = 'Asset does not exist.';

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
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

export const addAsset = (prjName, contName, asset) => {
  // This function creates a new Level 1Asset Record under Contract under
  // project of a Client.
  //
  // A document exists if it has fields. Collections within the document
  // do not mean it exist if it has no fields.
  //
  // The parameter asset is an object containing the asset's details... 
  // 

  var pn = prjName;
  var cn = contName;
  var ttl = asset.Title;
  var cnt = asset.Count;
  var pool = asset.pool ? asset.pool : false;
  var aequip = asset.assetEquip ? asset.assetEquip : false;
  var adesc = asset.Description;
  var sno = asset.serialNo ? asset.serialNo : "";
  var remarks = asset.Remarks;
  var location = asset.Location;

  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";

  
  var db = firebase.firestore();
  var assetsDb = db.collection('Projects').doc(pn)
                    .collection('Contracts').doc(cn)
                    .collection('Assets');

  var newasset = {
    Title: ttl,
    Description: adesc,
    pool: pool,
    assetEquip: aequip,
    Location: location,
    serialNo: sno,
    Count: cnt,
    Remarks: remarks
  };

  // check if a document exists for the mentioned client name...
  return assetsDb.doc(ttl).get()
    .then((snapshot) => {
      if(snapshot.exists) {
        // The client document exists...
        // Do not overwrite... Return the results...
        funcSuccess = 'No';
        funcResult = {};
        funcFailReason = 'Asset already exists. No Overwrite.';

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };

        return funcReturn;

      }
      else {
        // No document exists for this client... Create a new document...
        return assetsDb.doc(ttl).set(newasset);
      }
    })
    .then((result) => {
      // On successful writing of client document to database...
      if(result)
      {
        if(!result.Success) return;

        if(result.Success === 'No')
        {
          return result;
        }
      }

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

export const updateAsset = (prjName, contName, asset) => {
  // This function updates an existing Level 1Asset Record under Contract
  // under project of a Client.
  //
  // A document exists if it has fields. Collections within the document
  // do not mean it exist if it has no fields.
  //
  // Parameter asset is an object containing the asset's details...
  //

  var pn = prjName;
  var cn = contName;
  var ttl = asset.Title;
  var cnt = asset.Count;
  var pool = asset.pool ? asset.pool : false;
  var aequip = asset.assetEquip ? asset.assetEquip : false;
  var adesc = asset.Description;
  var sno = asset.serialNo ? asset.serialNo : "";
  var location = asset.Location;
  var remarks = asset.Remarks;


  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";

  var db = firebase.firestore();
  var assetsDb = db.collection('Projects').doc(pn)
                    .collection('Contracts').doc(cn)
                    .collection('Assets');

  var updateasset = {
    Title: ttl,
    Description: adesc,
    Location: location,
    serialNo: sno,
    Count: cnt,
    Remarks: remarks
  };

  // check if a document exists for the mentioned client name...
  return assetsDb.doc(ttl).get()
    .then((snapshot) => {
      if(snapshot.exists) {
        return assetsDb.doc(ttl).update(updateasset);
      }
      else {
        // The client document exists...
        // Do not overwrite... Return the results...
        funcSuccess = 'No';
        funcResult = {};
        funcFailReason = 'Asset does not exist.Update Aborted.';

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
      // On successful writing of asset document to database...
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
      funcResult = '{}';
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

export const getAssetsList = (prjName, contName) => {
  // This function gets an existing asset documen under Contract
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
  var assetsDb = db.collection('Projects').doc(pn)
                    .collection('Contracts').doc(cn)
                    .collection('Assets');

  // check if a document exists for the mentioned client name...
  return assetsDb.get()
    .then((snapshot) => {
      let assets = [];

      if(snapshot.docs.length > 0) {
       
        snapshot.forEach(docAsset => {
          assets.push(docAsset.data());
          console.log("Asset: ", docAsset);
        });

        funcSuccess = 'Ok';
        funcResult = assets;
      }
      else {
        // The client document exists...
        // Do not overwrite... Return the results...
        funcSuccess = 'No';
        funcResult = assets;
        funcFailReason = 'No assets found. Returning empty list.';
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

// --------------------------------------------------------------

export const getContractByName = (prjName, contName) => {
  // This function gets an existsing Contract of Project by the specified
  // Project name and Contract Name.
  //
  // A document exists if it has fields. Collections within the document
  // do not mean it exist if it has no fields.
  //

  var prjn = prjName;
  var contc = contName;

  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";

  var db = firebase.firestore();
  var prjDb = db.collection('Projects');

  // check if a document exists for the mentioned Project/Contract...
  return prjDb.doc(prjn).collection('Contracts').doc(contc).get()
    .then((snapshot) => {
      if(snapshot.exists) {
        // The document exists. Return the document...

        funcSuccess = 'Ok';
        funcResult = snapshot.data();

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };

        return funcReturn;
      }
      else {
        // No document exists for this project... Return result...
        funcSuccess = 'No';
        funcResult = {};
        funcFailReason = 'Contract do not exist.'

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
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
}

// --------------------------------------------------------------

export const getMainLogList = (cltName, prjName, contName, atitle) => {
  // This function retrieves all transactions under the Statement of accounts
  // of a Client's Project's Contract (hence, CPC), starting with the open
  // balance transaction created at the time of creating the contract.
  //

    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";

    //  create the SOA document name
    // (Client's Name + '_' + Project's Name + '_' + Contract's Name)
    var logDocName = cltName + '_' + prjName + '_' + contName + '_' + atitle;

    var db = firebase.firestore();
    var mainlogDB = db.collection('Maintenance').doc('Logs').collection(logDocName);


    return mainlogDB.get()
      .then((snapshot) => {
        if(snapshot.docs.length > 0)
        {
          let result = [];

          snapshot.forEach((docTr) => {
            result.push(docTr.data());
          });

          funcSuccess = 'Ok';
          funcResult = result;

        }
        else {
          // Do not overwrite... Return the results...
          funcSuccess = 'No';
          funcResult = [];
          funcFailReason = 'Could not find logs for given asset.';
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

export const addMainLog = (cln, pn, ctn, atitle, mainLog) => {
  // This function creates a new Maintenance Log Entry,
  // based on the Client/Project/Contract/Asset combination.
  //
  // This function does no validation of the data passed.
  //

  var logdt = mainLog.logDate;
  var logdetails = mainLog.logDetails;
  var logId = '';
  var pb = mainLog.logPerformedBy;

  var logDocName = cln + '_' + pn + '_' + ctn + '_' + atitle;

  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";

  var db = firebase.firestore();
  var mainlogDB = db.collection('Maintenance').doc('Logs');

  /*  Function Algorethm...

  if(contract exits in SOA)
  {
    get transactions
    get ID of first transaction => get the part1 of IT as ContractIndex
    get transactions count to generate transaction number:
        ContractIndex + '.' + transaction Number

    create transaction object and add it to contract SOA collection
  }
  else {
    we need to create new Contract SOA Collection
    get SOA => get SOA ContractCounter => create ContractIndex number
    create transaction object and add it to new contract SOA collection
  }
  */

  // Create transaction object...
  var newMainLog = {}
  
  return mainlogDB.collection(logDocName).get()
    .then((snapshot) => {
      if(snapshot.docs.length > 0)
      {
        // there is an Log collection for this contract...
        // get the first document's ID...
        logId = snapshot.docs[0].id;

        // get the count of transactions in collection...
        var logCount = snapshot.docs.length + 1;
        // generate new transaction number...
        var newLogNumber = logId.split('.')[0] + '.MLOG' + logCount.pad(5, '0');

        newMainLog = {
          logId: newLogNumber,
          logDate: logdt,
          logDetails: logdetails,
          logPerformedBy: pb
        }

        // add the transaction to the collection...
        return mainlogDB.collection(logDocName).doc(newLogNumber).set(newMainLog)
          .then(result => {
            funcSuccess = 'Ok';
            funcResult = newMainLog;
            funcFailReason = '';

            var funcReturn = {
              Success: funcSuccess,
              Result: funcResult,
              FailReason: funcFailReason,
              Error: funcError,
              Warning: funcWarning };

            return funcReturn;
          })
          .catch(err =>
          {
            funcSuccess = 'No';
            funcResult = {};
            funcFailReason = 'Error';
            funcError = err.message;

            console.log("Process: ", err);
            var funcReturn = {
              Success: funcSuccess,
              Result: funcResult,
              FailReason: funcFailReason,
              Error: funcError,
              Warning: funcWarning };

            return funcReturn;
          });
      }
      else {
        // There is no collection for this Log...
        // get the Assets Log parameters to generate new Log Index

        var contCounter = 0;

        return mainlogDB.get()
          .then(snapshot =>{
            if(snapshot.exists)
            {
              // get the ContractCounter index...
              contCounter = snapshot.data().LogCounter;

              // Generate new transaction number...
              var newLogNum = "A" + (contCounter + 1).pad(5, '0') + ".MLOG00001";

              // create the transaction object...
              // Create transaction object...
              newMainLog = {
                logId: newLogNum,
                logDate: logdt,
                logDetails: logdetails,
                logPerformedBy: pb
              }
              // add the transaction to the collection...
              return db.collection('Maintenance').doc('Logs').collection(logDocName).doc(newLogNum).set(newMainLog);
            }
            else {
              funcSuccess = 'No';
              funcResult = {};
              funcFailReason = 'Maintenance Log Parameters are not found. Action Aborted.';
              funcError = '';

              var funcReturn = {
                Success: funcSuccess,
                Result: funcResult,
                FailReason: funcFailReason,
                Error: funcError,
                Warning: funcWarning };

              return funcReturn;
            }
          })
          .then(result => {
            // adding transaction successfully...
            // increment the ContractCounter...

            return mainlogDB.update({LogCounter: contCounter +1 });
          })
          .then(result => {
            funcSuccess = 'Ok';
            funcResult = newMainLog;
            funcFailReason = '';

            var funcReturn = {
              Success: funcSuccess,
              Result: funcResult,
              FailReason: funcFailReason,
              Error: funcError,
              Warning: funcWarning };

            return funcReturn;
          })
          .catch(err =>
          {
            funcSuccess = 'No';
            funcResult = {};
            funcFailReason = 'Error';
            funcError = err.message;

            console.log("Process: ", err);
            var funcReturn = {
              Success: funcSuccess,
              Result: funcResult,
              FailReason: funcFailReason,
              Error: funcError,
              Warning: funcWarning };

            return funcReturn;
          }
        );
      }
    })
    .catch((err) => {
      funcSuccess = 'No';
      funcResult = {};
      funcFailReason = 'Error';
      funcError = err.message;

      console.log("Process: ", err);
      var funcReturn = {
        Success: funcSuccess,
        Result: funcResult,
        FailReason: funcFailReason,
        Error: funcError,
        Warning: funcWarning };

      return funcReturn;
    });
};

export const updateMainLog = (cln, pn, ctn, atitle, mainLog) => {
  // This function updates an existing Transaction Entry in the Statement of
  // Accounts Database, based on the Client/Project/Contract combination.
  //
  // This function does no validation of the data passed.
  //

  var logdt = mainLog.logDate;
  var logdetails = mainLog.logDetails;
  var logid = mainLog.logId;
  var pb = mainLog.logPerformedBy;

  var logDocName = cln + '_' + pn + '_' + ctn + '_' + atitle;

  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";

  var db = firebase.firestore();
  var mainlogDB = db.collection('Maintenance').doc('Logs');

  /*  Function Algorethm...

  if(contract exits in SOA)
  {
    get transactions by transid

    create transaction object and update it in contract SOA collection
  }
  else {
    return an error...
  }
  */

  return mainlogDB.collection(logDocName).doc(logid).get()
    .then((snapshot) => {
      if(snapshot.exists)
      {
        // transaction found, create the update transaction object...
        var updateMainLog = {
          logId: logid,
          logDate: logdt,
          logDetails: logdetails,
          logPerformedBy: pb
        }

        // add the transaction to the collection...
        return mainlogDB.collection(logDocName).doc(logid).set(updateMainLog)
          .then(result => {
            funcSuccess = 'Ok';
            funcResult = '{}';
            funcFailReason = '';

            var funcReturn = {
              Success: funcSuccess,
              Result: funcResult,
              FailReason: funcFailReason,
              Error: funcError,
              Warning: funcWarning };

            return funcReturn;
          })
          .catch(err =>
          {
            funcSuccess = 'No';
            funcResult = {};
            funcFailReason = 'Error';
            funcError = err.message;

            console.log("Process: ", err);
            var funcReturn = {
              Success: funcSuccess,
              Result: funcResult,
              FailReason: funcFailReason,
              Error: funcError,
              Warning: funcWarning };

            return funcReturn;
          });
      }
      else {
        // Transaction not found, return an error...
        funcSuccess = 'No';
        funcResult = {};
        funcFailReason = 'Maintenance Log not found. Update aborted.';
        funcError = '';

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
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

      console.log("Process: ", err);
      var funcReturn = {
        Success: funcSuccess,
        Result: funcResult,
        FailReason: funcFailReason,
        Error: funcError,
        Warning: funcWarning };

      return funcReturn;
    });
};

export const getMainLogDoc = (cltName, prjName, contName, atitle, mainLogId) => {
  // This function retrieves the Maintenance Log based on the parameters passed 
  // and the MainLog ID provided.
  //

    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";

    //  create the Log document name
    // (Client's Name + '_' + Project's Name + '_' + Contract's Name)
    var logDocName = cltName + '_' + prjName + '_' + contName + '_' + atitle;

    var db = firebase.firestore();
    var mainlogDB = db.collection('Maintenance').doc('Logs').collection(logDocName).doc(mainLogId);

    return mainlogDB.get()
      .then((snapshot) => {
        if(snapshot.exists)
        {
          let result = snapshot.data();

          funcSuccess = 'Ok';
          funcResult = result;

        }
        else {
          funcSuccess = 'No';
          funcResult = {};
          funcFailReason = 'Could not find the log requested.';
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

// --------------------------------------------------------------

export const getMeterDoc = (prjName, contName, meterNumber) => {
  // This function gets an existing meter documen under Contract
  // under project of a Client.
  //
  // A document exists if it has fields. Collections within the document
  // do not mean it exist if it has no fields.
  //

  var pn = prjName;
  var cn = contName;
  var mtrn = meterNumber;


  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";

  var db = firebase.firestore();
  var metersDb = db.collection('Projects').doc(pn)
                    .collection('Contracts').doc(cn)
                    .collection('Meters');

  // check if a document exists for the mentioned client name...
  return metersDb.doc(mtrn).get()
    .then((snapshot) => {
      if(snapshot.exists) {
        // On successful writing of asset document to database...
        funcSuccess = 'Ok';
        funcResult = snapshot.data();

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };

        return funcReturn;

      }
      else {
        // The client document exists...
        // Do not overwrite... Return the results...
        funcSuccess = 'No';
        funcResult = {};
        funcFailReason = 'Meter does not exist.';

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
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

export const addMeter = (prjName, contName, meter) => {
  // This function creates a new Meter Record under Contract under
  // project of a Client.
  //
  // A document exists if it has fields. Collections within the document
  // do not mean it exist if it has no fields.
  //
  // The parameter meter is an object containing the meter's details... 
  // 

  var pn = prjName;
  var cn = contName;
  var mtrn = meter.Number;
  var remarks = meter.Remarks;
  var location = meter.Location;
  var mtype = meter.Type;

  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";

  
  var db = firebase.firestore();
  var metersDb = db.collection('Projects').doc(pn)
                    .collection('Contracts').doc(cn)
                    .collection('Meters');

  var newmeter = {
    Number: mtrn,
    Location: location,
    Remarks: remarks,
    Type: mtype
  };

  // check if a document exists for the mentioned client name...
  return metersDb.doc(mtrn).get()
    .then((snapshot) => {
      if(snapshot.exists) {
        // The client document exists...
        // Do not overwrite... Return the results...
        funcSuccess = 'No';
        funcResult = {};
        funcFailReason = 'Meter already exists. No Overwrite.';

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };

        return funcReturn;

      }
      else {
        // No document exists for this client... Create a new document...
        return metersDb.doc(mtrn).set(newmeter);
      }
    })
    .then((result) => {
      // On successful writing of client document to database...
      if(result)
      {
        if(!result.Success) return;

        if(result.Success === 'No')
        {
          return result;
        }
      }

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

export const updateMeter = (prjName, contName, meter) => {
  // This function updates an existing Meter Record under Contract
  // under project of a Client.
  //
  // A document exists if it has fields. Collections within the document
  // do not mean it exist if it has no fields.
  //
  // Parameter meter is an object containing the meter's details...
  //

  var pn = prjName;
  var cn = contName;
  var mtrn = meter.Number;
  var location = meter.Location;
  var remarks = meter.Remarks;

  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";

  var db = firebase.firestore();
  var metersDb = db.collection('Projects').doc(pn)
                    .collection('Contracts').doc(cn)
                    .collection('Meters');

  var updatemeter = {
    Number: mtrn,
    Location: location,
    Remarks: remarks
  };

  // check if a document exists for the mentioned client name...
  return metersDb.doc(mtrn).get()
    .then((snapshot) => {
      if(snapshot.exists) {
        return metersDb.doc(mtrn).update(updatemeter);
      }
      else {
        // The client document exists...
        // Do not overwrite... Return the results...
        funcSuccess = 'No';
        funcResult = {};
        funcFailReason = 'Meter does not exist.Update Aborted.';

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
      // On successful writing of asset document to database...
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
      funcResult = '{}';
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

export const getMetersList = (prjName, contName) => {
  // This function gets list of existing meters under Contract
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
  var metersDb = db.collection('Projects').doc(pn)
                    .collection('Contracts').doc(cn)
                    .collection('Meters');

  // check if a document exists for the mentioned client name...
  return metersDb.get()
    .then((snapshot) => {
      let meters = [];

      if(snapshot.docs.length > 0) {
       
        snapshot.forEach(docMeter => {
          meters.push(docMeter.data());
        });

        funcSuccess = 'Ok';
        funcResult = meters;
      }
      else {
        // The client document exists...
        // Do not overwrite... Return the results...
        funcSuccess = 'No';
        funcResult = meters;
        funcFailReason = 'No meters found. Returning empty list.';
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

// --------------------------------------------------------------

export const getMeterReadingDoc = (cltName, prjName, contName, meterNumber, mrDate) => {
  // This function gets an existing meter documen under Contract
  // under project of a Client.
  //
  // A document exists if it has fields. Collections within the document
  // do not mean it exist if it has no fields.
  //

  var pn = prjName;
  var cn = contName;
  var mtrn = meterNumber;

  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";

  var db = firebase.firestore();
  var metersDb = db.collection('Projects').doc(pn)
                    .collection('Contracts').doc(cn)
                    .collection('Meters').doc(mtrn)
                    .collection('Readings').doc(mrDate);

  // check if a document exists for the mentioned meter...
  return metersDb.get()
    .then((snapshot) => {
      if(snapshot.exists) {
        // On successful writing of asset document to database...
        funcSuccess = 'Ok';
        funcResult = snapshot.data();

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };

        return funcReturn;

      }
      else {
        funcSuccess = 'No';
        funcResult = {};
        funcFailReason = 'Meter Reading does not exist for the given date.';

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
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

export const addMeterReading = (CltName, prjName, contName, meterNumber, meterReading) => {
  // This function creates a new Meter Record under Contract under
  // project of a Client.
  //
  // A document exists if it has fields. Collections within the document
  // do not mean it exist if it has no fields.
  //
  // The parameter meter is an object containing the meter's details... 
  // 

  var pn = prjName;
  var cn = contName;
  var mtrn = meterNumber;
  var mtrrd = meterReading.readingDate;


  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";


  var db = firebase.firestore();
  var metersDb = db.collection('Projects').doc(pn)
                    .collection('Contracts').doc(cn)
                    .collection('Meters').doc(mtrn)
                    .collection('Readings');


  // check if a document exists for the mentioned client name...
  return metersDb.doc(mtrrd).get()
    .then((snapshot) => {
      if(snapshot.exists) {
        // The meter reading document for the specified date exists...
        // Do not overwrite... Return the results...
        funcSuccess = 'No';
        funcResult = {};
        funcFailReason = 'Meter Reading for this day already exists. No Overwrite.';

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };

        return funcReturn;

      }
      else {
        // No document exists for this client... Create a new document...
        return metersDb.doc(mtrrd).set(meterReading);
      }
    })
    .then((result) => {
      // On successful writing of client document to database...
      if(result)
      {
        if(!result.Success) return;

        if(result.Success === 'No')
        {
          return result;
        }
      }

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

export const updateMeterReading = (prjName, contName, meterNumber, meterReading) => {
  // This function updates an existing Meter Record under Contract
  // under project of a Client.
  //
  // A document exists if it has fields. Collections within the document
  // do not mean it exist if it has no fields.
  //
  // Parameter meter is an object containing the meter's details...
  //

  var pn = prjName;
  var cn = contName;
  var mtrn = meterNumber;
  var mrdt = meterReading.readingDate;

  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";

  var db = firebase.firestore();
  var metersDb = db.collection('Projects').doc(pn)
                    .collection('Contracts').doc(cn)
                    .collection('Meters').doc(mtrn)
                    .collection('Readings').doc(mrdt);

  // check if a document exists for the mentioned client name...
  return metersDb.get()
    .then((snapshot) => {
      if(snapshot.exists) {
        return metersDb.update(meterReading);
      }
      else {
        // The client document exists...
        // Do not overwrite... Return the results...
        funcSuccess = 'No';
        funcResult = {};
        funcFailReason = 'Meter reading does not exist. Update Aborted.';

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
      // On successful writing of asset document to database...
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
      funcResult = '{}';
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

export const getMeterReadingList = (cltName, prjName, contName, meterNumber) => {
  // This function gets list of existing meters under Contract
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
  var metersDb = db.collection('Projects').doc(pn)
                    .collection('Contracts').doc(cn)
                    .collection('Meters');

  // check if a document exists for the mentioned client name...
  return metersDb.doc(meterNumber).collection('Readings').get()
    .then((snapshot) => {
      let meterReadings = [];

      if(snapshot.docs.length > 0) {
       
        snapshot.forEach(docMeterReading => {
          meterReadings.push(docMeterReading.data());
        });

        funcSuccess = 'Ok';
        funcResult = meterReadings;
      }
      else {
        // The client document exists...
        // Do not overwrite... Return the results...
        funcSuccess = 'No';
        funcResult = meterReadings;
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

