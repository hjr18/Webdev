import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import axios from 'axios';
import * as d3 from "d3";


class SymVol extends Component {

    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [{
                headerName: "Date", field: "date", sortable: true, filter: true, resizable: true
            }, {
                 headerName: "Y", field: "y", sortable: true, filter: true, resizable: true
            }],
            dataStore:[],
                symbol: 'AAPL',
                range: '=.z.d-1'
        };
        this.updateData();
    };

    options = {
        url: 'https://localhost:8140/executeQuery',
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
        this.getData(`select y:sdev price by date+15 xbar time.minute from trade where date${this.state.range},sym=\`${this.state.symbol}`)
            .then(data => {
                if (data.success) {
                    console.log("data success=true");
                    this.setState({dataStore: data.result});
                    d3.selectAll("svg > *").remove();
                    this.draw();
                }
            });
    }

    changeSym = (sym) => {
        console.log(sym);
        this.setState({symbol: sym},()=>this.updateData());

        //this.updateData();
    };

    changeRange = (range) => {
        console.log(range);
        this.setState({range: range},()=>this.updateData());
        //this.updateData();
    };

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
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.y); });
        x.domain(d3.extent(this.state.dataStore, function(d) {return d.date; }));
        y.domain(d3.extent(this.state.dataStore, function(d) { return d.y; }));

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
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .style('font-size','14')
            .text("Standard Deviation");


        //plot the x axis legend
        svg.append("text")
            .attr("transform","translate(" + (width/2) + " ," + (height + margin.top + 40) + ")")
            .style("text-anchor", "middle")
            .style('font-size','14')
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
                <div className="nav-button-holder">

                </div>
                <div>
                    <button className='nav-buttons' onClick={() =>this.changeRange("=.z.d-1")}>
                        Day
                    </button>
                    <button className='nav-buttons' onClick={() =>this.changeRange('>.z.d-8')}>
                        Week
                    </button>
                    <button className='nav-buttons' onClick={() =>this.changeRange('>.Q.addmonths[.z.d;-1]-1')}>
                        Month
                    </button>
                </div>
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
                <div className='graph-div'>
                    <svg width="1600" height="500" />
                </div>


            </React.Fragment>
        );
    }
}


export default SymVol;
