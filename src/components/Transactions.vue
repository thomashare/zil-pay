<template>
  <div :class="b()">
    <div :class="b('wrapper')">
      <Title
        :class="b('title')"
        :font="FONT_VARIANTS.light"
      >
        <span>
          {{ local.RECENT_TX }}:
        </span>
        <a @click="setClearTxHistory">
          {{ local.CLEAR_ALL }}
        </a>
      </Title>
      <ul :class="b('scroll')">
        <li v-show="transactions.length === 0">
          <Title
            :size="SIZE_VARIANS.sm"
            :font="FONT_VARIANTS.regular"
            :variant="COLOR_VARIANTS.gray"
          >
            {{ local.HOS_NOT_TX }}
          </Title>
        </li>
        <li
          v-for="(tx, index) of transactions"
          :key="index"
        >
          <TransactionCard
            :transaction="tx"
            @click="onSelect(index)"
          />
        </li>
      </ul>
    </div>
    <BottomModal v-model="info">
      <BackModal
        v-if="getCurrentAccount && selectedTx"
        :name="local.TRANSACTION"
        @click="info = false"
      />
      <TransactionDetails
        v-if="getCurrentAccount && selectedTx"
        :account="getCurrentAccount"
        :transaction="selectedTx"
      />
    </BottomModal>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex'
import settingsStore from '@/store/settings'
import uiStore from '@/store/ui'
import accountsStore from '@/store/accounts'
import transactionsStore from '@/store/transactions'

import { SIZE_VARIANS, FONT_VARIANTS, COLOR_VARIANTS } from '@/config'

import TransactionCard from '@/components/TransactionCard'
import Title from '@/components/Title'
import BottomModal from '@/components/BottomModal'
import BackModal from '@/components/BackModal'
import TransactionDetails from '@/components/TransactionDetails'

export default {
  name: 'Transactions',
  components: {
    TransactionCard,
    Title,
    BackModal,
    BottomModal,
    TransactionDetails
  },
  data() {
    return {
      SIZE_VARIANS,
      FONT_VARIANTS,
      COLOR_VARIANTS,

      info: false,
      selected: null
    }
  },
  computed: {
    ...mapState(uiStore.STORE_NAME, [
      uiStore.STATE_NAMES.local
    ]),
    ...mapState(settingsStore.STORE_NAME, [
      settingsStore.STATE_NAMES.addressFormat
    ]),
    ...mapGetters(accountsStore.STORE_NAME, [
      accountsStore.GETTERS_NAMES.getCurrentAccount
    ]),
    ...mapGetters(transactionsStore.STORE_NAME, [
      transactionsStore.GETTERS_NAMES.getCurrentTransactions
    ]),

    transactions() {
      try {
        return [...this.getCurrentTransactions]
      } catch (err) {
        return []
      }
    },
    selectedTx() {
      return this.transactions[this.selected]
    }
  },
  methods: {
    ...mapMutations(transactionsStore.STORE_NAME, [
      transactionsStore.MUTATIONS_NAMES.setClearTxHistory
    ]),

    onSelect(index) {
      this.selected = index
      this.info = true
    }
  }
}
</script>

<style lang="scss">
.Transactions {
  box-sizing: border-box;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  width: 100%;

  &__wrapper {
    display: flex;
    flex-direction: column;
    height: 300px;
    width: 100%;
  }

  &__scroll {
    display: flex;
    flex-direction: column;
    height: 300px;
    margin: 0;
    max-height: 100%;
    padding: 0;
    list-style: none;
    overflow-y: auto;

    & > li:not(:first-child) {
      margin-top: 10px;
    }
  }

  &__title {
    display: flex;
    justify-content: space-between;

    font-size: 14px;

    a,
    a:hover {
      cursor: pointer;
      color: var(--accent-color-primary);
      text-decoration: underline;
    }

    a {
      margin-left: 8px;
    }
  }
}
</style>
