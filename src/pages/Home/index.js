import {useEffectOnce} from 'react-use'

function Home() {
  useEffectOnce(() => {
    const classList = document.querySelector('body').classList
    classList.remove('dark')
    classList.remove('light')
    classList.add('home')
  })
  return <div className="flex h-full bg-gray-100">Home</div>
}

export default Home
