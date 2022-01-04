import { ProjectClass } from './odk-ts/project';
import { Navigator } from './odk-ts/navigator';
import { Page } from './odk-ts/page';
import { projects, projectTypes, pages } from '../utilities/variables';

class Main {
    constructor() {

    }

    public async printPage(pageId): Promise < void > {
        return new Promise < void > (async (resolve) => {
            const page = new Page(pageId, '', '', [], pages[pageId].content, pages[pageId].images, '');

            page.printPage();

            resolve();
        })
    }
}

const mainClass = new Main;
const navClass = new Navigator;

async function printProjectsNav(): Promise < void > {
    return new Promise < void > (async (resolve) => {
        for (const projectType in projectTypes) {
            if (projectTypes.hasOwnProperty(projectType)) {
                const projects = projectTypes[projectType];

                navClass.newProjectType(projectType);

                for (let i = 0; i < projects.length; i++) {
                    const project = new ProjectClass(projects[i]);

                    navClass.newProject(project.projectIndex(), project.projectTitle(), projectType);
                }
            }
        }

        resolve();
    })
}

async function printPage(pageId: string): Promise < void > {
    return new Promise < void > (async (resolve) => {
        if (projects[pageId]) {
            const project = new ProjectClass(pageId);

            project.printProjectPage();
        } else {
            mainClass.printPage(pageId);
        }

        resolve();
    })
}

printProjectsNav()
    .then(() => {
        const navPages = document.querySelectorAll('.navPage');

        for (let i = 0; i < navPages.length; i++) {
            const navPage = navPages[i];

            navPage.addEventListener('click', () => {
                for (let i = 0; i < navPages.length; i++) {
                    const navPage = navPages[i];

                    navPage.classList.remove('active');
                }

                navPage.classList.add('active');

                printPage(navPage.id);
            })
        }
    });
