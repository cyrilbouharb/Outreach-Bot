'use client' // ---> this line does the trick

import { ChakraProvider } from '@chakra-ui/react'
import { ReactNode } from 'react'
import {theme} from '../themes/themes'

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
      <ChakraProvider resetCSS theme={theme}>
        {children}
      </ChakraProvider>
  )
}