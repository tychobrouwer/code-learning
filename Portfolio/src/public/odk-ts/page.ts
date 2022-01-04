import { monthNames } from '../../utilities/variables';

export class Page {
    private pageContainer: HTMLElement;
    private pageId: string;
    private pagedate: string;
    private pageDescription: string;
    private pageTags: Array<string>;
    private pageContent: Object;
    private pageImages: Object;
    private pageLinks: Object;

    constructor(pageId: string, date: string, description: string, tags: Array<string>, content: Object, images: Object, links: Object) {
        this.pageContainer = document.getElementById('mainContainer')!;
        this.pageId = pageId;
        this.pagedate = date;
        this.pageDescription = description;
        this.pageTags = tags;
        this.pageContent = content;
        this.pageImages = images;
        this.pageLinks = links;
    }

    printPage() {
        if (this.pagedate === 'current') {
            var d = new Date();

            this.pagedate = `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
        }

        let tagHTML = '';

        for (let i = 0; i < this.pageTags.length; i++) {
            const tag = this.pageTags[i];

            tagHTML += `<div class="tag ${tag}"><p>${tag}</p></div>`;
        }

        let pageContent = '';

        for (let title in this.pageContent) {
            if (this.pageContent.hasOwnProperty(title)) {
                const alinea = this.pageContent[title];

                let imgHTML = '';
                let alineaClass = '';

                if (this.pageImages[title]) {
                    if (title.includes('image')) {
                        imgHTML += `<img class="alineaImageRow" src="./images/projects/${this.pageImages[title]}.webp" alt="${this.pageImages[title]}">`;
                    } else {
                        imgHTML = `<div class="alineaImage"><img src="./images/projects/${this.pageImages[title]}.webp" alt="${this.pageImages[title]}"></div>`;
                    }
                }

                if (title.includes('title')) {
                    title = '';
                } else {
                    title = `<h3>${title}</h3>`;
                }

                pageContent += `
                <div class="pageAlinea ${title}">
                    ${title}
                    ${imgHTML}
                    <p>
                        ${alinea}
                    </p>
                </div>
                `;
            }
        }

        let pageLinks = '';

        for (let title in this.pageLinks) {
            if (this.pageLinks.hasOwnProperty(title)) {
                const link = this.pageLinks[title];

                pageLinks += `<a href="${link}" rel="noreferrer" target="_blank"><strong>${title}</strong></a>`;
            }
        }

        this.pageContainer.innerHTML = `
        <h2 id="pageTitle">${this.pageId}</h2>
        <p id="pageDate">${this.pagedate}</p>
        <div id="pageTags">${tagHTML}</div>
        <div id="pageContent">
            <div class="pageAlinea description"><p>${this.pageDescription}</p></div>
            ${pageContent}
        </div>
        <div id="pageLinks">
            ${pageLinks}
        </div>
        `;
    }
}
