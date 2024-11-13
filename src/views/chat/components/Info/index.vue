<script setup lang='ts'>
import { computed } from 'vue'
import { NDataTable, NCollapse, NCollapseItem, NCard, NTabs, NTabPane, useDialog } from 'naive-ui'

import { useAppStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
// import { PromptStore, SvgIcon } from '@/components/common'
// import { t } from '@/locales'

interface Props {
  id: string
}

const props = defineProps<Props>()

const appStore = useAppStore()
const chatStore = useChatStore()

const dialog = useDialog()

const { isMobile } = useBasicLayout()

const medicalRecCurent = computed(() => {
  const medicalRecCurent = {}
  chatStore.getPatientDataByhosId(props.id)?.medicalRecCurent.forEach((item: any) => {
    const tmp: string = item.listDircName
    if (!medicalRecCurent[tmp]) 
      medicalRecCurent[tmp] = []
    medicalRecCurent[tmp].push(item)
  })
  return medicalRecCurent
})
const testInfo = computed(() => chatStore.getPatientDataByhosId(props.id)?.testInfo || [])
const checkInfo = computed(() => chatStore.getPatientDataByhosId(props.id)?.checkInfo || [])
// let medicalRecCurent: Object = {}
// let testInfo: Array<Object> = []
// let checkInfo: Array<Object> = []

// import in1 from '@/assets/result/y3849370.json'
// import in2 from '@/assets/result/y3854435.json'
// import in3 from '@/assets/result/y3859112.json'
// import in5 from '@/assets/result/y3867700.json'
// import in6 from '@/assets/result/y4251478.json'
// import in7 from '@/assets/result/y4257514.json'
// import in8 from '@/assets/result/y4279631.json'
// function updateInfo(name: string) {
//   console.log(name);
//   let original: Object
//   if (name === "y3849370.json") original = in1
//   else if (name === "y3854435.json") original = in2
//   else if (name === "y3859112.json") original = in3
//   else if (name === "y3867700.json") original = in5
//   else if (name === "y4251478.json") original = in6
//   else if (name === "y4257514.json") original = in7
//   else if (name === "y4279631.json") original = in8
//   else original = in9
//   const data = original.result
//   // Tab1
//   medicalRecCurent = {}
//   data.medicalRecCurent.forEach((item: any) => {
//     let tmp: any = item.listDircName
//     if (!medicalRecCurent[tmp]) 
//       medicalRecCurent[tmp] = []
    
//     medicalRecCurent[tmp].push(item)
//   })

//   //Tab2
//   testInfo = data.testInfo
//   // console.log(testInfo);
//   //Tab3
//   checkInfo = data.checkInfo
// }

// watch(
//   isMobile, (val) => {
//     appStore.setDetailCollapsed(val)
//   },
//   {
//     immediate: true,
//     flush: 'post',
//   },
// )

// watch(
//   () => props.id, (newVal: string, oldVal: string) => {
//     if (newVal !== oldVal)
//       updateInfo(newVal)
//   },
//   {
//     immediate: true,
//   },
// )
</script>

<template>
  <div class="flex h-full">
    <n-card class="w-full m-0">
      <n-tabs type="line" animated>
        <n-tab-pane name="11" tab="医疗记录">
          <!-- TAB1 -->
          <n-collapse>
            <n-collapse-item v-for="(item, index) of medicalRecCurent" :title="index">
              <n-collapse>
                <n-collapse-item v-for="obj of item" :title="obj.listName">
                  <p>{{obj.listContent}}</p>
                  <template #header-extra>{{obj.opDate}}</template>
                </n-collapse-item>
              </n-collapse>
            </n-collapse-item>
          </n-collapse>
        </n-tab-pane>
        <n-tab-pane name="22" tab="检验信息">
          <n-collapse>
            <n-collapse-item v-for="item of testInfo" :title="item.testTitle">
              <n-data-table
                :columns="[{title:'项目',key:'testRptName'},{title:'结果',key:'testRsVal'},{title:'参考值',key:'testNormalVal'}]"
                :data="item.chDetail"
                :bordered="false"
              />
              <template #header-extra>{{item.testOutDate}}</template>
            </n-collapse-item>
          </n-collapse>
        </n-tab-pane>

        <n-tab-pane name="33" tab="检查信息">
          <n-collapse>
            <n-collapse-item v-for="item of checkInfo" :title="item.chkParamName">
              <p><b>检查发现：</b>{{item.chkFindings}}</p>
              <p><b>检查结果：</b>{{item.chkResult}}</p>
              <p><b>临床诊断：</b>{{item.clinicDiag}}</p>
              <template #header-extra>{{item.chkDate}}</template>
            </n-collapse-item>
          </n-collapse>
        </n-tab-pane>
      </n-tabs>
    </n-card>
    <!-- <div class="flex-1 min-h-0 pb-4 overflow-hidden"> -->
    <!-- </div> -->
  </div>
</template>
