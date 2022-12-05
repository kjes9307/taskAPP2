import { ReactNode,FC } from "react"
interface PropsType{
    children : ReactNode
}
export const MainLayout:FC<PropsType> = ({children}) =>{
    return (
        <div className="member-form p-4">
            {children}
        </div>
    )

}