import React, { FC, ReactElement, InputHTMLAttributes, ChangeEvent } from 'react'
import classNames from 'classnames'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import Icon from 'component/Icon'

type InputSize = 'lg' | 'sm'
export interface InputProps extends Omit<InputHTMLAttributes<HTMLElement>, 'size' > {
    /**是否禁用 Input */
    disabled?: boolean;
    /**设置 input 大小，支持 lg 或者是 sm */
    size?: InputSize;
    /**添加图标，在右侧悬浮添加一个图标，用于提示 */
    icon?: IconProp;
    /**添加前缀 用于配置一些固定组合 */
    prepend?: string | ReactElement;
    /**添加后缀 用于配置一些固定组合 */
    append?: string | ReactElement;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    iconAction?: ()=> void
}

export const Input: FC<InputProps> = (props) => {
    const {
        disabled,
        size,
        icon,
        prepend,
        append,
        style,
        iconAction,
        ...restProps
    } = props
    const cnames = classNames('viking-input-wrapper', {
        [`input-size-${size}`]: size,
        'is-disabled': disabled,
        'input-group': prepend || append,
        'input-group-append': !!append,
        'input-group-prepend': !!prepend
    })
    const fixControlledValue = (value: any) => {
        // 若沒有useState沒有預設值 則進行處理
        if (typeof value === 'undefined' || value === null) {
        return ''
        }
        return value
    }
    if('value' in props) {
        // 同時有defaultValue & value 刪除defaultValue
        delete restProps.defaultValue
        restProps.value = fixControlledValue(props.value)

    }
    const handleClick =()=>{
        if(iconAction){
            iconAction()
        }
    }
    let iconClick = icon === 'x' ? true:false
    return (
        <div className={cnames} style={style}>
        {icon && 
            <div className="icon-wrapper">
                <Icon onClick={handleClick} icon={icon} title={`title-${icon}`} style={{cursor: iconClick ? 'pointer' : ''}} />
            </div>
        }
        <input 
            disabled={disabled}
            {...restProps}
        />
        </div>
    )
}