import React, {useState} from 'react'
import {ReactComponent as Logo} from '../logo.svg'
import logoUrl from '../assets/images/logo.svg'
import './App.css'
import TokenType from './Shuttle/TokenType'
import {Button, Tag, Modal, Loading, Notification, Message} from '../components'

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
    Notification.open({
      title: 'Notification Title',
      content:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      onClick: () => {
        console.log('Notification Clicked!')
      },
      duration: 0,
    })
  }

  const info = () => {
    Message.loading({content: 'this is a message', duration: 0})
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
        <Loading />
        <Button onClick={info}>Message</Button>
        <Button
          onClick={openNotification}
          startIcon={<Logo className=" text-white" />}
          className="mb-2"
        >
          Notification
        </Button>
        <Tag closable color="error">
          Max
        </Tag>
        <div>
          <TokenType token={token} type="from" chain="eth"></TokenType>
        </div>
        <div>
          <TokenType token={token} type="to" chain="cfx"></TokenType>
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
