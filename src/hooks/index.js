import {useWindowSize} from 'react-use'
import {useMemo} from 'react'
import {KeyOfCfx, KeyOfBtc} from '../constants/chainConfig'
import {MobileBreakpoint} from '../constants'

export function useIsCfxChain(chain) {
  const isCfxChain = useMemo(() => chain === KeyOfCfx, [chain])
  return isCfxChain
}

export function useIsBtcChain(chain) {
  const isBtcChain = useMemo(() => chain === KeyOfBtc, [chain])
  return isBtcChain
}

export function useIsMobile() {
  const {width} = useWindowSize()
  if (width < MobileBreakpoint) return true
  return false
}
