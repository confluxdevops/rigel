import {ReactComponent as Logo} from '../logo.svg'
import logoUrl from '../assets/images/logo.svg'
import './App.css'
import Button from '../components/Button'
import Tag from '../components/Tag'

function App() {
  return (
    <div className="container mx-auto h-full flex justify-center items-center">
      <header className="App-header">
        <img src={logoUrl} alt="logo" />
        <Logo className="text-primary" />
        <Button startIcon={<Logo className=" text-white" />} className="mb-2">
          Work Hard
        </Button>
        <Tag closable>Max</Tag>
      </header>
    </div>
  )
}

export default App
