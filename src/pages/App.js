import {ReactComponent as Logo} from '../logo.svg'
import logoUrl from '../assets/images/logo.svg'
import './App.css'
// import TokenType from './shuttle/TokenType'
import Button from '../components/Button'
import Tag from '../components/Tag'

function App() {
  //Data for test
  // const token = {
  //   icon:
  //     'https://test.shuttleflow.confluxnetwork.org/assets/ether.d5f86.modern.svg',
  //   name: 'ETH',
  //   origin: 'eth',
  //   reference_name: 'ETH',
  //   symbol: 'cEth',
  // }

  return (
    <div className="container mx-auto h-full flex justify-center items-center">
      <header className="App-header">
        <p className="text-black">
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
        <img src={logoUrl} alt="logo" />
        <Logo className="text-primary" />
        <Button startIcon={<Logo className=" text-white" />} className="mb-2">
          Work Hard
        </Button>
        <Tag closable color="error">
          Max
        </Tag>
        {/* <div>
          <TokenType token={token} type="from"></TokenType>
        </div>
        <div>
          <TokenType token={token} type="to"></TokenType>
        </div> */}
      </header>
    </div>
  )
}

export default App
