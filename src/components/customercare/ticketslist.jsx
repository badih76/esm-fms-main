import React, { Component } from 'react';

String.prototype.formatDate = function (format, separator) {
    let sDt = this;
    let aDt = (sDt.split('-').length > 1) ? sDt.split('-') : sDt.split('/');
    let fOpt = (sDt.split('-').length > 1) ? 1 : 2;
    let f = format.split(separator);

    let nDD=(fOpt === 1) ? (aDt[2].split(' '))[0] : aDt[1], 
        nMM=(fOpt === 1) ? aDt[1] : aDt[0], 
        nYYYY=(fOpt === 1) ? aDt[0] : (aDt[2].split(' '))[0],
        nDt = "";

    switch(f[0])
    {
        case 'dd':
            nDt = nDD + separator;
            break;

        case 'MM':
            nDt = nMM + separator;
            break;

        case 'mm':
            nDt = nMM + separator;
            break;

        case 'yyyy':
            nDt = nYYYY + separator;
            break;

    }

    switch(f[1])
    {
        case 'dd':
            nDt += nDD + separator;
            break;

        case 'MM':
            nDt += nMM + separator;
            break;

        case 'mm':
            nDt += nMM + separator;
            break;

        case 'yyyy':
            nDt += nYYYY + separator;
            break;

    }

    switch(f[2])
    {
        case 'dd':
            nDt += nDD;
            break;

        case 'MM':
            nDt += nMM;
            break;

        case 'mm':
            nDt += nMM;
            break;

        case 'yyyy':
            nDt += nYYYY;
            break;

    }
      
    return nDt;
}


class TicketsList extends Component {
   render() {
       const { tickets, onTicketClick } = this.props;

        return (
            <React.Fragment>
                <table className="table table-striped table-hover" 
                    style={{fontSize: "0.75vw"}}>
                    <thead>
                        <tr className="info">
                            <th style={{width: "10%"}}>Ticket #</th>
                            <th style={{width: "10%"}}>Date</th>
                            <th style={{textAlign: "center"}}>Client</th>
                            <th style={{textAlign: "center"}}>Project</th>
                            <th>Subject</th>
                            <th style={{width: "10%", textAlign: "center"}}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((t, index) => {
                            return <tr key={index} onClick={() => onTicketClick(index)}>
                                <td style={{textAlign: "center"}}>{t.TicketNum}</td>
                                <td style={{textAlign: "center"}}>{t.OpeningDT.formatDate('dd-mm-yyyy', '-')}</td>
                                <td style={{textAlign: "left"}}>{t.ClientName}</td>
                                <td style={{textAlign: "left"}}>{t.ProjectName}</td>
                                <td style={{textAlign: "left"}}>{t.Subject}</td>
                                <td style={{textAlign: "center"}}>{t.TicketStatus}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </React.Fragment>
        );
   }
}

export default TicketsList;