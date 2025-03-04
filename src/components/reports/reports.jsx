import React, { Component } from 'react';
import { TitlePageHeader } from '../titleheader/titleheader';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import processing from '../../images/processing.gif';
import Input from '../../common/input';
import ItemsList from '../../common/itemslist';

import reports from '../../resources/reports.json';
import ReturnForm from './returnform';

class Reports extends Component {
    state = {
        uprofile: {},
        ticketsStatistics: {},
        showProcess: false,
        params: {
            ddlMonth: 10,
            ddlYear: 2019
        },
        visibilityFlags: [
            "",
            "",
            "",
            "hidden",
            "hidden"
        ],
        repCatBtn: [],
        selectedRepCatIndex: 0,
        reqForm: ''
    }


    handleOnChange = (event) => {
        const { name, value } = event.currentTarget;
        
        let params = {...this.state.params};
        params[name] = value;

        this.setState({ params });
    }

    handleRepCatClick = (repCat) => {
        let selectedRepCatIndex = this.state.repCatBtn.findIndex(rc => {
            return rc.Name === repCat;
        });
        this.setState({ selectedRepCatIndex });
    }

    handleReportClick = (report) => {
        let reqForm = this.state.repCatBtn[this.state.selectedRepCatIndex].Reports.filter(r => {
            return r.Report === report;
        })[0].Form;
        this.setState({ reqForm });
    }
    constructor(props) {
        super(props);

        const token = sessionStorage['token'];
        const uprofile = JSON.parse(sessionStorage.getItem('uprofile'));

        if(!token || !this.props.menuVisible)
        {
             //props.history.push('/');
            return ;
        }
        else
        {
            this.state.uprofile = uprofile;
        }

    };

    componentDidMount = () => {
        this.setState({ repCatBtn: reports });
    }

    render ()
    {
        return (
            <div className="col-md-12">
                <TitlePageHeader title="Reports" bgColor="white" color="gray" />
                <div className="col-md-6">
                    <div className="row">
                        <div className={"col-md-6 " + this.state.visibilityFlags[0]} 
                            style={columnStyle} onClick={this.handleClientColumnClick}>
                            <div className='col-md-12' 
                                style={columnTitleStyle}>
                                Category
                            </div>
                            <div style={{width: "100%", height: "52vh", overflow: "auto"}}>
                                <ItemsList 
                                    name='Name'
                                    label='Name'
                                    showList={true}
                                    onClick={this.handleRepCatClick}
                                    data={this.state.repCatBtn}
                                    showProcess={this.state.showClientsProcess}
                                />
                            </div>
                        </div>
                        <div className={"col-md-6 " + this.state.visibilityFlags[1]} 
                            onClick={this.handleProjectColumnClick}
                            style={columnStyle}>
                            <div className='col-md-12' 
                                style={columnTitleStyle}>
                                Report
                            </div>
                            <div style={{width: "100%", height: "52vh", overflow: "auto"}}>
                                <ItemsList 
                                    name='Report'
                                    label='Report'
                                    showList={true}
                                    onClick={this.handleReportClick}
                                    data={
                                        this.state.repCatBtn.length > 0 ? 
                                        this.state.repCatBtn[this.state.selectedRepCatIndex].Reports :
                                        []
                                    }
                                    showProcess={this.state.showProjectsProcess}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-6" style={propColumnStyle}>
                    <div className='col-md-12' 
                        style={propColumnTitleStyle}>
                        {"Report Generation Form"}
                    </div>
                    {this.state.reqForm !== '' ? <ReturnForm reqForm={this.state.reqForm} /> : ''}
                </div>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover
                />
            </div>
                    
            // <React.Fragment>
            //     <TitlePageHeader title="Reports" bgColor="white" color="gray" />
            //     <div className="row" style={rowDivStyle}>
            //         <div className="col-md-12">
            //             <div className="row" style={{padding: '0', margin: '0'}}>
            //                 <div className="col-md-4" style={chartDivStyle}>
            //                     <form action="http://airmechfms.com/fms/repCustCareTicketsMonthly.aspx" 
            //                         target="_blank" method="POST" >
            //                         <Input name="ddlMonth" 
            //                             label="Month" 
            //                             value={this.state.params.ddlMonth}
            //                             onChange={this.handleOnChange} />
            //                         <Input name="ddlYear" 
            //                             label="Year" 
            //                             value={this.state.params.ddlYear}
            //                             onChange={this.handleOnChange} />
            //                         <button type="submit">Submit</button>
                                    
            //                     </form>
            //                 </div>
            //                 <div className="col-md-4" style={barChartDivStyle}>

            //                 </div>
            //                 <div className="col-md-4" style={chartDivStyle}>
            //                 </div>
            //             </div>
            //         </div>
            //     </div>
            // </React.Fragment>


        );
    }
};

export default Reports;

const chartDivStyle = {
    borderStyle: 'solid',
    borderSize: '1px',
    borderColor: 'lightgray',
    borderRadius: '20px',
    boxShadow: '5px 5px gray',
    minHeight: '330px',
    overflow: 'auto',
    backgroundColor: 'white'
}

const barChartDivStyle = {
    borderStyle: 'solid',
    borderSize: '1px',
    borderColor: 'lightgray',
    borderRadius: '20px',
    boxShadow: '5px 5px gray',
    minHeight: '330px',
    overflow: 'auto',
    paddingTop: '10px',
    backgroundColor: 'white'
}

const rowDivStyle = {
    paddingLeft: "20px",
    paddingRight: "20px"
}

const columnStyle = {
    border: "solid",
    borderWidth: "1px",
    borderColor: "lightgray",
    borderRadius: "25px",
    height: "70vh"
}

const propColumnStyle = {
    border: "solid",
    borderWidth: "1px",
    borderColor: "lightgray",
    borderRadius: "25px",
    height: "75vh",
    backgroundColor: 'lightgray',
    overflow: "auto"
}

const columnTitleStyle = {
    color: "blue", 
    fontSize: '1vw', 
    fontWeight: 'bold', 
    borderBottom: 'solid', 
    borderColor: 'lightgray',
    borderWidth: 1,
    paddingTop: "10px",
    marginBottom: "10px",
    textAlign: 'left'
} 

const searchTextStyle = {
    fontSize: '0.75vw', 
    borderBottom: 'solid', 
    borderColor: 'lightgray',
    borderWidth: 1,
    paddingTop: "5px",
    paddingBottom: "5px",
    marginBottom: "10px",
    textAlign: 'left'
} 

const propColumnTitleStyle = {
    color: "blue", 
    fontSize: '1vw', 
    fontWeight: 'bold', 
    borderBottom: 'solid', 
    borderColor: 'gray',
    borderWidth: 1,
    paddingTop: "10px",
    marginBottom: "10px",
    textAlign: 'left'
} 