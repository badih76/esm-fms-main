import React, { Component } from 'react';
import { TitlePageHeader } from './titleheader/titleheader';
import Chart from "react-google-charts";
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import processing from '../images/processing.gif';

import { getTicketsStatistics } from '../appcode/dashboard';

class Dashboard extends Component {
    state = {
        uprofile: {},
        ticketsStatistics: {},
        showProcess: false
    }

    columns = [
        { type: "string", id: "Service" },
        { type: "string", id: "Title"},
        { type: "date", id: "Start" },
        { type: "date", id: "End" }
      ];
    
    rows = [
            ["Washington", new Date(1789, 3, 30), new Date(1795, 2, 4)],
            ["Washington", new Date(1797, 2, 15), new Date(1798, 2, 4)],
            ["Badih", new Date(1791, 3, 30), new Date(1794, 1, 4)],
            ["Badih", new Date(1794, 8, 15), new Date(1798, 2, 4)]
    
    ];

    componentDidMount = () => {
        this.setState({ showProcess: true });

        let ticketsStatistics = {
            Open: 0,
            Closed: 0,
            InProgress: 0
        }

        getTicketsStatistics()
            .then(result => {
                if(result.Success)
                {
                    ticketsStatistics = {...result.Result};

                    this.setState({ ticketsStatistics });
                }
                else
                {
                    this.setState({ ticketsStatistics });
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({ ticketsStatistics });
            })

    }

    constructor(props) {
        super(props);

        const token = sessionStorage['token'];
        const uprofile = JSON.parse(sessionStorage.getItem('uprofile'));

        if(!token || !this.props.menuVisible)
        {
            props.history.push('/');
            return ;
        }
        else
        {
            this.state.uprofile = uprofile;
        }
    };

    render ()
    {
        return (
            <React.Fragment>
                <TitlePageHeader title="Dashboard" bgColor="white" color="gray" />
                <div className="row" style={rowDivStyle}>
                    <div className="col-md-12">
                        <div className="row" style={{padding: '0', margin: '0'}}>
                            <div className="col-md-4" style={chartDivStyle}>
                                <Chart
                                    chartType="PieChart"
                                    data={[
                                        ['Status', 'Count'],
                                        ['Open', this.state.ticketsStatistics.Open],
                                        ['In Progress', this.state.ticketsStatistics.InProgress],
                                        ['Closed', this.state.ticketsStatistics.Closed],
                                    ]}
                                    width="100%"
                                    height="300px"
                                    loader={<div>Loading Chart</div>}
                                    options={{
                                            title: 'Customer-care Tickets Statistics',
                                            is3D: true,
                                            legend: 'none',
                                        }} 
                                    />
                            </div>
                            <div className="col-md-4" style={barChartDivStyle}>
                                <Chart
                                    chartType="LineChart"
                                    data={[
                                        ['Revenue', 'Month'],
                                        ["Jan '19", 15000.000],
                                        ["Feb '19", 10350],
                                        ["Mar '19", 9489],
                                        ["Apr '19", 11225],
                                        ["May '19", 20200],
                                        ["Jun '19", 10000],
                                        ["Jul '19", 5200],
                                        ["Aug '19", 2500],
                                        ["Sep '19", 3500],
                                        ["Oct '19", 8000],
                                        ["Nov '19", 9000],
                                        ["Dec '19", 5352]
                                    ]}
                                    width="100%"
                                    height="300px"
                                    loader={<div>Loading Chart</div>}
                                    options={{
                                        title: 'Revenue during 2019',
                                        vAxis: {
                                            title: 'Revenue (OMR)',
                                        },
                                        hAxis: {
                                            title: 'Month',
                                        },    
                                        is3D: true,
                                        legend: 'none',
                                        }} 
                                    />
                            </div>
                            <div className="col-md-4" style={chartDivStyle}>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>


        );
    }
};

export default Dashboard;

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