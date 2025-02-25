<template>
  <div
    v-if="getCurrentAccount"
    :class="b()"
  >
    <div :class="b('header')">
      <div @click="toggleSideBarSettings">
        <SvgInject :variant="ICON_VARIANTS.burger"/>
      </div>
      <div
        v-tooltip="copytitle"
        :class="b('account')"
        @click="onCopyMixin(toAddress(getCurrentAccount.address, addressFormat, false))"
      >
        <Title :class="b('a-name')">
          {{ getAccountName(getCurrentAccount) }}
        </Title>
        <P
          :variant="COLOR_VARIANTS.primary"
          :size="SIZE_VARIANS.xs"
        >
          {{ getCurrentAccount.address | toAddress(addressFormat) }}
        </P>
      </div>
      <router-link
        :to="LINKS.accounts"
        id="jazzicon"
      />
    </div>
    <div :class="b('info')">
      <Title
        :class="b('balance')"
        :size="SIZE_VARIANS.sm"
        :variant="COLOR_VARIANTS.primary"
      >
        <span v-if="getSelectedToken">
          {{ balance | fromZil(getSelectedToken.decimals) | toLocaleString }} {{ getSelectedToken.symbol }}
        </span>
        <div
          class="pointer"
          @click="onRefresh"
        >
          <SvgInject :variant="ICON_VARIANTS.refresh"/>
        </div>
      </Title>
      <P
        v-if="getSelectedToken"
        :variant="COLOR_VARIANTS.gray"
        :size="SIZE_VARIANS.xs"
        :font="FONT_VARIANTS.light"
      >
        {{ balance | toConversion(getRate, getSelectedToken.decimals) | toLocaleString }} {{ conversionCurrency }}
      </P>
    </div>
  </div>
</template>

<script>
import { DEFAULT_TOKEN } from 'config'

import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import accountsStore from '@/store/accounts'
import settingsStore from '@/store/settings'
import uiStore from '@/store/ui'
import tokenStore from '@/store/token'
import walletStore from '@/store/wallet'
import modalStore from '@/store/modal'

import {
  ICON_VARIANTS,
  COLOR_VARIANTS,
  SIZE_VARIANS,
  FONT_VARIANTS
} from '@/config'

import Accounts from '@/pages/Accounts'

import SvgInject from '@/components/SvgInject'
import P from '@/components/P'
import Title from '@/components/Title'

import AccountMixin from '@/mixins/account'
import CopyMixin from '@/mixins/copy'
import JazziconMixin from '@/mixins/jazzicon'
import { toAddress, fromZil, toConversion, toLocaleString } from '@/filters'

export default {
  name: 'HomeAccount',
  mixins: [AccountMixin, CopyMixin, JazziconMixin],
  filters: { toAddress, fromZil, toConversion, toLocaleString },
  components: {
    SvgInject,
    P,
    Title
  },
  data() {
    return {
      ICON_VARIANTS,
      COLOR_VARIANTS,
      SIZE_VARIANS,
      FONT_VARIANTS,

      LINKS: {
        accounts: Accounts.name
      }
    }
  },
  computed: {
    ...mapState(uiStore.STORE_NAME, [
      uiStore.STATE_NAMES.local
    ]),
    ...mapGetters(accountsStore.STORE_NAME, [
      accountsStore.GETTERS_NAMES.getCurrentAccount
    ]),
    ...mapState(settingsStore.STORE_NAME, [
      settingsStore.STATE_NAMES.addressFormat,
      settingsStore.STATE_NAMES.currency
    ]),
    ...mapGetters(settingsStore.STORE_NAME, [
      settingsStore.GETTERS_NAMES.getRate
    ]),
    ...mapGetters(tokenStore.STORE_NAME, [
      tokenStore.GETTERS_NAMES.getSelectedToken
    ]),

    balance() {
      if (this.getSelectedToken.symbol === DEFAULT_TOKEN.symbol) {
        return this.getCurrentAccount.balance
      }

      return this.getSelectedToken.balance
    },
    conversionCurrency() {
      if (this.getSelectedToken.symbol === DEFAULT_TOKEN.symbol) {
        return this.currency
      }

      return DEFAULT_TOKEN.symbol
    }
  },
  methods: {
    toAddress,

    ...mapMutations(uiStore.STORE_NAME, [
      uiStore.MUTATIONS_NAMES.setLoad
    ]),
    ...mapActions(settingsStore.STORE_NAME, [
      settingsStore.ACTIONS_NAMES.updateRate
    ]),
    ...mapActions(tokenStore.STORE_NAME, [
      tokenStore.ACTIONS_NAMES.onBalanceUpdate
    ]),
    ...mapActions(walletStore.STORE_NAME, [
      walletStore.ACTIONS_NAMES.checkProvider
    ]),
    ...mapMutations(accountsStore.STORE_NAME, [
      accountsStore.MUTATIONS_NAMES.setAccounts,
      accountsStore.MUTATIONS_NAMES.setAccount
    ]),
    ...mapMutations(modalStore.STORE_NAME, [
      modalStore.MUTATIONS_NAMES.toggleSideBarSettings
    ]),

    async onRefresh() {
      this.setLoad()
      try {
        await this.updateRate()
        await this.checkProvider()
        const { identities, selectedAddress } = await this.onBalanceUpdate()

        this.setAccounts(identities)
        this.setAccount(selectedAddress)
      } catch (err) {
        //
      } finally {
        this.setLoad()
      }
    },
    setJazzicon(address) {
      this.jazziconCreate('jazzicon', address)
    }
  },
  mounted() {
    if (this.getCurrentAccount && this.getCurrentAccount.address) {
      this.setJazzicon(this.getCurrentAccount.address)
    }
  }
}
</script>

<style lang="scss">
.HomeAccount {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    & > * {
      cursor: pointer;
    }

    & > div > svg {
      min-width: 30px;
    }
  }

  &__account {
    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 10px;
    border-radius: 10px;

    &:hover {
      background: var(--opacity-bg-element-1);
    }
  }

  &__a-name {
    font-size: 14px;
  }

  &__balance {
    display: grid;
    grid-template-columns: 1fr 26px;
    align-items: center;
    justify-items: center;
    grid-gap: 10px;

    max-width: 340px;
    min-width: 200px;
    padding: 5px;
    margin-top: 10px;
    border-radius: 8px;
    border: 1px solid var(--accent-color-primary);

    & > .Title {
      text-align: center;
      width: 100%;
    }

    & > span {
      margin-left: 35px;
    }

    & > .pointer {
      height: 22px;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
