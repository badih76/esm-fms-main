import { firebase } from '../constants/firebase';

Number.prototype.pad = function (size, c) {
    var s = String(this);
    while (s.length < (size || 2)) { s = c + s; }
    return s;
}

export const getTicketsStatistics = async () => {
    
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
    var ticketsStatistics = {

    };

    return ticketsDb.get()
    .then((snapshot) => {

        if (snapshot.docs.length > 0)
        {
            snapshot.forEach((docTicket) => {
                tickets.push({...docTicket.data(), TicketNum: docTicket.id});

            });

            let openTickets = tickets.filter(t => { return t.TicketStatus === 'Open'});
            let closedTickets = tickets.filter(t => { return t.TicketStatus === 'Closed'});
            let inProgTickets = tickets.filter(t => { return t.TicketStatus === 'In Progress'});
            
            ticketsStatistics.Open = openTickets.length;
            ticketsStatistics.Closed = closedTickets.length;
            ticketsStatistics.InProgress = inProgTickets.length;

            funcSuccess = 'Ok';
            funcResult = ticketsStatistics;
            
        }
        else
        {
            funcSuccess = 'No';
            funcResult = {};
            funcFailReason = 'Could not fetch statistics. Returning empty list.';
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
