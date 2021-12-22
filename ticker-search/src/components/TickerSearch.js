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
            change: null
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
            const timestamps = data.chart.result[0].timestamp;
            const values = data.chart.result[0].indicators.quote[0].close;

            this.setState({
                change: values[values.length - 1] / values[0]
            });

            let labels = [];
            let dataPoints = [];
            timestamps.forEach(
                (element, index) => {
                    labels.push("");
                    dataPoints.push(values[index]);
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
        var borderColor = ""
        if (this.state.change > 1.00) {
            borderColor = "rgba(1,209,88,0.91)"
        } else {
            borderColor = "rgba(228,4,15,0.91)"
        }
        const chartOptions = {
            labels: this.state.chartData.labels,
            datasets: [
                {
                    label: "Price",
                    data: this.state.chartData.data,
                    fill: true,
                    backgroundColor: "rgba(75,192,192,0.2)",
                    borderColor: borderColor
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
                            onKeyPress={(e) => e.key == "Enter" && this.getData()}
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