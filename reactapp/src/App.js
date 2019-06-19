import React, { Component } from 'react';
//import logo from '../puplic/images/aquaq_logo1.png';
import './App.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import Split from 'react-split';
import axios from 'axios';
import { Tabs } from '@yazanaabed/react-tabs';
import Table1 from './components/Table1';
import Table2 from './components/Table2';
import './react-tabs.css';

/*var options = {
	url: 'http://192.186.1.57:8239/executeQuery',
	auth: (
	username: 'user',
	password: 'pass',
	),
	method: 'post',
	headers: (
	'Content-Type': 'application/json',
	'Accept': 'application/json',
	'Authorization': 'BASIC dXNlcjpwYXNz'
	),
}

export function getData(query) {
	options['data'] = { 'query': query, 'response': 'true', 'type': 'sync'};
	return axios(options)
	.then(response => response.data);
}
*/
const styles = {
	fontFamily: "sans-serif",
	textAlign: "center",
	borderStyle: "dashed",
	color: "red"
}
	
class App extends Component {
	render() {
    return (
	<React.Fragment>
	<div className="page-header">
	<img className="aquaq-logo" src={require("./images/aquaq-logo.png")} />
	</div>
	
	<div className="nav-button-holder" >
      <Tabs activeTab={{ id: "Table1" }} style={styles} >
	  <Tabs.Tab id="Table1" title="Quote" className="nav-buttons">
	  <Table1 />
	  </Tabs.Tab>
	  <Tabs.Tab id="Table2" title="Trade">
	  <Table2 />
	  </Tabs.Tab>
	  </Tabs>
	</div>
	 
	  <Split>
	  <div className="footer-bot-left">
	  
	  </div>
	  <div className="footer-bot-right">
	  
	  </div>
	  </Split>
	  </React.Fragment>
    );
  }
}

export default App;