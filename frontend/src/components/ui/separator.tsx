import React from 'react'

const Separator = ( { className }: { className?: string } ) => {
  return (
    <div className={`w-full h-[1px] border border-t border-primary-light my-10 ${className}`} />
  )
}

export default Separator