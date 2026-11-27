import { storageKey } from '../config/constants'
import type { ContactMessage } from '../types/contact'

export const contactService = {
  getMessages(): ContactMessage[] {
    const savedMessages = localStorage.getItem(storageKey.contactMessages)
    if (!savedMessages) {
      return []
    }
    const messageList: ContactMessage[] = JSON.parse(savedMessages)
    return messageList
  },

  saveMessage(newMessage: ContactMessage): void {
    const messageList = contactService.getMessages()
    localStorage.setItem(storageKey.contactMessages, JSON.stringify([...messageList, newMessage]))
  },
}
