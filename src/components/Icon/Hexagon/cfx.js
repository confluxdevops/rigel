import React from 'react'
import PropTypes from 'prop-types'
import {HEXAGON_ICON_WIDTH, HEXAGON_ICON_HEIGHT} from './../../../constants'
function Logo({width, height}) {
  return (
    <svg
      width={width || HEXAGON_ICON_WIDTH}
      height={height || HEXAGON_ICON_HEIGHT}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Property 1=Conflux tag">
        <path
          id="&#229;&#164;&#154;&#232;&#190;&#185;&#229;&#189;&#162;"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.9998 1.15455C13.2374 0.440019 14.7622 0.44002 15.9998 1.15455L24.1242 5.84515C25.3618 6.55968 26.1242 7.88019 26.1242 9.30925V18.6905C26.1242 20.1195 25.3618 21.44 24.1242 22.1546L15.9998 26.8451C14.7622 27.5597 13.2374 27.5597 11.9998 26.8451L3.87549 22.1546C2.63788 21.44 1.87549 20.1195 1.87549 18.6904V9.30925C1.87549 7.88019 2.63788 6.55968 3.87549 5.84515L11.9998 1.15455Z"
          fill="white"
        />
        <path
          id="&#229;&#164;&#154;&#232;&#190;&#185;&#229;&#189;&#162; (Stroke)"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M23.5242 6.88438L15.3998 2.19378C14.5335 1.69361 13.4662 1.69361 12.5998 2.19378L4.47549 6.88438C3.60917 7.38455 3.07549 8.30891 3.07549 9.30925V18.6904C3.07549 19.6908 3.60917 20.6151 4.47549 21.1153L12.5998 25.8059C13.4662 26.3061 14.5335 26.3061 15.3998 25.8059L23.5242 21.1153C24.3905 20.6151 24.9242 19.6908 24.9242 18.6905V9.30925C24.9242 8.30891 24.3905 7.38455 23.5242 6.88438ZM15.9998 1.15455C14.7622 0.44002 13.2374 0.440019 11.9998 1.15455L3.87549 5.84515C2.63788 6.55968 1.87549 7.88019 1.87549 9.30925V18.6904C1.87549 20.1195 2.63788 21.44 3.87549 22.1546L11.9998 26.8451C13.2374 27.5597 14.7622 27.5597 15.9998 26.8451L24.1242 22.1546C25.3618 21.44 26.1242 20.1195 26.1242 18.6905V9.30925C26.1242 7.88019 25.3618 6.55968 24.1242 5.84515L15.9998 1.15455Z"
          fill="#44D7B6"
        />
        <g id="&#231;&#188;&#150;&#231;&#187;&#132;">
          <path
            id="Fill 1"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.57861 17.6693L13.7607 22.8512L18.9757 17.6362L17.2474 15.9079L13.7812 19.3743L12.0574 17.6507L15.5237 14.1843L13.7938 12.4541L8.57861 17.6693Z"
            fill="#231916"
          />
          <path
            id="Fill 2"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.8214 5.47803L6.86914 12.4303L6.89259 15.8739L13.79 8.97663L20.7148 15.9014L20.727 12.3837L13.8214 5.47803Z"
            fill="#38A0DA"
          />
        </g>
      </g>
    </svg>
  )
}
Logo.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
}
export default Logo
