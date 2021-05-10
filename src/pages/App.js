import React from 'react'
import logo from '../logo.svg'
import './App.css'
import FromToken from './shuttle/fromToken'
function App() {
  //Data for test
  const token = {
    icon:
      'https://test.shuttleflow.confluxnetwork.org/assets/ether.d5f86.modern.svg',
    name: 'ETH',
    origin: 'eth',
    reference_name: 'ETH',
    symbol: 'cEth',
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div>
          <FromToken token={token}></FromToken>
        </div>
      </header>
    </div>
  )
}

export default App
