<script setup lang='ts'>
import { ref } from 'vue'
import { NDrawerContent, NDrawer, NButton, DrawerPlacement, NScrollbar } from 'naive-ui'
import { SvgIcon } from '@/components/common'
import { computed } from 'vue'
import { useAppStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
// import { debounce } from '@/utils/functions/debounce'
import InfoDrawer from '../../components/Info/index.vue'
const { isMobile } = useBasicLayout()
const appStore = useAppStore()
const chatStore = useChatStore()
// const dataSources = [
//   {"title": "患者1", "uuid": 1, "name": "y3849370.json", "info": {"name1":"value1","name2":"value2","name3":"value3"}, "patientID": "y3859374"},
//   {"title": "患者2", "uuid": 2, "name": "y3854435.json", "info": {"name1":"value1",}},
//   {"title": "患者3", "uuid": 3, "name": "y3859112.json", "info": {}},
// ]
const dataSources = computed(() => chatStore.history)

async function handleSelect({ uuid }: Chat.History) {
  if (isActive(uuid))
    return

  if (chatStore.active)
    chatStore.updateHistory(chatStore.active, { isEdit: false })
  await chatStore.setActive(uuid)

  if (isMobile.value)
    appStore.setSiderCollapsed(true)
}

// function handleEdit({ uuid }: Chat.History, isEdit: boolean, event?: MouseEvent) {
//   event?.stopPropagation()
//   chatStore.updateHistory(uuid, { isEdit })
// }

// function handleDelete(index: number, event?: MouseEvent | TouchEvent) {
//   event?.stopPropagation()
//   chatStore.deleteHistory(index)
//   if (isMobile.value)
//     appStore.setSiderCollapsed(true)
// }

// const handleDeleteDebounce = debounce(handleDelete, 600)

// function handleEnter({ uuid }: Chat.History, isEdit: boolean, event: KeyboardEvent) {
//   event?.stopPropagation()
//   if (event.key === 'Enter')
//     chatStore.updateHistory(uuid, { isEdit })
// }

function isActive(uuid: string) {
  return chatStore.active === uuid
}

const active = ref(false)
const placement = ref<DrawerPlacement>('right')
const detailId = ref("")

const activate = (name: String) => {
  active.value = true
  detailId.value = name
}
</script>

<template>
  <NScrollbar class="px-4">
    <div class="flex flex-col gap-2 text-sm">
      <template v-if="!dataSources.length">
        <div class="flex flex-col items-center mt-4 text-center text-neutral-300">
          <SvgIcon icon="ri:inbox-line" class="mb-2 text-3xl" />
          <span> 暂无数据 </span>
        </div>
      </template>
      <template v-else>
        <div v-for="(item, index) of dataSources" :key="index">
          <!-- <a>
            <n-card 
              :title=item.title 
              size="small" 
              class="border  rounded-md cursor-pointer hover:bg-neutral-100 group dark:border-neutral-800 dark:hover:bg-[#24272e]"
              :class="isActive(item.uuid) && ['border-[#4b9e5f]', 'bg-neutral-100', 'text-[#4b9e5f]', 'dark:bg-[#24272e]', 'dark:border-[#4b9e5f]', 'pr-14']"
              @click="handleSelect(item)">
              <p v-for="(value, key) of item.info">{{key}} : {{value}}</p>
              <n-button @click="activate(item.name)">详细信息</n-button>
            </n-card>
          </a> -->
          <a
            class="relative flex items-center p-0 break-all border rounded-md cursor-pointer hover:bg-neutral-100 group dark:border-neutral-800 dark:hover:bg-[#24272e]"
            :class="isActive(item.uuid) && ['border-[#4b9e5f]', 'bg-neutral-100', 'text-[#4b9e5f]', 'dark:bg-[#24272e]', 'dark:border-[#4b9e5f]', 'pr-14']"
            @click="handleSelect(item)"
          >
            <div>
              <h2 class="text-base font-bold mx-2 mt-2">{{item.title}}</h2>
              <div class="my-1 mx-3" v-for="(value, key) of item.info">{{key}} : {{value}}</div>
              <n-button class="my-2 mx-1" @click="activate(item.hosId)">详细信息</n-button>
            </div>
          </a>
        </div>
      </template>
    </div>
  </NScrollbar>
  <n-drawer v-model:show="active" :width="600" :placement="placement" class="p-0">
    <n-drawer-content title="患者详细信息">
      <InfoDrawer :id="detailId" />
    </n-drawer-content>
  </n-drawer>
</template>
