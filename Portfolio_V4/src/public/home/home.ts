// import * as $ from 'jquery';

import * as variables from '../../utilities/variables';
import * as projectsInfo from '../../utilities/projects.json';

import * as checkSupport from '../../utilities/checkSupport';
import * as eventFunctions from '../../controllers/eventFunctions';

checkSupport.checkWebpSupport('lossy', function(feature: string, isSupported: boolean) {
    if (isSupported) {
        variables.backgroundInner?.classList.add('webp');
    } else {
        variables.backgroundInner?.classList.add('nowebp');
    }
});

let projectsNav: string = '';
let projectsDiv: string = '';
for (const project in variables.projects) {
    if (variables.projects.hasOwnProperty(project)) {
        projectsNav += '<div id="' + project + 'Nav" class="projectIndicator ' + project + '"><div class="indicator"></div></div>';
        projectsDiv += '<div id="' + project + 'Title" class="projectDiv ' + project + '"><h2>' + (projectsInfo as any)[project].title + '</h2></div>';
    }
}
variables.projectsNav.innerHTML = projectsNav;
variables.projectsDiv.innerHTML = projectsDiv;

for (const btnType in variables.navBtnTypes) {
    if (variables.navBtnTypes.hasOwnProperty(btnType)) {
        for (const btn in variables.navBtnTypes[btnType]) {
            if (variables.navBtnTypes[btnType].hasOwnProperty(btn)) {
                variables.navBtnTypes[btnType][btn].addEventListener('click', () => {
                    eventFunctions.switchWindow(variables.bodys, variables.navBtnTypes.navBtns, btn);
                    eventFunctions.switchProject(btn + 'Projects');
                    eventFunctions.projectAction(null, null, null, 'hoverIndicator', false, false);
                    eventFunctions.projectAction(null, null, null, 'activeIndicator', false, false);
                });
            }
        }
    }
}

for (const project in variables.projects) {
    if (variables.projects.hasOwnProperty(project)) {
        const projectBtn = document.getElementById(project + 'Nav');
        const projectTitle = document.getElementById(project + 'Title');

        projectBtn?.addEventListener('mouseenter', () => {
            eventFunctions.projectAction(projectBtn, projectTitle, project, 'hoverIndicator', true, true);
        });

        projectBtn?.addEventListener('click', () => {
            eventFunctions.projectAction(projectBtn, projectTitle, project, 'activeIndicator', true, false);
        });

        projectTitle?.addEventListener('mouseenter', () => {
            eventFunctions.projectAction(projectBtn, projectTitle, project, 'hoverIndicator', true, false);
        });
    }
}
