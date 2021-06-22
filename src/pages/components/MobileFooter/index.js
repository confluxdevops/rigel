import {WalletHub, LanguageButton, ThemeButton} from '../../components'

function MobileFooter() {
  //TODO: remove mock data
  const connectData = [
    {
      chain: 'cfx',
      address: 'cfxtest:aame5p2tdzfsc3zsmbg1urwkg5ax22epg27cnu1rwm',
    },
    {chain: 'eth', address: null},
  ]
  const pendingTransactions = [
    {
      type: 'shuttle',
      fromChain: 'eth',
      toChain: 'cfx',
      tokenSymbol: 'ETH',
    },
    {type: 'approve', tokenSymbol: 'UNI'},
  ]

  return (
    <div className="bg-gray-0 h-16 shadow-common w-full rounded-tl-2.5xl rounded-tr-2.5xl px-3 flex items-center justify-between">
      <WalletHub
        connectData={connectData}
        pendingTransactions={pendingTransactions}
      />
      <div className="flex items-center">
        <ThemeButton />
        <LanguageButton />
      </div>
    </div>
  )
}

export default MobileFooter
