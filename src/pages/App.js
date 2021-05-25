import {useState, Suspense} from 'react'
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'
import {ReactComponent as Logo} from '../logo.svg'
import {logo} from '../assets/images'
import './App.css'
import TokenType from './Shuttle/TokenType'
import {
  Button,
  Tag,
  Modal,
  Loading,
  Notification,
  Message,
  Dropdown,
  Input,
  MenuItem,
} from '../components'
import {TransactionReceiptionModal} from './components'
import {requestSponsor} from './../utils/request'

/**
 * Page
 */
import ShuttlePage from './Shuttle/index'

function App() {
  const [open, setOpen] = useState(false)
  requestSponsor('getTokenList', ['eth']).then(res => {
    console.log(res)
  })
  //Data for test
  const token = {
    icon: 'https://test.shuttleflow.confluxnetwork.org/assets/ether.d5f86.modern.svg',
    name: 'ETH',
    origin: 'eth',
    reference_name: 'ETH',
    symbol: 'cEth',
  }

  const openNotification = () => {
    Notification.open({
      title: 'Notification Title',
      type: 'warning',
      content:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      onClick: () => {
        console.log('Notification Clicked!')
      },
      duration: 1,
    })
  }

  const info = () => {
    Message.info({content: 'this is a message'})
  }

  const clickHandler = key => {
    console.log(key)
  }

  const menu = (
    <>
      <MenuItem
        itemKey="antgroup"
        onClick={clickHandler}
        selected={false}
        disabled
      >
        1st menu item
      </MenuItem>
      <MenuItem itemKey="aliyun" onClick={clickHandler} selected={false}>
        2nd menu item
      </MenuItem>
      <MenuItem itemKey="luohanacademy" onClick={clickHandler} selected={true}>
        3rd menu item
      </MenuItem>
      <MenuItem itemKey="danger" onClick={clickHandler} selected={false}>
        a danger item
      </MenuItem>
    </>
  )

  return (
    <Suspense fallback={null}>
      <Router>
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
            <img src={logo} alt="logo" />
            <Logo className="text-primary" />
            <Loading />
            <Button disabled onClick={info}>
              Message
            </Button>
            <Button
              onClick={openNotification}
              startIcon={<Logo className=" text-white" />}
              className="mb-2"
            >
              Notification
            </Button>
            <Input />
            <Tag closable color="error">
              Max
            </Tag>
            <div>
              <TokenType token={token} type="from" chain="eth"></TokenType>
            </div>
            <div>
              <TokenType token={token} type="to" chain="cfx"></TokenType>
            </div>
            <TransactionReceiptionModal
              type="success"
              open={false}
              fromChain="cfx"
              toChain="eth"
              fromToken={{symbol: 'CFX'}}
              toToken={{symbol: 'eCFX'}}
              value="23.68"
            />
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
          <Dropdown
            overlay={menu}
            placement="bottomLeft"
            trigger={['click']}
            arrow
          >
            <Button onClick={e => e.preventDefault()}>Hover me</Button>
          </Dropdown>
          <div>
            <Link to="/shuttle">Go to Shuttle</Link>
          </div>
          <Route exact strict path="/shuttle" component={ShuttlePage}></Route>
        </div>
        <Switch>
          <Route path="/shuttle">
            <ShuttlePage />
          </Route>
        </Switch>
      </Router>
    </Suspense>
  )
}

export default App
