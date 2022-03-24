import ReactGA from 'react-ga'
export const pageView = (
    path: string,
    trackerNames?: ReactGA.TrackerNames | undefined,
    title?: string | undefined
) => {
    if (process.env.NODE_ENV === 'production') {
        ReactGA.pageview(path, trackerNames, title)
    }
}
