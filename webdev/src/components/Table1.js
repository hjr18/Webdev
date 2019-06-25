import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import axios from 'axios';
import 'chart.js'
import * as d3 from 'd3';

import './Table.css';


class Table1 extends Component {

  constructor(props) {
    super(props);
      this.dataStore=[];
      this.state = {
      columnDefs: [{
          headerName: "Time", field: "time", sortable: true, filter: true, resizable: true
      },{
        headerName: "Running avg Price", field: "price", sortable: true, filter: true, resizable: true
      }],
        dataStore:[],
    };
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
       this.getData("select time,avgs price from trade where sym=`GOOG")
           .then(data => {
               if (data.success) {
                   console.log("data success=true");
                   this.setState({dataStore: data.result});
                    this.draw();
               }
           });
   }


    componentDidMount() {
           this.interval= setInterval(() =>  this.updateData(), 10000);
       }

    componentWillUnmount() {
        clearInterval(this.interval);
    }


    draw(){
        const svg = d3.select("svg"),
            margin = {top: 50, right: 20, bottom: 50, left: 50},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const x = d3.scaleLinear()
            .range([0,width]);

        const y = d3.scaleLinear()
            .range([height, 0]);
        const make_x_grid_lines = () => {
            return d3.axisBottom(x)
                .ticks(10)
        }

        const make_y_gridlines = () => {
            return d3.axisLeft(y)
                .ticks(10)
        }
        const lineCount = d3.line()
            .x(function(d) { return x(d.time); })
            .y(function(d) { return y(d.price); });
        x.domain(d3.extent(this.state.dataStore, function(d) {return d.time; }));
        y.domain(d3.extent(this.state.dataStore, function(d) { return d.price; }));

//plot the x axis
        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
//plot the y axis
        g.append("g")
            .call(d3.axisLeft(y))
            //plot the y axis legend
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", -10)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .style('font-size','12')
            .text("Avg Price");
// plot the line legend with color
        g.append('g')
            .attr('class', 'legend')
            .append('text')
            .attr('y',-10)
            .attr('x',width-100)
            .text('Price');

        //plot the x axis legend
        svg.append("text")
            .attr("transform","translate(" + (width/2) + " ," + (height + margin.top + 40) + ")")
            .style("text-anchor", "middle")
            .text("Time");
// Plot the Line
        g.append("path")
            .datum(this.state.dataStore)
            .attr("class", "line")
            .attr("d", lineCount);

    }

render() {
    //this.draw();
    return (
	<React.Fragment>
    <div>
        Quote
    </div>

            <div>
                <button className='nav-buttons'>
                    AAPL
                </button>
                <button className='nav-buttons'>
                    AIG
                </button>
                <button className='nav-buttons'>
                    AMD
                </button>
                <button className='nav-buttons'>
                    DELL
                </button>
                <button className='nav-buttons'>
                    DOW
                </button>
                <button className='nav-buttons'>
                    GOOG
                </button>
                <button className='nav-buttons'>
                    HPQ
                </button>
                <button className='nav-buttons'>
                    IBM
                </button>
                <button className='nav-buttons'>
                    INTC
                </button>
                <button className='nav-buttons'>
                    MSFT
                </button>

            </div>

      <div
        className="ag-theme-balham"
        style={{ 
        height: '500px',
        width: '1700px' }} 
      >
          <svg width="960" height="500" style={{}} />

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
