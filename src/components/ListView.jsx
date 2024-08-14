
import React from 'react'

export default function ListView({ TopBar, CardList }) {
    return (
        <div className="h-full flex flex-col">
            {TopBar}
            <div className="flex-1 overflow-y-auto">
                {CardList}
            </div>
        </div>
    );
}
