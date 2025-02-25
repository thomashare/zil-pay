<template>
  <label :class="b({ block, size })">
    <div :class="b('title')">
      {{ title }}
    </div>
    <input
      v-bind="$attrs"
      :class="b('element', { round, centred, second, error: Boolean(error) })"
      :value="value"
      :autofocus="autofocus"
      ref="input"
      @input="onInput"
    />
    <div :class="b('error', { enable: Boolean(error) })">
      {{ error }}
    </div>
  </label>
</template>

<script>
import { SIZE_VARIANS, EVENTS } from '@/config'

export const INPUT_TYPES = {
  date: 'date',
  number: 'number',
  password: 'password',
  text: 'text',
  time: 'time'
}

/**
 * ZilPay Input component.
 * @example
 * import { SIZE_VARIANS } from '@/config'
 * import Input, { INPUT_TYPES } from '@/components/Input'
 * <Input
 *  v-model="password"
 *  :class="b('form-password')"
 *  :type="INPUT_TYPES.password"
 *  :size="sizes.xs"
 *  placeholder="Password"
 *  block
 *  round
 *  centred
 *  required
 *  autofocus
 * />
 */
export default {
  name: 'Input',
  props: {
    size: {
      type: String,
      default: SIZE_VARIANS.xs
    },
    second: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    },
    title: {
      type: [String, Number],
      required: false
    },
    error: {
      type: [String, Number],
      required: false
    },
    value: {
      type: [String, Number],
      required: false
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    centred: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onInput(event) {
      const { value } = event.target

      this.$emit(EVENTS.input, value)
    }
  },
  mounted() {
    if (this.autofocus) {
      this.$refs.input.focus()
    }
  }
}
</script>

<style lang="scss">
.Input {
  &__title,
  &__error {
    display: flex;
    align-items: center;

    width: 100%;

    text-indent: 7px;
    text-align: left;

    font-family: var(--font-family-light);
    color: var(--theme-negative);
    font-weight: 600;
    font-size: 10px;
    line-height: 12px;
    letter-spacing: 1.33594px;

    &__enable {
      height: 20px;
    }

    &:first-letter {
      text-transform: capitalize;
    }
  }

  &__element {
    box-sizing: border-box;
    width: 100%;
    border: 0;
    color: var(--accent-color-primary);
    background: var(--opacity-bg-element);
    border: 1px solid var(--accent-color-primary);
    padding: 8px 10px;

    &_error {
      color: var(--accent-color-danger);
      border: 2px solid var(--accent-color-danger);
    }

    &_centred {
      text-align: center;
      text-indent: 0;
    }

    &_round {
      border-radius: calc(var(--default-border-radius) - 18px);
    }

    &_second {
      border: 0;
      background-color: var(--opacity-bg-element-2);
      border-radius: 10px;
    }

    &:focus {
      outline: none;
    }
  }

  &__error {
    color: var(--accent-color-danger);
  }
}
</style>
