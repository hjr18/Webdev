import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import axios from 'axios';
import 'chart.js'
import * as d3 from 'd3';
import moment from 'moment-timezone'

import './Table.css';

export function timestampPls(data) {
    var recivedTime = moment(new Date(data.time));
    var i = 0;
    for (i; i<data.length; i++){
        data[i].time = new Date(data[i].time);
        //data[i].time = recivedTime.format('HH:mm:ss');
        //console.log(data[i].time);
    }
    return data
};

class Table1 extends Component {

  constructor(props) {
    super(props);
      this.dataStore=[];
      this.state = {
        dataStore:[],
          symbol: 'AAPL'
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
       this.getData(`-35000#select time,avgs price from trade where sym=\`${this.state.symbol}`)
           .then(data => {
               if (data.success) {
                   console.log("data success=true");
                   this.setState({dataStore: data.result});
                   this.setState({dataStore:timestampPls(this.state.dataStore)});
                   d3.selectAll("svg > *").remove();
                    this.draw();
               }
           });
   }

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


    draw(){
        const svg = d3.select("svg"),
            margin = {top: 50, right: 20, bottom: 50, left: 80},
            width = 1600 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const x = d3.scaleTime()
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
            .attr("y", -55)
            .attr("x", -155)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .style('font-size','14')
            .text("Avg Price");


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
    return (
	<React.Fragment>
        {/*<div>
        A time series graph showing the running average price for each sym for the day
    </div>*/}

            <div className="nav-button-holder">
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
      <div className='graph-div'>
          <svg width="1600" height="500" />

        </div>
	
	  </React.Fragment>
    );
  }
}


export default Table1;
