import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import axios from 'axios';
import * as d3 from "d3";


class HDBCounts extends Component {


    constructor(props) {
        super(props);
        this.dataStore=[];
        this.state = {
            dataStore:[],
            symbol: 'AAPL'
        };
        this.state = {
            columnDefs: [{
                headerName: "Date", field: "date", sortable: true, filter: true, resizable: true
            }, {
                headerName: "Number of trades", field: "colCount", sortable: true, filter: true, resizable: true
            }],

            dataStore:[]

        }
        this.updateData();
    };

    changeSym = (sym) => {
        console.log(sym);
        this.setState({symbol: sym});
        this.updateData();
    };

    componentDidMount() {
        this.interval= setInterval(() =>  this.updateData(), 1000);
    }

    componentWillUnmount() {
        d3.selectAll("svg > *").remove();
        clearInterval(this.interval);
    }


    options = {
        url: 'https://192.168.1.57:8140/executeQuery',
        auth: {
            username: 'user',
            password: 'pass',
        },

        method: 'post',
        dataType: 'json',
        headers:
            {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json',
                'Authorization' : 'BASIC dXNlcjpwYXNz'
            }
    };

    getData(query) {
        this.options['data'] = { 'query': query, 'response': 'true', 'type': 'sync'};
        return axios(this.options)
            .then(response => response.data);
    }

    updateData() {
        this.getData(`select colCount:count i by date from trade where ((date >.z.d-8)&(1<date mod 7)),sym=\`${this.state.symbol}`)
            .then(data => {
                if (data.success) {
                    console.log("data success=true");
                    this.setState({dataStore: data.result});
                }
            });
    }


    render() {

        return (
            <React.Fragment>

                <div>
                    <button className='nav-buttons' onClick={() =>this.changeSym("AAPL")}>
                        AAPL
                    </button>
                    <button className='nav-buttons' onClick={() =>this.changeSym('AIG')}>
                        AIG
                    </button>
                    <button className='nav-buttons' onClick={() =>this.changeSym('AMD')}>
                        AMD
                    </button>
                    <button className='nav-buttons' onClick={() =>this.changeSym('DELL')}>
                        DELL
                    </button>
                    <button className='nav-buttons' onClick={() =>this.changeSym('DOW')}>
                        DOW
                    </button>
                    <button className='nav-buttons' onClick={() =>this.changeSym('GOOG')}>
                        GOOG
                    </button>
                    <button className='nav-buttons' onClick={() =>this.changeSym('HPQ')}>
                        HPQ
                    </button>
                    <button className='nav-buttons' onClick={() =>this.changeSym('IBM')}>
                        IBM
                    </button>
                    <button className='nav-buttons' onClick={() =>this.changeSym('INTC')}>
                        INTC
                    </button>
                    <button className='nav-buttons' onClick={() =>this.changeSym('MSFT')}>
                        MSFT
                    </button>

                </div>
                <div>
                   {this.state.symbol}
                </div>
                <div
                    className="ag-theme-balham"
                    style={{
                        height: '500px',
                        width: '1700px' }}
                >
                    <AgGridReact
                        columnDefs={this.state.columnDefs}
                        //rowData={this.state.rowData}>
                        rowData={this.state.dataStore}>
                    </AgGridReact>
                </div>

            </React.Fragment>
        );
    }
}


export default HDBCounts;
