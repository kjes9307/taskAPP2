import Icon from "component/Icon"
import {IconName} from '@fortawesome/fontawesome-common-types';
import { useState,FC, ReactNode } from 'react';

interface PropsType{
    children : ReactNode
}
const PageLayout:FC<PropsType> = ({children}) =>{
    const [show, setShow] = useState(false);
    let array:{name:string,icon:IconName}[] = [
        {name:'project',icon:'diagram-project'},
        {name:'member',icon:"user"},
        {name:"invite",icon:"envelope"}
    ]
    return (
        <div className="app-layout">
            <div className={show ? 'sidebar-layout space-toggle-back' : 'sidebar-layout space-toggle-forward'}>
                <Icon 
                onClick={()=>setShow(!show)} 
                icon={!show?'square-caret-left':'square-caret-right'} 
                color='white' 
                size='2x' 
                className={`icontranslate space-toggle-back`} />
                <div className={`sidebar-header bg-brand-font fs-2 ${show ? 'space-toggle-back' : 'space-toggle-forward'}`}>
                    <Icon icon='check-double' size='1x' />
                    <span>MY PROJECT</span>
                    
                </div>
                <ul className={`sidebar text-white ${show ? 'show-sidebar' :""} mb-0`}>
                    {/* <li className="d-flex justify-content-center" >
                        <Icon icon='shuttle-space' size="2x" color="white"/>
                    </li> */}
                    {array?.map(i=>{return(
                        <li key={i.name} 
                            className={`
                                d-flex align-items-center mt-3 mouseIn ${!show ? 'justify-content-start' : 'justify-content-center'}`
                            }>
                            <div 
                                className={`
                                    icon-size ${show ? 'd-flex align-items-center justify-content-center':'ms-2'}`
                            }>
                                <Icon icon={i.icon} color='white' size='1x' />
                            </div>
                            {
                                !show ?<span className="ms-2">{i.name}</span> : null
                            }
                        </li>  
                    )})}
                </ul>
                <div className="content-body">
                    <div>
                    {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageLayout