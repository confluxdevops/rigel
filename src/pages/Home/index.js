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
  CopyRight,
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
  const openApp = () => {
    window.open('/shuttle', '_blank')
  }
  const openPaper = () => {
    window.open(
      language === 'en'
        ? 'https://shuttleflow.io/assets/SF-whitepaper-en.bbd9b.modern.pdf'
        : 'https://shuttleflow.io/assets/SF-whitepaper-zh.75dc3.modern.pdf',
      '_blank',
    )
  }
  return (
    <div className="w-full h-screen relative">
      <div className="w-360">
        <div className="ml-24">
          <img className="w-160 pt-24" src={ShuttleFlow} alt="title" />
          <p className="text-gray-400 mt-9 text-xl">{t('home.subTitle')}</p>
          <div className="mt-9 flex">
            <Button className="mr-5" onClick={() => openApp()}>
              {t('home.shuttleFlow')}
            </Button>
            <Button onClick={() => openPaper()}>{t('home.lightPaper')}</Button>
          </div>
        </div>
        <div className="relative">
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
                dur="5s"
                repeatCount="indefinite"
                path="M0,160 Q110,118 200,25 Q110,118 0,160"
              />
            </image>

            <image
              className="w-4 h-4"
              href="https://conflux-static.oss-cn-beijing.aliyuncs.com/shuttleflow-img/token-n-right.png"
            >
              <animateMotion
                dur="6s"
                repeatCount="indefinite"
                path="M0,160 Q110,118 200,25 Q110,118 0,160"
              />
            </image>

            <image
              className="w-4 h-4"
              href="https://conflux-static.oss-cn-beijing.aliyuncs.com/shuttleflow-img/token-n-right.png"
            >
              <animateMotion
                dur="7s"
                repeatCount="indefinite"
                path="M0,160 Q110,118 200,25 Q110,118 0,160"
              />
            </image>
          </svg>
          <div className="absolute left-136 top-9">
            <img className="w-168" src={BaseCenter} alt="base" />
          </div>
          <div className="absolute left-260 top-2.5">
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
                dur="7s"
                repeatCount="indefinite"
                path="M10,60 Q80,30 145,42 Q220,50 250,20 Q220,50 145,42 Q80,30 10,60 "
              />
            </image>

            <image
              className="w-3 h-3"
              href="https://conflux-static.oss-cn-beijing.aliyuncs.com/shuttleflow-img/token-n-left.png"
            >
              <animateMotion
                dur="6s"
                repeatCount="indefinite"
                path="M10,60 Q80,30 145,42 Q220,50 250,20 Q220,50 145,42 Q80,30 10,60"
              />
            </image>

            <image
              className="w-3 h-3"
              href="https://conflux-static.oss-cn-beijing.aliyuncs.com/shuttleflow-img/token-n-left.png"
            >
              <animateMotion
                dur="5s"
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
          <div className="absolute left-40 top-52 animate-pulse">
            <img src={LightLeft} alt="light" />
          </div>
          <div className="absolute left-154 -top-1 animate-pulse">
            <img src={LightCenter} alt="light" />
          </div>
          <div className="absolute left-293 -top-1 animate-pulse">
            <img src={LightRight} alt="light" />
          </div>
          <div className="absolute left-158 top-60 animate-pulse">
            <img src={LightTunnel1} alt="light" />
          </div>
          <div className="absolute left-280 top-34 animate-pulse">
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
      <div className="absolute bottom-16 w-full flex justify-between py-4 border-solid border-t-2 border-gray-20">
        <img src={CopyRight} alt="copyright" />
        <div className="flex">
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
            className="mr-5"
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
