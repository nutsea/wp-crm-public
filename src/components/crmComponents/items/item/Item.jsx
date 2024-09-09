import React, { useEffect, useState } from "react";
import './Item.scss';
import { observer } from "mobx-react-lite";
import { TbCopy, TbCopyCheckFilled } from "react-icons/tb";
import FormatPrice from "../../../../utils/FormatPrice";

export const Item = observer(({ item }) => {
    const [copied, setCopied] = useState(false)

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

    useEffect(() => {

    }, [])

    return (
        <>
            <td>
                <div className="CRMItemUidBox">
                    <div className="CRMItemUid noThumb" onClick={handleCopy}>
                        {item.item_uid}
                        {copied ?
                            <TbCopyCheckFilled className="CRMItemCopyIcon" style={{ pointerEvents: 'none' }} />
                            :
                            <TbCopy className="CRMItemCopyIcon" style={{ pointerEvents: 'none' }} />
                        }
                    </div>
                </div>
            </td>
            <td>
                <div className="CRMItemImgBox">
                    <img className="CRMItemImg" src={item.img} alt="Фото товара" />
                </div>
            </td>
            <td className="CRMItemName">{item.name}</td>
            <td className="CRMItemPrice Blue">
                <span>{item.minPrice !== 1000000000 ? FormatPrice.formatPrice(item.minPrice / 100) + ' ¥' : ''} - {item.maxPrice !== 0 ? FormatPrice.formatPrice(item.maxPrice / 100) + ' ¥' : ''}</span>
            </td>
            <td className="CRMItemOrders">
                {item.orders}
            </td>
            <td className="CRMItemDate">{formatDate(item.updatedAt)}</td>
        </>
    )
})