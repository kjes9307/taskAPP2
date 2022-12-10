import Icon from "component/Icon"
import {IconName} from '@fortawesome/fontawesome-common-types';
import { useState } from 'react';
export const Aside = () =>{
    const [show, setShow] = useState(false);
    let array:{name:string,icon:IconName}[] = [
        {name:'project',icon:'diagram-project'},
        {name:'member',icon:"user"},
        {name:"invite",icon:"envelope"}
    ]
    return (
    <section className={show ? 'space-toggle-back' : 'space-toggle-forward'}>
        <header className={`bg-brand-font fs-2 ${show ? 'space-toggle-back' : 'space-toggle-forward'}`}>
            <Icon icon='check-double' size='1x' />
            <span>MY PROJECT</span>
        </header>
        <ul className={`sidebar text-white ${show ? 'show' :""} mb-0`}>
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
        <div className="position-relative border border-black content-body">
            <Icon 
                onClick={()=>setShow(!show)} 
                icon={!show?'square-caret-left':'square-caret-right'} 
                color='white' 
                size='1x' 
                className='position-absolute icontranslate' 
            />
            content
        </div>
    </section>
    )
}