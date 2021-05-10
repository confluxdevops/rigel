import React from 'react'
import {ReactComponent as Logo} from '../logo.svg'
import logoUrl from '../assets/images/logo.svg'
import './App.css'
import Button from '../components/Button'

function App() {
  return (
    <div className="container mx-auto h-full flex justify-center items-center">
      <header className="App-header">
        <p className="text-black">
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <img src={logoUrl} alt="logo" />
        <Logo className="text-primary" />
        <Button startIcon={<Logo className="w-4 h-4 text-black" />}>
          Work Hard
        </Button>
      </header>
    </div>
  )
}

export default App
