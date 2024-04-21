import React, { useEffect, useState } from 'react'
import { buttonVariants } from "@/components/ui/button"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Project } from '@/types/global'
import { nanoid } from 'ai'
import { useRouter, useSearchParams } from 'next/navigation'
 
const getProjects = (): Project[] => {
    const projects = localStorage.getItem('projects');
    const sortedProjects = projects ? JSON.parse(projects).sort((a: Project, b: Project) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];
    return sortedProjects;
}

const NavBar = () => {
    const router = useRouter()
    const [projects, setProjects] = useState<Project[]>(() => getProjects());
    const visitProjectId = useSearchParams().get('projectId');

    useEffect(() => {
        if (!visitProjectId && projects.length > 0) {
            router.replace(`/?projectId=${projects[0].id}`)    // 如果没有projectId，跳转到第一个项目，保证有projectId
        } 
        const projectsFromStorage = getProjects();
        const selectedProjectFromStorage = projectsFromStorage.find(project => project.id === visitProjectId);
        if (visitProjectId && projects.length > 0) {
            const selectedProject = projects.find(project => project.id === visitProjectId);
            if (!selectedProject) {
                // if cannot find the id in hte projects, get projects from local storage to check if the id exists
                if (selectedProjectFromStorage) {
                    setProjects(projectsFromStorage);
                } else {
                    router.replace(`/?projectId=${projects[0].id}`)    // 说明projectId不存在，跳转到第一个项目
                }
            }
        }
    }, [visitProjectId, projects]);

    // 添加新项目，生成ID，保存到浏览器缓存
    function handleAddProject() {
        const newProject: Project = {
            id: nanoid(),
            name: 'New Project',
            createdAt: new Date(),
            lastEditedAt: new Date(),
            context: [],
            conversations: []
        }
        const updatedProjects = [newProject, ...getProjects()];
        //@ts-ignore
        localStorage.setItem('projects', JSON.stringify(updatedProjects))
        router.replace(`/?projectId=${newProject.id}`)
    }

    // 删除项目，保存到浏览器缓存
    function handleDeleteProject(id: string) {
        return () => {
            const nowProjects = getProjects();
            const newProjects = nowProjects.filter(project => project.id !== id)
            //@ts-ignore
            localStorage.setItem('projects', JSON.stringify(newProjects))
            setProjects(newProjects)
            if (visitProjectId === id && newProjects.length > 0) {
                router.replace(`/?projectId=${newProjects[0].id}`)
            }
        }
    }

    return (
        <div>
            <div className='flex flex-col gap-2'>
                <Button onClick={handleAddProject} >Add new project</Button>
                {projects.map(project => (
                    <div className={`flex justify-between ${(visitProjectId === project.id || (!visitProjectId && projects[0].id === project.id)) ? 'bg-gray-200' : ''}`} key={project.id}>
                    <Link className={buttonVariants({ variant: "outline" })} href={`/?projectId=${project.id}`}>{project.name}</Link>
                    <Button onClick={handleDeleteProject(project.id)}>Delete</Button>
                </div>
                ))}
            </div>
        </div>
    )
}

export default NavBar