import React from 'react'
import { Button } from 'react-bootstrap'
import { IoMdClose } from 'react-icons/io'

function CrossButton({onClick}) {
  return (
    <Button 
        onClick={onClick}
        className="text-white hover:text-gray-200 focus:outline-none cursor-pointer"
        >
        <IoMdClose className="w-5 h-5" />
    </Button>
  )
}

export default CrossButton
