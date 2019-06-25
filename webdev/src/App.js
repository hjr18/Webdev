import React, { Component } from 'react';
import './App.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { Tabs } from '@yazanaabed/react-tabs';
import Table1 from './components/Table1';
import Table2 from './components/Table2';
import Table3 from './components/Table3';
import LastPriceTab from './components/LastPriceTab';
import HDBCounts from './components/HDBCounts';
import VolumeBySymTab from './components/VolumeBySymTab';
import HighestTradedSym from './components/HighestTradedSym';

import SymVol from './components/SymVol';
import MostTradeSym from './components/MostTradeSym';
import LeastTradeSym from './components/LeastTradeSym';
import HighDay from './components/HighDay';
import LowDay from './components/LowDay';
import './react-tabs.css';

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

	  <Tabs.Tab id="Table1" title="Table1" className="nav-buttons">
	  <Table1 />
	  </Tabs.Tab>
	  <Tabs.Tab id="Table2" title="Table2">
	  <Table2 />
	  </Tabs.Tab>
      <Tabs.Tab id="Table3" title="Table3">
		  <Table3 />
      </Tabs.Tab>
      <Tabs.Tab id="LastPriceTab" title="LastPriceTab">
		  <LastPriceTab />
      </Tabs.Tab>
      <Tabs.Tab id="VolumeBySymTab" title="VolumeBySymTab">
		  <VolumeBySymTab />
      </Tabs.Tab>
		  <Tabs.Tab id="HighestTradedSym" title="HighestTradedSym">
		  <HighestTradedSym />
	  </Tabs.Tab>

		<Tabs.Tab id="SymVol" title="SymVol">
			  <SymVol />
		  </Tabs.Tab>
		  <Tabs.Tab id="MostTradeSym" title="MostTradeSym">
			  <MostTradeSym />
		  </Tabs.Tab>
		  <Tabs.Tab id="LeastTradeSym" title="LeastTradeSym">
		  <LeastTradeSym />
	  </Tabs.Tab>
		  <Tabs.Tab id="HDBCounts" title="HDBCounts">
		  <HDBCounts />
	  </Tabs.Tab>
		  <Tabs.Tab id="HighDay" title="HighDay">
			  <HighDay />
		  </Tabs.Tab>
		  <Tabs.Tab id="LowDay" title="LowDay">
			  <LowDay />
		  </Tabs.Tab>
	  </Tabs>
	</div>
	  </React.Fragment>
    );
  }
}

export default App;