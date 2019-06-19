import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import axios from 'axios';


class Table2 extends Component {


    constructor(props) {
        super(props);
        this.dataStore=[];
        this.state = {
            columnDefs: [{
                headerName: "Time", field: "time", sortable: true, filter: true, resizable: true
            }, {
                headerName: "Sym", field: "sym", sortable: true, filter: true, resizable: true
            }, {
                headerName: "Src", field: "src", sortable: true, filter: true, resizable: true
            }, {
                headerName: "Price", field: "price", sortable: true, filter: true, resizable: true
            }, {
                headerName: "Amount", field: "amount", sortable: true, filter: true, resizable: true
            }, {
                headerName: "Side", field: "side", sortable: true, filter: true, resizable: true
            }],
            dataStore:[]

        }
        this.updateData();
    };

    options = {
        url: 'https://192.168.1.57:8240/executeQuery',
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
        this.getData("30#select from trade")
            .then(data => {
                if (data.success) {
                    console.log("data success=true");
                    this.setState({dataStore: data.result});
                }
            });
    }


    render() {
        //this.intervalSet();
        return (
            <React.Fragment>
                <div>
                    Trade
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


export default Table2;
