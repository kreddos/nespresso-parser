import axios from "axios";
import {get} from 'lodash';
import {HTMLElement, parse} from "node-html-parser";

function getPrice(element: HTMLElement) {
    const priceNode = element.querySelector('[itemprop=price]');
    const groupPriceNode = element.querySelector('.price');

    let price = '';
    if (priceNode) {
        price = priceNode.attributes.content;
    } else if (groupPriceNode) {
        price = groupPriceNode.text;
    }

    return price;
}

class NespressoItem {
    constructor(
        public name: string,
        public description: string,
        public price: string,
        public img?: string,
        public intensity?: string,
        public group?: string,
    ) {
    }

    static fromHtmlNode(element: HTMLElement, group?: string) {
        const nameNode = element.querySelector('[itemprop=name]');
        const photoNode = element.querySelector('.photo.image');
        const descriptionNode = element.querySelector('[itemprop=description]');
        const countNode = element.querySelector('.tooltip.count')

        return new NespressoItem(
            get(nameNode, 'text', ''),
            get(descriptionNode, 'text', ''),
            getPrice(element),
            get(photoNode, 'attributes.src', ''),
            get(countNode, 'text', ''),
            group
        );
    }
}

export async function parseNespresso() {
    const {data} = await axios.get('https://www.nespresso.com/ru/ru/coffee-capsules/original');
    const root = parse(data);

    if (!root.valid || !(root instanceof HTMLElement)) {
        return;
    }

    const list = root.querySelector('ol.products.list.items.product-items').querySelectorAll('li');

    let group = '';
    return list.reduce((acc, item) => {
        if (item.classNames.includes('product-item-meta')) {
            group = item.querySelector('.product-item-title').text;
            return acc;
        }

        const nespressoItem = NespressoItem.fromHtmlNode(item, group);
        return [...acc, nespressoItem];
    }, [] as NespressoItem[]);
}
