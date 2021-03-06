import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import axios from 'axios';
import * as d3 from "d3";


class MinMaxPrice extends Component {


    constructor(props) {
        super(props);
        this.dataStore=[];
        this.state = {
            columnDefs: [{
                headerName: "Sym", field: "sym", sortable: true, filter: true, resizable: true
            }, {
                headerName: "Minimum Price", field: "minimum", sortable: true, filter: true, resizable: true
            }, {
                headerName: "Maximum Price", field: "maximum", sortable: true, filter: true, resizable: true
            }],
            dataStore:[]

        };
        this.updateData();
    };

    options = {
        url: 'https://localhost:8139/executeQuery',
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
        this.getData("select minimum:.Q.f[2;min price],maximum:.Q.f[2;max price] by sym from trade")
            .then(data => {
                if (data.success) {
                    console.log("data success=true");
                    this.setState({dataStore: data.result});
                }
            });
    }

    componentDidMount() {
        this.interval= setInterval(() =>  this.updateData(), 5000);
    }

    componentWillUnmount() {
        d3.selectAll("svg > *").remove();
        clearInterval(this.interval);
    }


    render() {

        return (
            <React.Fragment>
                <div className="rocD">
                <div>
                    Minimum and Maximum Price by Sym
                </div>

                <div
                    className="ag-theme-balham"
                    style={{
                        height: '330px',
                        width: '615px' }}
                >
                    <AgGridReact
                        columnDefs={this.state.columnDefs}
                        //rowData={this.state.rowData}>
                        rowData={this.state.dataStore}>
                    </AgGridReact>
                </div>
                </div>

            </React.Fragment>
        );
    }
}


export default MinMaxPrice;
