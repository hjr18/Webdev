import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import axios from 'axios';
import * as d3 from "d3";

import './Table.css';


class HDBCounts extends Component {


    constructor(props) {
        super(props);
        this.dataStore=[];

        this.state = {
            columnDefs: [{
                headerName: "Date", field: "date", sortable: true, filter: true, resizable: true
            }, {
                headerName: "Number of trades", field: "colCount", sortable: true, filter: true, resizable: true
            }],

            dataStore:[],
            symbol: ''


        }
        this.updateData();
    };

    changeSym = (sym) => {
        console.log(sym);
        this.setState({symbol: sym},()=>this.updateData());
        this.setState({symbol: sym},()=>this.handleSymChange());

    };

    componentDidMount() {

    }

    componentWillUnmount() {
        d3.selectAll("svg > *").remove();

    }


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
        this.getData(`select colCount:count i by date from trade where ((date >.z.d-8)&(1<date mod 7))`+this.state.symbol)
            .then(data => {
                if (data.success) {
                    console.log("data success=true");
                    this.setState({dataStore: data.result});
                    this.ybuffer();
                    d3.selectAll("svg > *").remove();
                    this.draw();
                }
            });
    }

    ybuffer() {
        var i = 1;
        this.setState({max: this.state.dataStore[0].colCount});
        this.setState({min: this.state.dataStore[0].colCount});
        for (i; i < this.state.dataStore.length ; i++) {
            console.log(this.state.max);
            console.log(this.state.min);
            console.log(this.i);
            if (this.state.max < this.state.dataStore[i].colCount){
                this.setState({max: this.state.dataStore[i].colCount});
            }
            if (this.state.min > this.state.dataStore[i].colCount){
                this.setState({min: this.state.dataStore[i].colCount});
            }
        }
    };

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
            .domain([0.95*this.state.min, 1.05*this.state.max]);
//plot the x axis

//plot the y axis
        g.append("g")
            .call(d3.axisLeft(yScale))
            //plot the y axis legend
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", -68)
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

    handleSymChange = () => {
        var sym = this.state.symbol;
        this.props.onHDBCounts(sym);
    }

    render() {

        return (
            <React.Fragment>

                <div className="nav-button-holder">
                    <button className='nav-buttons' onClick={() =>this.changeSym("")}>
                        ALL
                    </button>
                    <button className='nav-buttons' onClick={() =>this.changeSym(",sym=`AAPL")}>
                        AAPL
                    </button>
                    <button className='nav-buttons' onClick={() =>this.changeSym(',sym=`AIG')}>
                        AIG
                    </button>
                    <button className='nav-buttons' onClick={() =>this.changeSym(',sym=`AMD')}>
                        AMD
                    </button>
                    <button className='nav-buttons' onClick={() =>this.changeSym(',sym=`DELL')}>
                        DELL
                    </button>
                    <button className='nav-buttons' onClick={() =>this.changeSym(',sym=`DOW')}>
                        DOW
                    </button>
                    <button className='nav-buttons' onClick={() =>this.changeSym(',sym=`GOOG')}>
                        GOOG
                    </button>
                    <button className='nav-buttons' onClick={() =>this.changeSym(',sym=`HPQ')}>
                        HPQ
                    </button>
                    <button className='nav-buttons' onClick={() =>this.changeSym(',sym=`IBM')}>
                        IBM
                    </button>
                    <button className='nav-buttons' onClick={() =>this.changeSym(',sym=`INTC')}>
                        INTC
                    </button>
                    <button className='nav-buttons' onClick={() =>this.changeSym(',sym=`MSFT')}>
                        MSFT
                    </button>

                </div>
                <div className="rowC">
                <div className='graph-div'>
                    <svg width="960" height="500" />

                </div>
                <div
                    className="ag-theme-balham"
                    style={{
                        height: '200px',
                        width: '500px' }}
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


export default HDBCounts;
