import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { TbCopy, TbCopyCheckFilled } from "react-icons/tb";

export const Item = observer(({ item }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(item.spuId)
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 1000)
    }

    function filterString(str) {
        const regex = /[^a-zA-Zа-яА-Я0-9 ]/g
        return str.replace(regex, '')
    }

    useEffect(() => {

    }, [])

    return (
        <>
            <td>
                <div>
                    <div className="CRMParseUid" onClick={handleCopy}>
                        {item.spuId}
                        {copied ?
                            <TbCopyCheckFilled className="CRMParseCopyIcon" style={{ pointerEvents: 'none' }} />
                            :
                            <TbCopy className="CRMParseCopyIcon" style={{ pointerEvents: 'none' }} />
                        }
                    </div>
                </div>
            </td>
            <td>
                <div className="CRMParseImgBox">
                    <img className="CRMItemImg" src={item.logoUrl} alt="Фото товара" />
                </div>
            </td>
            <td className="CRMParseName">{filterString(item.title)}</td>
        </>
    )
})