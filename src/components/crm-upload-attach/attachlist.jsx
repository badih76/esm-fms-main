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


class AttachList extends Component {
   render() {
       const { attachments, onAttachClick } = this.props;

        return (
            <React.Fragment>
                <table className="table table-striped table-hover" 
                    style={{fontSize: "0.75vw"}}>
                    <thead>
                        <tr className="info">
                            <th style={{width: "10%"}}>Att. Text</th>
                            <th style={{width: "10%"}}>Att. Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attachments ? attachments.map((a, index) => {
                            return <tr key={index} onClick={() => onAttachClick(index)} >
                                <td style={{textAlign: "center"}}>{a.TitleText}</td>
                                <td style={{textAlign: "center"}}>{a.UploadDate}</td>
                            </tr>
                        }) : null}
                    </tbody>
                </table>
            </React.Fragment>
        );
   }
}

export default AttachList;

const openStyle = { background: "#ff6666", textAlign: "center",  color: "white", fontWeight: "bold" };
const inProgStyle = { background: "#ffff66", textAlign: "center", color: "black", fontWeight: "bold" };
const closedStyle = { background: "lightgreen", textAlign: "center", color: "white", fontWeight: "bold" };