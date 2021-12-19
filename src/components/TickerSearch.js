import React, { Component } from 'react'
import axios from 'axios';
import { Chart } from "react-google-charts";


class TickerSearch extends Component {
    constructor() {
        super();
        this.state = {
            ticker: null,
            chartData: null,
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.getData = this.getData.bind(this);
    }

    handleInputChange(event) {
        this.setState({
            ticker: event.target.value
        });
    }
    

    getData() {
        const yahooFinUrl = `https://yfapi.net/v8/finance/chart/${this.state.ticker}?region=US&lang=en-US&interval=15m&range=1d`
        axios.get(yahooFinUrl, {
            headers: {
                'x-api-key': 'hDrUZx0jr56mbWXh4U5KO31cZi4g3r6p5FLvaTSN'
              }
        })
        .then(function(response) {
            if (response.status === 200) {
                console.log(response);
                return response.data;
            }
        })
        .then((data) => {
            console.log(data.chart.result[0])
            const timestamps = data.chart.result[0].timestamp;
            const values = data.chart.result[0].indicators.quote[0].close;
            console.log(timestamps);
            console.log(values);

            this.setState({ change: values[values.length-1]/values[0] });

            let chartData = [["Timestamp", "Price"]]
            timestamps.forEach(
                (element, index) =>  {
                    const date = new Date(element*1000); // Unix time in ms
                    const prettyDate = date.toDateString()
                    chartData.push([prettyDate,values[index]])
                }
            );
            console.log("filtered chart data");
            console.log(chartData);
            this.setState({
                chartData: chartData
            });

        })
        .catch(function(error) {
            console.log(error);
        });

    }

    render() {
        let color = 'blue';
        // if(this.state.change >= 1.01) color = 'green';
        // if(this.state.change <= 0.99) color = 'red';
        const options = {
            legend :'none',
            axisFontSize : 10,
            hAxis: {
                title: 'Time'
            },
            vAxis: {
                title: 'Price'
            },
        };

        const divStyle = {
            borderBottom: '1px solid black',
            verticalAlign: 'middle',
            paddingLeft: '2rem',
        };

        return (
            <div>
                <div>
                    <form>
                        <input 
                            type="text" id="filter" 
                            placeholder="Enter ticker symbol..."
                            onChange={this.handleInputChange}
                        />
                    </form>
                    <button type="button" className="btn btn-primary" 
                        onClick={() => this.getData()}>
                            Get Data
                    </button>
                </div>
                <div>
                {
                    this.state.chartData && 
                    < Chart
                        chartType="LineChart"
                        data={this.state.chartData}
                        width="600px"
                        height="350px"
                        legendToggle
                        options={options}  
                    />
                }
                </div>
                <div className="App-header"></div>
            </div>
        );
    }
}

export default TickerSearch;