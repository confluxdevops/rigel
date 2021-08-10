import {Suspense} from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import Shuttle from '../pages/Shuttle'
import History from '../pages/History'
import Home from '../pages/Home'
import Maintenance from '../pages/Maintenance'
import Notfound from '../pages/NotFound'
import {Web3ReactManager, Header, MobileFooter} from '../pages/components'
import {Loading} from '../components'
import {useIsMobile} from '../hooks'
import * as Sentry from '@sentry/browser'
import {Integrations} from '@sentry/tracing'
import {IS_DEV} from '../utils'

Sentry.init({
  dsn: 'https://4d2e829843a54d21b43df7b20a8e93cf@o339419.ingest.sentry.io/5880699',
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  environment: IS_DEV ? 'development' : 'production',
})

function App() {
  const isMobile = useIsMobile()
  // const historyData = [
  //   {
  //     fromChain: 'cfx',
  //     toChain: 'eth',
  //     toToken: {
  //       symbol: 'USDT',
  //       address: '0xae080e58d91cf0b8a8de18ddcf92b9e5fbfadec5',
  //       icon: '',
  //       origin: 'eth',
  //       in_token_list: 1,
  //     },
  //     fromAddress: 'cfxtest:aas9dt3vyzrv3pewr7mzg5xpd2ch353z26u67czbza',
  //     toAddress: '0x5B81AAb2e61407100280CbA6AEB986063e2c88c0',
  //     amount: '499.99',
  //     status: 'waiting',
  //     response: {
  //       status: 'confirming',
  //       nonce_or_txid:
  //         '0x3b234aa5ca72728c8cb385a009599781fc422cc55be0a55c145835d8f61d9b98',
  //       settled_tx: null,
  //     },
  //   },
  //   {
  //     fromChain: 'eth',
  //     toChain: 'cfx',
  //     toToken: {
  //       symbol: 'cETH',
  //       address: 'cfxtest:acepe88unk7fvs18436178up33hb4zkuf62a9dk1gv',
  //       icon: '',
  //       origin: 'eth',
  //       in_token_list: 1,
  //     },
  //     fromAddress: '0x5B81AAb2e61407100280CbA6AEB986063e2c88c0',
  //     toAddress: 'cfxtest:aas9dt3vyzrv3pewr7mzg5xpd2ch353z26u67czbza',
  //     amount: '499.99',
  //     status: 'success',
  //     response: null,
  //   },
  // ]

  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <Loading className="w-20 h-20" />
        </div>
      }
    >
      <Router>
        <div className="flex flex-col h-full relative overflow-x-hidden">
          <Header />
          <div className="container mx-auto flex flex-1 justify-center md:pb-6 h-0">
            <Web3ReactManager>
              <Switch>
                <Route path="/shuttle">
                  <Shuttle />
                </Route>
                <Route path="/history">
                  <History />
                </Route>
                <Route path="/" exact>
                  <Home />
                </Route>
                <Route path="/maintenance">
                  <Maintenance />
                </Route>
                <Route path="/notfound">
                  <Notfound />
                </Route>
                <Route path="*">
                  <Redirect to="/notfound" />
                </Route>
              </Switch>
            </Web3ReactManager>
          </div>
          {isMobile && <MobileFooter />}
        </div>
      </Router>
    </Suspense>
  )
}

export default App
