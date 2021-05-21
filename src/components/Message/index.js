import Notification from 'rc-notification'
import {Loading} from '../../components'
import {
  errorFilled,
  successFilled,
  warningFilled,
  infoFilled,
} from '../../assets/images'

const IconTypes = ['info', 'success', 'error', 'warning', 'loading']

let messageInstance
let defaultDuration = 3
let defaultTop = 20
let key = 1
let defaultTransitionName = 'animation-move-up'
let defaultGetContainer
let defaultMaxCount

export function getKeyThenIncreaseKey() {
  return key++
}

function setMessageConfig(options) {
  if (options.top !== undefined) {
    defaultTop = options.top
    // delete messageInstance for new defaultTop
    messageInstance = null
  }
  if (options.duration !== undefined) {
    defaultDuration = options.duration
  }
  if (options.getContainer !== undefined) {
    defaultGetContainer = options.getContainer
  }
  if (options.transitionName !== undefined) {
    defaultTransitionName = options.transitionName
    // delete messageInstance for new transitionName
    messageInstance = null
  }
  if (options.maxCount !== undefined) {
    defaultMaxCount = options.maxCount
    messageInstance = null
  }
}

function getRCNotificationInstance(args, callback) {
  const {
    getContainer = defaultGetContainer,
    transitionName = defaultTransitionName,
    maxCount = defaultMaxCount,
  } = args
  const prefixCls = 'message'

  if (messageInstance) {
    callback({instance: messageInstance})
    return
  }

  const instanceConfig = {
    prefixCls,
    transitionName,
    style: {top: defaultTop},
    getContainer,
    maxCount,
    className: 'absolute w-full flex justify-center',
  }

  Notification.newInstance(instanceConfig, instance => {
    if (messageInstance) {
      callback({instance})
      return
    }
    messageInstance = instance

    callback({instance})
  })
}

const typeToIcon = {
  success: <img className="w-4 h-4 mr-2" src={successFilled} alt="success" />,
  info: <img className="w-4 h-4 mr-2" src={infoFilled} alt="info" />,
  error: <img className="w-4 h-4 mr-2" src={errorFilled} alt="error" />,
  warning: <img className="w-4 h-4 mr-2" src={warningFilled} alt="warning" />,
}

function getRCNoticeProps(args) {
  const {
    duration: durationArg,
    type,
    key,
    content,
    style = {},
    className = '',
    onClose,
    onClick,
    icon,
  } = args

  const duration = durationArg === undefined ? defaultDuration : durationArg

  const IconComponent =
    type === 'loading' ? (
      <Loading size="w-4 h-4" className="mr-2" />
    ) : (
      typeToIcon[type]
    )

  let typeClassName = 'text-white bg-primary'
  if (type === 'loading' || type === 'info') {
    typeClassName = 'text-black bg-white shadow-common'
  } else if (type === 'error') {
    typeClassName = 'text-error-dark bg-error'
  } else if (type === 'warning') {
    typeClassName = 'text-warning-dark bg-warning'
  }

  return {
    key,
    duration,
    style,
    className: `${className} w-100 p-3 relative ${typeClassName} mb-4 animate-move-down`,
    content: (
      <div className={`flex items-center`}>
        {icon || IconComponent || null}
        <span>{content}</span>
      </div>
    ),
    onClose: onClose,
    onClick: onClick,
  }
}

function notice(args) {
  const target = args.key || key++
  const closePromise = new Promise(resolve => {
    const callback = () => {
      if (typeof args.onClose === 'function') {
        args.onClose()
      }
      return resolve(true)
    }

    getRCNotificationInstance(args, ({instance}) => {
      instance.notice(
        getRCNoticeProps({...args, key: target, onClose: callback}),
      )
    })
  })
  const result = () => {
    if (messageInstance) {
      messageInstance.removeNotice(target)
    }
  }
  result.then = (filled, rejected) => closePromise.then(filled, rejected)
  result.promise = closePromise
  return result
}

const api = {
  open: notice,
  config: setMessageConfig,
  destroy(messageKey) {
    if (messageInstance) {
      if (messageKey) {
        const {removeNotice} = messageInstance
        removeNotice(messageKey)
      } else {
        const {destroy} = messageInstance
        destroy()
        messageInstance = null
      }
    }
  },
}

IconTypes.forEach(type => {
  api[type] = args =>
    api.open({
      ...args,
      type,
    })
})

export default api
