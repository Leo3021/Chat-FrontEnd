<script setup lang='ts'>
import { computed, watch } from 'vue'
import { NLayoutSider } from 'naive-ui'
import List from './List.vue'

import { useAppStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
// import { PromptStore, SvgIcon } from '@/components/common'
// import { t } from '@/locales'

const appStore = useAppStore()

const { isMobile } = useBasicLayout()

const collapsed = computed(() => appStore.siderCollapsed)

// function handleAdd() {
//   chatStore.addHistory({ title: t('chat.newChatTitle'), uuid: Date.now(), isEdit: false })
//   if (isMobile.value)
//     appStore.setSiderCollapsed(true)
// }

function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value)
}

// function handleClearAll() {
//   dialog.warning({
//     title: t('chat.deleteMessage'),
//     content: t('chat.clearHistoryConfirm'),
//     positiveText: t('common.yes'),
//     negativeText: t('common.no'),
//     onPositiveClick: () => {
//       chatStore.clearHistory()
//       if (isMobile.value)
//         appStore.setSiderCollapsed(true)
//     },
//   })
// }

// const getMobileClass = computed<CSSProperties>(() => {
//   if (isMobile.value) {
//     return {
//       position: 'fixed',
//       zIndex: 50,
//     }
//   }
//   return {}
// })

const mobileSafeArea = computed(() => {
  if (isMobile.value) {
    return {
      paddingBottom: 'env(safe-area-inset-bottom)',
    }
  }
  return {}
})

watch(
  isMobile,
  (val) => {
    appStore.setSiderCollapsed(val)
  },
  {
    immediate: true,
    flush: 'post',
  },
)
</script>

<template>
  <NLayoutSider
    :collapsed="collapsed"
    :collapsed-width="0"
    :width="260"
    show-trigger=arrow-circle
    collapse-mode="transform"
    position="absolute"
    bordered
    @update-collapsed="handleUpdateCollapsed"
  >
    <div class="flex flex-col h-full">
      <main class="flex flex-col flex-1 min-h-0">
        <div class="p-4">
          <h2 class="overflow-hidden font-bold text-xl text-ellipsis whitespace-nowrap"> 病患列表 </h2>
        </div>
        <!-- <div class="flex-1 min-h-0 pb-4 overflow-hidden"> -->
          <List />
        <!-- </div> -->
      </main>
      <!-- <Footer /> -->
    </div>
  </NLayoutSider>

</template>
