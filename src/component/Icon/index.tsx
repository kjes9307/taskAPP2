import React from 'react'
import classNames from 'classnames'
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'


export type themProps = 'primary' | 'secondary' |'danger' | 'info' | 'warning' | 'dark' | 'success'
export interface IconProps extends FontAwesomeIconProps{
    theme?: themProps
}

const Icon:React.FC<IconProps> = (props) =>{
    const {className,theme, ...restProps} = props
    let classes = classNames(className,{
        [`icon-${theme}`] : theme
    })
    return (
        <FontAwesomeIcon className={classes} {...restProps} />
    )
}

export default Icon;