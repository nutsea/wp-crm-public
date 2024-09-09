import React, { useContext, useState } from "react";
import './Settings.scss';
import { observer } from "mobx-react-lite";
import { Context } from "../../..";

import checkImg from '../imgs/check.svg'
import { fetchCourse, fetchExpressShip, fetchFee, fetchStandartShip, updateConstants } from "../../../http/constantsAPI";

export const Settings = observer(() => {
    const { constants } = useContext(Context)
    const [course, setCourse] = useState('')
    const [standartShip, setStandartShip] = useState('')
    const [expressShip, setExpressShip] = useState('')
    const [fee, setFee] = useState('')
    const [loadingCourse, setLoadingCourse] = useState(false)
    const [loadingStandartShip, setLoadingStandartShip] = useState(false)
    const [loadingExpressShip, setLoadingExpressShip] = useState(false)
    const [loadingFee, setLoadingFee] = useState(false)

    const updateConstant = async (name, value) => {
        if (Number(value) === 0) {
            return
        }
        if (name === 'course') {
            setLoadingCourse(true)
            setCourse('')
        }
        if (name === 'standartShip') {
            setLoadingStandartShip(true)
            setStandartShip('')
        }
        if (name === 'expressShip') {
            setLoadingExpressShip(true)
            setExpressShip('')
        }
        if (name === 'fee') {
            setLoadingFee(true)
            setFee('')
        }

        await updateConstants(name, Number(value)).then(async () => {
            await fetchCourse().then(data => {
                constants.setCourse(data.value)
                setLoadingCourse(false)
            })
            await fetchStandartShip().then(data => {
                constants.setStandartShip(data.value)
                setLoadingStandartShip(false)
            })
            await fetchExpressShip().then(data => {
                constants.setExpressShip(data.value)
                setLoadingExpressShip(false)
            })
            await fetchFee().then(data => {
                constants.setFee(data.value)
                setLoadingFee(false)
            })
        })
    }

    const handleChange = (e) => {
        // const value = e.target.value.replace(/\D/g, '')
        const value = e.target.value.replace(/[^0-9.]/g, '')
        if (e.target.name === 'course') {
            setCourse(value)
        }
        if (e.target.name === 'standartShip') {
            setStandartShip(value)
        }
        if (e.target.name === 'expressShip') {
            setExpressShip(value)
        }
        if (e.target.name === 'fee') {
            setFee(value)
        }
    }

    return (
        <div className="CRMSettings">
            <div className="CRMSettingsSub">Курс CNY</div>
            <div className="CRMSettingsPar">Текущий курс - {constants.course} ₽</div>
            <div className="CRMSettingsInputBox">
                <input className="CRMSettingsInput" value={course} name="course" onChange={handleChange} placeholder="Курс" />
                <div className={`CRMSettingsBtn ${Number(course) ? 'Active' : ''}`} onClick={() => updateConstant('course', course)}>
                    <img src={checkImg} alt="" />
                </div>
                {loadingCourse &&
                    <div className="InputLoader"></div>
                }
            </div>
            <div className="CRMSettingsLine"></div>
            <div className="CRMSettingsSub">Стоимость стандартной доставки</div>
            <div className="CRMSettingsPar">Текущая стоимость - {constants.standartShip} ₽</div>
            <div className="CRMSettingsInputBox">
                <input className="CRMSettingsInput" value={standartShip} name="standartShip" onChange={handleChange} placeholder="Стоимость" />
                <div className={`CRMSettingsBtn ${Number(standartShip) ? 'Active' : ''}`} onClick={() => updateConstant('standartShip', standartShip)}>
                    <img src={checkImg} alt="" />
                </div>
                {loadingStandartShip &&
                    <div className="InputLoader"></div>
                }
            </div>
            <div className="CRMSettingsLine"></div>
            <div className="CRMSettingsSub">Стоимость экспресс доставки</div>
            <div className="CRMSettingsPar">Текущая стоимость - {constants.expressShip} ₽</div>
            <div className="CRMSettingsInputBox">
                <input className="CRMSettingsInput" value={expressShip} name="expressShip" onChange={handleChange} placeholder="Стоимость" />
                <div className={`CRMSettingsBtn ${Number(expressShip) ? 'Active' : ''}`} onClick={() => updateConstant('expressShip', expressShip)}>
                    <img src={checkImg} alt="" />
                </div>
                {loadingExpressShip &&
                    <div className="InputLoader"></div>
                }
            </div>
            <div className="CRMSettingsLine"></div>
            <div className="CRMSettingsSub">Комиссия</div>
            <div className="CRMSettingsPar">Текущая комиссия - {constants.fee} ₽</div>
            <div className="CRMSettingsInputBox">
                <input className="CRMSettingsInput" value={fee} name="fee" onChange={handleChange} placeholder="Комиссия" />
                <div className={`CRMSettingsBtn ${Number(fee) ? 'Active' : ''}`} onClick={() => updateConstant('fee', fee)}>
                    <img src={checkImg} alt="" />
                </div>
                {loadingFee &&
                    <div className="InputLoader"></div>
                }
            </div>
        </div>
    )
})