function SvgBackground(props) {
  return (
    <svg
      viewBox="0 0 1440 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M2 0h1440v900H2V0z" fill="#E9EBF5" />
      <path d="M2 0h1440v900H2V0z" fill="#fff" />
      <mask
        id="background_svg__a"
        maskUnits="userSpaceOnUse"
        x={2}
        y={0}
        width={1440}
        height={900}
      >
        <path d="M2 0h1440v900H2V0z" fill="#E9EBF5" />
        <path d="M2 0h1440v900H2V0z" fill="#fff" />
      </mask>
      <g mask="url(#background_svg__a)">
        <path
          d="M895.155 103.805C809.795 110.877 736.5 58.5 728-7h734.11c-2 121.854-4.8 366.699 0 371.245 6 5.682-17.99 10.417-84.6-29.359s-14.52-127.221-65.03-150.897c-34.09-15.982-25.16 13.827-88.7 0-68.19-14.837-32.52-101.019-107.97-117.119-75.44-16.1-113.96 28.096-220.655 36.935z"
          fill="#F8F9FE"
          stroke="#EAEDFC"
          strokeWidth={2}
        />
        <path
          d="M480.628 347.342c51.739-45.876 182.818-135.205 293.228-125.508C911.869 233.955 1029.5 501 1243.87 506.263c181.92 4.466 202.77-25.234 227.13-29.263"
          stroke="#F8F9FE"
          strokeWidth={2}
        />
        <path
          d="M175.939 312.018C73.905 316.749-43.942 223.042-85.31 175L-111 1067h1658V626.726c-21.61-1.317-103-17.726-285.36 0-219.54 21.339-194.04 185.332-416.968 105.428C688 676 814.388 281.23 631 222c-222-71.701-239 80-455.061 90.018z"
          fill="url(#background_svg__paint0_linear)"
        />
        <path
          d="M7.474 469.009c-57.594 13.273-90.98 5.53-100.474 0V1043h1574.36c14.9-103.763 2.38-309.789-166.93-303.785-211.63 7.506-183.54 122.067-450.549 101.92-267.009-20.147-372.626-348.029-504.35-416.766-131.725-68.736-280.063 28.048-352.057 44.64z"
          fill="#F8F9FE"
          stroke="#EAEDFC"
          strokeWidth={2}
        />
        <path
          d="M311.44-95c11.854 47.417 12.565 154.783-79.418 204.906-114.978 62.654-227.98-22.461-279.74-18.52-41.408 3.152-66.775 1.313-74.282 0"
          stroke="#F8F9FE"
          strokeWidth={2}
        />
      </g>
      <defs>
        <linearGradient
          id="background_svg__paint0_linear"
          x1={766.5}
          y1={323}
          x2={567.5}
          y2={796.5}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.032} stopColor="#F8F9FE" />
          <stop offset={1} stopColor="#F8F9FE" stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default SvgBackground
