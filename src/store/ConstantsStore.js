import {makeAutoObservable} from 'mobx'

export default class ConstantsStore {
    constructor() {
        this._course = null
        this._standartShip = null
        this._standartShip = null
        this._expressShip = null
        this._fee = null
        makeAutoObservable(this)
    }

    async setCourse(course) {
        this._course = course
    }

    async setStandartShip(standartShip) {
        this._standartShip = standartShip
    }

    async setExpressShip(expressShip) {
        this._expressShip = expressShip
    }

    async setFee(fee) {
        this._fee = fee
    }

    get course() {
        return this._course
    }

    get standartShip() {
        return this._standartShip
    }

    get expressShip() {
        return this._expressShip
    }

    get fee() {
        return this._fee
    }
}