import { firebase } from '../constants/firebase';

Number.prototype.pad = function (size, c) {
    var s = String(this);
    while (s.length < (size || 2)) { s = c + s; }
    return s;
}

export const getClientsNames = async () => {
    // This function gets the list of all existing Clients Names with Codes.
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

    var clientsDb = db.collection('Inventory').doc('Assets').collection('Clients');

    var clients = [];
    var clientName = '';


    // get the document containing the complain categories as fields name
    // from the Dependencies/HDeskComplCat document...
    return clientsDb.get()
    .then((snapshot) => {

        if (snapshot.docs.length > 0)
        {
            snapshot.forEach((docClient) => {
                clientName = docClient.data().clName;
                clients.push(clientName);

            });

            funcSuccess = 'Ok';
            funcResult = clients;
            
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

export const getProjectsOfClient = async (clientName) => {
    // This function gets the list of all existing Projects for the given Client.
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

    var projectsDb = db.collection('Projects');

    var projects = [];

    // get the document containing the complain categories as fields name
    // from the Dependencies/HDeskComplCat document...
    return projectsDb.where("clientName", "==", clientName).get()
    .then((snapshot) => {

        if (snapshot.docs.length > 0)
        {
            snapshot.forEach((docProject) => {
                let project = {
                    name: docProject.data().prjName,
                    code: docProject.data().prjCode
                }

                projects.push(project);

            });

            funcSuccess = 'Ok';
            funcResult = projects;
            
        }
        else
        {
            funcSuccess = 'No';
            funcResult = [];
            funcFailReason = 'No Projects were found. Returning empty list.';
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

export const getContractsForProject = async (projectName) => {
    // This function gets the list of all existing Contracts for the given Project.
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

    var projectsDb = db.collection('Projects').doc(projectName).collection('Contracts');

    var contracts = [];

    // get the document containing the complain categories as fields name
    // from the Dependencies/HDeskComplCat document...
    return projectsDb.get()
    .then((snapshot) => {

        if (snapshot.docs.length > 0)
        {
            snapshot.forEach((docContract) => {
                let contract = {
                    name: docContract.data().contName,
                    code: docContract.data().contCode
                }

                contracts.push(contract);

            });

            funcSuccess = 'Ok';
            funcResult = contracts;
            
        }
        else
        {
            funcSuccess = 'No';
            funcResult = [];
            funcFailReason = 'No Contracts were found. Returning empty list.';
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

export const addSOATransaction = async (transaction) => {
    var cln = transaction.clientName;
    var pn = transaction.projectName;
    var ctn = transaction.contractName;
    var trdt = transaction.transDate;
    var trclass = transaction.transClass;
    var trdesc = transaction.transDesc;
    var trtype = transaction.transType;
    var tramount = parseFloat(transaction.transAmount);

    var soaDocName = cln + '_' + pn + '_' + ctn;
    var newTrNumber = '';

    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";


    var db = firebase.firestore();
    
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    var accountsDb = db.collection('Accounts').doc('SOA');

    return accountsDb.collection(soaDocName).get()
      .then((snapshot) => {
        if(snapshot.docs.length > 0)
        {
          // there is an SOA collection for this contract...
          // get the first document's ID...
          var trId = snapshot.docs[0].id;

          // get the count of transactions in collection...
          var trCount = snapshot.docs.length + 1;

          // generate new transaction number...
          newTrNumber = trId.split('.')[0] + '.Tr' + trCount.pad(5, '0');

          // Create transaction object...
          var newTransaction = {
            transId: newTrNumber,
            transDate: trdt,
            transClass: trclass,
            transDesc: trdesc,
            transType: trtype,
            transAmount: tramount
          }

          // add the transaction to the collection...
          return accountsDb.collection(soaDocName).doc(newTrNumber).set(newTransaction)
            
        }
        else {
          // There is no collection for this contract's SOA...
          // get the SOA parameters to generate new ContractCounter Index

          var contCounter = 0;

          return accountsDb.get()
            .then(snapshot =>{
              if(snapshot.exists)
              {
                // get the ContractCounter index...
                contCounter = snapshot.data().ContractCounter;

                // Generate new transaction number...
                newTrNumber = "C" + (contCounter + 1).pad(5, '0') + ".Tr00001";

                // create the transaction object...
                // Create transaction object...
                var newTransaction = {
                  transId: newTrNumber,
                  transDate: trdt,
                  transClass: trclass,
                  transDesc: trdesc,
                  transType: trtype,
                  transAmount: tramount
                }

                // add the transaction to the collection...
                return db.collection('Accounts').doc('SOA').collection(soaDocName).doc(newTrNumber).set(newTransaction);
              }
              else {
                funcSuccess = 'No';
                funcResult = '{}';
                funcFailReason = 'Statement of Accounts Parameters are not found. Action Aborted.';
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

              return accountsDb.update({ContractCounter: contCounter +1 });
            })
            .then(result => {
              funcSuccess = 'Ok';
              funcResult = newTrNumber;
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
            }
          );
        }
      })
      .then(result => {
        funcSuccess = 'Ok';
        funcResult = newTrNumber;
        funcFailReason = '';
        funcError = '';

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

export const updateSOATransaction = async (cln, pn, ctn, transaction) => {
    var soaDocName = cln + '_' + pn + '_' + ctn;
    
    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";


    var db = firebase.firestore();
    
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    var accountsDb = db.collection('Accounts').doc('SOA').collection(soaDocName);

    return accountsDb.doc(transaction.transId).update(transaction)
        .then(result => {
            funcSuccess = 'Ok';
            funcResult = result;
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
            funcError = err;

            var funcReturn = {
            Success: funcSuccess,
            Result: funcResult,
            FailReason: funcFailReason,
            Error: funcError,
            Warning: funcWarning };

            return funcReturn;
        });
};

export const getContractSOA = async (clientName, projectName, contractName) => {
    // This function gets the list of all transactions in the Contract's SOA.
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

    //  create the SOA document name
    // (Client's Name + '_' + Project's Name + '_' + Contract's Name)
    var soaDocName = clientName + '_' + projectName + '_' + contractName;

    var accountsDb = db.collection('Accounts').doc('SOA').collection(soaDocName);

    // get the document containing the complain categories as fields name
    // from the Dependencies/HDeskComplCat document...
    return accountsDb.get()
    .then((snapshot) => {
        if(snapshot.docs.length > 0)
        {
          var transactions = [];
          snapshot.forEach((docTr) => {
            transactions.push(docTr.data());
          });

          funcSuccess = 'Ok';
          funcResult = transactions;

        }
        else {
          // Do not overwrite... Return the results...
          funcSuccess = 'No';
          funcResult = [];
          funcFailReason = 'Could not find Transactions for given Client/Project/Contract.';
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
