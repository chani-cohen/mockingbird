import { SUPPORTED_PROJECT_DATA_VERSION } from "../../consts";
import { getProjectPresets, getProjectServers, isFirstVersionGreater, readProjectSettings } from "../../backend/utils";
import { checkIsGitInit, getBranches, getCurrentBranch, hasUncommittedChanges } from "./git";
import { migrateProjectData } from "./migrations";
import { listToHashmap } from "./utils";
import { ProjectData } from "../../types";
import { EVENT_KEYS } from "../../types/events";
import { socketIo } from "../app";


export const updateClientProjectData = async (projectName: string)=>{
  socketIo.emit(EVENT_KEYS.IS_LOADING_DATA)
    try {
      const isGitInit = await checkIsGitInit(projectName)
      const currentBranch = await getCurrentBranch(projectName);
      const branches = await getBranches(projectName) as string[]
      const hasDiffs = await hasUncommittedChanges(projectName);
      try {
        const projectSettings = await readProjectSettings(projectName);
  
        const dataVersion = projectSettings?.dataVersion || '0.0.5'
  
        const isProjectDataVersionSmaller = isFirstVersionGreater(SUPPORTED_PROJECT_DATA_VERSION, dataVersion)
        if(isProjectDataVersionSmaller){
          await migrateProjectData(projectName, dataVersion)
        }
      
        const servers = await getProjectServers(projectName);
  
        const serversHash = listToHashmap(servers, (server)=> server.name);
  
        const presetFolders = await getProjectPresets(projectName)
  
        const presetFoldersHash = listToHashmap(presetFolders, (item)=>item.id)
      
        const isProjectDataVersionLarger = isFirstVersionGreater(projectSettings?.dataVersion || SUPPORTED_PROJECT_DATA_VERSION, SUPPORTED_PROJECT_DATA_VERSION)
        
        const projectData: ProjectData = {
          success:true, 
          projectDataIsUnsupported: isProjectDataVersionLarger,
          projectDataInvalid: false,
          serversHash,
          projectSettings,
          currentBranch,
          hasDiffs,
          branches,
          projectName,
          presetFoldersHash,
          isGitInit,
        } 
        socketIo.emit(EVENT_KEYS.PROJECT_DATA,projectData)
        
      } catch (error) {
        socketIo.emit(EVENT_KEYS.PROJECT_DATA,{
            success: false,
            error,
            projectDataInvalid: true,
            currentBranch,
            hasDiffs,
            branches,
            isGitInit,
            projectName,
          })
      }
    } catch (error) {
      socketIo.emit(EVENT_KEYS.PROJECT_DATA,{
            success: false,
            error,
            projectDataInvalid: true,
            projectName
        })
    }
  }
  