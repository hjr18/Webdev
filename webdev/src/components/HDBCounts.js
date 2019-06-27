import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import axios from 'axios';
import * as d3 from "d3";


class HDBCounts extends Component {


    constructor(props) {
        super(props);
        this.dataStore=[];
        this.state = {
            dataStore:[],
            symbol: 'AAPL'
        };
        this.state = {
            columnDefs: [{
                headerName: "Date", field: "date", sortable: true, filter: true, resizable: true
            }, {
                headerName: "Number of trades", field: "colCount", sortable: true, filter: true, resizable: true
            }],

            dataStore:[]

        }
        this.updateData();
    };

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
        this.getData(`select colCount:count i by date from trade where ((date >.z.d-8)&(1<date mod 7)),sym=\`${this.state.symbol}`)
            .then(data => {
                if (data.success) {
                    console.log("data success=true");
                    this.setState({dataStore: data.result});
                    this.draw();
                }
            });
    }

    draw(){
        const svg = d3.select("svg"),
            margin = {top: 50, right: 20, bottom: 50, left: 80},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");






        const xScale = d3.scaleBand()
            .range([0, width])
            .domain(this.state.dataStore.map((s) => s.date))
            .padding(0.3)

        g.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));
        //y.domain(d3.extent(this.state.dataStore, function(d) { return d.size; }));
        const yScale = d3.scaleLinear()
            .range([height, 0])
            .domain([0, 200000]);
//plot the x axis

//plot the y axis
        g.append("g")
            .call(d3.axisLeft(yScale))
            //plot the y axis legend
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", -55)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .style("text-anchor", "end")
            .style('font-size','12')
            .text("Size");

        g.append('g')
            .call(d3.axisLeft(yScale));

        //g the x axis legend
        g.append("text")
            .attr("transform","translate(" + (width/2) + " ," + (height + margin.top + 40) + ")")
            .style("text-anchor", "middle")
            .text("Sym");


        g.selectAll()
            .data(this.state.dataStore)
            .enter()
            .append('rect')
            .attr('x', (d) => xScale(d.date))
            .attr('y', (d) => yScale(d.colCount))
            .attr('height', (d) => height - yScale(d.colCount))
            .attr('width', xScale.bandwidth());

    }

    render() {

        return (
            <React.Fragment>

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
                <div>
                   {this.state.symbol}
                </div>
                <div className='graph-div'>
                    <svg width="960" height="500" />

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
