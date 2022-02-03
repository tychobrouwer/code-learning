import * as variables from '../utilities/projects';

interface IObject {
    [key: string]: any;
}

interface IProject {
    discription: string;
    image: string;
    links: {
        view?: string;
        github?: string;
    }
    tags: any;
    title: string;
}

class ProjectDisplayClass {
    private projects: Array<IProject>;
    private currentProject: number;

    constructor(startProject?: number) {
        this.projects = variables.projects;
        this.currentProject = startProject || 0;
    }

    currentProjectObject() {
        return this.projects[this.currentProject];
    }

    nextProjectObject() {
        return this.projects[this.currentProject + 1] || this.projects[0];
    }
}

const ProjectDisplay = new ProjectDisplayClass();

console.log(ProjectDisplay.currentProjectObject());
