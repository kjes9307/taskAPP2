import { useState,useEffect,useRef } from "react"
import Icon from 'component/Icon'
import {useAddMember} from './util'
import {SearchComplete,DataSourceType} from 'component/searchComplete'
import { useGetMember, member } from 'component/searchComplete/util'
import { useDebounce } from 'utils'

type SelectPerson = {
    projectId : string
}
export const SelectPerson = (props:SelectPerson) =>{
    const [open,setOpen] = useState(false)   
    const parentRef = useRef<HTMLDivElement>(null)
    const [param,setParam] = useState<string|undefined>(undefined)
    const [dataList,setDataList] = useState<member[]|[]>([])
    const [ history, setHistory] = useState<string[]>([])
    const devalue = useDebounce(param,700)
    const {data:fetchData,isLoading} = useGetMember(devalue as string) 
    const {projectId} = props
    const {mutateAsync:addMemberAsync} = useAddMember()
    const handSelect = async(e:DataSourceType<UserProps>) =>{
        const {_id:userId} = e ;
        setHistory([...history, userId as string])
        if(userId&&projectId){
            await addMemberAsync({userId,projectId})
        }
    }
    interface UserProps {
        photo: string;
        name: string;
        _id?:string;
        value?: string;
    }
    const renderCustom = (item: DataSourceType<UserProps>) => {
        return (
            <div className="d-flex align-items-center">
            {
            item.photo?
             <img src={item.photo} alt='user-avatar' className="user-avatar test rounded-circle" />
            : 
            <Icon 
                className='Icon-border rounded-circle' 
                icon='circle-question' 
                theme='dark' 
                size='1x' 
                style={{cursor:"pointer"}} 
            />
            }
            <p className="ms-2 mb-0">{item.name}</p>
            </div>
        )
    }
    const handleSearchChange = (e:string) => setParam(e)
    useEffect(()=>{
        if(fetchData){
            if(history && history.length>0){
                let filterResult = fetchData.filter(x=> history.indexOf(x._id) === -1)
                setDataList(filterResult)
            }else{
                setDataList(fetchData)
            }
        }
    },[fetchData])
    return (
        <div className="d-flex align-items-center">
            <div ref={parentRef}>
            <Icon 
                onClick={()=> setOpen(!open)} 
                className='Icon-move rounded-circle p-2' 
                icon='user-plus' 
                theme='dark' 
                size='1x' 
                style={{cursor:"pointer"}} 
            />
            </div>
            <div className="d-block bg-white ms-1">
                { open &&
                    <SearchComplete
                        onSelect={handSelect}
                        renderOption = {renderCustom}
                        icon={!devalue?'magnifying-glass':'x'}
                        onClick={()=> setOpen(false)} 
                        className='form-control mt-1'
                        onInputChange={handleSearchChange}
                        fetchResult={dataList || []}
                        isLoading={isLoading}
                        searchKey={devalue}
                        parentRef={parentRef}
                    />
                }
            </div>
        </div>
    )
}
