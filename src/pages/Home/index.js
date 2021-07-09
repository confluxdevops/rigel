import {useEffectOnce} from 'react-use'
import {useTranslation} from 'react-i18next'
import {
  BaseCenter,
  BaseLeft,
  BaseRight,
  ShuttleFlow,
  TokenLeft,
  SfCenter,
  TokenRight,
  Twitter,
  Telegram,
  Discord,
  Medium,
  GitHub,
  LightLeft,
  LightRight,
  LightCenter,
  LightTunnel1,
  LightTunnel2,
  PipleLeft,
  PipleRight,
  TunnelLeft,
  TunnelRight,
  BaseMobile,
  ShuttleFlowMobile,
} from '../../assets/img'
import {Button} from '../../components'

function Home() {
  useEffectOnce(() => {
    const classList = document.querySelector('body').classList
    classList.remove('dark')
    classList.remove('light')
    classList.add('home')
  })
  const {i18n, t} = useTranslation()
  const {language} = i18n
  const onOpenApp = () => {
    window.open('/shuttle')
  }
  const onOpenPaper = () => {
    window.open(
      language === 'en'
        ? 'https://shuttleflow.io/assets/SF-whitepaper-en.bbd9b.modern.pdf'
        : 'https://shuttleflow.io/assets/SF-whitepaper-zh.75dc3.modern.pdf',
    )
  }
  return (
    <div className="w-full relative md:h-screen md:min-h-220">
      <div className="md:w-360">
        <div className="ml-5">
          <img
            className="w-72 mt-15 md:hidden"
            src={ShuttleFlowMobile}
            alt="title"
          />
          <img
            className="hidden md:block w-160 pt-24"
            src={ShuttleFlow}
            alt="title"
          />
          <span className="inline-block text-gray-40 mt-2 text-base md:mt-9 md:text-xl">
            {t('home.subTitle')}
          </span>
          <div className="flex mt-11 md:mt-9">
            <Button className="mr-5" onClick={() => onOpenApp()}>
              {t('home.shuttleFlow')}
            </Button>
            <Button onClick={() => onOpenPaper()}>
              {t('home.lightPaper')}
            </Button>
          </div>
        </div>
        <img className="mt-8 w-full md:hidden" src={BaseMobile} alt="base" />
        <div className="hidden md:block relative -ml-24">
          <div className="absolute left-240 top-30">
            <img className="w-64" src={TunnelRight} alt="tunnel" />
          </div>
          <svg
            className="absolute w-80 h-52 left-232 top-24"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <image
              className="w-4 h-4"
              href="https://conflux-static.oss-cn-beijing.aliyuncs.com/shuttleflow-img/token-n-right.png"
            >
              <animateMotion
                dur="10s"
                repeatCount="indefinite"
                path="M0,160 Q110,118 200,25 Q110,118 0,160"
              />
            </image>

            <image
              className="w-4 h-4"
              href="https://conflux-static.oss-cn-beijing.aliyuncs.com/shuttleflow-img/token-n-right.png"
            >
              <animateMotion
                dur="11s"
                repeatCount="indefinite"
                path="M0,160 Q110,118 200,25 Q110,118 0,160"
              />
            </image>

            <image
              className="w-4 h-4"
              href="https://conflux-static.oss-cn-beijing.aliyuncs.com/shuttleflow-img/token-n-right.png"
            >
              <animateMotion
                dur="12s"
                repeatCount="indefinite"
                path="M0,160 Q110,118 200,25 Q110,118 0,160"
              />
            </image>
          </svg>
          <div className="absolute left-136 top-9">
            <img className="w-168" src={BaseCenter} alt="base" />
          </div>
          <div className="absolute left-256 -top-0.5">
            <img className="w-110" src={BaseRight} alt="base" />
          </div>
          <div className="absolute left-65 top-60">
            <img src={TunnelLeft} alt="tunnel" />
          </div>

          <svg
            className="absolute left-44 top-48 w-132 h-52 "
            viewBox="0 0 200 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <image
              className="w-3 h-3"
              href="https://conflux-static.oss-cn-beijing.aliyuncs.com/shuttleflow-img/token-n-left.png"
            >
              <animateMotion
                dur="10s"
                repeatCount="indefinite"
                path="M10,60 Q80,30 145,42 Q220,50 250,20 Q220,50 145,42 Q80,30 10,60 "
              />
            </image>

            <image
              className="w-3 h-3"
              href="https://conflux-static.oss-cn-beijing.aliyuncs.com/shuttleflow-img/token-n-left.png"
            >
              <animateMotion
                dur="11s"
                repeatCount="indefinite"
                path="M10,60 Q80,30 145,42 Q220,50 250,20 Q220,50 145,42 Q80,30 10,60"
              />
            </image>

            <image
              className="w-3 h-3"
              href="https://conflux-static.oss-cn-beijing.aliyuncs.com/shuttleflow-img/token-n-left.png"
            >
              <animateMotion
                dur="12s"
                repeatCount="indefinite"
                path="M10,60 Q80,30 145,42 Q220,50 250,20 Q220,50 145,42 Q80,30 10,60"
              />
            </image>
          </svg>
          <div className="absolute left-1 top-56">
            <img className="w-104" src={BaseLeft} alt="base" />
          </div>
          <div className="absolute left-48 top-48 animate-bounce">
            <img src={TokenLeft} alt="token" />
          </div>
          <div className="absolute left-192 top-4 animate-bounce">
            <img className="w-40" src={SfCenter} alt="sf" />
          </div>
          <div className="absolute left-302 -top-6 animate-bounce">
            <img src={TokenRight} alt="token" />
          </div>
          <div className="absolute left-40 top-52 animate-pulse-fast">
            <img src={LightLeft} alt="light" />
          </div>
          <div className="absolute left-154 -top-1 animate-pulse-fast">
            <img src={LightCenter} alt="light" />
          </div>
          <div className="absolute left-293 -top-1 animate-pulse-fast">
            <img src={LightRight} alt="light" />
          </div>
          <div className="absolute left-158 top-60 animate-pulse-fast">
            <img src={LightTunnel1} alt="light" />
          </div>
          <div className="absolute left-280 top-34 animate-pulse-fast">
            <img src={LightTunnel2} alt="light" />
          </div>
          <div className="absolute left-116 top-64">
            <img src={PipleLeft} alt="piple" />
          </div>
          <div className="absolute left-270 top-44">
            <img src={PipleRight} alt="piple" />
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 w-full border-t-0 ml-5 flex flex-col-reverse md:absolute md:flex-row md:justify-between md:py-4 md:border-t border-solid border-gray-60">
        <span className="inline-block text-gray-20 text-xs py-3 md:py-0">
          © 2021 ShuttleFlow. All Rights Reserved.
        </span>
        <div className="flex border-solid border-b border-gray-60 pb-4 md:border-b-0 md:pb-0">
          <a
            className="mr-5"
            href="https://twitter.com/@Conflux_Network"
            rel="noreferrer"
            target="_blank"
          >
            <img src={Twitter} alt="twitter" />
          </a>
          <a
            className="mr-5"
            href="https://t.me/Conflux_English"
            rel="noreferrer"
            target="_blank"
          >
            <img src={Telegram} alt="telegram" />
          </a>
          <a
            className="mr-5"
            href="https://discord.com/invite/aCZkf2C"
            rel="noreferrer"
            target="_blank"
          >
            <img src={Discord} alt="discord" />
          </a>
          <a
            className="mr-5"
            href="https://medium.com/@ConfluxNetwork"
            rel="noreferrer"
            target="_blank"
          >
            <img src={Medium} alt="medium" />
          </a>
          <a
            className="-mr-9"
            href="https://github.com/conflux-chain"
            rel="noreferrer"
            target="_blank"
          >
            <img src={GitHub} alt="github" />
          </a>
        </div>
      </div>
    </div>
  )
}
export default Home
