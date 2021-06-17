import {useMemo} from 'react'
import {KeyOfCfx, KeyOfBtc} from '../constants/chainConfig'

export function useIsCfxChain(chain) {
  const isCfxChain = useMemo(() => chain === KeyOfCfx, [chain])
  return isCfxChain
}

export function useIsBtcChain(chain) {
  const isBtcChain = useMemo(() => chain === KeyOfBtc, [chain])
  return isBtcChain
}
