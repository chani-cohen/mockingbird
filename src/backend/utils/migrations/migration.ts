import { isFirstVersionGreater } from "../general";
import { migrationV0_0_9 } from "./0_0_9/migrateToV0_0_9";



export const migrationScripts = [
    {
      version: '0.0.9',
      script: migrationV0_0_9
    }
]



export const migrateProjectData = async (projectName: string, projectVersion: string)=>{
    let updatedVersion = projectVersion;
  
    migrationScripts.sort((a,b)=>{
      return isFirstVersionGreater(a.version, b.version) ? 1 : -1
    })
  
    for(const item of migrationScripts){
      if(isFirstVersionGreater(item.version, updatedVersion)){
        await item.script(projectName);
        updatedVersion = item.version
      }
    }
    
  }
  