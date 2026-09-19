export const DRINKS = ['Cafe', 'Te'];

export const normalizeDrink = (value) => {
    if (typeof value !== 'string') {
        return value;
    }

    const normalized = value
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    const drinks = {
        cafe: 'Cafe',
        te: 'Te'
    };

    return drinks[normalized] ?? value;
};