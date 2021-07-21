import {useLocation} from 'react-use'
import {WalletHub, LanguageButton, ThemeButton} from '../../components'

function MobileFooter() {
  const {pathname} = useLocation()

  if (
    pathname === '/' ||
    pathname === '/maintenance' ||
    pathname === '/notfound'
  ) {
    return null
  }
  return (
    <div className="bg-gray-0 h-16 shadow-common w-full rounded-tl-2.5xl rounded-tr-2.5xl px-3 flex items-center justify-between">
      <WalletHub />
      <div className="flex items-center">
        <ThemeButton />
        <LanguageButton />
      </div>
    </div>
  )
}

export default MobileFooter
