import React, { useContext, useEffect, useState } from "react";
import './ItemCard.scss';
import { deletePhoto, fetchOneItem } from "../../../http/itemAPI";
import FormatPrice from "../../../utils/FormatPrice";
import { Context } from "../../..";

import { IoIosArrowBack } from "react-icons/io";
import { TbCopy, TbCopyCheckFilled } from "react-icons/tb";
import { BsTrash3 } from "react-icons/bs";
import { observer } from "mobx-react-lite";

export const ItemCard = observer(({ item, onBack }) => {
    const { constants } = useContext(Context)
    const [foundItem, setFoundItem] = useState()
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)
    const [checkedImages, setCheckedImages] = useState([])
    const [isModal, setIsModal] = useState(false)

    const handleBack = () => {
        onBack()
    }

    function isValidSize(size) {
        return /^(\d+(\.\d+)?(⅓|⅔|½)?)$/.test(size)
    }

    function convertSizeToNumeric(size) {
        size = size.replace('⅓', '.33').replace('⅔', '.67').replace('½', '.5')
        return parseFloat(size)
    }

    function sortItemsBySize(items) {
        const sizeOrder = ["xxxxs", "xxxs", "xxs", "xs", "s", "m", "l", "xl", "xxl", "xxxl", "xxxxl", "xxxxxl"]

        function getNumericValue(size) {
            return convertSizeToNumeric(size)
        }

        function getSizeOrder(size) {
            return sizeOrder.indexOf(size.toLowerCase())
        }

        function isInSizeOrder(size) {
            return sizeOrder.includes(size.toLowerCase())
        }

        const numericItems = items.filter(item => isValidSize(item.size))
        const validLetterItems = items.filter(item => !isValidSize(item.size) && isInSizeOrder(item.size))
        const invalidLetterItems = items.filter(item => !isValidSize(item.size) && !isInSizeOrder(item.size))

        numericItems.sort((a, b) => getNumericValue(a.size) - getNumericValue(b.size))

        validLetterItems.sort((a, b) => getSizeOrder(a.size) - getSizeOrder(b.size))

        return numericItems.concat(validLetterItems).concat(invalidLetterItems)
    }

    const findItem = () => {
        setLoading(true)
        fetchOneItem(item.id).then((data) => {
            setFoundItem(data)
            setLoading(false)
        })
    }

    const handleCopy = async () => {
        await navigator.clipboard.writeText(item.item_uid)
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 1000)
    }

    const formatDate = (date) => {
        const newDate = new Date(date);
        const day = newDate.getDate().toString().padStart(2, '0');
        const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
        const year = newDate.getFullYear().toString();
        return `${day}.${month}.${year}`;
    }

    const handleCheckImage = (id) => {
        if (checkedImages.includes(id)) {
            setCheckedImages(checkedImages.filter(item => item !== id))
        } else {
            setCheckedImages([...checkedImages, id])
        }
    }

    const deleteImages = () => {
        setIsModal(false)
        const promise = checkedImages.map(async img => {
            return await deletePhoto(img)
        })
        Promise.all(promise).then(() => {
            findItem()
            setCheckedImages([])
        })
    }

    useEffect(() => {
        findItem()
        // eslint-disable-next-line
    }, [])

    return (
        <div className="CRMItemCard">
            {loading ?
                <div className="LoaderBox2">
                    <div className="Loader"></div>
                </div>
                :
                <>
                    <div className="CRMBack" onClick={handleBack}>
                        <IoIosArrowBack size={14} />
                        <span className="CRMBackText">Назад</span>
                    </div>
                    <div className="CRMItemCardBrand">{item.brand}</div>
                    <div className="CRMItemCardName">{item.name}</div>
                    <div className="CRMItemCardModel">{item.model}</div>
                    <div className="CRMItemCardUid" onClick={handleCopy}>
                        {item.item_uid}
                        {copied ?
                            <TbCopyCheckFilled className="CRMItemCopyIcon" style={{ pointerEvents: 'none' }} />
                            :
                            <TbCopy className="CRMItemCopyIcon" style={{ pointerEvents: 'none' }} />
                        }
                    </div>
                    <div className="CRMItemCardDate">Обновлено: {formatDate(item.updatedAt)}</div>
                    <div className="CRMItemCardDate">Создано: {formatDate(item.createdAt)}</div>
                    <div className="CRMItemCardRow">
                        <div className="CRMItemCardLeftCol">
                            <div className="CRMItemCardSub">Изображения:</div>
                            <div className="CRMItemCardImages">
                                {foundItem && foundItem.img && foundItem.img.map((img, i) => {
                                    return (
                                        <div key={i} className="CRMItemCardImg">
                                            <input
                                                className="CRMImgDeleteCheckbox"
                                                type="checkbox"
                                                checked={checkedImages.includes(img.id)}
                                                onChange={() => handleCheckImage(img.id)}
                                            />
                                            <img src={img.img} alt="item" onClick={() => handleCheckImage(img.id)} />
                                        </div>
                                    )
                                })}
                            </div>
                            <div className={`CRMImgDeleteBtn ${checkedImages.length > 0 ? 'Active' : ''}`} onClick={() => setIsModal(true)}>
                                <BsTrash3 size={18} />
                            </div>
                            {isModal &&
                                <div className="CRMDeleteModalBox">
                                    <div className="CRMDeleteModal">
                                        <div className="CRMDeleteModalTitle">Удалить выбранные изображения?</div>
                                        <div className="CRMDeleteModalBtns">
                                            <div
                                                className="CRMDeleteModalBtn DeleteModalBtnCancel"
                                                onClick={() => {
                                                    setCheckedImages([])
                                                    setIsModal(false)
                                                }}
                                            >
                                                Отмена
                                            </div>
                                            <div className="CRMDeleteModalBtn DeleteModalBtnDelete" onClick={deleteImages}>Удалить</div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="CRMItemCardRightCol">
                            <div className="CRMItemCardSub">Таблица размеров и цен:</div>
                            <table className="CRMItemCardSizesTable">
                                <thead>
                                    <tr>
                                        <td>EU</td>
                                        <td>FR</td>
                                        <td>US</td>
                                        <td>UK</td>
                                        <td>RU</td>
                                        <td>СМ</td>
                                        <td className="TdBlue">CNY</td>
                                        <td className="TdOrange">RUB*</td>
                                        <td>Заказы</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {foundItem && foundItem.sizes && foundItem.sizes.length && sortItemsBySize(foundItem.sizes).map((size, i) => {
                                        if (size.size_type === 'EU')
                                            return (
                                                <tr key={i}>
                                                    <td>{size.size}</td>
                                                    <td>{foundItem.sizes.find(item => item.size_default === size.size && item.size_type === 'FR') ? foundItem.sizes.find(item => item.size_default === size.size && item.size_type === 'FR').size : '/'}</td>
                                                    <td>{foundItem.sizes.find(item => item.size_default === size.size && item.size_type === 'US') ? foundItem.sizes.find(item => item.size_default === size.size && item.size_type === 'US').size : '/'}</td>
                                                    <td>{foundItem.sizes.find(item => item.size_default === size.size && item.size_type === 'UK') ? foundItem.sizes.find(item => item.size_default === size.size && item.size_type === 'UK').size : '/'}</td>
                                                    <td>{foundItem.sizes.find(item => item.size_default === size.size && item.size_type === 'RU') ? foundItem.sizes.find(item => item.size_default === size.size && item.size_type === 'RU').size : '/'}</td>
                                                    {/* <td>{foundItem.sizes.find(item => item.size_default === size.size && item.size_type === 'JP') ? foundItem.sizes.find(item => item.size_default === size.size && item.size_type === 'JP').size : '/'}</td> */}
                                                    <td>
                                                        {foundItem.sizes.find(item => item.size_default === size.size && item.size_type === 'JP') ?
                                                            ((foundItem.sizes.find(item => item.size_default === size.size && item.size_type === 'JP').size > 80) ?
                                                                (foundItem.sizes.find(item => item.size_default === size.size && item.size_type === 'JP').size / 10) :
                                                                foundItem.sizes.find(item => item.size_default === size.size && item.size_type === 'JP').size) :
                                                            '/'}
                                                    </td>
                                                    <td className="TdBlue">{FormatPrice.formatPrice(size.price / 100)} ¥</td>
                                                    <td className="TdOrange">{FormatPrice.formatPrice(size.price / 100 * constants.course)} ₽</td>
                                                    <td>{size.orders}</td>
                                                </tr>
                                            )
                                        else return null
                                    })}
                                </tbody>
                            </table>
                            <div className="CRMItemCardFootnote">* Цены указаны без учета доставки и комиссии</div>
                        </div>
                    </div>
                </>
            }
        </div>
    )
})