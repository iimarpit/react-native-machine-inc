import 'react-native-gesture-handler'
import React from 'react'
import { Provider } from 'react-redux'
import {
  Provider as PaperProvider,
  MD3LightTheme as DefaultTheme,
} from 'react-native-paper'

import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from '@/Store'
import ApplicationNavigator from '@/Navigators/Application'
import colorScheme from './colorScheme'
import tw, { useDeviceContext } from 'twrnc'

const theme = {
  ...DefaultTheme,
  ...colorScheme,
}

const App = () => {
  useDeviceContext(tw)
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        {/**
         * PersistGate delays the rendering of the app's UI until the persisted state has been retrieved
         * and saved to redux.
         * The `loading` prop can be `null` or any react instance to show during loading (e.g. a splash screen),
         * for example `loading={<SplashScreen />}`.
         * @see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
         */}
        <PersistGate loading={null} persistor={persistor}>
          <ApplicationNavigator />
        </PersistGate>
      </PaperProvider>
    </Provider>
  )
}

export default App
