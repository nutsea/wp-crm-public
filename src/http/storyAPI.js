import { $host } from '.'

export const fetchStories = async (type) => {
    const { data } = await $host.get('api/story', { params: { type } })
    return data
}