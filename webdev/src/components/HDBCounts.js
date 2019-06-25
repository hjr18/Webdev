import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import axios from 'axios';


class HDBCounts extends Component {


    constructor(props) {
        super(props);
        this.dataStore=[];
        this.state = {
            columnDefs: [{
                headerName: "colCount", field: "colCount", sortable: true, filter: true, resizable: true
            }, {
                headerName: "Date", field: "date", sortable: true, filter: true, resizable: true
            }],

            dataStore:[]

        }
        this.updateData();
    };

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
        this.getData("select colCount:count i by date from trade where date >.z.d-7")
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
                    SymVol
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
