import React, { useEffect, useState } from "react";
import './PoizonParse.scss';
import { Item } from "./item/Item";
import { fetchBrandsAndModels, getLinkItem, getSpuIds, getSpuItems } from "../../../http/itemAPI";

import { RxDownload } from "react-icons/rx";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

// eslint-disable-next-line
const parsedTest = {
    "total": 2773,
    "page": 2,
    "lastId": "10",
    "productList": [
        {
            "spuId": 7609771,
            "logoUrl": "https://cdn.poizon.com/pro-img/origin-img/20240321/14c77ef0f97c420881c33c6450d8f86d.jpg",
            "images": [
                "https://cdn.poizon.com/pro-img/origin-img/20240321/14c77ef0f97c420881c33c6450d8f86d.jpg"
            ],
            "title": "adidas originals FORUM 皮革绒面革 圆头系带 减震耐磨 低帮 板鞋 女款 白灰蓝",
            "articleNumber": "IG3964"
        },
        {
            "spuId": 1370855,
            "logoUrl": "https://cdn.poizon.com/pro-img/origin-img/20220212/a6d20381bdc247d7b6c6d7b751293d92.jpg",
            "images": [
                "https://cdn.poizon.com/pro-img/origin-img/20220212/a6d20381bdc247d7b6c6d7b751293d92.jpg"
            ],
            "title": "adidas originals FORUM 84 Low Adv 防滑耐磨 低帮 板鞋 男款 米白",
            "articleNumber": "FY7998"
        },
        {
            "spuId": 3847744,
            "logoUrl": "https://cdn.poizon.com/pro-img/origin-img/20221220/7805d46f3f314319886fd883137dec49.jpg",
            "images": [
                "https://cdn.poizon.com/pro-img/origin-img/20221220/7805d46f3f314319886fd883137dec49.jpg"
            ],
            "title": "Nike Dunk Low \"Noble Green\" 防滑耐磨 低帮 板鞋 女款 绿色",
            "articleNumber": "FD0350-133"
        },
        {
            "spuId": 7588193,
            "logoUrl": "https://cdn.poizon.com/pro-img/origin-img/20240415/34fa172a78c641ed9c3fcd07e4363e0b.jpg",
            "images": [
                "https://cdn.poizon.com/pro-img/origin-img/20240415/34fa172a78c641ed9c3fcd07e4363e0b.jpg"
            ],
            "title": "adidas originals FORUM 百搭休闲 轻松舒适 减震耐磨 低帮 板鞋 男女同款 白色",
            "articleNumber": "IG3769"
        },
        {
            "spuId": 11543209,
            "logoUrl": "https://cdn.poizon.com/pro-img/origin-img/20240618/de3a4b86349947ce9d6a0b42ffce21e9.jpg",
            "images": [
                "https://cdn.poizon.com/pro-img/origin-img/20240618/de3a4b86349947ce9d6a0b42ffce21e9.jpg"
            ],
            "title": "adidas originals FORUM Low Cl 舒适 防滑耐磨 低帮 板鞋 男女同款 白色",
            "articleNumber": "IH7828"
        }
    ]
}

const categories = {
    shoes: 'Обувь',
    clothes: 'Одежда',
    accessories: 'Аксессуары',
    cosmetics: 'Косметика',
    perfumery: 'Парфюмерия'
}

export const PoizonParse = ({ onDownload }) => {
    const [keyword, setKeyword] = useState('')
    const [limit, setLimit] = useState('')
    const [page, setPage] = useState('') // -1
    const [parsed, setParsed] = useState([])
    const [checked, setChecked] = useState([])
    const [loading, setLoading] = useState(false)
    const [wasParsed, setWasParsed] = useState(false)
    const [category, setCategory] = useState('shoes')
    const [listOpen, setListOpen] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [timeElapsed, setTimeElapsed] = useState('')
    const [timeElapsed2, setTimeElapsed2] = useState('')
    const [brand, setBrand] = useState('')
    const [model, setModel] = useState('')
    const [autocomplete, setAutocomplete] = useState([])
    const [autocomplete2, setAutocomplete2] = useState([])
    const [brands, setBrands] = useState([])
    const [models, setModels] = useState([])
    const [link, setLink] = useState('')
    const [parseTab, setParseTab] = useState('search')
    const [error, setError] = useState(false)

    const handleKeyword = (e) => {
        setKeyword(e.target.value)
    }

    const handleLink = (e) => {
        setLink(e.target.value)
    }

    const handleLimit = (e) => {
        const value = e.target.value.replace(/\D/g, '')
        setLimit(value)
    }

    const handlePage = (e) => {
        const value = e.target.value.replace(/\D/g, '')
        setPage(value)
    }

    const handleTimeElapsed = (e) => {
        const value = e.target.value.replace(/\D/g, '')
        setTimeElapsed(value)
    }

    const handleTimeElapsed2 = (e) => {
        const value = e.target.value.replace(/\D/g, '')
        setTimeElapsed2(value)
    }

    const checkAll = () => {
        if (parsed.productList.map(item => item.spuId).every(id => checked.includes(id))) {
            setChecked(checked.filter(id => !parsed.productList.map(item => item.spuId).includes(id)))
            const checkboxes = document.querySelectorAll('#itemCheck')
            checkboxes.forEach(checkbox => {
                checkbox.checked = false
            })
        } else {
            setChecked(parsed.productList.map(item => item.spuId))
            const checkboxes = document.querySelectorAll('#itemCheck')
            checkboxes.forEach(checkbox => {
                checkbox.checked = true
            })
        }
    }

    const handleCheck = (id) => {
        if (checked.includes(id)) {
            setChecked(checked.filter(i => i !== id))
        } else {
            setChecked([...checked, id])
        }
    }

    const handleParse = async () => {
        try {
            setLoading(true)
            await getSpuIds(keyword, limit, page - 1, timeElapsed).then(data => {
                setParsed(data)
                setLoading(false)
                setWasParsed(true)
            })
        } catch (e) {
            setLoading(false)
            setError(true)
        }
    }

    const handleDownload = async () => {
        setIsDownloading(true)
        await getSpuItems(checked, category, timeElapsed2, brand, model).then(data => {
            onDownload()
        })
    }

    const handleDownload2 = async () => {
        setIsDownloading(true)
        await getLinkItem(link, category, timeElapsed2, brand, model).then(data => {
            onDownload()
        })
    }

    const findBrands = async () => {
        await fetchBrandsAndModels().then(data => {
            setBrands(data)
            for (let i of data) {
                for (let j of i.models) {
                    setModels(prev => [...prev, j])
                }
            }
        })
    }

    const handleBrand = (e) => {
        const value = e.target.value
        const valueArr = value.split(' ')
        if (value.length === 0) {
            setAutocomplete([])
        } else {
            setAutocomplete(brands.filter(brand => {
                let allCompare = true
                for (let i of valueArr) {
                    if (!brand.brand.toLowerCase().includes(i.toLowerCase())) allCompare = false
                }
                return allCompare
            }))
        }
        setBrand(value)
    }

    const handleModel = (e) => {
        const value = e.target.value
        const valueArr = value.split(' ')
        if (value.length === 0) {
            setAutocomplete2([])
        } else {
            setAutocomplete2(models.filter(model => {
                let allCompare = true
                for (let i of valueArr) {
                    if (!model.model.toLowerCase().includes(i.toLowerCase())) allCompare = false
                    if (brand && model.brand !== brand) allCompare = false
                }
                return allCompare
            }))
        }
        setModel(value)
    }

    useEffect(() => {
        findBrands()
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.ParseSelect')) {
                setListOpen(false)
            }

            if (!e.target.closest('.BrandInputBox')) {
                setAutocomplete([])
            } else {
                const value = document.querySelector('.BrandInput').value
                if (value.length > 0) {
                    const valueArr = value.split(' ')
                    setAutocomplete(brands.filter(brand => {
                        let allCompare = true
                        for (let i of valueArr) {
                            if (!brand.brand.toLowerCase().includes(i.toLowerCase())) allCompare = false
                        }
                        return allCompare
                    }))
                }
            }

            if (!e.target.closest('.ModelInputBox')) {
                setAutocomplete2([])
            } else {
                const value = document.querySelector('.ModelInput').value
                if (value.length > 0) {
                    const valueArr = value.split(' ')
                    setAutocomplete2(models.filter(model => {
                        let allCompare = true
                        for (let i of valueArr) {
                            if (!model.model.toLowerCase().includes(i.toLowerCase())) allCompare = false
                            if (brand && model.brand !== brand) allCompare = false
                        }
                        return allCompare
                    }))
                }
            }
        })
        // eslint-disable-next-line
    }, [])

    return (
        <div className="CRMParse">
            <div className="CRMOrdersTabs">
                <div className={`CRMOrdersTab ${parseTab === 'search' ? 'Active' : ''}`} onClick={() => setParseTab('search')}>Поиск товаров</div>
                <div className="CRMOrdersTabLine"></div>
                <div className={`CRMOrdersTab ${parseTab === 'link' ? 'Active' : ''}`} onClick={() => setParseTab('link')}>Товары по ссылке</div>
            </div>
            {parseTab === 'search' &&
                <div className="CRMParseRow">
                    <div className="CRMParseCol">
                        <div className="CRMParseSub">Поиск товаров</div>
                        <input className="CRMParseInput" maxLength={255} value={keyword} onChange={handleKeyword} placeholder="Ваш запрос" />
                        <input className="CRMParseInput" value={limit} onChange={handleLimit} placeholder="Количество товаров" />
                        <input className="CRMParseInput" value={page} onChange={handlePage} placeholder="Номер страницы" />
                        <input className="CRMParseInput" value={timeElapsed} onChange={handleTimeElapsed} placeholder="timeElapsed (необязательно)" />
                        <div className={`CRMParseBtn ${keyword && Number(limit) && Number(page) ? 'Active' : ''}`} onClick={handleParse}>Поиск</div>
                    </div>
                    <div className="CRMParseCol">
                        <div className="CRMParseSub">Сортировка и загрузка товаров</div>
                        <div className="BrandInputBox">
                            <input className="CRMParseInput BrandInput" maxLength={255} value={brand} onChange={handleBrand} placeholder="Бренд" />
                            {autocomplete.length > 0 &&
                                <div className="AutocompleteBrand">
                                    {autocomplete.map((item, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="AutocompleteItemBrand"
                                                onClick={() => {
                                                    setBrand(item.brand.trim())
                                                    setModel('')
                                                    setAutocomplete([])
                                                }}
                                            >
                                                {item.brand}
                                            </div>
                                        )
                                    })}
                                </div>
                            }
                        </div>
                        <div className="ModelInputBox">
                            <input className="CRMParseInput ModelInput" maxLength={255} value={model} onChange={handleModel} placeholder="Модель" />
                            {autocomplete2.length > 0 &&
                                <div className="AutocompleteBrand">
                                    {autocomplete2.map((item, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="AutocompleteItemBrand"
                                                onClick={() => {
                                                    setModel(item.model.trim())
                                                    setBrand(item.brand.trim())
                                                    setAutocomplete2([])
                                                }}
                                            >
                                                {item.model}
                                            </div>
                                        )
                                    })}
                                </div>
                            }
                        </div>
                        <div className="ParseSelect" onClick={() => setListOpen(!listOpen)}>
                            <span>{categories[category]}</span>
                            {listOpen ?
                                <IoIosArrowUp size={14} />
                                :
                                <IoIosArrowDown size={14} />
                            }
                            {listOpen &&
                                <div className="ParseSelectList">
                                    <div className="ParseSelectItem" onClick={() => setCategory('shoes')}>Обувь</div>
                                    {/* <div className="ParseSelectItem" onClick={() => setCategory('clothes')}>Одежда</div>
                                        <div className="ParseSelectItem" onClick={() => setCategory('accessories')}>Аксессуары</div>
                                        <div className="ParseSelectItem" onClick={() => setCategory('cosmetics')}>Косметика</div>
                                        <div className="ParseSelectItem" onClick={() => setCategory('perfumery')}>Парфюмерия</div> */}
                                </div>
                            }
                        </div>
                        <input className="CRMParseInput MT10" value={timeElapsed2} onChange={handleTimeElapsed2} placeholder="timeElapsed (необязательно)" />
                        <div className={`CRMDownloadBtn ${checked.length > 0 && brand.length > 0 && model.length > 0 ? '' : 'Inactive'}`} onClick={handleDownload}>
                            <RxDownload size={16} />
                            <span>Загрузить выбранное</span>
                        </div>
                    </div>
                </div>
            }
            {parseTab === 'link' &&
                <div className="CRMParseRow">
                    <div className="CRMParseCol">
                        <div className="CRMParseSub">Добавление товаров по ссылке</div>
                        <input className="CRMParseInput ParseLink" maxLength={255} value={link} onChange={handleLink} placeholder="Ссылка на товар" />
                        <div className="BrandInputBox">
                            <input className="CRMParseInput BrandInput" maxLength={255} value={brand} onChange={handleBrand} placeholder="Бренд" />
                            {autocomplete.length > 0 &&
                                <div className="AutocompleteBrand">
                                    {autocomplete.map((item, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="AutocompleteItemBrand"
                                                onClick={() => {
                                                    setBrand(item.brand.trim())
                                                    setModel('')
                                                    setAutocomplete([])
                                                }}
                                            >
                                                {item.brand}
                                            </div>
                                        )
                                    })}
                                </div>
                            }
                        </div>
                        <div className="ModelInputBox">
                            <input className="CRMParseInput ModelInput" maxLength={255} value={model} onChange={handleModel} placeholder="Модель" />
                            {autocomplete2.length > 0 &&
                                <div className="AutocompleteBrand">
                                    {autocomplete2.map((item, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="AutocompleteItemBrand"
                                                onClick={() => {
                                                    setModel(item.model.trim())
                                                    setBrand(item.brand.trim())
                                                    setAutocomplete2([])
                                                }}
                                            >
                                                {item.model}
                                            </div>
                                        )
                                    })}
                                </div>
                            }
                        </div>
                        <div className="ParseSelect" onClick={() => setListOpen(!listOpen)}>
                            <span>{categories[category]}</span>
                            {listOpen ?
                                <IoIosArrowUp size={14} />
                                :
                                <IoIosArrowDown size={14} />
                            }
                            {listOpen &&
                                <div className="ParseSelectList">
                                    <div className="ParseSelectItem" onClick={() => setCategory('shoes')}>Обувь</div>
                                    {/* <div className="ParseSelectItem" onClick={() => setCategory('clothes')}>Одежда</div>
                                        <div className="ParseSelectItem" onClick={() => setCategory('accessories')}>Аксессуары</div>
                                        <div className="ParseSelectItem" onClick={() => setCategory('cosmetics')}>Косметика</div>
                                        <div className="ParseSelectItem" onClick={() => setCategory('perfumery')}>Парфюмерия</div> */}
                                </div>
                            }
                        </div>
                        <input className="CRMParseInput MT10" value={timeElapsed2} onChange={handleTimeElapsed2} placeholder="timeElapsed (необязательно)" />
                        <div className={`CRMDownloadBtn ${link.length > 0 && brand.length > 0 && model.length > 0 ? '' : 'Inactive'}`} onClick={handleDownload2}>
                            <RxDownload size={16} />
                            <span>Загрузить</span>
                        </div>
                    </div>
                </div>
            }
            {loading ?
                <div className="LoaderBox2">
                    <div className="Loader"></div>
                </div>
                : (parsed.productList && parsed.productList.length > 0) ?
                    <>
                        <div className="CRMParseTableBox">
                            <table className="CRMParseTable">
                                <thead>
                                    <tr>
                                        <th>
                                            <input
                                                className="CRMItemCheck"
                                                type="checkbox"
                                                id="itemCheck"
                                                onChange={checkAll}
                                                checked={parsed.productList.map(item => item.spuId).every(id => checked.includes(id))}
                                            />
                                        </th>
                                        <th>id</th>
                                        <th>Фото</th>
                                        <th>Название</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {parsed.productList.map((item, i) => {
                                        return (
                                            <tr key={i} className={item.isExist ? 'ParsedExist' : ''}>
                                                <td>
                                                    <input
                                                        className="CRMItemCheck"
                                                        type="checkbox"
                                                        id="itemCheck"
                                                        onChange={() => handleCheck(item.spuId)}
                                                        checked={checked.includes(item.spuId)}
                                                    />
                                                </td>
                                                <Item item={item} />
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            {isDownloading &&
                                <div className="LoaderModal">
                                    <div className="LoaderBox4">
                                        <div className="Loader"></div>
                                    </div>
                                </div>
                            }
                        </div>
                    </>
                    : wasParsed &&
                    <div className="CRMParseNotFound">Ничего не найдено</div>
            }
            {(!loading && error) &&
                <div className="CRMParseNotFound">Ошибка на стороне API</div>
            }
        </div>
    )
}