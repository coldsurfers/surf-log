import ReactGA from 'react-ga'
import { GA_TRACKING_ID } from '../constants'

ReactGA.initialize(GA_TRACKING_ID, {
    debug: process.env.NODE_ENV === 'development',
})
