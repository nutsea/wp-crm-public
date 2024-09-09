import { $host, $authHost } from '.'

export const fetchCourse = async () => {
    const { data } = await $host.get('api/constants', { params: { name: 'course' } })
    return data
}

export const fetchStandartShip = async () => {
    const { data } = await $host.get('api/constants', { params: { name: 'standartShip' } })
    return data
}

export const fetchExpressShip = async () => {
    const { data } = await $host.get('api/constants', { params: { name: 'expressShip' } })
    return data
}

export const fetchFee = async () => {
    const { data } = await $host.get('api/constants', { params: { name: 'fee' } })
    return data
}

export const updateConstants = async (name, value) => {
    const { data } = await $authHost.post('api/constants', { name, value })
    return data
}