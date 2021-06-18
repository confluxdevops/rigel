import {Suspense} from 'react'
import {useEffectOnce} from 'react-use'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Shuttle from '../pages/Shuttle'
import History from '../pages/History'
import Home from '../pages/Home'
import TokenList from '../pages/Shuttle/TokenList'
import {Web3ReactManager, Header, MobileFooter} from '../pages/components'
import Example from './Example'
import {useIsMobie} from '../hooks'
import {useShuttleState} from '../state'

function App() {
  const {setToBtcAddress} = useShuttleState()
  const isMobile = useIsMobie()

  useEffectOnce(() => {
    setToBtcAddress('bc1qkuwf9ddw3hqyxsvz9v9zjef0qxq7s7zjvujhjl')
  })

  return (
    <Suspense fallback={null}>
      <Router>
        <div className="flex flex-col h-full relative">
          <Header />
          <div className="container mx-auto flex-grow justify-center md:pb-6">
            <Web3ReactManager>
              <Switch>
                <Route path="/shuttle">
                  <Shuttle />
                </Route>
                {/* TODO: Remove */}
                <Route path="/tokenlist">
                  <TokenList chain="eth" />
                </Route>
                {/* TODO: Remove */}
                <Route path="/example">
                  <Example />
                </Route>
                <Route path="/history">
                  <History />
                </Route>
                <Route path="/" exact>
                  {/* TODO home page */}
                  <Home />
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
