import { HeartIcon } from '@heroicons/react/solid'
import React from 'react'
import { FiExternalLink } from 'react-icons/fi'

function MadeByAthar() {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-purple-900 p-1 text-white shadow-lg">
        <div className="container mx-auto">
        <div className="font-light text-sm tracking-wide text-center">
            Made with <HeartIcon className="h-4 w-4 text-red-400 inline-block mx-1 animate-pulse" /> by <strong><a href="https://www.linkedin.com/in/md-athar-alam-a5067b18b/" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline transition-all">Athar</a>
            <FiExternalLink className="h-3 w-3 ml-1 inline-block" /></strong>
        </div>
        </div>
    </div>
  )
}

export default MadeByAthar
