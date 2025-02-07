import { makeAutoObservable } from 'mobx'

export default class UserStore {
    constructor() {
        this._user = {}
        makeAutoObservable(this)
    }

    async setUser(user) {
        this._user = user
    }

    get user() {
        return this._user
    }
}