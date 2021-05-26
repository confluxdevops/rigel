import {Suspense} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Shuttle from '../pages/Shuttle'
import TokenList from '../pages/Shuttle/TokenList'

function App() {
  return (
    <Suspense fallback={null}>
      <Router>
        <div className="container mx-auto h-full flex justify-center items-center">
          <Switch>
            <Route path="/shuttle">
              <Shuttle />
            </Route>
            {/* TODO: Remove */}
            <Route path="/tokenlist">
              <TokenList />
            </Route>
            <Route path="/">
              <Shuttle />
            </Route>
          </Switch>
        </div>
      </Router>
    </Suspense>
  )
}

export default App
