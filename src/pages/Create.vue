<template>
  <div :class="b()">
    <UiPanel arrow />
    <SvgInject
      :class="b('logo')"
      :variant="ICON_VARIANTS.zilPayLogo"
    />
    <div :class="b('wrapper')">
      <P :size="SIZE_VARIANS.md">
        {{ local.CREATE_DIS }}
      </P>
      <div
        :class="b('reset-icon')"
        @click="refreshWords"
      >
        <SvgInject :variant="ICON_VARIANTS.refresh" />
      </div>
      <div :class="b('words')">
        <Chip
          v-for="(el, index) of wrdsAsArray"
          :key="el.uuid"
          :circle="index + 1"
        >
          {{ el.word }}
        </Chip>
      </div>
      <div :class="b('btns')">
        <Button
          :color="COLOR_VARIANTS.negative"
          :size="SIZE_VARIANS.md"
          block
          round
          uppercase
          @click="prinntWords"
        >
          {{ local.PRINT }}
        </Button>
        <Button
          :color="COLOR_VARIANTS.negative"
          :size="SIZE_VARIANS.md"
          block
          round
          uppercase
          @click="setWords"
        >
          {{ local.CONTINUE }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuid } from 'uuid'

import { mapState, mapMutations } from 'vuex'
import uiStore from '@/store/ui'
import walletStore from '@/store/wallet'

import {
  ICON_VARIANTS,
  SIZE_VARIANS,
  COLOR_VARIANTS
} from '@/config'

import Verify from '@/pages/Verify'

import Chip from '@/components/Chip'
import P from '@/components/P'
import Button from '@/components/Button'
import UiPanel from '@/components/UiPanel'
import Printer from '@/mixins/printer'
import SvgInject from '@/components/SvgInject'

import { Background } from '@/services'

const bgScript = new Background()

export default {
  name: 'Create',
  mixins: [Printer],
  components: {
    Chip,
    P,
    Button,
    UiPanel,
    SvgInject
  },
  data() {
    return {
      ICON_VARIANTS,
      SIZE_VARIANS,
      COLOR_VARIANTS,
      words: ''
    }
  },
  computed: {
    ...mapState(uiStore.STORE_NAME, [
      uiStore.STATE_NAMES.local
    ]),

    wrdsAsArray() {
      return this
        .words
        .split(' ')
        .map(word => ({
          word,
          uuid: uuid()
        }))
    }
  },
  methods: {
    ...mapMutations(walletStore.STORE_NAME, [
      walletStore.MUTATIONS_NAMES.setVerifly
    ]),

    setWords() {
      this.setVerifly(this.words)
      this.$router.push({ name: Verify.name })
    },
    async refreshWords() {
      this.words = await bgScript.getRandomMnemonic()
    },
    prinntWords() {
      // Call from Printer mixin.
      this.printSeed()
    }
  },
  mounted() {
    this.refreshWords()
  }
}
</script>

<style lang="scss">
.Create {
  text-align: center;
  background-color: var(--app-background-color);

  &__logo {
    height: auto;
    left: 20vw;
    opacity: 0.25;
    position: absolute;
    top: 30vh;
    width: 60vw;
  }

  &__reset-icon {
    cursor: pointer;
  }

  &__wrapper {
    display: grid;
    grid-row-gap: 15px;
    justify-items: center;
    margin: 10px 0 20px;
  }

  &__words {
    display: grid;
    font-size: 1.5em;
    grid-column-gap: 10px;
    grid-row-gap: 15px;
    grid-template-columns: repeat(2, 1fr);
  }

  &__btns {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 10px;
    width: 264px;
    height: 120px;
  }
}
</style>
