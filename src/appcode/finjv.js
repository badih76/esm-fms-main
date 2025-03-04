import { firebase } from '../constants/firebase';

Number.prototype.pad = function (size, c) {
    var s = String(this);
    while (s.length < (size || 2)) { s = c + s; }
    return s;
}

export const getProjects = async () => {
    // This function gets the list of all existing Projects.
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
    return projectsDb.get()
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

            console.log("Projects: ", projects);
            funcSuccess = 'Ok';
            funcResult = projects;
            
        }
        else
        {
            funcSuccess = 'No';
            funcResult = '{}';
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

export const addJVTransaction = async (transaction) => {
    // This function creates a new JV Entry in Accounts Database.
    // This function does no validation of the data passed.
    // This function always considers the request as for a new JV
    // and generates a new JV Serial Number.
    //
    // The function accepts the following params:
    // 1. JV Date
    // 2. Description
    // 6. JV Amount
    // 7. Transaction Type (Dr / Cr)
    // 8. Project Code to charge (if any)
    //

    console.log(transaction);
    var jvd = transaction.transDate;
    var jvdesc = transaction.transDesc;
    var jva = parseFloat(transaction.transAmount);
    var jvtt = transaction.transType;
    var prjn = transaction.projectName;

    var newjvnumber = "";

    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";

    var db = firebase.firestore();
    var accountsDb = db.collection('Accounts').doc('Transactions').collection('JournalVouchers');

    return accountsDb.get()
      .then((snapshot) => {
        console.log(snapshot.docs.length);
        // Check the number of documents found and generate a new number accordingly...
        var docsCount = snapshot.docs.length;
        newjvnumber = "JV" + docsCount.pad(8, '0');

        console.log(newjvnumber);

        // Create the document...
        var newjv = {
          jvNumber: newjvnumber,
          jvDate: jvd,
          jvDescription: jvdesc,
          jvAmount: jva,
          jvTransType: jvtt,
          prjName: prjn
        }

        console.log('JV: ', newjv);
        return accountsDb.doc(newjvnumber).set(newjv);
      })
      .then((result) => {
        // The JV entry created successfully...
        // Return successfull JV Entry...
        // Do not overwrite... Return the results...

        var jvtt = transaction.transType;
        var prjn = transaction.targetProj;

        if(prjn !== "Petty Cash")
        {
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
        }
        else {
          // Get the Petty Cash Value to be altered...
          return db.collection('Accounts').doc('PettyCash').get();
        }

      })
      .then(snapshot => {
        if(snapshot.exists)
        {
          var pcValue = snapshot.data().Value;

          if(jvtt === "Credit")
          {
            // add the received value to the existing PC value...
            pcValue = pcValue + jva;
          }
          else {
            pcValue = pcValue - jva;
          }

          return db.collection('Accounts').doc('PettyCash').update({ Value: pcValue });
        }
      })
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
      .catch((err) => {
        funcSuccess = 'No';
        funcResult = '{}';
        funcFailReason = 'Error';
        funcError = err.message;

        console.log(err);
        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };

        return funcReturn;
      });

};

export const getJVTransactions = async () => {
    // This function gets the list of all JV transactions.
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

    var accountsDb = db.collection('Accounts').doc('Transactions').collection('JournalVouchers');

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
          funcResult = '{}';
          funcFailReason = 'Could not find any JV Transactions. Returning empty list';
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
