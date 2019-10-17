class Model {
    constructor() {
        this.version = '4.0.0';
        this.package = 'com.armanco.supersonic_calculator';
        this.homepage = 'https://arman.co.com/';
        this.api = 'https://arman.co.com/api/applist_formula.php';
        this.bannerId = 'ca-app-pub-4301546764905932/1972290558';
        this.interstitialId = 'ca-app-pub-4301546764905932/2175023428';
        this.title = 'Supersonic Calculator';
        this.subTitle = 'Advanced Calculator';
        this.description = 'This app calculates properties of supersonic flows in different cases.';
        this.page = 1;
        this.category = 0;

        this.categoriesTitles = [];
        this.categoriesThumbs = [];

        this.categoryTitles = [
            []
        ];

        this.calculatorsTitles = ['Isentropic Flow', 'Normal Shock', 'Oblique Shock', 'Expansion Fan'];
        this.calculatorsThumbs = ['IF', 'NS', 'OS', 'EF'];

        this.inputsTitles = [
            ['Mach Number'],
            ['Mach Number'],
            ['Mach Number', 'Angle'],
            ['Mach Number', 'Angle']
        ];

        this.inputsSigns = [
            ['M'],
            ['M'],
            ['M', 'Theta-deg'],
            ['M', 'Theta-deg']
        ];

        this.outputsTitles = [
            ['Total Pressure / Static Pressure', 'Total Temprature / Static Temprature', 'Total Density / Static Density', 'a/as'],
            ['Downstream Pressure / Upstream Pressure', 'Downstream Density / Upstream Density', 'Downstream Temprature / Upstream Temprature', 'Downstream Mach Number'],
            ['Shock Angle (Beta-deg)', 'Downstream Pressure / Upstream Pressure', 'Downstream Density / Upstream Density', 'Downstream Temprature / Upstream Temprature', 'Downstream Mach Number'],
            ['Upstream Prandtl-Meyer function (deg)', 'Downstream Prandtl-Meyer function (deg)', 'Downstream Mach Number']
        ];

        this.outputsSigns = [
            ['P0/P', 'T0/T', 'ρ0/ρ', 'A/A*'],
            ['P2/P1', 'ρ2/ρ1', 'T2/T1', 'M2'],
            ['β (deg)', 'P2/P1', 'ρ2/ρ1', 'T2/T1', 'M2'],
            ['ϑ1 (deg)', 'ϑ2 (deg)', 'M2']
        ];

        this.inputs = {};
        this.outputs = {};
        this.calculator = 0;
    }

    calculate() {
        let gamma = 1.4;
        if (this.calculator === 0) {
            let m = this.inputs[0];
            let pt = Math.pow(Math.pow(m, 2) * (gamma - 1) / 2 + 1, gamma / (gamma - 1));
            let tt = Math.pow(m, 2) * (gamma - 1) / 2 + 1;
            let rot = Math.pow(Math.pow(m, 2) * (gamma - 1) / 2 + 1, 1 / (gamma - 1));
            let as = Math.pow(Math.pow(m, 2) * (gamma - 1) / (gamma + 1) + 2 / (gamma + 1), (gamma + 1) / (2 * (gamma - 1))) / m;
            this.outputs = [pt, tt, rot, as];
        } else if (this.calculator === 1) {
            let m = this.inputs[0];
            let p2p1 = 1 + 2 * gamma * (Math.pow(m, 2) - 1) / (gamma + 1);
            let ro2ro1 = (gamma + 1) * (Math.pow(m, 2)) / (2 + (gamma - 1) * (Math.pow(m, 2)));
            let t2t1 = p2p1 / ro2ro1;
            let m2 = Math.sqrt((1 + (gamma - 1) * (Math.pow(m, 2)) / 2) / (gamma * (Math.pow(m, 2)) - (gamma - 1) / 2));
            this.outputs = [p2p1, ro2ro1, t2t1, m2];
        } else if (this.calculator === 2) {
            let m = this.inputs[0];
            let theta = this.inputs[1];
            let theta_rad = theta * Math.PI / 180;
            let lambda = Math.sqrt(Math.pow(Math.pow(m, 2) - 1, 2) - 3 * (1 + (gamma - 1) * Math.pow(m, 2) / 2) * (1 + (gamma + 1) * Math.pow(m, 2) / 2) * Math.pow(Math.tan(theta_rad), 2));
            let x = (Math.pow(Math.pow(m, 2) - 1, 3) - 9 * (1 + (gamma - 1) * Math.pow(m, 2) / 2) * (1 + (gamma - 1) * Math.pow(m, 2) / 2 + (gamma + 1) * Math.pow(m, 4) / 4) * Math.pow(Math.tan(theta_rad), 2)) / (Math.pow(lambda, 3));
            let beta = Math.atan((Math.pow(m, 2) - 1 + 2 * lambda * Math.cos((4 * Math.PI + Math.acos(x)) / 3)) / (3 * (1 + (gamma - 1) * Math.pow(m, 2) / 2) * Math.tan(theta_rad))) * 180 / Math.PI;
            let mn = m * Math.sin(beta * Math.PI / 180);
            let p2p1 = 1 + 2 * gamma * (Math.pow(mn, 2) - 1) / (gamma + 1);
            let ro2ro1 = (gamma + 1) * (Math.pow(mn, 2)) / (2 + (gamma - 1) * (Math.pow(mn, 2)));
            let t2t1 = p2p1 / ro2ro1;
            let m2 = Math.sqrt((1 + (gamma - 1) * (Math.pow(mn, 2)) / 2) / (gamma * (Math.pow(mn, 2)) - (gamma - 1) / 2)) / Math.sin((beta - theta) * Math.PI / 180);
            this.outputs = [beta, p2p1, ro2ro1, t2t1, m2];
        } else if (this.calculator === 3) {
            let m = this.inputs[0];
            let theta = this.inputs[1];
            let nu1 = (Math.sqrt((gamma + 1) / (gamma - 1)) * Math.atan(Math.sqrt((gamma - 1) * (Math.pow(m, 2) - 1) / (gamma + 1))) - Math.atan(Math.sqrt(Math.pow(m, 2) - 1))) * 180 / Math.PI;
            let nu2 = nu1 + theta;
            let error = 10;
            let m_temp, nu_temp, m2;
            for (let i = 1; i <= 100; i++) {
                m_temp = 1 + i / 10;
                nu_temp = (Math.sqrt((gamma + 1) / (gamma - 1)) * Math.atan(Math.sqrt((gamma - 1) * (Math.pow(m_temp, 2) - 1) / (gamma + 1))) - Math.atan(Math.sqrt(Math.pow(m_temp, 2) - 1))) * 180 / Math.PI;
                if (Math.abs(nu_temp - nu2) < error) {
                    m2 = m_temp;
                    error = Math.abs(nu_temp - nu2);
                }
            }
            this.outputs = [nu1, nu2, m2];
        }
    };

    changeCategory(number) {
        this.category = number;
    }

    changeCalculator(number) {
        this.calculator = number;
        this.inputs = [];
        this.outputs = [];
    }

    changePage(page) {
        this.page = page;
    }

    getApps() {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', this.api + '?p=' + this.package);
        xhr.send();
        xhr.onload = () => {
            this.apps = JSON.parse(xhr.response);
        };
    }


};

class View {
    constructor() {
        this.menu = document.getElementById('menu');
        this.items = document.getElementById('items');
        this.apps = document.getElementById('apps');
        this.categoryTitle = document.getElementById('page3-h1');
        this.calculatorTitle = document.getElementById('page2-h1');
        this.calculatorImage = document.getElementById('page2-image');
        this.inputs = document.getElementById('inputs');
        this.outputs = document.getElementById('outputs');
        this.title = document.getElementById('title');
        this.subTitle = document.getElementById('subtitle');
        this.description = document.getElementById('description');
        this.armanco = document.getElementById('armanco');
        this.versions = Array.from(document.getElementsByClassName('version'));
        this.backs = Array.from(document.getElementsByClassName('back'));
    }

    openLink(link) {
        window.open(link, '_system');
    }

    changePage(page_number) {
        window.location.hash = '#page' + page_number;
        for (let i = 1; i <= 5; i++) {
            if (i === page_number) {
                document.getElementById('page' + i).style.display = 'block';
            } else {
                document.getElementById('page' + i).style.display = 'none';
            }
        }
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    addMenuItem(id, thumb, title) {
        let element = `<table id="${id}" class="property" cellpadding="0" cellspacing="0"><tr><td class="property-thumb">${thumb}</td><td class="property-name">${title}</td></tr></table>`;
        this.menu.insertAdjacentHTML("beforeend", element);
    }

    addMenuItemCalculator(id, thumb, title) {
        let element = `<table id="${id}" class="property2" cellpadding="0" cellspacing="0"><tr><td class="property2-thumb">${thumb}</td><td class="property2-name">${title}</td></tr></table>`;
        this.menu.insertAdjacentHTML("beforeend", element);
    }

    addMenuItemMute(id, thumb, title) {
        let element = `<table id="${id}" class="about" cellpadding="0" cellspacing="0"><tr><td class="about-thumb">${thumb}</td><td class="about-name">${title}</td></tr></table>`;
        this.menu.insertAdjacentHTML("beforeend", element);
    }

    addMenuItemApp(item) {
        let element = `<table class="app" cellpadding="0" cellspacing="0" id="app${item.name}"><tr><td class="app-thumb" style="background-image: url('${item.image}')"></td><td class="app-detail"><span class="app-name">${item.name}</span><br><span class="app-price">${item.price}</span><br><span class="app-description">${item.description}</span></td></tr></table>`;
        this.apps.insertAdjacentHTML("beforeend", element);
    }

    addFormula(id, src) {
        let element = `<img src="${src}" style="max-width:100%"><br>`;
        let place = Array.from(document.getElementById(id).getElementsByClassName('identity-formula'));
        place[0].insertAdjacentHTML("beforeend", element);
    }

    addItem(id, title) {
        let element = `<table id="${id}" class="identity" cellpadding="0" cellspacing="0"><tr><td class="identity-title">${title}</td></tr><tr><td class="identity-formula"></td></tr></table>`;
        this.items.insertAdjacentHTML("beforeend", element);
    }

    addInput(i, title, sign) {
        let element = `<table class="input" cellpadding="0" cellspacing="0"><tr><td class="input-lable">${title}<br><span class="input-sign">${sign}</span></td><td class="input-value"><input id="input${i}" type="number" step="0.0000000001" min="-9999999999999999999999999999999999999999" max="9999999999999999999999999999999999999999"></td></tr></table>`;
        this.inputs.insertAdjacentHTML("beforeend", element);
    }

    addOutput(i, title, sign) {
        let element = `<table class="converted" cellpadding="0" cellspacing="0"><tr><td class="converted-unit-fa">${title}</td></tr><tr><td class="converted-unit">${sign}</td></tr><tr><td class="converted-value"><span id="output${i}"></span></td></tr></table>`;
        this.outputs.insertAdjacentHTML("beforeend", element);
    }

    changeCalculatorImage(i) {
        this.calculatorImage.style.background = `url('images/calculators/${i + 1}.png') no-repeat center`;
        this.calculatorImage.style.backgroundSize = 'contain';
    }

    changeTitle(title) {
        this.title.innerHTML = title;
    }

    changeSubTitle(subTitle) {
        this.subTitle.innerHTML = subTitle;
    }

    changeCategoryTitle(categoryTitle) {
        this.categoryTitle.innerHTML = categoryTitle;
    }

    changeCalculatorTitle(calculatorTitle) {
        this.calculatorTitle.innerHTML = calculatorTitle;
    }

    changeDescription(description) {
        this.description.innerHTML = description;
    }

    changeOutputs(outputs) {
        for (let key in outputs) {
            document.getElementById(`output${key}`).innerHTML = outputs[key];
        }
    }

    changeVersion(version) {
        this.versions.forEach(element => {
            element.innerHTML = version;
        });
    }

    deleteChild(id) {
        let place = document.getElementById(id);
        place.innerHTML = "";
    }

};

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
        this.ready();
    }

    init() {
        window.addEventListener("load", () => {
            this.view.changeTitle(this.model.title);
            this.view.changeSubTitle(this.model.subTitle);
            this.view.changeVersion(this.model.version);
            this.view.changeDescription(this.model.description);
            this.model.getApps();
            for (let i = 0; i < this.model.calculatorsTitles.length; i++) {
                let thumb = this.model.calculatorsThumbs[i];
                let title = this.model.calculatorsTitles[i];
                this.addMenuItemCalculator(i, thumb, title);
            }
            for (let i = 0; i < this.model.categoriesTitles.length; i++) {
                let thumb = this.model.categoriesThumbs[i];
                let title = this.model.categoriesTitles[i];
                this.addMenuItem(i, thumb, title);
            }
            this.addMenuItemMute('menua', 'apps', 'Similar Apps', 4);
            this.addMenuItemMute('menui', 'info', 'About', 5);
            document.addEventListener("backbutton", e => {
                if (this.model.page !== 1) {
                    e.preventDefault();
                    this.changePage(1);
                } else {
                    navigator.app.exitApp();
                }
            }, false);
            this.view.backs.forEach(element => {
                element.addEventListener("click", () => {
                    this.changePage(1);
                });
            });
            this.view.armanco.addEventListener("click", () => {
                this.view.openLink(this.model.homepage);
            });

        }, false);

    }

    ready() {
        document.addEventListener("deviceready", () => {
            admob.banner.config({
                id: this.model.bannerId,
                isTesting: false,
                autoShow: true
            });
            admob.banner.prepare();
            admob.interstitial.config({
                id: this.model.interstitialId,
                isTesting: false,
                autoShow: true
            });
        }, false);
    }

    changePage(page) {
        this.model.changePage(page);
        this.view.changePage(page);
    }

    async addMenuItemCalculator(i, thumb, title) {
        let id = `menucal${i}`;
        await this.view.addMenuItemCalculator(id, thumb, title);
        document.getElementById(id).addEventListener("click", async () => {
            await this.view.deleteChild('inputs');
            await this.view.deleteChild('outputs');
            this.model.changeCalculator(i);
            this.view.changeCalculatorTitle(title);
            this.view.changeCalculatorImage(i);
            for (let j = 0; j < this.model.outputsTitles[i].length; j++) {
                await this.view.addOutput(j, this.model.outputsTitles[i][j], this.model.outputsSigns[i][j]);
            }
            for (let j = 0; j < this.model.inputsTitles[i].length; j++) {
                await this.view.addInput(j, this.model.inputsTitles[i][j], this.model.inputsSigns[i][j]);
                let element = document.getElementById(`input${j}`);
                element.addEventListener("input", async () => {
                    this.model.inputs[j] = await element.value;
                    await this.model.calculate();
                    this.view.changeOutputs(this.model.outputs);
                });
            }
            this.changePage(2);
        });
    }

    async addMenuItem(i, thumb, title) {
        let id = `menu${i}`;
        await this.view.addMenuItem(id, thumb, title);
        document.getElementById(id).addEventListener("click", async () => {
            this.model.changeCategory(i);
            this.view.changeCategoryTitle(title);
            await this.view.deleteChild('items');
            for (let j = 0; j < this.model.categoryTitles[i].length; j++) {
                await this.view.addItem(`item${j}`, this.model.categoryTitles[i][j]);
                this.view.addFormula(`item${j}`, `images\\${i + 1}\\${j + 1}.png`);
            }
            this.changePage(3);
        });
    }

    async addMenuItemMute(id, thumb, title, page) {
        await this.view.addMenuItemMute(id, thumb, title);
        document.getElementById(id).addEventListener("click", async () => {
            if (page === 4) {
                await this.view.deleteChild('apps');
                this.model.apps.forEach(async element => {
                    await this.view.addMenuItemApp(element);
                    document.getElementById(`app${element.name}`).addEventListener("click", () => {
                        this.view.openLink(element.url);
                    });
                });
            }
            this.changePage(page);
            admob.interstitial.prepare();
        });
    }
};

const app = new Controller(new Model(), new View());