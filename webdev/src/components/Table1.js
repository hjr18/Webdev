import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import axios from 'axios';


class Table1 extends Component {


  constructor(props) {
    super(props);
this.dataStore=[];
    this.state = {
      columnDefs: [{
        headerName: "Sym", field: "sym", sortable: true, filter: true, resizable: true
      },{
          headerName: "Time", field: "time", sortable: true, filter: true, resizable: true
      },{
        headerName: "Running avg Price", field: "price", sortable: true, filter: true, resizable: true
      }],
        dataStore:[]
      
    }
    this.updateData();
  };

     options = {
        url: 'https://192.168.1.57:8139/executeQuery',
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
       this.getData("select time,avgs price from trade where time<=.z.P,sym=`GOOG")
           .then(data => {
               if (data.success) {
                   console.log("data success=true");
                   this.setState({dataStore: data.result});
               }
           });
   }

intervalSet() {
        setInterval(this.updateData, 1000);
    }

render() {
           //this.intervalSet();
    return (
	<React.Fragment>
    <div>
        Quote
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


export default Table1;
