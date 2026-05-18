import routingConfig from '../shared/conversion-routing.json';

function normalize(value) {
    return (value || '').toLowerCase();
}

function matchesAny(values, actual) {
    return values.includes(actual);
}

function matchesOptional(values, actual) {
    return values.length === 0 || values.includes(actual);
}

function routeControlIsActive(route, controls) {
    if (!route.control) return true;
    if (route.control === 'ocr') return controls?.ocr?.enabled === true;
    return false;
}

export function resolveConversionRoute({ inputGroup, inputExt, outputGroup, outputExt, controls = {} }) {
    const normalized = {
        inputGroup: normalize(inputGroup),
        inputExt: normalize(inputExt),
        outputGroup: normalize(outputGroup),
        outputExt: normalize(outputExt),
    };

    const matches = route => (
        routeControlIsActive(route, controls)
        && matchesAny(route.inputGroup, normalized.inputGroup)
        && matchesOptional(route.inputExt || [], normalized.inputExt)
        && matchesAny(route.outputGroup, normalized.outputGroup)
        && matchesOptional(route.outputExt || [], normalized.outputExt)
    );

    return routingConfig.routes.find(route => route.control && matches(route))
        || routingConfig.routes.find(route => !route.control && matches(route))
        || null;
}

export function getRequiredPacksForConversion(routeRequest) {
    return resolveConversionRoute(routeRequest)?.packs || [];
}

export function getDependencyPack(id) {
    return routingConfig.packs[id] || null;
}

export function getDependencyPacks(ids) {
    return ids.map(getDependencyPack).filter(Boolean);
}

export { routingConfig };
