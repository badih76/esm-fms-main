import { firebase } from '../constants/firebase';

Number.prototype.pad = function (size, c) {
    var s = String(this);
    while (s.length < (size || 2)) { s = c + s; }
    return s;
}

// *************************************************************************
// Define the nodemailer...
// *************************************************************************

// const nodemailer = require('nodemailer');

// const sendNewJCEmail = (jcn, jcd, jct, jce) => {
//   var db = firebase.firestore();
//   var dependDb = db.collection('Dependencies');

//   let transporter = null;
//   let mailOptions = {};

//   // get the transporter definition from dependencies...
//   return dependDb.doc('transporter').get()
//     .then(snapshot => {
//       if(snapshot.exists)
//       {
//         transporter = nodemailer.createTransport(snapshot.data());
//         console.log('transporter: ', transporter);

//         return dependDb.doc('mailOptions').get();
//       }
//       else {
//         console.log('Transporter Records are not found. Email Sending Aborted.');
//         return false;
//       }
//     })
//     .then(snapshot => {
//       if(snapshot.exists)
//       {
//         mailOptions = snapshot.data();
//         mailOptions.to = jce;

//         return dependDb.doc('newJCMailComposer').get()
//       }
//       else {
//         console.log('Mail Options are not found. Email Sending Aborted.');
//         return false;
//       }
//     })
//     .then (snapshot => {
//       if(snapshot.exists)
//       {
//         let t = snapshot.data().text;
//         t = t.replace('{jcn}', jcn);
//         t = t.replace('{jcd}', jcd);
//         t = t.replace('{jct}', jct);

//         let h = snapshot.data().html;
//         h = h.replace('{jcn}', jcn);
//         h = h.replace('{jcd}', jcd);
//         h = h.replace('{jct}', jct);

//         mailOptions.text = t;
//         mailOptions.html = h;

//         return true;
//       }
//       else {
//         console.log('Mail Templates are not found. Email Sending Aborted.');
//         return false;
//       }

//     })
//     .then (result => {
//       console.log('transporter: ', transporter);
//       // send mail with defined transport object
//       transporter.sendMail(mailOptions)
//         .then(() => {
//           console.log('Message Sent');
//           // res.send('Message Sent');
//           return true;
//         })
//         .catch(err => {
//           console.log('Error Sending Message: ', err);
//           // res.send('Error Sending Message: ', err);
//           return false;
//         });
//     })
//     .catch(err => {
//       console.log('Error Occured. Email Sending Aborted. ' + err);
//       return false;
//     });

// };

// *************************************************************************

export const addJobCard = (jc) => {
    // This function creates a new Job Card Document and uses the JobNumber
    // field to create the Job Card number and update the Job Card Number
    // field accordingly.
    //
    // A document exists if it has fields. Collections within the document
    // do not mean it exist if it has no fields.
    // the jc parameter is an object containing the JC details...
    //

    var newJCNum = '';
    var jcNum = 0;
    var jcd = jc.jcDate;
    var jct = jc.jcTime;
    var jctkt = jc.jcTicketNum;
    var jcPName = jc.jcPrjName;
    var jcCName = jc.jcContName;
    var jcdetails = jc.jcDetails;
    var jcstate = jc.jcStatus;

    var newjobcard = {};

    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";

    var db = firebase.firestore();
    var maintenanceDb = db.collection('Maintenance');

    // Get the last Job Card number used to create a new Job Card Number...
    return maintenanceDb.doc('Jobs').get()
      .then((snapshot) => {
        if(snapshot.exists) {
          // The Jobs Document fetch successfully...
          // Get the last Job Card Number...

          jcNum = snapshot.data().JobNumber;

          // Create new Job Card Number...
          newJCNum = 'JC' + jcNum.pad(6, '0');

          var d = new Date(jcd);
          var m = d.getMonth() + 1;
          var y = d.getFullYear();
          newjobcard = {
            jcNumber: newJCNum,
            jcDate: jcd,
            jcMonth: m,
            jcYear: y,
            jcTime: jct,
            jcTicketNum: jctkt,
            jcPrjName: jcPName,
            jcContName: jcCName,
            jcDetails: jcdetails,
            jcStatus: jcstate
          };

          // New JC Number create successfully. Add the new JC to the JobCards Table...
          return maintenanceDb.doc('Jobs').collection('JobCards').doc(newJCNum).set(newjobcard);
        }
        else {
          funcSuccess = 'No';
          funcResult = {};
          funcFailReason = 'Could not create new Job Card Number. Action aborted.';

          var funcReturn = {
            Success: funcSuccess,
            Result: funcResult,
            FailReason: funcFailReason,
            Error: funcError,
            Warning: funcWarning };

          return funcReturn;
        }
      })
      .then((setResult) => {

          return maintenanceDb.doc('Jobs').set({ JobNumber: jcNum + 1 });

      })
      .then(result => {
        // send the email to concerned contract contact person...
        // start by getting the contract document...
        return db.collection('Projects').doc(jcPName)
                 .collection('Contracts').doc(jcCName).get();
      })
      .then(snapshot => {
        if(snapshot.exists)
        {
          // get the contact details of the contract contact...
          // var contEmails = snapshot.data().contactEmails;
          // return sendNewJCEmail(newJCNum, jcd, jct, contEmails);

          return true;
        }
        else {
          // failed to get the contract details
          // and therefore email sending is aborted...

        }
      })
      .then((result) => {
        // On successful writing of new Job Card document to database...
        funcSuccess = 'Ok';
        funcResult = newjobcard;

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
          console.log(funcReturn);
        
        return funcReturn;
      });
};

export const updateJobCard = (jc) => {
    // This function updates the details of an existing Job Card Document.
    //
    // A document exists if it has fields. Collections within the document
    // do not mean it exist if it has no fields.
    //
    // The function accepts the following params:
    // 1. Job Card Number
    // 2. Job Description and Details
    //

    var jcNumber = jc.jcNumber;
    var jcDetails = jc.jcDetails;
    var jcstate = jc.jcStatus;

    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";

    var db = firebase.firestore();
    var maintenanceDb = db.collection('Maintenance').doc('Jobs').collection('JobCards');

    // Get the last Job Card number used to create a new Job Card Number...
    return maintenanceDb.doc(jcNumber).get()
      .then((snapshot) => {
        if(snapshot.exists) {
          // The Jobs Card fetched successfully...
          // Update the JC Details...

          // New JC Number create successfully. Add the new JC to the JobCards Table...
          return maintenanceDb.doc(jcNumber).update({jcDetails: jcDetails, jcStatus: jcstate});
        }
        else {
          funcSuccess = 'No';
          funcResult = {};
          funcFailReason = 'Job Card Not Found. Action aborted.';

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
        // On successful writing of new Job Card document to database...
        funcSuccess = 'Ok';
        funcResult = jcNumber;

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
          console.log(funcReturn);
        return funcReturn;
      });
};

export const getJobCardList = () => {
    // This function gets the list all existing Job Cards documents.
    //
    // A document exists if it has fields. Collections within the document
    // do not mean it exist if it has no fields.
    //
    // The function accepts no params:
    //

    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";

    var result = [];

    var db = firebase.firestore();
    var maintenanceDb = db.collection('Maintenance').doc('Jobs').collection('JobCards');

    // Get the documents in this collection...
    return maintenanceDb.get()
      .then((snapshot) => {
        // go through the snapshot docs and get the JC Numbers and push
        // them into a JSON string...

        if(snapshot.docs.length == 0)
        { // There are no docs in the snapshot...
          funcSuccess = 'No';
          funcResult = [];
          funcFailReason = 'There are no Job Cards found. Returning Empty List.';

        }
        else {
          
            snapshot.forEach((docJobCard) => {
                let jc = { 
                    jcNumber: docJobCard.id, 
                    jcStatus: docJobCard.data().jcStatus    
                };
                
                result.push(jc);
            });

            funcSuccess = 'Ok';
            funcResult = result;
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

export const getJobCardListOfProject = (projectName) => {
  // This function gets the list all existing Job Cards documents.
  //
  // A document exists if it has fields. Collections within the document
  // do not mean it exist if it has no fields.
  //
  // The function accepts no params:
  //

  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";

  var result = [];

  var db = firebase.firestore();
  var maintenanceDb = db.collection('Maintenance').doc('Jobs').collection('JobCards');

  // Get the documents in this collection...
  return maintenanceDb.where('jcPrjName', '==', projectName).get()
    .then((snapshot) => {
      // go through the snapshot docs and get the JC Numbers and push
      // them into a JSON string...

      if(snapshot.docs.length == 0)
      { // There are no docs in the snapshot...
        funcSuccess = 'No';
        funcResult = [];
        funcFailReason = 'There are no Job Cards found. Returning Empty List.';

      }
      else {
        
          snapshot.forEach((docJobCard) => {
              let jc = { 
                  jcNumber: docJobCard.id, 
                  jcDate: docJobCard.data().jcDate,
                  jcPrjName: docJobCard.data().jcPrjName,
                  jcContName: docJobCard.data().jcContName,
                  jcStatus: docJobCard.data().jcStatus    
              };
              
              result.push(jc);
          });

          funcSuccess = 'Ok';
          funcResult = result;
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

export const getJobCardDoc = (jcn) => {
    // This function gets an existsing Job Card document by its number.
    //
    // A document exists if it has fields. Collections within the document
    // do not mean it exist if it has no fields.
    //
    // The function accepts the following params:
    // 1. Job Card Number
    //

    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";

    var db = firebase.firestore();
    var maintenanceDb = db.collection('Maintenance').doc('Jobs').collection('JobCards');

    // check if a document exists for the mentioned Job Card Number...
    return maintenanceDb.doc(jcn).get()
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
          // No document exists for this job card... Return result...
          funcSuccess = 'No';
          funcResult = {};
          funcFailReason = 'Job Card do not exist.'

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

// ----------------------------------------------------------------------

export const getProjectsList = async () => {
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

// ----------------------------------------------------------------------

export const getTicketsList = () => {
  // This function gets the list all existing Tickets documents.
  //
  // A document exists if it has fields. Collections within the document
  // do not mean it exist if it has no fields.
  //
  // The function accepts no params:
  //

  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";

  var result = [];

  var db = firebase.firestore();
  var maintenanceDb = db.collection('HelpDesk');

  // Get the documents in this collection...
  return maintenanceDb.get()
    .then((snapshot) => {
      // go through the snapshot docs and get the Ticket Numbers and push
      // them into a JSON string...

      if(snapshot.docs.length == 0)
      { // There are no docs in the snapshot...
        funcSuccess = 'No';
        funcResult = [];
        funcFailReason = 'There are no Tickets found. Returning Empty List.';

      }
      else {
        
          snapshot.forEach((docTicket) => {
            if(docTicket.TicketStatus !== 'Closed')
            {
              let tkt = { 
                  ticketNumber: docTicket.id
              };
              result.push(tkt);
            }
          });

          funcSuccess = 'Ok';
          funcResult = result;
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
