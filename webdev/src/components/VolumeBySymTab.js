import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import axios from 'axios';
import * as d3 from "d3";


class VolumeBySymTab extends Component {


    constructor(props) {
        super(props);
        this.dataStore=[];
        this.state = {
            columnDefs: [{
                headerName: "Sym", field: "sym", sortable: true, filter: true, resizable: true
            }, {
                headerName: "Size", field: "size", sortable: true, filter: true, resizable: true
            }],
            dataStore:[],
            max: 0,
            min: 0,
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

    /*ybuffer() {
        var i = 0;
        this.setState({max: this.state.dataStore[0]});
        this.setState({min: this.state.dataStore[0]});
        for (i; i < this.state.dataStore.length - 1; i++) {
            console.log(this.state.max);
            console.log(this.state.min);
            console.log(this.i);
            if (this.state.max < this.state.dataStore[i]){
                this.setState({max: this.state.dataStore[i]});
            }
            if (this.state.min > this.state.dataStore[i]){
                this.setState({min: this.state.dataStore[i]});
            }
        }
    };*/

    ybuffer() {
        var i = 1;
        this.setState({max: this.state.dataStore[0].size});
        this.setState({min: this.state.dataStore[0].size});
        for (i; i < this.state.dataStore.length ; i++) {
            console.log(this.state.max);
            console.log(this.state.min);
            console.log(this.i);
            if (this.state.max < this.state.dataStore[i].size){
                this.setState({max: this.state.dataStore[i].size});
            }
            if (this.state.min > this.state.dataStore[i].size){
                this.setState({min: this.state.dataStore[i].size});
            }
        }
    };

    getData(query) {
        this.options['data'] = { 'query': query, 'response': 'true', 'type': 'sync'};
        return axios(this.options)
            .then(response => response.data);
    }

    updateData() {
        this.getData("select sum size by sym from trade")
            .then(data => {
                if (data.success) {
                    console.log("data success=true");

                    this.setState({dataStore: data.result});
                    this.ybuffer();
                    //console.log(this.state.max);
                    //console.log(this.state.min);
                    console.log(this.state.dataStore.length);
                    d3.selectAll("svg > *").remove();
                    this.draw();

                }
            });
    }

    componentDidMount() {
        this.interval= setInterval(() =>  this.updateData(), 2000);
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




        const make_y_gridlines = () => {
            return d3.axisLeft(yScale)
                .ticks(10)
        }




        const xScale = d3.scaleBand()
            .range([0, width])
            .domain(this.state.dataStore.map((s) => s.sym))
            .padding(0.3)

        g.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));
        //y.domain(d3.extent(this.state.dataStore, function(d) { return d.size; }));
        const yScale = d3.scaleLinear()
            .range([height, 0])
            .domain([0.995*this.state.min, 1.005*this.state.max]);
//plot the x axis

//plot the y axis
        g.append("g")
            .call(d3.axisLeft(yScale))
            //plot the y axis legend
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", -70)
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



        // add the Y gridlines
        g.append("g")
            .attr("class", "grid")
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat("")
            )

        g.selectAll()
            .data(this.state.dataStore)
            .enter()
            .append('rect')
            .attr('x', (d) => xScale(d.sym))
            .attr('y', (d) => yScale(d.size))
            .attr('height', (d) => height - yScale(d.size))
             .attr('width', xScale.bandwidth());

    }


    render() {

        return (
            <React.Fragment>
                <div className="whitebk">
                    Volume by Sym
                </div>
                <div className='graph-div'>
                    <svg width="1600" height="500" />

                </div>
               <div>  <AgGridReact
                   columnDefs={this.state.columnDefs}
                   //rowData={this.state.rowData}>
                   rowData={this.state.dataStore}>
               </AgGridReact>

               </div>

            </React.Fragment>
        );
    }
}


export default VolumeBySymTab;
