import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import axios from 'axios';
import * as d3 from "d3";
import './Table.css';

class LastPriceTab extends Component {


    constructor(props) {
        super(props);
        this.dataStore=[];
        this.state = {
            dataStore:[],
            columnDefs: [{
                headerName: "Sym", field: "sym", sortable: true, filter: true, resizable: true
            }, {
                headerName: "Last Price", field: "price", sortable: true, filter: true, resizable: true, cellStyle:(params)=> {
                    var colour = params.node.data.colour[0];
                        if (colour === 1) {
                            console.log("Red");
                            return {

                                    background: 'rgba(255,0,0,0.75)'

                            };
                        } else if (colour === 2) {
                            console.log("Green");
                            return {

                                background: 'rgba(0,255,0,0.75)'


                            };
                        }
                    }

            }],


        }
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
        this.getData("select last price,colour:?[(last price)>-1_-2#price;1;?[(last price)<-1_-2#price;2;0]] by sym from trade")
            .then(data => {
                if (data.success) {
                    console.log("data success=true");
                    this.setState({dataStore: data.result});
                    //console.log(this.state.dataStore);


                }
            });
    }

    componentDidMount() {
        this.interval= setInterval(() =>  this.updateData(), 3000);
    }

    componentWillUnmount() {
        d3.selectAll("svg > *").remove();
        clearInterval(this.interval);
    }


    render() {

        return (
            <React.Fragment>
                <div>
                    Last Price
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


export default LastPriceTab;
