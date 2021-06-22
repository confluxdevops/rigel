import {useEffectOnce} from 'react-use'
import {useTranslation} from 'react-i18next'
import shuttleflow from '../../assets/img/SHUTTLEFLOW.png'
import tokenleft from '../../assets/img/token-left.png'
import sfcenter from '../../assets/img/sf-center.png'
import tokenright from '../../assets/img/token-right.png'
import copyright from '../../assets/img/copyright.png'
import twitter from '../../assets/img/twitter.png'
import telegram from '../../assets/img/telegram.png'
import discord from '../../assets/img/discord.png'
import medium from '../../assets/img/medium.png'
import github from '../../assets/img/github.png'
import lightleft from '../../assets/img/light-left.png'
import lightright from '../../assets/img/light-right.png'
import lightcenter from '../../assets/img/light-center.png'
import lighttunnel1 from '../../assets/img/light-tunnel1.png'
import lighttunnel2 from '../../assets/img/light-tunnel2.png'
import pipleleft from '../../assets/img/piple-left.png'
import pipleright from '../../assets/img/piple-right.png'
import baseleft from '../../assets/img/base-left.png'
import baseright from '../../assets/img/base-right.png'
import basecenter from '../../assets/img/base-center.png'
import tunnelleft from '../../assets/img/tunnel-left.png'
import tunnelright from '../../assets/img/tunnel-right.png'

function Home() {
  useEffectOnce(() => {
    const classList = document.querySelector('body').classList
    classList.remove('dark')
    classList.remove('light')
    classList.add('home')
  })
  const {i18n, t} = useTranslation()
  const {language} = i18n
  return (
    <div className="w-full min-h-15 h-screen relative">
      <div className="w-360">
        <div className="ml-24">
          <div className="pt-24">
            <img className="w-160" src={shuttleflow} alt="title" />
          </div>
          <div className="mt-9">
            <p className="text-gray-400 text-xl">{t('home.subTitle')}</p>
          </div>
          <div className="mt-9 flex">
            <a
              className="bg-primary w-32 h-10 rounded-sm flex justify-center items-center mr-5"
              href="/shuttle"
              rel="noreferrer"
              target="_blank"
            >
              <p className="text-white text-sm">{t('home.ShuttleFlow')}</p>
            </a>
            <a
              className="bg-primary w-24 h-10 rounded-sm flex justify-center items-center"
              href={
                language === 'en'
                  ? 'https://shuttleflow.io/assets/SF-whitepaper-en.bbd9b.modern.pdf'
                  : 'https://shuttleflow.io/assets/SF-whitepaper-zh.75dc3.modern.pdf'
              }
              rel="noreferrer"
              target="_blank"
            >
              <p className="text-white text-sm">{t('home.LightPaper')}</p>
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="absolute left-240 top-30">
            <img className="w-64" src={tunnelright} alt="tunnel" />
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
          <div className="absolute left-120 top-9">
            <img className="w-168" src={basecenter} alt="base" />
          </div>
          <div className="absolute left-260 top-2.5">
            <img className="w-110" src={baseright} alt="base" />
          </div>
          <div className="absolute left-65 top-60">
            <img src={tunnelleft} alt="tunnel" />
          </div>
          <div className="absolute left-48 top-48 animate-bounce">
            <img src={tokenleft} alt="token" />
          </div>
          <svg
            className="absolute left-44 top-48 w-120 h-52 "
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
            <img className="w-104" src={baseleft} alt="base" />
          </div>
          <div className="absolute left-192 top-4 animate-bounce">
            <img className="w-40" src={sfcenter} alt="sf" />
          </div>
          <div className="absolute left-302 -top-6 animate-bounce">
            <img src={tokenright} alt="token" />
          </div>
          <div className="absolute left-40 top-52 animate-pulse">
            <img src={lightleft} alt="light" />
          </div>
          <div className="absolute left-154 -top-1 animate-pulse">
            <img src={lightcenter} alt="light" />
          </div>
          <div className="absolute left-293 -top-1 animate-pulse">
            <img src={lightright} alt="light" />
          </div>
          <div className="absolute left-158 top-60 animate-pulse">
            <img src={lighttunnel1} alt="light" />
          </div>
          <div className="absolute left-280 top-34 animate-pulse">
            <img src={lighttunnel2} alt="light" />
          </div>
          <div className="absolute left-116 top-64">
            <img src={pipleleft} alt="piple" />
          </div>
          <div className="absolute left-270 top-44">
            <img src={pipleright} alt="piple" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 w-full flex justify-between py-4 border-solid border-t-2 border-gray-20">
        <div>
          <img src={copyright} alt="copyright" />
        </div>
        <div className="flex">
          <a
            className="mr-5"
            href="https://twitter.com/@Conflux_Network"
            rel="noreferrer"
            target="_blank"
          >
            <img src={twitter} alt="twitter" />
          </a>
          <a
            className="mr-5"
            href="https://t.me/Conflux_English"
            rel="noreferrer"
            target="_blank"
          >
            <img src={telegram} alt="telegram" />
          </a>
          <a
            className="mr-5"
            href="https://discord.com/invite/aCZkf2C"
            rel="noreferrer"
            target="_blank"
          >
            <img src={discord} alt="discord" />
          </a>
          <a
            className="mr-5"
            href="https://medium.com/@ConfluxNetwork"
            rel="noreferrer"
            target="_blank"
          >
            <img src={medium} alt="medium" />
          </a>
          <a
            className="mr-5"
            href="https://github.com/conflux-chain"
            rel="noreferrer"
            target="_blank"
          >
            <img src={github} alt="github" />
          </a>
        </div>
      </div>
    </div>
  )
}
export default Home
