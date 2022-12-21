import { ReactNode } from "react"

interface Props
{
    children: ReactNode
}
const PageLayout : React.FC<Props> = ({children}) =>{

    return(
        <>
            <div>Nav</div>
            <div className="grid sm:grid-cols-1 md:grid-cols-10 px-5 md:px-40">
                <div className="md:col-span-8">
                    {children}
                </div>
                <div className="order-first md:order-none">
                    Sidebar
                </div>
            </div>
            <div>Footer</div>
        </>
    )
}

export default PageLayout