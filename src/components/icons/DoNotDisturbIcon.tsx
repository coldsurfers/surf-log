import Image from 'next/image'
import { FC } from 'react'

const DoNotDisturbIcon: FC = () => {
    return (
        <Image
            alt="donotdisturb"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABCUlEQVRIieXVsS5EQRTG8d8VbqHW0miUOg+gkZDFRjyCtxFLrZNIFJ5CIhKNQmiwoiQKhdZV3N1Erp27c+9OIfElp5jJmf93zkxmhv+gHB2c4Q4fuE4F76CP4ke8YnVScIb9CrjAGxYnhcPhCHiBzRTwbgB+mQI+7feeD2MvhcFuAF5gKYXBSY1BnsLgMQD/Um5fY01VxnOBvAwLKQxmanLX2xhUdS98Bi+YbQqsdnBTkzuPo6YGVW0JdzCMgxGFRSvHc4TJBZZjgNmIuS7OIwu6Gpi9K89nZTC/Nm5hz/guQtGLqSxraXKs4YXcxlMEuK/8nFopxw5O8YBP5bd5q3y7NiR6p/6mvgHqV4Eshd2vGAAAAABJRU5ErkJggg=="
            layout="fill"
        />
    )
}

export default DoNotDisturbIcon
