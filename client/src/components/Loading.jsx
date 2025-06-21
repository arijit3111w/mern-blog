import React from 'react'

import loadingicon from "@/assets/images/loading.svg"; // Assuming you have a loading icon in your assets

const Loading = () => {
  return (
    <div className='w-screen h-screen  top-0 left-0  z-50 flex items-center justify-center'>
        <img src={loadingicon} width={120}/>
    </div>
  )
}

export default Loading