

import React from 'react'

export default function ContainersPage() {
    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
            <div className="h-32 rounded-lg bg-base-100"></div>
            <div className="h-32 rounded-lg bg-base-100 lg:col-span-2"></div>
        </div>
    )
}
