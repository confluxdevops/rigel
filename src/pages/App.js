import {Suspense} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Shuttle from '../pages/Shuttle'
import History from '../pages/History'
import Home from '../pages/Home'
import TokenList from '../pages/Shuttle/TokenList'
import {Web3ReactManager, Header} from '../pages/components'
import Example from './Example'

function App() {
  return (
    <Suspense fallback={null}>
      <Router>
        <div className="flex flex-col h-full relative background">
          <Header />
          <div className="container mx-auto flex-grow justify-center pb-6">
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
                <Route path="/" exec>
                  {/* TODO home page */}
                  <Home />
                </Route>
              </Switch>
            </Web3ReactManager>
          </div>
        </div>
      </Router>
    </Suspense>
  )
}

export default App
