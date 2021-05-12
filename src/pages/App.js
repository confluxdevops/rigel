import React, {useState} from 'react'
import {ReactComponent as Logo} from '../logo.svg'
import logoUrl from '../assets/images/logo.svg'
import './App.css'
import TokenType from './Shuttle/TokenType'
import {Button, Tag, Modal, Notification} from '../components'

function App() {
  const [open, setOpen] = useState(false)
  //Data for test
  const token = {
    icon:
      'https://test.shuttleflow.confluxnetwork.org/assets/ether.d5f86.modern.svg',
    name: 'ETH',
    origin: 'eth',
    reference_name: 'ETH',
    symbol: 'cEth',
  }

  const openNotification = () => {
    Notification.success({
      title: 'Notification Title',
      content:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      onClick: () => {
        console.log('Notification Clicked!')
      },
      duration: 1,
    })
  }

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
        <Button
          onClick={openNotification}
          startIcon={<Logo className=" text-white" />}
          className="mb-2"
        >
          Work Hard
        </Button>
        <Tag closable color="error">
          Max
        </Tag>
        <div>
          <TokenType token={token} type="from"></TokenType>
        </div>
        <div>
          <TokenType token={token} type="to"></TokenType>
        </div>
        <Modal
          open={open}
          title="Tips"
          onClose={() => setOpen(false)}
          content="Get incoming transactions Third party APIs are used to show your incoming transactions in the history. Turn off if you don’t want us to pull data from those services."
          actions={
            <Button fullWidth onClick={() => setOpen(false)}>
              Get
            </Button>
          }
        />
      </header>
    </div>
  )
}

export default App
