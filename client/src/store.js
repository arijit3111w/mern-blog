import { combineReducers, configureStore } from '@reduxjs/toolkit'

import userReducer from './redux/user/user.slice.js'

import sessionStorage from 'redux-persist/es/storage/session'
import persistReducer from 'redux-persist/es/persistReducer'
import persistStore from 'redux-persist/es/persistStore'




const rootReducer = combineReducers({
    user: userReducer,
})

const persistConfig = {
  key: 'root',
  storage: sessionStorage, // Use sessionStorage for persisting the state   
}

const persistedReducer = persistReducer(persistConfig, rootReducer) // Wrap the rootReducer with persistReducer

export const store = configureStore({
  reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
        serializableCheck: false, // Disable serializable check for persistReducer
        }),
})

export const persistor = persistStore(store) // Create a persistor for the store

