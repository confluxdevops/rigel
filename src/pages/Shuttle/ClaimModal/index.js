import {useState} from 'react'
import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import {useIsMobile} from '../../../hooks'
import {Modal} from '../../../components'
import {SupportedChains} from '../../../constants/chainConfig'
import {SendStatus, ClaimStatus} from '../../../constants'
import {Question} from '../../../assets/svg'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

function ClaimModal({
  open = false,
  fromChain,
  toChain,
  fromToken,
  toToken,
  onClose,
  ...props
}) {
  const {t} = useTranslation()
  const isMobile = useIsMobile()
  const [sendStatus, setSendStatus] = useState('')
  const [claimStatus, setClaimStatus] = useState('')
  const onClickClose = () => {
    const modal = document.getElementById('claimModal')
    modal.classList.add(
      isMobile ? 'animate-fade-out-bottom-left' : 'animate-fade-out-top-right',
    )
    const closeTimer = setTimeout(() => {
      clearTimeout(closeTimer)
      onClose && onClose()
    }, 500)
  }
  const content = (
    <div className="flex flex-col w-full">
      <span className="inine-block mb-3 text-gray-60">
        {t('claimModal.description')}
      </span>
      <FirstStep
        fromChain={fromChain}
        toChain={toChain}
        fromToken={fromToken}
        toToken={toToken}
        sendStatus={sendStatus}
        setSendStatus={setSendStatus}
        {...props}
      />
      <SecondStep
        fromChain={fromChain}
        toChain={toChain}
        fromToken={fromToken}
        toToken={toToken}
        sendStatus={sendStatus}
        claimStatus={claimStatus}
        setClaimStatus={setClaimStatus}
        {...props}
      />
      {/* TODO: add url */}
      <a href="www.baidu.com" target="_blank" className="flex items-center">
        <span className="text-gray-40 text-xs">
          {t('claimModal.claimTips')}
        </span>
        <Question className="w-3 h-3 text-gray-40 ml-1" />
      </a>
    </div>
  )
  return (
    <Modal
      id="claimModal"
      size="medium"
      open={open}
      title={t('claimModal.title')}
      content={content}
      onClose={onClickClose}
    />
  )
}

ClaimModal.propTypes = {
  fromChain: PropTypes.oneOf(SupportedChains).isRequired,
  toChain: PropTypes.oneOf(SupportedChains).isRequired,
  fromToken: PropTypes.object.isRequired,
  toToken: PropTypes.object.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  sendStatus: PropTypes.oneOf(Object.values(SendStatus)).isRequired,
  claimStatus: PropTypes.oneOf(Object.values(ClaimStatus)).isRequired,
}

export default ClaimModal
