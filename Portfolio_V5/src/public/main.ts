import * as variables from '../utilities/variables';

interface IObject {
    [key: string]: any;
}

interface IProject {
    discription: string;
    image: string;
    links: {
        view: string;
        github: string;
    }
    tags: any;
    title: string;
}

const projects: IObject = variables.projects;

class ProjectClass {
    private project: IProject;

    constructor(project: string) {
        this.project = projects[project];
    }

    projectObject() {
        return this.project;
    }
}

const project = new ProjectClass('r6lookup_website');

console.log(project);
