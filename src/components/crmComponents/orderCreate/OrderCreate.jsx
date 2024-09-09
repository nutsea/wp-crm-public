import React, { useEffect, useState } from "react";
import './OrderCreate.scss';
import FormatPrice from "../../../utils/FormatPrice";
import { fetchOneItemBySpu } from "../../../http/itemAPI";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { GoPlusCircle } from "react-icons/go";
import { createByAdmin } from "../../../http/orderAPI";
import { createUser, getAllUsers } from "../../../http/userAPI";


const statusArray = {
    0: 'В обработке',
    1: 'Принят',
    2: 'Выкуплен',
    3: 'Получен трек',
    4: 'Принят в Китае',
    5: 'Оформляется',
    6: 'Доставляется в Россию',
    7: 'Прибыл в Россию',
    8: 'Передан в СДЭК',
    9: 'Выполнен',
    10: 'Требует уточнений',
    11: 'Отменен'
}

export const OrderCreate = ({ onCreate }) => {
    const [orderAllow, setOrderAllow] = useState(true)
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [clientPhone, setClientPhone] = useState('')
    const [shipType, setShipType] = useState('home')
    const [ship, setShip] = useState('slow')
    const [status, setStatus] = useState(0)
    const [comment, setComment] = useState('')
    const [recipient, setRecipient] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [deliveryCost, setDeliveryCost] = useState(0)
    const [isSplit, setIsSplit] = useState(false)
    const [firstPaid, setFirstPaid] = useState(false)
    const [firstPay, setFirstPay] = useState('')
    const [secondPaid, setSecondPaid] = useState(false)
    const [secondPay, setSecondPay] = useState('')
    const [paid, setPaid] = useState('')
    const [course, setCourse] = useState('')
    const [fee, setFee] = useState('')
    const [cost, setCost] = useState('')
    const [isPromo, setIsPromo] = useState(false)
    const [promo, setPromo] = useState('')
    const [discount, setDiscount] = useState('')
    const [discountCost, setDiscountCost] = useState('')
    const [uidAdd, setUidAdd] = useState('')
    const [uidItem, setUidItem] = useState(null)
    const [sizeAdd, setSizeAdd] = useState(null)
    const [uidDelivery, setUidDelivery] = useState('')
    const [uidFee, setUidFee] = useState('')
    const [addedItems, setAddedItems] = useState([])
    const [socialMediaType, setSocialMediaType] = useState('VK')
    const [socialMedia, setSocialMedia] = useState('')

    const [listOpen, setListOpen] = useState(false)
    const [shipListOpen, setShipListOpen] = useState(false)
    const [orderStatusListOpen, setOrderStatusListOpen] = useState(false)
    const [socialMediaListOpen, setSocialMediaListOpen] = useState(false)
    const [courseAddedd, setCourseAdded] = useState(false)

    const [user, setUser] = useState(null)
    const [users, setUsers] = useState(null)
    const [autocomplete, setAutocomplete] = useState([])
    const [search, setSearch] = useState('')

    const [createClient, setCreateClient] = useState(false)
    const [focusClient, setFocusClient] = useState(false)

    const handleClientPhone = (e) => {
        let value = e.target.value.replace(/\D/g, '')
        if (value.length > 11) {
            value = value.slice(0, 11)
        }
        setClientPhone(value)
    }

    const handleRecipientPhone = (e) => {
        let value = e.target.value.replace(/\D/g, '')
        if (value.length > 11) {
            value = value.slice(0, 11)
        }
        setPhone(value)
    }

    const handleUser = (e) => {
        const value = e.target.value
        const valueArr = value.split(' ')
        if (value.length === 0) {
            setAutocomplete([])
        } else {
            setAutocomplete(users.filter(user => {
                let allCompare = true
                for (let i of valueArr) {
                    if (!user.name?.toLowerCase().includes(i.toLowerCase()) &&
                        !user.surname?.toLowerCase().includes(i.toLowerCase()) &&
                        !user.phone?.toLowerCase().includes(i.toLowerCase()) &&
                        !user.link?.toLowerCase().includes(i.toLowerCase())) allCompare = false

                    if (!user.name && !user.surname && !user.phone) allCompare = false
                }
                return allCompare
            }))
        }
        setUser(value)
    }

    const handleCreateUser = async () => {
        setSearch('Создание клиента...')
        setCreateClient(false)
        try {
            await createUser(name, clientPhone, socialMedia, socialMediaType).then(user => {
                setSearch(user.name + ' ' + user.surname + ' ' + user.phone)
                setUser(user)
                findAllUsers()
            })
        } catch (e) {
            setSearch('Ошибка')
        }
    }

    const handleFindUid = async () => {
        if (!uidAdd) return
        await fetchOneItemBySpu(uidAdd).then(data => {
            setUidItem(data)
            console.log(data)
        })
    }

    const findAllUsers = async () => {
        await getAllUsers().then(data => {
            setUsers(data)
        })
    }

    const handleItemToOrder = () => {
        if (!uidItem || !sizeAdd) return
        setAddedItems([...addedItems, {
            item_uid: uidItem.item_uid,
            img: uidItem.img[0].img,
            name: uidItem.name,
            category: uidItem.category,
            size: sizeAdd.size,
            ship: ship,
            cny_cost: sizeAdd.price / 100,
            fee: uidFee,
            delivery_cost: uidDelivery,
        }])
        const delivery_cost = deliveryCost ? Number(deliveryCost) + Number(uidDelivery) : Number(uidDelivery)
        const fee_cost = fee ? Number(fee) + Number(uidFee) : Number(uidFee)
        const cost_cost = cost ? Number(cost) + Number(sizeAdd.price / 100 * course) + Number(fee_cost) + Number(delivery_cost) : Number(sizeAdd.price / 100 * course) + Number(fee_cost) + Number(delivery_cost)
        const discount_cost = discountCost ? Number(discountCost) + Number(sizeAdd.price / 100 * course) + Number(fee_cost) + Number(delivery_cost) : Number(sizeAdd.price / 100 * course) + Number(fee_cost) + Number(delivery_cost)
        setDeliveryCost(delivery_cost)
        setFee(fee_cost)
        setCost(cost_cost)
        setDiscountCost(discount_cost)
        setCourseAdded(true)
        setUidAdd('')
        setUidItem(null)
        setSizeAdd(null)
        setUidDelivery('')
        setUidFee('')
    }

    const handleCreateOrder = async () => {
        await createByAdmin(name, surname, socialMedia, recipient, phone, address, shipType, isSplit, firstPay, secondPay, firstPaid, secondPaid, paid, course, cost, discount, promo, comment, orderAllow, status, addedItems, socialMediaType, user ? user.id : null).then(data => {
            onCreate()
        })
    }

    useEffect(() => {
        handleFindUid()
        // eslint-disable-next-line
    }, [uidAdd])

    useEffect(() => {
        findAllUsers()
    }, [])

    return (
        <div className="CRMOrderCreate">
            <div className="CRMOrderCreateSub">Создание заказа</div>
            <div className="CRMOrdersNotAllow">
                <input type="checkbox" checked={orderAllow} onChange={() => setOrderAllow(!orderAllow)} />
                <span>Разрешить оставлять отзыв</span>
            </div>
            <div className="OrderCardLineBeforeSub"></div>
            <div className="CRMOrderCardSub">1. Основное</div>
            <div className="CRMOrderCardRow">
                <div className="CRMOrderCardCol">
                    <div className="CRMOrderInputBox">
                        <div className="CRMOrderCardTip">Клиент</div>
                        <input
                            className="CRMOrderCardInput CRMCreateInput"
                            value={search}
                            onChange={(e) => {
                                handleUser(e)
                                setSearch(e.target.value)
                            }}
                            onFocus={(e) => {
                                setFocusClient(true)
                                setSearch(e.target.value)
                                handleUser(e)
                            }}
                            onBlur={() => setTimeout(() => setFocusClient(false), 200)}
                        />
                        {focusClient &&
                            <div className={`AutocompleteBrand`}>
                                <div className="AutocompleteItemBrand" onClick={() => setCreateClient(true)}>
                                    <GoPlusCircle size={16} style={{ marginRight: 6 }} />
                                    <span>Добавить клиента</span>
                                </div>
                                {autocomplete.length > 0 && autocomplete.map((user, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="AutocompleteItemBrand"
                                            onClick={() => {
                                                setUser(user)
                                                setName(user.name + ' ' + user.surname)
                                                setSurname(user.surname)
                                                setClientPhone(user.phone)
                                                setAutocomplete([])
                                                setSearch(user.name + ' ' + user.surname + ' ' + user.phone)
                                            }}
                                        >
                                            {user.name} {user.surname} {user.phone}
                                        </div>
                                    )
                                })}
                            </div>
                        }
                        {createClient &&
                            <div className={`CRMOrderInputModal`}>
                                <div className="CRMOrderInputBox" style={{ marginTop: 0 }}>
                                    <div className="CRMOrderCardTip">Имя клиента</div>
                                    <input className="CRMOrderCardInput CRMCreateInput" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                {/* <div className="CRMOrderInputBox">
                                    <div className="CRMOrderCardTip">Фамилия клиента</div>
                                    <input className="CRMOrderCardInput CRMCreateInput" value={surname} onChange={(e) => setSurname(e.target.value)} />
                                </div> */}
                                <div className="CRMOrderInputBox">
                                    <div className="CRMOrderCardTip">Телефон клиента</div>
                                    <input className="CRMOrderCardInput CRMCreateInput" type="number" maxLength={11} value={clientPhone} onChange={handleClientPhone} />
                                </div>
                                <div className="CRMOrderInputBox">
                                    <div className="CRMOrderCardTip">Соц. сеть для связи</div>
                                    <div className="CRMOrderInputCol">
                                        <div className="OrderSelect" onClick={() => setSocialMediaListOpen(!socialMediaListOpen)}>
                                            <span>{socialMediaType}</span>
                                            {socialMediaListOpen ?
                                                <IoIosArrowUp size={14} />
                                                :
                                                <IoIosArrowDown size={14} />
                                            }
                                            {socialMediaListOpen &&
                                                <div className="OrderSelectList">
                                                    <div className="OrderSelectItem" onClick={() => setSocialMediaType('VK')}>VK</div>
                                                    <div className="OrderSelectItem" onClick={() => setSocialMediaType('Telegram')}>Telegram</div>
                                                </div>
                                            }
                                        </div>
                                        <input className="CRMOrderCardInput CRMCreateInput" value={socialMedia} onChange={(e) => setSocialMedia(e.target.value)} />
                                    </div>
                                </div>
                                <div className="CRMOrderInputModalBtns">
                                    <div className="Cancel" onClick={() => setCreateClient(false)}>Отменить</div>
                                    <div className="Submit" onClick={handleCreateUser}>Добавить</div>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="CRMOrderInputBox">
                        <div className="CRMOrderCardTip">Статус</div>
                        <div className="OrderSelect" onClick={() => setOrderStatusListOpen(!orderStatusListOpen)}>
                            <span>{statusArray[status]}</span>
                            {orderStatusListOpen ?
                                <IoIosArrowUp size={14} />
                                :
                                <IoIosArrowDown size={14} />
                            }
                            {orderStatusListOpen &&
                                <div className="OrderSelectList">
                                    <div className="OrderSelectItem" onClick={() => setStatus(0)}>В обработке</div>
                                    <div className="OrderSelectItem" onClick={() => setStatus(1)}>Принят</div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="CRMOrderCardCol">
                    <div className="CRMOrderInputBox">
                        <div className="CRMOrderCardTip">Комментарий</div>
                        <input className="CRMOrderCardInput CRMCreateInput" value={comment} onChange={(e) => setComment(e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="OrderCardLineBeforeSub"></div>
            <div className="CRMOrderCardSub">2. Логистика</div>
            <div className="CRMOrderCardRow">
                <div className="CRMOrderCardCol">
                    <div className="CRMOrderInputBox">
                        <div className="CRMOrderCardTip">ФИО Получателя</div>
                        <input className="CRMOrderCardInput CRMCreateInput" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
                    </div>
                    <div className="CRMOrderInputBox">
                        <div className="CRMOrderCardTip">Телефон получателя</div>
                        <input className="CRMOrderCardInput CRMCreateInput" type="number" value={phone} onChange={handleRecipientPhone} />
                    </div>
                    <div className="CRMOrderInputBox">
                        <div className="CRMOrderCardTip">Адрес получателя</div>
                        <textarea className="CRMOrderCardInput CRMCreateInput" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>
                </div>
                <div className="CRMOrderCardCol">
                    <div className="CRMOrderInputBox">
                        <div className="CRMOrderCardTip">Доставка</div>
                        <div className="OrderSelect" onClick={() => setListOpen(!listOpen)}>
                            <span>{shipType === 'home' ? 'Курьер' : (shipType === 'point') && 'Пункт выдачи'}</span>
                            {listOpen ?
                                <IoIosArrowUp size={14} />
                                :
                                <IoIosArrowDown size={14} />
                            }
                            {listOpen &&
                                <div className="OrderSelectList">
                                    <div className="OrderSelectItem" onClick={() => setShipType('home')}>Курьер</div>
                                    <div className="OrderSelectItem" onClick={() => setShipType('point')}>Пункт выдачи</div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="CRMOrderInputBox">
                        <div className="CRMOrderCardTip">Скорость доставки</div>
                        <div className="OrderSelect" onClick={() => setShipListOpen(!shipListOpen)}>
                            <span>{ship === 'slow' ? 'Стандарт' : (ship === 'fast') && 'Экспресс'}</span>
                            {shipListOpen ?
                                <IoIosArrowUp size={14} />
                                :
                                <IoIosArrowDown size={14} />
                            }
                            {shipListOpen &&
                                <div className="OrderSelectList">
                                    <div className="OrderSelectItem" onClick={() => setShip('slow')}>Стандарт</div>
                                    <div className="OrderSelectItem" onClick={() => setShip('fast')}>Экспресс</div>
                                </div>
                            }
                        </div>
                    </div>
                    {deliveryCost !== 0 &&
                        <div className="CRMOrderInputBox">
                            <div className="CRMOrderCardTip">Стоимость доставки</div>
                            <div className="CRMOrderCardInfo">{deliveryCost} ₽</div>
                        </div>
                    }
                </div>
            </div>

            <div className="OrderCardLineBeforeSub"></div>
            <div className="CRMOrderCardSub">3. Оплата</div>
            <div className="CRMOrderCardRow">
                <div className="CRMOrderCardCol">
                    <div className="CRMOrdersNotAllow">
                        <input type="checkbox" checked={isSplit} onChange={() => setIsSplit(!isSplit)} />
                        <span>Оплата сплит</span>
                    </div>
                    {isSplit &&
                        <>
                            <div className="CRMOrderInputBox">
                                <div className="CRMOrderCardTip">Первый платеж</div>
                                <div className="CRMOrderCardPayment">
                                    <input className="CRMOrderCardPaymentCheck" type="checkbox" checked={firstPaid} onChange={() => setFirstPaid(!firstPaid)} />
                                    <input className="CRMOrderCardInput CRMCreateInput" value={firstPay} type="number" onChange={(e) => setFirstPay(e.target.value)} />
                                </div>
                            </div>
                            <div className="CRMOrderInputBox">
                                <div className="CRMOrderCardTip">Второй платеж</div>
                                <div className="CRMOrderCardPayment">
                                    <input className="CRMOrderCardPaymentCheck" type="checkbox" checked={secondPaid} onChange={() => setSecondPaid(!secondPaid)} />
                                    <input className="CRMOrderCardInput CRMCreateInput" value={secondPay} type="number" onChange={(e) => setSecondPay(e.target.value)} />
                                </div>
                            </div>
                        </>
                    }
                    <div className="CRMOrderInputBox">
                        <div className="CRMOrderCardTip">Оплачено</div>
                        <input className="CRMOrderCardInput CRMCreateInput" value={paid} type="number" onChange={(e) => setPaid(e.target.value)} />
                    </div>
                </div>
                <div className="CRMOrderCardCol">
                    {courseAddedd &&
                        <>
                            <div className="CRMOrderInputBox">
                                <div className="CRMOrderCardTip">Курс на момент оформления</div>
                                <div className="CRMOrderCardInfo">{course} ₽</div>
                            </div>
                        </>
                    }
                    {fee &&
                        <>
                            <div className="CRMOrderInputBox">
                                <div className="CRMOrderCardTip">Комиссия</div>
                                <div className="CRMOrderCardInfo">{fee} ₽</div>
                            </div>
                        </>
                    }
                    {cost &&
                        <>
                            <div className="CRMOrderInputBox">
                                <div className="CRMOrderCardTip">Стоимость заказа</div>
                                <div className="CRMOrderCardInfo">{cost} ₽</div>
                            </div>
                        </>
                    }
                    <div className="CRMOrdersNotAllow">
                        <input type="checkbox" checked={isPromo} onChange={() => setIsPromo(!isPromo)} />
                        <span>Промокод</span>
                    </div>
                    {isPromo &&
                        <>
                            <div className="CRMOrderInputBox">
                                <div className="CRMOrderCardTip">Промокод</div>
                                <input className="CRMOrderCardInput CRMCreateInput" value={promo} onChange={(e) => setPromo(e.target.value)} />
                            </div>
                            <div className="CRMOrderInputBox">
                                <div className="CRMOrderCardTip">Скидка</div>
                                <input className="CRMOrderCardInput CRMCreateInput" value={discount} type="number" onChange={(e) => setDiscount(e.target.value)} />
                            </div>
                        </>
                    }
                </div>
            </div>

            <div className="OrderCardLineBeforeSub"></div>
            <div className="CRMOrderCardSub">4. Позиции заказа:</div>
            {addedItems && addedItems.length > 0 &&
                <>
                    <div className="CRMOrderCardItemsTable">
                        <table>
                            <thead>
                                <tr>
                                    <td>Наименование</td>
                                    <td>Размер</td>
                                    <td>Цена CNY</td>
                                    <td>Цена RUB</td>
                                </tr>
                            </thead>
                            <tbody>
                                {addedItems.map((item, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>
                                                <div>{item.name}</div>
                                                <div className="OrderCardTableId">{item.item_uid}</div>
                                            </td>
                                            <td>{item.size}</td>
                                            <td><div className="CRMOrderCardItemPrice Blue">{FormatPrice.formatPrice(item.cny_cost)} ¥</div></td>
                                            {/* <td><div className="CRMOrderCardItemPrice Orange">{FormatPrice.formatPrice(item.rub_cost)} ₽</div></td> */}
                                            <td><div className="CRMOrderCardItemPrice Orange">{FormatPrice.formatPrice(item.cny_cost * course)} ₽</div></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {/* {addedItems.map((item, i) => {
                            return (
                                <div key={i} className="CRMOrderCardItem">
                                    <img src={item.img} alt="" />
                                    <div className="CRMOrderCardItemInfo">
                                        <div className="CRMOrderCardItemUid" onClick={() => handleCopy(item)}>
                                            {item.item_uid}
                                            {copied && copied === item.item_uid ?
                                                <TbCopyCheckFilled className="CRMItemCopyIcon" style={{ pointerEvents: 'none' }} />
                                                :
                                                <TbCopy className="CRMItemCopyIcon" style={{ pointerEvents: 'none' }} />
                                            }
                                        </div>
                                        <div className="CRMOrderCardItemName">{item.name}</div>
                                        <div className="CRMOrderCardInfo2">
                                            <span className="CRMOrderCardItemTip">Размер: </span>
                                            {item.size}
                                        </div>
                                        <div className="CRMOrderCardItemShip">
                                            <span className="CRMOrderCardItemTip">Доставка: </span>
                                            {ship === 'slow' ?
                                                <span className="CRMOrderCardSlow"> Стандарт</span>
                                                : (ship === 'fast') &&
                                                <span className="CRMOrderCardFast"> Экспресс</span>
                                            }
                                        </div>
                                        <div className="CRMOrderCardItemPrice Blue">{FormatPrice.formatPrice(item.cny_cost)} ¥</div>
                                        <div className="CRMOrderCardItemPrice Orange">{FormatPrice.formatPrice(item.rub_cost)} ₽</div>
                                        <div className="CRMOrderCardInfo2">
                                            <span className="CRMOrderCardItemTip">Комиссия: </span>
                                            {item.fee} ₽
                                        </div>
                                        <div className="CRMOrderCardInfo2">
                                            <span className="CRMOrderCardItemTip">Стоимость доставки: </span>
                                            {item.delivery_cost} ₽
                                        </div>
                                    </div>
                                </div>
                            )
                        })} */}
                    </div>
                </>
            }
            <input className="CRMOrderCardInputUid CRMCreateInput" value={uidAdd} onChange={(e) => setUidAdd(e.target.value)} placeholder="Введите id товара" />
            {uidItem && uidItem.name ?
                <>
                    <div className="CRMOrderCardItem NoBorderOrderItem">
                        <img src={uidItem.img[0].img} alt="" />
                        <div className="CRMOrderCardItemInfo">
                            <div className="CRMOrderCardItemName">{uidItem.name}</div>
                            {sizeAdd &&
                                <div className="CRMOrderCardItemPrice Orange">{FormatPrice.formatPrice(sizeAdd.price / 100)} ¥</div>
                            }
                            {uidItem.sizes.length > 0 &&
                                <div className="CRMOrderCardItemSize CRMFlexSizes">
                                    {uidItem.sizes && uidItem.sizes.map((size, i) => {
                                        if (size.size_type === 'EU')
                                            return (
                                                <div key={i} className={`CRMOrderCardItemSizeBtn ${sizeAdd === size ? 'CRMChosenSize' : ''}`} onClick={() => setSizeAdd(size)}>{size.size}</div>
                                            )
                                        else return null
                                    })}
                                </div>
                            }
                        </div>
                    </div>
                    <input className="CRMOrderCardInputUid CRMCreateInput" value={uidDelivery} type="number" onChange={(e) => setUidDelivery(e.target.value)} placeholder="Стоимость доставки" />
                    <input className="CRMOrderCardInputUid CRMCreateInput" value={uidFee} type="number" onChange={(e) => setUidFee(e.target.value)} placeholder="Комиссия" />
                    {!courseAddedd &&
                        <input className="CRMOrderCardInputUid CRMCreateInput" value={course} type="number" onChange={(e) => setCourse(e.target.value)} placeholder="Курс" />
                    }
                </>
                : ((!uidItem || !uidItem.name) && uidAdd) &&
                <div className="CRMOrderItemNotFound">Товар не найден</div>
            }
            <div className={`CRMOrderCardAddItems ${uidItem && uidItem.name && sizeAdd && course && user ? 'Active' : ''}`} onClick={handleItemToOrder}>Добавить товар</div>
            <div className="CRMOrderCardSaveBtn" onClick={handleCreateOrder}>Сохранить</div>
        </div>
    )
}