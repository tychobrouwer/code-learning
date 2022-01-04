import { ProjectClass } from './project';
import { projectTypeNames } from '../../utilities/variables';

export class Navigator {
    private projectDiv: HTMLElement = document.getElementById('projectContainer')!;;
    private firstProjectType: boolean = true;
    private firstProject: boolean = true;

    public async newProjectType(projectType: string): Promise < void > {
        return new Promise < void > (async (resolve) => {
            let active: string = '';

            if (this.firstProjectType) {
                active = 'active';

                this.firstProjectType = false;
            }

            this.projectDiv.innerHTML += `
                <div id='${projectType}' class='navObject ${active}'>
                    <div class='navTitle'>
                        <div class='navName'>
                            <p>${projectTypeNames[projectType]}</p>
                        </div>
                    </div>
                    <div class='navDropDownDiv'>

                    </div>
                </div>
            `;

            resolve();
        })
    }

    public async newProject(projectIndex: string, projectName: string, projectType: string): Promise < void > {
        return new Promise < void > (async (resolve) => {
            const projectTypeDiv: Element = document.querySelector('#' + projectType + ' .navDropDownDiv')!;
            let active: string = '';

            if (this.firstProject) {
                active = 'active';

                const project = new ProjectClass(projectIndex);
                project.printProjectPage();

                this.firstProject = false;
            }

            projectTypeDiv.innerHTML += `
            <div id='${projectIndex}' class='navDropDown navPage ${active}'>
                <div class='navTitle'>
                    <div class='navIcon'>

                    </div>
                    <div class='navName'>
                        <p>${projectName}</p>
                    </div>
                </div>
            </div>
            `;

            resolve();
        })
    }
}
