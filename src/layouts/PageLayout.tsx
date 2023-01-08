import { ReactNode, useState, useEffect } from "react"
import Sidebar from "../partials/sidebar/Sidebar"
import Nav from "../partials/Nav"

interface Props
{
    children: ReactNode
}
const PageLayout : React.FC<Props> = ({children}) =>{
    const [showParty, setShowParty] = useState(true);
    const [screenWidth,setScreenWidth] = useState(window.innerWidth);

    useEffect(()=>{
        function handleResize(){
            setScreenWidth(window.innerWidth);
        }

        window.addEventListener('resize', handleResize);
        return(()=>window.removeEventListener('resize', handleResize))
    },[]);

    useEffect(()=>{
        if(screenWidth>=640)
        {
            setShowParty(true);
        }
    },[screenWidth])

    return(
        <>
            <Nav/>
            <div className="grid sm:grid-cols-1 md:grid-cols-10 px-5 md:px-24 min-h-screen">
                <div className="md:col-span-7 bg-slate-200 mb-12 min-h-full">
                    {children}
                </div>


                <div className="md:order-last order-first md:col-span-3">
                <button id="collapse-button" className="md:hidden" onClick={()=>{setShowParty(!showParty)}}>
                    <div className="flex gap-2">
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                        </svg> 
                        {!showParty?<div>Check your party</div>:<div>Hide party</div>}
                    </div>
                </button>

                {
                    showParty?<Sidebar/>:(
                        <></>
                    )
                }

                </div>
            </div>
            <div>Footer</div>
        </>
    )
}

export default PageLayout