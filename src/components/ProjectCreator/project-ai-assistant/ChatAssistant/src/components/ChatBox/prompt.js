const projectPrompt = ({steps,currentStep,projectData,ai_current_message, user_current_message}) => {
    let projectMetaData = {}
    if(projectData.languageName){
        projectMetaData.languageName = projectData.languageName;
    }
    if(projectData.frameworkName){
        projectMetaData.frameworkName = projectData.frameworkName;
    }
    if(projectData.dependencies){
        projectMetaData.dependencies = projectData.dependencies;
    }
  
    if(projectData.buildTool){
        projectMetaData.buildTool = projectData.buildTool;
    }
  
    let prompt = `
        You are helping the user create a software project. provide maximum of 3 suggestions for the current step.
        Current Step: ${steps[currentStep - 1].name}
        Current Project Data: ${JSON.stringify(projectMetaData, null, 2)}`;
    if (ai_current_message) {
        prompt += `\n\nAI's last message: ${ai_current_message}`;
    }
    if (user_current_message) {
        prompt += `\n\nUser's last message: ${user_current_message}`;
    }
    prompt += '\n Suggest the best values for the current step. Do not repeat the already filled value. Answer in maximum of 600 characters.';

    return prompt;
    
}

export default projectPrompt;