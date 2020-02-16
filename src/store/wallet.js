/*
 * Project: ZilPay-wallet
 * Author: Rinat(lich666dead)
 * -----
 * Modified By: the developer formerly known as Rinat(lich666dead) at <lich666black@gmail.com>
 * -----
 * Copyright (c) 2019 ZilPay
 */
const STORE_NAME = 'wallet'
const STATE_NAMES = {
  isReady: 'isReady',
  isEnable: 'isEnable'
}
const MUTATIONS_NAMES = { }
const ACTIONS_NAMES = {
  onLedgerAccount: 'onLedgerAccount',
  onKeyStore: 'onKeyStore'
}
const GETTERS_NAMES = { }
const STORE = {
  namespaced: true,
  state: {
    [STATE_NAMES.isReady]: true,
    [STATE_NAMES.isEnable]: true
  },
  mutations: {},
  actions: {
    [ACTIONS_NAMES.onLedgerAccount]({ state }, payload) {
      // console.log(payload)
    },
    [ACTIONS_NAMES.onKeyStore]({ state }, payload) {
      // console.log(payload)
    }
  },
  getters: {}
}

export default {
  STORE_NAME,
  STORE,
  STATE_NAMES,
  MUTATIONS_NAMES,
  ACTIONS_NAMES,
  GETTERS_NAMES
}
