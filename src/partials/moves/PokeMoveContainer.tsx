import { MoveType } from "../pokemon/definePokemon"
import { useState } from "react"

type Props = {
    moves:MoveType[] | undefined
}


export default function PokeMoveContainer({moves}:Props)
{
    const [selectedMove, setSelectedMove] = useState<MoveType | null>(null)
    
    return (
        <div className=" bg-white p-4">
            {
                moves?<div>
                {
                    selectedMove===null?<div className='grid sm:grid-cols-1 md:grid-cols-2'>
                    {
                        [0,1,2,3].map((indx)=>
                            <div>
                                {
                                    moves[indx]?
                                    <div 
                                    className="cursor-pointer hover:text-red-300 mb-4 lg:mb-0"
                                    onClick={()=>setSelectedMove(moves[indx])}>
                                        {moves[indx].name}
                                    </div>:
                                    <div className="font-bold mb-4 lg:mb-0">-</div>
                                }
                            </div>
                        )
                    }
                    </div>:
                    <div>
                        <button onClick={()=>setSelectedMove(null)} className=' hover:text-red-300 font-semibold'>Back</button>
                        <div className="min-h-10">
                            {selectedMove?.description}
                        </div>
                    </div>
                }</div>:
                <div className="grid sm:grid-cols-1 grid-cols-2">
                    {
                        [0,1,2,3].map((indx)=>
                            <div className="font-bold mb-4 lg:mb-0">-</div>
                        )
                    }
                </div>
            }
        </div>
    )
}