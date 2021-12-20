import logo from './logo.svg';
import './App.css';
import TickerSearch from './components/TickerSearch';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Ticker Search</p>
        <TickerSearch/>
      </header>
    </div>
  );
}

export default App;
