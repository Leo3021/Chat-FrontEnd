<script setup lang='ts'>
import { useChatStore } from '@/store'
// import { PromptStore, SvgIcon } from '@/components/common'
// import { t } from '@/locales'
import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import mila from 'markdown-it-link-attributes'
import hljs from 'highlight.js'

const props = defineProps<Props>()

const chatStore = useChatStore()

function highlightBlock(str: string, lang?: string) {
  return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__lang">${lang}</span><span class="code-block-header__copy">${t('chat.copyCode')}</span></div><code class="hljs code-block-body ${lang}">${str}</code></pre>`
}

const mdi = new MarkdownIt({
  html: false,
  linkify: true,
  highlight(code, language) {
    const validLang = !!(language && hljs.getLanguage(language))
    if (validLang) {
      const lang = language ?? ''
      return highlightBlock(hljs.highlight(code, { language: lang }).value, lang)
    }
    return highlightBlock(hljs.highlightAuto(code).value, '')
  },
})

mdi.use(mila, { attrs: { target: '_blank', rel: 'noopener' } })
mdi.use(mdKatex, { blockClass: 'katexmath-block rounded-md p-[10px]', errorColor: ' #cc0000' })

interface Props {
  uuid: string
}

const agent_data = chatStore.getAgentDataByUuid(props.uuid)

// let Result2 = {
//   "智能体自组织结论": {
//     "结论": "患者患有肝癌\t", 
//     "论据": "患者 'AFP': '59.69', '肝脏血管CT螺旋扫描+三维重建( 新版)': '肝体积尚可，肝右叶下段见约69*57毫米肿块，动脉期轻度不均匀强化，门静脉期及延迟期廓清，可见肝右动脉分支进入。 肝静脉、下腔静脉未见充盈缺损影。 肝内见约4毫米类圆形低密度影，增强扫描未见强化。 肝内外胆管、胰管未见异常狭窄与扩张，胆囊内见约7毫米以下多个高密度影。 胰腺及双侧肾上腺未见异常，肝门及所见腹膜后未见异常增大淋巴结影。 '肝癌中观察到RAD50突变，RAD50基因编码的蛋白质与酿酒酵母RAD50（一种参与DNA双链断裂修复的蛋白质）高度相似。这种蛋白与MRE11和NBS1形成复合物，蛋白复合物与DNA结合并显示出DNA末端非同源连接所需的许多酶活性。这种蛋白质对DNA双链断裂修复、细胞周期检查点激活、端粒维持和减数分裂重组有重要作用。\t在肝癌细胞发现有FGFR1的高表达，FGFR1基因所编码的蛋白质是属于成纤维细胞生长因子受体（FGFR）家族成员之一，目前已确定了四种由FGFRs, 即FGFR1、FGFR2、FGFR3和FGFR4。FGFR1是一种跨膜蛋白质，属于受体酪氨酸激酶，当FGF与FGFR1胞外段结合后，受体细胞内酪氨酸激酶活性区首先发生自身磷酸化，然后使受体靶蛋白发生反式磷酸化，通过蛋白质级联反应将配体的信号传递给细胞核。FGF/FGFR1信号传递是细胞正常生长所必需的，但当过量时可引起多种疾病。\t在肝癌中，TGF-β信号通路可能频繁发生突变。SMAD3属于SMAD蛋白家族成员，属于TGF-β信号通路的自身反馈调节抑制。大部分恶性肿瘤起源与上皮细胞，它的生长受TGF-β的抑制，通过上调细胞周期依赖蛋白激酶抑制剂来诱导细胞周期的停滞，也抑制生长促转录因子的表达；而一些致癌因子，可通过抑制TGF-β信号通路促进肿瘤的发展。\t\t肝癌的诊断方法包括高危人群的筛查与监测、超声显像、CT和MRI等多种方式。针对高危人群，通过肝脏超声显像和血清甲胎蛋白进行早期筛查是推荐的方法。超声显像能够敏感地检出肝内病变，并辅以彩色多普勒血流成像和超声造影检查以更准确地诊断。动态增强CT和多参数MRI扫描则是在超声和/或血清AFP筛查异常者中明确诊断的首选影像学检查方法\t"}, 
//   "病历智能体": {
//     "诊断结果": "肝癌\t", 
//     "置信度": 0.9, 
//     "支持证据": {
//       "AFP": "59.69", 
//       "肝脏血管CT螺旋扫描+三维重建( 新版)": "肝体积尚可，肝右叶下段见约69*57毫米肿块，动脉期轻度不均匀强化，门静脉期及延迟期廓清，可见肝右动脉分支进入。 肝静脉、下腔静脉未见充盈缺损影。 肝内见约4毫米类圆形低密度影，增强扫描未见强化。 肝内外胆管、胰管未见异常狭窄与扩张，胆囊内见约7毫米以下多个高密度影。 胰腺及双侧肾上腺未见异常，肝门及所见腹膜后未见异常增大淋巴结影。 "
//     }, 
//     "支持证据置信度": {
//       "AFP": 82.1, 
//       "肝脏血管CT螺旋扫描+三维重建( 新版)": 0.9375398191781806
//     }, 
//     "缺失证据": {
//       "amylase": ""
//     }, 
//     "缺失证据置信度": {
//       "amylase": 54.73
//     }, 
//     "反对证据": {
//       "HBsAg": "阴性（<0.030)", 
//       "CA724": "2.20"
//     }, 
//     "反对证据置信度": {
//       "HBsAg": 63.85, 
//       "CA724": 72.98
//     }
//   }, 
//   "知识智能体": {
//     "诊断结果": "肝癌\t", 
//     "置信度": 0.9, 
//     "证据": "肝癌的诊断方法包括高危人群的筛查与监测、超声显像、CT和MRI等多种方式。针对高危人群，通过肝脏超声显像和血清甲胎蛋白进行早期筛查是推荐的方法。超声显像能够敏感地检出肝内病变，并辅以彩色多普勒血流成像和超声造影检查以更准确地诊断。动态增强CT和多参数MRI扫描则是在超声和/或血清AFP筛查异常者中明确诊断的首选影像学检查方法\t"
//   },
//   "基因智能体": {
//     "诊断结果": "肝癌\t", 
//     "置信度": 0.9, 
//     "证据": "肝癌中观察到RAD50突变，RAD50基因编码的蛋白质与酿酒酵母RAD50（一种参与DNA双链断裂修复的蛋白质）高度相似。这种蛋白与MRE11和NBS1形成复合物，蛋白复合物与DNA结合并显示出DNA末端非同源连接所需的许多酶活性。这种蛋白质对DNA双链断裂修复、细胞周期检查点激活、端粒维持和减数分裂重组有重要作用。\t在肝癌细胞发现有FGFR1的高表达，FGFR1基因所编码的蛋白质是属于成纤维细胞生长因子受体（FGFR）家族成员之一，目前已确定了四种由FGFRs, 即FGFR1、FGFR2、FGFR3和FGFR4。FGFR1是一种跨膜蛋白质，属于受体酪氨酸激酶，当FGF与FGFR1胞外段结合后，受体细胞内酪氨酸激酶活性区首先发生自身磷酸化，然后使受体靶蛋白发生反式磷酸化，通过蛋白质级联反应将配体的信号传递给细胞核。FGF/FGFR1信号传递是细胞正常生长所必需的，但当过量时可引起多种疾病。\t在肝癌中，TGF-β信号通路可能频繁发生突变。SMAD3属于SMAD蛋白家族成员，属于TGF-β信号通路的自身反馈调节抑制。大部分恶性肿瘤起源与上皮细胞，它的生长受TGF-β的抑制，通过上调细胞周期依赖蛋白激酶抑制剂来诱导细胞周期的停滞，也抑制生长促转录因子的表达；而一些致癌因子，可通过抑制TGF-β信号通路促进肿瘤的发展。\t\t"
//   }, 
//   // "影像智能体": None
// }
// let Result2 = {
//   '智能体自组织结论': {'结论': "结论text", '论据': "论据text"},
//   '病历智能体': {
//     '诊断结果': "诊断结果1", 
//     '置信度': "置信度1",
//     '支持证据': ['support1', 'support2'],
//     '支持证据置信度': {'support1': "sup1-1", 'support2': "sup2-2"},
//     '缺失证据': ['lack1', 'lack2'],
//     '缺失证据置信度': {'lack1': "lack1-1", 'lack2': "lack2-2"},
//     '反对证据': ['oppo1', 'oppo2'],
//     '反对证据置信度': {'oppo1': '0.75',  'oppo2': "oppo2-2"},
//   },
//   '知识智能体': {'诊断结果': "诊断结果2", '置信度': "置信度2", '证据': "证据2"},
//   '基因智能体': {'诊断结果': "诊断结果3", '置信度': "置信度3", '证据': "证据3"}
// }

// watch(
//     ()=>props.id, (newVal: Number, oldVal: Number) => {
//     if(newVal !== oldVal){
//         // updateInfo()
//     }
//   },
//   {
//     immediate: true
//   }
// )
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden overflow-y-auto">
    <!-- <div class="p-4">
      <h2 class="overflow-hidden font-bold text-xl text-ellipsis whitespace-nowrap"> 自然语言理解生成返回内容 </h2>
    </div> -->
    <div class="p-4">
      <!-- <h2 class="overflow-hidden font-bold text-xl text-ellipsis whitespace-nowrap"> 智能体自组织结论 </h2>
      <div class="text-base flex">
        <div class="font-bold w-14 flex-none">结论：</div>
        <div class="flex-1 text-warp">{{agent_data.markdown}}</div>
      </div> -->
      <!-- <div class="text-base flex">
        <div class="font-bold w-14 flex-none">论据：</div>
        <div class="flex-1 text-warp">{{agent_data.agent['论据']}}</div>
      </div> -->
      <div class="markdown-body" v-html="mdi.render(agent_data.markdown)" />
      <!-- <div class="pl-4">
        <p class="text-lg font-bold">知识智能体</p>
        <div class="text-base flex">
          <div class="font-bold w-20 flex-none">诊断结果：</div>
          <div class="flex-1 text-warp">
            {{ Result2['知识智能体']['诊断结果'] }}
            <n-tag type="success">{{ Result2['知识智能体']['置信度'] }}</n-tag>
          </div>
        </div>
        <div class="text-base flex pl-4">
          <div class="w-20 flex-none">证据：</div>
          <div class="flex-1 text-warp">
            {{ Result2['知识智能体']['证据'] }}
          </div>
        </div>
      </div>
      <div class="pl-4">
        <p class="text-lg font-bold">基因智能体</p>
        <div class="text-base flex">
          <div class="font-bold w-20 flex-none">诊断结果：</div>
          <div class="flex-1 text-warp">
            {{ Result2['基因智能体']['诊断结果'] }}
            <n-tag type="success">{{ Result2['基因智能体']['置信度'] }}</n-tag>
          </div>
        </div>
        <div class="text-base flex pl-4">
          <div class="w-20 flex-none">证据：</div>
          <div class="flex-1 text-warp">
            {{ Result2['基因智能体']['证据'] }}
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>
