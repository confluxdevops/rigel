import {useTranslation} from 'react-i18next'
import {Robot} from '../../assets/img'

function Maintenance() {
  const {t} = useTranslation()
  return (
    <div className="fixed w-screen h-screen pt-32 bg-info-10 flex flex-col items-center">
      <img className="w-100 md:w-200" src={Robot} alt="robot" />
      <p className="mt-8 text-gray-100 text-2lg">
        {t('maintenance.underMaint')}
      </p>
      <p className="mt-1 mx-4 text-gray-60 text-base text-center">
        {t('maintenance.maintDesc1')}
      </p>
      <p className="mx-4 text-gray-60 text-base">
        {t('maintenance.maintDesc2')}
      </p>
    </div>
  )
}
export default Maintenance
