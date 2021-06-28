import {Suspense} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Shuttle from '../pages/Shuttle'
import History from '../pages/History'
import Home from '../pages/Home'
import Maintenance from '../pages/Maintenance'
import Notfound from '../pages/Notfound'
import {Web3ReactManager, Header, MobileFooter} from '../pages/components'
import Example from './Example'
import {useIsMobile} from '../hooks'

function App() {
  const isMobile = useIsMobile()

  return (
    <Suspense fallback={null}>
      <Router>
        <div className="flex flex-col h-full relative overflow-y-hidden">
          <Header />
          <div className="container mx-auto flex flex-1 justify-center md:pb-6 h-0">
            <Web3ReactManager>
              <Switch>
                <Route path="/shuttle">
                  <Shuttle />
                </Route>
                {/* TODO: Remove */}
                <Route path="/example">
                  <Example />
                </Route>
                <Route path="/history">
                  <History />
                </Route>
                <Route path="/" exact>
                  <Home />
                </Route>
                <Route path="/maintenance" exact>
                  <Maintenance />
                </Route>
                <Route path="/notfound" exact>
                  <Notfound />
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
