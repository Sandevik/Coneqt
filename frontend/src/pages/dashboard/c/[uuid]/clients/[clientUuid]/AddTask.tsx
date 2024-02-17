import Button from '@/components/Button'
import Input from '@/components/Input';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import request from '@/utils/request';
import React, { useContext, useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5';




export default function AddTask({active, setActive, client, refetchTasks}: {active: boolean, client: Client | null, setActive: React.Dispatch<React.SetStateAction<boolean>>, refetchTasks: () => Promise<void>}) {
    const {crm} = useContext(CurrentCrmContext);
    const [form, setForm] = useState<Omit<Task, "added" | "updated">>({
        deadline: null,
        crmUuid: crm?.crmUuid || "" ,
        title: null,
        status: null,
        clientUuid: client?.uuid || null,
    })
    const [deadline, setDeadline] = useState<1|0>(0);
    const [status, setStatus] = useState<"ongoing" | "completed" | "none">("none");

    useEffect(()=>{setForm({...form, clientUuid: client?.uuid || null})},[client])
    useEffect(()=>{setForm({...form, crmUuid: crm?.crmUuid || ""})},[crm])
    
    useEffect(()=>{status === "none" && setForm({...form, status: null})},[status])

    const close = () => {
        setActive(false);
    }

    const addTask = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (crm?.crmUuid && client) {
            const res = await request("/tasks/create", {...form, deadline: new Date(form.deadline || "").getTime()}, "POST");
            if (res.code == 201) {
                close();
                setForm({
                    deadline: null,
                    crmUuid: crm?.crmUuid || "" ,
                    title: null,
                    status: null,
                    clientUuid: client?.uuid || null,
                })
                await refetchTasks();
            }   
        }

    }
  
    return (
        <div className={`${active ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-opacity absolute top-0 left-0 h-full w-full bg-background-dark bg-opacity-40 backdrop-blur-md grid place-items-center`}>
        <form className="h-[70%] w-[40em] bg-background-light p-4 rounded-md relative flex flex-col gap-5">
            <h3 className="text-2xl font-semibold">Create a new task for {client?.firstName || "unknown client"}</h3>
            <IoClose onClick={() => close()} className="absolute top-2 right-2 text-4xl cursor-pointer"/>
            
            <div className="flex flex-col gap-2">
                <label htmlFor="title" className="text-lg">Title</label>
                <Input name="title" value={form.title || ""} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full flex-1 rounded-md overflow-y-scroll scrollthumb transition-all relative p-2 bg-background-dark text-white" placeholder='Schedule a call...'></Input>   
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="deadline-select" className="text-lg">Deadline</label>
                <select value={deadline}  onChange={(e) => setDeadline(+e.target.value as 0|1)} name="deadline-select" className="w-full flex-1 rounded-md overflow-y-scroll scrollthumb transition-all relative p-2 bg-background-dark text-white">
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                </select>   
            </div>

            {deadline == 1 && <div className="flex flex-col gap-2">
                <label htmlFor="datetime" className="text-lg">Date and time</label>
                <Input name="datetime" type='datetime-local' value={form.deadline || ""} onChange={(e) => setForm({...form, deadline: e.target.value})} className="w-full flex-1 rounded-md overflow-y-scroll scrollthumb transition-all relative p-2 bg-background-dark text-white" placeholder='Schedule a call...'></Input>   
            </div>}
            
            <div className="flex flex-col gap-2">
                <label htmlFor="status-select" className="text-lg">Status</label>
                <select value={status}  onChange={(e) => {setStatus(e.target.value as "ongoing" | "completed" | "none"); setForm({...form, status: e.target.value})}} name="deadline-select" className="w-full flex-1 rounded-md overflow-y-scroll scrollthumb transition-all relative p-2 bg-background-dark text-white">
                    <option value={"none"}>None</option>
                    <option value={"ongoing"}>Ongoing</option>
                    <option value={"completed"}>Completed</option>
                </select>   
            </div>
            

            <Button onClick={(e) => addTask(e)}>Add</Button>
        </form>
        </div>
  )
}