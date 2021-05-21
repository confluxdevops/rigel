import {useState, Suspense} from 'react'
import {ReactComponent as Logo} from '../logo.svg'
import logoUrl from '../assets/images/logo.svg'
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
} from '../components'
import ConnectWalletModal from '../pages/components/ConnectWalletModal'
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
      duration: 1,
    })
  }

  const info = () => {
    Message.info({content: 'this is a message'})
  }

  const menu = (
    <div>
      <div>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          1st menu item
        </a>
      </div>
      <div>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          2nd menu item
        </a>
      </div>
      <div>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.luohanacademy.com"
        >
          3rd menu item
        </a>
      </div>
      <div>a danger item</div>
    </div>
  )

  return (
    <Suspense fallback={null}>
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
        <Dropdown overlay={menu} placement="bottomRight">
          <Button onClick={e => e.preventDefault()}>Hover me</Button>
        </Dropdown>
        <div>
          <ConnectWalletModal
            open={true}
            chain="eth"
            type="error"
          ></ConnectWalletModal>
        </div>
      </div>
    </Suspense>
  )
}

export default App
