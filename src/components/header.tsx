'use client'
import React from 'react'
import { Button } from './ui/button'
import { useTaskContext } from '@/context/taskContext';

const Header = () => {
    const { handleOpenAddForm } = useTaskContext();
    return (
        <div className='container max-sm:px-4 mx-auto flex justify-between items-center py-4'>
            <h1 className="text-xl font-bold">Task Management</h1>
            <Button onClick={handleOpenAddForm}>Add Task</Button>
        </div>
    )
}

export default Header