import React from 'react'
import {IconDocker} from '../Icons'

export interface LogoScreenProps {
    message?: string
}

const LogoScreen: React.FC<LogoScreenProps> = ({ message }) => {
    return (
        <div className="bg-base-300 text-base-content p-4 shadow-sm rounded-md h-full overflow-x-hidden flex flex-col md:items-center md:justify-center">
            <div>
                <IconDocker className="size-20 opacity-75" fill="" />
            </div>
            {message ? message : ''}
        </div>
    )
}

export default LogoScreen
