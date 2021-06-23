/* eslint-disable no-unused-vars */
//TODO: Remove
import {useState} from 'react'
import {ArrowRight, Logo, NoPending} from '../assets/svg'
import TokenSelect from '../pages/Shuttle/ShuttleForm/TokenSelect'
import {
  Button,
  Tag,
  Modal,
  Loading,
  Notification,
  Message,
  Dropdown,
  Input,
  Menu,
  Alert,
  Link,
} from '../components'
import {
  TransactionReceiptionModal,
  ConnectWalletModal,
  AccountStatus,
  useTransactionNotification,
} from '../pages/components'
import {useIsMobile} from '../hooks'
import {requestSponsor} from '../utils/request'

function Example() {
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()
  const openNotification = useTransactionNotification()
  // requestSponsor('getTokenList', ['eth']).then(res => {
  //   console.log(res)
  // })
  //Data for test
  const token = {
    icon: 'https://test.shuttleflow.confluxnetwork.org/assets/ether.d5f86.modern.svg',
    name: 'ETH',
    origin: 'eth',
    reference_name: 'ETH',
    symbol: 'cEth',
  }

  // const openNotification = () => {
  //   Notification.open({
  //     title: 'Notification Title',
  //     type: 'success',
  //     content:
  //       'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
  //     onClick: () => {
  //       console.log('Notification Clicked!')
  //     },
  //     placement: 'bottomRight',
  //     duration: 0,
  //     bottom: 0,
  //   })
  // }

  const info = () => {
    Message.info({content: 'this is a message'})
  }

  const clickHandler = key => {
    console.log(key)
  }

  const menu = (
    <Menu>
      <Menu.Item itemKey="antgroup" onClick={clickHandler} selected={false}>
        1st menu item
      </Menu.Item>
      <Menu.Item itemKey="aliyun" onClick={clickHandler} selected={false}>
        2nd menu item
      </Menu.Item>
      <Menu.Item itemKey="luohanacademy" onClick={clickHandler} selected={true}>
        3rd menu item
      </Menu.Item>
      <Menu.Item itemKey="danger" onClick={clickHandler} selected={false}>
        a danger item
      </Menu.Item>
    </Menu>
  )

  return (
    <div className="container mx-auto h-full flex justify-center items-center">
      <div className="App-header">
        <NoPending />
        <Logo className="text-primary" />
        <Loading />
        <Button disabled onClick={info}>
          Message
        </Button>
        <Button
          onClick={() =>
            openNotification({
              symbol: 'ETH',
              fromChain: 'cfx',
              toChain: 'eth',
              value: '10',
              isMobile,
            })
          }
          startIcon={<ArrowRight className="text-white" />}
          className="mb-2"
        >
          Notification
        </Button>
        <div className="flex">
          <Alert
            open={open}
            onClose={() => setOpen(false)}
            closable
            type="error"
            content="This is a alert"
            bordered
          />
          <Alert
            open={open}
            onClose={() => setOpen(false)}
            closable
            type="error"
            content="This is a alert"
          />
        </div>
        <Input />
        <Tag>Max</Tag>
        <Link to="https://baidu.com" target="_blank">
          Baidu
        </Link>
        <Tag closable color="error">
          Max
        </Tag>
        <div>
          <TokenSelect token={token} type="from" chain="eth" />
        </div>
        <div>
          <TokenSelect token={token} type="to" chain="cfx" />
        </div>
        <TransactionReceiptionModal
          type="ongoing"
          open={true}
          fromChain="cfx"
          toChain="eth"
          fromToken={{symbol: 'CFX'}}
          toToken={{symbol: 'eCFX'}}
          value="23.68"
        />
        <Modal
          open={false}
          title="Tips"
          onClose={() => setOpen(false)}
          content="Get incoming transactions Third party APIs are used to show your incoming transactions in the history. Turn off if you don’t want us to pull data from those services."
          actions={
            <Button fullWidth onClick={() => setOpen(false)}>
              Get
            </Button>
          }
        />
      </div>
      <Dropdown overlay={menu} placement="bottomLeft" trigger={['click']} arrow>
        <Button onClick={e => e.preventDefault()}>Hover me</Button>
      </Dropdown>
      <ConnectWalletModal type="uninstalled" chain="eth" open={false} />
      <AccountStatus chain="eth" size="large" />
    </div>
  )
}

export default Example