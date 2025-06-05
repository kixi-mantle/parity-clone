import {create} from 'zustand'
import { UserTable } from '../db/schema'


type DataStore = {
    user : typeof UserTable.$inferSelect | null  , 
    setUser : ( data : typeof UserTable.$inferSelect) => void
}


export const useDataStore = create<DataStore>((set) => ({
    user : null,
    setUser : (data) => set({ user : data})
}))





