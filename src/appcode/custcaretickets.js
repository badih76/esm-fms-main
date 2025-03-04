import { firebase } from '../constants/firebase';
import { EmailType, sendEmail } from './emailservice';
import { fromHtmlEntities, toHtmlEntities } from './general-use';

Number.prototype.pad = function (size, c) {
    var s = String(this);
    while (s.length < (size || 2)) { s = c + s; }
    return s;
}


export const getTicketsList = async () => {
    
    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";

    var db = firebase.firestore();
    
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    var ticketsDb = db.collection('HelpDesk');

    var tickets = [];

    return ticketsDb.get()
    .then((snapshot) => {

        if (snapshot.docs.length > 0)
        {
            snapshot.forEach((docTicket) => {
                tickets.push({...docTicket.data(), TicketNum: docTicket.id});

            });

            funcSuccess = 'Ok';
            funcResult = tickets;
            
        }
        else
        {
            funcSuccess = 'No';
            funcResult = [];
            funcFailReason = 'No Tickets were found. Returning empty list.';
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

export const getComplCat = async () => {
    
    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";

    var db = firebase.firestore();
    
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    var ticketsDb = db.collection('Dependencies').doc('HelpDesk').collection('Categories');

    var compleCatList = [];

    return ticketsDb.get()
    .then((snapshot) => {

        if (snapshot.docs.length > 0)
        {
            snapshot.forEach((docTicket) => {
                compleCatList.push(docTicket.data().categName);

            });

            funcSuccess = 'Ok';
            funcResult = compleCatList;
            
        }
        else
        {
            funcSuccess = 'No';
            funcResult = [];
            funcFailReason = 'No Ticket Categories were found. Returning empty list.';
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

export const getTicketReplies = async (ticketNum) => {
    
    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";

    var db = firebase.firestore();
    
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    var ticketsDb = db.collection('HelpDesk');

    var replies = [];

    return ticketsDb.doc(ticketNum).collection('Replies').get()
    .then((snapshot) => {
        
        if (snapshot.docs.length > 0)
        {
            snapshot.forEach((docReply) => {
                let reply = {
                    Details: fromHtmlEntities(docReply.data().Details),
                    FileAttachment: docReply.data().FileAttachment,
                    RepliedBy: docReply.data().RepliedBy,
                    replyId: docReply.id
                }

                replies.push(reply);

            });

            funcSuccess = 'Ok';
            funcResult = replies;
            
        }
        else
        {
            funcSuccess = 'No';
            funcResult = [];
            funcFailReason = 'No Replies were found. Returning empty list.';
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

export const addTicketSupport = (ticket, uprofile) => {
    // This function creates a new Ticket document.
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
    
    var newticket = {...ticket};

    var ticketcounter = 0;
    let clContEmail = '';

    let emailComponents = {
        ticket_number: "",
        subject: "",
        date_time: "",
        opened_by: "",
        cl_prj_cont: "",
        subj_cat: "",
        subject: "",
        details: "",
        from_name: 'Experts Service Management',
        email_to: '',
        email_from: '',
        reply_to: ''
    }

    // get the tickets counter from the Dependencies/HelpDesk document...
    return db.collection('Dependencies').doc('HelpDesk').get()
        .then(snapshot => {
            ticketcounter = snapshot.data().TicketCounter;
            newticket.TicketNum = 'AFMS' + ticketcounter.pad(6, '0');

            return db.collection('HelpDesk').doc('AFMS' + ticketcounter.pad(6, '0')).set(newticket);
        })
        .then((setResult) => {

            return db.collection('Dependencies').doc('HelpDesk').update({ TicketCounter: ticketcounter + 1 });

        })
        .then(retval => {
            return db.collection('Inventory').doc('Assets').collection('Clients')
                    .where('clName', '==', newticket.ClientName).get()
        })
        .then((snapshot) => {
            clContEmail = snapshot.docs[0].data().clEmail;

            // get the default email of the helpdesk
            return db.collection('Dependencies').doc('HelpDesk').get();
        })
        .then(snapshot => {
            let hdEmail = snapshot.data().email;
            let emailServiceID = snapshot.data().emailServiceID;
            let emailServiceUserID = snapshot.data().emailServiceUserID;
            let obUserEmail = uprofile.email;

            var newTNumber = {
                TicketNumber: 'AFMS' + ticketcounter.pad(6, '0')
            };

            emailComponents.ticket_number = 'AFMS' + ticketcounter.pad(6, '0');
            emailComponents.subject = newticket.Subject;
            emailComponents.date_time = newticket.tsOpeningDT;
            emailComponents.opened_by = newticket.ReportedBy;
            emailComponents.cl_prj_cont = newticket.ClientName + "\\" + newticket.ProjectName + "\\" + newticket.ContractName;
            emailComponents.subj_cat = newticket.ComplCat;
            emailComponents.details = newticket.Details;
            emailComponents.email_to = hdEmail + ', ' + obUserEmail + ', ' + clContEmail;
            emailComponents.email_from = hdEmail;
            emailComponents.reply_to = hdEmail;
        
            var funcReturn = {
                Success: 'Ok',
                Result: newTNumber.TicketNumber,
                FailReason: '',
                Error: '',
                Warning: ''
            };

            return sendEmail(emailComponents, EmailType.NEW_TKT, emailServiceID, emailServiceUserID)
                .then(result => {
                    return funcReturn;
                })
                .catch(err => {
                    funcResult.Warning = 'Email Sending Failure!';
                    console.log('There was an error sending the email.', err);
                    return funcReturn;
                });

        })
        .catch((err) => {
            funcSuccess = 'No';
            funcResult = 'ERROR';
            funcFailReason = 'Error';
            funcError = err.message;
            console.log('Error occured: ', err);
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

export const postTicketReplySupport = (ticket, reply, status, uprofile) => {
    // This function posts a new Ticket Reply document.
    //
    // A document exists if it has fields. Collections within the document
    // do not mean it exist if it has no fields.
    //

    console.log('postTicketReplySupport: ', reply);
    var tn = ticket.TicketNum;
    var rb = reply.RepliedBy;
    var rdt = reply.tsReplyDT;
    var rd = toHtmlEntities(reply.Details);
    // var san = req.body.attachedfiles;


    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";

    var db = firebase.firestore();

    const settings = { timestampsInSnapshots: true };
    db.settings(settings);
    
    let clContEmail = '';

    console.log('You passed FileAttachment as: ', reply.FileAttachment);

    var newreply = {
        RepliedBy: rb,
        Details: rd,
        FileAttachment: {...reply.FileAttachment},
        tsReplyDT: new Date(rdt)
    }

    let emailComponents = {
        ticket_number: "",
        subject: "",
        date_time: "",
        opened_by: "",
        cl_prj_cont: "",
        subj_cat: "",
        subject: "",
        details: "",
        from_name: 'Experts Service Management',
        email_to: '',
        email_from: '',
        reply_to: ''
    }

    return db.collection('HelpDesk').doc(tn).collection('Replies').doc(reply.replyId).set(newreply)
        .then (result => {
            return db.collection('HelpDesk').doc(tn).update({ TicketStatus: status})
        })
        .then(retval => {
            
            return db.collection('HelpDesk').where('TicketNum', '==', tn).get()
        })
        .then(snapshot => {
            // fetch the concerned client's record to get the client default email address
            return db.collection('Inventory').doc('Assets').collection('Clients')
                .where('clName', '==', snapshot.docs[0].data().ClientName).get()
        })
        .then((snapshot) => {
            clContEmail = snapshot.docs[0].data().clEmail;

            // get the default email of the helpdesk
            return db.collection('Dependencies').doc('HelpDesk').get();
        })
        .then(snapshot => {
            let hdEmail = snapshot.data().email;
            let emailServiceID = snapshot.data().emailServiceID;
            let emailServiceUserID = snapshot.data().emailServiceUserID;
            let obUserEmail = uprofile.email;
            
            emailComponents.ticket_number = tn;
            emailComponents.subject = ticket.Subject;
            emailComponents.date_time = rdt;
            emailComponents.opened_by = rb;
            emailComponents.cl_prj_cont = ticket.ClientName + "\\" + ticket.ProjectName + "\\" + ticket.ContractName;
            // emailComponents.subj_cat = newticket.ComplCat;
            emailComponents.details = reply.Details;
            emailComponents.email_to = hdEmail+ ', ' + obUserEmail + ', ' + clContEmail;
            emailComponents.email_from = hdEmail;
            emailComponents.reply_to = hdEmail;

            var funcReturn = {
                Success: 'Ok',
                Result: {},
                FailReason: '',
                Error: '',
                Warning: ''
            };

            return sendEmail(emailComponents, EmailType.REPLY_TKT, emailServiceID, emailServiceUserID)
                .then(result => {
                    return funcReturn;
                })
                .catch(err => {
                    funcResult.Warning = 'Email Sending Failure!';
                    console.log('There was an error sending the email.', err);
                    return funcReturn;
                });

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

export const getUserDisplayName = async (UID) => {
    
    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";

    var db = firebase.firestore();
    
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    var usersDb = db.collection('Users').doc('docUsers').collection('colUsers');

    var users = [];

    return usersDb.where('UID', '==', UID).get()
    .then((snapshot) => {

        if (snapshot.docs.length > 0)
        {
            snapshot.forEach((docUser) => {
                users.push(docUser.data().displayName);

            });

            funcSuccess = 'Ok';
            funcResult = users;
            
        }
        else
        {
            funcSuccess = 'No';
            funcResult = [];
            funcFailReason = 'No matching UIDs were found. Returning empty list.';
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

