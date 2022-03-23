import ReactGA from 'react-ga'
export const pageView = (
    path: string,
    trackerNames?: ReactGA.TrackerNames | undefined,
    title?: string | undefined
) => {
    ReactGA.pageview(path, trackerNames, title)
}
