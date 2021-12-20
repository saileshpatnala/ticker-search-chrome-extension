import React, { Component } from 'react'
import axios from 'axios';
// import { Chart } from "react-google-charts";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart }            from 'react-chartjs-2'


class TickerSearch extends Component {
    constructor() {
        super();
        this.state = {
            ticker: null,
            chartData: {
                labels: [],
                data: []
            },
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
            // console.log(timestamps);
            // console.log(values);

            let labels = [];
            let dataPoints = [];
            // var counter = 0;
            timestamps.forEach(
                (element, index) => {
                    // const date = new Date(element * 1000); // epoch to ms
                    // const formattedDate = date.toString();
                    // labels.push(counter+1);
                    labels.push("");
                    dataPoints.push(values[index]);
                    // counter += 1;
                }
            )
            this.setState({
                chartData: {
                    labels: labels,
                    data: dataPoints
                }
            });

        })
        .catch(function(error) {
            console.log(error);
        });

    }

    render() {        
        const chartOptions = {
            labels: this.state.chartData.labels,
            datasets: [
                {
                    label: "Price",
                    data: this.state.chartData.data,
                    fill: true,
                    backgroundColor: "rgba(75,192,192,0.2)",
                    borderColor: "rgba(75,192,192,1)"
                }
            ]
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
                    <Line data={chartOptions}/>
                }
                </div>
                <div className="App-header"></div>
            </div>
        );
    }
}

export default TickerSearch;