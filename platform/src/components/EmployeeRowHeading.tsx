import Text from '@/components/Text'
import React from 'react'

export default function EmployeeRowHeading() {
  return (
    <li className="grid grid-cols-2 md:grid-cols-5 bg-background-light text-lg bg-opacity-60 rounded-md">
        <div className="p-2 pl-4 border-background-light truncate"><Text text={{eng: "Name", swe: "Namn"}} /></div>
        <div className="border-l-2 p-2 pl-4 border-background-light truncate">Email</div>
        <div className="hidden md:block border-l-2 p-2 pl-4 border-background-light truncate"><Text text={{eng: "Phone number", swe: "Telefonnummer"}} /></div>
        <div className="hidden md:block border-l-2 p-2 pl-4 border-background-light truncate"><Text text={{eng: "Role", swe: "Roll"}}/></div>
        <div className="hidden md:block border-l-2 p-2 pl-4 border-background-light truncate"><Text text={{eng: "Account Connected", swe: "Konto Kopplat"}} /></div>
    </li>
  )
}
