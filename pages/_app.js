import { ChakraProvider, Box } from '@chakra-ui/react'
import '@fontsource/roboto/400.css'
import { extendTheme } from "@chakra-ui/react"
import Header from '../components/Header'
import Footer from '../components/Footer'

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "gray.50",
      },
    },
  },
})

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Box minHeight="100vh" display="flex" flexDirection="column">
        <Header />
        <Box flexGrow={1}>
          <Component {...pageProps} />
        </Box>
        <Footer />
      </Box>
    </ChakraProvider>
  )
}

export default MyApp
