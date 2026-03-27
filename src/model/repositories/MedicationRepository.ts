import type { Medication } from '../../types'

import { storage } from './storage';



export const medicationStorage = {

  saveMedications: (medications: Medication[]) => storage.set('my_medications', medications),

  getMedications: () => storage.get<Medication[]>('my_medications') || [],

  clear: () => storage.remove('my_medications'),

};