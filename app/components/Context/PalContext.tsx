// PalContext.js
import React, { createContext, use, useEffect, useState } from 'react';
import { ConversationWithinContext, Project } from "@/types/global"
import { Message } from 'ai/react'
import { useSearchParams } from 'next/navigation';

interface PalContextValue {
    contextMessages: Message[];
    projectConversations: ConversationWithinContext[],
    addContextMessage: (newMessages: Message[]) => void;
    updateContextMessages: (updatedMessages: Message[]) => void;
    addProjectConversation: (newMessages: ConversationWithinContext[]) => void;
    updateProjectConversations: (updatedConversations: ConversationWithinContext[]) => void;
    updateConversationCreatedAt: (createdAt: Date, updatedMessages: Message[]) => void;
}


const getProjects = (): Project[] => {
    if (!localStorage) return [];
    const projects = localStorage.getItem('projects');
    // 按照createdAt排序，靠近现在的排前面
    return projects ? JSON.parse(projects).sort((a: Project, b: Project) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];
}


export const PalContext = createContext<PalContextValue>({
    contextMessages: [],
    projectConversations: [],
    addContextMessage: () => { },
    updateContextMessages: () => { },
    addProjectConversation: () => { },
    updateProjectConversations: () => { },
    updateConversationCreatedAt: () => { },
});

// @ts-ignore
export const PalProvider = ({ children }) => {
    const projectId = useSearchParams().get('projectId');
    const [contextMessages, setContextMessages] = useState<Message[]>([]);
    const [projectConversations, setProjectConversations] = useState<ConversationWithinContext[]>([]);
    const [projects, setProjects] = useState<Project[]>(() => getProjects());

    useEffect(() => {
        if (projectId) {
            const selectedProject = getProjects().find(project => project.id === projectId);
            if (selectedProject) {
                setContextMessages(selectedProject.context);
                setProjectConversations(selectedProject.conversations);
            }
        }
    }, [projectId]);


    const addContextMessage = (newMessages: Message[]) => {
        setContextMessages((prevMessages) => [...prevMessages, ...newMessages]);
        // 写进浏览器缓存里
        const updatedProject = projects.map(project => {
            if (project.id === projectId) {
                return {
                    ...project,
                    context: [...project.context, ...newMessages]
                }
            }
            return project;
        });
        //@ts-ignore
        localStorage.setItem('projects', JSON.stringify(updatedProject));
        setProjects(updatedProject);
    }

    const updateContextMessages = (updatedMessages: Message[]) => {
        setContextMessages(updatedMessages);
        // 写进浏览器缓存里
        const updatedProject = projects.map(project => {
            if (project.id === projectId) {
                return {
                    ...project,
                    context: updatedMessages
                }
            }
            return project;
        });
        //@ts-ignore
        localStorage.setItem('projects', JSON.stringify(updatedProject));
        setProjects(updatedProject);
    }

    const addProjectConversation = (newConversation: ConversationWithinContext[]) => {
        setProjectConversations((prevConversations) => [...prevConversations, ...newConversation]);
        // 写进浏览器缓存里
        const updatedProject = projects.map(project => {
            if (project.id === projectId) {
                return {
                    ...project,
                    conversations: [...project.conversations, ...newConversation]
                }
            }
            return project;
        });
        //@ts-ignore
        localStorage.setItem('projects', JSON.stringify(updatedProject));
        setProjects(updatedProject);
    }

    const updateProjectConversations = (updatedConversations: ConversationWithinContext[]) => {
        setProjectConversations(updatedConversations);
        // 写进浏览器缓存里
        const updatedProject = projects.map(project => {
            if (project.id === projectId) {
                return {
                    ...project,
                    conversations: updatedConversations
                }
            }
            return project;
        });
        //@ts-ignore
        localStorage.setItem('projects', JSON.stringify(updatedProject));
        setProjects(updatedProject);
    }

    const updateConversationCreatedAt = (createdAt: Date, updatedMessages: Message[]) => {
        // 去重加入流式更新的新消息
        const updatedConversations = projectConversations.map(conversation => {
            if (conversation.createdAt === createdAt) {
                let updatedMessagesList = conversation.messages.map(message => ({ ...message }));
                updatedMessages.forEach(newMessage => {
                    const existingMessageIndex = updatedMessagesList.findIndex(
                        message => message.id === newMessage.id
                    );
                    if (existingMessageIndex !== -1) {
                        const existingMessage = updatedMessagesList[existingMessageIndex];
                        if (existingMessage.content !== newMessage.content) {
                            // 如果内容不同，则替换消息
                            updatedMessagesList[existingMessageIndex] = newMessage;
                        }
                    } else {
                        // 如果没有找到具有相同 id 的消息，则添加新消息到会话消息数组中
                        updatedMessagesList.push(newMessage);
                    }
                });
                return {
                    ...conversation,
                    messages: updatedMessagesList,
                };
            }
            return conversation;
        });
        setProjectConversations(updatedConversations);
        // 写进浏览器缓存里
        const updatedProject = projects.map(project => {
            if (project.id === projectId) {
                return {
                    ...project,
                    conversations: updatedConversations
                }
            }
            return project;
        });
        //@ts-ignore
        localStorage.setItem('projects', JSON.stringify(updatedProject));
        setProjects(updatedProject);
    };

    return (
        <PalContext.Provider
            value={{
                contextMessages,
                projectConversations,
                addContextMessage,
                updateContextMessages,
                addProjectConversation,
                updateProjectConversations,
                updateConversationCreatedAt
            }}>
            {children}
        </PalContext.Provider>
    );
};
