import * as variables from '../utilities/variables';
// import * as projectsInfo from '../utilities/projects.json';

export const switchWindow = (bodys: any, btns: any, btn: string) => {
    let afterBefore: boolean = false;

    for (const body in bodys) {
        if (bodys.hasOwnProperty(body)) {
            btns[body]?.classList.remove('activeBtn');
            bodys[body]?.classList.remove('activeBody');
            bodys[body]?.classList.remove('afterActiveBody');
            bodys[body]?.classList.remove('beforeActiveBody');

            if (bodys[btn] !== bodys[body] && afterBefore === false) {
                bodys[body]?.classList.add('beforeActiveBody');
            } else if (bodys[btn] === bodys[body]) {
                afterBefore = true;
                btns[btn]?.classList.add('activeBtn');
                bodys[btn]?.classList.add('activeBody');
            } else if (bodys[btn] !== bodys[body] && afterBefore === true) {
                bodys[body]?.classList.add('afterActiveBody');
            }
        }
    }
};

export const switchProject = (projectType: any) => {
    for (const project in variables.projects) {
        if (variables.projects.hasOwnProperty(project)) {
            const projectNav = document.getElementById(project + 'Nav');
            const projectDiv = document.getElementById(project + 'Title');

            if (variables.projectsTypes[projectType] && variables.projectsTypes[projectType][project]) {
                projectNav?.classList.add('active');
                projectDiv?.classList.add('active');
            } else {
                projectNav?.classList.remove('active');
                projectDiv?.classList.remove('active');
            }
        }
    }

    variables.projectsDiv.removeAttribute('style');
};

export const projectAction = (btn: any, title: any, project: any, mode: string, add: boolean, isBtn: boolean) => {
    const projectsNav = document.querySelectorAll('.projectIndicator');
    const projectsDiv = document.querySelectorAll('.projectDiv');

    for (let i = 0; i < projectsNav.length; i++) {
        const projectNav = projectsNav[i];
        const projectDiv = projectsDiv[i];

        projectNav?.classList.remove(mode);
        projectDiv?.classList.remove(mode);

        if (projectNav === btn && add) {
            if (isBtn) {
                let index: any;

                if (variables.projectsTypes.workProjects[project]) {
                    index = parseInt(variables.projectsTypes.workProjects[project]);
                } else if (variables.projectsTypes.techProjects[project]) {
                    index = parseInt(variables.projectsTypes.techProjects[project]);
                }

                const margin = window.innerHeight / 2 - index * 140 - 140;
                variables.projectsDiv.setAttribute('style', '--margin-top: ' + margin + 'px');
            }

            projectNav?.classList.add(mode);
            projectDiv?.classList.add(mode);
        }
    }
};
