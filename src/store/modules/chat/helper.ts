import { ss } from '@/utils/storage'
import { t } from '@/locales'
import { v4 as uuidv4 } from 'uuid'
import PatientsInfo from '@/assets/patients_temp.json'

const LOCAL_NAME = 'chatStorage'

export function defaultState(): Chat.ChatState {
  const history: Chat.History[] = PatientsInfo.map((item): Chat.History => {
    return {
      title: item.hosId,
      isEdit: false,
      uuid: item.hosId,
      hosId: item.hosId,
    }
  })
  const chat = history.map((item) => {
    return {
      uuid: item.uuid,
      data: [],
    }
  })
  const agent = history.map((item) => {
    return {
      uuid: item.uuid,
      data: [],
    }
  })
  return {
    active: '',
    usingContext: true,
    history,
    // history: [{title: '1', isEdit: false, uuid: '1', hosId: '1'}],
    // history: [],
    chat,
    patientData: PatientsInfo,
    agent,
  }
}

export function getLocalState(): Chat.ChatState {
  const localState = ss.get(LOCAL_NAME)
  return { ...defaultState(), ...localState }
  // return { ...defaultState() }
}

export function setLocalState(state: Chat.ChatState) {
  ss.set(LOCAL_NAME, state)
}
